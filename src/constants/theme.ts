/**
 * Design Tokens - Centralized theme constants
 * Use these throughout the app for consistent styling
 */

export const Colors = {
  // Primary colors - More vibrant and playful
  primary: '#FF6B9D', // Pink
  primaryLight: '#FFB8D1',
  primaryDark: '#E85A8A',

  // Secondary colors - Bright and cheerful
  secondary: '#FFD93D', // Sunny yellow
  secondaryLight: '#FFF4B8',
  secondaryDark: '#FFC107',

  // Accent colors - Add variety
  accent1: '#7DD3C0', // Teal (kept from original)
  accent2: '#A78BFA', // Purple
  accent3: '#FF9B8A', // Coral (kept from original)
  accent4: '#6BDBFF', // Sky blue
  accent5: '#B4EFC4', // Mint green

  // Feedback colors
  success: '#7DD3C0',
  warning: '#FDB022',
  error: '#FF9B8A',
  errorLight: '#FFE5E0',
  warningLight: '#FFF4E0',

  // Neutral colors - Warmer and friendlier
  background: '#FFF5F7', // Soft pink tint
  backgroundAlt: '#F0F9FF', // Alternate sky blue tint
  surface: '#FFFFFF',
  text: '#2D3748',
  textSecondary: '#718096',
  textTertiary: '#A0AEC0',
  border: '#E2E8F0',
  borderLight: '#F7FAFC',

  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  disabled: 'rgba(0, 0, 0, 0.3)',
  
  // Fun gradient colors
  gradientStart: '#FF6B9D',
  gradientEnd: '#FFD93D',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
} as const;

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const Opacity = {
  disabled: 0.5,
  hover: 0.8,
  light: 0.6,
  medium: 0.4,
  veryLight: 0.2,
} as const;
