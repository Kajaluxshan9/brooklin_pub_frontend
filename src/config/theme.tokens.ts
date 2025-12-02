/**
 * Design System Tokens for Brooklin Pub
 * Centralized design tokens for consistent theming across the application
 */

// =============================================================================
// COLOR TOKENS
// =============================================================================

export const colors = {
  // Primary Brand Colors
  primary: {
    main: "#6A3A1E", // Brown primary
    dark: "#3C1F0E", // Dark brown
    light: "#8B5A2B", // Light brown
    contrastText: "#FFFFFF",
  },

  // Secondary/Accent Colors
  secondary: {
    main: "#D9A756", // Gold accent
    dark: "#B8923F", // Dark gold
    light: "#E8C078", // Light gold
    contrastText: "#3C1F0E",
  },

  // Background Colors
  background: {
    default: "#FDF8F3", // Warm cream
    paper: "#FFFDFB", // White paper
    gradient: "linear-gradient(135deg, #FDF8F3 0%, #F5EBE0 50%, #E8D5C4 100%)",
    overlay:
      "linear-gradient(180deg, rgba(60,31,14,0.7) 0%, rgba(106,58,30,0.6) 100%)",
  },

  // Text Colors
  text: {
    primary: "#3C1F0E", // Dark brown for main text
    secondary: "#6A3A1E", // Brown primary for secondary text
    muted: "rgba(106, 58, 30, 0.7)",
    light: "#F3E3CC", // Light text for dark backgrounds
    lightMuted: "rgba(243, 227, 204, 0.9)",
  },

  // Semantic Colors
  error: {
    main: "#8A2A2A", // Wine red
    light: "#B23B3B",
    dark: "#6A1F1F",
  },

  success: {
    main: "#22C55E",
    light: "#4ADE80",
    dark: "#16A34A",
  },

  warning: {
    main: "#F59E0B",
    light: "#FBBF24",
    dark: "#D97706",
  },

  // Decorative Colors
  decorative: {
    cream: "#F3E3CC",
    olive: "#7C8B48",
    wine: "#8A2A2A",
  },

  // Glass/Overlay Effects
  glass: {
    white: "rgba(255, 255, 255, 0.69)",
    dark: "rgba(0, 0, 0, 0.25)",
    gold: "rgba(217, 167, 86, 0.15)",
    goldBorder: "rgba(217, 167, 86, 0.3)",
  },
} as const;

// =============================================================================
// TYPOGRAPHY TOKENS
// =============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    heading: '"Cormorant Garamond", "Georgia", serif',
    body: '"Inter", "Helvetica Neue", "Arial", sans-serif',
    accent: '"Great Vibes", cursive',
    display: '"Playfair Display", serif',
    mono: '"Fira Code", "Consolas", monospace',
  },

  // Font Weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Font Sizes (in rem)
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    snug: 1.4,
    normal: 1.6,
    relaxed: 1.7,
    loose: 1.8,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: "-0.02em",
    tight: "-0.01em",
    normal: "0",
    wide: "0.01em",
    wider: "0.03em",
    widest: "0.08em",
    ultrawide: "0.15em", // For overlines and labels
  },
} as const;

// =============================================================================
// SPACING TOKENS
// =============================================================================

export const spacing = {
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
} as const;

// =============================================================================
// BORDER RADIUS TOKENS
// =============================================================================

export const borderRadius = {
  none: "0",
  sm: "0.25rem", // 4px
  base: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  "2xl": "2rem", // 32px
  "3xl": "3rem", // 48px
  full: "9999px",
} as const;

// =============================================================================
// SHADOW TOKENS
// =============================================================================

export const shadows = {
  none: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  // Brand-specific shadows
  card: "0 8px 32px rgba(106, 58, 30, 0.12)",
  cardHover: "0 12px 40px rgba(106, 58, 30, 0.18)",
  popup: "0 25px 50px -12px rgba(106, 58, 30, 0.25)",
  glass: "0 4px 24px rgba(0, 0, 0, 0.20)",
  gold: "0 8px 25px rgba(217, 167, 86, 0.4)",
} as const;

// =============================================================================
// Z-INDEX TOKENS
// =============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
  nav: 2000,
  max: 9999,
} as const;

// =============================================================================
// TRANSITION TOKENS
// =============================================================================

export const transitions = {
  duration: {
    fastest: "75ms",
    faster: "100ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "400ms",
    slowest: "500ms",
  },
  timing: {
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    linear: "linear",
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
} as const;

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  xs: "0px",
  sm: "600px",
  md: "900px",
  lg: "1200px",
  xl: "1536px",
} as const;

// =============================================================================
// COMPONENT-SPECIFIC TOKENS
// =============================================================================

export const components = {
  // Navigation
  nav: {
    height: {
      desktop: "80px",
      mobile: "65px",
    },
    blur: "blur(18px)",
  },

  // Hero Section
  hero: {
    minHeight: {
      xs: "55vh",
      sm: "55vh",
      md: "60vh",
    },
  },

  // Cards
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    border: `2px solid ${colors.glass.goldBorder}`,
  },

  // Buttons
  button: {
    borderRadius: borderRadius.base,
    paddingX: spacing[6],
    paddingY: spacing[3],
  },

  // Inputs
  input: {
    borderRadius: borderRadius.base,
    borderColor: colors.glass.goldBorder,
  },
} as const;

// =============================================================================
// THEME OBJECT (for MUI compatibility)
// =============================================================================

export const themeTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  transitions,
  breakpoints,
  components,
} as const;

export default themeTokens;
