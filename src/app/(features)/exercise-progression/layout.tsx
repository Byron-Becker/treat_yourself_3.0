'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/components/ui/utils'

interface ExerciseLayoutProps {
  children: ReactNode
  className?: string
}

export default function ExerciseLayout({ children, className }: ExerciseLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "min-h-[100dvh] bg-background",
        "overscroll-y-none touch-pan-y",
        "overflow-x-hidden",
        className
      )}
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Skip link for accessibility */}
      <a 
        href="#exercise-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50"
      >
        Skip to exercise content
      </a>

      {/* Main content */}
      <div 
        id="exercise-content"
        className="relative scroll-smooth"
      >
        {children}
      </div>
    </motion.div>
  )
} 