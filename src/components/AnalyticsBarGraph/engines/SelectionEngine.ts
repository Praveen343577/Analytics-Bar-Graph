// src/components/AnalyticsBarGraph/engines/SelectionEngine.ts

import type { SelectionEngineState, SelectionEventParams, SelectionMode } from '../types/engine.types';

export const createInitialSelectionState = (mode: SelectionMode = 'none'): SelectionEngineState => ({
  selectedZoneIds: new Set<string>(),
  lastInteractedZoneId: null,
  mode
});

export const computeNextSelectionState = (
  currentState: SelectionEngineState,
  params: SelectionEventParams
): SelectionEngineState => {
  const { mode, selectedZoneIds, lastInteractedZoneId } = currentState;
  const { zoneId, isCtrlPressed, isShiftPressed, allZoneIds } = params;

  if (mode === 'none') {
    return currentState;
  }

  const nextSet = new Set(selectedZoneIds);

  // Single Selection Mode (Strictly overrides modifiers)
  if (mode === 'single') {
    if (nextSet.has(zoneId) && nextSet.size === 1) {
      nextSet.clear();
      return { ...currentState, selectedZoneIds: nextSet, lastInteractedZoneId: null };
    }
    nextSet.clear();
    nextSet.add(zoneId);
    return { ...currentState, selectedZoneIds: nextSet, lastInteractedZoneId: zoneId };
  }

  // Range Selection (Shift + Click)
  if (isShiftPressed && (mode === 'multi' || mode === 'range') && lastInteractedZoneId) {
    const startIndex = allZoneIds.indexOf(lastInteractedZoneId);
    const endIndex = allZoneIds.indexOf(zoneId);

    if (startIndex !== -1 && endIndex !== -1) {
      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);

      // Standard desktop behavior: Shift-click replaces current selection with range
      nextSet.clear();
      for (let i = start; i <= end; i++) {
        nextSet.add(allZoneIds[i]);
      }
      
      // Anchor remains the last interacted zone prior to the shift-click
      return { ...currentState, selectedZoneIds: nextSet }; 
    }
  }

  // Multi Selection Toggle (Ctrl/Cmd + Click)
  if (isCtrlPressed && (mode === 'multi' || mode === 'range')) {
    if (nextSet.has(zoneId)) {
      nextSet.delete(zoneId);
    } else {
      nextSet.add(zoneId);
    }
    return { ...currentState, selectedZoneIds: nextSet, lastInteractedZoneId: zoneId };
  }

  // Default Click (No modifiers in multi/range mode)
  if (nextSet.has(zoneId) && nextSet.size === 1) {
    nextSet.clear();
    return { ...currentState, selectedZoneIds: nextSet, lastInteractedZoneId: null };
  }
  
  nextSet.clear();
  nextSet.add(zoneId);
  return { ...currentState, selectedZoneIds: nextSet, lastInteractedZoneId: zoneId };
};

export const clearSelection = (currentState: SelectionEngineState): SelectionEngineState => {
  if (currentState.selectedZoneIds.size === 0) return currentState;
  
  return {
    ...currentState,
    selectedZoneIds: new Set<string>(),
    lastInteractedZoneId: null
  };
};

export const selectAllZones = (
  currentState: SelectionEngineState,
  allZoneIds: string[]
): SelectionEngineState => {
  if (currentState.mode === 'none' || currentState.mode === 'single') return currentState;
  
  return {
    ...currentState,
    selectedZoneIds: new Set(allZoneIds),
    lastInteractedZoneId: currentState.lastInteractedZoneId
  };
};