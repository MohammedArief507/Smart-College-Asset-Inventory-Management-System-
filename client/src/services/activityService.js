// src/services/activityService.js
import api from "./api.js";

const activityService = {
  getLogs: (params) => api.get("/activity-logs", { params }),
};

export default activityService;
