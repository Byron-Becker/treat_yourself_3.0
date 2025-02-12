import type { DashboardState, InitialExamState, LessonState, ExerciseState } from '../types/dashboard.types'

export class DashboardStateModel {
  private state: DashboardState

  constructor(initial?: Partial<DashboardState>) {
    this.state = {
      initialExam: {
        id: initial?.initialExam?.id ?? null,
        isCompleted: initial?.initialExam?.isCompleted ?? false,
        bodyMapId: initial?.initialExam?.bodyMapId ?? null,
        createdAt: initial?.initialExam?.createdAt ?? null
      },
      lessonCompletions: initial?.lessonCompletions ?? {},
      exerciseState: {
        lastCompletedAt: initial?.exerciseState?.lastCompletedAt ?? null,
        currentStreak: initial?.exerciseState?.currentStreak ?? 0,
        totalSessions: initial?.exerciseState?.totalSessions ?? 0
      },
      romAssessmentLastCompletedAt: initial?.romAssessmentLastCompletedAt ?? null
    }
  }

  updateInitialExam(exam: InitialExamState): void {
    this.state.initialExam = exam
  }

  updateLessonCompletion(lessonId: string, completion: LessonState): void {
    this.state.lessonCompletions[lessonId] = completion
  }

  updateExerciseState(exercise: ExerciseState): void {
    this.state.exerciseState = exercise
  }

  updateROMAssessment(completedAt: string): void {
    this.state.romAssessmentLastCompletedAt = completedAt
  }

  canAccessLessons(): boolean {
    return this.state.initialExam.isCompleted
  }

  canAccessExercises(): boolean {
    return this.state.initialExam.isCompleted && 
           this.isLessonCompleted('exercise-lesson')
  }

  isLessonCompleted(lessonId: string): boolean {
    return !!this.state.lessonCompletions[lessonId]?.isCompleted
  }

  hasRecentROMAssessment(): boolean {
    if (!this.state.romAssessmentLastCompletedAt) return false
    
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    
    return new Date(this.state.romAssessmentLastCompletedAt) > threeDaysAgo
  }

  getState(): DashboardState {
    return { ...this.state }
  }
}