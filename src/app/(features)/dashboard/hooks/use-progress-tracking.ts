import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ProgressTrackingModel } from '../model/progress-tracking'
import { ProgressService } from '../services/progress.service'


export function useProgressTracking() {
  const { getToken } = useAuth()
  const [progressModel] = useState(() => new ProgressTrackingModel())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadProgressData() {
      try {
        setIsLoading(true)
        const token = await getToken({ template: 'supabase' })
        const service = new ProgressService(token)
        
        const activityResponse = await service.getActivityDates({
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        })

        if (activityResponse.data) {
          activityResponse.data.forEach(date => {
            progressModel.addActivity({
              date,
              type: 'exercise',
              id: date
            })
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load progress'))
      } finally {
        setIsLoading(false)
      }
    }

    loadProgressData()
  }, [getToken, progressModel])

  return {
    streakData: progressModel.getStreakData(),
    activityLog: progressModel.getActivityLog(),
    isLoading,
    error
  }
}