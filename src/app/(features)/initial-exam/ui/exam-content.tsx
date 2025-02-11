// src/(features)/initial-exam/ui/exam-content.tsx
'use client'

import { useAuth } from '@clerk/nextjs'
import { SafetySlide } from "./slides/safety"
import { TreatmentSlide } from "./slides/treatment"
import { ReviewSlide } from "./slides/review"
import { ExamHeader } from "./exam-header"
import { useExamStore } from "../model/exam-state"
import { Button } from "@/components/ui/button"
import { ChevronRight, Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { examContent } from "../data/mock-question-content"
import { ExamStep } from '../types'
import { useErrorHandler } from '@/lib/errors/handlers'

export default function ExamContent() {
  const router = useRouter()
  const handleError = useErrorHandler()
  const { getToken } = useAuth()
  const { 
    currentStep, 
    answers, 
    progress,
    isSubmitting,
    setAnswer, 
    setCurrentStep,
    isStepComplete,
    updateProgress,
    saveProgress,
    submitExam,
    cleanupExam
  } = useExamStore()

  const handleNext = async () => {
    try {
      const token = await getToken({ template: 'supabase' })

      if (currentStep === 'safety' && isStepComplete('safety')) {
        await saveProgress(token)
        updateProgress()
        setCurrentStep('treatment')
      } else if (currentStep === 'treatment' && isStepComplete('treatment')) {
        await saveProgress(token)
        updateProgress()
        setCurrentStep('review')
      }
    } catch (error) {
      handleError(error)
    }
  }

  const handleSubmit = async () => {
    try {
      const token = await getToken({ template: 'supabase' })
      await submitExam(token)
      // Clean up the exam data but keep the current step
      cleanupExam()
      router.push('/initial-exam/summary')
    } catch (error) {
      handleError(error)
    }
  }

  const handleEditSlide = (index: number) => {
    const steps: ExamStep[] = ['safety', 'treatment']
    setCurrentStep(steps[index])
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <ExamHeader progress={progress} />

      <main className="flex-1 overflow-y-auto px-4 pb-20 pt-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {currentStep === 'safety' && (
            <SafetySlide
              questions={examContent.safety.questions}
              answers={answers.safety}
              onAnswer={(qId, aId) => setAnswer('safety', qId, aId)}
              title={examContent.safety.title}
              description={examContent.safety.description}
            />
          )}

          {currentStep === 'treatment' && (
            <TreatmentSlide
              questions={examContent.treatment.questions}
              answers={answers.treatment}
              onAnswer={(qId, aId) => setAnswer('treatment', qId, aId)}
              title={examContent.treatment.title}
              description={examContent.treatment.description}
            />
          )}

          {currentStep === 'review' && (
            <ReviewSlide
              answers={answers}
              onEditSlide={handleEditSlide}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </main>

      {currentStep !== 'review' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={handleNext}
              disabled={!isStepComplete(currentStep) || isSubmitting}
              className="w-full h-12 text-lg"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Continue
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}