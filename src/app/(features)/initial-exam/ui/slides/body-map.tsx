// components/slides/body-map-slide.tsx
'use client'

import { forwardRef } from 'react'
import { MapPin } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { BodyPartId } from '@/app/(features)/shared/components/body-map/shared-types'
import { BaseMap } from '@/app/(features)/shared/components/body-map/base-map'

interface BodyMapSlideProps {
  selectedParts: Record<string, boolean>
  onPartSelect: (partId: string, selected: boolean) => void
}

export const BodyMapSlide = forwardRef<HTMLDivElement, BodyMapSlideProps>(
  function BodyMapSlide({ selectedParts, onPartSelect }, ref) {
    const selectedLocations = Object.entries(selectedParts)
      .filter(([_, selected]) => selected)
      .map(([partId]) => partId as BodyPartId)

    return (
      <div ref={ref} className="space-y-4">
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MapPin size={32} className="text-cyan-600" />
              <h2 className="text-2xl font-bold text-slate-800">Pain Location</h2>
            </div>
          </div>
          
          <p className="text-slate-600">
            Please indicate where you experience pain by clicking on the body regions.
          </p>

          <BaseMap
            selectedLocations={selectedLocations}
            onSelect={(partId) => onPartSelect(partId, !selectedParts[partId])}
          />
        </Card>
      </div>
    )
  }
)