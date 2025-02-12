export interface Exercise {
    id: string
    name: string
    duration: number
    imageUrl: string
    mediaType: 'image' | 'video'
    instructions: {
      setup: string[]
      execution: string[]
      safety: string[]
    }
  }
  
  export type ExercisePhase = 'setup' | 'active' | 'questions' | 'complete'
  
  export interface ExerciseState {
    id: string
    phase: ExercisePhase
    timeRemaining: number
    isTimerActive: boolean
    currentQuestionId: string | null
    answers: Record<string, string>
    visibleQuestions: string[]
  }