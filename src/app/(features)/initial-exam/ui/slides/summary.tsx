// src/(features)/initial-exam/ui/slides/summary-slide.tsx
'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { examContent } from '../../data/mock-question-content'
import { useAuth } from '@clerk/nextjs'
import { examService } from '../../services/exam.service'
import { useEffect, useState } from 'react'
import { ExamAttempt } from '../../types/db.types'
import { useErrorHandler } from '@/lib/errors/handlers'
import { useExamStore } from '../../model/exam-state'
import { ContinueButton } from '../../../shared/components/continue-button'

export function SummarySlide() {
  const router = useRouter()
  const { getToken } = useAuth()
  const handleError = useErrorHandler()
  const [exam, setExam] = useState<ExamAttempt | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Reset the exam store completely when summary mounts
    useExamStore.getState().resetExam()
  }, [])

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const token = await getToken({ template: 'supabase' })
        const latestExam = await examService.getLatestExam(token)
        setExam(latestExam)
      } catch (error) {
        handleError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExam()
  }, [getToken, handleError])

  if (isLoading) {
    return (
      <Card className="p-6 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </Card>
    )
  }

  if (!exam) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p>No exam data found.</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Return Home
          </Button>
        </div>
      </Card>
    )
  }

  // Calculate any risk factors
  const hasRiskFactors = Object.values(exam.safety_answers).includes('yes')

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
        <h2 className="text-2xl font-bold">Assessment Complete</h2>
      </div>

      <div className="space-y-6">
        {/* Safety Summary */}
        <div className="bg-slate-50 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-lg">Safety Screening</h3>
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
                <div className="text-slate-600">{exam.safety_answers[question.id]}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Treatment Summary */}
        <div className="bg-slate-50 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-lg">Treatment Assessment</h3>
          {examContent.treatment.questions.map((question) => (
            <div key={question.id} className="mb-4">
              <div className="flex justify-between">
                <div className="flex-1 mr-4">
                  <p>{question.text}</p>
                </div>
                <div className="text-slate-600">{exam.treatment_answers[question.id]}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Warning */}
        {hasRiskFactors && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
            Based on your answers, we recommend consulting a healthcare provider before proceeding.
          </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <ContinueButton 
          onClick={() => router.push('/')}
          className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:text-white"
          text="Continue to Dashboard"
        />
      </div>
    </Card>
  )
}