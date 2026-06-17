// src/components/AnalyticsBarGraph/features/Bars/Bar.tsx

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import type { GraphSeriesData } from '../../types/graph.types';

export interface BarProps {
  data: GraphSeriesData;
  maxValue: number;
  color: string;
  isHidden?: boolean;
  isDimmed?: boolean;
  isStacked?: boolean;
}

const BarComponent: React.FC<BarProps> = ({
  data,
  maxValue,
  color,
  isHidden = false,
  isDimmed = false,
  isStacked = false
}) => {
  // Prevent division by zero. If hidden, collapse to 0 height to animate out gracefully in stacked modes.
  const heightPercent = (maxValue > 0 && !isHidden) ? (data.value / maxValue) * 100 : 0;

  return (
    <motion.div
      className="analytics-bar-wrapper"
      data-series={data.seriesKey}
      data-hidden={isHidden}
      data-dimmed={isDimmed}
      data-stacked={isStacked}
      data-framer-component-type="bar" // Hooks into framer-motion-overrides.css hardware acceleration
      layout
      initial={{ height: '0%', opacity: 0 }}
      animate={{ 
        height: `${heightPercent}%`,
        opacity: isHidden ? 0 : (isDimmed ? 0.35 : 1),
      }}
      transition={{
        height: { type: 'spring', stiffness: 280, damping: 26, mass: 0.8 },
        opacity: { duration: 0.2, ease: 'easeInOut' }
      }}
      style={{
        '--bar-color': color,
        background: `linear-gradient(180deg, var(--bar-color) 0%, rgba(255,255,255,0.1) 100%)`,
        backgroundColor: 'var(--bar-color)', // Fallback
        pointerEvents: isHidden ? 'none' : 'auto',
        flex: isStacked ? 'none' : 1,
        width: '100%',
        borderRadius: isStacked ? '0' : '6px 6px 0 0',
        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)', // Premium inner glow
      } as React.CSSProperties}
      role="graphics-symbol"
      aria-label={`${data.label}: ${data.value}`}
      aria-hidden={isHidden}
    />
  );
};

// Memoize to prevent deep re-renders when unrelated zones trigger hover state updates
export const Bar = memo(BarComponent, (prevProps, nextProps) => {
  return (
    prevProps.data.value === nextProps.data.value &&
    prevProps.maxValue === nextProps.maxValue &&
    prevProps.isHidden === nextProps.isHidden &&
    prevProps.isDimmed === nextProps.isDimmed &&
    prevProps.isStacked === nextProps.isStacked &&
    prevProps.color === nextProps.color
  );
});