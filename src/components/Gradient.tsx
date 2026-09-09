import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/** Wrapper fino sobre LinearGradient para tipagem simples de cores. */
export function LinearGradientView({
  colors,
  style,
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
  children,
}: {
  colors: string[];
  style?: StyleProp<ViewStyle>;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  children?: React.ReactNode;
}) {
  return (
    <LinearGradient colors={colors as [string, string, ...string[]]} start={start} end={end} style={style}>
      {children}
    </LinearGradient>
  );
}
