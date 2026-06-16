// src/components/AnalyticsBarGraph/adapters/RealtimeAdapter.ts

import type { GraphZoneData, GraphSeriesData } from '../types/graph.types';

export interface RealtimeSeriesUpdate {
  /** The unique key of the series to update */
  seriesKey: string;
  /** The new numeric value for this series point */
  value: number;
  /** Optional updated label for the series point */
  label?: string;
}

export interface RealtimeZoneUpdate {
  /** The ID of the zone to target */
  zoneId: string;
  /** Array of series mutations within this zone */
  seriesUpdates: RealtimeSeriesUpdate[];
  /** Optional updated label for the entire zone */
  label?: string;
}

export class RealtimeGraphAdapter {
  /**
   * In-Place Update Mode:
   * Updates specific series values within existing zones immutably.
   * Ideal for polling dashboards where the X-axis categories are fixed (e.g., server regions),
   * but the values (CPU, RAM) continuously fluctuate.
   *
   * @param currentData - The current state of the graph data
   * @param updates - Array of updates targeting specific zones and series
   * @returns A new array of GraphZoneData with the applied updates
   */
  static applyUpdates(
    currentData: GraphZoneData[],
    updates: RealtimeZoneUpdate[]
  ): GraphZoneData[] {
    if (!updates || updates.length === 0) return currentData;

    // Create a fast lookup map for the incoming zone updates
    const updateMap = new Map<string, RealtimeZoneUpdate>();
    for (const update of updates) {
      updateMap.set(update.zoneId, update);
    }

    return currentData.map((zone) => {
      const pendingUpdate = updateMap.get(zone.id);
      
      // If no updates target this zone, return it as-is (structural sharing)
      if (!pendingUpdate) return zone;

      // Create a fast lookup map for series updates within this zone
      const seriesUpdateMap = new Map<string, RealtimeSeriesUpdate>();
      for (const sUpdate of pendingUpdate.seriesUpdates) {
        seriesUpdateMap.set(sUpdate.seriesKey, sUpdate);
      }

      const nextSeries = zone.series.map((seriesPoint) => {
        const sUpdate = seriesUpdateMap.get(seriesPoint.seriesKey);
        if (!sUpdate) return seriesPoint;

        return {
          ...seriesPoint,
          value: sUpdate.value,
          label: sUpdate.label ?? seriesPoint.label,
        };
      });

      return {
        ...zone,
        label: pendingUpdate.label ?? zone.label,
        series: nextSeries,
      };
    });
  }

  /**
   * Rolling Window Mode:
   * Appends a new zone to the end of the dataset, shifting the oldest zone out
   * if the maximum limit is exceeded.
   * Ideal for time-series streams (WebSockets/SSE) where the X-axis represents time ticks.
   *
   * @param currentData - The current state of the graph data
   * @param newZone - The incoming zone data payload to append
   * @param maxVisibleZones - The maximum number of zones to retain in the viewport
   * @returns A new array of GraphZoneData maintaining the rolling window
   */
  static applyRollingTick(
    currentData: GraphZoneData[],
    newZone: GraphZoneData,
    maxVisibleZones: number = 20
  ): GraphZoneData[] {
    // Append the new tick to the end of the data array
    const appendedData = [...currentData, newZone];

    // Slice from the end to ensure we only keep up to `maxVisibleZones`
    if (appendedData.length > maxVisibleZones) {
      return appendedData.slice(appendedData.length - maxVisibleZones);
    }

    return appendedData;
  }

  /**
   * Normalization Helper:
   * Maps an arbitrary real-time key/value object into a valid GraphZoneData shape.
   * 
   * @param rawPayload - Arbitrary key-value pair object (e.g., { cpu: 45, ram: 80 })
   * @param zoneId - The unique ID for the generated zone
   * @param zoneLabel - The X-axis label for the generated zone
   * @returns A formatted GraphZoneData object
   */
  static normalizePayload(
    rawPayload: Record<string, number>,
    zoneId: string,
    zoneLabel: string
  ): GraphZoneData {
    const seriesPoints: GraphSeriesData[] = Object.entries(rawPayload).map(
      ([key, value]) => ({
        id: `${zoneId}-${key}`,
        seriesKey: key,
        label: key.charAt(0).toUpperCase() + key.slice(1), // Basic capitalization
        value,
      })
    );

    return {
      id: zoneId,
      label: zoneLabel,
      series: seriesPoints,
    };
  }
}