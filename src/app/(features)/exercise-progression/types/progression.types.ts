import { Exercise, ExerciseState } from './exercise.types'

export type ProgressionStatus = 'not_started' | 'in_progress' | 'completed' | 'stopped_early'

export interface ProgressionState {
  id: string
  exercises: Exercise[]
  states: ExerciseState[]
  currentExerciseIndex: number
  status: ProgressionStatus
}

export interface ProgressionEvent {
  type: 
    | 'EXERCISE_STARTED'
    | 'EXERCISE_PAUSED'
    | 'EXERCISE_COMPLETED'
    | 'RESPONSE_SUBMITTED'
    | 'TIME_EXPIRED'
    | 'PROGRESSION_COMPLETED'
  payload: {
    progressionId: string
    exerciseId: string
    timestamp: number
    data?: unknown
  }
}

export interface ProgressionSnapshot {
  id: string
  userId: string
  startedAt: string
  completedAt?: string
  status: ProgressionStatus
  exercises: {
    id: string
    responses: Array<{
      questionId: string
      answerId: string
      timestamp: string
    }>
    startedAt: string
    completedAt?: string
  }[]
}
