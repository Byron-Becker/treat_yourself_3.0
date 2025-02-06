// features/lessons/hooks/use-lesson.ts

import { useLessonProgress } from './use-lesson-progress'
import { useSlideInteraction } from './use-slide-interaction'
import { useViewportScroll } from './use-viewport-scroll'

export function useLesson() {
  const {
    lesson,
    progress,
    completedSlides,
    currentIndex,
    loading,
    completeSlide
  } = useLessonProgress()

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

  return {
    // Lesson Progress
    lesson,
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