// features/lessons/actions/lesson-completion.ts
'use server'

import { lessonCompletionService } from '../services/lesson-completion.service'
import type { LessonCompletion } from '../types/db.types'

export async function createCompletion(lessonId: string, token: string | null): Promise<LessonCompletion | null> {
 try {
   return await lessonCompletionService.createCompletion({ lesson_id: lessonId }, token)
 } catch (error) {
   // Silently handle duplicate completions
   if (error instanceof Error && error.message.includes('UNIQUE_VIOLATION')) {
     return null
   }
   // Rethrow other errors
   throw error
 }
}