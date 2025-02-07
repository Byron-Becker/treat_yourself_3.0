// app/lessons/[lessonId]/components/image-error-boundary.tsx

'use client'

import React from 'react'
import { ImageOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

export class ImageErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-muted rounded-lg p-8">
          <ImageOff className="h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Failed to load image</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => this.setState({ hasError: false })}
          >
            Retry
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}