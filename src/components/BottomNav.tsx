import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts, fontSize, radius, spacing, shadow } from '../theme/tokens';

const tabs = [
  { key: 'inicio', label: 'Início', icon: 'home' },
  { key: 'explorar', label: 'Explorar', icon: 'compass' },
  { key: 'favoritos', label: 'Favoritos', icon: 'heart' },
  { key: 'perfil', label: 'Perfil', icon: 'person' },
] as const;

export function BottomNav({
  active = 'inicio',
  onChange,
}: {
  active?: string;
  onChange?: (key: string) => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {tabs.map((t) => {
        const on = active === t.key;
        return (
          <Pressable key={t.key} style={styles.tab} onPress={() => onChange?.(t.key)}>
            <Ionicons
              name={(on ? t.icon : `${t.icon}-outline`) as keyof typeof Ionicons.glyphMap}
              size={23}
              color={on ? colors.teal : colors.textFaint}
            />
            <Text style={[styles.label, on && { color: colors.teal, fontFamily: fonts.bodySemi }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    ...(shadow.lifted as object),
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontFamily: fonts.bodyMedium, fontSize: fontSize.xs, color: colors.textFaint },
});
