'use client'

import { SafetySlide } from "./slides/safety"
import { TreatmentSlide } from "./slides/treatment"
import { ExamHeader } from "./exam-header"
import { useExamStore } from "../model/exam-state"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

// Move to config later
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

export function ExamContainer() {
  const { 
    currentStep, 
    answers, 
    progress,
    setAnswer, 
    setCurrentStep,
    isStepComplete,
    updateProgress
  } = useExamStore()

  const handleNext = () => {
    if (currentStep === 'safety' && isStepComplete('safety')) {
      updateProgress() // Only update progress when continuing
      setCurrentStep('treatment')
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <ExamHeader progress={progress} />

      <main className="flex-1 overflow-y-auto px-4 pb-20 pt-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {currentStep === 'safety' && (
            <SafetySlide
              questions={MOCK_QUESTIONS.safety}
              answers={answers.safety}
              onAnswer={(qId, aId) => setAnswer('safety', qId, aId)}
            />
          )}

          {currentStep === 'treatment' && (
            <TreatmentSlide
              questions={MOCK_QUESTIONS.treatment}
              answers={answers.treatment}
              onAnswer={(qId, aId) => setAnswer('treatment', qId, aId)}
            />
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleNext}
            disabled={!isStepComplete(currentStep)}
            className="w-full h-12 text-lg"
          >
            Continue
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}