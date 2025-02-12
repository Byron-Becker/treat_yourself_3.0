'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'
import { examContent } from '../../data/mock-question-content'
import { ExamAnswers } from '../../types'
import { ContinueButton } from '../../../shared/components/continue-button'
import { frontBodyParts, backBodyParts } from '../../../shared/components/body-map/body-part'
import { BaseMap } from '@/app/(features)/shared/components/body-map/base-map'
import { BodyPartId } from '@/app/(features)/shared/components/body-map/shared-types'
import { useToast } from "@/hooks/use-toast"

interface ReviewSlideProps {
  answers: ExamAnswers
  onEditSlide: (index: number) => void
  onSubmit: () => void
}

function calculateTotalScore(selections: Record<string, boolean>): number {
  const allBodyParts = [...frontBodyParts, ...backBodyParts]
  return Object.entries(selections)
    .filter(([selected]) => selected)
    .reduce((total, [partId]) => {
      const part = allBodyParts.find(p => p.id === partId)
      return total + (part?.score || 0)
    }, 0)
}

export function ReviewSlide({ 
  answers,
  onEditSlide,
  onSubmit 
}: ReviewSlideProps) {
  const { toast } = useToast()
  const totalPainScore = calculateTotalScore(answers.bodyMap)
  const selectedLocations = Object.entries(answers.bodyMap)
    .filter(([, selected]) => selected)
    .map(([partId]) => partId as BodyPartId)

  const handleSubmit = async () => {
    try {
      await onSubmit()
    } catch (error) {
      if (error instanceof Error && error.message.includes('already has a completed initial exam')) {
        toast({
          title: "Already Completed",
          description: "You have already completed your initial exam. You cannot submit another one.",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Error",
          description: "An error occurred while submitting your exam. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Check className="h-8 w-8 text-green-600" />
        <h2 className="text-2xl font-bold">Review Your Assessment</h2>
      </div>

      <div className="space-y-6">
        {/* Body Map Section */}
        <div className="bg-slate-50 p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Pain Location</h3>
            <div className="flex items-center gap-4">
              <div className="text-slate-600">
                Pain Score: {totalPainScore}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEditSlide(0)}
                className="text-cyan-600 hover:text-cyan-700"
              >
                Edit
              </Button>
            </div>
          </div>

          <BaseMap
            selectedLocations={selectedLocations}
            onSelect={() => {}}
            readOnly={true}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Safety Section */}
        <div className="bg-slate-50 p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Safety Screening</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEditSlide(1)}
              className="text-cyan-600 hover:text-cyan-700"
            >
              Edit
            </Button>
          </div>
          {examContent.safety.questions.map((question) => (
            <div key={question.id} className="mb-4">
              <div className="flex justify-between">
                <div className="flex-1 mr-4">
                  <p>{question.text}</p>
                  {question.subItems && (
                    <ul className="list-disc ml-4 mt-2">
                      {question.subItems.map((item, i) => (
                        <li key={i} className="text-slate-600">{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="text-slate-600">{answers.safety[question.id]}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Treatment Section */}
        <div className="bg-slate-50 p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Treatment Assessment</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEditSlide(2)}
              className="text-cyan-600 hover:text-cyan-700"
            >
              Edit
            </Button>
          </div>
          {examContent.treatment.questions.map((question) => (
            <div key={question.id} className="mb-4">
              <div className="flex justify-between">
                <div className="flex-1 mr-4">
                  <p>{question.text}</p>
                </div>
                <div className="text-slate-600">{answers.treatment[question.id]}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Warnings */}
        {Object.values(answers.safety).includes('yes') && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
            Based on your answers, we recommend consulting a healthcare provider before proceeding.
          </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <ContinueButton 
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 dark:text-white"
        />
      </div>
    </Card>
  )
}