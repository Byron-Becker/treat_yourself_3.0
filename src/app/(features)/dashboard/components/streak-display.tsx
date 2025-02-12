// features/dashboard/components/streak-display.tsx
'use client'

import { Card, CardContent } from "@/components/ui/card"
import { useProgressTracking } from "../hooks/use-progress-tracking"
import { Zap } from "lucide-react"
import { cn } from "@/components/ui/utils"

export function StreakDisplay() {
  const { streakData, isLoading } = useProgressTracking()

  if (isLoading) {
    return <StreakDisplaySkeleton />
  }

  const today = new Date().toISOString().split('T')[0]
  const days = [
    { label: "Mon", date: getDateForDay(1) },
    { label: "Tue", date: getDateForDay(2) },
    { label: "Wed", date: getDateForDay(3) },
    { label: "Thu", date: getDateForDay(4) },
    { label: "Fri", date: getDateForDay(5) },
    { label: "Sat", date: getDateForDay(6) },
    { label: "Sun", date: getDateForDay(0) },
  ].map(day => ({
    ...day,
    isActive: streakData.dates.includes(day.date),
    isToday: day.date === today
  }))

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Daily Check-in</h2>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{streakData.currentStreak}</span>
            <Zap className={cn(
              "h-6 w-6",
              streakData.currentStreak > 0 ? "text-yellow-500" : "text-gray-200"
            )} />
          </div>
        </div>

        <div className="flex justify-between">
          {days.map((day) => (
            <div key={day.label} className="flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2",
                day.isActive ? "border-primary bg-primary/10" : "border-gray-200",
                day.isToday && "ring-2 ring-offset-2 ring-primary"
              )}>
                <Zap className={cn(
                  "h-5 w-5",
                  day.isActive ? "text-primary" : "text-gray-200"
                )} />
              </div>
              <span className={cn(
                "text-sm",
                day.isToday ? "font-semibold" : "text-muted-foreground"
              )}>
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function StreakDisplaySkeleton() {
  return (
    <Card>
      <CardContent className="p-6 animate-pulse">
        {/* Skeleton content */}
      </CardContent>
    </Card>
  )
}

function getDateForDay(dayNumber: number): string {
  const today = new Date()
  const currentDay = today.getDay()
  let diff = dayNumber - currentDay
  if (dayNumber === 0) {
    diff = 7 - currentDay
  }
  const targetDate = new Date(today)
  targetDate.setDate(today.getDate() + diff)
  return targetDate.toISOString().split('T')[0]
}