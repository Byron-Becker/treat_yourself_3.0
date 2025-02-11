import { ExamContainer } from './ui/exam-container'
import { notFound } from 'next/navigation'

export default async function ExamPage() {
  // Later we can add data fetching here if needed, similar to getInitialContent in lessons
  try {
    return <ExamContainer />
  } catch (error) {
    console.error('Error in ExamPage:', error)
    notFound()
  }
}