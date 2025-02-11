export interface ExamAttempt {
    id: string
    user_id: string
    safety_answers: Record<string, string>
    treatment_answers: Record<string, string>
    body_map_id?: string
    created_at: string
    is_completed: boolean
  }
  
  export type CreateExamAttempt = Omit<ExamAttempt, 'id' | 'created_at'> 
  export type UpdateExamAttempt = Partial<CreateExamAttempt>