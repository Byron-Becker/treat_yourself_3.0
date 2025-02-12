// import { DashboardService } from '../dashboard.service'
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

// describe('DashboardService', () => {
//   let service: DashboardService
//   let mockSupabaseQuery: any

//   beforeEach(() => {
//     mockSupabaseQuery = {
//       from: jest.fn().mockReturnThis(),
//       select: jest.fn().mockReturnThis(),
//       maybeSingle: jest.fn().mockReturnThis(),
//       order: jest.fn().mockReturnThis(),
//       gte: jest.fn().mockReturnThis()
//     }

//     // Use the exposed methods from mock class
//     ;(MockBaseService.prototype.exposedGetClient as jest.Mock).mockResolvedValue(mockSupabaseQuery)
//     ;(MockBaseService.prototype.exposedWithErrorHandling as jest.Mock).mockImplementation(
//       (fn) => fn()
//     )

//     service = new DashboardService()
//   })

//   describe('getInitialExamStatus', () => {
//     it('should fetch initial exam status', async () => {
//       const mockExam = {
//         id: '1',
//         is_completed: true,
//         created_at: '2024-02-12T10:00:00Z'
//       }

//       mockSupabaseQuery.maybeSingle.mockResolvedValue({ data: mockExam, error: null })

//       const result = await service.getInitialExamStatus()

//       expect(result.data).toEqual(mockExam)
//       expect(mockSupabaseQuery.from).toHaveBeenCalledWith('initial_exams')
//     })

//     it('should handle missing exam data', async () => {
//       mockSupabaseQuery.maybeSingle.mockResolvedValue({ data: null, error: null })

//       const result = await service.getInitialExamStatus()

//       expect(result.data).toBeNull()
//     })
//   })

//   describe('getLessonCompletions', () => {
//     it('should fetch lesson completions', async () => {
//       const mockCompletions = [
//         { id: '1', lesson_id: 'lesson1', completed_at: '2024-02-12T10:00:00Z' },
//         { id: '2', lesson_id: 'lesson2', completed_at: '2024-02-11T10:00:00Z' }
//       ]

//       mockSupabaseQuery.order.mockResolvedValue({ data: mockCompletions, error: null })

//       const result = await service.getLessonCompletions()

//       expect(result.data).toEqual(mockCompletions)
//       expect(mockSupabaseQuery.from).toHaveBeenCalledWith('lesson_completions')
//     })
//   })

//   describe('hasRecentROMAssessment', () => {
//     it('should check for recent ROM assessment', async () => {
//       jest.useFakeTimers().setSystemTime(new Date('2024-02-12'))

//       mockSupabaseQuery.gte.mockResolvedValue({ count: 1, error: null })

//       const result = await service.hasRecentROMAssessment()

//       expect(result.data).toBe(true)
//       expect(mockSupabaseQuery.from).toHaveBeenCalledWith('rom_assessments')
//     })

//     it('should return false when no recent assessments', async () => {
//       mockSupabaseQuery.gte.mockResolvedValue({ count: 0, error: null })

//       const result = await service.hasRecentROMAssessment()

//       expect(result.data).toBe(false)
//     })
//   })

//   afterEach(() => {
//     jest.useRealTimers()
//   })
// })