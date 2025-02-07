// /features/lessons/services/lesson-completion.service.ts
import { BaseService } from '@/lib/supabase/services/base'
import type { LessonCompletion, CreateLessonCompletion } from '../types/db.types'

export class LessonCompletionService extends BaseService {
  private readonly table = 'lesson_completions'

  async getCompletion(lessonId: string, token?: string | null): Promise<LessonCompletion | null> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.table)
        .select('*')
        .eq('lesson_id', lessonId)
        .maybeSingle()
      
      if (error) throw error
      return data
    })
  }

  async createCompletion(completion: CreateLessonCompletion, token?: string | null): Promise<LessonCompletion> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      
      // Get the user_id from the JWT claims
      const { data: claims, error: claimsError } = await client.rpc('requesting_user_id')
      if (claimsError) throw claimsError
      if (!claims) throw new Error('No user ID found in JWT claims')

      const { data, error } = await client
        .from(this.table)
        .insert({ ...completion, user_id: claims })
        .select()
        .single()
      
      if (error) throw error
      return data
    })
  }
}

export const lessonCompletionService = new LessonCompletionService()