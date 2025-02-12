import { useState, useCallback, useEffect, useMemo } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ExerciseProgression } from '../model'
import { ExerciseProgressionService, ProgressionRulesService } from '../services'
import { Exercise, ProgressionState } from '../types'

export function useProgressionState(initialExercises: Exercise[]) {
  const { getToken } = useAuth()
  const [progression] = useState(() => new ExerciseProgression(initialExercises))
  const [state, setState] = useState<ProgressionState>({
    id: progression.getId(),
    exercises: initialExercises,
    states: initialExercises.map(exercise => ({
      id: exercise.id,
      phase: 'setup',
      timeRemaining: exercise.duration,
      isTimerActive: false,
      currentQuestionId: null,
      answers: {},
      visibleQuestions: []
    })),
    currentExerciseIndex: 0,
    status: 'not_started'
  })

  const [service, setService] = useState<ExerciseProgressionService | null>(null)
  const rulesService = useMemo(() => new ProgressionRulesService(), [])

  // Initialize service with token
  useEffect(() => {
    const initService = async () => {
      try {
        const token = await getToken()
        console.log('Initializing service with token:', !!token)
        setService(new ExerciseProgressionService(token))
      } catch (error) {
        console.error('Failed to initialize service:', error)
      }
    }
    initService()
  }, [getToken])

  const startExercise = useCallback(() => {
    console.log('Starting exercise, current state:', state.states[state.currentExerciseIndex])
    try {
      progression.startExercise()
      setState(prev => ({
        ...prev,
        states: prev.states.map((state, index) => 
          index === prev.currentExerciseIndex 
            ? { ...state, phase: 'active', isTimerActive: true }
            : state
        ),
        status: 'in_progress'
      }))
      console.log('Exercise started successfully')
    } catch (error) {
      console.error('Failed to start exercise:', error)
    }
  }, [progression, state.currentExerciseIndex, state.states])

  const pauseExercise = useCallback(() => {
    console.log('Pausing exercise')
    progression.pauseExercise()
    setState(prev => ({
      ...prev,
      states: prev.states.map((state, index) => 
        index === prev.currentExerciseIndex 
          ? { ...state, isTimerActive: false }
          : state
      )
    }))
  }, [progression])

  const submitResponse = useCallback(async (questionId: string, answerId: string) => {
    console.log('Submitting response:', { questionId, answerId })
    progression.submitResponse(questionId, answerId)
    const currentState = progression.getCurrentState()
    
    setState(prev => ({
      ...prev,
      states: prev.states.map((state, index) => 
        index === prev.currentExerciseIndex 
          ? {
              ...state,
              answers: {
                ...state.answers,
                [questionId]: answerId
              }
            }
          : state
      )
    }))

    // Evaluate responses
    const evaluation = rulesService.evaluateResponses(currentState.answers)
    console.log('Response evaluation:', evaluation)
    
    if (evaluation.shouldStop && service) {
      console.log('Stopping exercise due to evaluation')
      await service.saveProgression({
        id: state.id,
        userId: 'current', // This will be set by the service
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        status: 'stopped_early',
        exercises: [{
          id: currentState.id,
          responses: Object.entries(currentState.answers).map(([qId, aId]) => ({
            questionId: qId,
            answerId: aId,
            timestamp: new Date().toISOString()
          })),
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        }]
      })
    }

    // Get next question if available
    const nextQuestionId = rulesService.getNextQuestionId(questionId, answerId)
    console.log('Next question:', nextQuestionId)
    if (nextQuestionId) {
      setState(prev => ({
        ...prev,
        states: prev.states.map((state, index) => 
          index === prev.currentExerciseIndex 
            ? {
                ...state,
                currentQuestionId: nextQuestionId,
                visibleQuestions: [...state.visibleQuestions, nextQuestionId]
              }
            : state
        )
      }))
    }
  }, [progression, service, rulesService, state.id])

  const updateTimeRemaining = useCallback((timeRemaining: number) => {
    progression.updateTimeRemaining(timeRemaining)
    setState(prev => ({
      ...prev,
      states: prev.states.map((state, index) => 
        index === prev.currentExerciseIndex 
          ? { ...state, timeRemaining }
          : state
      )
    }))
  }, [progression])

  return {
    state,
    startExercise,
    pauseExercise,
    submitResponse,
    updateTimeRemaining
  }
} 