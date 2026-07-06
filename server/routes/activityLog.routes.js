// routes/activityLog.routes.js
import express from "express";
import { getLogs } from "../controllers/activityLog.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(protect);
router.get("/", restrictTo("Admin"), getLogs);

export default router;
