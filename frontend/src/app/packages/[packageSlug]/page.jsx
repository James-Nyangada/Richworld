"use client"

import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Check, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

import BookingModal from "@/components/BookingModal"

export default function PackageDetailPage() {
  const params = useParams()
  console.log("PackageDetailPage params:", params)
  const [pkg, setPkg] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [expandedDay, setExpandedDay] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const API = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`${API}/api/packages/${params.packageSlug}`)
        if (!res.ok) throw new Error(`Failed: ${res.status}`)
        const data = await res.json()
        setPkg(data)
      } catch (err) {
        console.error("Error fetching package:", err)
      }
    }
    if (params?.packageSlug) fetchPackage()
  }, [params.packageSlug])

  if (!pkg) {
    return <div className="mt-[150px] text-center">Loading package...</div>
  }

  // Normalize images: ensure array
  const images = Array.isArray(pkg.images) && pkg.images.length > 0
    ? pkg.images
    : [pkg.image].filter(Boolean) // fallback to single image if provided

  return (
    <div className="min-h-screen bg-gray-50 mt-[100px]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{pkg.name}</h1>
           {/* Image Gallery */}
            <div className="mb-8">
              {/* Main Selected Image */}
              {images.length > 0 && (
                <div className="mb-4">
                  <img
                    src={images[selectedImage] || "/placeholder.svg"}
                    alt={`${pkg.name} main`}
                    className="w-full h-[400px] object-cover rounded-2xl shadow-sm"
                  />
                </div>
              )}

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                      selectedImage === index ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${pkg.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <p className="text-gray-700 leading-relaxed">{pkg.specialNotes || pkg.description}</p>
            </div>

            {/* Hotels Table */}
            {pkg.hotels?.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Hotels</h2>
                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hotel Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price per Night
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {pkg.hotels.map((hotel, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {hotel.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            KES {hotel.price?.toLocaleString() || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Itinerary */}
            {pkg.itinerary?.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Day-by-Day Itinerary</h2>
                <div className="space-y-4">
                  {pkg.itinerary.map((dayItem, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">{idx + 1}</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {dayItem.day || `Day ${idx + 1}`}
                          </span>
                        </div>
                        {expandedDay === idx ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                      </button>
                      {expandedDay === idx && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4 bg-gray-50"
                        >
                          <div className="pl-13">
                            <p className="text-gray-700 leading-relaxed">{dayItem.plan}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-[120px] bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="mb-6">
                    <span className="text-gray-500 text-sm">Starting from</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900">KES {pkg.price?.toLocaleString()}</span>
                        <span className="text-gray-500">/ person</span>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-600 text-sm">
                        <Check className="text-green-500 mr-3 h-5 w-5" />
                        <span>Best Price Guarantee</span>
                    </div>
                     <div className="flex items-center text-gray-600 text-sm">
                        <Check className="text-green-500 mr-3 h-5 w-5" />
                        <span>Instant Confirmation</span>
                    </div>
                     <div className="flex items-center text-gray-600 text-sm">
                        <Check className="text-green-500 mr-3 h-5 w-5" />
                        <span>Secure Payments</span>
                    </div>
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]"
                >
                    Book Now
                </button>

                 <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="font-semibold mb-2">Need Help?</h4>
                     <p className="text-sm text-gray-500 mb-1">Call us 24/7</p>
                    <a href="tel:+254123456789" className="text-blue-600 font-medium">+254 700 000 000</a>
                </div>
            </div>
          </div>

        </div>
      </div>
      
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        packageDetails={pkg} 
      />
    </div>
  )
}
