"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryPage, setGalleryPage] = useState(1)
  const [galleryTotalPages, setGalleryTotalPages] = useState(1)
  const [galleryLoading, setGalleryLoading] = useState(true)

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

  useEffect(() => {
    fetchGallery(galleryPage)
  }, [galleryPage])

  const fetchGallery = async (page) => {
    setGalleryLoading(true)
    try {
      const res = await fetch(`${API}/api/gallery/visible?page=${page}&limit=12`)
      const data = await res.json()
      setGalleryImages(data.images || [])
      setGalleryTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error("Error fetching gallery:", err)
    } finally {
      setGalleryLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/african-safari-landscape-with-elephants.png"
            alt="African Safari Landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        {/* Decorative gradient circle */}
        <div className="absolute top-8 right-20 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full opacity-60 blur-sm"></div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <motion.h1
            className="text-6xl md:text-7xl font-bold text-white text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Gallery
          </motion.h1>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-gradient-to-b from-white to-orange-50/30 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-lg text-gray-500 mb-3 tracking-wider uppercase">Moments Captured</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Gallery</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-amber-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* Gallery Grid */}
          {galleryLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          ) : galleryImages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {galleryImages.map((image, index) => (
                  <motion.div
                    key={image._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="group"
                  >
                    <div
                      className="relative overflow-hidden bg-white"
                      style={{
                        borderRadius: "16px",
                        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px) scale(1.02)"
                        e.currentTarget.style.boxShadow =
                          "0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)"
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.06)"
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px) scale(1.02)"
                        e.currentTarget.style.boxShadow =
                          "0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)"
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)"
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.06)"
                      }}
                    >
                      {/* Image */}
                      <div className="aspect-[4/3] overflow-hidden" style={{ borderRadius: "16px 16px 0 0" }}>
                        <img
                          src={image.imageUrl}
                          alt={image.caption}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      {/* Caption */}
                      <div className="p-4">
                        <p className="text-sm md:text-base text-gray-700 font-medium leading-relaxed line-clamp-2">
                          {image.caption}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {galleryTotalPages > 1 && (
                <motion.div
                  className="flex justify-center items-center gap-4 mt-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <button
                    onClick={() => setGalleryPage((p) => Math.max(1, p - 1))}
                    disabled={galleryPage === 1}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      galleryPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 shadow-sm hover:shadow-md border border-gray-200"
                    }`}
                  >
                    ← Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: galleryTotalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setGalleryPage(page)}
                        className={`w-11 h-11 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          galleryPage === page
                            ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-200"
                            : "bg-white text-gray-600 hover:bg-orange-50 border border-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setGalleryPage((p) => Math.min(galleryTotalPages, p + 1))}
                    disabled={galleryPage === galleryTotalPages}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      galleryPage === galleryTotalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 shadow-sm hover:shadow-md border border-gray-200"
                    }`}
                  >
                    Next →
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Gallery coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
