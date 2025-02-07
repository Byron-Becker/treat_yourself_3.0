// /features/lessons/actions/lesson-completion.ts
'use server'

import { lessonCompletionService } from '../services/lesson-completion.service'
import type { LessonCompletion } from '../types/db.types'

export async function createCompletion(lessonId: string, token: string | null): Promise<LessonCompletion> {
  return lessonCompletionService.createCompletion({ lesson_id: lessonId }, token)
}