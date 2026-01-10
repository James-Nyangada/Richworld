"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const tabData = {
  "Our History": {
    title: "Company Profile",
    content: `Richworld Safaris is a full travel agency, consultancy and training company, offering reliable, competitive professional holiday services for inbound and outbound holiday makers.

We also specialize in car hire and transport both in Kenya and outside Kenya, we have fleets of saloon cars, mini SUV, 4x4 SUV, Mini vans, tourist converted Landcruiser, Rosa buses and big buses.`,
    image: "/image-2.jpg",
  },
  "Our Purpose": {
    title: "Our Mission & Vision",
    content: `Our purpose is to create unforgettable safari experiences that connect travelers with the raw beauty of Africa's wilderness. We believe in sustainable tourism that benefits local communities while preserving the natural heritage for future generations.

We strive to be the leading safari company in East Africa, known for our exceptional service, expert guides, and commitment to conservation efforts across the region.`,
    image: "/african-wildlife-conservation-scene.png",
  },
  "Our Success": {
    title: "Our Achievements",
    content: `Over the years, Richworld Safaris has successfully organized thousands of safari adventures, earning recognition as one of Kenya's premier tour operators. Our success is measured by the smiles of satisfied customers and repeat bookings.

We have received multiple awards for excellence in tourism services and have been featured in leading travel publications for our innovative safari packages and commitment to sustainable tourism practices.`,
    image: "/image-3.jpg",
  },
  "What We Offer": {
    title: "Our Services",
    content: `We offer comprehensive safari packages including game drives, cultural tours, mountain climbing expeditions, and beach holidays. Our services extend to accommodation bookings, flight arrangements, and custom itinerary planning.

From luxury lodges to budget camping safaris, we cater to all preferences and budgets. Our experienced guides ensure you witness the Big Five and experience the authentic African wilderness in complete safety and comfort.`,
    image: "/image-6.jpg",
  },
}

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("Our History")

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
            About Us
          </motion.h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-t-[3rem] -mt-12 relative z-20 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Text */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg text-gray-600 mb-4 tracking-wider uppercase">Discover the Heart of Travel</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Your Go-To Travel Companion</h2>
          </motion.div>

          {/* Tabs and Content */}
          <div className="bg-orange-50 rounded-3xl p-8 md:p-12">
            {/* Tab Navigation */}
            <motion.div
              className="flex flex-wrap gap-8 mb-12 border-b border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {Object.keys(tabData).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-lg font-medium transition-all duration-300 relative ${
                    activeTab === tab ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </motion.div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900">{tabData[activeTab].title}</h3>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {tabData[activeTab].content.split("\n\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Right Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={tabData[activeTab].image || "/placeholder.svg"}
                      alt={tabData[activeTab].title}
                      className="w-full h-80 md:h-96 object-cover"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Signature */}
            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-2xl font-reey text-red-700">Richworld Safaris — Magic Redefined</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
