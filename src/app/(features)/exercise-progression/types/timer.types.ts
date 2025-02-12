export interface TimerState {
  duration: number
  timeRemaining: number
  isActive: boolean
}

export interface Timer {
  start(): void
  pause(): void
  stop(): void
  reset(duration: number): void
  addListener(listener: (timeRemaining: number) => void): void
  removeListener(listener: (timeRemaining: number) => void): void
  getTimeRemaining(): number
  isRunning(): boolean
} 