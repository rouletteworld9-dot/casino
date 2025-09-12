import api from "../utils/axios";

const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

const verifyOtp = async ({ otp, phone }) => {
  try {
    const response = await api.post("/auth/verify-otp", { otp, phone });
    return response.data;
  } catch (error) {
    console.error("OTP verification failed:", error);
    throw error;
  }
};

const forgotPassword = async ({ phone }) => {
  try {
    const res = await api.post("/auth/forgot-password", { phone });
    return res.data;
  } catch (error) {
    console.log("forgot password error", error);
    throw error;
  }
};

const resetPassword = async ({ phone, otp, newPassword }) => {
  try {
    const res = await api.post("/auth/reset-password", {
      phone,
      otp,
      newPassword,
    });
    return res.data;
  } catch (error) {
    console.log("reset password error", error);
    throw error;
  }
};

const authApi = {
  login,
  verifyOtp,
  register,
  forgotPassword,
  resetPassword,
};

export default authApi;
