// src/data/schema/socket-event.schema.ts

import type { ApiZoneData } from './api-response.schema';

export type SocketEventType = 'sync' | 'update' | 'heartbeat' | 'error';

export interface SocketSeriesUpdate {
  seriesKey: string;
  value: number;
}

export interface SocketZoneDelta {
  zoneId: string;
  timestamp: string;
  metrics: SocketSeriesUpdate[];
  metadata?: Record<string, string | number>;
}

export interface SocketSyncPayload {
  zones: ApiZoneData[];
  timestamp: string;
}

export interface SocketUpdatePayload {
  deltas: SocketZoneDelta[];
}

export interface SocketErrorPayload {
  code: string;
  message: string;
  fatal: boolean;
}

export interface SocketEvent<T extends SocketEventType> {
  type: T;
  payload: T extends 'sync'
    ? SocketSyncPayload
    : T extends 'update'
    ? SocketUpdatePayload
    : T extends 'error'
    ? SocketErrorPayload
    : null; // heartbeat has no payload
  meta: {
    eventId: string;
    dispatchedAt: string;
  };
}

export type SyncEvent = SocketEvent<'sync'>;
export type UpdateEvent = SocketEvent<'update'>;
export type ErrorEvent = SocketEvent<'error'>;
export type HeartbeatEvent = SocketEvent<'heartbeat'>;

export type AnySocketEvent = SyncEvent | UpdateEvent | ErrorEvent | HeartbeatEvent;