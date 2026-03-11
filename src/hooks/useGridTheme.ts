import { useState, useCallback, useMemo } from 'react';
import type { GridTheme } from '../types';

interface UseGridThemeOptions {
  theme?: GridTheme;
  onThemeChange?: (theme: GridTheme) => void;
}

function deepMerge(target: GridTheme, source: Partial<GridTheme>): GridTheme {
  const result = { ...target };
  if (source.grid) {
    result.grid = { ...target.grid, ...source.grid };
  }
  if (source.tokens) {
    result.tokens = { ...target.tokens, ...source.tokens };
  }
  if (source.statusColors) {
    result.statusColors = { ...target.statusColors, ...source.statusColors };
  }
  return result;
}

export function useGridTheme({ theme, onThemeChange }: UseGridThemeOptions) {
  const isControlled = theme !== undefined;
  const [internal, setInternal] = useState<GridTheme>({});

  const currentTheme = isControlled ? theme : internal;

  const updateTheme = useCallback(
    (partial: Partial<GridTheme>) => {
      if (isControlled) {
        onThemeChange?.(deepMerge(theme!, partial));
      } else {
        setInternal((prev) => deepMerge(prev, partial));
      }
    },
    [isControlled, theme, onThemeChange],
  );

  const setStatusColor = useCallback(
    (label: string, bg: string, color: string) => {
      const current = isControlled ? theme! : internal;
      updateTheme({
        statusColors: {
          ...current.statusColors,
          [label]: { bg, color },
        },
      });
    },
    [isControlled, theme, internal, updateTheme],
  );

  const removeStatusColor = useCallback(
    (label: string) => {
      const current = isControlled ? theme! : internal;
      const next = { ...current.statusColors };
      delete next[label];
      if (isControlled) {
        onThemeChange?.({ ...theme!, statusColors: next });
      } else {
        setInternal((prev) => ({ ...prev, statusColors: next }));
      }
    },
    [isControlled, theme, internal, onThemeChange],
  );

  const tokenOverrides = useMemo(() => {
    const t = currentTheme.tokens;
    if (!t) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tokens: Record<string, any> = {};
    if (t.colorPrimary) tokens.colorPrimary = t.colorPrimary;
    if (t.fontSize) tokens.fontSize = t.fontSize;
    if (t.borderRadius) tokens.borderRadius = t.borderRadius;
    if (t.fontFamily) tokens.fontFamily = t.fontFamily;
    return Object.keys(tokens).length > 0 ? tokens : undefined;
  }, [currentTheme.tokens]);

  return {
    currentTheme,
    updateTheme,
    setStatusColor,
    removeStatusColor,
    tokenOverrides,
  };
}
