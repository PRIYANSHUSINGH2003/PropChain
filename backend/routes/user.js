const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register
router.post('/register', userController.register);
// Login
router.post('/login', userController.login);
// Submit KYC
router.post('/kyc', userController.submitKYC);
// Admin: Approve/reject KYC
router.post('/kyc/status', userController.setKYCStatus);

module.exports = router;
