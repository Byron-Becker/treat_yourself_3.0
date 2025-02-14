import { BaseService } from '@/lib/supabase/services/base'
import { ProgressionSnapshot } from '../types'
import { v4 as uuidv4 } from 'uuid'

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

  setToken(token: string) {
    if (!token) {
      throw new Error('Token cannot be empty')
    }
    console.log('Setting token:', token.slice(0, 10) + '...')
    this.token = token
  }

  private validateToken() {
    if (!this.token) {
      console.error('❌ No auth token available')
      throw new Error('Authentication token is required')
    }
  }

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

  async saveResponse(sessionId: string, questionId: string, answerId: string): Promise<BaseResponse<any>> {
    return this.withErrorHandling(async () => {
      console.log('=== Saving Response to Database ===')
      console.log('Session ID:', sessionId)
      console.log('Question ID:', questionId)
      console.log('Answer ID:', answerId)

      this.validateToken()
      const client = await this.getClient(this.token)
      
      const response = {
        id: uuidv4(),
        session_id: sessionId,
        question_id: questionId,
        answer_id: answerId,
        timestamp: new Date().toISOString()
      }

      console.log('Inserting response:', response)
      
      const { data, error } = await client
        .from(this.responsesTable)
        .insert(response)
        .select()
        .single()

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }

      console.log('✅ Response saved successfully:', data)
      return { data, error: null }
    })
  }

  async createSeries(seriesId: string): Promise<BaseResponse<any>> {
    return this.withErrorHandling(async () => {
      console.log('=== Creating Exercise Series ===')
      console.log('Series ID:', seriesId)

      this.validateToken()
      const client = await this.getClient(this.token)
      
      // Get user ID directly from JWT token
      try {
        if (!this.token) {
          throw new Error('No token available')
        }

        // Decode JWT to get sub claim
        const [headerB64, payloadB64] = this.token.split('.')
        if (!payloadB64) {
          throw new Error('Invalid JWT format')
        }

        // Add padding if needed
        const base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/')
        const pad = base64.length % 4
        const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64

        const decodedPayload = JSON.parse(atob(paddedBase64))
        const userId = decodedPayload.sub

        if (!userId) {
          console.error('❌ No user ID in JWT')
          throw new Error('No user ID in JWT')
        }

        console.log('Creating series for user:', userId)

        const series = {
          id: seriesId,
          user_id: userId,
          status: 'in_progress',
          started_at: new Date().toISOString()
        }

        console.log('Creating series:', series)
        
        const { data, error } = await client
          .from('exercise_series')
          .insert(series)
          .select()
          .single()

        if (error) {
          console.error('❌ Database error:', error)
          throw error
        }

        console.log('✅ Series created successfully:', data)
        return { data, error: null }
      } catch (error) {
        console.error('❌ Failed to decode JWT or create series:', error)
        throw error
      }
    })
  }

  async createSession(seriesId: string, exerciseId: string, sessionId: string): Promise<BaseResponse<any>> {
    return this.withErrorHandling(async () => {
      console.log('=== Creating Exercise Session ===')
      console.log('Series ID:', seriesId)
      console.log('Exercise ID:', exerciseId)
      console.log('Session ID:', sessionId)

      this.validateToken()
      const client = await this.getClient(this.token)
      
      const session = {
        id: sessionId,
        series_id: seriesId,
        exercise_id: exerciseId,
        status: 'in_progress',
        started_at: new Date().toISOString()
      }

      console.log('Creating session:', session)
      
      const { data, error } = await client
        .from('exercise_sessions')
        .insert(session)
        .select()
        .single()

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }

      console.log('✅ Session created successfully:', data)
      return { data, error: null }
    })
  }

  async getToken(): Promise<string | null> {
    try {
      const client = await this.getClient()
      const { data: { session }, error } = await client.auth.getSession()
      
      if (error) {
        console.error('❌ Failed to get auth session:', error)
        return null
      }

      return session?.access_token ?? null
    } catch (error) {
      console.error('❌ Error getting token:', error)
      return null
    }
  }

  async updateSession(sessionId: string, updates: { status: string; completed_at?: string; stop_reason?: string }): Promise<BaseResponse<any>> {
    return this.withErrorHandling(async () => {
      console.log('=== Updating Exercise Session ===')
      console.log('Session ID:', sessionId)
      console.log('Updates:', updates)

      this.validateToken()
      const client = await this.getClient(this.token)
      
      const { data, error } = await client
        .from('exercise_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single()

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }

      console.log('✅ Session updated successfully:', data)
      return { data, error: null }
    })
  }

  async updateSeries(seriesId: string, updates: { status: string; completed_at?: string }): Promise<BaseResponse<any>> {
    return this.withErrorHandling(async () => {
      console.log('=== Updating Exercise Series ===')
      console.log('Series ID:', seriesId)
      console.log('Updates:', updates)

      this.validateToken()
      const client = await this.getClient(this.token)
      
      const { data, error } = await client
        .from('exercise_series')
        .update(updates)
        .eq('id', seriesId)
        .select()
        .single()

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }

      console.log('✅ Series updated successfully:', data)
      return { data, error: null }
    })
  }
} 