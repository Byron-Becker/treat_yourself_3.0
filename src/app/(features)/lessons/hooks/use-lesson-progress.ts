// hooks/use-lesson-progress.ts

import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import type { Lesson } from '../types/lesson.types'
import { lessonService } from '../services/lesson.service'


export function useLessonProgress() {
  const { userId, getToken } = useAuth()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [completedSlides, setCompletedSlides] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  const completeSlide = useCallback(async (slideId: string) => {
    if (!userId || !lesson) return

    try {
      setLoading(true)
      const token = await getToken({ template: 'supabase' })
      const updatedLesson = await lessonService.completeSlide(lesson.id, slideId, token)
      setLesson(updatedLesson)
      setCompletedSlides(new Set(updatedLesson.completedSlideIds))
    } finally {
      setLoading(false) 
    }
  }, [userId, lesson, getToken])

  return {
    lesson,
    completedSlides,
    loading,
    completeSlide
  }
}