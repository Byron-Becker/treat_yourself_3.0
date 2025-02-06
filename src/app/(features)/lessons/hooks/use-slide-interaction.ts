// features/lessons/hooks/use-slide-interaction.ts

import { useState, useCallback } from 'react'
import { SlideInteraction } from '../model/slide-interaction'

export function useSlideInteraction() {
  const [interactionModel] = useState(() => new SlideInteraction())

  const handleAnswer = useCallback((optionId: string, correctOptionId: string) => {
    interactionModel.selectOption(optionId)
    interactionModel.submit(correctOptionId)
  }, [interactionModel])

  const showExplanationPanel = useCallback(() => {
    interactionModel.viewExplanation()
  }, [interactionModel])

  const reset = useCallback(() => {
    interactionModel.reset()
  }, [interactionModel])

  return {
    state: interactionModel.getState(),
    selectedOption: interactionModel.getSelectedOption(),
    isCorrect: interactionModel.isAnswerCorrect(),
    hasReviewed: interactionModel.hasReviewed(),
    canSubmit: interactionModel.canSubmit(),
    canViewExplanation: interactionModel.canViewExplanation(),
    handleAnswer,
    showExplanationPanel,
    reset
  }
}
