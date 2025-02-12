import { BaseService } from '@/lib/supabase/services/base'
import { LessonCompletionRecord } from '../types/api.types'
import { BaseResponse, QueryOptions } from '../types/service.types'

export class ProgressService extends BaseService {
  private readonly table = 'exercise_series'

  async getActivityDates(options?: QueryOptions): Promise<BaseResponse<string[]>> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(this.token)
      let query = client
        .from(this.table)
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
    })
  }

  async getLessonProgress(): Promise<BaseResponse<LessonCompletionRecord[]>> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(this.token)
      const { data, error } = await client
        .from('lesson_completions')
        .select('*')

      if (error) throw error

      return { data, error: null }
    })
  }
}