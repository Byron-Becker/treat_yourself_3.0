// app/lessons/[lessonId]/page.tsx

import { ErrorBoundary } from '@/components/error-boundary'
import { LessonContainer } from './components/lesson-container'


interface PageProps {
  params: {
    lessonId: string
  }
}

export default function LessonPage({ params }: PageProps) {
  return (
    <ErrorBoundary>
      <LessonContainer lessonId={params.lessonId} />
    </ErrorBoundary>
  )
}