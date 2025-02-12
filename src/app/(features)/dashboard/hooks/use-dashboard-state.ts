import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { DashboardStateModel } from '../model/dashboard-state'
import { DashboardService } from '../services/dashboard.service'

export function useDashboardState() {
  const { getToken } = useAuth()
  const [dashboardModel] = useState(() => new DashboardStateModel())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadDashboardState() {
      try {
        setIsLoading(true)
        const token = await getToken({ template: 'supabase' })
        const service = new DashboardService(token)

        const [examResponse, completionsResponse] = await Promise.all([
          service.getInitialExamStatus(),
          service.getLessonCompletions()
        ])

        if (examResponse.data) {
          dashboardModel.updateInitialExam({
            id: examResponse.data.id,
            isCompleted: examResponse.data.is_completed,
            bodyMapId: examResponse.data.body_map_id,
            createdAt: examResponse.data.created_at
          })
        }

        if (completionsResponse.data) {
          completionsResponse.data.forEach(completion => {
            dashboardModel.updateLessonCompletion(completion.lesson_id, {
              id: completion.id,
              isCompleted: true,
              completedAt: completion.completed_at
            })
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load dashboard'))
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardState()
  }, [getToken, dashboardModel])

  return {
    state: dashboardModel.getState(),
    canAccessLessons: dashboardModel.canAccessLessons(),
    canAccessExercises: dashboardModel.canAccessExercises(),
    isLoading,
    error
  }
}