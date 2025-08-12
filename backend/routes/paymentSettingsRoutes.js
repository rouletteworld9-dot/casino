// routes/paymentSettingsRoutes.js
const express = require('express');
const router = express.Router();
const { updatePaymentSettings, getPaymentSettings } = require('../controllers/paymentSettingsController');
const upload = require('../middlewares/upload');

router.post('/', upload.single('qrCode'), updatePaymentSettings);
router.get('/', getPaymentSettings);

module.exports = router;
