// routes/asset.routes.js
import express from "express";
import * as assetController from "../controllers/asset.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createAssetValidator, updateAssetValidator } from "../validators/asset.validator.js";

const router = express.Router();
router.use(protect);

const canManage = restrictTo("Admin", "Admin Manager");
const canView = restrictTo("Admin", "Admin Manager", "HOD", "Lab Incharge");

// Stats & categories
router.get("/stats", canView, assetController.getAssetStats);
router.get("/categories", assetController.getCategories);
router.get("/export", canManage, assetController.exportAssets);

// CRUD
router.get("/", canView, assetController.getAllAssets);
router.get("/:id", canView, assetController.getAssetById);
router.post("/", canManage, createAssetValidator, validate, assetController.createAsset);
router.put("/:id", canManage, updateAssetValidator, validate, assetController.updateAsset);
router.delete("/:id", restrictTo("Admin"), assetController.deleteAsset);

export default router;
