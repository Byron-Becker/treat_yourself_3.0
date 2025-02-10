// features/onboarding/model/onboarding-progress.ts

import type { OnboardingState } from '../types/onboarding.types'

export class OnboardingProgress {
  private state: OnboardingState

  constructor(totalSlides: number) {
    this.state = {
      currentSlideIndex: 0,
      totalSlides,
      selectedOptionId: null
    }
  }

  advance(): boolean {
    if (this.canAdvance()) {
      this.state.currentSlideIndex++
      return true
    }
    return false
  }

  selectOption(optionId: string): void {
    this.state.selectedOptionId = optionId
  }

  canAdvance(): boolean {
    return this.state.currentSlideIndex < this.state.totalSlides - 1
  }

  getCurrentIndex(): number {
    return this.state.currentSlideIndex
  }

  getSelectedOption(): string | null {
    return this.state.selectedOptionId
  }

  isComplete(): boolean {
    return this.state.currentSlideIndex === this.state.totalSlides - 1
  }
}