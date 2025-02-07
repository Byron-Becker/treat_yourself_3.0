// app/lessons/[lessonId]/page.tsx

import { ErrorBoundary } from '@/components/error-boundary'
import { LessonContainer } from './components/lesson-container'


interface PageProps {
  params: {
    lessonId: string
  }
}

export default async function LessonPage({ params }: PageProps) {
  const { lessonId } = await params; // Awaiting params

  return (
    <ErrorBoundary>
      <LessonContainer lessonId={lessonId} />
    </ErrorBoundary>
  )
}