// features/lessons/hooks/use-lesson-progress.ts

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { LessonProgress } from '../model/lesson-progress'
import type { Lesson } from '../types/lesson.types'
import { exerciseLessonContent } from '../data/exercise-content'
import { postureLessonContent } from '../data/posture-content'

export function useLessonProgress(lessonId?: string) {
  const { userId } = useAuth()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [progressModel] = useState(() => new LessonProgress())
  const [loading, setLoading] = useState(false)

  // Load static lesson content based on lessonId
  useEffect(() => {
    async function loadLesson() {
      try {
        setLoading(true)
        
        // Use static content based on lessonId
        const slides = lessonId === 'exercise-lesson' 
          ? exerciseLessonContent 
          : lessonId === 'posture-lesson'
            ? postureLessonContent
            : []

        if (slides.length > 0) {
          const lessonData: Lesson = {
            id: lessonId || 'default',
            title: lessonId === 'exercise-lesson' ? 'Exercise Lesson' : 'Posture Lesson',
            slides,
            progress: 0,
            currentSlideIndex: 0,
            completedSlideIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: userId || 'anonymous'
          }
          setLesson(lessonData)
        }
      } catch (error) {
        console.error('Error loading lesson:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLesson()
  }, [lessonId, userId])

  const completeSlide = useCallback(async (slideId: string) => {
    if (!lesson) return

    try {
      setLoading(true)
      progressModel.completeSlide(slideId, lesson.slides.length)
      
      // Update local lesson state
      setLesson(prev => {
        if (!prev) return null
        return {
          ...prev,
          completedSlideIds: [...prev.completedSlideIds, slideId],
          progress: progressModel.getProgress()
        }
      })
    } finally {
      setLoading(false)
    }
  }, [lesson, progressModel])

  return {
    lesson,
    progress: progressModel.getProgress(),
    completedSlides: new Set(lesson?.completedSlideIds || []),
    currentIndex: progressModel.getCurrentIndex(),
    loading,
    completeSlide
  }
}