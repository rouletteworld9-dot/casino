// utils/sendOtpWhatsApp.js

const axios = require("axios");

const sendOtpWhatsApp = async (phone, otp) => {
  try {
    const message = `*🔐 Your OTP Code: ${otp}*\n\n_This code will expire in 1 minute. Do not share it with anyone._`;

    const response = await axios.post("https://www.wasenderapi.com/api/send-message", {
      to: phone,
      type: "text",
      text: message,
    },
      {
        headers: {
          Authorization: `Bearer ${process.env.WASENDER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },);

    return response.data;
  } catch (err) {
    console.error("Failed to send OTP via WhatsApp:", err.message);
    throw new Error("OTP sending failed");
  }
};

module.exports = sendOtpWhatsApp;
