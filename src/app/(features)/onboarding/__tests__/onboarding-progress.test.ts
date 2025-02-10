// features/onboarding/model/__tests__/onboarding-progress.test.ts

import { OnboardingProgress } from '../model/onboarding-progress'

describe('OnboardingProgress', () => {
  let progress: OnboardingProgress

  beforeEach(() => {
    progress = new OnboardingProgress(4) // Total slides in our content
  })

  describe('Navigation', () => {
    it('should start at first slide', () => {
      expect(progress.getCurrentIndex()).toBe(0)
    })

    it('should advance when possible', () => {
      expect(progress.canAdvance()).toBe(true)
      expect(progress.advance()).toBe(true)
      expect(progress.getCurrentIndex()).toBe(1)
    })

    it('should not advance beyond last slide', () => {
      // Advance to last slide
      progress.advance()
      progress.advance()
      progress.advance()
      
      expect(progress.canAdvance()).toBe(false)
      expect(progress.advance()).toBe(false)
      expect(progress.getCurrentIndex()).toBe(3)
    })
  })

  describe('Option Selection', () => {
    it('should track selected option', () => {
      progress.selectOption('option-1')
      expect(progress.getSelectedOption()).toBe('option-1')
    })
  })

  describe('Completion', () => {
    it('should recognize completion at last slide', () => {
      expect(progress.isComplete()).toBe(false)
      
      // Advance to last slide
      progress.advance()
      progress.advance()
      progress.advance()
      
      expect(progress.isComplete()).toBe(true)
    })
  })
})