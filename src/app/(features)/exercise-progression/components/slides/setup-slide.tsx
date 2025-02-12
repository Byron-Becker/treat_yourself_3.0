'use client'

import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Exercise, ExerciseState } from '../../types'
import { useEffect, useState } from 'react'

interface SetupSlideProps {
  exercise: Exercise
  state: ExerciseState
  onTimerStart: () => void
  onTimerStop: () => void
  onAnswerSelected: (questionId: string, answerId: string) => void
}

export function SetupSlide({ exercise }: SetupSlideProps) {
  const [videoUrl, setVideoUrl] = useState(exercise.imageUrl)

  useEffect(() => {
    if (exercise.mediaType === 'video') {
      // In a real app, you'd fetch this from your video service
      setVideoUrl(exercise.imageUrl)
    }
  }, [exercise])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-3 space-y-1">
        <h2 className="text-2xl font-bold text-center">
          {exercise.name}
        </h2>

        <div className="relative h-[140px] md:h-[250px] rounded-lg overflow-hidden bg-gray-100">
          {exercise.mediaType === 'video' ? (
            <video
              src={videoUrl}
              className="w-full h-full object-contain"
              controls
              playsInline
            />
          ) : (
            <Image
              src={exercise.imageUrl}
              alt={exercise.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
              unoptimized
            />
          )}
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-lg">Setup Instructions</h3>
          <ul className="space-y-3">
            {exercise.instructions.setup.map((instruction, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </motion.div>
  )
} 