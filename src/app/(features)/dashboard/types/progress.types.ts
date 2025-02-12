export interface StreakData {
    dates: string[]
    currentStreak: number
    bestStreak: number
  }
  
  export interface ActivityLog {
    date: string
    type: 'exercise' | 'lesson' | 'assessment'
    id: string
  }
  
  export interface ProgressState {
    streakData: StreakData
    activityLog: ActivityLog[]
    lastActive: string | null
  }
  
  export interface DailyProgress {
    date: string
    isCompleted: boolean
  }
  
  export interface CourseProgress {
    courseId: string
    completedLessons: number
    totalLessons: number
    lastAccessed: string | null
  }