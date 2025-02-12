import { backBodyParts, frontBodyParts } from './body-part'

export type BodyRegion = 'front' | 'back';
export type BodyPartId = string;

export interface BodyMapSelection {
  region: BodyPartId;
  intensity?: number;
  timestamp: number;
}

export interface BodyMapProps {
  selectedParts?: BodyPartId[];
  onRegionSelect?: (regionId: BodyPartId) => void;
  onViewChange?: (view: BodyRegion) => void;
  readOnly?: boolean;
  initialView?: BodyRegion;
}

export interface BodyMapSVGProps {
  onClick: (event: React.MouseEvent<SVGElement>) => void;
  svgRef: React.RefObject<SVGSVGElement>;
  viewBox: string;
  className?: string;
}

export const BODY_MAP_CONSTANTS = {
  colors: {
    UNSELECTED: 'rgba(200, 200, 200, 0.5)',
    SELECTED: 'rgba(255, 0, 0, 0.5)',
    HOVER: 'rgba(255, 0, 0, 0.3)',
    STROKE: '#c5c5c5'
  },
  dimensions: {
    CROP_FROM_TOP: 35,
    TOTAL_HEIGHT: 1478.5377,
    WIDTH: 503.20511
  }
} as const;


export function getBodyMapViewBox(): string {
    const { CROP_FROM_TOP, TOTAL_HEIGHT, WIDTH } = BODY_MAP_CONSTANTS.dimensions;
    return `0 ${TOTAL_HEIGHT * (CROP_FROM_TOP / 100)} ${WIDTH} ${TOTAL_HEIGHT * (1 - CROP_FROM_TOP / 100)}`;
  }


export { backBodyParts, frontBodyParts };