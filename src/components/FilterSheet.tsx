import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts, fontSize, radius, spacing } from '../theme/tokens';

export type SortKey = 'relevancia' | 'avaliacao' | 'distancia';
export interface Filters {
  prices: number[]; // níveis 1-4
  minRating: number; // 0, 4, 4.5
  sort: SortKey;
}

export const defaultFilters: Filters = { prices: [], minRating: 0, sort: 'relevancia' };

const sorts: { key: SortKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'relevancia', label: 'Relevância', icon: 'sparkles-outline' },
  { key: 'avaliacao', label: 'Melhor avaliados', icon: 'star-outline' },
  { key: 'distancia', label: 'Mais próximos', icon: 'navigate-outline' },
];

const ratings = [
  { v: 0, label: 'Todas' },
  { v: 4, label: '4.0+' },
  { v: 4.5, label: '4.5+' },
];

export function FilterSheet({
  visible,
  value,
  onClose,
  onApply,
}: {
  visible: boolean;
  value: Filters;
  onClose: () => void;
  onApply: (f: Filters) => void;
}) {
  const [draft, setDraft] = React.useState<Filters>(value);
  React.useEffect(() => setDraft(value), [value, visible]);

  const togglePrice = (n: number) =>
    setDraft((d) => ({
      ...d,
      prices: d.prices.includes(n) ? d.prices.filter((p) => p !== n) : [...d.prices, n],
    }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <View style={styles.header}>
          <Text style={styles.title}>Filtros</Text>
          <Pressable onPress={() => setDraft(defaultFilters)} hitSlop={8}>
            <Text style={styles.clear}>Limpar</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.group}>Ordenar por</Text>
          <View style={styles.rowWrap}>
            {sorts.map((s) => {
              const active = draft.sort === s.key;
              return (
                <Pressable key={s.key} onPress={() => setDraft((d) => ({ ...d, sort: s.key }))} style={[styles.chip, active && styles.chipActive]}>
                  <Ionicons name={s.icon} size={15} color={active ? '#fff' : colors.textMuted} />
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{s.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.group}>Faixa de preço</Text>
          <View style={styles.rowWrap}>
            {[1, 2, 3, 4].map((n) => {
              const active = draft.prices.includes(n);
              return (
                <Pressable key={n} onPress={() => togglePrice(n)} style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {'$'.repeat(n)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.group}>Avaliação mínima</Text>
          <View style={styles.rowWrap}>
            {ratings.map((r) => {
              const active = draft.minRating === r.v;
              return (
                <Pressable key={r.v} onPress={() => setDraft((d) => ({ ...d, minRating: r.v }))} style={[styles.chip, active && styles.chipActive]}>
                  {r.v > 0 && <Ionicons name="star" size={14} color={active ? '#fff' : colors.star} />}
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{r.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <Pressable style={styles.apply} onPress={() => onApply(draft)}>
          <Text style={styles.applyText}>Mostrar resultados</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.md,
    maxHeight: '80%',
  },
  grabber: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: colors.borderStrong, marginBottom: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { fontFamily: fonts.heading, fontSize: fontSize.xl, color: colors.navy },
  clear: { fontFamily: fonts.bodySemi, fontSize: fontSize.sm, color: colors.teal },
  group: { fontFamily: fonts.bodySemi, fontSize: fontSize.md, color: colors.navy, marginTop: spacing.md, marginBottom: spacing.md },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.teal, borderColor: colors.teal },
  chipText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: colors.textMuted },
  chipTextActive: { color: '#fff' },
  apply: {
    marginTop: spacing.xl,
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { fontFamily: fonts.bodySemi, fontSize: fontSize.md, color: '#fff' },
});
