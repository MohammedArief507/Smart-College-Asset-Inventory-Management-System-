// validators/request.validator.js
import { body } from "express-validator";

export const createRequestValidator = [
  body("asset").notEmpty().withMessage("Asset is required")
    .isMongoId().withMessage("Invalid asset ID"),
  body("quantityRequested").notEmpty().withMessage("Quantity is required")
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("purpose").trim().notEmpty().withMessage("Purpose is required")
    .isLength({ max: 500 }).withMessage("Purpose cannot exceed 500 characters"),
  body("requiredFrom").optional().isISO8601().withMessage("Invalid date"),
  body("requiredUntil").optional().isISO8601().withMessage("Invalid date"),
];

export const hodActionValidator = [
  body("action").notEmpty().withMessage("Action is required")
    .isIn(["approve", "reject"]).withMessage("Action must be approve or reject"),
  body("remarks").optional().trim()
    .isLength({ max: 300 }).withMessage("Remarks cannot exceed 300 characters"),
];

export const issueAssetValidator = [
  body("expectedReturnDate").optional().isISO8601().withMessage("Invalid date"),
  body("remarks").optional().trim(),
];

export const returnAssetValidator = [
  body("condition").notEmpty().withMessage("Condition is required")
    .isIn(["Good", "Damaged", "Lost"]).withMessage("Invalid condition"),
  body("damageNotes").optional().trim(),
  body("fine").optional().isFloat({ min: 0 }).withMessage("Fine must be positive"),
  body("remarks").optional().trim(),
];
