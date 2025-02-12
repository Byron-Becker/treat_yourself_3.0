import { BaseService } from '@/lib/supabase/services/base'
import { 
  InitialExamRecord, 
  LessonCompletionRecord 
} from '../types/api.types'
import { BaseResponse } from '../types/service.types'

export class DashboardService extends BaseService {
  private readonly examTable = 'initial_exams'
  private readonly completionsTable = 'lesson_completions'
  private readonly romTable = 'rom_assessments'

  async getInitialExamStatus(): Promise<BaseResponse<InitialExamRecord>> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(this.token)
      const { data, error } = await client
        .from(this.examTable)
        .select('*')
        .maybeSingle()

      if (error) throw error

      return { data, error: null }
    })
  }

  async getLessonCompletions(): Promise<BaseResponse<LessonCompletionRecord[]>> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(this.token)
      const { data, error } = await client
        .from(this.completionsTable)
        .select('*')
        .order('completed_at', { ascending: false })

      if (error) throw error

      return { data, error: null }
    })
  }

  async hasRecentROMAssessment(): Promise<BaseResponse<boolean>> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(this.token)
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

      const { count, error } = await client
        .from(this.romTable)
        .select('*', { count: 'exact', head: true })
        .gte('created_at', threeDaysAgo.toISOString())

      if (error) throw error

      return { data: count ? count > 0 : false, error: null }
    })
  }
}