// services/auth.service.js
import crypto from "crypto";
import User from "../models/User.model.js";
import ActivityLog from "../models/ActivityLog.model.js";
import AppError from "../utils/AppError.js";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

/**
 * Login user
 */
export const loginUser = async ({ email, password, req }) => {
  // 1. Find user with password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // 2. Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  // 3. Check if active
  if (!user.isActive) {
    throw new AppError("Your account has been deactivated. Contact admin.", 403);
  }

  // 4. Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // 5. Log activity
  await ActivityLog.log({
    action: "LOGIN",
    performedBy: user._id,
    description: `${user.name} logged in`,
    req,
  });

  return user;
};

/**
 * Logout user
 */
export const logoutUser = async (userId, req) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });

  await ActivityLog.log({
    action: "LOGOUT",
    performedBy: userId,
    description: "User logged out",
    req,
  });
};

/**
 * Refresh access token using refresh token cookie
 */
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("No refresh token provided", 401);
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Find user
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw new AppError("User not found or inactive", 401);
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  return { newAccessToken, newRefreshToken, user };
};

/**
 * Forgot password — generate reset token
 */
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if email exists
    throw new AppError("If this email exists, a reset link has been sent.", 200);
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  return { user, resetToken };
};

/**
 * Reset password using token
 */
export const resetPassword = async ({ token, password }) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Reset token is invalid or has expired", 400);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return user;
};

/**
 * Change password (authenticated user)
 */
export const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError("Current password is incorrect", 400);
  }

  user.password = newPassword;
  await user.save();

  return user;
};
