// src/components/AnalyticsBarGraph/features/Header/Header.tsx

import React, { memo } from 'react';

export interface HeaderProps {
  /**
   * Optional custom render function for the header content (e.g., title, subtitle, descriptions).
   */
  renderHeader?: () => React.ReactNode;
  
  /**
   * Optional children typically used to inject HeaderActions.
   */
  children?: React.ReactNode;
}

const HeaderComponent: React.FC<HeaderProps> = ({ renderHeader, children }) => {
  // If neither a custom header content nor actions are provided, collapse the header to save vertical space.
  if (!renderHeader && !children) return null;

  return (
    <div 
      className="analytics-graph-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--graph-header-margin-bottom, 16px)',
        minHeight: '32px', // Prevent layout jumps if content loads asynchronously
        width: '100%',
      }}
    >
      {/* Left side: Custom Title / Branding / Subtitles */}
      <div 
        className="analytics-header-content" 
        style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {renderHeader ? renderHeader() : null}
      </div>
      
      {/* Right side: Interactive Actions (Clear Selection, Export, Toggles) */}
      <div 
        className="analytics-header-actions-container" 
        style={{ 
          flexShrink: 0, 
          marginLeft: 'var(--graph-spacing-md, 16px)' 
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Memoize to prevent re-rendering when deeply nested graph data updates
export const Header = memo(HeaderComponent);