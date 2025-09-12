// controllers/paymentSettingsController.js
const PaymentSettings = require('../models/PaymentSettings');
const cloudinary = require('../config/cloudinary');

// Admin: Upload QR & Update UPI
exports.updatePaymentSettings = async (req, res) => {
    try {
        const { upiId } = req.body;

        let qrCodeUrl;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "payment_qr_codes"
            });
            qrCodeUrl = result.secure_url;
        }

        let settings = await PaymentSettings.findOne();

        if (settings) {
            settings.upiId = upiId || settings.upiId;
            if (qrCodeUrl) settings.qrCodeUrl = qrCodeUrl;
            await settings.save();
        } else {
            settings = await PaymentSettings.create({
                upiId,
                qrCodeUrl
            });
        }

        res.status(200).json({
            success: true,
            data: settings
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get UPI + QR (for transactions)
exports.getPaymentSettings = async (req, res) => {
    try {
        const settings = await PaymentSettings.findOne();
        if (!settings) {
            return res.status(404).json({ success: false, message: "Payment settings not found" });
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
