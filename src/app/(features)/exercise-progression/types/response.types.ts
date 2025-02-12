export type ResponseType = 'better' | 'worse' | 'same'
export type LocationType = 'central' | 'peripheral' | 'same'
export type ContinueType = 'yes' | 'no'

export interface Response {
  questionId: string
  answerId: string
  timestamp: string
}

export interface ResponseSet {
  initial?: ResponseType
  location?: LocationType
  continue?: ContinueType
  [key: string]: string | undefined
}

export interface ResponseEvaluation {
  canProgress: boolean
  shouldStop: boolean
  nextQuestionId?: string | null
  message?: string
}

export interface ResponseHistory {
  exerciseId: string
  responses: Response[]
  startedAt: string
  completedAt?: string
}
