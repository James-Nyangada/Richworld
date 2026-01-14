const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST /api/payments/webhook (The Webhook)
router.post('/payments/webhook', paymentController.webhook);

module.exports = router;
