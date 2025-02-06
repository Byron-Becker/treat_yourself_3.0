// features/lessons/hooks/use-lesson-progress.ts

import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { LessonProgress } from '../model/lesson-progress'
import type { Lesson } from '../types/lesson.types'
import { lessonService } from '../services/lesson.service'

export function useLessonProgress() {
  const { userId, getToken } = useAuth()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [progressModel] = useState(() => new LessonProgress())
  const [loading, setLoading] = useState(false)

  const completeSlide = useCallback(async (slideId: string) => {
    if (!userId || !lesson) return

    try {
      setLoading(true)
      progressModel.completeSlide(slideId, lesson.slides.length)
      const token = await getToken({ template: 'supabase' })
      const updatedLesson = await lessonService.completeSlide(
        lesson.id, 
        slideId, 
        token
      )
      setLesson(updatedLesson)
    } finally {
      setLoading(false)
    }
  }, [userId, lesson, getToken, progressModel])

  return {
    lesson,
    progress: progressModel.getProgress(),
    completedSlides: progressModel.getCompletedSlides(),
    currentIndex: progressModel.getCurrentIndex(),
    loading,
    completeSlide
  }
}