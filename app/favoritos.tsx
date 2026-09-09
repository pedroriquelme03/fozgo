import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { BottomNav } from '../src/components/BottomNav';
import { PlaceCard } from '../src/components/PlaceCards';
import { useAuth } from '../src/auth/AuthProvider';
import { useFavorites } from '../src/favorites/FavoritesProvider';
import { usePlaces } from '../src/places/PlacesProvider';
import { colors } from '../src/theme/colors';
import { fonts, fontSize, radius, spacing } from '../src/theme/tokens';

export default function Favoritos() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { ids } = useFavorites();
  const { placeById } = usePlaces();
  const { user } = useAuth();
  const list = ids.map((id) => placeById(id)).filter((p): p is NonNullable<typeof p> => p != null);
  const where = user ? 'na sua conta' : 'neste aparelho';

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <Text style={styles.kicker}>Salvos</Text>
          <Text style={styles.title}>Favoritos</Text>
          <Text style={styles.subtitle}>
            {list.length === 0
              ? 'Toque no coração de um local para guardar aqui.'
              : `${list.length} ${list.length === 1 ? `local salvo ${where}` : `locais salvos ${where}`}.`}
          </Text>
        </View>

        {list.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={44} color={colors.textFaint} />
            <Text style={styles.emptyTitle}>Nada favoritado ainda</Text>
            <Text style={styles.emptyText}>Explore Foz e salve restaurantes, atrações e passeios.</Text>
            <Pressable style={styles.cta} onPress={() => router.navigate('/explorar')}>
              <Text style={styles.ctaText}>Explorar Foz</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ gap: spacing.md, marginTop: spacing.md }}>
            {list.map((p) => (
              <PlaceCard key={p.id} place={p} onPress={() => router.push(`/place/${p.id}`)} />
            ))}
          </View>
        )}
      </ScrollView>
      <BottomNav active="favoritos" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
  kicker: {
    fontFamily: fonts.bodySemi,
    fontSize: fontSize.xs,
    color: colors.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSize.xxxl,
    color: colors.navy,
    letterSpacing: -0.6,
    marginTop: 2,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  empty: { alignItems: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.xxxl, gap: 6 },
  emptyTitle: { fontFamily: fonts.heading, fontSize: fontSize.lg, color: colors.navy, marginTop: spacing.sm },
  emptyText: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
  cta: {
    marginTop: spacing.lg,
    backgroundColor: colors.teal,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  ctaText: { fontFamily: fonts.bodySemi, fontSize: fontSize.md, color: '#fff' },
});
