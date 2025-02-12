import React from 'react';
import { RearBody } from './paths-lower-body-rear'

interface BodyMapSVGProps {
  onClick: (event: React.MouseEvent<SVGElement>) => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
  viewBox: string;
  className?: string;
}

export function BodyMapSVG({ onClick, svgRef, viewBox, className }: BodyMapSVGProps) {
  return (<>   
    <svg
            ref={svgRef}
            version="1.0"
            viewBox={viewBox}
            className={className}
            onClick={onClick}
        >
           
                <RearBody />
            
        </svg>
    </>
    )
}