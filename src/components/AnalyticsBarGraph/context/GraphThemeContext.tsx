// src/components/AnalyticsBarGraph/context/GraphThemeContext.tsx

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import type { GraphThemeMode, GraphThemeContextType, GraphThemeProviderProps } from '../types/theme.types';

export const GraphThemeContext = createContext<GraphThemeContextType | undefined>(undefined);

export function GraphThemeProvider({
  children,
  defaultTheme = 'light',
  theme: controlledTheme,
  onChange
}: GraphThemeProviderProps) {
  const [internalTheme, setInternalTheme] = useState<GraphThemeMode>(defaultTheme);
  
  const isControlled = controlledTheme !== undefined;
  const currentTheme = isControlled ? controlledTheme : internalTheme;

  const setTheme = (theme: GraphThemeMode) => {
    if (!isControlled) {
      setInternalTheme(theme);
    }
    if (onChange) {
      onChange(theme);
    }
  };

  return (
    <GraphThemeContext.Provider value={{ theme: currentTheme, setTheme }}>
      {children}
    </GraphThemeContext.Provider>
  );
}

export const useGraphTheme = (): GraphThemeContextType => {
  const context = useContext(GraphThemeContext);
  if (!context) {
    throw new Error('useGraphTheme must be used within a GraphThemeProvider');
  }
  return context;
};