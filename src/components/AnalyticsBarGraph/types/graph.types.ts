// src/components/AnalyticsBarGraph/types/graph.types.ts
import type { ReactNode } from 'react';
import type { SelectionMode } from './engine.types';

// --- Primary Data Entities ---

export interface GraphSeriesData {
  id: string;
  seriesKey: string; // Maps to Legend and Theme Palette
  label: string;
  value: number;
}

export interface GraphZoneData {
  id: string;
  label: string;
  icon?: ReactNode; // Rendered in X-Axis alongside or instead of label
  series: GraphSeriesData[];
  stats?: Record<string, string | number>; // Passed strictly to Footer aggregations
  disabled?: boolean; // Prevents selection/hover interactions
}

// --- Layout & Structural Entities ---

export type GraphLayoutMode = 'grouped' | 'stacked';
export type GraphOverflowMode = 'fit' | 'compress' | 'scroll' | 'auto';

export interface GraphThreshold {
  id: string;
  value: number;
  label?: string;
  style?: 'solid' | 'dashed' | 'dotted';
  variant?: 'default' | 'muted' | 'emphasis';
}

// --- Public Component API ---

export interface AnalyticsBarGraphProps {
  /** * The primary dataset. Graph computes layout strictly based on this structure.
   */
  data: GraphZoneData[];
  
  /** * Defines bar topology. Default: 'grouped'
   */
  layout?: GraphLayoutMode;
  
  /** * Defines responsive behavior when zones exceed container width. Default: 'auto'
   */
  overflow?: GraphOverflowMode;
  
  /** * Interaction configuration. Default: 'none'
   */
  selectionMode?: SelectionMode;
  
  /** * Horizontal markers rendered on a dedicated z-index layer.
   */
  thresholds?: GraphThreshold[];

  /**
   * Optional presentation-only header injection.
   */
  renderHeader?: () => ReactNode;

  /**
   * Data-driven footer injection.
   * Calculates aggregation based strictly on currently selected zones.
   */
  renderFooter?: (context: {
    selectedZones: GraphZoneData[];
    allZones: GraphZoneData[];
    hasSelection: boolean;
  }) => ReactNode;

  /**
   * CSS class injected at the root for theme scoping.
   */
  themeClass?: string;
}