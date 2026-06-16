// src/components/AnalyticsBarGraph/features/GraphArea/Grid.tsx

import React, { memo } from 'react';

export interface GridProps {
  /**
   * Array of numeric values representing the Y-axis tick intervals.
   */
  ticks: number[];
  
  /**
   * The maximum value of the current Y-axis scale to calculate percentage offsets.
   */
  scaleMax: number;
}

const GridComponent: React.FC<GridProps> = ({ ticks, scaleMax }) => {
  // Prevent division by zero if dataset is empty or flat
  const safeScaleMax = scaleMax > 0 ? scaleMax : 1;

  return (
    <div 
      className="analytics-grid-layer"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1, // Positioned behind bars (z-index: 2) and interaction layer
      }}
    >
      {ticks.map((tick, index) => {
        const bottomPercent = (tick / safeScaleMax) * 100;
        const isBaseLine = tick === 0;
        
        return (
          <div
            key={`grid-line-${tick}-${index}`}
            className="analytics-grid-line"
            data-baseline={isBaseLine}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: `${bottomPercent}%`,
              borderBottomWidth: isBaseLine ? '2px' : 'var(--graph-grid-width, 1px)',
              borderBottomStyle: isBaseLine ? 'solid' : ('var(--graph-grid-style, dashed)' as React.CSSProperties['borderBottomStyle']),
              borderBottomColor: isBaseLine 
                ? 'var(--graph-grid-color-strong, var(--graph-text-secondary, #94a3b8))' 
                : 'var(--graph-grid-color, #e2e8f0)',
              transform: 'translateY(50%)', // Align exact center of the stroke to the percentage mark
            }}
          />
        );
      })}
    </div>
  );
};

// Memoize to prevent recalculations during hover/selection state changes
export const Grid = memo(GridComponent);