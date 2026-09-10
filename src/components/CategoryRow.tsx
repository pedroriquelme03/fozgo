import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../data/categories';
import { useCategories } from '../categories/CategoriesProvider';
import { CategoryId } from '../data/types';
import { colors } from '../theme/colors';
import { fonts, fontSize, radius, spacing } from '../theme/tokens';

/** Linha horizontal de categorias com destaque para a selecionada. */
export function CategoryRow({
  selected,
  onSelect,
}: {
  selected: CategoryId | null;
  onSelect: (id: CategoryId | null) => void;
}) {
  const { categories } = useCategories();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {categories.map((cat) => {
        const active = selected === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onSelect(active ? null : cat.id)}
            style={({ pressed }) => [pressed && { transform: [{ scale: 0.97 }] }]}
          >
            <View style={styles.item}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: active ? cat.base : cat.tint },
                ]}
              >
                <Ionicons
                  name={cat.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={active ? '#FFFFFF' : cat.base}
                />
              </View>
              <Text style={[styles.label, active && { color: colors.navy, fontFamily: fonts.bodySemi }]} numberOfLines={1}>
                {cat.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/** Grade de categorias (4 por linha) para a seção "Explorar por categoria". */
export function CategoryGrid({ onSelect }: { onSelect: (c: Category) => void }) {
  const { categories } = useCategories();
  return (
    <View style={styles.grid}>
      {categories.map((cat) => (
        <Pressable
          key={cat.id}
          onPress={() => onSelect(cat)}
          style={({ pressed }) => [styles.gridItem, pressed && { opacity: 0.8 }]}
        >
          <View style={[styles.gridIcon, { backgroundColor: cat.tint }]}>
            <Ionicons name={cat.icon as keyof typeof Ionicons.glyphMap} size={26} color={cat.base} />
          </View>
          <Text style={styles.gridLabel} numberOfLines={2}>
            {cat.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.xl, gap: spacing.lg, paddingVertical: spacing.xs },
  item: { alignItems: 'center', width: 74, gap: 8 },
  iconWrap: {
    width: 62,
    height: 62,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: fonts.bodyMedium, fontSize: fontSize.xs, color: colors.textMuted, textAlign: 'center' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xl,
    rowGap: spacing.xl,
  },
  gridItem: { width: '25%', alignItems: 'center', gap: 8 },
  gridIcon: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLabel: { fontFamily: fonts.bodyMedium, fontSize: fontSize.xs, color: colors.text, textAlign: 'center' },
});
