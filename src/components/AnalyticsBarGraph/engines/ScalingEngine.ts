// src/components/AnalyticsBarGraph/engines/ScalingEngine.ts

import type { GraphZoneData, GraphLayoutMode, GraphThreshold } from '../types/graph.types';
import type { ScaleCalculationOptions, ScaleResult } from '../types/engine.types';
import { calculateScale } from '../utils/math.utils';
import { memoizeOne } from '../utils/memoization.utils';

export const computeDataMaximum = (
  data: GraphZoneData[],
  layout: GraphLayoutMode,
  thresholds?: GraphThreshold[]
): number => {
  let maxDataValue = 0;

  for (let i = 0; i < data.length; i++) {
    const zone = data[i];
    let zoneMax = 0;

    if (layout === 'stacked') {
      zoneMax = zone.series.reduce((sum, s) => sum + (s.value > 0 ? s.value : 0), 0);
    } else {
      for (let j = 0; j < zone.series.length; j++) {
        if (zone.series[j].value > zoneMax) {
          zoneMax = zone.series[j].value;
        }
      }
    }

    if (zoneMax > maxDataValue) {
      maxDataValue = zoneMax;
    }
  }

  if (thresholds && thresholds.length > 0) {
    for (let i = 0; i < thresholds.length; i++) {
      if (thresholds[i].value > maxDataValue) {
        maxDataValue = thresholds[i].value;
      }
    }
  }

  return maxDataValue;
};

export const generateGraphScale = (
  data: GraphZoneData[],
  layout: GraphLayoutMode,
  thresholds?: GraphThreshold[],
  options?: Partial<Omit<ScaleCalculationOptions, 'maxValue'>>
): ScaleResult => {
  const maxValue = computeDataMaximum(data, layout, thresholds);
  
  return calculateScale({
    maxValue,
    minTickCount: options?.minTickCount ?? 4,
    maxTickCount: options?.maxTickCount ?? 8,
    forceZeroBoundary: options?.forceZeroBoundary ?? true
  });
};

export const memoizedGenerateGraphScale = memoizeOne(generateGraphScale);