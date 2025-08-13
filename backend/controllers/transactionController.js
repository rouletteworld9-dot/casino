const Transaction = require('../models/Transaction');
const PaymentSettings = require('../models/PaymentSettings');
const User = require('../models/User');

// 📌 1. Create Deposit Transaction
exports.createDeposit = async (req, res) => {
    try {
        const { amount, utr } = req.body;
        if (!amount || !utr) {
            return res.status(400).json({ message: 'Amount, UTR, and payment proof are required' });
        }

        const settings = await PaymentSettings.findOne();
        if (!settings) {
            return res.status(500).json({ message: 'Payment settings not configured' });
        }

        const transaction = await Transaction.create({
            user: req.user._id,
            transactionType: 'deposit',
            amount,
            utr,
            qrLink: settings.qrCodeUrl,
            upiId: settings.upiId
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 2. Create Withdraw Transaction
exports.createWithdraw = async (req, res) => {
    try {
        const { amount, utr } = req.body;
        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        // Check if user has enough balance
        const user = await User.findById(req.user._id);
        if (user.wallet < amount) {
            return res.status(400).json({ message: 'Insufficient wallet balance' });
        }

        const transaction = await Transaction.create({
            user: req.user._id,
            transactionType: 'withdraw',
            amount,
            utr,

        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 3. Get All Transactions (Admin)
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ transactionStatus: "pending" })
            .populate('user', 'name phone wallet')
            .sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 4. Get My Transactions (User)
exports.getMyTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 5. Approve Transaction (Admin)
exports.approveTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        transaction.transactionStatus = 'approved';

        // If deposit → add money to wallet
        if (transaction.transactionType === 'deposit') {
            await User.findByIdAndUpdate(transaction.user, { $inc: { wallet: transaction.amount } });
        }

        // If withdraw → subtract money from wallet (if not already subtracted)
        if (transaction.transactionType === 'withdraw') {
            await User.findByIdAndUpdate(transaction.user, { $inc: { wallet: -transaction.amount } });
        }

        await transaction.save();
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 6. Reject Transaction (Admin)
exports.rejectTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNote } = req.body;

        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        transaction.transactionStatus = 'rejected';
        transaction.adminNote = adminNote || '';

        await transaction.save();
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 7. Delete Transaction (Admin)
exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByIdAndDelete(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
