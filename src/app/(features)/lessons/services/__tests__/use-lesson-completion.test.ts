// features/lessons/hooks/__tests__/use-lesson-completion.test.ts

import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@clerk/nextjs'
import { useLessonCompletion } from '../../hooks/use-lesson-completion'
import { createCompletion } from '../../actions/lesson-completion'

// Mock dependencies
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn()
}))

jest.mock('../../actions/lesson-completion', () => ({
  createCompletion: jest.fn()
}))

describe('useLessonCompletion', () => {
  const mockLessonId = 'lesson-1'
  const mockToken = 'test-token'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      getToken: jest.fn().mockResolvedValue(mockToken)
    })
  })

  it('should handle successful completion', async () => {
    ;(createCompletion as jest.Mock).mockResolvedValue({
      id: '123',
      lesson_id: mockLessonId,
      completed_at: new Date().toISOString()
    })

    const { result } = renderHook(() => useLessonCompletion(mockLessonId))

    expect(result.current.isCompleting).toBe(false)
    expect(result.current.error).toBeNull()

    await act(async () => {
      await result.current.complete()
    })

    expect(createCompletion).toHaveBeenCalledWith(mockLessonId, mockToken)
    expect(result.current.isCompleting).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle completion errors', async () => {
    const error = new Error('Failed to complete')
    ;(createCompletion as jest.Mock).mockRejectedValue(error)

    const { result } = renderHook(() => useLessonCompletion(mockLessonId))

    await act(async () => {
      try {
        await result.current.complete()
        
      } catch (e) {
        // Error is expected
      }
    })

    expect(result.current.isCompleting).toBe(false)
    expect(result.current.error).toEqual(error)
  })
})