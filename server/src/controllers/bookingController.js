const Booking = require("../models/Booking")
const { sendBookingConfirmation, sendBookingNotification, sendPaymentLinkEmail } = require("../utilities/emailService")
const PaystackService = require("../services/paystackService")

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { paymentPreference, amount, ...bookingData } = req.body;
    
    // Ensure amount is present if needed for payment
    // In a real app, amount should be calculated on server based on package
    
    const booking = new Booking({
        ...bookingData,
        amount: amount, // Assumes frontend sends amount, or calculate here
        paymentStatus: 'pending',
        paymentMethod: paymentPreference === 'pay-now' ? 'Paystack' : 'Unspecified' 
    })
    
    await booking.save()

    // Send standard booking emails (Non-blocking / Fire-and-forget)
    sendBookingConfirmation(booking.email, booking)
        .catch(emailErr => console.error("Email Sending Failed (Background):", emailErr.message));
        
    // sendBookingNotification(process.env.COMPANY_EMAIL, booking).catch(err => console.error("Admin Email Failed:", err.message));

    if (paymentPreference === 'pay-now') {
        // Initiate Paystack Payment
        try {
            const result = await PaystackService.initializePayment({
                amount: amount,
                email: booking.email,
                ref: booking._id.toString(),
                callbackUrl: `${process.env.APP_BASE_URL}/payment/success` // Where user goes after payment
            });

            // Update booking with tracking ID
            booking.paystackReference = result.reference;
            await booking.save();

            return res.status(201).json({ 
                message: "Booking created, redirecting to payment", 
                booking,
                redirect_url: result.authorization_url 
            })
        } catch (paystackErr) {
            console.error("Paystack Error:", paystackErr.message);
            // Even if Paystack fails, the booking is created
            return res.status(201).json({ 
                message: "Booking created but payment initiation failed. Please contact support.", 
                booking 
            })
        }
    } else {
        // Pay Later: Send Payment Link
        try {
             const paymentLink = `${process.env.APP_BASE_URL}/api/bookings/${booking._id}/pay`;
             await sendPaymentLinkEmail(booking.email, booking, paymentLink);
        } catch (linkErr) {
             console.error("Payment Link Email Failed:", linkErr.message)
        }

        return res.status(201).json({ 
            message: "Booking created. Payment link sent to email.", 
            booking 
        })
    }

  } catch (err) {
    console.error("Create Booking Critical Error:", err);
    res.status(400).json({ error: err.message, details: err.toString() })
  }
}

// Initiate Payment (for Pay Later link or Retry)
exports.initiatePayment = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        const result = await PaystackService.initializePayment({
            amount: booking.amount,
            email: booking.email,
            ref: booking._id.toString(),
            callbackUrl: `${process.env.APP_BASE_URL}/payment/success`
        });

        booking.paystackReference = result.reference;
        await booking.save();

        // If request expects JSON (frontend retry), return JSON.
        // If request is from Email Link (browser), Redirect.
        const acceptHeader = req.headers.accept || "";
        if (acceptHeader.includes("application/json")) {
            return res.json({ redirect_url: result.authorization_url });
        } else {
            return res.redirect(result.authorization_url);
        }

    } catch (error) {
        console.error("Initiate Payment Error:", error);
        res.status(500).json({ error: "Failed to initiate payment" });
    }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const updateData = {};
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.paymentStatus) updateData.paymentStatus = req.body.paymentStatus;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    if (!booking) return res.status(404).json({ error: "Booking not found" })
    res.json(booking)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}