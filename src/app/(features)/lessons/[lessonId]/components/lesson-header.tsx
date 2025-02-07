// app/lessons/[lessonId]/components/lesson-header.tsx

'use client'

import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'
import { cn } from '@/components/ui/utils'

interface LessonHeaderProps {
 className?: string
}

export function LessonHeader({ className }: LessonHeaderProps) {
 const router = useRouter()

 return (
   <header className={cn(
     "bg-background/80 backdrop-blur-sm border-b",
     "px-4 py-3",
     className
   )}>
     <div className="flex items-center gap-4">
       <Button 
         variant="ghost" 
         size="icon"
         onClick={() => router.back()}
         className="shrink-0"
       >
         <ArrowLeft className="h-5 w-5" />
         <span className="sr-only">Go back</span>
       </Button>

       <div className="flex-1 min-w-0">
         <Progress 
           value={50} // Will come from lesson progress
           className="h-2" 
         />
       </div>

       <div className="shrink-0 text-sm font-medium">
         50% {/* Will come from lesson progress */}
       </div>
     </div>
   </header>
 )
}