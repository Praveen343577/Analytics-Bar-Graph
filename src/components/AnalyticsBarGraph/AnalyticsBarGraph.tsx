// src/components/AnalyticsBarGraph/AnalyticsBarGraph.tsx

import React, { useMemo } from 'react';
import { GraphSelectionProvider } from './context/GraphSelectionContext';
import { Header } from './features/Header/Header';
import { Legend } from './features/Legend/Legend';
import { GraphArea } from './features/GraphArea/GraphArea';
import { Footer } from './features/Footer/Footer';
import type { AnalyticsBarGraphProps } from './types/graph.types';

// Default accessible palette mapped to CSS variables for easy theme overriding
const DEFAULT_PALETTE = [
  'var(--graph-color-1, #3b82f6)', // Blue
  'var(--graph-color-2, #10b981)', // Emerald
  'var(--graph-color-3, #f59e0b)', // Amber
  'var(--graph-color-4, #8b5cf6)', // Violet
  'var(--graph-color-5, #ec4899)', // Pink
  'var(--graph-color-6, #06b6d4)', // Cyan
  'var(--graph-color-7, #ef4444)', // Red
  'var(--graph-color-8, #f97316)', // Orange
];

export const AnalyticsBarGraph: React.FC<AnalyticsBarGraphProps> = ({
  data,
  layout = 'grouped',
  overflow = 'auto',
  selectionMode = 'multiple', // Interaction layer handles native single/multi via Ctrl/Cmd keys
  thresholds = [],
  renderHeader,
  renderFooter,
  themeClass = '',
}) => {
  // Extract unique series keys and map them to a stable color palette
  const seriesColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    let colorIndex = 0;
    
    data.forEach((zone) => {
      zone.series.forEach((s) => {
        if (!map[s.seriesKey]) {
          map[s.seriesKey] = DEFAULT_PALETTE[colorIndex % DEFAULT_PALETTE.length];
          colorIndex++;
        }
      });
    });
    
    return map;
  }, [data]);

  // Graceful degradation for empty or invalid data
  if (!data || data.length === 0) {
    return (
      <div 
        className={`analytics-bar-graph-empty ${themeClass}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          color: 'var(--graph-text-muted, #94a3b8)',
          fontFamily: 'var(--graph-font-family, system-ui, sans-serif)',
          fontSize: 'var(--graph-typography-sm, 0.875rem)',
          background: 'var(--graph-bg-surface, #f8fafc)',
          borderRadius: 'var(--graph-radius-lg, 12px)',
          border: '1px dashed var(--graph-border-color, #cbd5e1)',
        }}
      >
        No dataset available
      </div>
    );
  }

  return (
    <GraphSelectionProvider>
      <div 
        className={`analytics-bar-graph-root ${themeClass}`}
        data-layout={layout}
        data-overflow={overflow}
        data-selection-mode={selectionMode}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          fontFamily: 'var(--graph-font-family, system-ui, sans-serif)',
          color: 'var(--graph-text-primary, #0f172a)',
          background: 'var(--graph-bg-base, transparent)',
          position: 'relative',
        }}
      >
        <Header renderHeader={renderHeader} />
        
        <Legend 
          data={data} 
          seriesColorMap={seriesColorMap} 
        />
        
        <GraphArea 
          data={data}
          layout={layout}
          overflow={overflow}
          thresholds={thresholds}
          seriesColorMap={seriesColorMap}
        />
        
        <Footer 
          data={data} 
          renderFooter={renderFooter} 
        />
      </div>
    </GraphSelectionProvider>
  );
};