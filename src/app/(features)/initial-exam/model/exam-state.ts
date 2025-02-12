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
          console.log('isStepComplete called for step:', step);
          
          if (step === 'review') {
            console.log('Review step - always complete');
            return true;
          }
          
          const { answers } = get()
          console.log('Current answers:', answers);
          
          if (!answers) {
            console.log('No answers object found');
            return false;
          }

          // Convert body-map to bodyMap for accessing the answers object
          const answerKey = step === 'body-map' ? 'bodyMap' : step;
          const currentAnswers = answers[answerKey as ExamAnswerTypes];
          console.log('Current step answers:', currentAnswers);
          
          if (!currentAnswers) {
            console.log('No answers for current step');
            return false;
          }

          if (step === 'body-map') {
            console.log('Checking body map completion');
            console.log('Body map answers:', currentAnswers);
            // Check if any body part is selected (true)
            const selectedParts = Object.entries(currentAnswers)
              .filter(([_, selected]) => selected === true);
            console.log('Selected parts:', selectedParts);
            const isComplete = selectedParts.length > 0;
            console.log('Body map complete?', isComplete);
            return isComplete;
          }
          
          const numAnswers = Object.keys(currentAnswers).length;
          console.log(`Number of answers for ${step}:`, numAnswers);
          const isComplete = numAnswers > 0;
          console.log(`${step} complete?`, isComplete);
          return isComplete;
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
          if (!state.answers) {
            state.answers = { bodyMap: {}, safety: {}, treatment: {} };
          } else {
            // Ensure each section exists
            if (!state.answers.bodyMap) state.answers.bodyMap = {};
            if (!state.answers.safety) state.answers.safety = {};
            if (!state.answers.treatment) state.answers.treatment = {};
          }
        }
      }
    )
  )
)