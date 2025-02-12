'use client'

import { motion } from 'framer-motion'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface ExerciseHeaderProps {
  name: string
  timeRemaining: number
  isActive: boolean
}

export function ExerciseHeader({ name, timeRemaining }: ExerciseHeaderProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-white border-b"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <div className="flex items-center justify-between p-4">
        <Link 
          href="/dashboard" 
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div className="flex-grow text-center text-2xl font-bold">
          {name} - {formatTime(timeRemaining)}
        </div>
        <div className="flex items-center">
          <UserButton />
        </div>
      </div>
    </motion.header>
  )
} 