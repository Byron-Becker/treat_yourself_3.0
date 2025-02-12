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

    const offset = 80 // Fixed offset for header
    const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset

    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }, [])

  const scrollToQuestion = useCallback((questionId: string) => {
    const element = refs.current.questions[questionId]
    if (element) {
      scrollToElement(element)
    }
  }, [scrollToElement])

  const scrollToInstruction = useCallback(() => {
    scrollToElement(refs.current.instruction)
  }, [scrollToElement])

  const scrollToSetup = useCallback((exerciseId: string) => {
    const element = refs.current.setup[exerciseId]
    if (element) {
      scrollToElement(element)
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

  // Single attempt scroll with a small delay
  const scrollWithRetry = useCallback((scrollFn: () => void) => {
    setTimeout(scrollFn, 50)
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