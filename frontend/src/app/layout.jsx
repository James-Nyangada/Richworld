import localFont from "next/font/local"
import { Inter as GeistSans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import "./globals.css"
import { Suspense } from "react"
import WhatsAppButton from "@/components/layout/WhatsAppButton"

const geistSans = GeistSans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

// ✅ Import your Reey font locally
const reey = localFont({
  src: [
    {
      path: "../../public/fonts/reey/Reey-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-reey",
})

export const metadata = {
  title: "Richworld Safaris | Magic Redefined|The Best Travel & Tour Company in Kenya | African Safari Packages",
  description: "Discover Kenya with Richworld Safaris a trusted travel and tour company in Kenya offering African safari packages, holiday tours, and adventure travel across Africa.",
  keywords: "travel and tour company Kenya, African safari packages, Kenya safaris, best travel agency Kenya, top tour company Africa, Richworld Safaris",
  generator: "estetica-agency",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${reey.variable} font-sans`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </Suspense>
        <Analytics debug={false} />
      </body>
    </html>
  )
}
// restart
// restart
