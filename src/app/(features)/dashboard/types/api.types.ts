import { DatabaseRecord } from './service.types'

export interface InitialExamRecord extends DatabaseRecord {
  id: string
  user_id: string
  safety_answers: Record<string, unknown>
  treatment_answers: Record<string, unknown>
  body_map_id: string | null
  is_completed: boolean
}

export interface LessonCompletionRecord extends DatabaseRecord {
  id: string
  user_id: string
  lesson_id: string
  completed_at: string
}

// Mock types for exercise data until implemented
export interface ExerciseRecord extends DatabaseRecord {
  id: string
  user_id: string
  type: string
  completed_at: string
  metrics: Record<string, unknown>
}