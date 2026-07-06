// controllers/notification.controller.js
import Notification from "../models/Notification.model.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getMyNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(+limit),
      Notification.countDocuments({ recipient: req.user._id }),
      Notification.countDocuments({ recipient: req.user._id, isRead: false }),
    ]);

    sendSuccess(res, {
      message: "Notifications fetched",
      data: { notifications, unreadCount },
    });
  } catch (error) { next(error); }
};

export const markAsRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true, readAt: new Date() }
    );
    sendSuccess(res, { message: "Marked as read" });
  } catch (error) { next(error); }
};

export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    sendSuccess(res, { message: "All notifications marked as read" });
  } catch (error) { next(error); }
};

export const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
    sendSuccess(res, { message: "Notification deleted" });
  } catch (error) { next(error); }
};
