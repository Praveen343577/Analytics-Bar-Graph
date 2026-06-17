// src/App.tsx

import React, { useState, useEffect } from 'react';
import { AnalyticsBarGraph } from './components/AnalyticsBarGraph';
import { generateMockGraphData } from './data/websocket/payload-generators';
import { useStreamSimulator } from './data/websocket/stream-simulator';
import type { GraphLayoutMode, GraphThreshold } from './components/AnalyticsBarGraph';

// 1. Generate an initial baseline dataset representing months
const INITIAL_DATA = generateMockGraphData({
  zoneCount: 12,
  seriesNames: ['Earnings', 'Sales', 'Profit'],
  min: 10,
  max: 400,
  zonePrefix: 'Month',
});

// 2. Define business thresholds
const THRESHOLDS: GraphThreshold[] = [
  { id: 'warning', value: 200, label: 'Warning ($200)', variant: 'muted', style: 'dashed' },
  { id: 'critical', value: 350, label: 'Goal ($350)', variant: 'emphasis', style: 'solid' },
];

export const App: React.FC = () => {
  const [layout, setLayout] = useState<GraphLayoutMode>('grouped');
  
  // Hook into the realtime simulator to mock a WebSocket stream
  const { data, isConnected, start, stop, reset } = useStreamSimulator({
    initialData: INITIAL_DATA,
    mode: 'in-place',
    intervalMs: 1500,
    autoStart: true,
  });

  // FIXED: Side effects (DOM mutations) must happen inside useEffect, not useMemo
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.backgroundColor = '#f1f5f9'; // slate-100
    document.body.style.color = '#0f172a'; // slate-900
    document.body.style.fontFamily = 'Inter, system-ui, sans-serif';

    // Cleanup function to reset styles if the component unmounts
    return () => {
      document.body.style.margin = '';
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.body.style.fontFamily = '';
    };
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* --- Global Theme overrides for the Graph --- */}
      <style>{`
        .premium-light-graph {
          --graph-bg-base: #ffffff;
          --graph-bg-surface: #ffffff;
          --graph-text-primary: #1e293b;
          --graph-text-secondary: #64748b;
          --graph-border-color: #f1f5f9;
          --graph-grid-color: #f1f5f9;
          --graph-grid-color-strong: #e2e8f0;
          --graph-zone-hover-bg: rgba(0, 0, 0, 0.02);
          --graph-zone-selected-bg: rgba(0, 0, 0, 0.04);
          --graph-color-1: #3b82f6; /* Blue 500 */
          --graph-color-2: #bfdbfe; /* Blue 200 */
          --graph-color-3: #60a5fa; /* Blue 400 */
          --graph-radius-lg: 16px;
        }
      `}</style>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', fontWeight: 700 }}>Performance Overview</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>Live monitoring of monthly revenue and sales.</p>
      </div>

      {/* --- Main Dashboard Card --- */}
      <div 
        className="premium-light-graph"
        style={{
          backgroundColor: 'var(--graph-bg-base)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.08)',
        }}
      >
        <AnalyticsBarGraph
          data={data}
          layout={layout}
          overflow="visible"
          thresholds={THRESHOLDS}
          
          // Custom Header rendering
          renderHeader={() => (
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>$22,430.00</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ 
                  display: 'inline-block', 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: isConnected ? '#10b981' : '#ef4444' 
                }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--graph-text-secondary)' }}>
                  {isConnected ? 'Stream Active' : 'Stream Paused'}
                </span>
              </div>
            </div>
          )}

          // Custom Footer rendering
          renderFooter={({ selectedZones, hasSelection }) => {
            try {
              if (!hasSelection) {
                return (
                  <div style={{ color: 'var(--graph-text-secondary)', fontSize: '0.875rem', textAlign: 'center' }}>
                    Click or drag across regions to view aggregate metrics.
                  </div>
                );
              }

              // Aggregate values for the selected zones
              let earnTotal = 0;
              let salesTotal = 0;
              let profitTotal = 0;
              
              selectedZones.forEach(zone => {
                const earn = zone.series?.find(s => s.seriesKey === 'earnings')?.value || 0;
                const sales = zone.series?.find(s => s.seriesKey === 'sales')?.value || 0;
                const profit = zone.series?.find(s => s.seriesKey === 'profit')?.value || 0;
                earnTotal += earn;
                salesTotal += sales;
                profitTotal += profit;
              });

              const count = selectedZones.length || 1; // Prevent division by zero

              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.875rem' }}>
                    <strong>{selectedZones.length}</strong> months selected
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem' }}>
                    <span>Avg Earning: <strong>${Math.round(earnTotal / count)}</strong></span>
                    <span>Avg Sales: <strong>${Math.round(salesTotal / count)}</strong></span>
                    <span>Avg Profit: <strong>${Math.round(profitTotal / count)}</strong></span>
                  </div>
                </div>
              );
            } catch (err: any) {
              return <div style={{ color: 'red' }}>Error: {err.message}</div>;
            }
          }}
        >
          {/* Header Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setLayout(l => l === 'grouped' ? 'stacked' : 'grouped')}
              style={actionBtnStyle}
            >
              Toggle Layout ({layout})
            </button>
            <button
              onClick={isConnected ? stop : start}
              style={{ ...actionBtnStyle, backgroundColor: isConnected ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)' }}
            >
              {isConnected ? 'Pause Stream' : 'Resume Stream'}
            </button>
            {/* FIXED: Using the reset function to clear the linting warning */}
            <button
              onClick={reset}
              style={actionBtnStyle}
            >
              Reset Data
            </button>
          </div>
        </AnalyticsBarGraph>
      </div>

    </div>
  );
};

// Simple inline styles for header buttons
const actionBtnStyle: React.CSSProperties = {
  background: 'var(--graph-bg-surface, #ffffff)',
  border: '1px solid var(--graph-border-color, #e2e8f0)',
  borderRadius: '6px',
  padding: '6px 12px',
  fontSize: '0.75rem',
  fontWeight: 500,
  color: 'var(--graph-text-primary, #64748b)',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};