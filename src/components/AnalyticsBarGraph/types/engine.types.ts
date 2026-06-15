// src/components/AnalyticsBarGraph/types/engine.types.ts

// --- Scaling Engine ---
export interface TickDescriptor {
  value: number;
  label: string;
  positionPercentage: number;
}

export interface ScaleCalculationOptions {
  maxValue: number;
  minTickCount?: number;
  maxTickCount?: number;
  forceZeroBoundary?: boolean;
}

export interface ScaleResult {
  dataMaximum: number;
  computedMaximum: number;
  scaleFactor: number;
  ticks: TickDescriptor[];
}

// --- Selection Engine ---
export type SelectionMode = 'none' | 'single' | 'multi' | 'range';

export interface SelectionEventParams {
  zoneId: string;
  isCtrlPressed: boolean;
  isShiftPressed: boolean;
  allZoneIds: string[]; // Required for range shift-click calculations
}

export interface SelectionEngineState {
  selectedZoneIds: Set<string>;
  lastInteractedZoneId: string | null;
  mode: SelectionMode;
}

// --- Realtime Engine ---
export type StreamConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface RealtimeEngineConfig {
  endpoint?: string;
  throttleMs: number; // Target max visual update frequency (e.g., 16ms for 60fps)
  maxBufferSize: number;
  autoConnect?: boolean;
}

export interface EngineStats {
  framesPerSecond: number;
  droppedPayloads: number;
  lastProcessedTimestamp: number;
}

export type PayloadNormalizer<TRaw, TStandardized> = (
  rawPayload: TRaw
) => TStandardized;