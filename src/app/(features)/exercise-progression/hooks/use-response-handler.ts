import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressionRulesService } from '../services'
import { ResponseSet } from '../types'

interface UseResponseHandlerProps {
  onSubmitResponse: (questionId: string, answerId: string) => Promise<void>
  currentResponses: ResponseSet
}

export function useResponseHandler({
  onSubmitResponse,
  currentResponses
}: UseResponseHandlerProps) {
  const router = useRouter()
  const rulesService = useMemo(() => new ProgressionRulesService(), [])

  const handleResponse = useCallback(async (questionId: string, answerId: string) => {
    await onSubmitResponse(questionId, answerId)
    
    const evaluation = rulesService.evaluateResponses({
      ...currentResponses,
      [questionId]: answerId
    })

    if (evaluation.shouldStop && questionId === 'stop' && answerId === 'return_to_dashboard') {
      router.push('/dashboard')
      return
    }
  }, [onSubmitResponse, currentResponses, rulesService, router])

  const canContinue = useCallback((responses: ResponseSet) => {
    const evaluation = rulesService.evaluateResponses(responses)
    return evaluation.canProgress
  }, [rulesService])

  const shouldStop = useCallback((responses: ResponseSet) => {
    const evaluation = rulesService.evaluateResponses(responses)
    return evaluation.shouldStop
  }, [rulesService])

  const getNextQuestion = useCallback((currentQuestionId: string | null, response: string) => {
    return rulesService.getNextQuestionId(currentQuestionId, response)
  }, [rulesService])

  return {
    handleResponse,
    canContinue,
    shouldStop,
    getNextQuestion
  }
} 