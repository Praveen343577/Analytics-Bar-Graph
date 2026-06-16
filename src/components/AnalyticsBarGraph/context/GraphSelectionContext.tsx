// src/components/AnalyticsBarGraph/context/GraphSelectionContext.tsx

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface GraphSelectionContextType {
  selectedZoneIds: string[];
  hoveredZoneId: string | null;
  hiddenSeriesKeys: string[];
  toggleZoneSelection: (zoneId: string, multiSelect?: boolean) => void;
  setHoveredZone: (zoneId: string | null) => void;
  toggleSeriesVisibility: (seriesKey: string) => void;
  clearSelection: () => void;
}

export interface GraphSelectionProviderProps {
  children: React.ReactNode;
  initialSelectedZoneIds?: string[];
  initialHiddenSeriesKeys?: string[];
}

export const GraphSelectionContext = createContext<GraphSelectionContextType | undefined>(undefined);

export function GraphSelectionProvider({
  children,
  initialSelectedZoneIds = [],
  initialHiddenSeriesKeys = []
}: GraphSelectionProviderProps) {
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>(initialSelectedZoneIds);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [hiddenSeriesKeys, setHiddenSeriesKeys] = useState<string[]>(initialHiddenSeriesKeys);

  const toggleZoneSelection = useCallback((zoneId: string, multiSelect = false) => {
    setSelectedZoneIds(prev => {
      const isSelected = prev.includes(zoneId);
      if (multiSelect) {
        // Toggle in multi-select mode
        return isSelected ? prev.filter(id => id !== zoneId) : [...prev, zoneId];
      }
      // Exclusive selection mode: clicking the only selected item deselects it, otherwise select it
      return isSelected && prev.length === 1 ? [] : [zoneId];
    });
  }, []);

  const setHoveredZone = useCallback((zoneId: string | null) => {
    setHoveredZoneId(zoneId);
  }, []);

  const toggleSeriesVisibility = useCallback((seriesKey: string) => {
    setHiddenSeriesKeys(prev =>
      prev.includes(seriesKey)
        ? prev.filter(key => key !== seriesKey)
        : [...prev, seriesKey]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedZoneIds([]);
  }, []);

  const contextValue = useMemo<GraphSelectionContextType>(
    () => ({
      selectedZoneIds,
      hoveredZoneId,
      hiddenSeriesKeys,
      toggleZoneSelection,
      setHoveredZone,
      toggleSeriesVisibility,
      clearSelection
    }),
    [
      selectedZoneIds,
      hoveredZoneId,
      hiddenSeriesKeys,
      toggleZoneSelection,
      setHoveredZone,
      toggleSeriesVisibility,
      clearSelection
    ]
  );

  return (
    <GraphSelectionContext.Provider value={contextValue}>
      {children}
    </GraphSelectionContext.Provider>
  );
}

export function useGraphSelection(): GraphSelectionContextType {
  const context = useContext(GraphSelectionContext);
  if (!context) {
    throw new Error('useGraphSelection must be used within a GraphSelectionProvider');
  }
  return context;
}