import { v4 as uuidv4 } from 'uuid'
import { 
  Exercise,
  ExerciseState,
  ProgressionStatus,
  Timer as TimerInterface
} from '../types'
import { Timer } from './timer'

export class ExerciseProgression {
  private readonly id: string
  private readonly exercises: Exercise[]
  private currentExerciseIndex: number
  private states: ExerciseState[]
  private status: ProgressionStatus
  private timer: TimerInterface

  constructor(exercises: Exercise[]) {
    this.id = uuidv4()
    this.exercises = exercises
    this.currentExerciseIndex = 0
    this.states = exercises.map(exercise => ({
      id: exercise.id,
      phase: 'setup',
      timeRemaining: exercise.duration,
      isTimerActive: false,
      currentQuestionId: null,
      answers: {},
      visibleQuestions: []
    }))
    this.status = 'not_started'
    this.timer = new Timer()
  }

  // Getters
  public getId(): string {
    return this.id
  }

  public getCurrentExercise(): Exercise {
    return this.exercises[this.currentExerciseIndex]
  }

  public getCurrentState(): ExerciseState {
    return this.states[this.currentExerciseIndex]
  }

  public getStatus(): ProgressionStatus {
    return this.status
  }

  // State Management
  public startExercise(): void {
    const currentState = this.getCurrentState()
    if (currentState.phase !== 'setup') {
      throw new Error('Exercise must be in setup phase to start')
    }

    this.states[this.currentExerciseIndex] = {
      ...currentState,
      phase: 'active',
      isTimerActive: true
    }
    this.status = 'in_progress'
    this.timer.start()
  }

  public pauseExercise(): void {
    const currentState = this.getCurrentState()
    if (currentState.phase !== 'active') {
      throw new Error('Exercise must be active to pause')
    }

    this.states[this.currentExerciseIndex] = {
      ...currentState,
      isTimerActive: false
    }
    this.timer.pause()
  }

  public submitResponse(questionId: string, answerId: string): void {
    const currentState = this.getCurrentState()
    if (currentState.phase !== 'active' && currentState.phase !== 'questions') {
      throw new Error('Exercise must be active or in questions phase to submit response')
    }

    // Update answers
    this.states[this.currentExerciseIndex] = {
      ...currentState,
      answers: {
        ...currentState.answers,
        [questionId]: answerId
      }
    }

    // Evaluate if we should move to next exercise
    if (this.shouldProgressToNextExercise()) {
      this.progressToNextExercise()
    }
  }

  private shouldProgressToNextExercise(): boolean {
    const currentState = this.getCurrentState()
    const { initial, location, continue: continueResponse } = currentState.answers

    return (
      continueResponse === 'yes' &&
      (initial === 'better' || initial === 'same') &&
      (location === 'central' || location === 'same')
    )
  }

  private progressToNextExercise(): void {
    if (this.currentExerciseIndex >= this.exercises.length - 1) {
      this.completeProgression()
      return
    }

    this.currentExerciseIndex++
    this.timer.reset(this.getCurrentExercise().duration)
  }

  private completeProgression(): void {
    this.status = 'completed'
    this.timer.stop()
  }

  // Timer Management
  public updateTimeRemaining(timeRemaining: number): void {
    const currentState = this.getCurrentState()
    this.states[this.currentExerciseIndex] = {
      ...currentState,
      timeRemaining
    }

    if (timeRemaining <= 0) {
      this.handleTimeExpired()
    }
  }

  private handleTimeExpired(): void {
    const currentState = this.getCurrentState()
    this.states[this.currentExerciseIndex] = {
      ...currentState,
      phase: 'questions',
      isTimerActive: false
    }
  }
} 