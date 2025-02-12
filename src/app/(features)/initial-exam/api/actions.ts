'use server'

import { examService } from '../services/exam.service'
import { ExamAnswers } from '../types'
import { NotFoundError } from '@/lib/errors/base'
import { frontBodyParts, backBodyParts } from '@/app/(features)/shared/components/body-map/body-part'

function calculateTotalScore(selections: Record<string, boolean>): number {
  const allBodyParts = [...frontBodyParts, ...backBodyParts]
  return Object.entries(selections)
    .filter(([selected]) => selected)
    .reduce((total, [partId]) => {
      const part = allBodyParts.find(p => p.id === partId)
      return total + (part?.score || 0)
    }, 0)
}

export async function saveExamAnswers(
  answers: ExamAnswers,
  token: string | null
) {
  try {
    // First check if user already has a completed exam
    const hasCompleted = await examService.hasCompletedExam(token)
    if (hasCompleted) {
      throw new Error('User already has a completed initial exam')
    }

    // Calculate body map score
    const score = calculateTotalScore(answers.bodyMap)

    // First save body map with score
    const bodyMapId = await examService.createBodyMapSelection(
      answers.bodyMap,
      score,
      token
    )

    // Then create exam with all data at once
    return await examService.createExam({
      safety_answers: answers.safety,
      treatment_answers: answers.treatment,
      body_map_id: bodyMapId,
      is_completed: true, // Set to true since this is the final submission
      user_id: '', // Will be set by service from JWT
    }, token)
  } catch (error) {
    console.error('Error saving exam answers:', error)
    throw error
  }
}

// Remove updateExamAnswers since we don't want partial saves

export async function completeExam(
  examId: string,
  token: string | null
) {
  try {
    const exam = await examService.getExam(examId, token)
    if (!exam) {
      throw new NotFoundError('Exam not found')
    }

    return await examService.completeExam(examId, token)
  } catch (error) {
    console.error('Error completing exam:', error)
    throw error
  }
}