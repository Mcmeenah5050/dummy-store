import User from "../models/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import crypto from "crypto";
import mailService from "../config/mailService.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../config/generateToken.js";
import { uploadImage } from "../config/cloudinary.js";
import { console } from "inspector";

const cookieOptions = {
  httpOnly: true, //prevent client-side access to the cookie
  secure: process.env.NODE_ENV === "production", //HTTPS only in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 60 * 60 * 1000, //cookie is valid for 1hr
  path: "/", //cookie is accessible on all paths
};

export const signUp = async (req, res, next) => {
  const { username, email, password, fullname } = req.body;
  try {
    if (!username || !email || !password || !fullname) {
      return next(createHttpError(400, "All fields are required"));
    }
    //check for existing user
    const [existingUserName, existingEmail] = await Promise.all([
      User.findOne({ username }),
      User.findOne({ email: email }),
    ]);
    if (existingUserName) {
      return next(createHttpError(409, "Username already exist!"));
    }

    if (existingEmail) {
      return next(createHttpError(409, "Email already exists"));
    }

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      fullname,
    });

    const verifyToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verifyToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; //24hours

    //save user to database
    await user.save();

    // send verify email link
    // const verifyEmailLink = `${process.env.CLIENT_URL}/account/verify-email/${user._id}/${user.verificationToken}`;
    // await mailService({
    //   from: process.env.EMAIL,
    //   to: user.email,
    //   username: user.fullname,
    //   subject: "Email verification",
    //   text: `Welcome to Instapics! Click the link below to verify your email: ${verifyEmailLink}. Link expires in 24 hours.`,
    //   btnText: "Verify",
    //   link: verifyEmailLink,
    // });

    //generate tokens
    const accessToken = generateAccessToken(user._id, user.role); //save to localStorage
    const refreshToken = generateRefreshToken(user._id, user.role); //save to cookie

    //set refreshToken in HTTP-only
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return next(createHttpError(400, "Username and password arerequired"));
    }
    const user = await User.findOne({ username: username }).select("+password");
    if (!user) {
      return next(createHttpError(400, "Account not found"));
    }

    //check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createHttpError(401, "Invalid credentials"));
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res
      .status(200)
      .json({ success: true, message: "Logged in successfully", accessToken });
  } catch (error) {
    next(error);
  }
};

export const authenticateUser = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "Account not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const sendVerifyEmail = async (req, res, next) => {
  const { id: userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "Account not found"));
    }
    const verifyToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verifyToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; //24hours

    //save user to database
    await user.save();

    // send verify email link
    const verifyEmailLink = `${process.env.CLIENT_URL}/account/verify-email/${user._id}/${user.verificationToken}`;
    await mailService({
      from: process.env.EMAIL,
      to: user.email,
      username: user.fullname,
      subject: "Email verification",
      text: `Welcome to Instapics! Click the link below to verify your email: ${verifyEmailLink}. Link expires in 24 hours.`,
      btnText: "Verify",
      link: verifyEmailLink,
    });

    res.status(200).json({
      success: true,
      message: "Email verification successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { userId, verificationToken } = req.params;
  try {
    if (!userId || !verificationToken) {
      return next(400, "User Id or verification token is missing");
    }
    const user = await User.findOne({
      _id: userId,
      verificationToken: verificationToken,
    }).select("+verificationToken +verificationTokenExpires");
    if (!user) {
      return next(createHttpError(404, "Verification token not found"));
    }
    if (user.verificationTokenExpires < Date.now()) {
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();
      return next(
        createHttpError(
          401,
          "Verification link has expired, pls request a new one"
        )
      );
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { id: userId } = req.user;
  const { username, email, fullname, profilePicture, bio } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    if (user._id.toString() !== userId) {
      return next(createHttpError(403, "Unauthorized to perform this request"));
    }

    //upload image to cloudinary
    let profilePic;
    if (profilePicture) {
      try {
        const uploadedPhoto = await uploadImage(profilePicture);
        profilePic = uploadedPhoto;
      } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Failed to upload image"));
      }
    }
    user.username = username;
    user.email = email;
    user.bio = bio;
    user.fullname = fullname;
    user.profilePicture = profilePic;
    await user.save();
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
