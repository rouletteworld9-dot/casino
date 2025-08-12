// models/PaymentSettings.js
const mongoose = require('mongoose');

const paymentSettingsSchema = new mongoose.Schema(
    {
       
        upiId: {
            type: String,
            required: true
        },
         qrCodeUrl: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('PaymentSettings', paymentSettingsSchema);
