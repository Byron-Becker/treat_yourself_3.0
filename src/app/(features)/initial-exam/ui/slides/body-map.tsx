// components/slides/body-map-slide.tsx
'use client'

import { forwardRef, useState } from 'react'
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
    const [totalScore, setTotalScore] = useState(0)
    
    const selectedLocations = Object.entries(selectedParts)
      .filter(([selected]) => selected)
      .map(([partId]) => partId as BodyPartId)

    const handlePartSelect = (partId: string, selected: boolean, score: number) => {
      onPartSelect(partId, selected)
      setTotalScore(prev => selected ? prev + score : prev - score)
    }

    return (
      <div ref={ref} className="space-y-4">
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MapPin size={32} className="text-cyan-600" />
              <h2 className="text-2xl font-bold text-slate-800">Pain Location</h2>
            </div>
            {totalScore > 0 && (
              <div className="text-sm text-slate-600">
                Pain Score: {totalScore}
              </div>
            )}
          </div>
          
          <p className="text-slate-600">
            Please indicate where you experience pain by clicking on the body regions.
          </p>

          <BaseMap
            selectedLocations={selectedLocations}
            onSelect={handlePartSelect}
          />
        </Card>
      </div>
    )
  }
)