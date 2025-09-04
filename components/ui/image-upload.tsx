'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { uploadImage, validateImageFile, generateFileName } from '@/lib/utils/upload'

interface ImageUploadProps {
  currentImageUrl?: string
  onUpload: (url: string) => void
  onError: (error: string) => void
  bucket: 'organization-logos' | 'event-images'
  filePrefix: string
  label: string
  className?: string
}

export function ImageUpload({
  currentImageUrl,
  onUpload,
  onError,
  bucket,
  filePrefix,
  label,
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      onError(validation.error!)
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => setPreviewUrl(e.target?.result as string)
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    try {
      const fileName = generateFileName(file.name, filePrefix)
      const { url, error } = await uploadImage(file, bucket, fileName)
      
      if (error) {
        onError(error)
        setPreviewUrl(null)
      } else if (url) {
        onUpload(url)
      }
    } catch (err) {
      onError('Failed to upload image')
      setPreviewUrl(null)
    } finally {
      setUploading(false)
    }
  }

  const clearImage = () => {
    setPreviewUrl(null)
    onUpload('')
  }

  const displayUrl = previewUrl || currentImageUrl

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-white mb-2">
        {label}
      </label>
      
      <div className="flex items-center gap-4">
        {/* Image Preview */}
        <div className="w-24 h-24 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center overflow-hidden">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt={label}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="h-8 w-8 text-zinc-500" />
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            {/* File Input */}
            <label className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              <div className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all cursor-pointer hover:bg-zinc-700 flex items-center justify-center gap-2">
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Choose Image'}
              </div>
            </label>

            {/* Clear Button */}
            {displayUrl && (
              <button
                type="button"
                onClick={clearImage}
                className="p-3 bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 rounded text-white transition-all"
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <p className="text-xs text-zinc-500">
            Upload JPEG, PNG, or WebP (max 5MB)
          </p>
        </div>
      </div>
    </div>
  )
}