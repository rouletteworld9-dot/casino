const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        transactionType: {
            type: String,
            enum: ['deposit', 'withdraw'],
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        transactionStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },

        paymentMethod: {
            type: String,
            enum: ['upi', 'card', 'netbanking', 'cash'],
            required: true
        },

        utr: {
            type: String,
            required: true,
            trim: true
        },

        // Stores the static QR used for this payment
        qrLink: {
            type: String,
            required: true
        },
        // UPI ID used for this payment
        upiId: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);
