// src/services/assetService.js
import api from "./api.js";

const assetService = {
  getAll: (params) => api.get("/assets", { params }),
  getById: (id) => api.get(`/assets/${id}`),
  create: (data) => api.post("/assets", data),
  update: (id, data) => api.put(`/assets/${id}`, data),
  delete: (id) => api.delete(`/assets/${id}`),
  getStats: () => api.get("/assets/stats"),
  getCategories: () => api.get("/assets/categories"),
  export: (params) => api.get("/assets/export", {
    params,
    responseType: "blob",
  }),
};

export default assetService;
