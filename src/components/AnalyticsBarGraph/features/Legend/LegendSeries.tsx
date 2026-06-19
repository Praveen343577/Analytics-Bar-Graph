// src/components/AnalyticsBarGraph/features/Legend/LegendSeries.tsx

import React, { memo, useCallback } from 'react';
import { useGraphSelection } from '../../context/GraphSelectionContext';

export interface LegendSeriesProps {
  /**
   * The unique identifier for the series (maps to dataset).
   */
  seriesKey: string;
  
  /**
   * The human-readable display name for the series.
   */
  label: string;
  
  /**
   * The CSS color string assigned to this series.
   */
  color: string;
}

const LegendSeriesComponent: React.FC<LegendSeriesProps> = ({
  seriesKey,
  label,
  color
}) => {
  const { hiddenSeriesKeys, toggleSeriesVisibility } = useGraphSelection();

  const isHidden = hiddenSeriesKeys.includes(seriesKey);

  const handleToggle = useCallback(() => {
    toggleSeriesVisibility(seriesKey);
  }, [seriesKey, toggleSeriesVisibility]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Support keyboard accessibility for the custom toggle button
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSeriesVisibility(seriesKey);
    }
  }, [seriesKey, toggleSeriesVisibility]);

  return (
    <button
      type="button"
      className="analytics-legend-item"
      data-series={seriesKey}
      data-hidden={isHidden}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      aria-pressed={!isHidden}
      aria-label={`Toggle visibility of ${label} series. Currently ${isHidden ? 'hidden' : 'visible'}.`}
      title={`Toggle visibility for ${label}`}
    >
      {/* Visual Color Swatch */}
      <span
        className="analytics-legend-indicator"
        aria-hidden="true"
        style={{ '--series-color': color } as React.CSSProperties}
      />
      
      {/* Series Label Name */}
      <span className="analytics-legend-label">
        {label}
      </span>
    </button>
  );
};

// Memoize to prevent unnecessary re-renders when other series are toggled
export const LegendSeries = memo(LegendSeriesComponent);