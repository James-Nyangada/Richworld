"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Eye, Calendar, MapPin, User, Phone, Mail, CreditCard } from "lucide-react"

import axios from "axios"

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState(null)
  const API = process.env.NEXT_PUBLIC_API_URL;

useEffect(() => {
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API}/api/bookings`)
      setBookings(res.data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    }
  }
  fetchBookings()
}, [])


const updateStatus = async (bookingId, field, value) => {
  try {
    const payload = { [field]: value };
    const res = await axios.put(
      `${API}/api/bookings/${bookingId}/status`,
      payload
    )
    setBookings(bookings.map(b => (b._id === bookingId ? res.data : b)))
  } catch (error) {
    console.error(`Error updating ${field}:`, error)
  }
}



  const filteredBookings = bookings.filter((booking) => {
  const customerName = booking.fullName || ""
  const packageName = booking.selectedPackage || ""
  const bookingId = booking._id || ""

  const matchesSearch =
    customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookingId.toLowerCase().includes(searchTerm.toLowerCase())

  const matchesStatus = statusFilter === "all" || booking.status === statusFilter
  const matchesPaymentStatus = paymentStatusFilter === "all" || booking.paymentStatus === paymentStatusFilter

  return matchesSearch && matchesStatus && matchesPaymentStatus
})


  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Booking Management</h1>
          <p className="text-muted-foreground">Manage and track all customer bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Bookings</p>
                  <p className="text-2xl font-bold text-primary">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Paid Bookings</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter((b) => b.paymentStatus === "paid").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Pending Payment</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {bookings.filter((b) => b.paymentStatus !== "paid").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary">
                    KES {bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>View and manage customer bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer name, package, or booking ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Booking Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                   <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
               <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bookings Table */}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Customer</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Travel Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Booking Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking._id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.fullName}</p>
                          <p className="text-sm text-muted-foreground">{booking.email}</p>
                           <p className="text-xs text-muted-foreground">{booking.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.selectedPackage}</p>
                          <p className="text-xs text-muted-foreground">
                             {booking.numberOfAdults} Adults
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(booking.travelStartDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold">KES {booking.amount?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{booking.paymentMethod || 'Unspecified'}</p>
                        </div>
                      </TableCell>
                       <TableCell>
                         <Select
                            value={booking.status}
                            onValueChange={(value) => updateStatus(booking._id, 'status', value)}
                          >
                            <SelectTrigger className="w-28 h-7 text-xs border-none shadow-none bg-transparent hover:bg-gray-100">
                               <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                      </TableCell>
                      <TableCell>
                         <Select
                            value={booking.paymentStatus}
                            onValueChange={(value) => updateStatus(booking._id, 'paymentStatus', value)}
                          >
                            <SelectTrigger className="w-28 h-7 text-xs border-none shadow-none bg-transparent hover:bg-gray-100">
                               <Badge variant={booking.paymentStatus === "paid" ? "outline" : "destructive"} className={booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 border-green-200' : ''}>
                                   {booking.paymentStatus}
                               </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Booking Details</DialogTitle>
                              <DialogDescription>ID: {booking.bookingId}</DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Customer Information */}
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-lg flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    Customer Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                                    <p className="font-medium">{booking.fullName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="flex items-center">
                                      <Mail className="h-4 w-4 mr-2" />
                                      {booking.email}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                    <p className="flex items-center">
                                      <Phone className="h-4 w-4 mr-2" />
                                      {booking.phone}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Booking Information */}
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-lg flex items-center">
                                    <Calendar className="h-5 w-5 mr-2" />
                                    Booking Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Package</p>
                                    <p className="font-medium">{booking.selectedPackage}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Travel Dates</p>
                                    <p>{new Date(booking.travelStartDate).toLocaleDateString()} - {new Date(booking.travelEndDate).toLocaleDateString()}</p>
                                  </div>
                                   <div>
                                    <p className="text-sm font-medium text-muted-foreground">Guests</p>
                                    <p>{booking.numberOfAdults} Adults, {booking.numberOfChildren} Children</p>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Payment Information */}
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-lg flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Payment Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                    <p className="font-bold text-lg">KES {booking.amount?.toLocaleString()}</p>
                                  </div>
                                  
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                                    <p>{booking.paymentMethod}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tracking ID</p>
                                    <p className="text-xs font-mono">{booking.pesapalTrackingId || 'N/A'}</p>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Special Requests */}
                              {booking.specialRequests && (
                                <Card className="md:col-span-2">
                                    <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Special Requests</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                    <p className="text-sm text-gray-700">{booking.specialRequests}</p>
                                    </CardContent>
                                </Card>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No bookings found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
