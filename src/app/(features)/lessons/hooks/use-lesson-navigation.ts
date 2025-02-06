// hooks/use-lesson-navigation.ts

import { useState, useCallback } from "react"
import type { Slide } from "../types/lesson.types"

export function useLessonNavigation(slides: Slide[] = []) {

    const [currentIndex, setCurrentIndex] = useState(0)
    const [visibleSlides, setVisibleSlides] = useState<Slide[]>([])
  
    const showNextSlide = useCallback(() => {
      const nextIndex = currentIndex + 1
      if (nextIndex < slides.length) {
        setCurrentIndex(nextIndex)
        setVisibleSlides(slides.slice(0, nextIndex + 1))
      }
    }, [currentIndex, slides])
  
    return {
      currentIndex,
      visibleSlides,
      showNextSlide,
    }
  }