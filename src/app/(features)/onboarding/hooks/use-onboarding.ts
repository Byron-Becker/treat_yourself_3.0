// features/onboarding/hooks/use-onboarding.ts

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingProgress } from '../model/onboarding-progress'
import { ONBOARDING_CONTENT } from '../data/onboarding-content'

export function useOnboarding() {
  const router = useRouter()
  // Create state to force re-render when progress changes
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progressModel] = useState(() => new OnboardingProgress(ONBOARDING_CONTENT.length))

  const handleContinue = useCallback(() => {
    if (progressModel.isComplete()) {
      router.push('/auth/sign-up')
      return
    }
    
    // Update the progress model and state
    progressModel.advance()
    setCurrentIndex(progressModel.getCurrentIndex())
  }, [progressModel, router])

  const handleOptionSelect = useCallback((optionId: string) => {
    progressModel.selectOption(optionId)
  }, [progressModel])

  return {
    currentSlide: ONBOARDING_CONTENT[currentIndex], // Use currentIndex instead
    selectedOptionId: progressModel.getSelectedOption(),
    handleContinue,
    handleOptionSelect
  }
}