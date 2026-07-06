// src/services/reportService.js
import api from "./api.js";

const reportService = {
  getSummary: () => api.get("/reports/summary"),
  downloadAssets: (params) => api.get("/reports/assets", { params, responseType: "blob" }),
  downloadRequests: (params) => api.get("/reports/requests", { params, responseType: "blob" }),
  downloadIssues: (params) => api.get("/reports/issues", { params, responseType: "blob" }),
  downloadDepartments: () => api.get("/reports/departments", { responseType: "blob" }),
};

export default reportService;
