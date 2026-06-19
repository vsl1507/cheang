import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/user.model.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log("token");
  console.log(token);
  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));
    req.user = user;
    next();
  });
};

export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(errorHandler(401, "Unauthorized"));
    }
    const user = await User.findById(req.user.id);
    if (!user || !user.admin) {
      return next(errorHandler(403, "Access denied. Admin role required."));
    }
    next();
  } catch (error) {
    next(error);
  }
};

