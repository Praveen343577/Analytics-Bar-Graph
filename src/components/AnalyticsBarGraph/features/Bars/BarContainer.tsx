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
    >
      {zone.series.map((seriesPoint) => {
        const isHidden = hiddenSeriesKeys.includes(seriesPoint.seriesKey);
        const color = seriesColorMap[seriesPoint.seriesKey] || 'var(--graph-text-muted, #888)';

        return (
          <Bar
            key={seriesPoint.id}
            data={seriesPoint}
            maxValue={scaleMax}
            color={color}
            isHidden={isHidden}
            isDimmed={isDimmed}
            isStacked={isStacked}
          />
        );
      })}
    </div>
  );
};