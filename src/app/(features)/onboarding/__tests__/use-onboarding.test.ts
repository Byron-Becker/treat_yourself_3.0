// features/onboarding/hooks/__tests__/use-onboarding.test.ts

import { renderHook, act } from '@testing-library/react'
import { useOnboarding } from '../hooks/use-onboarding'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

describe('useOnboarding', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  it('should start with first slide', () => {
    const { result } = renderHook(() => useOnboarding())
    expect(result.current.currentSlide.id).toBe('intro')
  })

  it('should handle continue button', () => {
    const { result } = renderHook(() => useOnboarding())
    
    act(() => {
      result.current.handleContinue()
    })

    expect(result.current.currentSlide.id).toBe('teach')
  })

  it('should handle option selection', () => {
    const { result } = renderHook(() => useOnboarding())
    
    act(() => {
      result.current.handleOptionSelect('option-1')
    })

    expect(result.current.selectedOptionId).toBe('option-1')
  })

  it('should navigate to signup on completion', () => {
    const { result } = renderHook(() => useOnboarding())
    
    // Advance to last slide
    act(() => {
      result.current.handleContinue()
      result.current.handleContinue()
      result.current.handleContinue()
      result.current.handleContinue()
    })

    expect(mockPush).toHaveBeenCalledWith('/auth/sign-up')
  })
})