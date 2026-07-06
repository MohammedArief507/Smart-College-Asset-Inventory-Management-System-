// routes/report.routes.js
import express from "express";
import * as reportController from "../controllers/report.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(protect);

const canReport = restrictTo("Admin", "Admin Manager", "HOD");

router.get("/summary",    canReport, reportController.getSummary);
router.get("/assets",     canReport, reportController.assetReport);
router.get("/requests",   canReport, reportController.requestReport);
router.get("/issues",     canReport, reportController.issueReport);
router.get("/departments",canReport, reportController.departmentReport);

export default router;
