// features/lessons/model/__tests__/viewport-state.test.ts

import { ViewportState } from '../viewport-state'

describe('ViewportState', () => {
  let viewport: ViewportState

  beforeEach(() => {
    viewport = new ViewportState()
  })

  describe('Slide Position Tracking', () => {
    test('should track slide positions', () => {
      viewport.updateSlidePosition('slide1', { top: 0, bottom: 100 })
      expect(viewport.getSlideBounds('slide1')).toEqual({ top: 0, bottom: 100 })
    })

    test('should determine if slide is visible', () => {
      viewport.updateSlidePosition('slide1', { top: 50, bottom: 150 })
      
      expect(viewport.isSlideVisible('slide1', { top: 0, bottom: 100 })).toBe(true)
      expect(viewport.isSlideVisible('slide1', { top: 200, bottom: 300 })).toBe(false)
    })
  })

  describe('Active Slide Management', () => {
    test('should track active slide', () => {
      viewport.setActiveSlide('slide1')
      expect(viewport.getActiveSlideId()).toBe('slide1')
    })
  })

  describe('Scroll Position', () => {
    test('should record and retrieve scroll position', () => {
      viewport.recordScrollPosition(100)
      expect(viewport.getLastScrollPosition()).toBe(100)
    })
  })
})