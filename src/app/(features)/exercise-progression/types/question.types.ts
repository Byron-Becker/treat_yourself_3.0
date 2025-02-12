export interface Question {
    id: string
    text: string
    options: QuestionOption[]
  }
  
  export interface QuestionOption {
    id: string
    text: string
    nextQuestionId?: string | null
  }