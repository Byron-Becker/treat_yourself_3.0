// app/lessons/[lessonId]/components/slides/info-bullet-slide.tsx

'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { InfoBulletSlide as InfoBulletSlideType } from '../../../types/lesson.types'
import { cn } from '@/components/ui/utils'
import Image from 'next/image'

interface InfoBulletSlideProps {
  content: InfoBulletSlideType
  isActive: boolean
  isCompleted: boolean
  onComplete: () => void
}

export function InfoBulletSlide({ 
  content, 
  isActive, 
  isCompleted, 
  onComplete 
}: InfoBulletSlideProps) {
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
            className="w-full aspect-video mb-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <Image
              src={content.imageUrl}
              alt={content.title}
              fill
              className="object-cover rounded-lg"
            />
          </motion.div>
        )}

        <motion.h2 
          className="text-2xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {content.title}
        </motion.h2>

        {content.introduction && (
          <motion.p 
            className="text-muted-foreground mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {content.introduction}
          </motion.p>
        )}

        <motion.ul
          className="space-y-3 mb-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {content.bullets.map((bullet, index) => (
            <motion.li
              key={index}
              className="flex gap-3 text-muted-foreground"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
            >
              <span className="text-primary">•</span>
              <span>{bullet.text}</span>
            </motion.li>
          ))}
        </motion.ul>

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