// hooks/use-slide-scroll.ts

import { useRef,useCallback } from "react"

export function useSlideScroll() {
    const lastScrollPosition = useRef<number>(0)
  
    const scrollToSlide = useCallback((index: number) => {
      const slides = document.querySelectorAll('.slide-item')
      const targetSlide = slides[index]
      
      if (!targetSlide) return
  
      const slideRect = targetSlide.getBoundingClientRect()
      const scrollPosition = slideRect.top + window.scrollY
  
      lastScrollPosition.current = scrollPosition
      window.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      })
    }, [])
  
    return { scrollToSlide }
  }