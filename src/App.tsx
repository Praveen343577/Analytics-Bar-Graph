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
          --graph-bg: #ffffff;
          --graph-text-primary: #1e293b;
          --graph-text-secondary: #64748b;
          --graph-text-muted: #94a3b8;
          --graph-grid-line: #f1f5f9;
          --graph-zone-hover-bg: rgba(0, 0, 0, 0.02);
          --graph-series-0: #3b82f6; /* Blue 500 */
          --graph-series-1: #bfdbfe; /* Blue 200 */
          --graph-series-2: #60a5fa; /* Blue 400 */
          --graph-radius-container: 16px;
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
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.08)',
          height: '520px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <AnalyticsBarGraph
          data={data}
          layout={layout}
          overflow="visible"
          thresholds={THRESHOLDS}
          themeClass="premium-light-graph"
          
          // Custom Header rendering
          renderHeader={() => (
            <div>
              <h2 className="analytics-header-title" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>$22,430.00</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ 
                  display: 'inline-block', 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: isConnected ? '#10b981' : '#ef4444' 
                }} />
                <span className="analytics-header-subtitle">
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
                  <div className="analytics-text-secondary" style={{ fontSize: '0.875rem', textAlign: 'center' }}>
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
          <div className="analytics-actions-group">
            <button
              className="analytics-action-button"
              onClick={() => setLayout(l => l === 'grouped' ? 'stacked' : 'grouped')}
            >
              Toggle Layout ({layout})
            </button>
            <button
              className="analytics-action-button"
              onClick={isConnected ? stop : start}
            >
              {isConnected ? 'Pause Stream' : 'Resume Stream'}
            </button>
            <button
              className="analytics-action-button"
              onClick={reset}
            >
              Reset Data
            </button>
          </div>
        </AnalyticsBarGraph>
      </div>

    </div>
  );
};