// app/lessons/[lessonId]/components/slides/question-slide.tsx

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { QuestionSlide as QuestionSlideType } from '../../../types/lesson.types'
import { cn } from '@/components/ui/utils'
import Image from 'next/image'
import { ImageErrorBoundary } from '../image-error-boundary'

interface QuestionSlideProps {
  content: QuestionSlideType
  isActive: boolean
  isCompleted: boolean
  interactionState: string
  onAnswer: (optionId: string, correctOptionId: string) => void
  onComplete: () => void
}

export function QuestionSlide({ 
  content, 
  isActive, 
  isCompleted, 
  interactionState,
  onAnswer,
  onComplete 
}: QuestionSlideProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const correctOption = content.options.find(opt => opt.isCorrect)
  const isCorrect = selectedId === correctOption?.id

  return (
    <Card className={cn(
      "overflow-hidden transition-all",
      isActive && "ring-2 ring-primary"
    )}>
      <motion.div 
        className="p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {content.imageUrl && (
          <motion.div 
            className="relative w-full h-[240px] mb-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <ImageErrorBoundary>
              <Image
                src={content.imageUrl}
                alt=""
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </ImageErrorBoundary>
          </motion.div>
        )}

        <motion.h2 
          className="text-xl font-semibold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {content.question}
        </motion.h2>

        <div className="space-y-3 mb-6">
          {content.options.map((option) => (
            <motion.button
              key={option.id}
              onClick={() => !isCompleted && setSelectedId(option.id)}
              className={cn(
                "w-full p-4 rounded-lg border-2 text-left transition-colors",
                selectedId === option.id && "border-primary bg-primary/5",
                isCompleted && option.isCorrect && "border-green-500 bg-green-50",
                isCompleted && !option.isCorrect && selectedId === option.id && "border-red-500 bg-red-50"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {option.text}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button 
                onClick={() => {
                  if (selectedId && correctOption) {
                    onAnswer(selectedId, correctOption.id)
                  }
                }}
                disabled={!selectedId}
              >
                Check Answer
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {content.explanation && (
                <div className="bg-muted p-4 rounded-lg">
                  {content.explanation}
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={onComplete}>Continue</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Card>
  )
}