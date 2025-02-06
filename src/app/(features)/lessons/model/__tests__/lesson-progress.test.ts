// features/lessons/model/__tests__/lesson-progress.test.ts

import { LessonProgress } from '../lesson-progress'

describe('LessonProgress', () => {
  let progress: LessonProgress

  beforeEach(() => {
    // Fresh instance before each test
    progress = new LessonProgress()
  })

  describe('Lesson State', () => {
    test('should initialize with correct starting values', () => {
      expect(progress.getCurrentIndex()).toBe(0)
      expect(progress.getProgress()).toBe(0)
      expect(progress.isLessonComplete()).toBe(false)
      expect(progress.getCompletedSlides()).toHaveLength(0)
    })

    test('should track completed status correctly', () => {
      // Complete all slides in a 2-slide lesson
      progress.completeSlide('slide1', 2)
      progress.completeSlide('slide2', 2)
      
      expect(progress.isLessonComplete()).toBe(true)
      expect(progress.getProgress()).toBe(100)
    })
  })

  describe('Slide Completion', () => {
    test('should only count each slide once', () => {
      progress.completeSlide('slide1', 4)
      progress.completeSlide('slide1', 4)
      
      expect(progress.getProgress()).toBe(25) // Only counted once
    })

    test('should calculate progress correctly', () => {
      progress.completeSlide('slide1', 4)
      expect(progress.getProgress()).toBe(25)
      
      progress.completeSlide('slide2', 4)
      expect(progress.getProgress()).toBe(50)
    })
  })

  describe('Navigation', () => {
    test('should not advance beyond total slides', () => {
      expect(progress.canAdvance(1)).toBe(false)
    })

    test('should advance when possible', () => {
      expect(progress.canAdvance(2)).toBe(true)
      progress.advanceSlide(2)
      expect(progress.getCurrentIndex()).toBe(1)
    })

    test('should track current position correctly', () => {
      progress.advanceSlide(3)
      expect(progress.getCurrentIndex()).toBe(1)
      
      progress.advanceSlide(3)
      expect(progress.getCurrentIndex()).toBe(2)
    })
  })
})