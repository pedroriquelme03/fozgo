import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Logo } from '../src/components/Brand';
import { SearchBar } from '../src/components/SearchBar';
import { CategoryRow, CategoryGrid } from '../src/components/CategoryRow';
import { FeaturedCard, PlaceCard, CompactCard } from '../src/components/PlaceCards';
import { SectionHeader } from '../src/components/ui';
import { LinearGradientView } from '../src/components/Gradient';
import { FilterSheet, Filters, defaultFilters } from '../src/components/FilterSheet';
import { BottomNav } from '../src/components/BottomNav';
import { WeatherPanel } from '../src/components/WeatherPanel';
import { useFavorites } from '../src/favorites/FavoritesProvider';
import { openLocationSettings, useLocation } from '../src/integrations/LocationProvider';

import { usePlaces } from '../src/places/PlacesProvider';
import { useCategories } from '../src/categories/CategoriesProvider';
import { CategoryId, Place } from '../src/data/types';
import { colors } from '../src/theme/colors';
import { fonts, fontSize, radius, spacing } from '../src/theme/tokens';

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<CategoryId | null>(null);
  const [filters, setFilters] = React.useState<Filters>(defaultFilters);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const { ids } = useFavorites();
  const { places, featuredPlaces } = usePlaces();
  const { categoryById } = useCategories();
  const { label, granted, kmTo, refresh } = useLocation();

  const openPlace = (p: Place) => router.push(`/place/${p.id}`);

  const filtersActive =
    filters.prices.length > 0 || filters.minRating > 0 || filters.sort !== 'relevancia';
  const searching = query.trim().length > 0 || category != null || filtersActive;

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = places.filter((p) => {
      if (category && p.category !== category) return false;
      if (filters.prices.length && !filters.prices.includes(p.priceRange)) return false;
      if (p.rating < filters.minRating) return false;
      if (q) {
        const hay = `${p.name} ${p.tagline} ${p.neighborhood} ${categoryById(p.category).label} ${p.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (filters.sort === 'avaliacao') list = [...list].sort((a, b) => b.rating - a.rating);
    if (filters.sort === 'distancia') list = [...list].sort((a, b) => kmTo(a) - kmTo(b));
    return list;
  }, [places, query, category, filters, kmTo, categoryById]);

  // Grade responsiva de recomendados
  const gutter = spacing.xl;
  const gap = spacing.md;
  const cols = width >= 900 ? 3 : 2;
  const cardW = (Math.min(width, 1100) - gutter * 2 - gap * (cols - 1)) / cols;
  const recommended = places.filter((p) => p.rating >= 4.7).slice(0, cols === 3 ? 6 : 4);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        showsVerticalScrollIndicator={false}
      >
      {/* ── Cabeçalho com gradiente da marca ── */}
      <LinearGradientView
        colors={[colors.tealDeep, colors.teal]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.md }]}
      >
        <View style={styles.headerRow}>
          <Logo size={26} onDark />
          <View style={styles.headerActions}>
            <HeaderIcon icon={ids.length > 0 ? 'heart' : 'heart-outline'} onPress={() => router.navigate('/favoritos')} />
            <HeaderIcon icon="notifications-outline" dot />
          </View>
        </View>

        <Pressable
          style={styles.locationRow}
          onPress={() => {
            if (granted) {
              void refresh();
              return;
            }
            Alert.alert(
              'Localização',
              'O FozGo usa o GPS para calcular distâncias e o que está perto de você.',
              [
                { text: 'Agora não', style: 'cancel' },
                { text: 'Permitir', onPress: () => void refresh() },
                { text: 'Ajustes', onPress: () => void openLocationSettings() },
              ],
            );
          }}
        >
          <Ionicons name="location" size={16} color="#fff" />
          <Text style={styles.locationText}>{label}</Text>
          <Ionicons name="chevron-down" size={16} color="rgba(255,255,255,0.9)" />
        </Pressable>
        <Text style={styles.headline}>Tudo o que você precisa{'\n'}em Foz do Iguaçu</Text>
      </LinearGradientView>

        {/* Busca sobreposta ao cabeçalho */}
        <View style={styles.searchDock}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onFilterPress={() => setFilterOpen(true)}
          />
        </View>

        {/* Categorias (sempre visíveis) */}
        <View style={{ marginTop: spacing.xl }}>
          <CategoryRow selected={category} onSelect={setCategory} />
        </View>

        {category === 'clima' ? (
          <View style={{ marginTop: spacing.xl }}>
            <SectionHeader title="Previsão do tempo" actionLabel="" />
            <WeatherPanel />
          </View>
        ) : searching ? (
          <ResultsSection
            count={results.length}
            list={results}
            onOpen={openPlace}
            onClear={() => {
              setQuery('');
              setCategory(null);
              setFilters(defaultFilters);
            }}
          />
        ) : (
          <>
            {/* Destaques */}
            <View style={{ marginTop: spacing.xxl }}>
              <SectionHeader title="Destaques de Foz" onAction={() => setCategory(null)} />
              <FlatList
                data={featuredPlaces}
                keyExtractor={(i) => i.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: spacing.xl, gap: spacing.lg }}
                renderItem={({ item }) => <FeaturedCard place={item} onPress={() => openPlace(item)} />}
              />
            </View>

            {/* Explorar por categoria */}
            <View style={{ marginTop: spacing.xxl }}>
              <SectionHeader title="Explorar por categoria" actionLabel="" />
              <CategoryGrid onSelect={(c) => setCategory(c.id)} />
            </View>

            {/* Recomendados (grade) */}
            <View style={{ marginTop: spacing.xxl }}>
              <SectionHeader title="Recomendados para você" onAction={() => setFilters({ ...defaultFilters, sort: 'avaliacao' })} />
              <View style={[styles.recGrid, { paddingHorizontal: gutter, gap }]}>
                {recommended.map((p) => (
                  <CompactCard key={p.id} place={p} width={cardW} onPress={() => openPlace(p)} />
                ))}
              </View>
            </View>

            {/* Perto de você */}
            <View style={{ marginTop: spacing.xxl }}>
              <SectionHeader title="Perto de você" onAction={() => setFilters({ ...defaultFilters, sort: 'distancia' })} />
              <View style={{ gap: spacing.md }}>
                {[...places]
                  .sort((a, b) => kmTo(a) - kmTo(b))
                  .slice(0, 4)
                  .map((p) => (
                    <PlaceCard key={p.id} place={p} onPress={() => openPlace(p)} />
                  ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <FilterSheet
        visible={filterOpen}
        value={filters}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => {
          setFilters(f);
          setFilterOpen(false);
        }}
      />

      <BottomNav active="inicio" />
    </View>
  );
}

function HeaderIcon({ icon, dot, onPress }: { icon: keyof typeof Ionicons.glyphMap; dot?: boolean; onPress?: () => void }) {
  return (
    <Pressable style={styles.headerIcon} onPress={onPress}>
      <Ionicons name={icon} size={20} color="#fff" />
      {dot && <View style={styles.badgeDot} />}
    </Pressable>
  );
}

function ResultsSection({
  count,
  list,
  onOpen,
  onClear,
}: {
  count: number;
  list: Place[];
  onOpen: (p: Place) => void;
  onClear: () => void;
}) {
  return (
    <View style={{ marginTop: spacing.xl }}>
      <View style={styles.resultsHead}>
        <Text style={styles.resultsCount}>
          {count} {count === 1 ? 'local encontrado' : 'locais encontrados'}
        </Text>
        <Pressable onPress={onClear} hitSlop={8}>
          <Text style={styles.resultsClear}>Limpar</Text>
        </Pressable>
      </View>
      {count === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="search" size={40} color={colors.textFaint} />
          <Text style={styles.emptyTitle}>Nenhum local encontrado</Text>
          <Text style={styles.emptyText}>Tente ajustar a busca ou os filtros.</Text>
        </View>
      ) : (
        <View style={{ gap: spacing.md }}>
          {list.map((p) => (
            <PlaceCard key={p.id} place={p} onPress={() => onOpen(p)} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl + spacing.lg,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerActions: { flexDirection: 'row', gap: spacing.sm },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.pin,
    borderWidth: 1.5,
    borderColor: colors.tealDeep,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xl },
  locationText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: '#fff' },
  headline: {
    fontFamily: fonts.display,
    fontSize: fontSize.xxxl,
    color: '#fff',
    marginTop: spacing.sm,
    letterSpacing: -0.6,
    lineHeight: fontSize.xxxl + 4,
  },
  scroll: { flex: 1 },
  searchDock: { marginTop: -spacing.xxxl },
  recGrid: { flexDirection: 'row', flexWrap: 'wrap' },

  resultsHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  resultsCount: { fontFamily: fonts.heading, fontSize: fontSize.lg, color: colors.navy },
  resultsClear: { fontFamily: fonts.bodySemi, fontSize: fontSize.sm, color: colors.teal },
  empty: { alignItems: 'center', paddingVertical: spacing.xxxl, gap: 6 },
  emptyTitle: { fontFamily: fonts.heading, fontSize: fontSize.lg, color: colors.navy, marginTop: spacing.sm },
  emptyText: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted },
});
