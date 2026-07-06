// src/services/requestService.js
import api from "./api.js";

const requestService = {
  getAll: (params) => api.get("/requests", { params }),
  getById: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post("/requests", data),
  cancel: (id) => api.patch(`/requests/${id}/cancel`),
  hodAction: (id, data) => api.patch(`/requests/${id}/hod-action`, data),
  issue: (id, data) => api.patch(`/requests/${id}/issue`, data),
  getStats: () => api.get("/requests/stats"),

  // Issued assets
  getIssued: (params) => api.get("/requests/issued", { params }),
  returnAsset: (id, data) => api.patch(`/requests/issued/${id}/return`, data),
};

export default requestService;
