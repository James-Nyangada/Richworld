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
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-reey text-red-600 mb-2"
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
                className="relative group cursor-pointer h-[400px] rounded-3xl overflow-hidden block shadow-lg group-hover:shadow-xl transition-all duration-300"
              >
                {/* Background Image */}
                <img
                  src={firstImage}
                  alt={pkg.name || "Package image"}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:from-black group-hover:via-black/50 transition-colors duration-500"></div>

                {/* Top Elements */}
                <div className="absolute top-5 left-5">
                  <span className="bg-[#a39a4d] text-white text-xs font-bold px-2.5 py-1 rounded-sm tracking-wide">
                    POPULAR
                  </span>
                </div>
                <div className="absolute top-5 right-5 text-white text-sm drop-shadow-md">
                  From <span className="font-bold text-xl ml-1">KES {pkg.price || "2060"}</span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex flex-col justify-end">
                  {/* Locations / Destinations */}
                  <p className="text-gray-200 text-sm mb-2 line-clamp-1 drop-shadow-md">
                    {Array.isArray(pkg.destinations) 
                      ? pkg.destinations.join(" | ") 
                      : (pkg.destinations || pkg.locations || "")}
                  </p>

                  {/* Title */}
                  <h3 className="text-white text-2xl font-bold mb-3 leading-snug drop-shadow-md line-clamp-2">
                    {pkg.name || pkg.title || "Untitled Package"}
                  </h3>

                  {/* Duration */}
                  <div className="flex items-center text-white text-sm font-medium drop-shadow-md">
                    <Clock size={16} className="mr-1.5" />
                    {pkg.duration || pkg.days || "7 days"}
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
