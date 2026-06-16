// src/components/AnalyticsBarGraph/utils/payload-generators.ts

import type { GraphZoneData, GraphSeriesData } from '../../components/AnalyticsBarGraph/types/graph.types';
import type { RealtimeZoneUpdate, RealtimeSeriesUpdate } from '../../components/AnalyticsBarGraph/engines/RealtimeAdapter';

export interface MockGraphOptions {
  /** Number of X-axis zones (columns) to generate. Default: 6 */
  zoneCount?: number;
  /** Array of series names to generate for each zone. Default: ['Series A', 'Series B'] */
  seriesNames?: string[];
  /** Minimum possible value for a series point. Default: 10 */
  min?: number;
  /** Maximum possible value for a series point. Default: 100 */
  max?: number;
  /** Prefix for generated zone labels. Default: 'Zone' */
  zonePrefix?: string;
  /** Allow simulating disabled zones. Default: false */
  includeDisabled?: boolean;
}

/**
 * Generates a complete, static dataset of GraphZoneData.
 * Ideal for initial renders, testing, or Storybook.
 */
export function generateMockGraphData(options: MockGraphOptions = {}): GraphZoneData[] {
  const {
    zoneCount = 6,
    seriesNames = ['Metric A', 'Metric B'],
    min = 10,
    max = 100,
    zonePrefix = 'Category',
    includeDisabled = false,
  } = options;

  return Array.from({ length: zoneCount }).map((_, zoneIndex) => {
    const zoneId = `z-${zoneIndex}`;
    const isDisabled = includeDisabled && Math.random() > 0.85;

    const series: GraphSeriesData[] = seriesNames.map((name, seriesIndex) => {
      const seriesKey = name.toLowerCase().replace(/\s+/g, '-');
      const value = Math.floor(Math.random() * (max - min + 1)) + min;

      return {
        id: `${zoneId}-s${seriesIndex}`,
        seriesKey,
        label: name,
        value: isDisabled ? 0 : value, // Disabled zones typically show zero or muted data
      };
    });

    return {
      id: zoneId,
      label: `${zonePrefix} ${zoneIndex + 1}`,
      disabled: isDisabled,
      series,
    };
  });
}

/**
 * Generates a single new tick (GraphZoneData) intended for rolling window updates.
 * Pairs with RealtimeGraphAdapter.applyRollingTick.
 */
export function generateMockRealtimeTick(
  tickIndex: number,
  options: Omit<MockGraphOptions, 'zoneCount' | 'includeDisabled'> = {}
): GraphZoneData {
  const {
    seriesNames = ['Metric A', 'Metric B'],
    min = 10,
    max = 100,
    zonePrefix = 'Tick',
  } = options;

  const zoneId = `tick-${Date.now()}-${tickIndex}`;

  const series: GraphSeriesData[] = seriesNames.map((name, seriesIndex) => {
    const seriesKey = name.toLowerCase().replace(/\s+/g, '-');
    const value = Math.floor(Math.random() * (max - min + 1)) + min;

    return {
      id: `${zoneId}-s${seriesIndex}`,
      seriesKey,
      label: name,
      value,
    };
  });

  return {
    id: zoneId,
    label: `${zonePrefix} ${tickIndex}`,
    series,
  };
}

/**
 * Generates a batch of targeted value mutations for existing data.
 * Pairs with RealtimeGraphAdapter.applyUpdates.
 * 
 * @param currentData - The current dataset to base updates on.
: * @param mutationRate - Probability (0.0 to 1.0) that a given series point will change.
 * @param variance - Maximum percentage change (0.0 to 1.0) from the current value.
 */
export function generateMockUpdates(
  currentData: GraphZoneData[],
  mutationRate: number = 0.5,
  variance: number = 0.15
): RealtimeZoneUpdate[] {
  const updates: RealtimeZoneUpdate[] = [];

  for (const zone of currentData) {
    if (zone.disabled) continue;

    const seriesUpdates: RealtimeSeriesUpdate[] = [];

    for (const point of zone.series) {
      if (Math.random() <= mutationRate) {
        // Calculate a random shift within the variance boundaries
        const shiftPercent = (Math.random() * 2 - 1) * variance; // Range: [-variance, +variance]
        let newValue = Math.round(point.value * (1 + shiftPercent));
        
        // Ensure values don't drop below 0
        newValue = Math.max(0, newValue);

        seriesUpdates.push({
          seriesKey: point.seriesKey,
          value: newValue,
        });
      }
    }

    if (seriesUpdates.length > 0) {
      updates.push({
        zoneId: zone.id,
        seriesUpdates,
      });
    }
  }

  return updates;
}