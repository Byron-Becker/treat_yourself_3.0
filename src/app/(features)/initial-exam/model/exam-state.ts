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
  setAnswer: (step: ExamAnswerTypes, questionId: string, answerId: string) => void
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
        currentStep: 'safety',
        progress: 0,
        answers: {
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
          if (step === 'review') return true;
          const { answers } = get()
          const currentAnswers = answers[step as ExamAnswerTypes]
          return Object.keys(currentAnswers).length > 0
        },

        updateProgress: () => {
          const { answers } = get()
          const totalQuestions = 6
          const answeredQuestions = 
            Object.keys(answers.safety).length + 
            Object.keys(answers.treatment).length
          const progress = Math.round((answeredQuestions / totalQuestions) * 100)
          set({ progress }, false, 'exam/updateProgress')
        },

        resetExam: () => set(
          {
            examId: null,
            currentStep: 'safety',
            answers: { safety: {}, treatment: {} },
            progress: 0,
            error: null
          },
          false,
          'exam/reset'
        ),

        cleanupExam: () => set(
          {
            examId: null,
            answers: { safety: {}, treatment: {} },
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
            
            const exam = await completeExam(get().examId!, token)
            // Don't reset the store until after navigation
            return exam
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
          answers: state.answers,
          currentStep: state.currentStep,
          progress: state.progress
        })
      }
    )
  )
)