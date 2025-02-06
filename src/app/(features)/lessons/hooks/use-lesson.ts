// features/lessons/hooks/use-lesson.ts

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import type { Lesson, Slide } from '../types/lesson.types'
import { lessonService } from '../services/lesson.service'
import { SupabaseError } from '@/lib/supabase/errors/supabase'
import { useErrorHandler } from '@/lib/errors/handlers'
import { exerciseLessonContent } from '../data/exercise-content'
import { postureLessonContent } from '../data/posture-content'

interface LessonHookState {
  currentIndex: number
  visibleSlides: Slide[]
  completedSlides: Set<string>
  loading: boolean
  loadingType: 'image' | 'transition' | 'saving' | null
  loadingProgress: number
}

// First, let's add a function to get initial lesson data based on lessonId
const getInitialLessonContent = (lessonId: string): { title: string; description: string; slides: Slide[] } => {
  // This would probably come from your lesson content files
  // You could move this to a separate file if it grows large
  switch (lessonId) {
    case 'exercise-lesson':
      return {
        title: 'Exercise Fundamentals',
        description: 'Learn the basics of proper exercise form and technique',
        slides: exerciseLessonContent as Slide[]
      }
    case 'posture-lesson':
      return {
        title: 'Posture Basics',
        description: 'Understanding and improving your posture',
        slides: postureLessonContent as Slide[]
      }
    default:
      throw new Error(`No content found for lesson: ${lessonId}`)
  }
}

export function useLesson(lessonId: string) {
  const isMounted = useRef(false)
  const fetchInProgress = useRef(false)
  const { userId, getToken } = useAuth()
  const { user } = useUser()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [state, setState] = useState<LessonHookState>({
    currentIndex: 0,
    visibleSlides: [],
    completedSlides: new Set(),
    loading: true,
    loadingType: null,
    loadingProgress: 0
  })
  const [error, setError] = useState<SupabaseError | null>(null)
  const handleError = useErrorHandler()

  const authState = useMemo(() => ({
    userId,
    user,
    getToken
  }), [userId, user, getToken])

  // Fetch lesson data and progress
  const fetchLesson = useCallback(async () => {
    if (!authState.userId || fetchInProgress.current) return

    try {
      fetchInProgress.current = true
      setState(prev => ({ ...prev, loading: true }))
      setError(null)

      const token = await authState.getToken({ template: 'supabase' })
      let lessonData = await lessonService.getLessonProgress(authState.userId, lessonId, token)

      if (!lessonData) {
        // Get initial content for this lesson
        const lessonContent = getInitialLessonContent(lessonId)
        
        // Initialize new lesson progress with required fields
        const initialLesson = {
          title: lessonContent.title, // Added title
          description: lessonContent.description,
          slides: lessonContent.slides,
          userId: authState.userId,
          progress: 0,
          currentSlideIndex: 0,
          completedSlideIds: []
        }
        
        lessonData = await lessonService.createLessonProgress(initialLesson, token)
      }

      if (isMounted.current) {
        setLesson(lessonData)
        setState(prev => ({
          ...prev,
          currentIndex: lessonData.currentSlideIndex,
          visibleSlides: lessonData.slides.slice(0, lessonData.currentSlideIndex + 1),
          completedSlides: new Set(lessonData.completedSlideIds)
        }))
      }
    } catch (err) {
      if (isMounted.current) {
        const supabaseError = SupabaseError.fromError(err)
        setError(supabaseError)
        handleError(supabaseError)
      }
    } finally {
      if (isMounted.current) {
        setState(prev => ({ ...prev, loading: false }))
      }
      fetchInProgress.current = false
    }
  }, [authState, lessonId, handleError])

  // Complete a slide
  const completeSlide = useCallback(async (slideId: string) => {
    if (!authState.userId || !lesson) return

    try {
      setState(prev => ({ ...prev, loadingType: 'saving' }))
      const token = await authState.getToken({ template: 'supabase' })
      const updatedLesson = await lessonService.completeSlide(lesson.id, slideId, token)

      if (isMounted.current) {
        setLesson(updatedLesson)
        setState(prev => ({
          ...prev,
          completedSlides: new Set(updatedLesson.completedSlideIds)
        }))
      }
    } catch (err) {
      if (isMounted.current) {
        const supabaseError = SupabaseError.fromError(err)
        setError(supabaseError)
        handleError(supabaseError)
      }
    } finally {
      if (isMounted.current) {
        setState(prev => ({ ...prev, loadingType: null }))
      }
    }
  }, [authState, lesson, handleError])

  // Show next slide
  const showNextSlide = useCallback(() => {
    if (!lesson) return

    const nextIndex = state.currentIndex + 1
    if (nextIndex < lesson.slides.length) {
      setState(prev => ({
        ...prev,
        currentIndex: nextIndex,
        visibleSlides: lesson.slides.slice(0, nextIndex + 1)
      }))
    }
  }, [lesson, state.currentIndex])

  useEffect(() => {
    isMounted.current = true
    
    if (authState.userId && !lesson && !error) {
      fetchLesson()
    }

    return () => {
      isMounted.current = false
    }
  }, [authState.userId, lesson, error, fetchLesson])

  return {
    lesson,
    currentIndex: state.currentIndex,
    visibleSlides: state.visibleSlides,
    completedSlides: state.completedSlides,
    loading: state.loading,
    loadingType: state.loadingType,
    loadingProgress: state.loadingProgress,
    error,
    completeSlide,
    showNextSlide,
    refreshLesson: fetchLesson
  }
}