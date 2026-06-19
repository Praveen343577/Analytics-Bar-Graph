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
              bottom: `${bottomPercent}%`,
            }}
          />
        );
      })}
    </div>
  );
};

// Memoize to prevent recalculations during hover/selection state changes
export const Grid = memo(GridComponent);