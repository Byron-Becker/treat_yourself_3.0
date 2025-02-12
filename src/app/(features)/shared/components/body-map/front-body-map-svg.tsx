import React from 'react';
import { FrontBody } from './paths-lower-body-front'

interface FrontBodyMapSVGProps {
  onClick?: (event: React.MouseEvent<SVGElement>) => void;  // Make onClick optional
  svgRef: React.RefObject<SVGSVGElement | null>;
  viewBox: string;
  className?: string;
}

export function FrontBodyMapSVG({ onClick, svgRef, viewBox, className }: FrontBodyMapSVGProps) {
  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
      onClick={onClick}  // TypeScript will now accept undefined
    >
      <FrontBody />
    </svg>
  )
}