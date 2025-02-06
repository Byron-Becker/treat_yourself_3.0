// features/lessons/model/viewport-state.ts

interface ViewportBounds {
    top: number
    bottom: number
   }
   
   interface SlidePosition {
    slideId: string
    bounds: ViewportBounds
    isActive: boolean
   }
   
   export class ViewportState {
    private slidePositions: Map<string, SlidePosition>
    private activeSlideId: string | null
    private lastScrollPosition: number
   
    constructor() {
      this.slidePositions = new Map()
      this.activeSlideId = null
      this.lastScrollPosition = 0
    }
   
    updateSlidePosition(slideId: string, bounds: ViewportBounds): void {
      this.slidePositions.set(slideId, {
        slideId,
        bounds,
        isActive: false
      })
    }
   
    setActiveSlide(slideId: string): void {
      this.activeSlideId = slideId
      this.slidePositions.forEach(position => {
        position.isActive = position.slideId === slideId
      })
    }
   
    isSlideVisible(slideId: string, viewportBounds: ViewportBounds): boolean {
      const position = this.slidePositions.get(slideId)
      if (!position) return false
   
      return (
        position.bounds.bottom >= viewportBounds.top && 
        position.bounds.top <= viewportBounds.bottom
      )
    }
   
    recordScrollPosition(position: number): void {
      this.lastScrollPosition = position
    }
   
    getLastScrollPosition(): number {
      return this.lastScrollPosition
    }
   
    getActiveSlideId(): string | null {
      return this.activeSlideId
    }
   
    getSlideBounds(slideId: string): ViewportBounds | null {
      return this.slidePositions.get(slideId)?.bounds ?? null
    }
   
    toJSON() {
      return {
        positions: Array.from(this.slidePositions.entries()),
        activeSlideId: this.activeSlideId,
        lastScrollPosition: this.lastScrollPosition
      }
    }
   }