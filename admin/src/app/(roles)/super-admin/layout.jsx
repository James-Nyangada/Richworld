import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./global.css"

export const metadata = {
  title: "Travel Tours Dashboard",
  description: "Travel and Tour Management Dashboard",
  generator: "v0.app",
}

export default function SuperAdminLayout({ children }) {
  return (
    <>
      <Suspense fallback={null}>{children}</Suspense>
      <Analytics />
    </>
  )
}
