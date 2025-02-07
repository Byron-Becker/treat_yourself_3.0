// /features/lessons/types/db.types.ts
export interface LessonCompletion {
    id: string
    user_id: string
    lesson_id: string
    completed_at: string
  }
  
  export type CreateLessonCompletion = Pick<LessonCompletion, 'lesson_id'>