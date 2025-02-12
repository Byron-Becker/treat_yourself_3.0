// src/(features)/initial-exam/model/exam-state.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ExamAnswers, ExamStep, ExamAnswerTypes } from '../types'
import { saveExamAnswers, updateExamAnswers, completeExam } from '../api/actions'

interface ExamState {
  examId: string | null
  currentStep: ExamStep
  answers: ExamAnswers
  progress: number
  isSubmitting: boolean
  error: Error | null
  setCurrentStep: (step: ExamStep) => void
  setAnswer: (step: ExamAnswerTypes, questionId: string, answerId: string | boolean) => void
  isStepComplete: (step: ExamStep) => boolean
  updateProgress: () => void
  resetExam: () => void
  cleanupExam: () => void
  saveProgress: (token: string | null) => Promise<void>
  submitExam: (token: string | null) => Promise<void>
}

export const useExamStore = create<ExamState>()(
  devtools(
    persist(
      (set, get) => ({
        examId: null,
        currentStep: 'body-map',
        progress: 0,
        answers: {
          bodyMap: {},
          safety: {},
          treatment: {}
        },
        isSubmitting: false,
        error: null,
        
        setCurrentStep: (step) => 
          set(
            { currentStep: step },
            false,
            'exam/setCurrentStep'
          ),
        
        setAnswer: (step, questionId, answerId) => 
          set(
            (state) => {
              if (!state.answers) {
                return {
                  answers: {
                    bodyMap: {},
                    safety: {},
                    treatment: {},
                    [step]: { [questionId]: answerId }
                  }
                }
              }

              return {
                answers: {
                  ...state.answers,
                  [step]: {
                    ...(state.answers[step] || {}),
                    [questionId]: answerId
                  }
                }
              }
            },
            false,
            'exam/setAnswer'
          ),

        isStepComplete: (step) => {
          if (step === 'review') return true;
          const { answers } = get()
          if (!answers) return false;
          
          const currentAnswers = answers[step as ExamAnswerTypes]
          if (!currentAnswers) return false;

          if (step === 'body-map') {
            return Object.values(currentAnswers).some(selected => selected === true)
          }
          return Object.keys(currentAnswers).length > 0
        },

        updateProgress: () => {
          const { answers } = get()
          const totalQuestions = 7
          const answeredQuestions = 
            (Object.values(answers.bodyMap).some(selected => selected === true) ? 1 : 0) +
            Object.keys(answers.safety).length + 
            Object.keys(answers.treatment).length
          const progress = Math.round((answeredQuestions / totalQuestions) * 100)
          set({ progress }, false, 'exam/updateProgress')
        },

        resetExam: () => set(
          {
            examId: null,
            currentStep: 'body-map',
            answers: { bodyMap: {}, safety: {}, treatment: {} },
            progress: 0,
            error: null
          },
          false,
          'exam/reset'
        ),

        cleanupExam: () => set(
          {
            examId: null,
            answers: { bodyMap: {}, safety: {}, treatment: {} },
            progress: 0,
            error: null
          },
          false,
          'exam/cleanup'
        ),

        saveProgress: async (token: string | null) => {
          try {
            set({ isSubmitting: true, error: null })
            const { answers, examId } = get()

            const result = examId 
              ? await updateExamAnswers(examId, answers, token)
              : await saveExamAnswers(answers, token)

            set({ examId: result.id })
          } catch (error) {
            set({ error: error as Error })
            throw error
          } finally {
            set({ isSubmitting: false })
          }
        },

        submitExam: async (token: string | null) => {
          try {
            set({ isSubmitting: true, error: null })
            const { examId } = get()
            if (!examId) {
              await get().saveProgress(token)
            }
            
            await completeExam(get().examId!, token)
          } catch (error) {
            set({ error: error as Error })
            throw error
          } finally {
            set({ isSubmitting: false })
          }
        }
      }),
      {
        name: 'exam-storage',
        partialize: (state) => ({
          examId: state.examId,
          answers: state.answers || { bodyMap: {}, safety: {}, treatment: {} },
          currentStep: state.currentStep || 'body-map',
          progress: state.progress || 0
        }),
        onRehydrateStorage: () => (state) => {
          if (!state) return;
          
          // Ensure answers object exists with all required properties
          state.answers = {
            bodyMap: {},
            safety: {},
            treatment: {},
            ...state.answers
          };
        }
      }
    )
  )
)