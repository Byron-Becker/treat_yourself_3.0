// app/lessons/[lessonId]/components/slides/info-slide.tsx

'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ImageErrorBoundary } from '../image-error-boundary'
import { InfoSlide as InfoSlideType } from '../../../types/lesson.types'
import { cn } from '@/components/ui/utils'
import Image from 'next/image'


interface InfoSlideProps {
  content: InfoSlideType
  isActive: boolean
  isCompleted: boolean
  onComplete: () => void
}

export function InfoSlide({ content, isActive, isCompleted, onComplete }: InfoSlideProps) {
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
                alt={content.title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </ImageErrorBoundary>
          </motion.div>
        )}

        <motion.h2 
          className="text-2xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {content.title}
        </motion.h2>

        <motion.p 
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {content.body}
        </motion.p>

        {!isCompleted && (
          <motion.div 
            className="flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button onClick={onComplete}>Continue</Button>
          </motion.div>
        )}
      </motion.div>
    </Card>
  )
}