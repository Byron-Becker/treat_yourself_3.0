export interface BaseResponse<T> {
    data: T | null
    error: Error | null
  }
  
  export interface QueryOptions {
    from?: string
    to?: string
    limit?: number
  }
  
  export interface DatabaseRecord {
    created_at: string
    updated_at?: string
  }