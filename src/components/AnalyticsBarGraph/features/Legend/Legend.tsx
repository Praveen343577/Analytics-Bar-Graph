// src/components/AnalyticsBarGraph/features/Legend/Legend.tsx

import React, { memo, useMemo } from 'react';
import { LegendSeries } from './LegendSeries';
import type { GraphZoneData } from '../../types/graph.types';

export interface LegendProps {
  /**
   * The complete dataset used to extract unique series for the legend.
   */
  data: GraphZoneData[];
  
  /**
   * Map of series keys to their resolved CSS colors to colorize the swatches.
   */
  seriesColorMap: Record<string, string>;
}

const LegendComponent: React.FC<LegendProps> = ({ data, seriesColorMap }) => {
  // Extract a strictly unique list of series metadata from the raw dataset.
  const uniqueSeries = useMemo(() => {
    const seriesMap = new Map<string, { key: string; label: string }>();
    
    data.forEach((zone) => {
      zone.series.forEach((s) => {
        if (!seriesMap.has(s.seriesKey)) {
          seriesMap.set(s.seriesKey, { key: s.seriesKey, label: s.label });
        }
      });
    });
    
    return Array.from(seriesMap.values());
  }, [data]);

  // If there's no data or only a single metric without comparison, the legend might be unnecessary,
  // but we render it if keys exist so users can still toggle the single series if desired.
  if (uniqueSeries.length === 0) return null;

  return (
    <div
      className="analytics-legend-container"
      role="group"
      aria-label="Graph Legend"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center', // Center aligned by default, can be overridden by CSS
        gap: 'var(--graph-spacing-md, 16px)',
        marginBottom: 'var(--graph-legend-margin-bottom, 16px)',
        width: '100%',
      }}
    >
      {uniqueSeries.map((series) => (
        <LegendSeries
          key={series.key}
          seriesKey={series.key}
          label={series.label}
          color={seriesColorMap[series.key] || 'var(--graph-text-muted, #cbd5e1)'}
        />
      ))}
    </div>
  );
};

// Memoize to prevent recalculations when interacting with the graph (e.g., hovering over zones)
export const Legend = memo(LegendComponent);