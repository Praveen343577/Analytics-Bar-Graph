// src/components/AnalyticsBarGraph/features/Header/HeaderActions.tsx

import React, { memo } from 'react';
import { useGraphSelection } from '../../context/GraphSelectionContext';

export interface HeaderActionsProps {
  /**
   * Optional custom action elements (e.g., export buttons, layout toggles) 
   * to be rendered alongside the built-in graph actions.
   */
  children?: React.ReactNode;
}

const HeaderActionsComponent: React.FC<HeaderActionsProps> = ({ children }) => {
  const { selectedZoneIds, clearSelection } = useGraphSelection();
  
  const hasSelection = selectedZoneIds.length > 0;

  return (
    <div
      className="analytics-header-actions"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 'var(--graph-spacing-sm, 8px)',
      }}
    >
      {/* 
        Built-in Action: Clear Selection
        Automatically appears when the user has one or more zones selected.
      */}
      {hasSelection && (
        <button
          type="button"
          onClick={clearSelection}
          className="analytics-action-btn analytics-clear-selection-btn"
          aria-label={`Clear ${selectedZoneIds.length} selected items`}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--graph-bg-surface, #ffffff)',
            border: '1px solid var(--graph-border-color, #e2e8f0)',
            borderRadius: 'var(--graph-radius-button, 6px)',
            padding: '6px 12px',
            fontSize: 'var(--graph-typography-sm, 0.75rem)',
            fontWeight: 500,
            color: 'var(--graph-text-secondary, #64748b)',
            cursor: 'pointer',
            transition: 'all var(--graph-transition-fast, 0.15s) ease',
            boxShadow: 'var(--graph-shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
          }}
        >
          Clear Selection ({selectedZoneIds.length})
        </button>
      )}

      {/* Render any external custom actions passed from the root component */}
      {children}
    </div>
  );
};

// Memoized to prevent re-renders unless the selection state or children change
export const HeaderActions = memo(HeaderActionsComponent);