// import { ProgressService } from '../progress.service'
// import { BaseService } from '@/lib/supabase/services/base'

// // Create a mock base service class that exposes protected methods for testing
// class MockBaseService extends BaseService {
//   public exposedGetClient() {
//     return this.getClient()
//   }
//   public exposedWithErrorHandling(fn: () => Promise<any>) {
//     return this.withErrorHandling(fn)
//   }
// }

// jest.mock('@/lib/supabase/services/base', () => {
//   return {
//     BaseService: jest.fn().mockImplementation(() => {
//       return new MockBaseService()
//     })
//   }
// })

// describe('ProgressService', () => {
//   let service: ProgressService
//   let mockSupabaseQuery: any

//   beforeEach(() => {
//     mockSupabaseQuery = {
//       from: jest.fn().mockReturnThis(),
//       select: jest.fn().mockReturnThis(),
//       eq: jest.fn().mockReturnThis(),
//       gte: jest.fn().mockReturnThis(),
//       lte: jest.fn().mockReturnThis()
//     }

//     // Use the exposed methods from mock class
//     ;(MockBaseService.prototype.exposedGetClient as jest.Mock).mockResolvedValue(mockSupabaseQuery)
//     ;(MockBaseService.prototype.exposedWithErrorHandling as jest.Mock).mockImplementation(
//       (fn) => fn()
//     )

//     service = new ProgressService()
//   })

//   describe('getActivityDates', () => {
//     it('should fetch activity dates with date range', async () => {
//       const mockActivities = [
//         { completed_at: '2024-02-12T10:00:00Z' },
//         { completed_at: '2024-02-11T10:00:00Z' }
//       ]

//       mockSupabaseQuery.lte.mockResolvedValue({ data: mockActivities, error: null })

//       const result = await service.getActivityDates({
//         from: '2024-02-10',
//         to: '2024-02-12'
//       })

//       expect(result.data).toEqual(['2024-02-12', '2024-02-11'])
//       expect(mockSupabaseQuery.from).toHaveBeenCalledWith('exercise_series')
//       expect(mockSupabaseQuery.gte).toHaveBeenCalledWith('completed_at', '2024-02-10')
//       expect(mockSupabaseQuery.lte).toHaveBeenCalledWith('completed_at', '2024-02-12')
//     })

//     it('should handle missing date range', async () => {
//       const mockActivities = [
//         { completed_at: '2024-02-12T10:00:00Z' }
//       ]

//       mockSupabaseQuery.eq.mockResolvedValue({ data: mockActivities, error: null })

//       const result = await service.getActivityDates()

//       expect(result.data).toEqual(['2024-02-12'])
//     })
//   })

//   describe('getLessonProgress', () => {
//     it('should fetch lesson progress', async () => {
//       const mockProgress = [
//         { id: '1', lesson_id: 'lesson1', completed: true },
//         { id: '2', lesson_id: 'lesson2', completed: false }
//       ]

//       mockSupabaseQuery.select.mockResolvedValue({ data: mockProgress, error: null })

//       const result = await service.getLessonProgress()

//       expect(result.data).toEqual(mockProgress)
//       expect(mockSupabaseQuery.from).toHaveBeenCalledWith('lesson_completions')
//     })

//     it('should handle errors', async () => {
//       const mockError = new Error('Database error')
//       mockSupabaseQuery.select.mockResolvedValue({ data: null, error: mockError })

//       await expect(service.getLessonProgress()).rejects.toThrow('Database error')
//     })
//   })
// })