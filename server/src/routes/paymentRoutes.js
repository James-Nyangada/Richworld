const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// GET /api/payments/ipn (The Webhook)
router.get('/payments/ipn', paymentController.handleIPN);

module.exports = router;
