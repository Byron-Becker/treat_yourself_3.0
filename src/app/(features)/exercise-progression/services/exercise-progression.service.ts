import { BaseService } from '@/lib/supabase/services/base'
import { ProgressionSnapshot } from '../types'

interface BaseResponse<T> {
  data: T | null
  error: Error | null
}

interface ExerciseSession {
  exercise_id: string
  started_at: string
  completed_at?: string
  responses: Array<{
    question_id: string
    answer_id: string
    timestamp: string
  }>
}

interface ProgressionRecord {
  id: string
  user_id: string
  started_at: string
  completed_at?: string
  status: string
  exercise_sessions: ExerciseSession[]
}

export class ExerciseProgressionService extends BaseService {
  private readonly progressionTable = 'exercise_progressions'
  private readonly exerciseSessionsTable = 'exercise_sessions'
  private readonly responsesTable = 'exercise_responses'

  async saveProgression(progression: ProgressionSnapshot): Promise<BaseResponse<ProgressionSnapshot>> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(this.token)
      
      // First save the progression
      const { data: progressionData, error: progressionError } = await client
        .from(this.progressionTable)
        .insert({
          id: progression.id,
          user_id: progression.userId,
          started_at: progression.startedAt,
          completed_at: progression.completedAt,
          status: progression.status
        })
        .select()
        .single()

      if (progressionError) throw progressionError

      // Then save each exercise session and its responses
      for (const exercise of progression.exercises) {
        const { error: sessionError } = await client
          .from(this.exerciseSessionsTable)
          .insert({
            progression_id: progression.id,
            exercise_id: exercise.id,
            started_at: exercise.startedAt,
            completed_at: exercise.completedAt
          })

        if (sessionError) throw sessionError

        // Save responses
        if (exercise.responses.length > 0) {
          const { error: responsesError } = await client
            .from(this.responsesTable)
            .insert(
              exercise.responses.map(response => ({
                progression_id: progression.id,
                exercise_id: exercise.id,
                question_id: response.questionId,
                answer_id: response.answerId,
                timestamp: response.timestamp
              }))
            )

          if (responsesError) throw responsesError
        }
      }

      return { data: progressionData as ProgressionSnapshot, error: null }
    })
  }

  async getProgressionHistory(userId: string): Promise<BaseResponse<ProgressionSnapshot[]>> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(this.token)
      
      const { data: progressions, error: progressionsError } = await client
        .from(this.progressionTable)
        .select(`
          *,
          exercise_sessions:${this.exerciseSessionsTable}(
            *,
            responses:${this.responsesTable}(*)
          )
        `)
        .eq('user_id', userId)
        .order('started_at', { ascending: false })

      if (progressionsError) throw progressionsError

      // Transform the data into the expected format
      const formattedProgressions: ProgressionSnapshot[] = (progressions as ProgressionRecord[]).map(prog => ({
        id: prog.id,
        userId: prog.user_id,
        startedAt: prog.started_at,
        completedAt: prog.completed_at,
        status: prog.status as ProgressionSnapshot['status'],
        exercises: prog.exercise_sessions.map(session => ({
          id: session.exercise_id,
          startedAt: session.started_at,
          completedAt: session.completed_at,
          responses: session.responses.map(response => ({
            questionId: response.question_id,
            answerId: response.answer_id,
            timestamp: response.timestamp
          }))
        }))
      }))

      return { data: formattedProgressions, error: null }
    })
  }

  async getLatestProgression(userId: string): Promise<BaseResponse<ProgressionSnapshot | null>> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(this.token)
      
      const { data: progression, error } = await client
        .from(this.progressionTable)
        .select(`
          *,
          exercise_sessions:${this.exerciseSessionsTable}(
            *,
            responses:${this.responsesTable}(*)
          )
        `)
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      if (!progression) return { data: null, error: null }

      const record = progression as ProgressionRecord
      // Transform to expected format
      const formattedProgression: ProgressionSnapshot = {
        id: record.id,
        userId: record.user_id,
        startedAt: record.started_at,
        completedAt: record.completed_at,
        status: record.status as ProgressionSnapshot['status'],
        exercises: record.exercise_sessions.map(session => ({
          id: session.exercise_id,
          startedAt: session.started_at,
          completedAt: session.completed_at,
          responses: session.responses.map(response => ({
            questionId: response.question_id,
            answerId: response.answer_id,
            timestamp: response.timestamp
          }))
        }))
      }

      return { data: formattedProgression, error: null }
    })
  }
} 