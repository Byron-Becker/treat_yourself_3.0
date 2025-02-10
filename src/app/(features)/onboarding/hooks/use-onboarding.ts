// features/onboarding/hooks/use-onboarding.ts

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingProgress } from '../model/onboarding-progress'
import { ONBOARDING_CONTENT } from '../data/onboarding-content'

export function useOnboarding() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [progressModel] = useState(() => new OnboardingProgress(ONBOARDING_CONTENT.length))

  const handleContinue = useCallback(() => {
    if (progressModel.isComplete()) {
      router.push('/auth/sign-up')
      return
    }
    progressModel.advance()
    setCurrentIndex(progressModel.getCurrentIndex())
  }, [progressModel, router])

  const handleOptionSelect = useCallback((optionId: string) => {
    setSelectedOptionId(optionId)
    progressModel.selectOption(optionId)
  }, [progressModel])

  return {
    currentSlide: ONBOARDING_CONTENT[currentIndex],
    selectedOptionId,
    handleContinue,
    handleOptionSelect
  }
}