// features/lessons/model/slide-interaction.ts

export type InteractionState = 'viewing' | 'answering' | 'reviewing' | 'explaining'

interface SlideInteractionState {
 state: InteractionState
 selectedOptionId: string | null
 hasSubmitted: boolean 
 hasViewedExplanation: boolean
 isCorrect: boolean | null
}

export class SlideInteraction {
 private state: SlideInteractionState

 constructor(initial?: Partial<SlideInteractionState>) {
   this.state = {
     state: initial?.state ?? 'viewing',
     selectedOptionId: initial?.selectedOptionId ?? null,
     hasSubmitted: initial?.hasSubmitted ?? false,
     hasViewedExplanation: initial?.hasViewedExplanation ?? false,
     isCorrect: initial?.isCorrect ?? null
   }
 }

 selectOption(optionId: string): void {
   if (this.state.state === 'answering') {
     this.state.selectedOptionId = optionId
   }
 }

 submit(correctOptionId: string): void {
   if (!this.state.selectedOptionId) return

   this.state.hasSubmitted = true
   this.state.isCorrect = this.state.selectedOptionId === correctOptionId
   this.state.state = 'reviewing'
 }

 startAnswering(): void {
   this.state.state = 'answering'
 }

 viewExplanation(): void {
   this.state.state = 'explaining'
   this.state.hasViewedExplanation = true
 }

 reset(): void {
   this.state.state = 'answering'
   this.state.selectedOptionId = null
   this.state.hasSubmitted = false
   this.state.isCorrect = null
 }

 canSubmit(): boolean {
   return !!this.state.selectedOptionId && !this.state.hasSubmitted
 }

 canViewExplanation(): boolean {
   return this.state.hasSubmitted && !this.state.hasViewedExplanation
 }
 
 getState(): InteractionState {
   return this.state.state
 }

 getSelectedOption(): string | null {
   return this.state.selectedOptionId
 }

 isAnswerCorrect(): boolean | null {
   return this.state.isCorrect
 }

 hasReviewed(): boolean {
   return this.state.hasViewedExplanation
 }

 toJSON() {
   return { ...this.state }
 }
}