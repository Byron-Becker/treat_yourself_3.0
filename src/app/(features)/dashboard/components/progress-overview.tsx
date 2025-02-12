'use client'

import { Card, CardContent } from "@/components/ui/card"
import { useDashboardState } from "../hooks/use-dashboard-state"
import { BadgeCheck, Clock } from "lucide-react"

export function ProgressOverview() {
  const { state, isLoading } = useDashboardState()

  if (isLoading) {
    return <ProgressOverviewSkeleton />
  }

  const totalLessons = 2 // Hardcoded for now
  const completedLessons = Object.values(state.lessonCompletions).length

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold">{completedLessons}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Remaining</span>
            </div>
            <p className="text-2xl font-bold">{totalLessons - completedLessons}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProgressOverviewSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 animate-pulse">
        {/* Skeleton content */}
      </CardContent>
    </Card>
  )
}