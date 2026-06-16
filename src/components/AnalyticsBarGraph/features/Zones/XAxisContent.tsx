// src/components/AnalyticsBarGraph/features/Zones/XAxisContent.tsx

import React, { memo } from 'react';
import type { GraphZoneData } from '../../types/graph.types';

export interface XAxisContentProps {
  /**
   * The zone data object containing the label and optional icon.
   */
  zone: GraphZoneData;
  
  /**
   * Indicates if the zone is currently being hovered.
   */
  isHovered?: boolean;
  
  /**
   * Indicates if the zone is currently selected.
   */
  isSelected?: boolean;
  
  /**
   * Indicates if the zone should be visually muted (e.g., when another zone is hovered).
   */
  isDimmed?: boolean;
}

const XAxisContentComponent: React.FC<XAxisContentProps> = ({
  zone,
  isHovered = false,
  isSelected = false,
  isDimmed = false
}) => {
  return (
    <div
      className="analytics-x-axis-content"
      data-zone-id={zone.id}
      data-disabled={!!zone.disabled}
      data-hovered={isHovered}
      data-selected={isSelected}
      data-dimmed={isDimmed}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 'var(--graph-axis-gap, 4px)',
        marginTop: 'var(--graph-axis-offset, 8px)',
        opacity: isDimmed ? 0.4 : 1,
        transition: 'opacity var(--graph-transition-duration-base, 0.2s) ease',
        color: isSelected || isHovered
          ? 'var(--graph-text-primary, #0f172a)' 
          : 'var(--graph-text-secondary, #64748b)',
        fontWeight: isSelected ? 'var(--graph-axis-label-weight-selected, 600)' : 'var(--graph-axis-label-weight, 400)',
        fontSize: 'var(--graph-axis-label-size, 0.75rem)',
        fontFamily: 'var(--graph-font-family, inherit)',
        pointerEvents: 'none', // Prevents axis text from interfering with zone hover detection
      }}
      aria-hidden="true" // Hidden from screen readers to prevent duplication (the interaction layer handles a11y)
    >
      {zone.icon && (
        <div 
          className="analytics-x-axis-icon"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'inherit',
          }}
        >
          {zone.icon}
        </div>
      )}
      
      <span 
        className="analytics-x-axis-label"
        style={{
          textAlign: 'center',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '0 4px',
        }}
        title={zone.label} // Native tooltip for truncated labels
      >
        {zone.label}
      </span>
    </div>
  );
};

// Memoize to prevent re-renders unless visual state flags or zone data change
export const XAxisContent = memo(XAxisContentComponent, (prevProps, nextProps) => {
  return (
    prevProps.zone.id === nextProps.zone.id &&
    prevProps.zone.label === nextProps.zone.label &&
    prevProps.isHovered === nextProps.isHovered &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isDimmed === nextProps.isDimmed
  );
});