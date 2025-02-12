import { ExerciseContainer } from '../components'
import { exercises } from '../data'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ExercisePage({ params }: PageProps) {
  const { id } = await params
  const exercise = exercises[id]

  if (!exercise) {
    notFound()
  }

  return <ExerciseContainer exercise={exercise} />
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const exercise = exercises[id]

  if (!exercise) {
    return {
      title: 'Exercise Not Found',
      description: 'The requested exercise could not be found.'
    }
  }

  return {
    title: `Exercise: ${exercise.name}`,
    description: `Follow along with the ${exercise.name.toLowerCase()} exercise progression.`
  }
}

// Generate static params for all exercises
export async function generateStaticParams() {
  return Object.keys(exercises).map((id) => ({
    id
  }))
} 