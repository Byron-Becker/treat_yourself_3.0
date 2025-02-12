'use client'

import { Check } from "lucide-react"
import Link from "next/link"
import { useDashboardState } from "../hooks/use-dashboard-state"
import { useUserActivity } from "../hooks/use-user-activity"

export function TaskList() {
  const { state, canAccessLessons, canAccessExercises } = useDashboardState()
  const { needsAssessment } = useUserActivity()

  const today = new Date().toISOString().split('T')[0]
  const hasCompletedTodaysExercise = state.exerciseState.lastCompletedAt === today

  return (
    <div className="p-6 bg-green-50 rounded-lg border border-green-200">
      <h3 className="font-semibold text-xl mb-4">Your To-Do List</h3>
      <div className="space-y-3">
        <TaskItem
          isCompleted={state.initialExam.isCompleted}
          label="Complete your initial exam"
          href="/initial-exam"
          disabledLabel="Complete your initial exam"
        />

        <TaskItem
          isCompleted={state.lessonCompletions['exercise-lesson']?.isCompleted}
          label="Complete exercise lesson"
          href="/lessons/exercise-lesson"
          disabled={!canAccessLessons}
          disabledLabel="Complete initial exam first"
        />

        <TaskItem
          isCompleted={hasCompletedTodaysExercise}
          label="Complete your daily exercise"
          href="/exercise-progression/1"
          disabled={!canAccessExercises}
          disabledLabel="Complete exercise lesson first"
        />

        <TaskItem
          isCompleted={!needsAssessment}
          label="Complete Movement Analysis"
          href="/range-of-motion"
          disabled={!canAccessExercises}
          disabledLabel="Complete exercise lesson first"
        />
      </div>
    </div>
  )
}

interface TaskItemProps {
  isCompleted: boolean
  label: string
  href: string
  disabled?: boolean
  disabledLabel?: string
}

function TaskItem({ isCompleted, label, href, disabled, disabledLabel }: TaskItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center
        ${isCompleted ? 'bg-green-500' : 'border-2 border-gray-300'}`}>
        {isCompleted && <Check className="w-3 h-3 text-white" />}
      </div>
      
      {isCompleted ? (
        <span className="text-gray-600 line-through">{label}</span>
      ) : disabled ? (
        <span className="text-gray-400">{disabledLabel}</span>
      ) : (
        <Link href={href} className="text-blue-600 hover:underline">
          {label}
        </Link>
      )}
    </div>
  )
}