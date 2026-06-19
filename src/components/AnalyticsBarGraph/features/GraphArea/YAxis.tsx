// src/components/AnalyticsBarGraph/features/GraphArea/YAxis.tsx

import React, { memo, useMemo } from 'react';

export interface YAxisProps {
  /**
   * Array of numeric values representing the Y-axis tick intervals.
   */
  ticks: number[];
  
  /**
   * The maximum value of the current Y-axis scale to calculate percentage offsets.
   */
  scaleMax: number;
}

const YAxisComponent: React.FC<YAxisProps> = ({ ticks, scaleMax }) => {
  const safeScaleMax = scaleMax > 0 ? scaleMax : 1;

  // Formatter for large numbers (e.g., 1000 -> 1K)
  const formatter = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    });
  }, []);

  return (
    <div 
      className="analytics-y-axis"
      aria-hidden="true" // Usually hidden from screen readers if a data table is provided as an alternative
    >
      {ticks.map((tick, index) => {
        const bottomPercent = (tick / safeScaleMax) * 100;
        
        return (
          <div
            key={`y-axis-tick-${tick}-${index}`}
            className="analytics-y-axis-tick"
            style={{
              position: 'absolute',
              bottom: `${bottomPercent}%`,
              transform: 'translateY(50%)', // Vertically center the text on the exact percentage line
            }}
          >
            {formatter.format(tick)}
          </div>
        );
      })}
    </div>
  );
};

// Memoize to avoid layout thrashing during graph interactions
export const YAxis = memo(YAxisComponent);