// utils/sendOtpWhatsApp.js

const axios = require("axios");

const sendOtpWhatsApp = async (phone, otp) => {
  try {
    const message = `Your OTP is ${otp}. It will expire in 1 minute.`;
    
    const response = await axios.post("https://app.wasender.online/api/send", {
      number: phone,
      type: "text",
      message,
      instance_id: process.env.WASENDER_INSTANCE_ID,
      access_token: process.env.WASENDER_ACCESS_TOKEN,
    });

    return response.data;
  } catch (err) {
    console.error("Failed to send OTP via WhatsApp:", err.message);
    throw new Error("OTP sending failed");
  }
};

module.exports = sendOtpWhatsApp;
