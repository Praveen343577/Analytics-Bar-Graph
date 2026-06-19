// src/components/AnalyticsBarGraph/features/Zones/ZoneInteractionLayer.tsx

import React, { memo, useCallback } from 'react';
import { useGraphSelection } from '../../context/GraphSelectionContext';
import type { GraphZoneData } from '../../types/graph.types';

export interface ZoneInteractionLayerProps {
  /**
   * The zone data object mapped to this interaction layer.
   */
  zone: GraphZoneData;
  
  /**
   * Indicates if the zone is currently hovered.
   */
  isHovered: boolean;
  
  /**
   * Indicates if the zone is currently selected.
   */
  isSelected: boolean;
}

const ZoneInteractionLayerComponent: React.FC<ZoneInteractionLayerProps> = ({
  zone,
  isHovered,
  isSelected
}) => {
  const { toggleZoneSelection, setHoveredZone } = useGraphSelection();
  const isDisabled = !!zone.disabled;

  const handleMouseEnter = useCallback(() => {
    if (!isDisabled) setHoveredZone(zone.id);
  }, [isDisabled, setHoveredZone, zone.id]);

  const handleMouseLeave = useCallback(() => {
    if (!isDisabled) setHoveredZone(null);
  }, [isDisabled, setHoveredZone]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!isDisabled) {
      // Support multi-select via Ctrl/Cmd key
      const isMultiSelect = e.ctrlKey || e.metaKey || e.shiftKey;
      toggleZoneSelection(zone.id, isMultiSelect);
    }
  }, [isDisabled, toggleZoneSelection, zone.id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isDisabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const isMultiSelect = e.ctrlKey || e.metaKey || e.shiftKey;
      toggleZoneSelection(zone.id, isMultiSelect);
    }
  }, [isDisabled, toggleZoneSelection, zone.id]);

  const handleFocus = useCallback(() => {
    if (!isDisabled) setHoveredZone(zone.id);
  }, [isDisabled, setHoveredZone, zone.id]);

  const handleBlur = useCallback(() => {
    if (!isDisabled) setHoveredZone(null);
  }, [isDisabled, setHoveredZone]);

  // Aggregate metrics for screen readers
  const ariaLabel = `${zone.label}. ${zone.series.map(s => `${s.label}: ${s.value}`).join(', ')}.`;

  return (
    <div
      className="analytics-zone-interaction-bg analytics-focus-target"
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      data-zone-id={zone.id}
      data-hovered={isHovered}
      data-selected={isSelected}
      data-disabled={isDisabled}
      style={{
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        pointerEvents: 'auto',
        zIndex: 10,
      }}
    >
      {isHovered && !isDisabled && (
        <div className="analytics-tooltip-container analytics-animate-tooltip-enter">
          <div className="analytics-bg-tooltip analytics-radius-tooltip analytics-shadow-tooltip"
            style={{
              padding: '8px 12px',
              whiteSpace: 'nowrap' as const,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>{zone.label}</div>
            {zone.series.map(s => (
              <div key={s.seriesKey} className="analytics-text-tooltip-label" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginTop: '4px' }}>
                <span>{s.label}</span>
                <span className="analytics-text-tooltip-value">{s.value}</span>
              </div>
            ))}
          </div>
          {/* Caret pointing down */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '100%', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              border: '6px solid transparent', 
              borderTopColor: 'var(--graph-tooltip-bg, #1e293b)' 
            }} 
          />
        </div>
      )}
    </div>
  );
};

// Memoize to ensure interaction layer only repaints when its specific interaction state changes
export const ZoneInteractionLayer = memo(ZoneInteractionLayerComponent, (prevProps, nextProps) => {
  return (
    prevProps.zone.id === nextProps.zone.id &&
    prevProps.isHovered === nextProps.isHovered &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.zone.disabled === nextProps.zone.disabled
  );
});