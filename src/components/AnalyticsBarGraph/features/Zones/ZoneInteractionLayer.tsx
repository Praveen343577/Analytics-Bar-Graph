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
      className="analytics-zone-interaction-layer"
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        zIndex: 10, // Must sit above bars to capture mouse events globally within the zone bounds
        borderRadius: 'var(--graph-radius-zone-background, 8px)',
        backgroundColor: isSelected 
          ? 'var(--graph-zone-selected-bg, rgba(15, 23, 42, 0.08))'
          : isHovered 
            ? 'var(--graph-zone-hover-bg, rgba(15, 23, 42, 0.04))'
            : 'transparent',
        transition: 'background-color var(--graph-transition-fast, 0.15s) ease',
        outline: 'none',
        // Manage focus ring via shadow to avoid altering layout dimensions
        boxShadow: isHovered && !isDisabled && document.activeElement === document.body // Pseudo-focus-visible heuristic or rely on CSS classes
          ? '0 0 0 var(--graph-focus-ring-width, 2px) var(--graph-zone-focus-ring, #3b82f6)'
          : 'none'
      }}
    >
      {isHovered && !isDisabled && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            backgroundColor: '#1e293b', // slate-800
            color: '#f8fafc',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 100,
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>{zone.label}</div>
          {zone.series.map(s => (
            <div key={s.seriesKey} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginTop: '4px' }}>
              <span style={{ color: '#94a3b8' }}>{s.label}</span>
              <span style={{ fontWeight: 500 }}>{s.value}</span>
            </div>
          ))}
          {/* Caret pointing down */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '100%', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              border: '6px solid transparent', 
              borderTopColor: '#1e293b' 
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