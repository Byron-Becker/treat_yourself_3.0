import { type ToastProps } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
import { AppError } from './base'
import { ErrorCode } from './codes'

interface ErrorToastConfig {
  [key: string]: {
    title: string
    variant: ToastProps['variant']
  }
}

const ERROR_TOAST_CONFIG: ErrorToastConfig = {
  [ErrorCode.AUTH_ERROR]: {
    title: 'Authentication Error',
    variant: 'destructive',
  },
  [ErrorCode.VALIDATION_ERROR]: {
    title: 'Validation Error',
    variant: 'destructive',
  },
  [ErrorCode.NETWORK_ERROR]: {
    title: 'Network Error',
    variant: 'destructive',
  },
  [ErrorCode.NOT_FOUND]: {
    title: 'Not Found',
    variant: 'destructive',
  },
  DEFAULT: {
    title: 'Error',
    variant: 'destructive',
  },
}

export function logError(error: unknown) {
  if (error instanceof AppError) {
    console.error(`[${error.code}] ${error.message}`, {
      details: error.details,
      timestamp: error.timestamp,
      stack: error.stack,
    })
  } else {
    console.error('Unhandled error:', error)
  }
}

export function useErrorHandler() {
  const { toast } = useToast()

  return (error: unknown) => {
    // Log the error
    logError(error)

    // Show toast notification
    if (error instanceof AppError) {
      const config = ERROR_TOAST_CONFIG[error.code] || ERROR_TOAST_CONFIG.DEFAULT
      toast({
        title: config.title,
        description: error.message,
        variant: config.variant,
      })
      return
    }

    // Handle unknown errors
    toast({
      title: ERROR_TOAST_CONFIG.DEFAULT.title,
      description: 'An unexpected error occurred',
      variant: 'destructive',
    })
  }
}

// API error handler middleware
export async function apiErrorHandler(error: unknown) {
  if (error instanceof AppError) {
    return new Response(JSON.stringify(error.toJSON()), {
      status: error.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const appError = new AppError(
    'An unexpected error occurred',
    ErrorCode.INTERNAL_ERROR,
    500,
    error
  )
  
  return new Response(JSON.stringify(appError.toJSON()), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  })
} 