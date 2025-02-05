
import { createClient, SupabaseClient } from '@supabase/supabase-js'

class SupabaseClientSingleton {
  private static instance: SupabaseClient | null = null
  private static currentToken: string | null = null

  private constructor() {}

  static async getInstance(token?: string | null): Promise<SupabaseClient> {
    try {
      // If instance exists and token hasn't changed, return existing instance
      if (this.instance && token === this.currentToken) {
        return this.instance
      }

      // Create new instance with updated token
      this.currentToken = token || null
      this.instance = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_KEY!,
        {
          global: {
            headers: token ? {
              Authorization: `Bearer ${token}`
            } : {}
          },
          auth: {
            persistSession: false
          }
        }
      )

      return this.instance
    } catch (error) {
      console.error('Error getting Supabase instance:', error)
      throw error
    }
  }

  static resetInstance(): void {
    this.instance = null
    this.currentToken = null
  }
}

export default SupabaseClientSingleton

