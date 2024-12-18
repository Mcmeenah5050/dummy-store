import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

export const verifyAuth =
  (roles = []) =>
  async (req, res, next) => {
    if (!Array.isArray(roles)) roles = [roles]; //ensure roles in an array
    const { authorization: token } = req.headers;
    if (!token) {
      return next(createHttpError(403, "You are unauthenticated, pls login"));
    }
    if (!token.startsWith("Bearer")) {
      return next(createHttpError(401, "Token format is invalid"));
    }
    const tokenString = token.split(" ")[1];
    try {
      const decodedToken = jwt.verify(tokenString, process.env.JWT_SECRET_KEY);
      if (!roles.includes(decodedToken.role)) {
        return next(
          createHttpError(403, "Unauthorized, user role not defined")
        );
      }
      req.user = decodedToken; //our logged in user
      next();
    } catch (error) {
      return next(createHttpError(401, "Session expired, pls login"));
    }
  };

export const Roles = {
  User: ["user"],
  Admin: ["admin"],
  All: ["user", "admin"],
};
