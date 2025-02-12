'use client'

import { Button } from "@/components/ui/button"
import { PauseCircle, Play } from 'lucide-react'

interface ExerciseFooterProps {
  isActive: boolean
  timeRemaining: number
  onStart: () => void
  onStop: () => void
  canContinue: boolean
}

export function ExerciseFooter({ 
  isActive, 
  timeRemaining,
  onStart, 
  onStop,
  canContinue
}: ExerciseFooterProps) {
  if (timeRemaining === 0) {
    return (
      <div className="fixed bottom-0 left-0 right-0 p-4 shadow-lg bg-white">
        <div className="max-w-xs mx-auto">
          <Button 
            onClick={onStop}
            className="w-full h-12 text-lg bg-green-500 hover:bg-green-600"
            disabled={!canContinue}
          >
            Complete Exercise
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 shadow-lg bg-white">
      <div className="max-w-xs mx-auto">
        {!isActive ? (
          <Button 
            onClick={onStart}
            className="w-full h-12 text-lg bg-green-500 hover:bg-green-500 hover:shadow-sm hover:scale-105 transition-transform"
          >
            <Play className="w-5 h-5 mr-2" style={{ marginRight: '2%' }} />
            <span style={{ marginRight: '8%' }}>Start Exercise</span>
          </Button>
        ) : (
          <Button 
            onClick={onStop}
            variant="destructive"
            className="w-full h-12 text-lg"
          >
            <PauseCircle className="w-5 h-5 mr-2" style={{ marginRight: '2%' }} />
            <span style={{ marginRight: '8%' }}>Stop Exercise</span>
          </Button>
        )}
      </div>
    </div>
  )
} 