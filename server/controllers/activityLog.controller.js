// controllers/activityLog.controller.js
import ActivityLog from "../models/ActivityLog.model.js";
import { sendSuccess, buildPaginationMeta } from "../utils/apiResponse.js";

export const getLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action = "", userId = "" } = req.query;
    const query = {};
    if (action) query.action = action;
    if (userId) query.performedBy = userId;

    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .populate("performedBy", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(+limit),
      ActivityLog.countDocuments(query),
    ]);

    sendSuccess(res, {
      message: "Logs fetched",
      data: logs,
      meta: buildPaginationMeta({ page: +page, limit: +limit, total }),
    });
  } catch (error) { next(error); }
};
