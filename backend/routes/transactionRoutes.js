// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const {
    createDeposit,
    createWithdraw,
    getAllTransactions,
    getMyTransactions,
    approveTransaction,
    rejectTransaction,
    deleteTransaction
} = require('../controllers/transactionController');
const adminOnly = require('../middlewares/adminOnly');

// User Routes
router.post('/deposit', createDeposit);
router.post('/withdraw', createWithdraw);
router.get('/my', getMyTransactions);

// Admin Routes
router.get('/', adminOnly, getAllTransactions);
router.put('/:id/approve', adminOnly, approveTransaction);
router.put('/:id/reject', adminOnly, rejectTransaction);
router.delete('/:id', adminOnly, deleteTransaction);

module.exports = router;
