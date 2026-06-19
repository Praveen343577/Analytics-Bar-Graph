// src/components/AnalyticsBarGraph/types/graph.types.ts

import React from 'react';

export type GraphLayoutMode = 'grouped' | 'stacked';
export type GraphOverflowMode = 'auto' | 'scroll' | 'hidden' | 'visible' | 'fit' | 'compress';
export type GraphSelectionMode = 'single' | 'multiple';

export interface GraphSeriesData {
  /** Unique identifier for the specific data point */
  id: string;
  /** Key linking this data point to a specific metric series */
  seriesKey: string;
  /** Human-readable label for the series */
  label: string;
  /** The numeric value of the data point */
  value: number;
}

export interface GraphZoneData {
  /** Unique identifier for the zone (X-axis column) */
  id: string;
  /** Human-readable label for the zone */
  label: string;
  /** Optional flag to visually disable the zone and prevent interaction */
  disabled?: boolean;
  /** Optional icon to display next to the X-axis label */
  icon?: React.ReactNode;
  /** Array of data points belonging to this zone */
  series: GraphSeriesData[];
}

export interface GraphThreshold {
  /** Unique identifier for the threshold line */
  id: string;
  /** The numeric Y-axis value where the line should be drawn */
  value: number;
  /** Optional label text to display above the threshold line */
  label?: string;
  /** Visual prominence of the line */
  variant?: 'muted' | 'emphasis';
  /** Stroke style for the line */
  style?: 'dashed' | 'solid';
}

export interface AnalyticsBarGraphProps {
  /** The primary dataset to render */
  data: GraphZoneData[];
  /** Defines bar topology ('grouped' or 'stacked'). Default: 'grouped' */
  layout?: GraphLayoutMode;
  /** Defines responsive behavior when zones exceed container width. Default: 'auto' */
  overflow?: GraphOverflowMode;
  /** Defines how many zones can be selected at once. Default: 'multiple' */
  selectionMode?: GraphSelectionMode;
  /** Array of horizontal threshold markers to render across the graph */
  thresholds?: GraphThreshold[];
  /** Custom render function for the header content (e.g., titles, descriptions) */
  renderHeader?: () => React.ReactNode;
  /** Custom render function for the footer content (e.g., aggregations, summaries) */
  renderFooter?: (context: {
    selectedZones: GraphZoneData[];
    allZones: GraphZoneData[];
    hasSelection: boolean;
  }) => React.ReactNode;
  /** Optional CSS class to apply global theme overrides to the root container */
  themeClass?: string;
  /** Elements (like action buttons) to render on the right side of the Header */
  children?: React.ReactNode;
}