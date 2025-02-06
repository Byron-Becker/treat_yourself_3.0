// src/features/user-profile/services/profile.service.ts

import { BaseService } from '@/lib/supabase/services/base'
import type { UserProfile, CreateUserProfile, UpdateUserProfile } from '../types/profile.types'

export class UserProfileService extends BaseService {
  private readonly table = 'user_profiles'

  async getProfile(userId: string, token?: string | null): Promise<UserProfile | null> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.table)
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      
      if (error) throw error
      return data
    })
  }

  async createProfile(profile: CreateUserProfile & { id: string }, token?: string | null): Promise<UserProfile> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)

      const { data, error } = await client
        .from(this.table)
        .insert(profile)
        .select()
        .single()
      
      if (error) throw error
      return data
    })
  }

  async updateProfile(userId: string, updates: UpdateUserProfile, token?: string | null): Promise<UserProfile> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.table)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    })
  }
}

export const userProfileService = new UserProfileService()