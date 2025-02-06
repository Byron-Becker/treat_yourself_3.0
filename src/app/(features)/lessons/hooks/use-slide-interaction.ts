// hooks/use-slide-interaction.ts

import { useState, useCallback } from 'react'

export function useSlideInteraction() {
    const [interactionState, setInteractionState] = useState<'viewing' | 'answering' | 'reviewing'>('viewing')
    const [showExplanation, setShowExplanation] = useState(false)
    const [hasViewedExplanation, setHasViewedExplanation] = useState(false)
  
    const handleAnswer = useCallback(() => {
      setInteractionState('reviewing')
    }, [])
  
    const showExplanationPanel = useCallback(() => {
      setShowExplanation(true)
      setHasViewedExplanation(true)
    }, [])
  
    return {
      interactionState,
      showExplanation,
      hasViewedExplanation,
      handleAnswer,
      showExplanationPanel
    }
  }
  