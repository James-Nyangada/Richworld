"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Star, Clock, Heart, ImageIcon, ArrowRight, Search, Filter, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"

export default function PackagesPage() {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [visiblePackages, setVisiblePackages] = useState(12)
  const [allPackages, setAllPackages] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [availableCategories, setAvailableCategories] = useState(["All"])

  const API = process.env.NEXT_PUBLIC_API_URL

useEffect(() => {
    let mounted = true
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API}/api/packages`)
        if (!res.ok) throw new Error(`Failed to fetch packages: ${res.status}`)
        const data = await res.json()
        // API might return an array or an object — normalise to array
        const list = Array.isArray(data) ? data : data?.packages ?? []
        
        if (mounted) {
          setPackages(list)
          setAllPackages(list) // Populate allPackages for filtering
          
          // Extract unique categories from the packages
          const categories = ["All"]
          const uniqueCategories = [...new Set(list.map(pkg => pkg.category).filter(Boolean))]
          categories.push(...uniqueCategories)
          setAvailableCategories(categories)
        }
      } catch (err) {
        console.error("Error fetching packages:", err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchPackages()
    return () => { mounted = false }
  }, [API])

  // Fallback categories if no categories found in packages
  const defaultCategories = ["All", "Safari", "Adventure", "Cultural", "Beach", "Holiday", "Luxury"]
  const categories = availableCategories.length > 1 ? availableCategories : defaultCategories

  // ✅ Filtering
  const filteredPackages = allPackages.filter((pkg) => {
    const matchesSearch =
      (pkg.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    // Improved category filtering
    const matchesFilter = selectedFilter === "All" || 
      (pkg.category && pkg.category.toLowerCase() === selectedFilter.toLowerCase()) ||
      (!pkg.category && selectedFilter === "All") // Show uncategorized packages when "All" is selected
    
    return matchesSearch && matchesFilter
  })

  const displayedPackages = filteredPackages.slice(0, visiblePackages)

  const handleViewMore = () => {
    setVisiblePackages((prev) => prev + 8)
  }

  const handlePackageClick = (packageId) => {
    window.location.href = `/packages/${packageId}`
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/maasai-mara-wildlife-safari-scene.png"
            alt="Maasai Mara Safari Scene"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full text-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
            >
              Our Packages
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto px-4"
            >
              Discover extraordinary safari adventures and unforgettable experiences
            </motion.p>
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search packages, destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="text-gray-600 mr-2" size={20} />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedFilter(category)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                  selectedFilter === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 px-4 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Results Info */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {loading ? 0 : displayedPackages.length} of {loading ? 0 : filteredPackages.length} packages
            </p>
          </div>

          {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-3xl overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-300"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-300 rounded mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))
          ) : (
            displayedPackages.map((pkg, index) => {
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
                          className="bg-gray-700 hover:bg-gray-600 text-white py-2.5 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm"
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
          })
          )}
        </div>

          {/* View More */}
          {!loading && visiblePackages < filteredPackages.length && (
            <div className="text-center mt-12">
              <button
                onClick={handleViewMore}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-lg font-semibold flex items-center mx-auto"
              >
                View More Packages
                <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          )}

          {/* No Results */}
          {!loading && filteredPackages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No packages found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
