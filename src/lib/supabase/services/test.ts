// src/lib/supabase/services/test.ts

import { BaseService } from './base'
import type { TestItem, CreateTestItem, UpdateTestItem } from '../types/test'

export class TestService extends BaseService {
  private readonly table = 'test_items'

  async getAll(token?: string | null): Promise<TestItem[]> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.table)
        .select('*')
      
      if (error) throw error
      return data
    })
  }

  async create(item: CreateTestItem, token?: string | null): Promise<TestItem> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      
      // Get the user_id from the JWT claims
      const { data: claims, error: claimsError } = await client.rpc('requesting_user_id')
      if (claimsError) throw claimsError
      if (!claims) throw new Error('No user ID found in JWT claims')

      // Insert with explicit user_id
      const { data, error } = await client
        .from(this.table)
        .insert({ ...item, user_id: claims })
        .select()
        .single()
      
      if (error) throw error
      return data
    })
  }

  async update(id: string, updates: UpdateTestItem, token?: string | null): Promise<TestItem> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.table)
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    })
  }

  async delete(id: string, token?: string | null): Promise<void> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { error } = await client
        .from(this.table)
        .delete()
        .eq('id', id)
      
      if (error) throw error
    })
  }

  async testGetUser() {
    const client = await this.getClient()
    const { data: { user }, error } = await client.auth.getUser()
    
    console.log('User data:', user);
    console.log('Error:', error);
  }
}

export const testService = new TestService()