// routes/notification.routes.js
import express from "express";
import * as notifController from "../controllers/notification.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(protect);

router.get("/",                      notifController.getMyNotifications);
router.patch("/:id/read",            notifController.markAsRead);
router.patch("/mark-all-read",       notifController.markAllRead);
router.delete("/:id",                notifController.deleteNotification);

export default router;
