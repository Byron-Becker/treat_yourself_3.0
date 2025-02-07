// features/lessons/services/__tests__/lesson-completion.service.test.ts

import { lessonCompletionService } from '../lesson-completion.service'
import SupabaseClientSingleton from '@/lib/supabase/client-singleton'

// Mock the Supabase client singleton
jest.mock('@/lib/supabase/client-singleton', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn()
  }
}))

describe('LessonCompletionService', () => {
  const mockToken = 'test-token'
  const mockLessonId = 'lesson-1'
  const mockUserId = 'user-1'
  let mockSupabaseClient: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Create mock Supabase client
    mockSupabaseClient = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
        maybeSingle: jest.fn()
      }),
      rpc: jest.fn()
    }

    // Setup getInstance mock
    ;(SupabaseClientSingleton.getInstance as jest.Mock).mockResolvedValue(mockSupabaseClient)
  })

  describe('getCompletion', () => {
    it('should fetch completion status for a lesson', async () => {
      const mockCompletion = {
        id: '123',
        lesson_id: mockLessonId,
        user_id: mockUserId,
        completed_at: new Date().toISOString()
      }

      mockSupabaseClient.from().maybeSingle.mockResolvedValue({
        data: mockCompletion,
        error: null
      })

      const result = await lessonCompletionService.getCompletion(mockLessonId, mockToken)
      
      expect(result).toEqual(mockCompletion)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('lesson_completions')
    })

    it('should return null when no completion exists', async () => {
      mockSupabaseClient.from().maybeSingle.mockResolvedValue({
        data: null,
        error: null
      })

      const result = await lessonCompletionService.getCompletion(mockLessonId, mockToken)
      
      expect(result).toBeNull()
    })
  })

  describe('createCompletion', () => {
    beforeEach(() => {
      mockSupabaseClient.rpc.mockResolvedValue({
        data: mockUserId,
        error: null
      })
    })

    it('should create a new completion record', async () => {
      const mockCompletion = {
        id: '123',
        lesson_id: mockLessonId,
        user_id: mockUserId,
        completed_at: new Date().toISOString()
      }

      mockSupabaseClient.from().single.mockResolvedValue({
        data: mockCompletion,
        error: null
      })

      const result = await lessonCompletionService.createCompletion(
        { lesson_id: mockLessonId }, 
        mockToken
      )
      
      expect(result).toEqual(mockCompletion)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('lesson_completions')
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('requesting_user_id')
    })

    it('should throw error when user id not found', async () => {
      mockSupabaseClient.rpc.mockResolvedValue({
        data: null,
        error: null
      })

      await expect(
        lessonCompletionService.createCompletion(
          { lesson_id: mockLessonId }, 
          mockToken
        )
      ).rejects.toThrow('No user ID found in JWT claims')
    })
  })
})