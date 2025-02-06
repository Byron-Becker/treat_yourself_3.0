// features/lessons/types/lesson.types.ts

export interface BaseSlide {
    id: string
    type: SlideType
    nextRoute?: string
  }
  
  export type SlideType = 'info' | 'question' | 'infoBullet'
  
  export interface InfoSlide extends BaseSlide {
    type: 'info'
    title: string
    body: string
    imageUrl?: string
  }
  
  export interface QuestionSlide extends BaseSlide {
    type: 'question'
    question: string
    options: QuestionOption[]
    explanation?: string
    imageUrl?: string
  }
  
  export interface InfoBulletSlide extends BaseSlide {
    type: 'infoBullet'
    title: string
    introduction?: string
    bullets: BulletPoint[]
    imageUrl?: string
  }
  
  export interface QuestionOption {
    id: string
    text: string
    isCorrect: boolean
  }
  
  export interface BulletPoint {
    text: string
  }
  
  export type Slide = InfoSlide | QuestionSlide | InfoBulletSlide
  
  export interface Lesson {
    id: string
    title: string
    description?: string
    slides: Slide[]
    progress: number
    currentSlideIndex: number
    completedSlideIds: string[]
    createdAt: string
    updatedAt: string
    userId: string
  }
  
  export type CreateLesson = Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>
  export type UpdateLesson = Partial<Omit<Lesson, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>