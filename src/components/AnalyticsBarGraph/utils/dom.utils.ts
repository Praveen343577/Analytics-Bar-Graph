// src/components/AnalyticsBarGraph/utils/dom.utils.ts

import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react';

/**
 * Merges conditional CSS class names.
 */
export const cx = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ').trim();
};

/**
 * Safely generates React style objects containing custom CSS variables.
 * Bypasses standard CSSProperties strict typing for dynamic theme tokens.
 */
export const injectCSSVars = (vars: Record<string, string | number>): CSSProperties => {
  return vars as unknown as CSSProperties;
};

/**
 * Generates deterministic DOM IDs for ARIA linkage (labelledby, describedby).
 */
export const generateAriaId = (context: string, entityId: string, suffix?: string): string => {
  return [context, entityId, suffix].filter(Boolean).join('-');
};

/**
 * Evaluates if a keyboard event constitutes a selection action.
 */
export const isSelectionKey = (e: ReactKeyboardEvent | KeyboardEvent): boolean => {
  return e.key === 'Enter' || e.key === ' ' || e.code === 'Space';
};

/**
 * Evaluates if a keyboard event constitutes standard structural navigation.
 */
export const isNavigationKey = (e: ReactKeyboardEvent | KeyboardEvent): boolean => {
  return [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
    'Tab'
  ].includes(e.key);
};

/**
 * Prevents default scroll behavior triggered by Spacebar on interactive elements.
 */
export const preventSpaceScroll = (e: ReactKeyboardEvent | KeyboardEvent): void => {
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
  }
};