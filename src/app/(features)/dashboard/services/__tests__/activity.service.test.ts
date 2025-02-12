// import { ActivityService } from '../activity.service'
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

// describe('ActivityService', () => {
//   let service: ActivityService
//   let mockSupabaseQuery: any

//   beforeEach(() => {
//     mockSupabaseQuery = {
//       from: jest.fn().mockReturnThis(),
//       select: jest.fn().mockReturnThis(),
//       order: jest.fn().mockReturnThis(),
//       eq: jest.fn().mockReturnThis(),
//       limit: jest.fn().mockReturnThis()
//     }

//     // Use the exposed methods from mock class
//     ;(MockBaseService.prototype.exposedGetClient as jest.Mock).mockResolvedValue(mockSupabaseQuery)
//     ;(MockBaseService.prototype.exposedWithErrorHandling as jest.Mock).mockImplementation(
//       (fn) => fn()
//     )

//     service = new ActivityService()
//   })

//   describe('getRecentActivity', () => {
//     it('should fetch recent activities with limit', async () => {
//       const mockActivities = [
//         { id: '1', completed_at: '2024-02-12T10:00:00Z' },
//         { id: '2', completed_at: '2024-02-11T10:00:00Z' }
//       ]

//       mockSupabaseQuery.limit.mockResolvedValue({ data: mockActivities, error: null })

//       const result = await service.getRecentActivity({ limit: 2 })

//       expect(result.data).toEqual(mockActivities)
//       expect(mockSupabaseQuery.limit).toHaveBeenCalledWith(2)
//     })

//     it('should handle errors gracefully', async () => {
//       const mockError = new Error('Database error')
//       mockSupabaseQuery.select.mockResolvedValue({ data: null, error: mockError })

//       await expect(service.getRecentActivity()).rejects.toThrow('Database error')
//     })
//   })

//   describe('getCurrentStreak', () => {
//     it('should calculate streak correctly', async () => {
//       // Mock current date to be fixed
//       jest.useFakeTimers().setSystemTime(new Date('2024-02-12'))

//       const mockDates = {
//         data: [
//           { completed_at: '2024-02-12T10:00:00Z' },
//           { completed_at: '2024-02-11T10:00:00Z' },
//           { completed_at: '2024-02-10T10:00:00Z' },
//           // Gap
//           { completed_at: '2024-02-08T10:00:00Z' }
//         ],
//         error: null
//       }

//       mockSupabaseQuery.order.mockResolvedValue(mockDates)

//       const result = await service.getCurrentStreak()

//       expect(result.data).toBe(3) // 3 consecutive days
//     })

//     it('should return 0 for no recent activity', async () => {
//       jest.useFakeTimers().setSystemTime(new Date('2024-02-12'))

//       const mockDates = {
//         data: [
//           { completed_at: '2024-02-09T10:00:00Z' } // 3 days ago
//         ],
//         error: null
//       }

//       mockSupabaseQuery.order.mockResolvedValue(mockDates)

//       const result = await service.getCurrentStreak()

//       expect(result.data).toBe(0)
//     })
//   })

//   afterEach(() => {
//     jest.useRealTimers()
//   })
// })