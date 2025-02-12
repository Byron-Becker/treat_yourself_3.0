import { useMemo } from 'react'
import { Timer } from '../model'

export function useTimer(duration: number) {
  const timer = useMemo(() => {
    const timer = new Timer()
    timer.reset(duration)
    return timer
  }, [duration])

  return timer
} 