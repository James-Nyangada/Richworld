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

    // Send standard booking emails — staggered to respect Resend 2 req/s rate limit
    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    // Fire emails in background with 1.5s spacing
    (async () => {
      try {
        await sendBookingConfirmation(booking.email, booking);
        console.log(`✅ Booking confirmation sent to ${booking.email}`);
      } catch (err) { console.error("Email Sending Failed (Background):", err.message); }

      await delay(1500);

      try {
        await sendBookingNotification(process.env.COMPANY_EMAIL, booking);
        console.log(`✅ Admin notification sent to ${process.env.COMPANY_EMAIL}`);
      } catch (err) { console.error("Admin Email Failed:", err.message); }

      if (paymentPreference !== 'pay-now') {
        await delay(1500);
        const serverUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
        const paymentLink = `${serverUrl}/api/bookings/${booking._id}/pay`;
        try {
          await sendPaymentLinkEmail(booking.email, booking, paymentLink);
          console.log(`✅ Payment link email sent to ${booking.email}`);
        } catch (err) { console.error("Payment Link Email Failed:", err.message); }
      }
    })();

    if (paymentPreference === 'pay-now') {
        // Initiate Paystack Payment
        try {
            const result = await PaystackService.initializePayment({
                amount: amount,
                email: booking.email,
                ref: booking._id.toString(),
                callbackUrl: `${process.env.APP_BASE_URL}/payment/success`, // Where user goes after payment
                phone: booking.phone
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
        // Pay Later: response sent immediately, payment link email handled by staggered queue above
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
            callbackUrl: `${process.env.APP_BASE_URL}/payment/success`,
            phone: booking.phone
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