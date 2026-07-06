// routes/department.routes.js
import express from "express";
import * as deptController from "../controllers/department.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(protect);

router.get("/", restrictTo("Admin", "Admin Manager", "HOD"), deptController.getAllDepartments);
router.get("/:id", restrictTo("Admin", "Admin Manager", "HOD"), deptController.getDepartmentById);
router.post("/", restrictTo("Admin"), deptController.createDepartment);
router.put("/:id", restrictTo("Admin"), deptController.updateDepartment);
router.delete("/:id", restrictTo("Admin"), deptController.deleteDepartment);

export default router;
