"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, ImageIcon, Star } from "lucide-react"
import axios from "axios"

export default function AddTestimonialPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    packageName: "",
    rating: "",
    title: "",
    comment: "",
  })
  const [images, setImages] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

  // 🔹 Fetch packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API}/api/packages`)
        const data = await res.json()
        setPackages(data)
      } catch (err) {
        console.error("Error fetching packages:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }))
    setImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (imageId) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === imageId)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return prev.filter((img) => img.id !== imageId)
    })
  
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    if (files.length > 0) {
      handleImageUpload(files)
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    // Prepare formData for multipart/form-data
    const data = new FormData()
    data.append("name", formData.name)
    data.append("email", formData.email)
    data.append("packageName", formData.packageName)
    data.append("rating", formData.rating)
    data.append("title", formData.title)
    data.append("comment", formData.comment)

    images.forEach((img) => {
      data.append("images", img.file) // same field name as in Multer
    })

    const res = await axios.post(`${API}/api/testimonials`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("✅ Testimonial created:", res.data)
    alert("Testimonial submitted successfully!")

    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      packageName: "",
      rating: "",
      title: "",
      comment: "",
    })
    setImages([])
  } catch (error) {
    console.error("❌ Error submitting testimonial:", error.response?.data || error.message)
    alert("Something went wrong while submitting testimonial")
  }

  // 🔹 Fetch packages from backend
    useEffect(() => {
      const fetchPackages = async () => {
        try {
          const res = await fetch(`${API}/api/packages`)
          const data = await res.json()
          setPackages(data)
        } catch (err) {
          console.error("Error fetching packages:", err)
        } finally {
          setLoading(false)
        }
      }
      fetchPackages()
    }, [])
}

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 cursor-pointer transition-colors ${
          i < rating ? "text-yellow-500 fill-current" : "text-gray-300 hover:text-yellow-400"
        }`}
        onClick={() => handleInputChange("rating", i + 1)}
      />
    ))
  }

  return (
    <div className="m-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-8 mt-[100px]">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Add New Testimonial</h1>
          <p className="text-muted-foreground">Create a new customer testimonial</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Testimonial Details</CardTitle>
            <CardDescription>Fill in the customer testimonial information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Customer Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter customer name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="border-input focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="border-input focus:border-primary"
                  />
                </div>
              </div>

              {/* Package and Rating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="package">Package Name *</Label>
                  <Select
                    value={formData.packageName}
                    onValueChange={(value) => handleInputChange("packageName", value)}
                  >
                    <SelectTrigger className="border-input focus:border-primary">
                      <SelectValue placeholder={loading ? "Loading packages..." : "Select package"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading" disabled>Loading packages...</SelectItem>
                      ) : packages.length > 0 ? (
                        packages.map((pkg) => (
                          <SelectItem key={pkg._id} value={pkg.name}>
                            {pkg.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-packages" disabled>No packages available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rating *</Label>
                  <div className="flex items-center space-x-1 pt-2">
                    {renderStars(Number.parseInt(formData.rating) || 0)}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {formData.rating ? `${formData.rating}/5` : "Select rating"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Testimonial Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Testimonial Title *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter testimonial title (e.g., 'Amazing Experience in Bali!')"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  className="border-input focus:border-primary"
                />
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="comment">Customer Comment *</Label>
                <Textarea
                  id="comment"
                  placeholder="Enter the customer's detailed testimonial and experience..."
                  value={formData.comment}
                  onChange={(e) => handleInputChange("comment", e.target.value)}
                  required
                  rows={6}
                  className="border-input focus:border-primary placeholder:text-muted-foreground/60"
                />
                <p className="text-xs text-muted-foreground">
                  Share the customer's experience, highlights, and feedback about the package.
                </p>
              </div>

              {/* Images Upload Section */}
              <div className="space-y-4">
                <Label>Testimonial Images</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Upload Testimonial Images</p>
                      <p className="text-sm text-muted-foreground">Drag and drop images here, or click to browse</p>
                      <p className="text-xs text-muted-foreground">Supports: JPG, PNG, GIF, heif, heic up to 10MB each</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image-upload").click()}
                      className="mt-4"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Choose Images
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Uploaded Images ({images.length})</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                            <img
                              src={image.preview || "/placeholder.svg"}
                              alt={image.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(image.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{image.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Add Testimonial
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
