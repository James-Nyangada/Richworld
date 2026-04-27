"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  ImageIcon,
  X,
  Loader2,
} from "lucide-react"

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [caption, setCaption] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const API = process.env.NEXT_PUBLIC_API_URL

  // Fetch all gallery images
  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      const res = await axios.get(`${API}/api/gallery`)
      setGalleryImages(res.data)
    } catch (error) {
      console.error("Error fetching gallery images:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle file selection
  const handleFileSelect = (files) => {
    const newFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: Date.now() + Math.random(),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }))
    setSelectedFiles((prev) => [...prev, ...newFiles])
  }

  const removeSelectedFile = (fileId) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId)
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.preview)
      return prev.filter((f) => f.id !== fileId)
    })
  }

  // Drag & drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"))
    if (files.length > 0) handleFileSelect(files)
  }

  // Upload images
  const handleUpload = async (e) => {
    e.preventDefault()
    if (selectedFiles.length === 0 || !caption.trim()) return

    setUploading(true)
    try {
      const data = new FormData()
      data.append("caption", caption.trim())
      selectedFiles.forEach((f) => data.append("images", f.file))

      await axios.post(`${API}/api/gallery`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // Reset form
      setCaption("")
      selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview))
      setSelectedFiles([])
      fetchGalleryImages()
      toast.success(`${selectedFiles.length} image${selectedFiles.length > 1 ? "s" : ""} uploaded successfully`)
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error("Failed to upload images. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  // Toggle visibility
  const toggleVisibility = async (imageId) => {
    try {
      const res = await axios.patch(`${API}/api/gallery/${imageId}/visibility`)
      setGalleryImages((prev) =>
        prev.map((img) => (img._id === imageId ? res.data : img))
      )
    } catch (error) {
      console.error("Error toggling visibility:", error)
    }
  }

  // Delete image
  const deleteImage = async (imageId) => {
    if (!confirm("Are you sure you want to delete this image?")) return
    try {
      await axios.delete(`${API}/api/gallery/${imageId}`)
      setGalleryImages((prev) => prev.filter((img) => img._id !== imageId))
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  // Filter images by search
  const filteredImages = galleryImages.filter((img) =>
    img.caption.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const visibleCount = galleryImages.filter((img) => img.isVisible).length
  const hiddenCount = galleryImages.filter((img) => !img.isVisible).length

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Gallery Management</h1>
          <p className="text-muted-foreground">Upload and manage gallery images for the website</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Images</p>
                  <p className="text-2xl font-bold text-primary">{galleryImages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Visible</p>
                  <p className="text-2xl font-bold text-green-600">{visibleCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <EyeOff className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Hidden</p>
                  <p className="text-2xl font-bold text-gray-500">{hiddenCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Images</CardTitle>
            <CardDescription>Add new images to the gallery. You can upload multiple images at once.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              {/* Caption Input */}
              <div className="space-y-2">
                <Label htmlFor="caption">Caption *</Label>
                <Input
                  id="caption"
                  type="text"
                  placeholder="Enter a caption for the images..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  required
                  className="border-input focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  This caption will be displayed below each image on the website.
                </p>
              </div>

              {/* Drag & Drop Zone */}
              <div className="space-y-4">
                <Label>Images *</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50"
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
                      <p className="text-lg font-medium">Upload Gallery Images</p>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop images here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports: JPG, PNG, GIF, HEIF up to 10MB each
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("gallery-upload").click()}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Choose Images
                    </Button>
                    <input
                      id="gallery-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* File Previews */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">
                      Selected Images ({selectedFiles.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedFiles.map((file) => (
                        <div key={file.id} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeSelectedFile(file.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCaption("")
                    selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview))
                    setSelectedFiles([])
                  }}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  disabled={uploading || selectedFiles.length === 0 || !caption.trim()}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Management Section */}
        <Card>
          <CardHeader>
            <CardTitle>All Gallery Images</CardTitle>
            <CardDescription>Manage visibility and delete images. Click the eye icon to toggle frontend visibility.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by caption..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <Card
                  key={image._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="relative aspect-square">
                    <img
                      src={image.imageUrl}
                      alt={image.caption}
                      className="w-full h-full object-cover"
                    />
                    {/* Visibility Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={image.isVisible ? "default" : "secondary"}
                        className={
                          image.isVisible
                            ? "bg-green-500/90 hover:bg-green-600 text-white"
                            : "bg-gray-500/90 hover:bg-gray-600 text-white"
                        }
                      >
                        {image.isVisible ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-foreground line-clamp-2 mb-3">
                      {image.caption}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {new Date(image.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleVisibility(image._id)}
                        className={
                          image.isVisible
                            ? "text-green-600 border-green-200 hover:bg-green-50"
                            : "text-gray-500 border-gray-200 hover:bg-gray-50"
                        }
                      >
                        {image.isVisible ? (
                          <Eye className="h-4 w-4 mr-1" />
                        ) : (
                          <EyeOff className="h-4 w-4 mr-1" />
                        )}
                        {image.isVisible ? "Visible" : "Hidden"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteImage(image._id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "No images found matching your search."
                    : "No gallery images yet. Upload some above!"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
