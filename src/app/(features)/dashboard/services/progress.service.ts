import { SupabaseClient } from '@supabase/supabase-js'
import { LessonCompletionRecord } from '../types/api.types'
import { BaseResponse, QueryOptions } from '../types/service.types'

export class ProgressService {
  constructor(private readonly client: SupabaseClient) {}

  async getActivityDates(options?: QueryOptions): Promise<BaseResponse<string[]>> {
    try {
      let query = this.client
        .from('exercise_series')
        .select('completed_at')
        .eq('status', 'completed')

      if (options?.from) {
        query = query.gte('completed_at', options.from)
      }
      if (options?.to) {
        query = query.lte('completed_at', options.to)
      }

      const { data, error } = await query

      if (error) throw error

      return { 
        data: data.map(record => record.completed_at.split('T')[0]),
        error: null 
      }
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      }
    }
  }

  async getLessonProgress(): Promise<BaseResponse<LessonCompletionRecord[]>> {
    try {
      const { data, error } = await this.client
        .from('lesson_completions')
        .select('*')

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      }
    }
  }
}