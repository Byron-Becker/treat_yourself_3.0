import { BaseService } from '@/lib/supabase/services/base'
import type { ExamAttempt, CreateExamAttempt, UpdateExamAttempt } from '../types/db.types'

export class ExamService extends BaseService {
  private readonly table = 'initial_exams'

  async createExam(exam: CreateExamAttempt, token?: string | null): Promise<ExamAttempt> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      
      // Get the user_id from JWT claims
      const { data: claims } = await client.rpc('requesting_user_id')
      if (!claims) throw new Error('No user ID found in JWT claims')

      const { data, error } = await client
        .from(this.table)
        .insert({ ...exam, user_id: claims })
        .select()
        .single()
      
      if (error) throw error
      return data
    })
  }
  
  async createBodyMapSelection(selections: Record<string, boolean>, token?: string | null): Promise<string> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      
      const { data: claims } = await client.rpc('requesting_user_id')
      if (!claims) throw new Error('No user ID found in JWT claims')
  
      const { data, error } = await client
        .from('body_map_selections')
        .insert({
          user_id: claims,
          selections: selections,
          source: 'initial_exam',
          source_id: 'initial' // or generate a unique ID if needed
        })
        .select()
        .single()
      
      if (error) throw error
      return data.id
    })
  }

  async getExam(examId: string, token?: string | null): Promise<ExamAttempt | null> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.table)
        .select('*')
        .eq('id', examId)
        .maybeSingle()
      
      if (error) throw error
      return data
    })
  }

  async updateExam(examId: string, updates: UpdateExamAttempt, token?: string | null): Promise<ExamAttempt> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.table)
        .update(updates)
        .eq('id', examId)
        .select()
        .single()
      
      if (error) throw error
      return data
    })
  }

  async completeExam(examId: string, token?: string | null): Promise<ExamAttempt> {
    return this.updateExam(examId, { is_completed: true }, token)
  }

  async getLatestExam(token?: string | null): Promise<ExamAttempt | null> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.table)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      if (error) throw error
      return data
    })
  }
}

export const examService = new ExamService()