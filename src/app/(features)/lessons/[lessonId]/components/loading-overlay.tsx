// app/lessons/[lessonId]/components/loading-overlay.tsx

import { cn } from "@/components/ui/utils"

export function LoadingOverlay() {
    return (
      <div className={cn(
        "fixed inset-0 z-50",
        "bg-background/80 backdrop-blur-sm",
        "flex items-center justify-center"
      )}>
        <div className="space-y-4 text-center">
          <div className="animate-spin">
            {/* Loading spinner */}
          </div>
          <p className="text-sm text-muted-foreground">
            Loading...
          </p>
        </div>
      </div>
    )
  }