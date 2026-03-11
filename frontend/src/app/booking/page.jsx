"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"

export default function BookingPage() {
  const API = process.env.NEXT_PUBLIC_API_URL || ''
const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    selectedPackage: "",
    numberOfAdults: "1",
    numberOfChildren: "0",
    travelStartDate: "",
    travelEndDate: "",
    specialRequests: "",
    paymentOption: "", // Added payment option
  })
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPackagePrice, setSelectedPackagePrice] = useState(null)
  const [processingPayment, setProcessingPayment] = useState(false)

  // 🔹 Fetch packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API}/api/packages`)
        const data = await res.json()
        setPackages(data)
      } catch (err) {
        console.error("Error fetching packages:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  // 🔹 Handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // auto-update price when package changes
    if (name === "selectedPackage") {
      const selected = packages.find((p) => p._id === value)
      setSelectedPackagePrice(selected ? selected.price : null)
    }
  }

  // 🔹 Handle Booking Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPackagePrice) return toast.error("Please select a package first.")
    setProcessingPayment(true)

    try {
      // Calculate total amount
      const adults = parseInt(formData.numberOfAdults) || 0
      const children = parseInt(formData.numberOfChildren) || 0
      const totalTravelers = adults + children
      // The price should be per person
      const totalAmount = selectedPackagePrice * totalTravelers

      // Find the actual package name for the backend payload
      const selectedPkg = packages.find(p => p._id === formData.selectedPackage);
      const packageName = selectedPkg ? selectedPkg.name : formData.selectedPackage;

      const payload = {
          ...formData,
          selectedPackage: packageName, // Override ID with Name
          amount: totalAmount,
          paymentPreference: formData.paymentOption
      }

      const res = await fetch(`${API}/api/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
          throw new Error(data.error || data.message || "Failed to process booking")
      }

      if (data.redirect_url) {
          // Pay Now: Redirect to Paystack
          window.location.href = data.redirect_url
      } else {
          // Pay Later: Show success message
          toast.success("Booking successful! 🎉 " + (data.message || "Payment link sent to email."))
          resetForm()
      }

    } catch (err) {
        console.error("Booking Error:", err)
        toast.error("Booking process failed ❌: " + err.message)
    } finally {
        setProcessingPayment(false)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      selectedPackage: "",
      numberOfAdults: "",
      numberOfChildren: "",
      travelStartDate: "",
      travelEndDate: "",
      specialRequests: "",
      paymentOption: "",
    })
    setCurrentStep(1)
    setSelectedPackagePrice(null)
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative h-80 bg-gradient-to-br from-orange-800 via-orange-600 to-orange-400 flex items-center justify-center overflow-hidden">
        {/* Decorative gradient circle */}
        <div className="absolute top-16 right-32 w-32 h-32 bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-300 rounded-full opacity-60 blur-xl"></div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">Book Your Safari</h1>
          <p className="text-xl text-white/90">Create your perfect custom adventure</p>
        </motion.div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white rounded-t-[3rem] -mt-12 relative z-10 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      currentStep >= step ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-all duration-300 ${
                        currentStep > step ? "bg-orange-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Trip Details"}
                {currentStep === 3 && "Additional Information"}
                {currentStep === 4 && "Payment Options"}
              </h2>
              <p className="text-gray-600 mt-2">Step {currentStep} of 4</p>
            </div>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12 p-6 bg-gray-50 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800">100% Customizable</h3>
              <p className="text-sm text-gray-600">Tailor every detail to your preferences</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800">Secure Booking</h3>
              <p className="text-sm text-gray-600">Your information is safe with us</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800">Quick Response</h3>
              <p className="text-sm text-gray-600">Get your quote within 24 hours</p>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Trip Details */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Select Package *</label>
                  <select
                    name="selectedPackage"
                    value={formData.selectedPackage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a safari package</option>
                    {packages.map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Number of Adults *</label>
                    <select
                      name="numberOfAdults"
                      value={formData.numberOfAdults}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select adults</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Adult" : "Adults"}
                        </option>
                      ))}
                      <option value="10+">10+ Adults</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Number of Children</label>
                    <select
                      name="numberOfChildren"
                      value={formData.numberOfChildren}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select children</option>
                      <option value="0">No Children</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Child" : "Children"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Travel Start Date *</label>
                    <input
                      type="date"
                      name="travelStartDate"
                      value={formData.travelStartDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Travel End Date *</label>
                    <input
                      type="date"
                      name="travelEndDate"
                      value={formData.travelEndDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Additional Information */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Any special requests, dietary requirements, accessibility needs, celebrations, or specific requirements..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Summary */}
                <div className="bg-orange-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-4">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span> {formData.fullName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {formData.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {formData.phone}
                    </p>
                    <p>
                      <span className="font-medium">Package:</span> {formData.selectedPackage}
                    </p>
                    <p>
                      <span className="font-medium">Travelers:</span> {formData.numberOfAdults} Adults
                      {formData.numberOfChildren &&
                        formData.numberOfChildren !== "0" &&
                        `, ${formData.numberOfChildren} Children`}
                    </p>
                    <p>
                      <span className="font-medium">Travel Dates:</span> {formData.travelStartDate} to{" "}
                      {formData.travelEndDate}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Payment Options */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Final Summary */}
                <div className="bg-orange-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-4">Final Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {formData.fullName}</p>
                    <p><span className="font-medium">Email:</span> {formData.email}</p>
                    <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                    <p><span className="font-medium">Package:</span> {
                      packages.find(pkg => pkg._id === formData.selectedPackage)?.name || formData.selectedPackage
                    }</p>
                    <p><span className="font-medium">Travelers:</span> {formData.numberOfAdults} Adults
                      {formData.numberOfChildren && formData.numberOfChildren !== "0" && 
                        `, ${formData.numberOfChildren} Children`}
                    </p>
                    <p><span className="font-medium">Travel Dates:</span> {formData.travelStartDate} to {formData.travelEndDate}</p>
                    {selectedPackagePrice && (
                      <p className="text-lg font-bold text-orange-600">
                        <span className="font-medium">Estimated Cost:</span> KES {(selectedPackagePrice * ((parseInt(formData.numberOfAdults) || 0) + (parseInt(formData.numberOfChildren) || 0))).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Choose Payment Option</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pay Now Option */}
                    <div 
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        formData.paymentOption === 'pay-now' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => handleInputChange({ target: { name: 'paymentOption', value: 'pay-now' } })}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.paymentOption === 'pay-now' ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}>
                          {formData.paymentOption === 'pay-now' && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Pay Now</h4>
                          <p className="text-sm text-gray-600">Complete payment via M-Pesa</p>
                        </div>
                      </div>
                    </div>

                    {/* Pay Later Option */}
                    <div 
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        formData.paymentOption === 'pay-later' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                      onClick={() => handleInputChange({ target: { name: 'paymentOption', value: 'pay-later' } })}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.paymentOption === 'pay-later' ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                        }`}>
                          {formData.paymentOption === 'pay-later' && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Pay Later</h4>
                          <p className="text-sm text-gray-600">Reserve now, pay before travel</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Terms */}
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                    <p className="font-medium mb-2">Payment Terms:</p>
                    <ul className="space-y-1">
                      <li>• <strong>Pay Now:</strong> Secure your booking with immediate payment</li>
                      <li>• <strong>Pay Later:</strong> Reserve your spot with a 20% deposit, balance due 30 days before travel</li>
                      <li>• All payments are secure and refundable according to our cancellation policy</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  Previous
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors duration-300 ml-auto"
                >
                  Next Step
                </button>
              ) : (
                  <button
                  type="submit"
                  disabled={!formData.paymentOption || processingPayment}
                  className={`px-12 py-4 rounded-xl font-semibold text-lg shadow-lg ml-auto transition-all duration-300 transform hover:scale-105 ${
                    formData.paymentOption && !processingPayment
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {processingPayment ? 'Processing...' : formData.paymentOption === 'pay-now' ? 'Proceed to Payment' : 'Submit Booking Request'}
                </button>
              )}
            </div>
          </motion.form>
          {/* Additional Trust Signals */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-gray-600 mb-4">
              🔒 Your information is secure and will only be used to create your custom safari package
            </p>
            <p className="text-sm text-gray-500">
              Our team will review your request and send you a detailed quote within 24 hours
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
