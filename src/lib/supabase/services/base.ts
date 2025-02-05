// src/lib/supabase/services/base.ts

import { SupabaseClient } from '@supabase/supabase-js'
import { SupabaseError } from '../errors/supabase'
import SupabaseClientSingleton from '../client-singleton'

export abstract class BaseService {
  protected supabase: SupabaseClient | null = null
  
  constructor(protected token?: string | null) {}
  
  protected async getClient(token?: string | null): Promise<SupabaseClient> {
    try {
      this.supabase = await SupabaseClientSingleton.getInstance(token)
      return this.supabase
    } catch (error) {
      throw SupabaseError.fromError(error)
    }
  }

  protected handleError(error: unknown): never {
    throw SupabaseError.fromError(error)
  }

  protected async withErrorHandling<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      this.handleError(error)
    }
  }
}