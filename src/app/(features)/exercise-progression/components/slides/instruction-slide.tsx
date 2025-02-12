'use client'

import { forwardRef } from 'react'
import { Card } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Exercise, ExerciseState } from '../../types'

interface InstructionSlideProps {
  exercise: Exercise
  state: ExerciseState
  onTimerStart: () => void
  onTimerStop: () => void
  onAnswerSelected: (questionId: string, answerId: string) => void
}

export const InstructionSlide = forwardRef<HTMLDivElement, InstructionSlideProps>(
  function InstructionSlide({ exercise }, ref) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="scroll-mt-20"
      >
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Execution Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">During Exercise</h3>
              <ul className="space-y-2">
                {exercise.instructions.execution.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-500">•</span>
                    <span className="text-slate-700">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Instructions */}
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Safety Notes</h3>
                  <ul className="space-y-2">
                    {exercise.instructions.safety.map((instruction, index) => (
                      <li key={index} className="text-slate-700">
                        • {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }
) 