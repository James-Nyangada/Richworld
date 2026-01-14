const axios = require('axios');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const BASE_URL = process.env.PAYSTACK_URL || 'https://api.paystack.co';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json'
    }
});

/**
 * 1. Initialize Transaction
 * Generates the Checkout Link
 */
exports.initializePayment = async (data) => {
    try {
        const { amount, email, ref, callbackUrl } = data;

        const response = await api.post('/transaction/initialize', {
            email: email,
            amount: Math.ceil(amount * 100), // CRITICAL: Convert to kobo/cents. Using Math.ceil to avoid floating point issues
            reference: ref, // Your Unique Order ID
            currency: 'KES',
            callback_url: callbackUrl, // Where user goes after payment
            channels: ['card', 'mobile_money'], // Explicitly allow M-Pesa & Card
            metadata: {
                custom_fields: [
                    {
                        display_name: "Order ID",
                        variable_name: "order_id",
                        value: ref
                    }
                ]
            }
        });

        return response.data.data; // Contains { authorization_url, access_code, reference }
    } catch (error) {
        console.error("Paystack Init Error:", error.response?.data || error.message);
        throw new Error("Payment initialization failed");
    }
};

/**
 * 2. Verify Transaction
 * Called by the Frontend Redirect or Webhook to confirm status
 */
exports.verifyPayment = async (reference) => {
    try {
        const response = await api.get(`/transaction/verify/${reference}`);
        return response.data.data; // Contains status: 'success' | 'failed' | 'abandoned'
    } catch (error) {
        console.error("Paystack Verify Error:", error.response?.data || error.message);
        throw new Error("Payment verification failed");
    }
};
