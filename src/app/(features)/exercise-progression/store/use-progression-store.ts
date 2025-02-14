import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { Exercise, ProgressionStatus } from '../types'
import { ProgressionRulesService } from '../services'
import { exercises } from '../data/exercise-content'
import { ExerciseProgressionService } from '../services'

interface ExerciseState {
  id: string
  sessionId: string
  phase: 'setup' | 'active' | 'complete'
  timeRemaining: number
  isTimerActive: boolean
  currentQuestionId: string | null
  answers: Record<string, string>
  visibleQuestions: string[]
  startedAt?: string
  completedAt?: string
}

interface ProgressionStore {
  // State
  seriesId: string | null
  exercises: ExerciseState[]
  currentExerciseIndex: number
  status: ProgressionStatus
  shouldScrollToNewExercise: boolean
  authToken: string | null

  // Actions
  initializeExercise: (exercise: Exercise, token: string) => Promise<void>
  startExercise: () => Promise<void>
  pauseExercise: () => void
  submitResponse: (questionId: string, answerId: string) => Promise<void>
  updateTimeRemaining: (timeRemaining: number) => void
  addNextExercise: (exercise: Exercise) => void
  handleEarlyStop: (reason: string) => void
}

const rulesService = new ProgressionRulesService()
const exerciseProgressionService = new ExerciseProgressionService()

export const useProgressionStore = create<ProgressionStore>((set, get) => ({
  seriesId: null,
  exercises: [],
  currentExerciseIndex: 0,
  status: 'not_started',
  shouldScrollToNewExercise: false,
  authToken: null,

  initializeExercise: async (exercise: Exercise, token: string) => {
    console.log('Setting up initial exercise state:', exercise.id)
    
    // Just set up the initial UI state and store the token
    set({
      authToken: token,
      exercises: [{
        id: exercise.id,
        sessionId: '', // Will be set when exercise starts
        phase: 'setup',
        timeRemaining: exercise.duration,
        isTimerActive: false,
        currentQuestionId: null,
        answers: {},
        visibleQuestions: [],
        startedAt: undefined
      }]
    })
  },

  startExercise: async () => {
    console.log('Starting exercise at index:', get().currentExerciseIndex)
    const state = get()
    const currentExercise = state.exercises[state.currentExerciseIndex]

    try {
      // Set the token in the service
      exerciseProgressionService.setToken(state.authToken!)
      console.log('✅ Auth token set for exercise start')

      // Create series if this is the first exercise
      let seriesId = state.seriesId
      if (!seriesId) {
        seriesId = uuidv4()
        console.log('Creating new exercise series...')
        const { error: seriesError } = await exerciseProgressionService.createSeries(seriesId)
        if (seriesError) {
          console.error('❌ Failed to create series:', seriesError)
          throw seriesError
        }
        console.log('✅ Series created successfully')
        set({ seriesId })
      }

      // Create session for this exercise
      const sessionId = uuidv4()
      console.log('Creating new exercise session...', {
        seriesId,
        exerciseId: currentExercise.id,
        sessionId
      })
      
      const { error: sessionError } = await exerciseProgressionService.createSession(
        seriesId,
        currentExercise.id,
        sessionId
      )
      if (sessionError) {
        console.error('❌ Failed to create session:', sessionError)
        throw sessionError
      }
      console.log('✅ Session created successfully')

      // Update the UI state
      set(state => ({
        status: 'in_progress',
        exercises: state.exercises.map((exercise, index) =>
          index === state.currentExerciseIndex
            ? {
                ...exercise,
                sessionId,
                phase: 'active',
                isTimerActive: true,
                startedAt: new Date().toISOString()
              }
            : exercise
        )
      }))
    } catch (error) {
      console.error('❌ Failed to start exercise:', error)
      throw error
    }
  },

  pauseExercise: () => {
    console.log('Pausing exercise at index:', get().currentExerciseIndex)
    set(state => ({
      exercises: state.exercises.map((exercise, index) =>
        index === state.currentExerciseIndex
          ? { ...exercise, isTimerActive: false }
          : exercise
      )
    }))
  },

  submitResponse: async (questionId: string, answerId: string) => {
    try {
      console.log('=== Submitting Response ===')
      console.log('Question ID:', questionId)
      console.log('Answer ID:', answerId)
      
      const state = get()
      const currentExercise = state.exercises[state.currentExerciseIndex]
      
      console.log('Current Exercise State:', {
        id: currentExercise.id,
        sessionId: currentExercise.sessionId,
        phase: currentExercise.phase,
        answers: currentExercise.answers
      })

      // Save response to database
      if (answerId !== '') {
        try {
          console.log('Saving response to database...')
          await exerciseProgressionService.saveResponse(
            currentExercise.sessionId,
            questionId,
            answerId
          )
          console.log('✅ Response saved successfully')
        } catch (error) {
          console.error('❌ Failed to save response:', error)
        }
      }

      const updatedExercises = state.exercises.map((exercise, index) =>
        index === state.currentExerciseIndex
          ? { ...exercise, answers: { ...exercise.answers, [questionId]: answerId } }
          : exercise
      )

      const evaluation = rulesService.evaluateResponses({
        ...currentExercise.answers,
        [questionId]: answerId
      })

      console.log('Response Evaluation:', {
        evaluation,
        currentAnswers: { ...currentExercise.answers, [questionId]: answerId }
      })

      if (evaluation.shouldStop) {
        console.log('Exercise should stop:', evaluation.message)
        if (answerId === 'worse' || answerId === 'peripheral') {
          console.log('Stopping exercise due to negative response')
          await get().handleEarlyStop(
            answerId === 'worse' ? 'worse_symptoms' : 'peripheral_pain'
          )
          set({ status: 'stopped_early' })
          return
        }
      }

      // Handle return to dashboard
      if (questionId === 'stop' && answerId === 'return_to_dashboard' || 
          questionId === 'completion' && answerId === 'finish') {
        console.log('Returning to dashboard')
        
        try {
          // Update session status
          console.log('Updating session status...')
          const { error: sessionError } = await exerciseProgressionService.updateSession(
            currentExercise.sessionId,
            {
              status: 'completed',
              completed_at: new Date().toISOString()
            }
          )
          if (sessionError) {
            console.error('❌ Failed to update session:', sessionError)
            throw sessionError
          }

          // Update series status only when explicitly stopping
          console.log('Updating series status...')
          const { error: seriesError } = await exerciseProgressionService.updateSeries(
            state.seriesId!,
            {
              status: questionId === 'stop' ? 'cancelled' : 'completed',
              completed_at: new Date().toISOString()
            }
          )
          if (seriesError) {
            console.error('❌ Failed to update series:', seriesError)
            throw seriesError
          }

          console.log('✅ Successfully updated session and series status')
        } catch (error) {
          console.error('❌ Failed to update status:', error)
        }

        set({
          status: questionId === 'stop' ? 'stopped_early' : 'completed',
          exercises: updatedExercises.map((exercise, index) =>
            index === state.currentExerciseIndex
              ? { ...exercise, completedAt: new Date().toISOString() }
              : exercise
          )
        })
        window.location.href = '/dashboard'
        return
      }

      // Check if we should progress to next exercise
      const shouldProgress = !evaluation.nextQuestionId && 
        (answerId === 'yes' || answerId === 'better' || answerId === 'central')

      if (shouldProgress) {
        console.log('=== Exercise Progression ===')
        console.log('Current exercise:', currentExercise.id)
        console.log('Trigger answer:', { questionId, answerId })
        
        const nextExerciseId = String(parseInt(currentExercise.id) + 1)
        const nextExercise = exercises[nextExerciseId]

        if (nextExercise) {
          const nextSessionId = uuidv4()
          console.log('Next exercise details:', {
            id: nextExerciseId,
            sessionId: nextSessionId,
            exercise: nextExercise
          })

          try {
            // Update current session as completed
            console.log('Updating current session status to completed...')
            const { error: sessionError } = await exerciseProgressionService.updateSession(
              currentExercise.sessionId,
              {
                status: 'completed',
                completed_at: new Date().toISOString()
              }
            )

            if (sessionError) {
              console.error('❌ Failed to update current session:', sessionError)
              throw sessionError
            }
            console.log('✅ Current session updated successfully')

            // Create new session for next exercise
            console.log('Creating new session...')
            const { error: newSessionError } = await exerciseProgressionService.createSession(
              state.seriesId!,
              nextExerciseId,
              nextSessionId
            )

            if (newSessionError) {
              console.error('❌ Failed to create session for next exercise:', newSessionError)
              throw newSessionError
            }
            console.log('✅ New session created successfully')

            // Update UI state to show next exercise
            const newState = {
              exercises: [
                ...updatedExercises,
                {
                  id: nextExerciseId,
                  sessionId: nextSessionId,
                  phase: 'setup' as const,
                  timeRemaining: nextExercise.duration,
                  isTimerActive: false,
                  currentQuestionId: null,
                  answers: {},
                  visibleQuestions: [],
                  startedAt: new Date().toISOString()
                }
              ],
              currentExerciseIndex: state.exercises.length,
              shouldScrollToNewExercise: true,
              status: 'in_progress' as const // Keep series in progress
            }
            console.log('Setting new state:', newState)
            set((state) => ({
              ...state,
              ...newState
            }))
            console.log('✅ UI state updated for next exercise')
          } catch (error) {
            console.error('❌ Failed to progress to next exercise:', error)
            throw error
          }
          return
        } else {
          // This is the final exercise and they've completed it successfully
          console.log('Final exercise completed')
          set({
            exercises: updatedExercises.map((exercise, index) =>
              index === state.currentExerciseIndex
                ? {
                    ...exercise,
                    currentQuestionId: 'completion',
                    visibleQuestions: [...exercise.visibleQuestions, 'completion']
                  }
                : exercise
            )
          })
          return
        }
      }

      // Update visible questions if there's a next question
      if (evaluation.nextQuestionId) {
        console.log('Adding next question:', evaluation.nextQuestionId)
        set({
          exercises: updatedExercises.map((exercise, index) =>
            index === state.currentExerciseIndex
              ? {
                  ...exercise,
                  currentQuestionId: evaluation.nextQuestionId!,
                  visibleQuestions: exercise.visibleQuestions.includes(evaluation.nextQuestionId!)
                    ? exercise.visibleQuestions
                    : [...exercise.visibleQuestions, evaluation.nextQuestionId!]
                }
              : exercise
          )
        })
      }
    } catch (error) {
      console.error('❌ Error submitting response:', error)
    }
  },

  updateTimeRemaining: (timeRemaining: number) => {
    set(state => ({
      exercises: state.exercises.map((exercise, index) =>
        index === state.currentExerciseIndex
          ? { ...exercise, timeRemaining }
          : exercise
      )
    }))
  },

  addNextExercise: (exercise: Exercise) => {
    console.log('Adding next exercise:', exercise.id)
    set(state => ({
      exercises: [
        ...state.exercises,
        {
          id: exercise.id,
          sessionId: '', // Will be set when exercise starts
          phase: 'setup',
          timeRemaining: exercise.duration,
          isTimerActive: false,
          currentQuestionId: null,
          answers: {},
          visibleQuestions: [],
          startedAt: new Date().toISOString()
        }
      ],
      currentExerciseIndex: state.exercises.length
    }))
  },

  handleEarlyStop: async (reason: string) => {
    console.log('Handling early stop:', reason)
    const state = get()
    const currentExercise = state.exercises[state.currentExerciseIndex]

    try {
      // Set the token in the service
      exerciseProgressionService.setToken(state.authToken!)

      // Update session status
      console.log('Updating session status to stopped...')
      const { error: sessionError } = await exerciseProgressionService.updateSession(
        currentExercise.sessionId,
        {
          status: 'cancelled',
          completed_at: new Date().toISOString(),
          stop_reason: reason
        }
      )
      if (sessionError) {
        console.error('❌ Failed to update session:', sessionError)
        throw sessionError
      }

      // Update series status
      console.log('Updating series status to stopped...')
      const { error: seriesError } = await exerciseProgressionService.updateSeries(
        state.seriesId!,
        {
          status: 'cancelled',
          completed_at: new Date().toISOString()
        }
      )
      if (seriesError) {
        console.error('❌ Failed to update series:', seriesError)
        throw seriesError
      }

      console.log('✅ Successfully updated session and series status')
    } catch (error) {
      console.error('❌ Failed to handle early stop:', error)
      throw error
    }
  }
})) 