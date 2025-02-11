'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TreatmentQuestion } from "../../types"
import { Clipboard } from "lucide-react"

interface TreatmentSlideProps {
  questions: TreatmentQuestion[]
  answers: Record<string, string>
  onAnswer: (questionId: string, answerId: string) => void
}

export function TreatmentSlide({ questions, answers, onAnswer }: TreatmentSlideProps) {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Clipboard className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Treatment Assessment</h2>
          <p className="text-muted-foreground">
            Please answer these questions about your symptoms.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <p className="font-medium">{question.text}</p>
            
            <div className="flex gap-2">
              {question.options.map((option) => (
                <Button
                  key={option.id}
                  variant={answers[question.id] === option.id ? "default" : "outline"}
                  onClick={() => onAnswer(question.id, option.id)}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}