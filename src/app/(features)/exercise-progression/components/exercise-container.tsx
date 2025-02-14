'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Exercise } from '../types'
import { useProgressionStore } from '../store/use-progression-store'
import { ExerciseHeader } from './exercise-header'
import { ExerciseFooter } from './exercise-footer'
import { SetupSlide } from './slides/setup-slide'
import { InstructionSlide } from './slides/instruction-slide'
import { QuestionSlide } from './slides/question-slide'
import { LoadingOverlay } from './loading-overlay'
import { exercises } from '../data/exercise-content'
import { useExerciseTimer } from '../hooks/use-exercise-timer'
import { useExerciseScroll } from '../hooks/use-exercise-scroll'

interface ExerciseContainerProps {
  exercise: Exercise
}

export function ExerciseContainer({ exercise }: ExerciseContainerProps) {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const router = useRouter()

  const {
    exercises: exerciseStates,
    currentExerciseIndex,
    status,
    initializeExercise,
    startExercise,
    pauseExercise,
    submitResponse,
  } = useProgressionStore()

  // Initialize hooks
  useExerciseTimer()
  const {
    scrollToQuestion,
    scrollToInstruction,
    scrollToSetup,
    getQuestionRef,
    getInstructionRef,
    getSetupRef,
    scrollWithRetry
  } = useExerciseScroll()

  // Initialize the first exercise
  useEffect(() => {
    const init = async () => {
      if (!isLoaded) {
        console.log('Auth not loaded yet')
        return
      }

      if (!isSignedIn) {
        console.log('User not signed in, redirecting to sign-in')
        router.push('/sign-in')
        return
      }

      try {
        console.log('Getting Supabase token...')
        const token = await getToken({ template: 'supabase' })
        if (!token) {
          console.error('❌ No auth token available')
          return
        }
        console.log('✅ Got auth token:', token.slice(0, 10) + '...')

        console.log('Initializing exercise with token...')
        await initializeExercise(exercise, token)
        console.log('✅ Exercise initialized successfully')
      } catch (error) {
        console.error('❌ Failed to initialize exercise:', error)
        // TODO: Show error message to user
      }
    }
    
    if (isLoaded) {
      init()
    }
  }, [exercise, initializeExercise, isLoaded, isSignedIn, getToken, router])

  // Handle question appearance after 5 seconds
  useEffect(() => {
    const currentExercise = exerciseStates[currentExerciseIndex]
    if (!currentExercise) return

    if (
      currentExercise.isTimerActive && 
      currentExercise.timeRemaining === exercise.duration - 1 &&
      !currentExercise.currentQuestionId
    ) {
      console.log('Adding initial question after 5 seconds')
      submitResponse('initial', '')
    }
  }, [exerciseStates, currentExerciseIndex, exercise.duration, submitResponse])

  // Handle scroll on phase changes
  useEffect(() => {
    const currentExercise = exerciseStates[currentExerciseIndex]
    if (!currentExercise) return

    if (currentExercise.phase === 'active') {
      scrollWithRetry(() => scrollToInstruction())
    }
  }, [currentExerciseIndex, exerciseStates, scrollToInstruction, scrollWithRetry])

  // Handle scroll on question changes
  useEffect(() => {
    const currentExercise = exerciseStates[currentExerciseIndex]
    if (!currentExercise?.currentQuestionId) return

    scrollWithRetry(() => scrollToQuestion(currentExercise.currentQuestionId!))
  }, [currentExerciseIndex, exerciseStates, scrollToQuestion, scrollWithRetry])

  // Handle scroll to new exercise
  useEffect(() => {
    const shouldScroll = useProgressionStore.getState().shouldScrollToNewExercise
    if (shouldScroll) {
      console.log('Scrolling to new exercise:', exerciseStates[currentExerciseIndex]?.id)
      scrollWithRetry(() => scrollToSetup(exerciseStates[currentExerciseIndex]?.id))
      useProgressionStore.setState({ shouldScrollToNewExercise: false })
    }
  }, [currentExerciseIndex, exerciseStates, scrollToSetup, scrollWithRetry])

  // Handle exercise completion
  useEffect(() => {
    const currentExercise = exerciseStates[currentExerciseIndex]
    if (!currentExercise) return

    console.log('Exercise completion check:', {
      status,
      hasStopAnswer: currentExercise.answers['stop'],
      answers: currentExercise.answers
    })

    // Only redirect if explicitly stopped via stop button or negative responses
    if (status === 'stopped_early' && 
        (currentExercise.answers['stop'] === 'return_to_dashboard' || 
         currentExercise.answers['initial'] === 'worse' || 
         currentExercise.answers['location'] === 'peripheral')) {
      console.log('Exercise explicitly stopped via stop button or negative response')
      router.push('/dashboard')
    } else if (status === 'stopped_early') {
      console.log('Exercise status is stopped_early but not from explicit stop - likely a state issue')
    }
  }, [status, exerciseStates, currentExerciseIndex, router])

  // Redirect if not signed in
  if (!isLoaded) return <LoadingOverlay />
  if (!isSignedIn) {
    router.push('/sign-in')
    return null
  }

  const currentExercise = exerciseStates[currentExerciseIndex]
  if (!currentExercise) return <LoadingOverlay />

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <ExerciseHeader 
          name={exercise.name}
          timeRemaining={currentExercise.timeRemaining}
          isActive={currentExercise.isTimerActive}
        />
      </div>

      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-20">
        <div className="max-w-2xl mx-auto">
          {exerciseStates.map((exerciseState) => {
            const exercise = exercises[exerciseState.id]
            
            return (
              <div 
                key={exerciseState.id} 
                className="mb-6"
                ref={getSetupRef(exerciseState.id)}
              >
                <SetupSlide
                  exercise={exercise}
                  state={exerciseState}
                  onTimerStart={startExercise}
                  onTimerStop={pauseExercise}
                  onAnswerSelected={submitResponse}
                />

                {exerciseState.phase !== 'setup' && (
                  <div className="mt-6">
                    <InstructionSlide
                      ref={getInstructionRef}
                      exercise={exercise}
                      state={exerciseState}
                      onTimerStart={startExercise}
                      onTimerStop={pauseExercise}
                      onAnswerSelected={submitResponse}
                    />
                  </div>
                )}

                {exerciseState.visibleQuestions.map((questionId) => (
                  <div key={questionId} className="mt-6">
                    <QuestionSlide
                      ref={getQuestionRef(questionId)}
                      exercise={exercise}
                      state={exerciseState}
                      questionId={questionId}
                      onTimerStart={startExercise}
                      onTimerStop={pauseExercise}
                      onAnswerSelected={submitResponse}
                    />
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
        <ExerciseFooter
          isActive={currentExercise.isTimerActive}
          timeRemaining={currentExercise.timeRemaining}
          onStart={startExercise}
          onStop={pauseExercise}
          canContinue={currentExercise.phase === 'active' && currentExercise.visibleQuestions.length > 0}
        />
      </div>
    </div>
  )
} 