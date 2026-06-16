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
    if (normalizedTickSize < 1.5) niceTickSize = 1;
    else if (normalizedTickSize < 3) niceTickSize = 2;
    else if (normalizedTickSize < 7) niceTickSize = 5;
    else niceTickSize = 10;
    
    niceTickSize *= magnitude;

    const calculatedScaleMax = niceTickSize * (tickCount - 1);
    const calculatedTicks = Array.from({ length: tickCount }, (_, i) => i * niceTickSize);

    return { scaleMax: calculatedScaleMax, ticks: calculatedTicks };
  }, [data, layout, hiddenSeriesKeys, thresholds]);

  // 2. Determine container styles based on overflow mode
  const overflowStyles = useMemo<React.CSSProperties>(() => {
    const isScrollable = overflow === 'scroll' || overflow === 'auto';
    return {
      overflowX: isScrollable ? 'auto' : 'hidden',
      overflowY: 'hidden',
      // Enable smooth scrolling and hide scrollbar in some browsers while retaining functionality
      scrollbarWidth: isScrollable ? 'thin' : 'none',
    };
  }, [overflow]);

  return (
    <div 
      className="analytics-graph-area"
      style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        position: 'relative',
        minHeight: 'var(--graph-min-height, 250px)',
      }}
    >
      {/* Y-Axis Section */}
      <div 
        className="analytics-y-axis-wrapper"
        style={{
          width: 'var(--graph-y-axis-width, 48px)',
          flexShrink: 0,
          position: 'relative',
          // Offset bottom to align with the bottom of the bars, leaving room for X-axis labels below
          paddingBottom: 'var(--graph-x-axis-height, 40px)', 
        }}
      >
        <YAxis ticks={ticks} scaleMax={scaleMax} />
      </div>

      {/* Main Plot Section */}
      <div 
        className="analytics-plot-wrapper"
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0, // Prevents flex child from blowing out parent width
        }}
      >
        {/* Absolute Background Layers (drawn relative to the plot height, excluding X-axis area) */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 'var(--graph-x-axis-height, 40px)',
            pointerEvents: 'none',
          }}
        >
          <Grid ticks={ticks} scaleMax={scaleMax} />
          <ThresholdLayer thresholds={thresholds} scaleMax={scaleMax} />
        </div>

        {/* Scrollable/Flexible Zone Container */}
        <div
          className="analytics-zones-container"
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            ...overflowStyles,
          }}
        >
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