// features/lessons/model/lesson-progress.ts

interface LessonProgressState {
    currentSlideIndex: number
    completedSlideIds: Set<string>
    progress: number
    isStarted: boolean
    isCompleted: boolean
  }
  
  export class LessonProgress {
    private state: LessonProgressState
  
    constructor(initial?: Partial<LessonProgressState>) {
      this.state = {
        currentSlideIndex: initial?.currentSlideIndex ?? 0,
        completedSlideIds: new Set(initial?.completedSlideIds),
        progress: initial?.progress ?? 0,
        isStarted: initial?.isStarted ?? false,
        isCompleted: initial?.isCompleted ?? false
      }
    }
  
    completeSlide(slideId: string, totalSlides: number): void {
      this.state.completedSlideIds.add(slideId)
      this.state.progress = (this.state.completedSlideIds.size / totalSlides) * 100
      
      if (this.state.progress === 100) {
        this.state.isCompleted = true
      }
    }
  
    startLesson(): void {
      if (!this.state.isStarted) {
        this.state.isStarted = true
        this.state.currentSlideIndex = 0
      }
    }
  
    advanceSlide(totalSlides: number): boolean {
      if (this.canAdvance(totalSlides)) {
        this.state.currentSlideIndex++
        return true
      }
      return false
    }
  
    canAdvance(totalSlides: number): boolean {
      return this.state.currentSlideIndex < totalSlides - 1
    }
  
    isSlideCompleted(slideId: string): boolean {
      return this.state.completedSlideIds.has(slideId)
    }
  
    getProgress(): number {
      return this.state.progress
    }
  
    getCurrentIndex(): number {
      return this.state.currentSlideIndex
    }
  
    getCompletedSlides(): string[] {
      return Array.from(this.state.completedSlideIds)
    }
  
    isLessonComplete(): boolean {
      return this.state.isCompleted
    }
  
    toJSON() {
      return {
        currentSlideIndex: this.state.currentSlideIndex,
        completedSlideIds: Array.from(this.state.completedSlideIds),
        progress: this.state.progress,
        isStarted: this.state.isStarted,
        isCompleted: this.state.isCompleted
      }
    }
  }