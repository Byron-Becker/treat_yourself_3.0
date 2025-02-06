// features/lessons/model/__tests__/slide-interaction.test.ts

import { SlideInteraction } from '../slide-interaction'

describe('SlideInteraction', () => {
  let interaction: SlideInteraction

  beforeEach(() => {
    interaction = new SlideInteraction()
  })

  describe('State Management', () => {
    test('should initialize in viewing state', () => {
      expect(interaction.getState()).toBe('viewing')
      expect(interaction.getSelectedOption()).toBeNull()
      expect(interaction.isAnswerCorrect()).toBeNull()
    })

    test('should transition through states correctly', () => {
      interaction.startAnswering()
      expect(interaction.getState()).toBe('answering')

      interaction.selectOption('option1')
      interaction.submit('option1')
      expect(interaction.getState()).toBe('reviewing')
    })
  })

  describe('Answer Handling', () => {
    test('should handle correct answer', () => {
      interaction.startAnswering()
      interaction.selectOption('correct')
      interaction.submit('correct')
      
      expect(interaction.isAnswerCorrect()).toBe(true)
    })

    test('should handle incorrect answer', () => {
      interaction.startAnswering()
      interaction.selectOption('wrong')
      interaction.submit('correct')
      
      expect(interaction.isAnswerCorrect()).toBe(false)
    })
  })

  describe('Explanation Viewing', () => {
    test('should track explanation state', () => {
      expect(interaction.hasReviewed()).toBe(false)
      
      interaction.viewExplanation()
      expect(interaction.hasReviewed()).toBe(true)
      expect(interaction.getState()).toBe('explaining')
    })
  })

  describe('Reset Functionality', () => {
    test('should reset to initial answering state', () => {
      interaction.selectOption('option1')
      interaction.submit('correct')
      interaction.reset()

      expect(interaction.getState()).toBe('answering')
      expect(interaction.getSelectedOption()).toBeNull()
      expect(interaction.isAnswerCorrect()).toBeNull()
    })
  })
})