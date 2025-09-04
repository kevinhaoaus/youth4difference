import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

/**
 * Validates file before upload
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Please upload a valid image (JPEG, PNG, or WebP)' }
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'File size must be less than 5MB' }
  }
  
  return { isValid: true }
}

/**
 * Uploads image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  bucket: 'organization-logos' | 'event-images',
  fileName: string
): Promise<{ url?: string; error?: string }> {
  try {
    // Validate file
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      return { error: validation.error }
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('Storage upload error:', error)
      return { error: 'Failed to upload image' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { url: publicUrl }
  } catch (error) {
    console.error('Upload error:', error)
    return { error: 'Failed to upload image' }
  }
}

/**
 * Deletes image from Supabase Storage
 */
export async function deleteImage(
  bucket: 'organization-logos' | 'event-images',
  fileName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])

    if (error) {
      console.error('Storage delete error:', error)
      return { success: false, error: 'Failed to delete image' }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error: 'Failed to delete image' }
  }
}

/**
 * Generates unique filename with timestamp and random suffix
 */
export function generateFileName(originalName: string, prefix: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  return `${prefix}-${timestamp}-${random}.${extension}`
}