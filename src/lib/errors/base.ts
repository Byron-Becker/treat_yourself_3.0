import { ErrorCode } from './codes'

export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public status: number = 500,
    public details?: unknown,
    public timestamp: Date = new Date()
  ) {
    super(message)
    this.name = 'AppError'
    // Maintains proper stack trace for where error was thrown (if available)
    if (Error.captureStackTrace && typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error().stack
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, details)
    this.name = 'ValidationError'
  }
}

export class AuthError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCode.AUTH_ERROR, 401, details)
    this.name = 'AuthError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCode.NOT_FOUND, 404, details)
    this.name = 'NotFoundError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCode.NETWORK_ERROR, 503, details)
    this.name = 'NetworkError'
  }
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError
} 