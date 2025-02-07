// app/lessons/[lessonId]/layout.tsx

'use client'

import { LessonHeader } from './components/lesson-header'
import { cn } from '@/components/ui/utils'

interface LessonLayoutProps {
 children: React.ReactNode
}

export default function LessonLayout({ children }: LessonLayoutProps) {
 return (
   <div className={cn(
     "min-h-[100dvh] flex flex-col",
     "bg-background"
   )}>
     <LessonHeader className="flex-none sticky top-0 z-50" />
     
     <main className={cn(
       "flex-1 relative",
       "px-4 sm:px-6 lg:px-8",
       "pt-safe-offset-top pb-safe-offset-bottom"
     )}>
       {children}
     </main>
   </div>
 )
}