// /features/lessons/hooks/use-lesson-completion.ts
import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { createCompletion } from '../actions/lesson-completion'
import type { LessonCompletion } from '../types/db.types'

export function useLessonCompletion(lessonId: string) {
  const { getToken } = useAuth()
  const [isCompleting, setIsCompleting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const complete = useCallback(async () => {
    try {
      setIsCompleting(true)
      setError(null)
      const token = await getToken({ template: 'supabase' })
      await createCompletion(lessonId, token)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to complete lesson'))
      throw err
    } finally {
      setIsCompleting(false)
    }
  }, [lessonId, getToken])

  return {
    complete,
    isCompleting,
    error
  }
}