// emailService.js
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  pool: true,               // Reuse connections for multiple emails
  maxConnections: 3,         // Max simultaneous connections
  connectionTimeout: 10000,  // 10s to establish connection
  greetingTimeout: 10000,    // 10s for SMTP greeting
  socketTimeout: 15000,      // 15s for socket inactivity
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to take our messages");
  }
});

// Send booking confirmation to customer
async function sendBookingConfirmation(to, booking) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 24px; border-radius: 8px;">
      <h2 style="color: #4f46e5;">Booking Confirmation ✅</h2>
      <p>Hello ${booking.fullName},</p>
      <p>Thank you for booking <strong>${booking.selectedPackage}</strong> with us!</p>
      <p>We’ve received your booking and will contact you shortly.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${booking.fullName}</li>
        <li><strong>Email:</strong> ${booking.email}</li>
        <li><strong>Phone:</strong> ${booking.phone}</li>
        <li><strong>Package:</strong> ${booking.selectedPackage}</li>
        <li><strong>Travel Dates:</strong> ${new Date(booking.travelStartDate).toLocaleDateString()} to ${new Date(booking.travelEndDate).toLocaleDateString()}</li>
      </ul>
      <p style="margin-top: 20px;">We look forward to hosting you!</p>
      <p style="font-size: 12px; color: #666;">If you have any questions, reply to this email.</p>
    </div>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Booking Confirmation - " + booking.selectedPackage,
    html,
  })
}

// Send booking notification to company
async function sendBookingNotification(to, booking) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 24px; border-radius: 8px;">
      <h2 style="color: #e11d48;">📩 New Booking Received</h2>
      <p>A new booking has been made:</p>
      <ul>
        <li><strong>Name:</strong> ${booking.fullName}</li>
        <li><strong>Email:</strong> ${booking.email}</li>
        <li><strong>Phone:</strong> ${booking.phone}</li>
        <li><strong>Package:</strong> ${booking.selectedPackage}</li>
        <li><strong>Travel Dates:</strong> ${new Date(booking.travelStartDate).toLocaleDateString()} to ${new Date(booking.travelEndDate).toLocaleDateString()}</li>
        <li><strong>Adults:</strong> ${booking.numberOfAdults}</li>
        <li><strong>Children:</strong> ${booking.numberOfChildren}</li>
        <li><strong>Booking ID:</strong> ${booking.bookingId}</li>
        ${booking.specialRequests ? `<li><strong>Special Requests:</strong> ${booking.specialRequests}</li>` : ''}
      </ul>
    </div>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "New Booking - " + booking.selectedPackage,
    html,
  })
}

// Send payment link to customer (for Pay Later)
async function sendPaymentLinkEmail(to, booking, paymentLink) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 24px; border-radius: 8px;">
        <h2 style="color: #4f46e5;">Complete Your Booking Payment 💳</h2>
        <p>Hello ${booking.fullName},</p>
        <p>Thank you for booking <strong>${booking.selectedPackage}</strong>.</p>
        <p>To confirm your booking, please complete the payment using the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${paymentLink}" 
             style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: bold;">
            Pay KES ${booking.amount?.toLocaleString() || '0'} Now
          </a>
        </div>

        <p style="font-size: 13px; color: #666;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="font-size: 13px; word-break: break-all;"><a href="${paymentLink}">${paymentLink}</a></p>
        
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking.bookingId}</li>
          <li><strong>Package:</strong> ${booking.selectedPackage}</li>
          <li><strong>Amount:</strong> KES ${booking.amount?.toLocaleString() || '0'}</li>
          <li><strong>Travel Date:</strong> ${new Date(booking.travelStartDate).toLocaleDateString()}</li>
        </ul>
        <p style="margin-top: 20px;">This link does not expire — you can pay at any time.</p>
        <p style="font-size: 12px; color: #666;">If you have already paid, please ignore this email.</p>
      </div>
    `
  
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Payment Required - " + booking.selectedPackage,
      html,
    })
  }

module.exports = { sendBookingConfirmation, sendBookingNotification, sendPaymentLinkEmail }
