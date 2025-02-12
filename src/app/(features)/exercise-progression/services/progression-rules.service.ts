import { 
  ResponseSet, 
  ResponseEvaluation,
} from '../types'

export class ProgressionRulesService {
  evaluateResponses(responses: ResponseSet): ResponseEvaluation {
    // If no initial response yet, can't evaluate
    if (!responses.initial) {
      return {
        canProgress: false,
        shouldStop: false,
        nextQuestionId: 'initial'
      }
    }

    // Check for negative responses that should stop the exercise
    if (responses.initial === 'worse') {
      return {
        canProgress: false,
        shouldStop: true,
        message: 'Exercise stopped due to worsening symptoms'
      }
    }

    // If we have initial but no location, that's the next question
    if (!responses.location) {
      return {
        canProgress: false,
        shouldStop: false,
        nextQuestionId: 'location'
      }
    }

    // Check location response
    if (responses.location === 'peripheral') {
      return {
        canProgress: false,
        shouldStop: true,
        message: 'Exercise stopped due to symptoms moving peripherally'
      }
    }

    // If we have both responses but no continue response, that's next
    if (!responses.continue) {
      return {
        canProgress: false,
        shouldStop: false,
        nextQuestionId: 'continue'
      }
    }

    // Final evaluation
    const canProgress = this.canProgressToNext(responses)
    
    return {
      canProgress,
      shouldStop: !canProgress,
      message: canProgress 
        ? 'Ready to progress to next exercise'
        : 'Exercise series completed'
    }
  }

  private canProgressToNext(responses: ResponseSet): boolean {
    return (
      responses.continue === 'yes' &&
      (responses.initial === 'better' || responses.initial === 'same') &&
      (responses.location === 'central' || responses.location === 'same')
    )
  }

  getNextQuestionId(currentQuestionId: string | null, response: string): string | null {
    switch (currentQuestionId) {
      case 'initial':
        return response === 'worse' ? 'stop' : 'location'
      case 'location':
        return response === 'peripheral' ? 'stop' : 'continue'
      case 'continue':
        return response === 'yes' ? null : 'stop'
      case 'stop':
        return null
      default:
        return 'initial'
    }
  }
} 