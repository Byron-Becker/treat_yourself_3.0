// app/lessons/[lessonId]/components/lesson-container.tsx

'use client'

import { useLesson } from '../../hooks/use-lesson'
import { InfoSlide } from '../components/slides/info-slide'
import { QuestionSlide } from '../components/slides/question-slide'
import { InfoBulletSlide } from '../components/slides/info-bullet-slide'
import { cn } from '@/components/ui/utils'
import { memo, useEffect, useRef } from 'react'
import type { Slide } from '../../types/lesson.types'
import { useLessonCompletion } from '../../hooks/use-lesson-completion'

interface LessonContainerProps {
  lessonId: string
}

interface SlideWrapperProps {
  slide: Slide
  index: number
  currentIndex: number
  completedSlides: Set<string>
  interactionState: string
  handleAnswer: (optionId: string, correctOptionId: string) => void
  completeSlide: (slideId: string) => void
  scrollToSlide: (slideId: string) => void
  updateSlidePosition: (slideId: string, bounds: { top: number; bottom: number }) => void
}

const SlideWrapper = memo(function SlideWrapper({ 
  slide, 
  index,
  currentIndex,
  completedSlides,
  interactionState,
  handleAnswer,
  completeSlide,
  scrollToSlide,
  updateSlidePosition 
}: SlideWrapperProps) {
  const prevBoundsRef = useRef<{ top: number; bottom: number } | null>(null);

  return (
    <div 
      className="slide-item"
      ref={el => {
        if (el) {
          const bounds = el.getBoundingClientRect();
          const prevBounds = prevBoundsRef.current;
          if (!prevBounds || prevBounds.top !== bounds.top || prevBounds.bottom !== bounds.bottom) {
            updateSlidePosition(slide.id, {
              top: bounds.top,
              bottom: bounds.bottom
            });
            prevBoundsRef.current = bounds;
          }
        }
      }}
    >
      {slide.type === 'info' && (
        <InfoSlide
          content={slide}
          isActive={index === currentIndex}
          isCompleted={completedSlides.has(slide.id)}
          onComplete={() => {
            completeSlide(slide.id)
            setTimeout(() => {
              scrollToSlide(slide.id);
            }, 100);
          }}
        />
      )}

      {slide.type === 'question' && (
        <QuestionSlide
          content={slide}
          isActive={index === currentIndex}
          isCompleted={completedSlides.has(slide.id)}
          interactionState={interactionState}
          onAnswer={handleAnswer}
          onComplete={() => {
            completeSlide(slide.id)
            setTimeout(() => {
              scrollToSlide(slide.id);
            }, 100);
          }}
        />
      )}

      {slide.type === 'infoBullet' && (
        <InfoBulletSlide
          content={slide}
          isActive={index === currentIndex}
          isCompleted={completedSlides.has(slide.id)}
          onComplete={() => {
            completeSlide(slide.id)
            setTimeout(() => {
              scrollToSlide(slide.id);
            }, 100);
          }}
        />
      )}
    </div>
  )
})

export function LessonContainer({ lessonId }: LessonContainerProps) {
  const {
    lesson,
    visibleSlides,
    currentIndex,
    completedSlides,
    
    interactionState,
    handleAnswer,
    completeSlide,
    scrollToSlide,
    updateSlidePosition,
    lastScrollPosition,
    activeSlideId
  } = useLesson(lessonId)

  const { complete} = useLessonCompletion(lessonId)

  // Handle final slide completion
  const handleFinalSlideCompletion = async (slideId: string) => {
    try {
      // Complete the slide first
      completeSlide(slideId)
      
      // If this was the last slide, attempt to mark as complete
      if (currentIndex === visibleSlides.length - 1) {
        try {
          await complete()
        } catch (error) {
          // Silently ignore duplicate completion errors
          // Still log other errors
          if (error instanceof Error && !error.message?.includes('duplicate key')) {
            console.error('Error completing lesson:', error)
          }
        }
      }
      
      // Scroll to next slide if available
      setTimeout(() => {
        scrollToSlide(currentIndex + 1)
      }, 100)
    } catch (error) {
      console.error('Error completing slide:', error)
    }
  }

  useEffect(() => {
    
  }, [lesson]);

  useEffect(() => {
    
  }, [visibleSlides]);

  useEffect(() => {
    
  }, [currentIndex]);

  useEffect(() => {
    
  }, [completedSlides]);

  useEffect(() => {
    
  }, [interactionState]);

  useEffect(() => {
    
  }, [activeSlideId]);

  useEffect(() => {
    
  }, [lastScrollPosition]);

  if (!lesson) return null

  return (
    <main className={cn(
      "w-full max-w-2xl mx-auto",
      "space-y-6 py-6",
      "mt-16"
    )}>

      {visibleSlides?.map((slide, index) => (
        <SlideWrapper
          key={slide.id}
          slide={slide}
          index={index}
          currentIndex={currentIndex}
          completedSlides={completedSlides}
          interactionState={interactionState}
          handleAnswer={handleAnswer}
          completeSlide={handleFinalSlideCompletion}
          // @ts-expect-error - scrollToSlide is not typed
          scrollToSlide={scrollToSlide}
          updateSlidePosition={updateSlidePosition}
        />
      ))}
    </main>
  )
}