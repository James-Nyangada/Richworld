"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Download, Plus, Eye, Trash2, Search, FileText } from "lucide-react"
import axios from "axios"

export default function BookingVoucherPage() {
  const API = process.env.NEXT_PUBLIC_API_URL
  const [vouchers, setVouchers] = useState([])
  const [showForm, setShowForm] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [previewVoucher, setPreviewVoucher] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)


  const [form, setForm] = useState({
    hotelLodge: "", from: "", guestName: "", nationality: "",
    phone: "", checkInDate: "", checkOutDate: "", roomType: "",
    mealPlan: "", numberOfRooms: 1, numberOfAdults: 1,
    numberOfChildren: 0, numberOfNights: 1, remarks: "",
  })

  useEffect(() => { fetchVouchers() }, [])

  const fetchVouchers = async () => {
    try {
      const res = await axios.get(`${API}/api/booking-vouchers`)
      setVouchers(res.data)
    } catch (err) { console.error("Error fetching vouchers:", err) }
  }

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value }
    if (field === "checkInDate" || field === "checkOutDate") {
      if (updated.checkInDate && updated.checkOutDate) {
        const d1 = new Date(updated.checkInDate), d2 = new Date(updated.checkOutDate)
        const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24))
        if (diff > 0) updated.numberOfNights = diff
      }
    }
    setForm(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/booking-vouchers`, form)
      toast.success("Voucher created successfully!")
      setPreviewVoucher(res.data)
      setShowPreview(true)
      setShowForm(false)
      setForm({ hotelLodge: "", from: "", guestName: "", nationality: "", phone: "",
        checkInDate: "", checkOutDate: "", roomType: "", mealPlan: "",
        numberOfRooms: 1, numberOfAdults: 1, numberOfChildren: 0, numberOfNights: 1, remarks: "" })
      fetchVouchers()
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create voucher")
    } finally { setLoading(false) }
  }

  // Build raw HTML string for the voucher (used inside an iframe for PDF capture)
  const generateVoucherHTMLString = (voucher) => {
    const dateRange = (() => {
      if (!voucher.checkInDate || !voucher.checkOutDate) return "";
      const d1 = new Date(voucher.checkInDate), d2 = new Date(voucher.checkOutDate)
      const o = (n) => { const s = ["th","st","nd","rd"]; const v = n % 100; return s[(v-20)%10]||s[v]||s[0] }
      const day1 = `${d1.getDate()}${o(d1.getDate())}`, day2 = `${d2.getDate()}${o(d2.getDate())}`
      const mon = d1.toLocaleDateString("en-GB", { month: "long" }), yr = d1.getFullYear()
      return `${day1}-${day2} ${mon} ${yr}, ${voucher.numberOfNights} Night${voucher.numberOfNights > 1 ? "s" : ""}`
    })()
    const issuedDate = (() => {
      const dt = new Date(voucher.createdAt || new Date())
      const o = (n) => { const s = ["th","st","nd","rd"]; const v = n % 100; return s[(v-20)%10]||s[v]||s[0] }
      return `${dt.getDate()}${o(dt.getDate())}-${dt.getMonth()+1}-${dt.getFullYear()}`
    })()
    const totalGuests = Number(voucher.numberOfAdults) + Number(voucher.numberOfChildren)
    const adultsLabel = voucher.numberOfAdults > 1 ? "adults" : "adult"
    const kidsLabel = voucher.numberOfChildren !== 1 ? "kids" : "kid"
    const remarksHTML = voucher.remarks ? `<div style="color:#000;font-weight:bold;font-size:14px;margin-bottom:24px;margin-left:40px;">REMARKS: ${voucher.remarks}</div>` : ""
    // Use absolute URL for images so the iframe can load them
    const logoUrl = `${window.location.origin}/richworld-logo.png`
    const rightImgUrl = `${window.location.origin}/hero-safari.jpg`

    return `<div style="width:794px;min-height:1000px;padding:40px 50px;background:#fff;font-family:'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif;color:#000;font-size:14px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div style="display:flex;flex-direction:column;align-items:center;">
          <img src="${logoUrl}" style="height:80px;object-fit:contain" />
          <div style="color:#f58220;font-weight:bold;font-size:14px;margin-top:5px;letter-spacing:1px;">MAGIC REDEFINED</div>
        </div>
        <img src="${rightImgUrl}" style="height:120px;width:150px;object-fit:cover;border-radius:40px 60px 50px 40px;" onerror="this.src='${logoUrl}'; this.style.borderRadius='0';" />
      </div>
      <div style="display:flex;justify-content:space-between;border-bottom:2px solid #ffcc00;padding-bottom:8px;margin-bottom:12px;font-size:14px;font-weight:bold">
        <span>www.richworldsafaris.com</span><span>info@richworldsafaris.com</span><span>+254 706 770371</span>
      </div>
      <div style="text-align:right;color:#a0522d;font-weight:bold;font-size:14px;margin-bottom:20px">Date Issued: ${issuedDate}</div>
      <div style="text-align:center;margin-bottom:24px;color:#1d3b66;">
        <h1 style="font-size:28px;font-weight:bold;letter-spacing:1px;margin:0">BOOKING VOUCHER</h1>
        <h2 style="font-size:24px;font-weight:bold;letter-spacing:1px;margin:0">ID: ${voucher.voucherId}</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;font-size:14px;">
        <tr>
          <td style="border:1px solid #f4ccab;padding:6px 10px;font-weight:bold;width:100px;background:#fff;">Name</td>
          <td style="border:1px solid #f4ccab;padding:6px 10px;font-weight:bold;background:#fff;">Richworld safaris</td>
          <td rowspan="3" style="border:1px solid #f4ccab;padding:6px 10px;font-weight:bold;text-align:center;background:#fff;width:100px;">check-in<br/>dates</td>
          <td style="border:1px solid #f4ccab;padding:6px 10px;font-weight:bold;text-align:center;background:#fff;font-size:13px;">${voucher.hotelLodge}</td>
          <td style="border:1px solid #f4ccab;padding:6px 10px;font-weight:bold;text-align:center;background:#fff;">${dateRange}</td>
        </tr>
        <tr>
          <td style="border:1px solid #f4ccab;padding:6px 10px;font-weight:bold;background:#fcebd7;">Booked by</td>
          <td style="border:1px solid #f4ccab;padding:6px 10px;font-weight:bold;background:#fcebd7;">Ken Mumo</td>
          <td style="border:1px solid #f4ccab;padding:6px 10px;background:#fcebd7;"></td>
          <td style="border:1px solid #f4ccab;padding:6px 10px;background:#fcebd7;"></td>
        </tr>
        <tr>
          <td style="border:1px solid #f4ccab;padding:6px 10px;background:#fff;"></td>
          <td style="border:1px solid #f4ccab;padding:6px 10px;background:#fff;"></td>
          <td style="border:1px solid #f4ccab;padding:6px 10px;background:#fff;"></td>
          <td style="border:1px solid #f4ccab;padding:6px 10px;background:#fff;"></td>
        </tr>
      </table>
      <div style="position:relative;text-align:center;margin:20px 0 20px;font-size:16px;font-weight:bold;">
        <div style="position:absolute;left:40px;top:10px;width:150px;border-bottom:1px solid #000;"></div>
        Client Name : ${(voucher.guestName || "").toUpperCase()}
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
        <tr>
          <td style="border:1px solid #f4ccab;padding:8px 10px;font-weight:bold;background:#fff;width:140px;">Room Type</td>
          <td style="border:1px solid #f4ccab;padding:8px 10px;background:#fff;">${voucher.roomType || ""}</td>
        </tr>
        <tr>
          <td style="border:1px solid #f4ccab;padding:8px 10px;font-weight:bold;background:#fcebd7;">Adults/ Kids</td>
          <td style="border:1px solid #f4ccab;padding:8px 10px;font-weight:bold;background:#fcebd7;text-align:center;">Guest in Total:${totalGuests}, ${voucher.numberOfAdults} ${adultsLabel}, ${voucher.numberOfChildren} ${kidsLabel} Residents.</td>
        </tr>
        <tr>
          <td style="border:1px solid #f4ccab;padding:8px 10px;background:#fff;"></td>
          <td style="border:1px solid #f4ccab;padding:8px 10px;background:#fff;"></td>
        </tr>
        <tr>
          <td style="border:1px solid #f4ccab;padding:8px 10px;font-weight:bold;background:#fcebd7;">Meal Plan</td>
          <td style="border:1px solid #f4ccab;padding:8px 10px;font-weight:bold;background:#fcebd7;">${voucher.mealPlan}</td>
        </tr>
      </table>
      ${remarksHTML}
      <div style="color:#1d3b66;font-weight:bold;font-size:15px;margin-bottom:28px;margin-left:40px;">PAYMENT: A deposit will be made</div>
      <div style="font-size:14px;line-height:1.6;margin-left:40px;">
        <p style="margin:0;font-weight:bold">Ken Mumo</p>
        <p style="margin:0;font-weight:bold">Director</p>
        <p style="margin:0;font-weight:bold">Rich World Safaris</p>
        <p style="margin:0;font-weight:bold">Phone: +254 706 770 371</p>
        <p style="margin:0;font-weight:bold">Email: info@richworldsafaris.com</p>
        <p style="margin:0;font-weight:bold">Website: www.richworldsafaris.com</p>
        <p style="margin:0;font-weight:bold">Location: Biashara street Laxmi plaza building 3rd floor RM 9</p>
      </div>
    </div>`
  }

  const downloadPDF = useCallback(async (voucher) => {
    setDownloading(true)
    setPreviewVoucher(voucher)
    setShowPreview(true)

    try {
      // Create an isolated iframe so html2canvas doesn't encounter oklch/lab colors
      const iframe = document.createElement("iframe")
      iframe.style.cssText = "position:fixed;left:-9999px;top:0;width:900px;height:1400px;border:none"
      document.body.appendChild(iframe)

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
      iframeDoc.open()
      iframeDoc.write(`<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#fff}</style></head><body><div id="v-capture">${generateVoucherHTMLString(voucher)}</div></body></html>`)
      iframeDoc.close()

      // Wait for images inside iframe to load
      const imgs = iframeDoc.querySelectorAll("img")
      await Promise.all(Array.from(imgs).map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve()
        return new Promise(resolve => { img.onload = resolve; img.onerror = resolve })
      }))

      const html2canvas = (await import("html2canvas")).default
      const { default: jsPDF } = await import("jspdf")

      const target = iframeDoc.getElementById("v-capture")
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = (canvas.height * pdfW) / canvas.width
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH)
      pdf.save(`Booking_Voucher_${voucher.voucherId}.pdf`)

      document.body.removeChild(iframe)
      toast.success("PDF downloaded!")
    } catch (err) {
      console.error("PDF generation error:", err)
      toast.error("Failed to generate PDF: " + (err.message || "Unknown error"))
    } finally {
      setDownloading(false)
    }
  }, [])

  const deleteVoucher = async (id) => {
    if (!confirm("Delete this voucher?")) return
    try {
      await axios.delete(`${API}/api/booking-vouchers/${id}`)
      toast.success("Voucher deleted")
      fetchVouchers()
    } catch (err) { toast.error("Failed to delete voucher") }
  }

  const ordinal = (n) => { const s = ["th","st","nd","rd"]; const v = n % 100; return s[(v-20)%10]||s[v]||s[0] }
  const fmtDateRange = (v) => {
    const d1 = new Date(v.checkInDate), d2 = new Date(v.checkOutDate)
    const day1 = `${d1.getDate()}${ordinal(d1.getDate())}`, day2 = `${d2.getDate()}${ordinal(d2.getDate())}`
    const mon = d1.toLocaleDateString("en-GB", { month: "long" }), yr = d1.getFullYear()
    return `${day1}-${day2} ${mon} ${yr}, ${v.numberOfNights} Night${v.numberOfNights > 1 ? "s" : ""}`
  }
  const fmtIssuedDate = (d) => {
    const dt = new Date(d)
    return `${dt.getDate()}${ordinal(dt.getDate())}-${dt.getMonth()+1}-${dt.getFullYear()}`
  }

  const filtered = vouchers.filter(v =>
    v.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.voucherId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.hotelLodge?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Voucher HTML template used for both preview and PDF capture
  const renderVoucherHTML = (voucher, refProp) => {
    const totalGuests = Number(voucher.numberOfAdults) + Number(voucher.numberOfChildren)
    const adultsLabel = voucher.numberOfAdults > 1 ? "adults" : "adult"
    const kidsLabel = voucher.numberOfChildren !== 1 ? "kids" : "kid"
    
    return (
    <div ref={refProp}
      style={{ width: "794px", minHeight: "1000px", padding: "40px 50px", backgroundColor: "#fff", fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif", color: "#000", fontSize: "14px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src="/richworld-logo.png" alt="Richworld Safaris" style={{ height: "80px", objectFit: "contain" }} />
          <div style={{ color: "#f58220", fontWeight: "bold", fontSize: "14px", marginTop: "5px", letterSpacing: "1px" }}>MAGIC REDEFINED</div>
        </div>
        <img src="/hero-safari.jpg" alt="Safari" style={{ height: "120px", width: "150px", objectFit: "cover", borderRadius: "40px 60px 50px 40px" }} onError={(e) => { e.target.src = '/richworld-logo.png'; e.target.style.borderRadius = '0'; }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #ffcc00", paddingBottom: "8px", marginBottom: "12px", fontSize: "14px", fontWeight: "bold" }}>
        <span>www.richworldsafaris.com</span>
        <span>info@richworldsafaris.com</span>
        <span>+254 706 770371</span>
      </div>
      <div style={{ textAlign: "right", color: "#a0522d", fontWeight: "bold", fontSize: "14px", marginBottom: "20px" }}>
        Date Issued: {fmtIssuedDate(voucher.createdAt || new Date())}
      </div>
      <div style={{ textAlign: "center", marginBottom: "24px", color: "#1d3b66" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", letterSpacing: "1px", margin: 0 }}>BOOKING VOUCHER</h1>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "1px", margin: 0 }}>ID: {voucher.voucherId}</h2>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "8px", fontSize: "14px" }}>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #f4ccab", padding: "6px 10px", fontWeight: "bold", width: "100px", backgroundColor: "#fff" }}>Name</td>
            <td style={{ border: "1px solid #f4ccab", padding: "6px 10px", fontWeight: "bold", backgroundColor: "#fff" }}>Richworld safaris</td>
            <td rowSpan="3" style={{ border: "1px solid #f4ccab", padding: "6px 10px", fontWeight: "bold", textAlign: "center", backgroundColor: "#fff", width: "100px" }}>check-in<br/>dates</td>
            <td style={{ border: "1px solid #f4ccab", padding: "6px 10px", fontWeight: "bold", textAlign: "center", backgroundColor: "#fff", fontSize: "13px" }}>{voucher.hotelLodge}</td>
            <td style={{ border: "1px solid #f4ccab", padding: "6px 10px", fontWeight: "bold", textAlign: "center", backgroundColor: "#fff" }}>{fmtDateRange(voucher)}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #f4ccab", padding: "6px 10px", fontWeight: "bold", backgroundColor: "#fcebd7" }}>Booked by</td>
            <td style={{ border: "1px solid #f4ccab", padding: "6px 10px", fontWeight: "bold", backgroundColor: "#fcebd7" }}>Ken Mumo</td>
            <td style={{ border: "1px solid #f4ccab", padding: "6px 10px", backgroundColor: "#fcebd7" }}></td>
            <td style={{ border: "1px solid #f4ccab", padding: "6px 10px", backgroundColor: "#fcebd7" }}></td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #f4ccab", padding: "6px 10px", backgroundColor: "#fff" }}></td>
            <td style={{ border: "1px solid #f4ccab", padding: "6px 10px", backgroundColor: "#fff" }}></td>
            <td style={{ border: "1px solid #f4ccab", padding: "6px 10px", backgroundColor: "#fff" }}></td>
            <td style={{ border: "1px solid #f4ccab", padding: "6px 10px", backgroundColor: "#fff" }}></td>
          </tr>
        </tbody>
      </table>
      <div style={{ position: "relative", textAlign: "center", margin: "20px 0 20px", fontSize: "16px", fontWeight: "bold" }}>
        <div style={{ position: "absolute", left: "40px", top: "10px", width: "150px", borderBottom: "1px solid #000" }}></div>
        Client Name : {(voucher.guestName || "").toUpperCase()}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px", fontSize: "14px" }}>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #f4ccab", padding: "8px 10px", fontWeight: "bold", backgroundColor: "#fff", width: "140px" }}>Room Type</td>
            <td style={{ border: "1px solid #f4ccab", padding: "8px 10px", backgroundColor: "#fff" }}>{voucher.roomType || ""}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #f4ccab", padding: "8px 10px", fontWeight: "bold", backgroundColor: "#fcebd7" }}>Adults/ Kids</td>
            <td style={{ border: "1px solid #f4ccab", padding: "8px 10px", fontWeight: "bold", backgroundColor: "#fcebd7", textAlign: "center" }}>
              Guest in Total:{totalGuests}, {voucher.numberOfAdults} {adultsLabel}, {voucher.numberOfChildren} {kidsLabel} Residents.
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #f4ccab", padding: "8px 10px", backgroundColor: "#fff" }}></td>
            <td style={{ border: "1px solid #f4ccab", padding: "8px 10px", backgroundColor: "#fff" }}></td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #f4ccab", padding: "8px 10px", fontWeight: "bold", backgroundColor: "#fcebd7" }}>Meal Plan</td>
            <td style={{ border: "1px solid #f4ccab", padding: "8px 10px", fontWeight: "bold", backgroundColor: "#fcebd7" }}>{voucher.mealPlan}</td>
          </tr>
        </tbody>
      </table>
      {voucher.remarks && (
        <div style={{ color: "#000", fontWeight: "bold", fontSize: "14px", marginBottom: "24px", marginLeft: "40px" }}>
          REMARKS: {voucher.remarks}
        </div>
      )}
      <div style={{ color: "#1d3b66", fontWeight: "bold", fontSize: "15px", marginBottom: "28px", marginLeft: "40px" }}>
        PAYMENT: A deposit will be made
      </div>
      <div style={{ fontSize: "14px", lineHeight: "1.6", marginLeft: "40px" }}>
        <p style={{ margin: 0, fontWeight: "bold" }}>Ken Mumo</p>
        <p style={{ margin: 0, fontWeight: "bold" }}>Director</p>
        <p style={{ margin: 0, fontWeight: "bold" }}>Rich World Safaris</p>
        <p style={{ margin: 0, fontWeight: "bold" }}>Phone: +254 706 770 371</p>
        <p style={{ margin: 0, fontWeight: "bold" }}>Email: info@richworldsafaris.com</p>
        <p style={{ margin: 0, fontWeight: "bold" }}>Website: www.richworldsafaris.com</p>
        <p style={{ margin: 0, fontWeight: "bold" }}>Location: Biashara street Laxmi plaza building 3rd floor RM 9</p>
      </div>
    </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Booking Vouchers</h1>
            <p className="text-muted-foreground">Create and manage hotel booking vouchers</p>
          </div>
          <Button onClick={() => { setShowForm(!showForm); setShowPreview(false) }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" />{showForm ? "Hide Form" : "New Voucher"}
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg">
              <CardTitle className="text-orange-800 flex items-center gap-2"><FileText className="h-5 w-5" />Create Booking Voucher</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Hotel / Lodge *</label>
                  <Input required value={form.hotelLodge} onChange={e => handleChange("hotelLodge", e.target.value)} placeholder="e.g. Sopa Lodge Masai Mara" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">From *</label>
                  <Input required value={form.from} onChange={e => handleChange("from", e.target.value)} placeholder="e.g. Ken Mumo" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Guest Name *</label>
                  <Input required value={form.guestName} onChange={e => handleChange("guestName", e.target.value)} placeholder="Full name" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Nationality *</label>
                  <Input required value={form.nationality} onChange={e => handleChange("nationality", e.target.value)} placeholder="e.g. Kenyan" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Phone Number *</label>
                  <Input required type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="+254..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Check-in Date *</label>
                  <Input required type="date" value={form.checkInDate} onChange={e => handleChange("checkInDate", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Check-out Date *</label>
                  <Input required type="date" value={form.checkOutDate} onChange={e => handleChange("checkOutDate", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Room Type *</label>
                  <Input required value={form.roomType} onChange={e => handleChange("roomType", e.target.value)} placeholder="e.g. Double Room" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Meal Plan *</label>
                  <Select value={form.mealPlan} onValueChange={v => handleChange("mealPlan", v)}>
                    <SelectTrigger><SelectValue placeholder="Select meal plan" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Board meal plan">Full Board</SelectItem>
                      <SelectItem value="Half Board meal plan">Half Board</SelectItem>
                      <SelectItem value="Bed and Breakfast">Bed & Breakfast</SelectItem>
                      <SelectItem value="All Inclusive">All Inclusive</SelectItem>
                      <SelectItem value="Room Only">Room Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">No. of Rooms *</label>
                  <Input required type="number" min="0" value={form.numberOfRooms} onChange={e => handleChange("numberOfRooms", e.target.value === "" ? "" : parseInt(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">No. of Adults *</label>
                  <Input required type="number" min="0" value={form.numberOfAdults} onChange={e => handleChange("numberOfAdults", e.target.value === "" ? "" : parseInt(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">No. of Children</label>
                  <Input type="number" min="0" value={form.numberOfChildren} onChange={e => handleChange("numberOfChildren", e.target.value === "" ? "" : parseInt(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">No. of Nights</label>
                  <Input type="number" min="1" value={form.numberOfNights} readOnly className="bg-muted" />
                </div>
                <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium text-foreground">Remarks</label>
                  <Input value={form.remarks} onChange={e => handleChange("remarks", e.target.value)} placeholder="e.g. Please book and confirm 2 rooms, 1 double room and 1 room on twin beds" />
                </div>
                <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white min-w-[180px]">
                    {loading ? "Creating..." : "Create & Download Voucher"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Voucher Preview (visible on screen) */}
        {showPreview && previewVoucher && (
          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg">
              <CardTitle className="text-orange-800">Voucher Preview</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" disabled={downloading} onClick={() => downloadPDF(previewVoucher)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                  <Download className="h-4 w-4 mr-1" />{downloading ? "Generating..." : "Download PDF"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 overflow-x-auto flex justify-center">
              {renderVoucherHTML(previewVoucher, null)}
            </CardContent>
          </Card>
        )}



        {/* Saved Vouchers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Vouchers</CardTitle>
            <div className="relative max-w-sm mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by guest, ID or hotel..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Voucher ID</TableHead>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Hotel/Lodge</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Nights</TableHead>
                    <TableHead>Rooms</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(v => (
                    <TableRow key={v._id} className="hover:bg-muted/50 transition-colors">
                      <TableCell><Badge variant="outline" className="font-mono">{v.voucherId}</Badge></TableCell>
                      <TableCell className="font-medium">{v.guestName}</TableCell>
                      <TableCell>{v.hotelLodge}</TableCell>
                      <TableCell>{new Date(v.checkInDate).toLocaleDateString()}</TableCell>
                      <TableCell>{v.numberOfNights}</TableCell>
                      <TableCell>{v.numberOfRooms}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(v.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => { setPreviewVoucher(v); setShowPreview(true) }}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" disabled={downloading} className="text-green-600 hover:text-green-700" onClick={() => downloadPDF(v)}>
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => deleteVoucher(v._id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground">No vouchers found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
