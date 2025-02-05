"use client"

import Link from "next/link"
import { cn } from "@/src/lib/utils"

interface NavigationProps {
  className?: string
  children?: React.ReactNode
}

export function Navigation({ className, children }: NavigationProps) {
  return (
    <nav className={cn("border-b bg-background", className)}>
      <div className="container flex h-14 items-center px-4">
        <Link href="/" className="font-bold">
          Your App
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          {children}
        </div>
      </div>
    </nav>
  )
}
