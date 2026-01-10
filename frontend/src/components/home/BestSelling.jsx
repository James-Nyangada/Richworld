"use client"

import { motion } from "framer-motion"
import { Star, Clock, Heart, ImageIcon, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"

export default function BestSelling() {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [packages, setPackages] = useState([])
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

  useEffect(() => {
    let mounted = true
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API}/api/packages`)
        if (!res.ok) throw new Error(`Failed to fetch packages: ${res.status}`)
        const data = await res.json()
        // API might return an array or an object — normalise to array
        const list = Array.isArray(data) ? data : data?.packages ?? []
        
        // Sort by createdAt (most recent first) and limit to 6 packages for best selling
        const recentPackages = list
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6)
        
        if (mounted) setPackages(recentPackages)
      } catch (err) {
        console.error("Error fetching packages:", err)
      }
    }
    fetchPackages()
    return () => { mounted = false }
  }, [API])

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-reey text-red-600"
          >
            Best Selling Destinations
          </motion.h2>
          <motion.a
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            href="/packages"
            className="hidden md:flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            View All Tours
            <ArrowRight className="ml-2" size={20} />
          </motion.a>
        </div>

        {/* Cards Grid - Optimized for 6 packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => {
            // prefer slug, fallback to _id
            const pkgId = pkg.slug || pkg._id || pkg.id || index

            // prefer pkg.images (array) but support older pkg.image too
            const firstImage =
              (Array.isArray(pkg.images) && pkg.images.length > 0 && pkg.images[0]) ||
              (Array.isArray(pkg.image) && pkg.image.length > 0 && pkg.image[0]) ||
              // sometimes backend might store single string in `image`
              (typeof pkg.image === "string" && pkg.image) ||
              (typeof pkg.images === "string" && pkg.images) ||
              "/placeholder.svg"

            // rating guard (0..5)
            const rating = Math.max(0, Math.min(5, Number(pkg.rating) || 5))

            return (
              <motion.a
                key={pkgId}
                href={`/packages/${pkgId}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredCard(pkgId)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative group cursor-pointer"
              >
                <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={firstImage}
                      alt={pkg.name || "Package image"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Hover Icons */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredCard === pkgId ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-4 right-4 flex flex-col space-y-2"
                    >
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <Heart className="text-white" size={20} />
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <ImageIcon className="text-white" size={20} />
                      </div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-5 text-white">
                    {/* Rating and Duration */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} className="text-yellow-400 fill-current" size={16} />
                        ))}
                        <span className="text-gray-300 text-sm ml-1">({pkg.reviews ?? 0})</span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <Clock size={16} className="mr-1" />
                        {pkg.duration ?? pkg.days ?? "N/A"}
                      </div>
                    </div>

                    {/* Destination Name */}
                    <h3 className="text-xl font-bold mb-2">{pkg.name || pkg.title || "Untitled Package"}</h3>

                    <AnimatePresence>
                      {hoveredCard === pkgId && (
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-full font-medium transition-colors duration-200 flex items-center justify-center text-sm"
                        >
                          <ArrowRight className="mr-2" size={14} />
                          More Information
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>

        {/* Mobile View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="md:hidden text-center mt-8"
        >
          <a
            href="/packages"
            className="inline-flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            View All Tours
            <ArrowRight className="ml-2" size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
