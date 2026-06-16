// src/components/AnalyticsBarGraph/features/Footer/AggregationRenderer.tsx

import React, { memo, useMemo } from 'react';
import { useGraphSelection } from '../../context/GraphSelectionContext';
import type { GraphZoneData } from '../../types/graph.types';

export interface AggregationRendererProps {
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

const AggregationRendererComponent: React.FC<AggregationRendererProps> = ({
  data,
  renderFooter
}) => {
  const { selectedZoneIds } = useGraphSelection();

  // Compute the current context state for the footer render prop
  const footerContext = useMemo(() => {
    const hasSelection = selectedZoneIds.length > 0;
    
    // If there is an active selection, filter the data to only include selected zones.
    // Otherwise, return an empty array to represent "no specific selection".
    const selectedZones = hasSelection 
      ? data.filter(zone => selectedZoneIds.includes(zone.id))
      : [];

    return {
      selectedZones,
      allZones: data,
      hasSelection,
    };
  }, [data, selectedZoneIds]);

  // If the consumer did not provide a render function, bail out early.
  if (!renderFooter) return null;

  const content = renderFooter(footerContext);

  // If the render function returns null (e.g., conditionally hiding the footer), don't render the wrapper.
  if (!content) return null;

  return (
    <div 
      className="analytics-footer-aggregation"
      style={{
        marginTop: 'var(--graph-spacing-lg, 24px)',
        paddingTop: 'var(--graph-spacing-md, 16px)',
        borderTop: '1px solid var(--graph-border-color, #e2e8f0)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {content}
    </div>
  );
};

// Memoize to prevent re-renders when hovering over zones (only re-renders on selection changes or data updates)
export const AggregationRenderer = memo(AggregationRendererComponent);