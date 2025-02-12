// components/shared/body-map/base-map.tsx
'use client'

import { BodyMapSVG } from './rear-body-map-svg'
import { FrontBodyMapSVG } from './front-body-map-svg'
import { useBodyMap } from './use-body-map'
import { BodyPartId } from './shared-types'
import { frontBodyParts, backBodyParts } from './body-part'

interface BaseMapProps {
  selectedLocations: BodyPartId[]
  onSelect: (regionId: BodyPartId, selected: boolean, score: number) => void
  className?: string
  readOnly?: boolean
}

function calculatePartScore(partId: BodyPartId): number {
  const allBodyParts = [...frontBodyParts, ...backBodyParts]
  const part = allBodyParts.find(p => p.id === partId)
  return part?.score || 0
}

export function BaseMap({ selectedLocations, onSelect, className, readOnly = false }: BaseMapProps) {
  const {
    isBackView,
    refs: {
      mobileFrontRef,
      mobileBackRef,
      desktopFrontRef,
      desktopBackRef
    },
    handleSelect,
    toggleView,
    viewBox
  } = useBodyMap(selectedLocations)

  const handleClick = readOnly ? undefined : (event: React.MouseEvent<SVGElement>) => {
    const partId = (event.target as SVGElement).getAttribute('data-id')
    if (partId) {
      const bodyPartId = partId as BodyPartId
      const isSelected = !selectedLocations.includes(bodyPartId)
      const score = calculatePartScore(bodyPartId)
      handleSelect(bodyPartId)
      onSelect(bodyPartId, isSelected, score)
    }
  }

  return (
    <div className={className}>
      <div className={`flex justify-center lg:hidden mb-4 ${readOnly ? 'hidden' : ''}`}>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600">Back View</span>
          <input 
            type="checkbox"
            checked={isBackView}
            onChange={() => toggleView()}
            className="rounded border-gray-300"
            disabled={readOnly}
          />
          <span className="text-sm text-slate-600">Front View</span>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          {!isBackView ? (
            <BodyMapSVG
              svgRef={mobileBackRef}
              onClick={handleClick}
              viewBox={viewBox}
              className={`w-full h-full ${readOnly ? 'pointer-events-none' : ''}`}
            />
          ) : (
            <FrontBodyMapSVG
              svgRef={mobileFrontRef}
              onClick={handleClick}
              viewBox={viewBox}
              className={`w-full h-full ${readOnly ? 'pointer-events-none' : ''}`}
            />
          )}
        </div>
      </div>

      <div className="hidden lg:flex flex-row gap-4">
        <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-200">
          <h3 className="text-center text-sm text-slate-600 mb-2">Front View</h3>
          <FrontBodyMapSVG
            svgRef={desktopFrontRef}
            onClick={handleClick}
            viewBox={viewBox}
            className={`w-full h-full ${readOnly ? 'pointer-events-none' : ''}`}
          />
        </div>
        
        <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-200">
          <h3 className="text-center text-sm text-slate-600 mb-2">Back View</h3>
          <BodyMapSVG
            svgRef={desktopBackRef}
            onClick={handleClick}
            viewBox={viewBox}
            className={`w-full h-full ${readOnly ? 'pointer-events-none' : ''}`}
          />
        </div>
      </div>
    </div>
  )
}