import type { ProgressState, ActivityLog, StreakData } from '../types/progress.types'

export class ProgressTrackingModel {
  private state: ProgressState

  constructor(initial?: Partial<ProgressState>) {
    this.state = {
      streakData: {
        dates: initial?.streakData?.dates ?? [],
        currentStreak: initial?.streakData?.currentStreak ?? 0,
        bestStreak: initial?.streakData?.bestStreak ?? 0
      },
      activityLog: initial?.activityLog ?? [],
      lastActive: initial?.lastActive ?? null
    }
  }

  addActivity(activity: ActivityLog): void {
    this.state.activityLog.push(activity)
    this.state.lastActive = activity.date
    this.updateStreakData(activity.date)
  }

  private updateStreakData(activityDate: string): void {
    const dates = new Set(this.state.streakData.dates)
    dates.add(activityDate)
    
    this.state.streakData.dates = Array.from(dates).sort()
    this.calculateCurrentStreak()
  }

  private calculateCurrentStreak(): void {
    if (!this.state.streakData.dates.length) {
      this.state.streakData.currentStreak = 0
      return
    }

    // const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString().split('T')[0]

    const sortedDates = [...this.state.streakData.dates].sort()
    const lastActivityDate = sortedDates[sortedDates.length - 1]

    if (lastActivityDate < yesterday) {
      this.state.streakData.currentStreak = 0
      return
    }

    let streak = 1
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const currentDate = new Date(sortedDates[i])
      const nextDate = new Date(sortedDates[i + 1])
      
      const diffDays = Math.floor(
        (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      
      if (diffDays === 1) {
        streak++
      } else {
        break
      }
    }

    this.state.streakData.currentStreak = streak
    this.state.streakData.bestStreak = Math.max(
      this.state.streakData.bestStreak,
      streak
    )
  }

  getStreakData(): StreakData {
    return { ...this.state.streakData }
  }

  getActivityLog(): ActivityLog[] {
    return [...this.state.activityLog]
  }
}