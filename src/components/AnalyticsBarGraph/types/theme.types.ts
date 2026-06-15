// src/components/AnalyticsBarGraph/types/theme.types.ts

export interface GraphThemeColors {
  background: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  gridLine: string;
  zoneHoverBackground: string;
  zoneFocusRing: string;
  tooltipBackground: string;
  tooltipText: string;
  thresholdSolid: string;
  thresholdDashed: string;
  seriesPalette: string[];
}

export interface GraphThemeSpacing {
  graphPadding: string;
  zoneGap: string;
  barGap: string;
  axisOffset: string;
  headerMarginBottom: string;
  legendMarginBottom: string;
}

export interface GraphThemeRadius {
  barTop: string;
  barBottom: string;
  zoneBackground: string;
  tooltip: string;
  container: string;
}

export interface GraphThemeTypography {
  fontFamily: string;
  titleSize: string;
  titleWeight: string | number;
  subtitleSize: string;
  axisLabelSize: string;
  axisLabelWeight: string | number;
  tooltipTextSize: string;
}

export interface GraphThemeMotion {
  transitionDurationBase: string;
  transitionDurationFast: string;
  easingStandard: string;
  easingEntrance: string;
}

export interface GraphThemeShadows {
  tooltip: string;
  zoneHover: string;
  containerOuter: string;
}

export interface GraphThemeBorders {
  gridWidth: string;
  gridStyle: 'solid' | 'dashed' | 'dotted';
  focusRingWidth: string;
  focusRingStyle: string;
}

export interface GraphTheme {
  colors: GraphThemeColors;
  spacing: GraphThemeSpacing;
  radius: GraphThemeRadius;
  typography: GraphThemeTypography;
  motion: GraphThemeMotion;
  shadows: GraphThemeShadows;
  borders: GraphThemeBorders;
}

export type ThemeCSSVarKey = `--graph-${string}`;
export type ThemeTokenRecord = Record<ThemeCSSVarKey, string>;