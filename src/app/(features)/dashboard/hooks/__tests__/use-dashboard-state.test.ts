// import { renderHook } from '@testing-library/react'
// import { useDashboardState } from '../use-dashboard-state'
// import { DashboardService } from '../../services/dashboard.service'

// jest.mock('@clerk/nextjs', () => ({
//   useAuth: () => ({
//     getToken: jest.fn().mockResolvedValue('mock-token')
//   })
// }))

// jest.mock('../../services/dashboard.service')

// describe('useDashboardState', () => {
//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   it('should initialize with loading state', () => {
//     const { result } = renderHook(() => useDashboardState())
    
//     expect(result.current.isLoading).toBe(true)
//     expect(result.current.error).toBeNull()
//   })

//   it('should update state when initial exam data is loaded', async () => {
//     const mockExam = {
//       id: '1',
//       is_completed: true,
//       body_map_id: '123',
//       created_at: new Date().toISOString()
//     }

//     ;(DashboardService.prototype.getInitialExamStatus as jest.Mock).mockResolvedValue({
//       data: mockExam,
//       error: null
//     })

//     const { result } = renderHook(() => useDashboardState())
    
//     // Wait for the next update using modern async testing
//     await new Promise(resolve => setTimeout(resolve, 0))

//     expect(result.current.state.initialExam.isCompleted).toBe(true)
//     expect(result.current.canAccessLessons).toBe(true)
//   })

//   // Add more tests...
// })