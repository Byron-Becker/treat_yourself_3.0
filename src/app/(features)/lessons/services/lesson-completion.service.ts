// /features/lessons/services/lesson-completion.service.ts
import { BaseService } from '@/lib/supabase/services/base'
import type { LessonCompletion, CreateLessonCompletion } from '../types/db.types'

// features/lessons/services/lesson-completion.service.ts

export class LessonCompletionService extends BaseService {
    private readonly table = 'lesson_completions'
  
    async createCompletion(completion: CreateLessonCompletion, token?: string | null): Promise<LessonCompletion> {
      return this.withErrorHandling(async () => {
        const client = await this.getClient(token)
        
        const { data: claims } = await client.rpc('requesting_user_id')
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