// src/components/AnalyticsBarGraph/utils/math.utils.ts

import type { ScaleCalculationOptions, ScaleResult, TickDescriptor } from '../types/engine.types';

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return clamp((value / total) * 100, 0, 100);
};

const getNiceNumber = (range: number, round: boolean): number => {
  const exponent = Math.floor(Math.log10(range));
  const fraction = range / Math.pow(10, exponent);
  let niceFraction: number;

  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
};

export const formatNumericAbbreviation = (value: number): string => {
  if (value === 0) return '0';
  const absValue = Math.abs(value);
  if (absValue >= 1e9) return `${(value / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
  if (absValue >= 1e6) return `${(value / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  if (absValue >= 1e3) return `${(value / 1e3).toFixed(1).replace(/\.0$/, '')}k`;
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
};

export const calculateScale = ({
  maxValue,
  minTickCount = 4,
  maxTickCount = 8,
  forceZeroBoundary = true
}: ScaleCalculationOptions): ScaleResult => {
  const safeMax = Math.max(maxValue, 0.0001); // Prevent division by zero logic collapse
  const targetTickCount = Math.floor((minTickCount + maxTickCount) / 2);
  
  const range = getNiceNumber(safeMax, false);
  const tickSpacing = getNiceNumber(range / (targetTickCount - 1), true);
  
  const niceMin = forceZeroBoundary ? 0 : Math.floor(0 / tickSpacing) * tickSpacing;
  const niceMax = Math.ceil(safeMax / tickSpacing) * tickSpacing;
  
  const ticks: TickDescriptor[] = [];
  
  // Add 0.0001 offset to prevent floating point inaccuracy drops at exact boundaries
  for (let value = niceMin; value <= niceMax + 0.0001 * tickSpacing; value += tickSpacing) {
    ticks.push({
      value,
      label: formatNumericAbbreviation(value),
      positionPercentage: clamp(((value - niceMin) / (niceMax - niceMin)) * 100, 0, 100)
    });
  }

  return {
    dataMaximum: maxValue,
    computedMaximum: niceMax,
    scaleFactor: niceMax > 0 ? 100 / niceMax : 0, 
    ticks: ticks.reverse() // Return descending for standard Y-Axis top-to-bottom DOM rendering
  };
};