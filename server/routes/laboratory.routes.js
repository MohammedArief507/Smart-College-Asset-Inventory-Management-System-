// routes/laboratory.routes.js
import express from "express";
import * as labController from "../controllers/laboratory.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(protect);

router.get("/", restrictTo("Admin", "Admin Manager", "HOD"), labController.getAllLabs);
router.get("/:id", restrictTo("Admin", "Admin Manager", "HOD"), labController.getLabById);
router.post("/", restrictTo("Admin", "Admin Manager"), labController.createLab);
router.put("/:id", restrictTo("Admin", "Admin Manager"), labController.updateLab);
router.delete("/:id", restrictTo("Admin"), labController.deleteLab);

export default router;
