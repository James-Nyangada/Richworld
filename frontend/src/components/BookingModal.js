'use client'
import { useState } from 'react'
import axios from 'axios'
import { X, Calendar, User, Mail, Phone, CreditCard, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function BookingModal({ isOpen, onClose, packageDetails }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelStartDate: '',
    numberOfAdults: 1,
    numberOfChildren: 0,
    specialRequests: ''
  })
  const [paymentPreference, setPaymentPreference] = useState('pay-now') // pay-now, pay-later
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
        // Calculate travelEndDate
        const startDate = new Date(formData.travelStartDate)
        const durationStr = String(packageDetails.duration || "1").replace(/\D/g, "")
        const days = parseInt(durationStr) || 1
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + days)

        // Sanitize price (remove commas, currency symbols)
        const priceStr = String(packageDetails.price || "0").replace(/[^0-9.]/g, "")
        const unitPrice = parseFloat(priceStr) || 0
        const totalAmount = unitPrice * (parseInt(formData.numberOfAdults) + parseInt(formData.numberOfChildren))

        const payload = {
            ...formData,
            travelEndDate: endDate.toISOString(),
            selectedPackage: packageDetails.name,
            amount: totalAmount,
            paymentPreference
        }

        const API = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await axios.post(`${API}/api/bookings`, payload)
        
        if (res.data.redirect_url) {
            // Pay Now: Redirect to Pesapal/Paystack
            window.location.href = res.data.redirect_url
        } else {
            // Pay Later or success message
            toast.success("Booking Successful! " + (res.data.message || "Payment link sent to email."))
            setTimeout(() => {
                onClose()
            }, 2000)
        }

    } catch (error) {
        console.error("Booking Error:", error)
        toast.error("Booking failed. Please try again.")
    } finally {
        setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
        >
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Book {packageDetails?.name}</h2>
                <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* Form Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="fullName"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="+254 700 000000"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Travel Date</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    name="travelStartDate"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={formData.travelStartDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Adults</label>
                            <input
                                type="number"
                                name="numberOfAdults"
                                min="1"
                                required
                                className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={formData.numberOfAdults}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Children</label>
                            <input
                                type="number"
                                name="numberOfChildren"
                                min="0"
                                className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={formData.numberOfChildren}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Payment Options */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Option</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div 
                                onClick={() => setPaymentPreference('pay-now')}
                                className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all ${
                                    paymentPreference === 'pay-now' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <CreditCard className={`mb-2 ${paymentPreference === 'pay-now' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className="font-semibold text-sm">Pay Now</span>
                                <span className="text-xs text-gray-500">Paystack (M-Pesa / Card)</span>
                            </div>
                            <div 
                                onClick={() => setPaymentPreference('pay-later')}
                                className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all ${
                                    paymentPreference === 'pay-later' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <Clock className={`mb-2 ${paymentPreference === 'pay-later' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className="font-semibold text-sm">Pay Later</span>
                                <span className="text-xs text-gray-500">Receive Email Link</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                        >
                            {loading ? 'Processing...' : (paymentPreference === 'pay-now' ? `Pay KES ${(packageDetails?.price * (parseInt(formData.numberOfAdults) + parseInt(formData.numberOfChildren))).toLocaleString()}` : 'Confirm Booking')}
                        </button>
                    </div>
                </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
