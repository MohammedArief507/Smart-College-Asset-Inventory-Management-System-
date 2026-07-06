// validators/asset.validator.js
import { body } from "express-validator";

export const createAssetValidator = [
  body("name").trim().notEmpty().withMessage("Asset name is required")
    .isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters"),

  body("category").notEmpty().withMessage("Category is required")
    .isMongoId().withMessage("Invalid category ID"),

  body("quantity").notEmpty().withMessage("Quantity is required")
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),

  body("brand").optional().trim(),
  body("model").optional().trim(),
  body("serialNumber").optional().trim(),
  body("purchaseDate").optional().isISO8601().withMessage("Invalid date"),
  body("purchasePrice").optional().isFloat({ min: 0 }).withMessage("Price must be positive"),
  body("warrantyExpiry").optional().isISO8601().withMessage("Invalid date"),
  body("supplier").optional().trim(),
  body("department").optional().isMongoId().withMessage("Invalid department ID"),
  body("laboratory").optional().isMongoId().withMessage("Invalid laboratory ID"),
  body("location").optional().trim(),
  body("condition").optional().isIn(["New", "Good", "Fair", "Poor", "Damaged"]),
  body("remarks").optional().trim(),
];

export const updateAssetValidator = [
  body("name").optional().trim()
    .isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters"),
  body("category").optional().isMongoId().withMessage("Invalid category ID"),
  body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("brand").optional().trim(),
  body("model").optional().trim(),
  body("condition").optional().isIn(["New", "Good", "Fair", "Poor", "Damaged"]),
  body("status").optional().isIn(["Available", "Issued", "Damaged", "Under Repair", "Scrapped", "Lost"]),
];
