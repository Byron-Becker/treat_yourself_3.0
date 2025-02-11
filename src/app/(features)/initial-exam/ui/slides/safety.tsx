'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SafetyQuestion } from "../../types"
import { Shield } from "lucide-react"

// src/(features)/initial-exam/ui/slides/safety.tsx
interface SafetySlideProps {
    questions: SafetyQuestion[]
    answers: Record<string, string>
    onAnswer: (questionId: string, answerId: string) => void
    title: string
    description: string
  }
  
  export function SafetySlide({ 
    questions, 
    answers, 
    onAnswer,
    title,
    description 
  }: SafetySlideProps) {
    return (
      <Card className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <p className="font-medium">{question.text}</p>
            
            {question.subItems && (
              <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
                {question.subItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

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