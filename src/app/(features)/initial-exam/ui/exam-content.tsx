// src/(features)/initial-exam/ui/exam-content.tsx
'use client'

import { useAuth } from '@clerk/nextjs'
import { SafetySlide } from "./slides/safety"
import { TreatmentSlide } from "./slides/treatment"
import { ReviewSlide } from "./slides/review"
import { BodyMapSlide } from "./slides/body-map"
import { ExamHeader } from "./exam-header"
import { useExamStore } from "../model/exam-state"
import { Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { examContent } from "../data/mock-question-content"
import { ExamStep } from '../types'
import { useErrorHandler } from '@/lib/errors/handlers'
import { ContinueButton } from '../../shared/components/continue-button'

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

      if (currentStep === 'body-map' && isStepComplete('body-map')) {
        await saveProgress(token)
        updateProgress()
        setCurrentStep('safety')
      } else if (currentStep === 'safety' && isStepComplete('safety')) {
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
      cleanupExam()
      router.push('/initial-exam/summary')
    } catch (error) {
      handleError(error)
    }
  }

  const handleEditSlide = (index: number) => {
    const steps: ExamStep[] = ['body-map', 'safety', 'treatment']
    setCurrentStep(steps[index])
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <ExamHeader progress={progress} />

      <main className="flex-1 overflow-y-auto px-4 pb-20 pt-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {currentStep === 'body-map' && (
            <BodyMapSlide
              selectedParts={answers.bodyMap}
              onPartSelect={(partId: string, selected: boolean) => setAnswer('bodyMap', partId, selected)}
            />
          )}

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
            {isSubmitting ? (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ContinueButton
                onClick={handleNext}
                disabled={!isStepComplete(currentStep)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}