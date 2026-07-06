// routes/user.routes.js
import express from "express";
import * as userController from "../controllers/user.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createUserValidator, updateUserValidator } from "../validators/user.validator.js";

const router = express.Router();

router.use(protect);

router.get("/stats", restrictTo("Admin"), userController.getUserStats);
router.get("/", restrictTo("Admin"), userController.getAllUsers);
router.get("/:id", restrictTo("Admin"), userController.getUserById);
router.post("/", restrictTo("Admin"), createUserValidator, validate, userController.createUser);
router.put("/:id", restrictTo("Admin"), updateUserValidator, validate, userController.updateUser);
router.patch("/:id/toggle-status", restrictTo("Admin"), userController.toggleUserStatus);
router.delete("/:id", restrictTo("Admin"), userController.deleteUser);

export default router;
