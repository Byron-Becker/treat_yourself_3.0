import { DashboardService } from '../dashboard.service'

describe('DashboardService', () => {
  let service: DashboardService
  let mockClient: any

  beforeEach(() => {
    mockClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(),
      order: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis()
    }
    service = new DashboardService(mockClient)
  })

  describe('getInitialExamStatus', () => {
    it('should return initial exam data when exists', async () => {
      const mockExam = {
        id: '1',
        is_completed: true
      }
      mockClient.maybeSingle.mockResolvedValue({ data: mockExam })

      const result = await service.getInitialExamStatus()
      expect(result.data).toEqual(mockExam)
      expect(result.error).toBeNull()
    })

    it('should handle errors properly', async () => {
      const mockError = new Error('Database error')
      mockClient.maybeSingle.mockRejectedValue(mockError)

      const result = await service.getInitialExamStatus()
      expect(result.data).toBeNull()
      expect(result.error).toEqual(mockError)
    })
  })

  // Add more test cases...
})