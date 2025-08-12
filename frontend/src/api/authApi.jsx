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

// const account = async () => {
//   try {
//     const res = await api.post("/admin/account");
//     return res.data;
//   } catch (error) {
//     console.log("account error", error);
//     throw error;
//   }
// };

// Payment Settings APIs
const getPaymentSettings = async () => {
  try {
    const res = await api.get("/settings/payment");
    return res.data;
  } catch (error) {
    console.log("get payment settings error", error);
    throw error;
  }
};

const updatePaymentSettings = async (formData) => {
  try {
    const res = await api.post("/settings/payment", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
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
  // account,
  getPaymentSettings,
  updatePaymentSettings,
};

export default authApi;
