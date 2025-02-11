'use server'

import { examService } from '../services/exam.service'
import { ExamAnswers } from '../types'
import { NotFoundError } from '@/lib/errors/base'

export async function saveExamAnswers(
  answers: ExamAnswers,
  token: string | null
) {
  try {
    return await examService.createExam({
      safety_answers: answers.safety,
      treatment_answers: answers.treatment,
      is_completed: false,
      user_id: '', // Will be set by service from JWT
    }, token)
  } catch (error) {
    console.error('Error saving exam answers:', error)
    throw error
  }
}

export async function updateExamAnswers(
  examId: string,
  answers: ExamAnswers,
  token: string | null
) {
  try {
    const exam = await examService.getExam(examId, token)
    if (!exam) {
      throw new NotFoundError('Exam not found')
    }

    return await examService.updateExam(examId, {
      safety_answers: answers.safety,
      treatment_answers: answers.treatment
    }, token)
  } catch (error) {
    console.error('Error updating exam answers:', error)
    throw error
  }
}

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