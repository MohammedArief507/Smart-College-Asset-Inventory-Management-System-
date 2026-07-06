// routes/request.routes.js
import express from "express";
import * as requestController from "../controllers/request.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createRequestValidator,
  hodActionValidator,
  issueAssetValidator,
  returnAssetValidator,
} from "../validators/request.validator.js";

const router = express.Router();
router.use(protect);

const allRoles = restrictTo("Admin", "Admin Manager", "HOD", "Lab Incharge", "Staff");
const managerRoles = restrictTo("Admin", "Admin Manager");
const hodRoles = restrictTo("Admin", "HOD");

// Stats
router.get("/stats", managerRoles, requestController.getRequestStats);

// Issued assets
router.get("/issued", allRoles, requestController.getIssuedAssets);
router.patch("/issued/:id/return", managerRoles, returnAssetValidator, validate, requestController.returnAsset);

// Requests CRUD
router.get("/", allRoles, requestController.getAllRequests);
router.get("/:id", allRoles, requestController.getRequestById);
router.post("/", allRoles, createRequestValidator, validate, requestController.createRequest);
router.patch("/:id/cancel", allRoles, requestController.cancelRequest);

// HOD action
router.patch("/:id/hod-action", hodRoles, hodActionValidator, validate, requestController.hodAction);

// Issue asset (Admin Manager)
router.patch("/:id/issue", managerRoles, issueAssetValidator, validate, requestController.issueAsset);

export default router;
