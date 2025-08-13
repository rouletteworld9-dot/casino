const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
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
        default: 'upi'
    },

    utr: {
        type: String,
        trim: true
    }, // required for deposits

    adminNote: {
        type: String,
        trim: true
    },

    // Deposit fields
    qrLink: String,
    upiId: String,

    // Withdraw fields
    bankAccountNumber: String,
    ifscCode: String,
    recipientName: String,
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);