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

// User Routes
router.post('/deposit', createDeposit);
router.post('/withdraw', createWithdraw);
router.get('/my', getMyTransactions);

// Admin Routes
router.get('/', getAllTransactions);
router.put('/:id/approve', approveTransaction);
router.put('/:id/reject', rejectTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
