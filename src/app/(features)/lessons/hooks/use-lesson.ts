// features/lessons/hooks/use-lesson.ts

import { useLessonProgress } from './use-lesson-progress'
import { useSlideInteraction } from './use-slide-interaction'
import { useViewportScroll } from './use-viewport-scroll'
import { useMemo } from 'react'

export function useLesson(lessonId?: string) {
  const {
    lesson,
    progress,
    completedSlides,
    currentIndex,
    loading,
    completeSlide
  } = useLessonProgress(lessonId)

  const {
    state: interactionState,
    selectedOption,
    isCorrect,
    hasReviewed,
    canSubmit,
    canViewExplanation,
    handleAnswer,
    showExplanationPanel,
    reset: resetInteraction
  } = useSlideInteraction()

  const {
    updateSlidePosition,
    scrollToSlide,
    activeSlideId,
    lastScrollPosition
  } = useViewportScroll()

  // Calculate visible slides based on lesson data and current index
  const visibleSlides = useMemo(() => {
    if (!lesson?.slides) return []
    // Only show current slide
    return lesson.slides.slice(0, currentIndex + 1)
  }, [lesson?.slides, currentIndex])

  return {
    // Lesson Progress
    lesson,
    visibleSlides,
    progress,
    completedSlides,
    currentIndex,
    loading,
    completeSlide,

    // Interaction State  
    interactionState,
    selectedOption,
    isCorrect,
    hasReviewed,
    canSubmit,
    canViewExplanation,
    handleAnswer,
    showExplanationPanel,
    resetInteraction,

    // Viewport/Scroll
    updateSlidePosition,
    scrollToSlide,
    activeSlideId,
    lastScrollPosition
  }
}