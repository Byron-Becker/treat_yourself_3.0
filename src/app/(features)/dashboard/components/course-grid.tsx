'use client'

import { useDashboardState } from "../hooks/use-dashboard-state"
import { CourseCard } from "./course-card"
import { ArrowUpRight, Timer } from "lucide-react"

export function CourseGrid() {
  const { canAccessLessons, isLoading } = useDashboardState()

  if (isLoading) {
    return <CourseGridSkeleton />
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Available Lessons</h2>
      <div className="grid gap-4">
        <CourseCard
          subject="POSTURE"
          level={1}
          title="Understanding Good Posture"
          icon={<ArrowUpRight className="w-8 h-8 text-blue-500" />}
          color="text-blue-500"
          href="/lessons/posture-lesson"
          disabled={!canAccessLessons}
        />
        <CourseCard
          subject="EXERCISE"
          level={1}
          title="Exercise Fundamentals"
          icon={<Timer className="w-8 h-8 text-purple-500" />}
          color="text-purple-500"
          href="/lessons/exercise-lesson"
          disabled={!canAccessLessons}
        />
      </div>
    </div>
  )
}

function CourseGridSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Skeleton content */}
    </div>
  )
}