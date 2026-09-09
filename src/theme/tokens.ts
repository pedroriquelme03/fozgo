/** Escalas de espaçamento, raio, tipografia e sombras do FozGo. */
import { Platform } from 'react-native';
import { colors } from './colors';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

/** Famílias carregadas via @expo-google-fonts (ver useAppFonts). */
export const fonts = {
  display: 'Poppins_700Bold',
  heading: 'Poppins_600SemiBold',
  medium: 'Poppins_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 34,
} as const;

export const shadow = {
  card: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    android: { elevation: 3 },
    default: { boxShadow: `0 8px 20px rgba(12,42,67,0.10)` },
  }),
  soft: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    android: { elevation: 2 },
    default: { boxShadow: `0 3px 10px rgba(12,42,67,0.08)` },
  }),
  lifted: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOpacity: 0.14,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 14 },
    },
    android: { elevation: 6 },
    default: { boxShadow: `0 14px 34px rgba(12,42,67,0.18)` },
  }),
} as const;
