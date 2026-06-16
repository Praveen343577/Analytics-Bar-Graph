// src/components/AnalyticsBarGraph/features/GraphArea/ThresholdLayer.tsx

import React, { memo } from 'react';
import type { GraphThreshold } from '../../types/graph.types';

export interface ThresholdLayerProps {
  /**
   * Array of threshold configurations to render.
   */
  thresholds?: GraphThreshold[];
  
  /**
   * Maximum numeric value of the current vertical scale to compute offsets.
   */
  scaleMax: number;
}

const ThresholdLayerComponent: React.FC<ThresholdLayerProps> = ({ 
  thresholds = [], 
  scaleMax 
}) => {
  if (thresholds.length === 0) return null;

  const safeScaleMax = scaleMax > 0 ? scaleMax : 1;

  return (
    <div className="analytics-threshold-layer" aria-hidden="true">
      {thresholds.map((threshold) => {
        const yPercentage = Math.max(0, Math.min((threshold.value / safeScaleMax) * 100, 100));
        
        // Resolve variant mappings to CSS color tokens
        let colorToken = 'var(--graph-threshold-solid, #ef4444)';
        if (threshold.variant === 'muted') {
          colorToken = 'var(--graph-text-muted, #94a3b8)';
        } else if (threshold.variant === 'emphasis') {
          colorToken = 'var(--graph-color-danger, #dc2626)';
        }

        return (
          <div
            key={threshold.id}
            className="analytics-threshold-wrapper"
            data-style={threshold.style || 'dashed'}
            style={{
              '--threshold-y-percentage': yPercentage,
              '--threshold-color': colorToken
            } as React.CSSProperties}
          >
            <div className="analytics-threshold-line" />
            
            {threshold.label && (
              <div className="analytics-threshold-badge">
                {threshold.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Memoized to prevent deep re-renders when hover states update elsewhere in the graph
export const ThresholdLayer = memo(ThresholdLayerComponent);