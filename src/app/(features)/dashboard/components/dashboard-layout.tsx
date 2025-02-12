'use client'

import { NavBar } from "./nav-bar"
import { StreakDisplay } from "./streak-display"
import { TaskList } from "./task-list"
import { CourseGrid } from "./course-grid"
import { ProgressOverview } from "./progress-overview"

export function DashboardLayout() {
  return (
    <>
      <NavBar />
      <main className="container mx-auto p-4 md:p-6 max-w-5xl mt-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TaskList />
            <ProgressOverview />
            <StreakDisplay />
          </div>
          <CourseGrid />
        </div>
      </main>
    </>
  )
}