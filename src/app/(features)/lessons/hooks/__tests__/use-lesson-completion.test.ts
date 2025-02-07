// features/lessons/hooks/__tests__/use-lesson-completion.test.tsx

import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@clerk/nextjs'
import { useLessonCompletion } from '../use-lesson-completion'
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

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLessonCompletion(mockLessonId))

    expect(result.current.isCompleting).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should successfully complete a lesson', async () => {
    ;(createCompletion as jest.Mock).mockResolvedValue({
      id: '123',
      lesson_id: mockLessonId,
      completed_at: new Date().toISOString()
    })

    const { result } = renderHook(() => useLessonCompletion(mockLessonId))

    await act(async () => {
      await result.current.complete()
    })

    expect(createCompletion).toHaveBeenCalledWith(mockLessonId, mockToken)
    expect(result.current.isCompleting).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle completion failure', async () => {
    const error = new Error('Failed to complete')
    ;(createCompletion as jest.Mock).mockRejectedValue(error)

    const { result } = renderHook(() => useLessonCompletion(mockLessonId))

    await act(async () => {
      try {
        await result.current.complete()
      } catch (e) {
        expect(e).toBe(error)
      }
    })

    expect(result.current.isCompleting).toBe(false)
    expect(result.current.error).toBe(error)
  })

  it('should handle auth token failure', async () => {
    const error = new Error('Auth error')
    ;(useAuth as jest.Mock).mockReturnValue({
      getToken: jest.fn().mockRejectedValue(error)
    })

    const { result } = renderHook(() => useLessonCompletion(mockLessonId))

    await act(async () => {
      try {
        await result.current.complete()
      } catch (e) {
        expect(e).toBe(error)
      }
    })

    expect(result.current.isCompleting).toBe(false)
    expect(result.current.error).toBe(error)
  })
})