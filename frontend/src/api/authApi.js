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
    console.log(response.data , "response form api")
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

const getPaymentSettings = async () => {
  try {
    const res = await api.get("/paymentSettings");
    // Backend returns { success, data }
    return res.data?.data;
  } catch (error) {
    // If not found, treat as empty settings so UI can create fresh
    if (error?.response?.status === 404) {
      return { qrCodeUrl: "", upiId: "" };
    }
    console.log("get payment settings error", error);
    throw error;
  }
};

const updatePaymentSettings = async (formData) => {
  try {
    // Do NOT set Content-Type manually; let the browser set proper boundary
    const res = await api.post("/paymentSettings", formData);
    return res.data?.data;
  } catch (error) {
    console.log("update payment settings error", error);
    throw error;
  }
};
const authApi = {
  login,
  verifyOtp,
  register,
  forgotPassword,
  resetPassword,
  getPaymentSettings,
  updatePaymentSettings,
};

export default authApi;
