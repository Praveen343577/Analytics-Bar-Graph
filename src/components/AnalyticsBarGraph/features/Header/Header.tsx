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
    <div className="analytics-header">
      {/* Left side: Custom Title / Branding / Subtitles */}
      <div className="analytics-header-titles">
        {renderHeader ? renderHeader() : null}
      </div>
      
      {/* Right side: Interactive Actions (Clear Selection, Export, Toggles) */}
      <div className="analytics-actions-group">
        {children}
      </div>
    </div>
  );
};

// Memoize to prevent re-rendering when deeply nested graph data updates
export const Header = memo(HeaderComponent);