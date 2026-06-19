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
    <div className="analytics-actions-group">
      {/* 
        Built-in Action: Clear Selection
        Automatically appears when the user has one or more zones selected.
      */}
      {hasSelection && (
        <button
          type="button"
          onClick={clearSelection}
          className="analytics-action-button analytics-clear-selection-btn"
          aria-label={`Clear ${selectedZoneIds.length} selected items`}
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