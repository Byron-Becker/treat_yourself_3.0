'use client'

import { ReactNode } from 'react'
import { UserButton } from '@clerk/nextjs'

export default function ExamLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="absolute top-5 right-4 z-50">
        <UserButton />
      </div>
      {children}
    </div>
  )
}