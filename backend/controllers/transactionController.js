const Transaction = require("../models/Transaction");
const PaymentSettings = require("../models/PaymentSettings");
const User = require("../models/User");

// ✅ 1. Create Deposit Transaction
exports.createDeposit = async (req, res) => {
  try {
    const { amount, utr } = req.body;
    if (!amount || amount <= 0 || !utr) {
      return res
        .status(400)
        .json({ message: "Valid amount and UTR are required" });
    }

    const settings = await PaymentSettings.findOne();
    if (!settings) {
      return res
        .status(500)
        .json({ message: "Payment settings not configured" });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      transactionType: "deposit",
      amount,
      utr,
      qrLink: settings.qrCodeUrl,
      upiId: settings.upiId,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ 2. Create Withdraw Transaction
exports.createWithdraw = async (req, res) => {
  try {
    const { amount, bankAccountNumber, ifscCode, recipientName } = req.body;

    if (
      !amount ||
      amount <= 0 ||
      !bankAccountNumber ||
      !ifscCode ||
      !recipientName
    ) {
      return res
        .status(400)
        .json({
          message: "Valid amount and all withdraw details are required",
        });
    }

    const user = await User.findById(req.user._id);
    const currentBalance = user.realBalance || 0;

    // Check pending withdrawals
    const pending = await Transaction.aggregate([
      {
        $match: {
          user: user._id,
          transactionType: "withdraw",
          transactionStatus: "pending",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const pendingAmount = pending[0]?.total || 0;

    if (currentBalance - pendingAmount < amount) {
      return res
        .status(400)
        .json({
          message: "Insufficient balance considering pending withdrawals",
        });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      transactionType: "withdraw",
      amount,
      bankAccountNumber,
      ifscCode,
      recipientName,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ 3. Get All Transactions (Admin)
exports.getAllTransactions = async (req, res) => {
  try {
    const { transactionStatus } = req.query;
    let filter = {};
    if (transactionStatus) filter.transactionStatus = transactionStatus;

    const transactions = await Transaction.find(filter)
      .populate("user", "name phone realBalance")
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ 4. Get My Transactions (User)
exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ 5. Approve Transaction (Admin)
exports.approveTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.transactionStatus !== "pending") {
      return res.status(400).json({ message: "Transaction already processed" });
    }

    // For withdraw, check balance at approval time
    if (transaction.transactionType === "withdraw") {
      const user = await User.findById(transaction.user);
      if ((user.realBalance || 0) < transaction.amount) {
        return res
          .status(400)
          .json({ message: "Insufficient balance at approval time" });
      }
    }

    transaction.transactionStatus = "approved";

    if (transaction.transactionType === "deposit") {
      await User.findByIdAndUpdate(transaction.user, {
        $inc: { realBalance: transaction.amount },
      });
    } else if (transaction.transactionType === "withdraw") {
      await User.findByIdAndUpdate(transaction.user, {
        $inc: { realBalance: -transaction.amount },
      });
    }

    await transaction.save();
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ 6. Reject Transaction (Admin)
exports.rejectTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.transactionStatus !== "pending") {
      return res.status(400).json({ message: "Transaction already processed" });
    }

    transaction.transactionStatus = "rejected";
    transaction.adminNote = adminNote || "";
    await transaction.save();

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ 7. Delete Transaction (Admin) — safer soft delete
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await Transaction.findByIdAndDelete(id);

    res.status(200).json({ message: "Transaction marked as deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
