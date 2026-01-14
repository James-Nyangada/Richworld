const PaystackService = require('../services/paystackService');
const Booking = require('../models/Booking'); 
const crypto = require('crypto');

// POST /api/pay/webhook
// Paystack sends a POST request here when payment status changes
exports.webhook = async (req, res) => {
    // 1. Validate Signature (Security)
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return res.status(500).send("Server Misconfigured");

    const hash = crypto.createHmac('sha512', secret)
                       .update(JSON.stringify(req.body))
                       .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
        return res.status(400).send('Invalid Signature');
    }

    // 2. Process Event
    const event = req.body;
    if (event.event === 'charge.success') {
        const { reference } = event.data;
        
        console.log(`Payment Successful for Booking: ${reference}`);
        
        try {
            await Booking.findByIdAndUpdate(reference, { 
                paymentStatus: 'paid',
                paymentMethod: event.data.channel, // 'card' or 'mobile_money'
            });
        } catch (err) {
            console.error("Error updating booking:", err);
        }
    }

    res.sendStatus(200); // Always return 200 OK
};
