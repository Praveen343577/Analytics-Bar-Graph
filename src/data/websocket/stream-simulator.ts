// src/components/AnalyticsBarGraph/utils/stream-simulator.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { MockSocketClient, type SocketMode } from './mock-socket-client';
import { RealtimeGraphAdapter } from '../../components/AnalyticsBarGraph/engines/RealtimeAdapter';
import type { GraphZoneData } from '../../components/AnalyticsBarGraph/types/graph.types';
import type { RealtimeZoneUpdate } from '../../components/AnalyticsBarGraph/engines/RealtimeAdapter';

export interface UseStreamSimulatorOptions {
  /** The starting dataset to seed the graph */
  initialData?: GraphZoneData[];
  /** 
   * The streaming behavior: 
   * 'in-place' (mutates existing values) or 'rolling' (appends new zones/ticks) 
   */
  mode?: SocketMode;
  /** Frequency of updates in milliseconds. Default: 2000 */
  intervalMs?: number;
  /** Maximum number of zones to retain in 'rolling' mode. Default: 20 */
  maxVisibleZones?: number;
  /** Whether to start the stream immediately upon mounting. Default: true */
  autoStart?: boolean;
}

export interface StreamSimulatorResult {
  /** The current live dataset to pass directly to the AnalyticsBarGraph */
  data: GraphZoneData[];
  /** Indicates if the mock socket is currently active and receiving data */
  isConnected: boolean;
  /** Function to manually start/resume the stream */
  start: () => void;
  /** Function to manually stop/pause the stream */
  stop: () => void;
  /** Function to completely reset the data state back to initial values */
  reset: () => void;
}

/**
 * A React Hook that wraps the MockSocketClient and RealtimeGraphAdapter 
 * to provide a seamless, plug-and-play live data stream for the AnalyticsBarGraph.
 */
export function useStreamSimulator({
  initialData = [],
  mode = 'in-place',
  intervalMs = 2000,
  maxVisibleZones = 20,
  autoStart = true,
}: UseStreamSimulatorOptions = {}): StreamSimulatorResult {
  const [data, setData] = useState<GraphZoneData[]>(initialData);
  const [isConnected, setIsConnected] = useState(false);
  
  // Persist the socket instance across renders
  const clientRef = useRef<MockSocketClient | null>(null);

  // Initialize the socket client once
  useEffect(() => {
    const client = new MockSocketClient({
      mode,
      intervalMs,
      // In-place mode needs the base array to compute mutations against
      initialData: mode === 'in-place' ? initialData : undefined,
    });
    
    clientRef.current = client;

    // Event binding
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    // In-place handler: Applies value mutations to the current dataset
    const handleUpdate = (updates: RealtimeZoneUpdate[]) => {
      setData((prevData) => RealtimeGraphAdapter.applyUpdates(prevData, updates));
    };

    // Rolling handler: Appends a new tick and shifts the window
    const handleTick = (tickData: GraphZoneData) => {
      setData((prevData) => 
        RealtimeGraphAdapter.applyRollingTick(prevData, tickData, maxVisibleZones)
      );
    };

    client.on('connect', handleConnect);
    client.on('disconnect', handleDisconnect);
    client.on('update', handleUpdate);
    client.on('tick', handleTick);

    if (autoStart) {
      client.connect();
    }

    // Cleanup phase
    return () => {
      client.off('connect', handleConnect);
      client.off('disconnect', handleDisconnect);
      client.off('update', handleUpdate);
      client.off('tick', handleTick);
      client.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, intervalMs, maxVisibleZones]); // Exclude initialData to prevent unwanted stream restarts

  const start = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.connect();
    }
  }, []);

  const stop = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
    }
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    if (mode === 'in-place' && clientRef.current) {
      // Re-instantiate the client to reset its internal backend truth to initialData
      stop();
      clientRef.current = new MockSocketClient({
        mode,
        intervalMs,
        initialData,
      });
      // Re-bind listeners (ideally extracted to a separate function in a heavier class, 
      // but managed easily enough by just toggling start for this mock)
      start();
    }
  }, [initialData, mode, intervalMs, start, stop]);

  return {
    data,
    isConnected,
    start,
    stop,
    reset,
  };
}