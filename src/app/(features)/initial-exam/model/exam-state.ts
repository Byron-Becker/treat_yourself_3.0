

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ExamAnswers, ExamStep } from '../types'

interface ExamState {
  currentStep: ExamStep
  answers: ExamAnswers
  progress: number
  setCurrentStep: (step: ExamStep) => void
  setAnswer: (step: ExamStep, questionId: string, answerId: string) => void
  isStepComplete: (step: ExamStep) => boolean
  updateProgress: () => void
}

const MOCK_QUESTIONS = {
    safety: [
      {
        id: 'q1',
        text: 'Do you have severe pain?',
        options: [
          { id: 'yes', text: 'Yes' },
          { id: 'no', text: 'No' }
        ]
      }
    ],
    treatment: [
      {
        id: 'q1',
        text: 'How often do you experience pain?',
        options: [
          { id: 'daily', text: 'Daily' },
          { id: 'weekly', text: 'Weekly' }
        ]
      }
    ]
  }

export const useExamStore = create<ExamState>()(
  devtools(
    persist(
      (set, get) => ({
        currentStep: 'safety',
        progress: 0,
        answers: {
          safety: {},
          treatment: {}
        },
        
        setCurrentStep: (step) => 
          set(
            { currentStep: step },
            false,
            'exam/setCurrentStep'
          ),
        
        setAnswer: (step, questionId, answerId) => 
          set(
            (state) => ({
              answers: {
                ...state.answers,
                [step]: {
                  ...state.answers[step],
                  [questionId]: answerId
                }
              }
            }),
            false,
            'exam/setAnswer'
          ),

        isStepComplete: (step) => {
          const { answers } = get()
          const currentAnswers = answers[step]
          return Object.keys(currentAnswers).length > 0
        },

        updateProgress: () => {
          const { answers } = get()
          const totalQuestions = MOCK_QUESTIONS.safety.length + MOCK_QUESTIONS.treatment.length
          const answeredQuestions = Object.keys(answers.safety).length + Object.keys(answers.treatment).length
          const progress = Math.round((answeredQuestions / totalQuestions) * 100)
          set({ progress }, false, 'exam/updateProgress')
        }
      }),
      {
        name: 'exam-storage'
      }
    )
  )
)