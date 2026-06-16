// src/components/AnalyticsBarGraph/utils/mock-socket-client.ts

import { generateMockUpdates, generateMockRealtimeTick } from './payload-generators';
import { RealtimeGraphAdapter } from '../../components/AnalyticsBarGraph/engines/RealtimeAdapter';
import type { GraphZoneData } from '../../components/AnalyticsBarGraph/types/graph.types';
import type { RealtimeZoneUpdate } from '../../components/AnalyticsBarGraph/engines/RealtimeAdapter';

export type SocketMode = 'in-place' | 'rolling';

export interface MockSocketOptions {
  /** How often the mock server emits events (in milliseconds). Default: 2000 */
  intervalMs?: number;
  /** 
   * 'in-place': Emits `RealtimeZoneUpdate[]` to mutate existing bars.
   * 'rolling': Emits `GraphZoneData` ticks for a time-series stream. 
   */
  mode?: SocketMode;
  /** Required if mode is 'in-place' to establish the baseline backend state. */
  initialData?: GraphZoneData[];
}

// Type-safe event map
type SocketEventMap = {
  connect: () => void;
  disconnect: () => void;
  update: (updates: RealtimeZoneUpdate[]) => void;
  tick: (tickData: GraphZoneData) => void;
};

export class MockSocketClient {
  private intervalMs: number;
  private mode: SocketMode;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private listeners: { [K in keyof SocketEventMap]?: Array<SocketEventMap[K]> } = {};
  
  // Internal backend state for in-place mode
  private backendState: GraphZoneData[] = [];
  // Counter for rolling tick generation
  private tickCount: number = 0;

  constructor(options: MockSocketOptions = {}) {
    this.intervalMs = options.intervalMs || 2000;
    this.mode = options.mode || 'in-place';
    
    if (this.mode === 'in-place') {
      this.backendState = options.initialData ? JSON.parse(JSON.stringify(options.initialData)) : [];
    }
  }

  /**
   * Subscribe to a mock socket event.
   */
  public on<K extends keyof SocketEventMap>(event: K, listener: SocketEventMap[K]): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  /**
   * Remove a previously subscribed listener.
   */
  public off<K extends keyof SocketEventMap>(event: K, listener: SocketEventMap[K]): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(l => l !== listener) as any;
  }

  /**
   * Emits an event to all registered listeners.
   */
  private emit<K extends keyof SocketEventMap>(event: K, ...args: Parameters<SocketEventMap[K]>): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener => {
        // @ts-ignore - Spread arguments correctly match the function signature
        listener(...args);
      });
    }
  }

  /**
   * Opens the mock connection and begins emitting data at the specified interval.
   */
  public connect(): void {
    if (this.timerId) return; // Already connected

    // Simulate network delay before connecting
    setTimeout(() => {
      this.emit('connect');
      
      this.timerId = setInterval(() => {
        this.processTick();
      }, this.intervalMs);
    }, 500);
  }

  /**
   * Closes the connection and stops data emission.
   */
  public disconnect(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
      this.emit('disconnect');
    }
  }

  /**
   * Core loop: Generates the appropriate payload based on the mode and emits it.
   */
  private processTick(): void {
    if (this.mode === 'in-place') {
      if (this.backendState.length === 0) return;

      // 1. Generate localized updates based on the current backend truth
      const updates = generateMockUpdates(this.backendState, 0.6, 0.2); // 60% chance to mutate, up to 20% variance
      
      // 2. Apply updates to the internal backend state so the next tick builds upon it
      this.backendState = RealtimeGraphAdapter.applyUpdates(this.backendState, updates);
      
      // 3. Emit the deltas to the client
      if (updates.length > 0) {
        this.emit('update', updates);
      }
    } else if (this.mode === 'rolling') {
      this.tickCount++;
      
      // Generate a brand new zone payload representing the current point in time
      const newTick = generateMockRealtimeTick(this.tickCount, {
        seriesNames: ['Incoming Traffic', 'Outgoing Traffic'],
        min: 100,
        max: 5000,
        zonePrefix: 'T',
      });

      this.emit('tick', newTick);
    }
  }
}