const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      default: () => "BOOK-" + uuidv4().slice(0, 8).toUpperCase(),
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    selectedPackage: {
      type: String,
      required: true,
      ref: "Package", // refers to Package name
    },
    numberOfAdults: {
      type: Number,
      required: true,
    },
    numberOfChildren: {
      type: Number,
      default: 0,
    },
    travelStartDate: {
      type: Date,
      required: true,
    },
    travelEndDate: {
      type: Date,
      required: true,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String, // 'M-Pesa', 'Card'
    },
    amount: {
      type: Number,
    },
    pesapalTrackingId: {
      type: String,
    },
  },
  { timestamps: true }
)

const Booking = mongoose.model("Booking", bookingSchema)

module.exports = Booking
