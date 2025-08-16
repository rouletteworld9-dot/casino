import api from "../../utils/axios";

const getPaymentSettings = async () => {
  try {
    const res = await api.get("/paymentSettings");
    return res.data?.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return { qrCodeUrl: "", upiId: "" };
    }
    console.log("get payment settings error", error);
    throw error;
  }
};

const updatePaymentSettings = async (formData) => {
  try {
    const res = await api.post("/paymentSettings", formData);
    return res.data?.data;
  } catch (error) {
    console.log("update payment settings error", error);
    throw error;
  }
};


const paymentSettingsApi = {
  getPaymentSettings,
  updatePaymentSettings,
};

export default paymentSettingsApi