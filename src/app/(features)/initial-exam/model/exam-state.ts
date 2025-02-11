import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ExamAnswers, ExamStep } from '../types'
import { examContent } from '../data/mock-question-content'

interface ExamState {
  currentStep: ExamStep
  answers: ExamAnswers
  progress: number
  setCurrentStep: (step: ExamStep) => void
  setAnswer: (step: ExamStep, questionId: string, answerId: string) => void
  isStepComplete: (step: ExamStep) => boolean
  updateProgress: () => void
  resetExam: () => void
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
          const totalQuestions = examContent.safety.questions.length + examContent.treatment.questions.length
          const answeredQuestions = Object.keys(answers.safety).length + Object.keys(answers.treatment).length
          const progress = Math.round((answeredQuestions / totalQuestions) * 100)
          set({ progress }, false, 'exam/updateProgress')
        },

        resetExam: () => set(
          {
            currentStep: 'safety',
            answers: { safety: {}, treatment: {} },
            progress: 0
          },
          false,
          'exam/reset'
        )
      }),
      {
        name: 'exam-storage',
        partialize: (state) => ({
          answers: state.answers,
          currentStep: state.currentStep,
          progress: state.progress
        })
      }
    )
  )
)