import { Timer as TimerInterface, TimerState } from '../types/timer.types'

export class Timer implements TimerInterface {
  private duration: number
  private timeRemaining: number
  private isActive: boolean
  private startTime: number | null
  private listeners: ((timeRemaining: number) => void)[]

  constructor() {
    this.duration = 0
    this.timeRemaining = 0
    this.isActive = false
    this.startTime = null
    this.listeners = []
  }

  public start(): void {
    if (this.isActive) return
    
    this.isActive = true
    this.startTime = Date.now()
    this.tick()
  }

  public pause(): void {
    this.isActive = false
    this.startTime = null
  }

  public stop(): void {
    this.isActive = false
    this.startTime = null
    this.timeRemaining = 0
  }

  public reset(duration: number): void {
    this.duration = duration
    this.timeRemaining = duration
    this.isActive = false
    this.startTime = null
  }

  public addListener(listener: (timeRemaining: number) => void): void {
    this.listeners.push(listener)
  }

  public removeListener(listener: (timeRemaining: number) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  private tick(): void {
    if (!this.isActive || !this.startTime) return

    const now = Date.now()
    const elapsed = Math.floor((now - this.startTime) / 1000)
    this.timeRemaining = Math.max(0, this.duration - elapsed)

    // Notify listeners
    this.listeners.forEach(listener => listener(this.timeRemaining))

    // Continue ticking if time remains and timer is active
    if (this.timeRemaining > 0 && this.isActive) {
      requestAnimationFrame(() => this.tick())
    } else if (this.timeRemaining <= 0) {
      this.stop()
    }
  }

  public getTimeRemaining(): number {
    return this.timeRemaining
  }

  public isRunning(): boolean {
    return this.isActive
  }

  public getState(): TimerState {
    return {
      duration: this.duration,
      timeRemaining: this.timeRemaining,
      isActive: this.isActive
    }
  }
} 