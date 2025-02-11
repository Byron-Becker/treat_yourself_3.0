'use client'

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ExamHeaderProps {
  progress: number
}

export function ExamHeader({ progress }: ExamHeaderProps) {
  const router = useRouter()

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

        <div className="font-semibold">
          {progress}%
        </div>
      </div>
    </header>
  )
}