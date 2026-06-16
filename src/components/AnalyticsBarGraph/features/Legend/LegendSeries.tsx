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
      className="analytics-legend-series"
      data-series={seriesKey}
      data-hidden={isHidden}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      aria-pressed={!isHidden}
      aria-label={`Toggle visibility of ${label} series. Currently ${isHidden ? 'hidden' : 'visible'}.`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--graph-spacing-xs, 6px)',
        background: 'transparent',
        border: 'none',
        padding: '4px 8px',
        borderRadius: 'var(--graph-radius-sm, 4px)',
        cursor: 'pointer',
        opacity: isHidden ? 0.6 : 1,
        transition: 'opacity var(--graph-transition-fast, 0.15s) ease, transform var(--graph-transition-fast, 0.15s) ease',
        outline: 'none', // Focus is typically handled by a CSS class (e.g., .analytics-legend-series:focus-visible)
      }}
      title={`Toggle visibility for ${label}`}
    >
      {/* Visual Color Swatch */}
      <span
        className="analytics-legend-swatch"
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 'var(--graph-legend-swatch-size, 12px)',
          height: 'var(--graph-legend-swatch-size, 12px)',
          borderRadius: 'var(--graph-legend-swatch-radius, 3px)',
          backgroundColor: isHidden ? 'var(--graph-text-muted, #cbd5e1)' : color,
          transition: 'background-color var(--graph-transition-fast, 0.15s) ease',
        }}
      />
      
      {/* Series Label Name */}
      <span
        className="analytics-legend-label"
        style={{
          fontSize: 'var(--graph-typography-sm, 0.75rem)',
          fontWeight: 500,
          color: isHidden ? 'var(--graph-text-muted, #94a3b8)' : 'var(--graph-text-primary, #334155)',
          textDecoration: isHidden ? 'line-through' : 'none',
          transition: 'color var(--graph-transition-fast, 0.15s) ease',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </button>
  );
};

// Memoize to prevent unnecessary re-renders when other series are toggled
export const LegendSeries = memo(LegendSeriesComponent);