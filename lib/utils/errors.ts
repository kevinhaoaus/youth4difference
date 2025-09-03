// Error handling utilities
import { AppError } from '@/lib/types'

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'An unexpected error occurred'
}

export function isAuthError(error: unknown): boolean {
  if (!error) return false
  const message = getErrorMessage(error).toLowerCase()
  return message.includes('auth') || 
         message.includes('login') || 
         message.includes('password') ||
         message.includes('credentials')
}

export function isDatabaseError(error: unknown): boolean {
  if (!error) return false
  const message = getErrorMessage(error).toLowerCase()
  return message.includes('database') || 
         message.includes('supabase') || 
         message.includes('relation') ||
         message.includes('permission') ||
         message.includes('policy')
}

export function createAppError(message: string, code?: string, details?: unknown): AppError {
  return { message, code, details }
}