import { DashboardLayout } from './components/dashboard-layout'
import { ErrorBoundary } from '@/components/error-boundary'
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardLayout />
      </Suspense>
    </ErrorBoundary>
  )
}

// Metadata
export const metadata = {
  title: 'Dashboard',
  description: 'Your personal exercise and progress dashboard',
}