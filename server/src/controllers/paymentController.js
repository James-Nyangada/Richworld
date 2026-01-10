const PesapalService = require('../services/pesapalService');
const Booking = require('../models/Booking'); 

// GET /api/payments/ipn (The Webhook)
exports.handleIPN = async (req, res) => {
    const { OrderTrackingId, OrderMerchantReference } = req.query;

    console.log(`IPN Received for Booking: ${OrderMerchantReference}`);

    try {
        // 1. Verify Status with PesaPal
        const statusData = await PesapalService.getTransactionStatus(OrderTrackingId);
        const { payment_status_description } = statusData;

        // 2. Update MongoDB
        if (payment_status_description === "Completed") {
            await Booking.findByIdAndUpdate(OrderMerchantReference, { 
                paymentStatus: 'paid',
                paymentMethod: statusData.payment_method || 'Online' 
            });
            console.log(`Booking ${OrderMerchantReference} updated to PAID`);
        } else if (payment_status_description === "Failed") {
            await Booking.findByIdAndUpdate(OrderMerchantReference, { paymentStatus: 'failed' });
        }

        // 3. Acknowledge Receipt to PesaPal
        // Must return this exact JSON structure to stop PesaPal from retrying
        res.json({
            orderNotificationType: "GET",
            orderTrackingId: OrderTrackingId,
            orderMerchantReference: OrderMerchantReference,
            status: 200
        });

    } catch (error) {
        console.error("IPN Error:", error);
        res.status(500).send("Error processing IPN");
    }
};
