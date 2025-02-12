// shared/components/body-map/use-body-map.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import type { BodyPartId} from './shared-types';
import { BODY_MAP_CONSTANTS } from './shared-types';
import { frontBodyParts, backBodyParts } from './body-part';
import { getBodyMapViewBox } from './shared-types';

export function useBodyMap(initialParts: BodyPartId[] = []) {
  const [selectedParts, setSelectedParts] = useState<BodyPartId[]>(initialParts)
  const [isBackView, setIsBackView] = useState(false)
  const mobileFrontRef = useRef<SVGSVGElement>(null)
  const mobileBackRef = useRef<SVGSVGElement>(null)
  const desktopFrontRef = useRef<SVGSVGElement>(null) 
  const desktopBackRef = useRef<SVGSVGElement>(null)

  const handleSelect = useCallback((partId: BodyPartId) => {
    setSelectedParts(prev => {
      if (prev.includes(partId)) {
        return prev.filter(p => p !== partId)
      }
      return [...prev, partId]
    })
  }, [])

  const toggleView = useCallback(() => {
    setIsBackView(prev => !prev)
  }, [])

  // Added useEffect for updating body parts
  useEffect(() => {
    // Update front body parts
    frontBodyParts.forEach(part => {
      const mobilePath = mobileFrontRef.current?.getElementById(part.id);
      const desktopPath = desktopFrontRef.current?.getElementById(part.id);
      
      ;[mobilePath, desktopPath].forEach(path => {
        if (path) {
          const pathElement = path as HTMLElement;
          pathElement.setAttribute('data-id', part.id);
          pathElement.style.cursor = 'pointer';
          pathElement.style.fill = selectedParts.includes(part.id) 
            ? BODY_MAP_CONSTANTS.colors.SELECTED
            : BODY_MAP_CONSTANTS.colors.UNSELECTED;
          pathElement.style.stroke = BODY_MAP_CONSTANTS.colors.STROKE;
          pathElement.style.strokeWidth = '1';
          pathElement.style.fillOpacity = '1';
        }
      });
    });

    // Update back body parts
    backBodyParts.forEach(part => {
      const mobilePath = mobileBackRef.current?.getElementById(part.id);
      const desktopPath = desktopBackRef.current?.getElementById(part.id);
      
      ;[mobilePath, desktopPath].forEach(path => {
        if (path) {
          const pathElement = path as HTMLElement;
          pathElement.setAttribute('data-id', part.id);
          pathElement.style.cursor = 'pointer';
          pathElement.style.fill = selectedParts.includes(part.id) 
            ? BODY_MAP_CONSTANTS.colors.SELECTED
            : BODY_MAP_CONSTANTS.colors.UNSELECTED;
          pathElement.style.stroke = BODY_MAP_CONSTANTS.colors.STROKE;
          pathElement.style.strokeWidth = '1';
          pathElement.style.fillOpacity = '1';
        }
      });
    });
  }, [selectedParts, isBackView]);

  return {
    selectedParts,
    isBackView,
    refs: {
      mobileFrontRef,
      mobileBackRef,
      desktopFrontRef,
      desktopBackRef
    },
    handleSelect,
    toggleView,
    viewBox: getBodyMapViewBox()
  }
}