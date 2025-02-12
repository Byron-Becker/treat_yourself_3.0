interface ActivityState {
    lastExerciseDate: string | null
    lastAssessmentDate: string | null
    exerciseStreak: number
    totalExercises: number
    completedLessons: Set<string>
  }
  
  export class UserActivityModel {
    private state: ActivityState
  
    constructor(initial?: Partial<ActivityState>) {
      this.state = {
        lastExerciseDate: initial?.lastExerciseDate ?? null,
        lastAssessmentDate: initial?.lastAssessmentDate ?? null,
        exerciseStreak: initial?.exerciseStreak ?? 0,
        totalExercises: initial?.totalExercises ?? 0,
        completedLessons: new Set(initial?.completedLessons)
      }
    }
  
    recordExercise(date: string): void {
      this.state.lastExerciseDate = date
      this.state.totalExercises++
      this.updateExerciseStreak(date)
    }
  
    recordAssessment(date: string): void {
      this.state.lastAssessmentDate = date
    }
  
    completeLesson(lessonId: string): void {
      this.state.completedLessons.add(lessonId)
    }
  
    private updateExerciseStreak(date: string): void {
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString().split('T')[0]
  
      if (!this.state.lastExerciseDate || 
          this.state.lastExerciseDate < yesterday) {
        this.state.exerciseStreak = 1
      } else if (date === today && 
                 this.state.lastExerciseDate === yesterday) {
        this.state.exerciseStreak++
      }
    }
  
    needsAssessment(): boolean {
      if (!this.state.lastAssessmentDate) return true
  
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      
      return new Date(this.state.lastAssessmentDate) < threeDaysAgo
    }
  
    getExerciseStreak(): number {
      return this.state.exerciseStreak
    }
  
    getTotalExercises(): number {
      return this.state.totalExercises
    }
  
    getCompletedLessons(): string[] {
      return Array.from(this.state.completedLessons)
    }
  }