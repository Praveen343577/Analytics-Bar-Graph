// src/components/AnalyticsBarGraph/context/GraphDataContext.tsx

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo } from 'react';
import type { ZoneData, SeriesMeta, ThresholdConfig, GraphDataState } from '../types/graph.types';

export type GraphDataContextType = GraphDataState;

export interface GraphDataProviderProps {
  children: React.ReactNode;
  zones: ZoneData[];
  series: SeriesMeta[];
  thresholds?: ThresholdConfig[];
  loading?: boolean;
  error?: string | null;
}

export const GraphDataContext = createContext<GraphDataContextType | undefined>(undefined);

export function GraphDataProvider({
  children,
  zones,
  series,
  thresholds = [],
  loading = false,
  error = null
}: GraphDataProviderProps) {
  const contextValue = useMemo<GraphDataContextType>(
    () => ({
      zones,
      series,
      thresholds,
      loading,
      error
    }),
    [zones, series, thresholds, loading, error]
  );

  return (
    <GraphDataContext.Provider value={contextValue}>
      {children}
    </GraphDataContext.Provider>
  );
}

export function useGraphData(): GraphDataContextType {
  const context = useContext(GraphDataContext);
  if (!context) {
    throw new Error('useGraphData must be used within a GraphDataProvider');
  }
  return context;
}