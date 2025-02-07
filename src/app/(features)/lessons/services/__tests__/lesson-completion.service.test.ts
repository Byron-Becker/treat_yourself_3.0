// features/lessons/services/__tests__/lesson-completion.service.test.ts

import { lessonCompletionService } from '../lesson-completion.service'
import SupabaseClientSingleton from '@/lib/supabase/client-singleton'

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
   
   mockSupabaseClient = {
     from: jest.fn().mockReturnValue({
       insert: jest.fn().mockReturnThis(),
       select: jest.fn().mockReturnThis(),
       single: jest.fn()
     }),
     rpc: jest.fn()
   }

   ;(SupabaseClientSingleton.getInstance as jest.Mock).mockResolvedValue(mockSupabaseClient)
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