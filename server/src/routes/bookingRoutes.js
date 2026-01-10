const express = require("express")
const router = express.Router()
const bookingController = require("../controllers/bookingController")

// Public routes – no auth
router.get("/", bookingController.getAllBookings)
router.post("/", bookingController.createBooking)
router.put("/:id/status", bookingController.updateBookingStatus)
router.get("/:id/pay", bookingController.initiatePayment) // Pay Later Link

module.exports = router
