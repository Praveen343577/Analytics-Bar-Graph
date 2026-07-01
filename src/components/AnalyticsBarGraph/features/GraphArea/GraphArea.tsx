// src/components/AnalyticsBarGraph/features/GraphArea/GraphArea.tsx

import React, { memo, useMemo } from 'react';
import { YAxis } from './YAxis';
import { Grid } from './Grid';
import { ThresholdLayer } from './ThresholdLayer';
import { Zone } from '../Zones/Zone';
import { useGraphSelection } from '../../context/GraphSelectionContext';
import type { 
  GraphZoneData, 
  GraphLayoutMode, 
  GraphOverflowMode, 
  GraphThreshold 
} from '../../types/graph.types';

export interface GraphAreaProps {
  /**
   * The primary dataset to render.
   */
  data: GraphZoneData[];
  
  /**
   * Defines bar topology ('grouped' or 'stacked').
   */
  layout: GraphLayoutMode;
  
  /**
   * Defines responsive behavior when zones exceed container width.
   */
  overflow: GraphOverflowMode;
  
  /**
   * Horizontal markers rendered on a dedicated z-index layer.
   */
  thresholds?: GraphThreshold[];
  
  /**
   * Map of series keys to their resolved CSS colors.
   */
  seriesColorMap: Record<string, string>;
}

const GraphAreaComponent: React.FC<GraphAreaProps> = ({
  data,
  layout,
  overflow,
  thresholds = [],
  seriesColorMap,
}) => {
  const { hiddenSeriesKeys } = useGraphSelection();

  // 1. Calculate optimal Y-Axis scale and tick marks
  const { scaleMax, ticks } = useMemo(() => {
    let dataMax = 0;

    // Find the highest visible value in the dataset based on layout mode
    data.forEach(zone => {
      let zoneSum = 0;
      let zoneMax = 0;

      zone.series.forEach(s => {
        if (!hiddenSeriesKeys.includes(s.seriesKey)) {
          zoneSum += s.value;
          if (s.value > zoneMax) zoneMax = s.value;
        }
      });

      const effectiveValue = layout === 'stacked' ? zoneSum : zoneMax;
      if (effectiveValue > dataMax) dataMax = effectiveValue;
    });

    // Ensure thresholds are also accounted for so they don't render off-screen
    const thresholdMax = thresholds.reduce((max, t) => Math.max(max, t.value), 0);
    const rawMax = Math.max(dataMax, thresholdMax);

    // Fallback if there's absolutely no data > 0
    if (rawMax === 0) {
      return { scaleMax: 100, ticks: [0, 25, 50, 75, 100] };
    }

    // "Nice numbers" algorithm for tick generation
    const tickCount = 5;
    const unroundedTickSize = rawMax / (tickCount - 1);
    const magnitude = Math.pow(10, Math.floor(Math.log10(unroundedTickSize)));
    const normalizedTickSize = unroundedTickSize / magnitude;
    
    let niceTickSize;
    if (normalizedTickSize <= 1) niceTickSize = 1;
    else if (normalizedTickSize <= 2) niceTickSize = 2;
    else if (normalizedTickSize <= 5) niceTickSize = 5;
    else niceTickSize = 10;
    
    niceTickSize *= magnitude;

    const calculatedScaleMax = niceTickSize * (tickCount - 1);
    const calculatedTicks = Array.from({ length: tickCount }, (_, i) => i * niceTickSize);

    return { scaleMax: calculatedScaleMax, ticks: calculatedTicks };
  }, [data, layout, hiddenSeriesKeys, thresholds]);

  return (
    <div className="analytics-graph-area" data-layout={layout}>
      {/* Y-Axis Section */}
      <div 
        className="analytics-y-axis-wrapper"
        style={{
          width: 'var(--graph-y-axis-width, 48px)',
          flexShrink: 0,
          position: 'relative',
          // Offset bottom to align with the bottom of the bars, leaving room for X-axis labels below
          paddingBottom: 'var(--graph-axis-offset)', 
        }}
      >
        <YAxis ticks={ticks} scaleMax={scaleMax} />
      </div>

      {/* Main Plot Section */}
      <div className="analytics-graph-core">
        {/* Absolute Background Layers (drawn relative to the plot height, excluding X-axis area) */}
        <div 
          className="analytics-grid"
        >
          <Grid ticks={ticks} scaleMax={scaleMax} />
          <ThresholdLayer thresholds={thresholds} scaleMax={scaleMax} />
        </div>

        {/* Scrollable/Flexible Zone Container */}
        <div className="analytics-zones-container">
          {data.map((zone) => (
            <Zone
              key={zone.id}
              zone={zone}
              layout={layout}
              scaleMax={scaleMax}
              seriesColorMap={seriesColorMap}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const GraphArea = memo(GraphAreaComponent);