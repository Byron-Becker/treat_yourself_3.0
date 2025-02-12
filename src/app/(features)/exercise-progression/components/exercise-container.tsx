'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Exercise } from '../types'
import { useProgressionState, useResponseHandler } from '../hooks'
import { ExerciseHeader } from './exercise-header'
import { ExerciseFooter } from './exercise-footer'
import { SetupSlide } from './slides/setup-slide'
import { InstructionSlide } from './slides/instruction-slide'
import { QuestionSlide } from './slides/question-slide'
import { LoadingOverlay } from './loading-overlay'
import { useEffect, useRef} from 'react'
import { Timer } from '../types'
import { useTimer } from '../hooks/use-timer'

interface ExerciseContainerProps {
  exercise: Exercise
}

export function ExerciseContainer({ exercise }: ExerciseContainerProps) {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  const {
    state,
    startExercise,
    pauseExercise,
    submitResponse,
    updateTimeRemaining
  } = useProgressionState([exercise])

  const currentExercise = state.exercises[state.currentExerciseIndex]
  const currentState = state.states[state.currentExerciseIndex]

  const { handleResponse, canContinue } = useResponseHandler({
    onSubmitResponse: submitResponse,
    currentResponses: currentState.answers
  })

  const timer = useTimer(exercise.duration)
  const timerRef = useRef<Timer>(timer)
  
  useEffect(() => {
    timerRef.current = timer
  }, [timer])

  useEffect(() => {
    const handleTimeUpdate = (timeRemaining: number) => {
      console.log('Timer update:', timeRemaining)
      updateTimeRemaining(timeRemaining)
    }

    timerRef.current.addListener(handleTimeUpdate)
    return () => timerRef.current.removeListener(handleTimeUpdate)
  }, [updateTimeRemaining])

  useEffect(() => {
    console.log('Timer state effect:', { isTimerActive: currentState.isTimerActive })
    if (currentState.isTimerActive) {
      timerRef.current.start()
    } else {
      timerRef.current.pause()
    }
  }, [currentState.isTimerActive])

  if (!isLoaded) return <LoadingOverlay />
  if (!isSignedIn) {
    router.push('/sign-in')
    return null
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <ExerciseHeader 
        name={exercise.name}
        timeRemaining={currentState.timeRemaining}
        isActive={currentState.isTimerActive}
      />

      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {currentState.phase === 'setup' && (
            <SetupSlide
              exercise={currentExercise}
              state={currentState}
              onTimerStart={startExercise}
              onTimerStop={pauseExercise}
              onAnswerSelected={handleResponse}
            />
          )}

          {currentState.phase !== 'setup' && (
            <InstructionSlide
              exercise={currentExercise}
              state={currentState}
              onTimerStart={startExercise}
              onTimerStop={pauseExercise}
              onAnswerSelected={handleResponse}
            />
          )}

          {currentState.visibleQuestions.map((questionId) => (
            <QuestionSlide
              key={questionId}
              exercise={currentExercise}
              state={currentState}
              questionId={questionId}
              onTimerStart={startExercise}
              onTimerStop={pauseExercise}
              onAnswerSelected={handleResponse}
            />
          ))}
        </div>
      </main>

      <ExerciseFooter
        isActive={currentState.isTimerActive}
        timeRemaining={currentState.timeRemaining}
        onStart={startExercise}
        onStop={pauseExercise}
        canContinue={canContinue(currentState.answers)}
      />
    </div>
  )
} 