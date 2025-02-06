// features/lessons/hooks/use-viewport-scroll.ts

import { useState, useCallback } from 'react'
import { ViewportState } from '../model/viewport-state'

export function useViewportScroll() {
  const [viewportModel] = useState(() => new ViewportState())

  const updateSlidePosition = useCallback((
    slideId: string, 
    bounds: { top: number; bottom: number }
  ) => {
    viewportModel.updateSlidePosition(slideId, bounds)
  }, [viewportModel])

  const scrollToSlide = useCallback((slideId: string) => {
    const bounds = viewportModel.getSlideBounds(slideId)
    if (!bounds) return

    const scrollPosition = bounds.top
    viewportModel.recordScrollPosition(scrollPosition)
    
    window.scrollTo({
      top: Math.max(0, scrollPosition),
      behavior: 'smooth'
    })
  }, [viewportModel])

  return {
    updateSlidePosition,
    scrollToSlide,
    activeSlideId: viewportModel.getActiveSlideId(),
    lastScrollPosition: viewportModel.getLastScrollPosition()
  }
}