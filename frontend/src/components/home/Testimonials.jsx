"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Star } from "lucide-react"

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const API = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API}/api/testimonials/approved`)
        const data = await res.json()
        setTestimonials(data)
      } catch (err) {
        console.error("Error fetching testimonials:", err)
      }
    }
    fetchTestimonials()
  }, [])

  if (!testimonials.length) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">No testimonials available</p>
        </div>
      </section>
    )
  }

  // Show up to 6 testimonials in the grid
  const displayTestimonials = testimonials.slice(0, 6)

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            className="font-reey text-5xl md:text-6xl lg:text-7xl text-red-800 leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Real stories from travelers who experienced the magic of Africa with Richworld Safaris.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
            >
              {/* Rating */}
              <div className="flex space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < (testimonial.rating || 5)
                        ? "text-yellow-500 fill-current"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Testimonial Content */}
              <div className="flex-grow mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {testimonial.title}
                </h3>
                <p className="text-gray-600 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">
                    {testimonial.name}
                  </p>
                  {testimonial.packageName && (
                    <p className="text-sm text-gray-500 mt-1">
                      {testimonial.packageName}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leave a Review Button */}
        <div className="text-center mt-16">
          <motion.a
            href="/testimonials"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-10 py-3.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Leave a Review
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
