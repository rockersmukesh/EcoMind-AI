/**
 * Custom hook for theme management
 * Handles theme state, persistence, and DOM updates
 */

import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS, THEME, DEFAULT_VALUES } from "@/lib/config";

type ThemeMode = "dark" | "light";

interface UseThemeReturn {
  theme: ThemeMode;
  toggleTheme: () => void;
  isLoading: boolean;
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_VALUES.THEME);
  const [isLoading, setIsLoading] = useState(true);

  const applyTheme = useCallback((newTheme: ThemeMode) => {
    if (newTheme === THEME.LIGHT) {
      document.documentElement.classList.add(DEFAULT_VALUES.THEME_CLASS_NAME);
    } else {
      document.documentElement.classList.remove(DEFAULT_VALUES.THEME_CLASS_NAME);
    }
  }, []);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode | null;
    const initialTheme = savedTheme === THEME.LIGHT ? THEME.LIGHT : THEME.DARK;

    const timer = setTimeout(() => {
      setThemeState(initialTheme);
      applyTheme(initialTheme);
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => {
      const newTheme = prevTheme === THEME.DARK ? THEME.LIGHT : THEME.DARK;
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
      applyTheme(newTheme);
      return newTheme;
    });
  }, [applyTheme]);

  return { theme, toggleTheme, isLoading };
}
