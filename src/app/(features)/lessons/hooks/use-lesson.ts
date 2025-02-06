import { useLessonNavigation } from "./use-lesson-navigation"
import { useLessonProgress } from "./use-lesson-progress"
import { useSlideInteraction } from "./use-slide-interaction"
import { useSlideScroll } from "./use-slide-scroll"

// hooks/use-lesson.ts (composition hook)
export function useLesson() {
    const { lesson, completedSlides, loading, completeSlide } = useLessonProgress()
    const { currentIndex, visibleSlides, showNextSlide } = useLessonNavigation(lesson?.slides)
    const { scrollToSlide } = useSlideScroll()
    const { 
      interactionState,
      showExplanation,
      hasViewedExplanation,
      handleAnswer,
      showExplanationPanel
    } = useSlideInteraction()
  
    // Compose behavior here
  
    return {
      lesson,
      currentIndex,
      visibleSlides,
      completedSlides,
      loading,
      interactionState,
      showExplanation,
      hasViewedExplanation,
      completeSlide,
      showNextSlide,
      scrollToSlide,
      handleAnswer,
      showExplanationPanel
    }
  }