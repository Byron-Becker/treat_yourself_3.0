// src/lib/supabase/errors/supabase.ts

export class SupabaseError extends Error {
    constructor(
      message: string,
      public code: string,
      public status?: number,
      public details?: unknown
    ) {
      super(message)
      this.name = 'SupabaseError'
    }
  
    static fromError(error: unknown): SupabaseError {
      if (error instanceof SupabaseError) {
        return error
      }
  
      // PostgreSQL error codes
      const pgErrorCodes = {
        '23505': 'UNIQUE_VIOLATION',
        '23503': 'FOREIGN_KEY_VIOLATION',
        '42P01': 'UNDEFINED_TABLE',
      }
  
      // Handle Supabase errors
      if (error && typeof error === 'object' && 'code' in error) {
        const code = error.code as string
        const message = 'message' in error ? String(error.message) : 'Unknown error'
        const status = 'status' in error ? Number(error.status) : undefined
        
        return new SupabaseError(
          message,
          pgErrorCodes[code as keyof typeof pgErrorCodes] || code,
          status,
          error
        )
      }
  
      // Handle unknown errors
      return new SupabaseError(
        error instanceof Error ? error.message : 'Unknown error',
        'UNKNOWN_ERROR',
        500,
        error
      )
    }
  }
  
  export const isSupabaseError = (error: unknown): error is SupabaseError => {
    return error instanceof SupabaseError
  }