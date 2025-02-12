import { SupabaseClient } from '@supabase/supabase-js'
import { ExerciseRecord } from '../types/api.types'
import { BaseResponse, QueryOptions } from '../types/service.types'

export class ActivityService {
  constructor(private readonly client: SupabaseClient) {}

  async getRecentActivity(options?: QueryOptions): Promise<BaseResponse<ExerciseRecord[]>> {
    try {
      let query = this.client
        .from('exercise_series')
        .select('*')
        .order('completed_at', { ascending: false })

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      }
    }
  }

  async getCurrentStreak(): Promise<BaseResponse<number>> {
    try {
      const { data: dates, error } = await this.client
        .from('exercise_series')
        .select('completed_at')
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })

      if (error) throw error

      // Calculate streak logic
      const streak = this.calculateStreak(dates.map(d => d.completed_at))

      return { data: streak, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      }
    }
  }

  private calculateStreak(dates: string[]): number {
    if (!dates.length) return 0

    // const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString().split('T')[0]

    const lastActivity = dates[0].split('T')[0]
    if (lastActivity < yesterday) return 0

    let streak = 1
    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i])
      const prevDate = new Date(dates[i - 1])
      
      const diffDays = Math.floor(
        (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      
      if (diffDays === 1) streak++
      else break
    }

    return streak
  }
}