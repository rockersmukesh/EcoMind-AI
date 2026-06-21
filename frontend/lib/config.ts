/**
 * Application Configuration Constants
 * Centralized configuration for magic strings, API endpoints, and app settings
 */

export const STORAGE_KEYS = {
  USER: "eco_user",
  THEME: "eco_theme",
} as const;

export const THEME = {
  DARK: "dark",
  LIGHT: "light",
} as const;

export const DEFAULT_VALUES = {
  ECO_SCORE: 72,
  THEME: "dark" as const,
  THEME_CLASS_NAME: "light",
} as const;

export const NAVIGATION = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/simulator", label: "Simulator" },
  { href: "/coach", label: "AI Coach" },
] as const;

export const ARIA_LABELS = {
  TOGGLE_THEME: "Toggle theme",
  TOGGLE_MENU: "Toggle Navigation Menu",
  LOGOUT: "Logout",
} as const;

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  ENDPOINTS: {
    HEALTH: "/health",
    FOOTPRINT: "/api/footprint",
    COACH: "/api/coach",
  },
} as const;
