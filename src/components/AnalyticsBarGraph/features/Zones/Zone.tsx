// src/components/AnalyticsBarGraph/features/Zones/Zone.tsx

import React, { memo } from 'react';
import { useGraphSelection } from '../../context/GraphSelectionContext';
import { BarContainer } from '../Bars/BarContainer';
import { XAxisContent } from './XAxisContent';
import { ZoneInteractionLayer } from './ZoneInteractionLayer';
import type { GraphZoneData, GraphLayoutMode } from '../../types/graph.types';

export interface ZoneProps {
  /**
   * The data entity representing this specific zone (X-axis column).
   */
  zone: GraphZoneData;
  
  /**
   * Defines bar topology ('grouped' or 'stacked').
   */
  layout: GraphLayoutMode;
  
  /**
   * The maximum value of the vertical scale (used for bar height percentage calculations).
   */
  scaleMax: number;
  
  /**
   * Map of series keys to their resolved CSS colors.
   */
  seriesColorMap: Record<string, string>;
}

const ZoneComponent: React.FC<ZoneProps> = ({
  zone,
  layout,
  scaleMax,
  seriesColorMap
}) => {
  // Consume context to calculate visual states
  const { hoveredZoneId, selectedZoneIds } = useGraphSelection();

  const isHovered = hoveredZoneId === zone.id;
  const isSelected = selectedZoneIds.includes(zone.id);
  const hasSelection = selectedZoneIds.length > 0;

  // Visual dimming logic to highlight focused/selected zones
  const isDimmed =
    !!zone.disabled ||
    (hoveredZoneId !== null && !isHovered) ||
    (hasSelection && !isSelected && hoveredZoneId === null);

  return (
    <div
      className="analytics-zone"
      data-zone-id={zone.id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flex: '1 1 0', // Distribute available width equally among zones
        minWidth: 'var(--graph-zone-min-width, 48px)', // Prevent severe squishing on small screens
        position: 'relative',
      }}
    >
      {/* 
        Upper Area: The Plot Column 
        Contains the interaction overlay and the actual visual bars.
      */}
      <div
        className="analytics-zone-plot-area"
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          padding: '0 var(--graph-zone-padding, 4px)',
        }}
      >
        <ZoneInteractionLayer
          zone={zone}
          isHovered={isHovered}
          isSelected={isSelected}
        />
        
        {/* Wrapper to isolate z-index and disable pointer events so interaction layer catches clicks */}
        <div 
          style={{ 
            position: 'relative', 
            zIndex: 2, 
            width: '100%', 
            height: '100%', 
            pointerEvents: 'none' 
          }}
        >
          <BarContainer
            zone={zone}
            layout={layout}
            scaleMax={scaleMax}
            seriesColorMap={seriesColorMap}
          />
        </div>
      </div>

      {/* 
        Lower Area: The X-Axis Label 
        Contains labels, icons, and status indicators.
      */}
      <div
        className="analytics-zone-axis-area"
        style={{
          flexShrink: 0,
          height: 'var(--graph-x-axis-height, auto)',
          minHeight: '40px', // Reserve space to prevent layout shift
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <XAxisContent
          zone={zone}
          isHovered={isHovered}
          isSelected={isSelected}
          isDimmed={isDimmed}
        />
      </div>
    </div>
  );
};

export const Zone = memo(ZoneComponent);