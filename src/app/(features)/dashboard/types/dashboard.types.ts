export interface InitialExamState {
  id: string | null
  isCompleted: boolean
  bodyMapId: string | null
  createdAt: string | null
}

export interface LessonState {
  id: string
  isCompleted: boolean
  completedAt: string | null
}

export interface ExerciseState {
  lastCompletedAt: string | null
  currentStreak: number
  totalSessions: number
}

export interface DashboardState {
  initialExam: InitialExamState
  lessonCompletions: Record<string, LessonState>
  exerciseState: ExerciseState
  romAssessmentLastCompletedAt: string | null
}