import { BaseService } from '@/lib/supabase/services/base'
import type { ExamAttempt, CreateExamAttempt, UpdateExamAttempt } from '../types/db.types'


export class ExamService extends BaseService {
  private readonly examTable = 'initial_exams'
  private readonly bodyMapTable = 'body_map_selections'

  async hasCompletedExam(token?: string | null): Promise<boolean> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.examTable)
        .select('id')
        .eq('is_completed', true)
        .limit(1)
      
      if (error) throw error
      return data && data.length > 0
    })
  }

  async createBodyMapSelection(
    selections: Record<string, boolean>,
    score: number,
    token?: string | null
  ): Promise<string> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      
      const { data: claims } = await client.rpc('requesting_user_id')
      if (!claims) throw new Error('No user ID found in JWT claims')

      const { data, error } = await client
        .from(this.bodyMapTable)
        .insert({
          user_id: claims,
          selections: selections,
          location_score: score,
          source: 'initial_exam',
          source_id: 'primary'
        })
        .select()
        .single()
      
      if (error) throw error
      return data.id
    })
  }

  async createExam(exam: CreateExamAttempt, token?: string | null): Promise<ExamAttempt> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      
      // Check if user already has a completed exam
      const hasCompleted = await this.hasCompletedExam(token)
      if (hasCompleted) {
        throw new Error('User already has a completed initial exam')
      }
      
      // Get the user_id from JWT claims
      const { data: claims } = await client.rpc('requesting_user_id')
      if (!claims) throw new Error('No user ID found in JWT claims')

      const { data, error } = await client
        .from(this.examTable)
        .insert({ ...exam, user_id: claims })
        .select()
        .single()
      
      if (error) throw error
      return data
    })
  }

  async getExam(examId: string, token?: string | null): Promise<ExamAttempt | null> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.examTable)
        .select('*, body_map_selections(*)')
        .eq('id', examId)
        .maybeSingle()
      
      if (error) throw error
      return data
    })
  }

  async updateExam(examId: string, updates: UpdateExamAttempt, token?: string | null): Promise<ExamAttempt> {
    return this.withErrorHandling(async () => {
      // Check if exam is already completed
      const exam = await this.getExam(examId, token)
      if (exam?.is_completed) {
        throw new Error('Cannot update a completed exam')
      }

      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.examTable)
        .update(updates)
        .eq('id', examId)
        .select()
        .single()
      
      if (error) throw error
      return data
    })
  }

  async completeExam(examId: string, token?: string | null): Promise<ExamAttempt> {
    return this.withErrorHandling(async () => {
      // Check if user already has a completed exam
      const hasCompleted = await this.hasCompletedExam(token)
      if (hasCompleted) {
        throw new Error('User already has a completed initial exam')
      }

      return this.updateExam(examId, { is_completed: true }, token)
    })
  }

  async getLatestExam(token?: string | null): Promise<ExamAttempt | null> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.examTable)
        .select('*, body_map_selections(*)')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      if (error) throw error
      return data
    })
  }
}

export const examService = new ExamService()