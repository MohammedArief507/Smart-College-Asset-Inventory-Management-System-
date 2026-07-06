import api from "./api.js";

const authService = {
  login: async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    return data.data;
  },
  logout: async () => {
    await api.post("/auth/logout");
  },
  forgotPassword: async (email) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },
  resetPassword: async (token, password) => {
    const { data } = await api.patch(`/auth/reset-password/${token}`, { password });
    return data;
  },
  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data.data;
  },
  changePassword: async (passwords) => {
    const { data } = await api.patch("/auth/change-password", passwords);
    return data;
  },
};

export default authService;
