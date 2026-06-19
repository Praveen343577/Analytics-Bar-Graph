// src/components/AnalyticsBarGraph/features/Footer/Footer.tsx

import React, { memo } from 'react';
import { AggregationRenderer } from './AggregationRenderer';
import type { GraphZoneData } from '../../types/graph.types';

export interface FooterProps {
  /**
   * The complete dataset used to compute aggregations.
   */
  data: GraphZoneData[];
  
  /**
   * The render prop function provided by the user to inject footer content.
   */
  renderFooter?: (context: {
    selectedZones: GraphZoneData[];
    allZones: GraphZoneData[];
    hasSelection: boolean;
  }) => React.ReactNode;
}

const FooterComponent: React.FC<FooterProps> = ({ data, renderFooter }) => {
  // If no footer render function is provided, the entire footer area collapses.
  if (!renderFooter) return null;

  return (
    <footer className="analytics-graph-footer">
      <AggregationRenderer 
        data={data} 
        renderFooter={renderFooter} 
      />
    </footer>
  );
};

// Memoize to avoid unnecessary re-renders during interactions that don't affect footer data
export const Footer = memo(FooterComponent);