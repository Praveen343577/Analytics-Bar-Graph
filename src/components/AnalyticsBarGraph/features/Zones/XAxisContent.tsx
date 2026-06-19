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
      aria-hidden="true" // Hidden from screen readers to prevent duplication (the interaction layer handles a11y)
    >
      {zone.icon && (
        <div className="analytics-x-axis-icon">
          {zone.icon}
        </div>
      )}
      
      <span 
        className="analytics-x-axis-label analytics-text-axis-label"
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