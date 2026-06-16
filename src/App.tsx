// src/App.tsx

import React, { useState, useEffect } from 'react';
import { AnalyticsBarGraph } from './components/AnalyticsBarGraph';
import { generateMockGraphData } from './data/websocket/payload-generators';
import { useStreamSimulator } from './data/websocket/stream-simulator';
import type { GraphLayoutMode, GraphThreshold } from './components/AnalyticsBarGraph';

// 1. Generate an initial baseline dataset representing server regions
const INITIAL_DATA = generateMockGraphData({
  zoneCount: 8,
  seriesNames: ['CPU Usage', 'Memory Allocation'],
  min: 10,
  max: 85,
  zonePrefix: 'Region',
});

// 2. Define business thresholds
const THRESHOLDS: GraphThreshold[] = [
  { id: 'warning', value: 75, label: 'Warning (75%)', variant: 'muted', style: 'dashed' },
  { id: 'critical', value: 90, label: 'Critical (90%)', variant: 'emphasis', style: 'solid' },
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
    document.body.style.backgroundColor = '#0f172a'; // slate-900
    document.body.style.color = '#f8fafc'; // slate-50
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
        .dark-theme-graph {
          --graph-bg-base: #1e293b;
          --graph-bg-surface: #0f172a;
          --graph-text-primary: #f8fafc;
          --graph-text-secondary: #94a3b8;
          --graph-border-color: #334155;
          --graph-grid-color: #334155;
          --graph-grid-color-strong: #475569;
          --graph-zone-hover-bg: rgba(255, 255, 255, 0.05);
          --graph-zone-selected-bg: rgba(255, 255, 255, 0.1);
          --graph-color-1: #38bdf8; /* Sky 400 */
          --graph-color-2: #34d399; /* Emerald 400 */
        }
      `}</style>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>Infrastructure Telemetry</h1>
        <p style={{ color: '#94a3b8', margin: 0 }}>Live monitoring of multi-region cluster allocation.</p>
      </div>

      {/* --- Main Dashboard Card --- */}
      <div 
        className="dark-theme-graph"
        style={{
          backgroundColor: 'var(--graph-bg-base)',
          border: '1px solid var(--graph-border-color)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        }}
      >
        <AnalyticsBarGraph
          data={data}
          layout={layout}
          overflow="auto"
          thresholds={THRESHOLDS}
          
          // Custom Header rendering
          renderHeader={() => (
            <div>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Compute Allocation</h2>
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
            if (!hasSelection) {
              return (
                <div style={{ color: 'var(--graph-text-secondary)', fontSize: '0.875rem', textAlign: 'center' }}>
                  Click or drag across regions to view aggregate metrics.
                </div>
              );
            }

            // Aggregate values for the selected zones
            let cpuTotal = 0;
            let memTotal = 0;
            
            selectedZones.forEach(zone => {
              const cpu = zone.series.find(s => s.seriesKey === 'cpu-usage')?.value || 0;
              const mem = zone.series.find(s => s.seriesKey === 'memory-allocation')?.value || 0;
              cpuTotal += cpu;
              memTotal += mem;
            });

            return (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.875rem' }}>
                  <strong>{selectedZones.length}</strong> regions selected
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem' }}>
                  <span>Avg CPU: <strong>{Math.round(cpuTotal / selectedZones.length)}%</strong></span>
                  <span>Avg Mem: <strong>{Math.round(memTotal / selectedZones.length)}%</strong></span>
                </div>
              </div>
            );
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