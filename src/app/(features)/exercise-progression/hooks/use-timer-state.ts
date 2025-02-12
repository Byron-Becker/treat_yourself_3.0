import { useEffect, useCallback, useMemo } from 'react'
import { Timer } from '../model'

interface UseTimerStateProps {
  duration: number
  onTimeUpdate: (timeRemaining: number) => void
  isActive: boolean
}

export function useTimerState({ 
  duration,
  onTimeUpdate,
  isActive
}: UseTimerStateProps) {
  // Create memoized timer instance
  const timer = useMemo(() => {
    const timer = new Timer()
    timer.reset(duration)
    return timer
  }, [duration])

  // Setup timer listener
  useEffect(() => {
    timer.addListener(onTimeUpdate)
    return () => timer.removeListener(onTimeUpdate)
  }, [timer, onTimeUpdate])

  // Handle timer state changes
  useEffect(() => {
    if (isActive) {
      timer.start()
    } else {
      timer.pause()
    }
  }, [timer, isActive])

  const startTimer = useCallback(() => {
    timer.start()
  }, [timer])

  const pauseTimer = useCallback(() => {
    timer.pause()
  }, [timer])

  const resetTimer = useCallback((newDuration: number) => {
    timer.reset(newDuration)
  }, [timer])

  return {
    startTimer,
    pauseTimer,
    resetTimer,
    timeRemaining: timer.getTimeRemaining(),
    isRunning: timer.isRunning()
  }
} 