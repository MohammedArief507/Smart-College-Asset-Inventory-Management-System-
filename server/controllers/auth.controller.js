// controllers/auth.controller.js
import * as authService from "../services/auth.service.js";
import { sendTokenResponse } from "../utils/jwt.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * POST /api/v1/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.loginUser({ email, password, req });

    sendTokenResponse(res, user, 200, "Login successful");
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id, req);

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    sendSuccess(res, { message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/refresh-token
 */
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    const { newAccessToken, newRefreshToken, user } = await authService.refreshAccessToken(token);

    // Set new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, {
      message: "Token refreshed",
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    sendSuccess(res, {
      message: "Profile fetched successfully",
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { user, resetToken } = await authService.forgotPassword(email);

    // In production: send email with reset link
    // For now: return token in response (dev only)
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    console.log(`🔑 Password reset URL (dev only): ${resetURL}`);

    sendSuccess(res, {
      message: "Password reset link sent to email",
      // Remove below in production!
      ...(process.env.NODE_ENV === "development" && { data: { resetURL } }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/auth/reset-password/:token
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await authService.resetPassword({ token, password });

    sendTokenResponse(res, user, 200, "Password reset successful");
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/auth/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword({
      userId: req.user._id,
      currentPassword,
      newPassword,
    });

    sendSuccess(res, { message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
