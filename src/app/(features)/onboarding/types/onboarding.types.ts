// features/onboarding/types/onboarding.types.ts

import { LucideIcon } from "lucide-react"

export interface OnboardingState {
    currentSlideIndex: number
    totalSlides: number
    selectedOptionId: string | null
  }
  
  export type SlideType = 'media-text' | 'feature-showcase' | 'option-card'
  
  export interface BaseSlide {
    id: string
    type: SlideType
  }
  
  export interface MediaTextSlide extends BaseSlide {
    type: 'media-text'
    title: string
    description: string
    imageUrl: string
  }
  
  export interface FeatureShowcase extends BaseSlide {
    type: 'feature-showcase'
    features: Array<{
      id: string
      title: string
      icon: LucideIcon
      content: string
      media: {
        type: 'image' | 'video'
        src: string
      }
    }>
  }
  
  export interface OptionCard extends BaseSlide {
    type: 'option-card'
    title: string
    description: string
    options: Array<{
      id: string
      title: string
      icon: LucideIcon
      color: string
    }>
  }
  
  export type Slide = MediaTextSlide | FeatureShowcase | OptionCard