// src/services/departmentService.js
import api from "./api.js";

export const departmentService = {
  getAll: (params) => api.get("/departments", { params }),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post("/departments", data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

export const laboratoryService = {
  getAll: (params) => api.get("/laboratories", { params }),
  getById: (id) => api.get(`/laboratories/${id}`),
  create: (data) => api.post("/laboratories", data),
  update: (id, data) => api.put(`/laboratories/${id}`, data),
  delete: (id) => api.delete(`/laboratories/${id}`),
};
