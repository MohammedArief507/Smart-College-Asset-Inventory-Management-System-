// validators/user.validator.js
import { body, query } from "express-validator";
import { ALL_ROLES } from "../constants/roles.js";

export const createUserValidator = [
  body("name").trim().notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2-50 characters"),

  body("email").trim().notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("password").notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("role").notEmpty().withMessage("Role is required")
    .isIn(ALL_ROLES).withMessage("Invalid role"),

  body("phone").optional().trim(),
  body("department").optional().isMongoId().withMessage("Invalid department ID"),
  body("laboratory").optional().isMongoId().withMessage("Invalid laboratory ID"),
];

export const updateUserValidator = [
  body("name").optional().trim()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2-50 characters"),

  body("email").optional().trim().isEmail().withMessage("Invalid email"),

  body("role").optional().isIn(ALL_ROLES).withMessage("Invalid role"),

  body("phone").optional().trim(),
  body("department").optional().isMongoId().withMessage("Invalid department ID"),
  body("laboratory").optional().isMongoId().withMessage("Invalid laboratory ID"),
];
