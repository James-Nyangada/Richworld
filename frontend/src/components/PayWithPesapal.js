'use client'
import { useState } from 'react';
import axios from 'axios';

export default function PayWithPesapal({ orderId }) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. Request Payment URL from our Backend
            const { data } = await axios.post('/api/payment/initiate', { orderId });
            
            // 2. Redirect User to PesaPal
            if (data.redirect_url) {
                window.location.href = data.redirect_url;
            }
        } catch (error) {
            console.error("Payment Init Failed", error);
            alert("Could not start payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handlePayment} 
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
            {loading ? "Processing..." : "Pay with M-Pesa / Card"}
        </button>
    );
}
