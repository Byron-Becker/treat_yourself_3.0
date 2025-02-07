// app/lessons/[lessonId]/components/lesson-container.tsx

'use client'

import { useLesson } from '../../hooks/use-lesson'
import { InfoSlide } from '../components/slides/info-slide'
import { QuestionSlide } from '../components/slides/question-slide'
import { InfoBulletSlide } from '../components/slides/info-bullet-slide'
import { LoadingOverlay } from '../components/loading-overlay'
import { cn } from '@/components/ui/utils'


interface LessonContainerProps {
  lessonId: string
}

export function LessonContainer({ lessonId }: LessonContainerProps) {
  const {
    lesson,
    visibleSlides,
    currentIndex,
    completedSlides,
    loading,
    interactionState,
    handleAnswer,
    completeSlide,
    scrollToSlide,
    updateSlidePosition
  } = useLesson()

  if (!lesson) return null

  return (
    <div className={cn(
      "w-full max-w-2xl mx-auto",
      "space-y-6 py-6"
    )}>
      {loading && <LoadingOverlay />}

      {visibleSlides.map((slide, index) => (
        <div 
          key={slide.id}
          className="slide-item"
          ref={el => {
            if (el) {
              const bounds = el.getBoundingClientRect()
              updateSlidePosition(slide.id, {
                top: bounds.top,
                bottom: bounds.bottom
              })
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
                scrollToSlide(slide.id)
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
                scrollToSlide(slide.id)
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
                scrollToSlide(slide.id)
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}