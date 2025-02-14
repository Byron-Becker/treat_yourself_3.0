'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { Exercise, ExerciseState } from '../../types'
import { questions } from '../../data/exercise-content'
import { forwardRef } from 'react'

interface QuestionSlideProps {
  exercise: Exercise
  state: ExerciseState
  questionId: string
  onTimerStart: () => void
  onTimerStop: () => void
  onAnswerSelected: (questionId: string, answerId: string) => void
}

export const QuestionSlide = forwardRef<HTMLDivElement, QuestionSlideProps>(({ 
  state, 
  questionId,
  onAnswerSelected 
}, ref) => {
  const question = questions[questionId]
  const selectedAnswer = state.answers[questionId]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="scroll-mt-20"
    >
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">
          {question.text}
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option) => (
            <Button
              key={option.id}
              variant={selectedAnswer === option.id ? "default" : "outline"}
              className={`w-full justify-start text-left h-auto p-4 ${
                selectedAnswer === option.id ? 'bg-blue-50 border-blue-500 text-blue-700' : ''
              }`}
              onClick={() => {
                if (!selectedAnswer) {
                  onAnswerSelected(questionId, option.id)
                }
              }}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}) as React.ForwardRefExoticComponent<QuestionSlideProps & React.RefAttributes<HTMLDivElement>>;

// Add display name for the component
QuestionSlide.displayName = 'QuestionSlide'; 