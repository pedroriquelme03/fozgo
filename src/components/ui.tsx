import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts, fontSize, radius, spacing } from '../theme/tokens';

/** Estrela + nota + total de avaliações. */
export function Rating({
  value,
  count,
  size = fontSize.sm,
  onDark = false,
}: {
  value: number;
  count?: number;
  size?: number;
  onDark?: boolean;
}) {
  const c = onDark ? '#FFFFFF' : colors.text;
  return (
    <View style={styles.row}>
      <Ionicons name="star" size={size + 1} color={colors.star} />
      <Text style={[styles.ratingValue, { fontSize: size, color: c }]}>{value.toFixed(1)}</Text>
      {count != null && (
        <Text style={[styles.ratingCount, { fontSize: size - 1, color: onDark ? 'rgba(255,255,255,0.8)' : colors.textMuted }]}>
          ({count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k` : count})
        </Text>
      )}
    </View>
  );
}

/** Faixa de preço em cifrões. */
export function PriceLevel({ level, size = fontSize.sm }: { level: number; size?: number }) {
  return (
    <Text style={{ fontFamily: fonts.bodySemi, fontSize: size, color: colors.tealDeep }}>
      {'$'.repeat(level)}
      <Text style={{ color: colors.textFaint }}>{'$'.repeat(4 - level)}</Text>
    </Text>
  );
}

/** Etiqueta arredondada. */
export function Tag({
  label,
  color = colors.textMuted,
  tint = colors.surfaceAlt,
  style,
}: {
  label: string;
  color?: string;
  tint?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.tag, { backgroundColor: tint }, style]}>
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

/** Chip com ícone flutuante sobre imagem (ex.: distância). */
export function Pill({
  icon,
  label,
  style,
  textStyle,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}) {
  return (
    <View style={[styles.pill, style]}>
      {icon && <Ionicons name={icon} size={12} color={colors.navy} />}
      <Text style={[styles.pillText, textStyle]}>{label}</Text>
    </View>
  );
}

/** Cabeçalho de seção com ação opcional. */
export function SectionHeader({
  title,
  actionLabel = 'Ver todos',
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onAction && (
        <Text onPress={onAction} style={styles.sectionAction}>
          {actionLabel}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingValue: { fontFamily: fonts.bodySemi },
  ratingCount: { fontFamily: fonts.body },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  tagText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.xs },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  pillText: { fontFamily: fonts.bodySemi, fontSize: fontSize.xs, color: colors.navy },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSize.xl,
    color: colors.navy,
    letterSpacing: -0.3,
  },
  sectionAction: {
    fontFamily: fonts.bodySemi,
    fontSize: fontSize.sm,
    color: colors.teal,
  },
});
