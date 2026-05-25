"use client"

import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Youtube, Linkedin, TikTok, Clock10 } from "lucide-react"

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Packages", href: "/packages" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/share/1Cn8UzFmVR/?mibextid=wwXIfr", label: "Facebook" },
    { icon: Twitter, href: "https://x.com/rich_safaris", label: "Twitter" },
    { icon: Instagram, href: "https://www.instagram.com/rich_worldsafaris", label: "Instagram" },
    { icon: Clock10, href: "https://www.tiktok.com/@rich_worldsafaris?_t=ZS-8zgxzM63fXU&_r=1", label: "YouTube" },
    
  ]

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Richworld Safaris</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Richworld Safaris provides smart, eco-friendly safari solutions, ensuring pure, safe adventures for
              travelers, families, and communities across Africa.
              MAGIC REDEFINED
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Phone: +254706770371</p>
              <p>Address: P.O. Box 823, Thika, Kenya</p>
              <p>Email: info@richworldsafaris.com</p>
              <p>Website: www.richworldsafaris.com</p>
              <button className="mt-3 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"  onClick={() => (window.location.href = "https://wa.me/+254706770371?text=Hello! I'm interested in your safari packages. Can you help me plan my adventure")}>
                WhatsApp Chat
              </button>
            </div>
          </motion.div>

          {/* Connect Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
            <div className="flex space-x-3 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
            {/* <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Newsletter Signup</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md text-sm font-medium transition-colors duration-200">
                  Join
                </button>
              </div>
            </div> */}
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="flex items-center mb-4 md:mb-0">
             <img src="/richworld-4.png" alt="Richworld Safaris" className="h-[100px] w-auto" />
          </div>
          <div className="flex space-x-6 text-sm text-gray-600">
            <span>© 2025 Richworld Safaris</span>
            <a href="#" className="hover:text-blue-600 transition-colors duration-200">
              Privacy Policy
            </a>
            <div>
              <span>Designed by </span>
            <a href="https://estetica-agency.com" className="hover:text-blue-600 transition-colors duration-200">
              Estetica Agency
            </a>
            </div>
            
          </div>
        </motion.div>

      </div>
    </footer>
  )
}
