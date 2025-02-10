// features/onboarding/layout.tsx

'use client'

import { ReactNode } from "react"
import { cn } from "@/components/ui/utils"

interface OnboardingLayoutProps {
  children: ReactNode
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen w-full",
      "flex flex-col items-center justify-center",
      "bg-background",
      "overflow-hidden" // Prevent horizontal scroll during transitions
    )}>
      <div className={cn(
        "w-full max-w-7xl",
        "px-4 sm:px-6 lg:px-8",
        "py-8",
        "relative" // For slide positioning
      )}>
        {children}
      </div>
    </div>
  )
}