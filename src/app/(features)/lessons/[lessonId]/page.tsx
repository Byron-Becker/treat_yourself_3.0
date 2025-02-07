// app/lessons/[lessonId]/page.tsx

import { ErrorBoundary } from '@/components/error-boundary'
import { LessonContainer } from './components/lesson-container'

interface PageProps {
  params: Promise<{
    lessonId: string
  }>
}

export default async function LessonPage({ params }: PageProps) {
  const { lessonId } = await params

  return (
    <ErrorBoundary>
      <LessonContainer lessonId={lessonId} />
    </ErrorBoundary>
  )
}