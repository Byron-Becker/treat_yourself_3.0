// app/components/next-progress.tsx
"use client"
import NProgress from "nprogress"
import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function NextProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    NProgress.configure({ showSpinner: false })
    NProgress.done()
  }, [pathname, searchParams])
  
  return null
}