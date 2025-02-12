import { useCallback, useRef } from 'react'

interface ScrollRefs {
  questions: Record<string, HTMLDivElement | null>
  instruction: HTMLDivElement | null
  setup: Record<string, HTMLDivElement | null>
}

export function useExerciseScroll() {
  const refs = useRef<ScrollRefs>({
    questions: {},
    instruction: null,
    setup: {}
  })

  const scrollToElement = useCallback((element: HTMLElement | null) => {
    if (!element) return
    
    const headerHeight = 64 // Approximate header height
    const footerHeight = 80 // Approximate footer height
    const windowHeight = window.innerHeight
    const elementRect = element.getBoundingClientRect()
    
    // Calculate the ideal scroll position
    const scrollPosition = 
      window.scrollY + 
      elementRect.top - 
      headerHeight - 
      (windowHeight - elementRect.height - footerHeight) / 2
    
    window.scrollTo({
      top: Math.max(0, scrollPosition),
      behavior: 'smooth'
    })
  }, [])

  const scrollToQuestion = useCallback((questionId: string) => {
    if (refs.current.questions[questionId]) {
      scrollToElement(refs.current.questions[questionId])
    }
  }, [scrollToElement])

  const scrollToInstruction = useCallback(() => {
    scrollToElement(refs.current.instruction)
  }, [scrollToElement])

  const scrollToSetup = useCallback((exerciseId: string) => {
    if (refs.current.setup[exerciseId]) {
      scrollToElement(refs.current.setup[exerciseId])
    }
  }, [scrollToElement])

  const getQuestionRef = useCallback((questionId: string) => (
    (el: HTMLDivElement | null) => {
      refs.current.questions[questionId] = el
    }
  ), [])

  const getInstructionRef = useCallback((el: HTMLDivElement | null) => {
    refs.current.instruction = el
  }, [])

  const getSetupRef = useCallback((exerciseId: string) => (
    (el: HTMLDivElement | null) => {
      refs.current.setup[exerciseId] = el
    }
  ), [])

  const scrollWithRetry = useCallback((scrollFn: () => void) => {
    // Initial scroll
    setTimeout(scrollFn, 100)
    // Retry scrolls to handle dynamic content
    setTimeout(scrollFn, 300)
    setTimeout(scrollFn, 500)
  }, [])

  return {
    scrollToQuestion,
    scrollToInstruction,
    scrollToSetup,
    getQuestionRef,
    getInstructionRef,
    getSetupRef,
    scrollWithRetry
  }
} 