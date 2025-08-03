const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI property valuation
router.post('/valuation', aiController.valuation);
// AI compliance check
router.post('/compliance', aiController.compliance);

module.exports = router;
