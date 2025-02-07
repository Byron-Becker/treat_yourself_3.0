// features/lessons/components/__tests__/lesson-container.integration.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LessonContainer } from '../lesson-container'
import { useLesson } from '../../../hooks/use-lesson'
import { useLessonCompletion } from '../../../hooks/use-lesson-completion'


jest.mock('../../../hooks/use-lesson')
jest.mock('../../../hooks/use-lesson-completion')


describe('LessonContainer Integration', () => {
  const mockLessonId = 'lesson-1'
  const mockSlides = [
    { id: 'slide-1', type: 'info', title: 'First Slide', body: 'Content 1' },
    { id: 'slide-2', type: 'info', title: 'Last Slide', body: 'Content 2' }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock useLesson default state
    ;(useLesson as jest.Mock).mockReturnValue({
      lesson: { id: mockLessonId, slides: mockSlides },
      visibleSlides: mockSlides,
      currentIndex: 0,
      completedSlides: new Set(),
      loading: false,
      completeSlide: jest.fn(),
      scrollToSlide: jest.fn(),
      updateSlidePosition: jest.fn()
    })

    // Mock useLessonCompletion default state
    ;(useLessonCompletion as jest.Mock).mockReturnValue({
      complete: jest.fn(),
      isCompleting: false,
      error: null
    })
  })

  it('should complete lesson when all slides are finished', async () => {
    const mockComplete = jest.fn()
    const mockCompleteSlide = jest.fn()

    ;(useLessonCompletion as jest.Mock).mockReturnValue({
      complete: mockComplete,
      isCompleting: false
    })

    ;(useLesson as jest.Mock).mockReturnValue({
      lesson: { id: mockLessonId, slides: mockSlides },
      visibleSlides: mockSlides,
      currentIndex: mockSlides.length - 1,
      completedSlides: new Set([mockSlides[0].id]),
      loading: false,
      completeSlide: mockCompleteSlide,
      scrollToSlide: jest.fn(),
      updateSlidePosition: jest.fn()
    })

    render(<LessonContainer lessonId={mockLessonId} />)

    // Click continue on last slide
    const continueButton = screen.getByText('Continue')
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(mockCompleteSlide).toHaveBeenCalledWith(mockSlides[1].id)
      expect(mockComplete).toHaveBeenCalled()
    })
  })

  it('should show loading state when completing lesson', async () => {
    ;(useLessonCompletion as jest.Mock).mockReturnValue({
      complete: jest.fn(),
      isCompleting: true
    })

    render(<LessonContainer lessonId={mockLessonId} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should handle slide progression correctly', async () => {
    const mockScrollToSlide = jest.fn()
    
    // Show only first slide
    ;(useLesson as jest.Mock).mockReturnValue({
      lesson: { id: mockLessonId, slides: mockSlides },
      visibleSlides: [mockSlides[0]], // Only show first slide
      currentIndex: 0,
      completedSlides: new Set(),
      loading: false,
      completeSlide: jest.fn(),
      scrollToSlide: mockScrollToSlide,
      updateSlidePosition: jest.fn()
    })

    render(<LessonContainer lessonId={mockLessonId} />)

    const continueButton = screen.getByText('Continue')
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(mockScrollToSlide).toHaveBeenCalledWith(mockSlides[0].id)
    })
  })
})