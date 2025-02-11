'use client'

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useExamStore } from "../model/exam-state"

interface ExamHeaderProps {
  progress: number
}

export function ExamHeader({ progress }: ExamHeaderProps) {
  const router = useRouter()
  const resetExam = useExamStore(state => state.resetExam)

  const handleReset = () => {
    resetExam()
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-600"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 mx-4">
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center gap-2">
          <div className="font-semibold">
            {progress}%
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="text-gray-600"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}