"use client"
import { motion } from "framer-motion"

export default function WhyBookWithUs() {
  const features = [
    {
      title: "Discover the possibilities",
      description: "With nearly half a million attractions, hotels & more, you're sure to find joy.",
    },
    {
      title: "Exploring made easy",
      description: "Book last minute, skip lines & get free cancellation for easier exploring.",
    },
    {
      title: "Travel you can trust",
      description: "Read reviews & get reliable customer support. We're with you at every step.",
    },
    {
      title: "Flexibility, freedom, fun",
      description: "No matter the Travel Style, our tours balance well-planned itineraries with the...",
    },
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Left side - Heading */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-reey text-5xl md:text-6xl lg:text-7xl text-red-800 leading-tight">
              Why book with Richworld Safaris
            </h2>
          </motion.div>

          {/* Right side - Description */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-gray-700 text-lg leading-relaxed">
              We've been crafting extraordinary safari adventures, redefining how travelers experience the wild. From
              the sweeping plains of the Serengeti to Kenya's breathtaking landscapes, we take you deeper into nature,
              closer to wildlife, and further from the ordinary.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Join us as we shape the future of safari travel—one unforgettable journey at a time. 🚀✨
            </p>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="font-semibold text-gray-900 text-lg mb-3 leading-tight">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
