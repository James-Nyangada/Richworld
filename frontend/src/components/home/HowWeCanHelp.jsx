"use client"

import { motion } from "framer-motion"
import { Lightbulb, FileText, Luggage, ArrowRight } from "lucide-react"

export default function HowWeCanHelp() {
  const steps = [
    {
      id: 1,
      title: "Find your travel destination",
      description: "Find your travel destination, because we have covered all regions in the world",
      icon: Lightbulb,
      image: "/compass-on-map-travel-planning.png",
    },
    {
      id: 2,
      title: "Book a ticket",
      description: "After you find the trip you want to go to, you can directly order the ticket.",
      icon: FileText,
      image: "/travel-documents-passport-tickets.png",
    },
    {
      id: 3,
      title: "Pay and go to destination",
      description: "After you pay you can immediately enjoy the trip to the destination.",
      icon: Luggage,
      image: "/camping-sunset-mountain-adventure.png",
    },
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-reey text-red-800 leading-tight">
            How we can help your journey
          </h2>
          <motion.a
            href="/contact"
            className="flex items-center gap-2 text-gray-800 hover:text-red-800 transition-colors duration-300 text-lg font-medium"
            whileHover={{ x: 5 }}
          >
            <ArrowRight className="w-5 h-5" />
            Contact With Us
          </motion.a>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Step Card */}
              <div className="relative overflow-hidden rounded-2xl mb-6">
                {/* Step Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-lime-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Step {step.id.toString().padStart(2, "0")}
                  </span>
                </div>

                {/* Background Image */}
                <div className="relative h-64 bg-gray-200">
                  <img src={step.image || "/placeholder.svg"} alt={step.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Icon */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
