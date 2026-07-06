// middlewares/auth.middleware.js
import { verifyAccessToken } from "../utils/jwt.js";
import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";

/**
 * Protect — verifies JWT and attaches user to req
 */
export const protect = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("You are not logged in. Please log in to continue.", 401));
    }

    // 2. Verify token
    const decoded = verifyAccessToken(token);

    // 3. Check if user still exists
    const user = await User.findById(decoded.id).select("-password -refreshToken");

    if (!user) {
      return next(new AppError("User no longer exists.", 401));
    }

    // 4. Check if user is active
    if (!user.isActive) {
      return next(new AppError("Your account has been deactivated. Contact admin.", 403));
    }

    // 5. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Restrict — role-based access control
 * Usage: restrictTo("Admin", "Admin Manager")
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Access denied. Required roles: ${roles.join(", ")}`, 403)
      );
    }
    next();
  };
};
