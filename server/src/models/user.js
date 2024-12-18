import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true, //no duplicate of username in the database,
      required: [true, "Username is required"],
      trim: true,
    },
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
    },
    password: {
      type: String,
      unique: true,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
      select: false, //prevents this field from being sent as part of a response
    },

    role: {
      type: String,
      enum: ["user", "admin"], //enum are like predefinded values that should only be accepted
      default: "user",
    },
    //access token is for a shorter period like some min (it gets expires) while refresh token is for longer period like a day or more
    token: {
      type: String,
      select: false,
    },
    profilePicture: {
      type: String,
    },
  },
  {
    timestamps: true, //adds createdAt and updatedAt fields to the doc
  }
);

const User = model("User", userSchema);

export default User;
