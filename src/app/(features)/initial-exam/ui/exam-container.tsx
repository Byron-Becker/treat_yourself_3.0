//  /(features)/initial-exam/ui/exam-container.tsx

'use client'

import dynamic from 'next/dynamic'

const DynamicExamContent = dynamic(
  () => import('./exam-content'),
  { ssr: false }
)

export function ExamContainer() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <DynamicExamContent />
    </div>
  )
}