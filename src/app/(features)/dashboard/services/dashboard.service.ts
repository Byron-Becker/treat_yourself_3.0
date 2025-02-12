import { SupabaseClient } from '@supabase/supabase-js'
import { 
  InitialExamRecord, 
  LessonCompletionRecord 
} from '../types/api.types'
import { BaseResponse } from '../types/service.types'

export class DashboardService {
  constructor(private readonly client: SupabaseClient) {}

  async getInitialExamStatus(): Promise<BaseResponse<InitialExamRecord>> {
    try {
      const { data, error } = await this.client
        .from('initial_exams')
        .select('*')
        .maybeSingle()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      }
    }
  }

  async getLessonCompletions(): Promise<BaseResponse<LessonCompletionRecord[]>> {
    try {
      const { data, error } = await this.client
        .from('lesson_completions')
        .select('*')
        .order('completed_at', { ascending: false })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      }
    }
  }

  async hasRecentROMAssessment(): Promise<BaseResponse<boolean>> {
    try {
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

      const { count, error } = await this.client
        .from('rom_assessments')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', threeDaysAgo.toISOString())

      if (error) throw error

      return { data: count ? count > 0 : false, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Unknown error') 
      }
    }
  }
}