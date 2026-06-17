// src/components/AnalyticsBarGraph/features/Bars/BarContainer.tsx

import React from 'react';
import { Bar } from './Bar';
import type { GraphZoneData, GraphLayoutMode } from '../../types/graph.types';
import { useGraphSelection } from '../../context/GraphSelectionContext';

export interface BarContainerProps {
  zone: GraphZoneData;
  layout: GraphLayoutMode;
  scaleMax: number;
  seriesColorMap: Record<string, string>;
}

export const BarContainer: React.FC<BarContainerProps> = ({
  zone,
  layout,
  scaleMax,
  seriesColorMap
}) => {
  const { hiddenSeriesKeys, hoveredZoneId, selectedZoneIds } = useGraphSelection();

  // Determine global visual interaction states
  const isStacked = layout === 'stacked';
  const isHovered = hoveredZoneId === zone.id;
  const isSelected = selectedZoneIds.includes(zone.id);
  const hasSelection = selectedZoneIds.length > 0;

  // Dimming Rules Engine:
  // 1. Permanently dimmed if disabled
  // 2. Dimmed if another zone is actively being hovered
  // 3. Dimmed if a selection exists elsewhere and nothing is currently being hovered
  const isDimmed =
    zone.disabled ||
    (hoveredZoneId !== null && !isHovered) ||
    (hasSelection && !isSelected && hoveredZoneId === null);

  return (
    <div
      className="analytics-bars-container"
      data-layout={layout}
      data-zone-id={zone.id}
      data-disabled={!!zone.disabled}
      data-dimmed={isDimmed}
      style={{
        display: 'flex',
        flexDirection: isStacked ? 'column-reverse' : 'row',
        alignItems: isStacked ? 'stretch' : 'flex-end',
        justifyContent: 'flex-start',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        padding: '0 20%', // Keeps bars contained and well-spaced within the zone
        gap: isStacked ? '0' : 'var(--graph-bar-gap, 8px)',
      }}
    >
      {zone.series.map((seriesPoint) => {
        const isHidden = hiddenSeriesKeys.includes(seriesPoint.seriesKey);
        const color = seriesColorMap[seriesPoint.seriesKey] || 'var(--graph-text-muted, #888)';

        return (
          <div
            key={seriesPoint.id}
            style={{
              flex: isStacked ? 'none' : 1,
              width: '100%',
              height: isStacked ? 'auto' : '100%',
              position: 'relative',
              borderRadius: isStacked ? '0' : '6px 6px 0 0',
              backgroundColor: isStacked ? 'transparent' : 'var(--graph-grid-color, #f1f5f9)',
              backgroundImage: isStacked ? 'none' : 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.02) 4px, rgba(0,0,0,0.02) 8px)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <Bar
              data={seriesPoint}
              maxValue={scaleMax}
              color={color}
              isHidden={isHidden}
              isDimmed={isDimmed}
              isStacked={isStacked}
            />
          </div>
        );
      })}
    </div>
  );
};