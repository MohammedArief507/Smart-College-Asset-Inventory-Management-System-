// routes/auth.routes.js
import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} from "../validators/auth.validator.js";

const router = express.Router();

// Public Routes
router.post("/login", loginValidator, validate, authController.login);
router.post("/forgot-password", forgotPasswordValidator, validate, authController.forgotPassword);
router.patch("/reset-password/:token", resetPasswordValidator, validate, authController.resetPassword);
router.post("/refresh-token", authController.refreshToken);

// Protected Routes
router.use(protect);
router.post("/logout", authController.logout);
router.get("/me", authController.getMe);
router.patch("/change-password", changePasswordValidator, validate, authController.changePassword);

export default router;

