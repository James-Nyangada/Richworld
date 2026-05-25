"use client"
import { motion } from "framer-motion"

export default function BestDeals() {
  const deals = [
    {
      id: 1,
      title: "watamu deals",
      description: "Discover Watamu: Your Ultimate Beach Getaway Awaits.",
      image: "/image-12.jpg",
      size: "small",
    },
    {
      id: 2,
      title: "Tanzania Moshi Deals",
      description: "Experience the Magic of Tanzania: Safaris, Beaches, and More.",
      image: "/tanzania-serengeti-safari-landscape.png",
      size: "small",
      badge: "BEST SAFARIS",
    },
    {
      id: 3,
      title: "Masai Mara Deals",
      description: "Masaai Mara: Where Wildlife Dreams Come True.",
      image: "/maasai-mara-wildlife-safari-scene.png",
      size: "small",
    },
    {
      id: 4,
      title: "Dubai Deals",
      description: "Explore Dubai's Wonders with Unbeatable Deals.",
      image: "/amboseli-elephant-safari-kilimanjaro.png",
      size: "large",
    },
    {
      id: 5,
      title: "Cruises",
      description: "UNWIND, EXPLORE, AND SAIL TO NEW HORIZONS.",
      image: "/samburu-cultural-safari-experience.png",
      size: "large",
    },
  ]

  const categories = ["LOCAL", "LOCAL", "LOCAL", "MIDDLE EAST", "INTERNATIONAL", "USA", "SAFARI PACKAGES"]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-reey text-4xl md:text-5xl lg:text-6xl text-red-700 mb-8">Our Best Deals</h2>
        </motion.div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Top Row - 3 small cards */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {deals.slice(0, 3).map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative h-[400px] rounded-3xl overflow-hidden block shadow-lg group-hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${deal.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:from-black group-hover:via-black/50 transition-colors duration-500"></div>

                {deal.badge && (
                  <div className="absolute top-5 left-5">
                    <span className="bg-[#a39a4d] text-white text-xs font-bold px-2.5 py-1 rounded-sm tracking-wide">
                      {deal.badge}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex flex-col justify-end text-white">
                  <p className="text-gray-200 text-sm mb-2 line-clamp-2 drop-shadow-md">{deal.description}</p>
                  <h3 className="text-white text-2xl font-bold mb-4 leading-snug drop-shadow-md">{deal.title}</h3>
                  
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center gap-2"
                    >
                      <span>Book Now</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          
          {/* Bottom Row - 2 large cards */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {deals.slice(3, 5).map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                viewport={{ once: true }}
                className="relative h-[400px] rounded-3xl overflow-hidden block shadow-lg group-hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${deal.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:from-black group-hover:via-black/50 transition-colors duration-500"></div>

                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex flex-col justify-end text-white">
                  <p className="text-gray-200 text-sm mb-2 line-clamp-2 drop-shadow-md">{deal.description}</p>
                  <h3 className="text-white text-3xl font-bold mb-4 leading-snug drop-shadow-md">{deal.title}</h3>
                  
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center gap-2"
                    >
                      <span>Book Now</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
