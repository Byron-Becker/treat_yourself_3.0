import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { UserActivityModel } from '../model/user-activity'
import { ActivityService } from '../services/activity.service'

export function useUserActivity() {
  const { getToken } = useAuth()
  const [activityModel] = useState(() => new UserActivityModel())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadActivityData() {
      try {
        setIsLoading(true)
        const token = await getToken({ template: 'supabase' })
        const service = new ActivityService(token)

        const [recentActivityResponse, streakResponse] = await Promise.all([
          service.getRecentActivity({ limit: 10 }),
          service.getCurrentStreak()
        ])

        if (recentActivityResponse.data?.[0]) {
          activityModel.recordExercise(
            recentActivityResponse.data[0].completed_at
          )
        }

        if (streakResponse.data) {
          // Update streak in model if needed
          const currentStreak = streakResponse.data
          for (let i = 0; i < currentStreak; i++) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            activityModel.recordExercise(date.toISOString())
          }
        }

      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load activity'))
      } finally {
        setIsLoading(false)
      }
    }

    loadActivityData()
  }, [getToken, activityModel])

  return {
    exerciseStreak: activityModel.getExerciseStreak(),
    totalExercises: activityModel.getTotalExercises(),
    completedLessons: activityModel.getCompletedLessons(),
    needsAssessment: activityModel.needsAssessment(),
    isLoading,
    error
  }
}