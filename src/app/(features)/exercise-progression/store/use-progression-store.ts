import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { Exercise, ProgressionStatus } from '../types'
import { ProgressionRulesService } from '../services'
import { exercises } from '../data/exercise-content'

interface ExerciseState {
  id: string
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
  sessionId: string
  exercises: ExerciseState[]
  currentExerciseIndex: number
  status: ProgressionStatus
  shouldScrollToNewExercise: boolean

  // Actions
  initializeExercise: (exercise: Exercise) => void
  startExercise: () => void
  pauseExercise: () => void
  submitResponse: (questionId: string, answerId: string) => void
  updateTimeRemaining: (timeRemaining: number) => void
  addNextExercise: (exercise: Exercise) => void
}

const rulesService = new ProgressionRulesService()

export const useProgressionStore = create<ProgressionStore>((set, get) => ({
  sessionId: uuidv4(),
  exercises: [],
  currentExerciseIndex: 0,
  status: 'not_started',
  shouldScrollToNewExercise: false,

  initializeExercise: (exercise: Exercise) => {
    console.log('Initializing exercise:', exercise.id)
    set({
      exercises: [{
        id: exercise.id,
        phase: 'setup',
        timeRemaining: exercise.duration,
        isTimerActive: false,
        currentQuestionId: null,
        answers: {},
        visibleQuestions: [],
        startedAt: new Date().toISOString()
      }]
    })
  },

  startExercise: () => {
    console.log('Starting exercise at index:', get().currentExerciseIndex)
    set(state => ({
      status: 'in_progress',
      exercises: state.exercises.map((exercise, index) =>
        index === state.currentExerciseIndex
          ? {
              ...exercise,
              phase: 'active',
              isTimerActive: true,
              startedAt: new Date().toISOString()
            }
          : exercise
      )
    }))
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

  submitResponse: (questionId: string, answerId: string) => {
    console.log('Submitting response:', { questionId, answerId })
    const state = get()
    const currentExercise = state.exercises[state.currentExerciseIndex]

    // If this is the initial question being added automatically
    if (answerId === '') {
      console.log('Adding initial question')
      set(state => ({
        exercises: state.exercises.map((exercise, index) =>
          index === state.currentExerciseIndex
            ? {
                ...exercise,
                currentQuestionId: 'initial',
                visibleQuestions: ['initial']
              }
            : exercise
        )
      }))
      return
    }
    
    // Update the current exercise's answers
    const updatedExercises = state.exercises.map((exercise, index) =>
      index === state.currentExerciseIndex
        ? {
            ...exercise,
            answers: { ...exercise.answers, [questionId]: answerId }
          }
        : exercise
    )

    // Evaluate the response
    const evaluation = rulesService.evaluateResponses({
      ...currentExercise.answers,
      [questionId]: answerId,
      exerciseId: currentExercise.id
    })

    console.log('Response evaluation:', evaluation)

    // Handle return to dashboard
    if (questionId === 'stop' && answerId === 'return_to_dashboard' || 
        questionId === 'completion' && answerId === 'finish') {
      console.log('Returning to dashboard')
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
      console.log('Progressing to next exercise')
      const nextExerciseId = String(parseInt(currentExercise.id) + 1)
      const nextExercise = exercises[nextExerciseId]

      if (nextExercise) {
        set({
          exercises: [
            ...updatedExercises,
            {
              id: nextExerciseId,
              phase: 'setup',
              timeRemaining: nextExercise.duration,
              isTimerActive: false,
              currentQuestionId: null,
              answers: {},
              visibleQuestions: [],
              startedAt: new Date().toISOString()
            }
          ],
          currentExerciseIndex: state.exercises.length,
          shouldScrollToNewExercise: true
        })
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
  }
})) 