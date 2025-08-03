const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenueController');

// Distribute revenue
router.post('/distribute', revenueController.distribute);

module.exports = router;
