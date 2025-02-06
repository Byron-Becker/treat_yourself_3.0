// app/dashboard/types/dashboard.types.ts

// Core domain models
export interface DashboardActivity {
    id: string
    user_id: string
    activity_date: string
    completed_at: string
    activity_type: 'exercise' | 'lesson' | 'assessment'
    status: 'completed' | 'in_progress' | 'stopped'
  }
  
  export interface UserProgress {
    user_id: string
    streak_count: number
    total_activities: number
    last_activity_date: string
  }
  
  export interface TaskItem {
    id: string
    user_id: string
    task_type: 'initial_exam' | 'exercise' | 'lesson' | 'assessment'
    title: string
    description?: string
    status: 'pending' | 'completed' | 'locked'
    completed_at?: string
    prerequisites?: string[] // IDs of tasks that must be completed first
  }
  
  export interface LearningPathProgress {
    user_id: string
    current_level: number
    completed_lessons: string[]
    available_lessons: string[]
    next_lesson?: string
  }
  
  // DTOs for API responses
  export interface DashboardState {
    activities: DashboardActivity[]
    progress: UserProgress
    tasks: TaskItem[]
    learningPath: LearningPathProgress
  }
  
  // Types for mutations
  export type CreateActivityInput = Omit<DashboardActivity, 'id' | 'user_id'>
  export type UpdateTaskInput = Partial<Omit<TaskItem, 'id' | 'user_id'>>