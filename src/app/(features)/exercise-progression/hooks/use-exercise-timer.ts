import { useEffect, useRef } from 'react'
import { useProgressionStore } from '../store/use-progression-store'

export function useExerciseTimer() {
  const { 
    exercises,
    currentExerciseIndex,
    updateTimeRemaining
  } = useProgressionStore()

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const currentExercise = exercises[currentExerciseIndex]
    if (!currentExercise) return


    if (currentExercise.isTimerActive) {
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // Set start time when timer becomes active
      startTimeRef.current = Date.now()
      const initialTimeRemaining = currentExercise.timeRemaining

      timerRef.current = setInterval(() => {
        if (!startTimeRef.current) return

        // Calculate elapsed time based on real time difference
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000)
        const newTimeRemaining = Math.max(0, initialTimeRemaining - elapsedSeconds)

  

        updateTimeRemaining(newTimeRemaining)

        // Stop timer if we've reached 0
        if (newTimeRemaining <= 0 && timerRef.current) {
          clearInterval(timerRef.current)
        }
      }, 1000)
    } else {
      // Clear timer when not active
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      startTimeRef.current = null
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [exercises, currentExerciseIndex, updateTimeRemaining])
} 