// routes/paymentSettingsRoutes.js
const express = require('express');
const router = express.Router();
const { updatePaymentSettings, getPaymentSettings } = require('../controllers/paymentSettingsController');
const upload = require('../middlewares/upload');
const adminOnly = require('../middlewares/adminOnly');

router.post('/', upload.single('qrCode'),adminOnly,  updatePaymentSettings);
router.get('/', getPaymentSettings);

module.exports = router;
