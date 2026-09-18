import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Keyboard,
  LayoutChangeEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomNav } from '../src/components/BottomNav';
import { LinearGradientView } from '../src/components/Gradient';
import { CompactCard, PlaceCard } from '../src/components/PlaceCards';
import { NearYouMap, googleMapsHereUrl, FOZ } from '../src/components/NearYouMap';
import { SectionHeader } from '../src/components/ui';
import { useLocation } from '../src/integrations/LocationProvider';
import * as Linking from 'expo-linking';
import { useCategories } from '../src/categories/CategoriesProvider';
import { usePlaces } from '../src/places/PlacesProvider';
import { Category } from '../src/data/categories';
import { CategoryId, Place } from '../src/data/types';
import { img } from '../src/data/images';
import { colors } from '../src/theme/colors';
import { fonts, fontSize, spacing, shadow, radius } from '../src/theme/tokens';

const HOME_GREEN = '#22C55E';
const HERO_IMG = require('../assets/Cataratas_do_Iguacu_Foz_do_Iguacu_Brasil.jpg');
const OFFER_BG = require('../assets/artboard-2.jpg');

const FEATURED_IDS: CategoryId[] = ['pontos', 'restaurantes', 'hoteis', 'transporte'];

const HERO_LABEL: Partial<Record<CategoryId, string>> = {
  pontos: 'Attractions',
  restaurantes: 'Restaurants',
  hoteis: 'Hotels',
  transporte: 'Taxi / Transfer',
};

const HERO_COLOR: Partial<Record<CategoryId, string>> = {
  pontos: HOME_GREEN,
  restaurantes: '#F97316',
  hoteis: '#7C3AED',
  transporte: '#EAB308',
};

const HERO_ICON: Partial<Record<CategoryId, keyof typeof Ionicons.glyphMap>> = {
  transporte: 'car',
};

const OFFERS = [
  {
    id: 'restaurantes' as CategoryId,
    kicker: 'Special Offer',
    title: 'Up to 20% OFF',
    subtitle: 'in selected restaurants',
    cta: 'See offers',
    image: OFFER_BG,
  },
  {
    id: 'pontos' as CategoryId,
    kicker: 'Must see',
    title: 'Iguaçu Falls',
    subtitle: 'tickets and guided visits',
    cta: 'See offers',
    image: img.cataratas1,
  },
  {
    id: 'hoteis' as CategoryId,
    kicker: 'Stay in Foz',
    title: 'Hotel deals',
    subtitle: 'from luxury to family stays',
    cta: 'See offers',
    image: img.hotel1,
  },
];

export default function Home2() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { categories, categoryById } = useCategories();
  const { places } = usePlaces();
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<CategoryId | null>(null);
  const [moreOpen, setMoreOpen] = React.useState(false);

  const featured = React.useMemo(
    () => FEATURED_IDS.map((id) => categories.find((c) => c.id === id)).filter((c): c is Category => c != null),
    [categories],
  );
  const extra = React.useMemo(
    () => categories.filter((c) => !FEATURED_IDS.includes(c.id)),
    [categories],
  );

  const q = query.trim().toLowerCase();
  const browsing = q.length > 0 || category != null;
  const results = React.useMemo(() => {
    if (!browsing) return [];
    return places.filter((p) => {
      if (category && p.category !== category) return false;
      if (!q) return true;
      const hay = `${p.name} ${p.tagline} ${p.neighborhood} ${categoryById(p.category).label} ${p.tags.join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [browsing, places, category, q, categoryById]);

  const openCategory = (id: CategoryId) => {
    setCategory((current) => (current === id ? null : id));
  };

  const submitSearch = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.bannerWrap}>
          <Image source={HERO_IMG} style={styles.banner} contentFit="cover" transition={250} />
          <LinearGradientView
            colors={['rgba(0,0,0,0.42)', 'rgba(0,0,0,0.16)', 'rgba(0,0,0,0)']}
            style={styles.bannerOverlay}
          />
          <View style={[styles.hero, { paddingTop: insets.top + spacing.lg + 50 }]}>
            <View>
              <Text style={styles.welcome}>Welcome to</Text>
              <Text style={styles.city}>Foz do Iguaçu</Text>
            </View>
            <Pressable
              onPress={() => router.navigate('/favoritos')}
              hitSlop={10}
              style={({ pressed }) => [styles.favBtn, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel="Favoritos"
            >
              <Ionicons name="heart-outline" size={23} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.searchWrap}>
            <View style={styles.searchBar}>
              <View style={styles.searchInner}>
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="What do you want to do today?"
                  placeholderTextColor="#8A8A8A"
                  style={[styles.searchInput, Platform.OS === 'web' && ({ outlineStyle: 'none' } as object)]}
                  returnKeyType="search"
                  onSubmitEditing={submitSearch}
                  accessibilityLabel="Buscar"
                />
                <Pressable
                  onPress={submitSearch}
                  style={({ pressed }) => [styles.searchBtn, pressed && { opacity: 0.88 }]}
                  accessibilityRole="button"
                  accessibilityLabel="Pesquisar"
                >
                  <Ionicons name="search-outline" size={22} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.categories}>
          <View style={styles.catGrid}>
            {featured.map((cat) => (
              <CategoryTile
                key={cat.id}
                label={HERO_LABEL[cat.id] ?? cat.label}
                icon={(HERO_ICON[cat.id] ?? cat.icon) as keyof typeof Ionicons.glyphMap}
                color={HERO_COLOR[cat.id] ?? cat.base}
                selected={category === cat.id}
                onPress={() => openCategory(cat.id)}
              />
            ))}
            <CategoryTile
              label={moreOpen ? 'Less' : 'More'}
              icon={moreOpen ? 'chevron-up' : 'ellipsis-horizontal'}
              color="#E8EAED"
              iconColor="#6B7280"
              onPress={() => setMoreOpen((open) => !open)}
            />
            {moreOpen &&
              extra.map((cat) => (
                <CategoryTile
                  key={cat.id}
                  label={cat.label}
                  icon={cat.icon as keyof typeof Ionicons.glyphMap}
                  color={cat.base}
                  selected={category === cat.id}
                  onPress={() => openCategory(cat.id)}
                />
              ))}
          </View>
          {browsing ? (
            <SearchResults
              count={results.length}
              list={results}
              onOpen={(place) => router.push(`/place/${place.id}`)}
              onClear={() => {
                setQuery('');
                setCategory(null);
              }}
            />
          ) : (
            <>
              <OfferSlider onSeeOffers={openCategory} />
              <PopularPlaces />
              <NearYou />
            </>
          )}
        </View>
      </ScrollView>
      <BottomNav active="inicio" accentColor={HOME_GREEN} />
    </View>
  );
}

function OfferSlider({ onSeeOffers }: { onSeeOffers: (id: CategoryId) => void }) {
  const { width } = useWindowDimensions();
  const [page, setPage] = React.useState(0);
  const [sliderW, setSliderW] = React.useState(width);

  const onLayout = (e: LayoutChangeEvent) => {
    const next = Math.round(e.nativeEvent.layout.width);
    if (next > 0 && next !== sliderW) setSliderW(next);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!sliderW) return;
    const next = Math.round(e.nativeEvent.contentOffset.x / sliderW);
    setPage((current) => (current === next ? current : next));
  };

  return (
    <View style={styles.offers} onLayout={onLayout}>
      <FlatList
        data={OFFERS}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={
          sliderW ? (_item, index) => ({ length: sliderW, offset: sliderW * index, index }) : undefined
        }
        renderItem={({ item }) => (
          <View style={{ width: sliderW, paddingHorizontal: spacing.xl }}>
            <OfferCard offer={item} onSeeOffers={() => onSeeOffers(item.id)} />
          </View>
        )}
      />
      <View style={styles.offerDots} pointerEvents="none">
        {OFFERS.map((item, i) => (
          <View key={item.id} style={[styles.offerDot, page === i && styles.offerDotOn]} />
        ))}
      </View>
    </View>
  );
}

function OfferCard({
  offer,
  onSeeOffers,
}: {
  offer: (typeof OFFERS)[number];
  onSeeOffers: () => void;
}) {
  return (
    <View style={styles.offerCard}>
      <Image source={offer.image} style={styles.offerImg} contentFit="cover" />
      <View style={styles.offerCopy}>
        <Text style={styles.offerKicker}>{offer.kicker}</Text>
        <Text style={styles.offerTitle}>{offer.title}</Text>
        <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
        <Pressable
          onPress={onSeeOffers}
          style={({ pressed }) => [styles.offerCta, pressed && { opacity: 0.88 }]}
          accessibilityRole="button"
          accessibilityLabel={offer.cta}
        >
          <Text style={styles.offerCtaText}>{offer.cta}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function fromPrice(place: Place) {
  const ticketMatch = place.ticket?.match(/R\$\s*([\d.,]+)/);
  if (ticketMatch) return `From R$ ${ticketMatch[1]}`;
  const menuPrices = place.menu?.flatMap((section) => section.items.map((item) => item.price)) ?? [];
  if (menuPrices.length) return `From R$ ${Math.min(...menuPrices)}`;
  const fallback = [0, 40, 80, 120, 180][place.priceRange] ?? 80;
  return `From R$ ${fallback}`;
}

function PopularPlaces() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { mustVisitPlaces } = usePlaces();
  const pad = spacing.xl;
  const gap = spacing.md;
  const cardW = (width - pad * 2 - gap * 2) / 3;

  return (
    <View style={styles.popular}>
      <SectionHeader title="Popular Places" onAction={() => router.navigate('/explorar')} />
      <FlatList
        data={mustVisitPlaces}
        keyExtractor={(item) => item.id}
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.popularList}
        renderItem={({ item }) => (
          <CompactCard
            place={item}
            width={cardW}
            showBadge={false}
            caption={fromPrice(item)}
            imageStyle={styles.popularImg}
            titleNumberOfLines={2}
            onPress={() => router.push(`/place/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

function NearYou() {
  const { coords } = useLocation();
  const lat = coords?.lat ?? FOZ.lat;
  const lng = coords?.lng ?? FOZ.lng;

  return (
    <View style={styles.near}>
      <SectionHeader
        title="Near You"
        onAction={() => {
          void Linking.openURL(googleMapsHereUrl(lat, lng));
        }}
      />
      <View style={[styles.nearCard, shadow.soft]}>
        <View style={styles.nearClip}>
          <NearYouMap lat={lat} lng={lng} />
        </View>
      </View>
    </View>
  );
}

function SearchResults({
  count,
  list,
  onOpen,
  onClear,
}: {
  count: number;
  list: Place[];
  onOpen: (place: Place) => void;
  onClear: () => void;
}) {
  return (
    <View style={styles.results}>
      <View style={styles.resultsHead}>
        <Text style={styles.resultsCount}>
          {count} {count === 1 ? 'place found' : 'places found'}
        </Text>
        <Pressable onPress={onClear} hitSlop={8} accessibilityRole="button" accessibilityLabel="Clear search">
          <Text style={styles.resultsClear}>Clear</Text>
        </Pressable>
      </View>
      {count === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="search" size={40} color={colors.textFaint} />
          <Text style={styles.emptyTitle}>No places found</Text>
          <Text style={styles.emptyText}>Try another search or category.</Text>
        </View>
      ) : (
        <View style={styles.resultsList}>
          {list.map((place) => (
            <PlaceCard key={place.id} place={place} onPress={() => onOpen(place)} />
          ))}
        </View>
      )}
    </View>
  );
}

function CategoryTile({
  label,
  icon,
  color,
  iconColor = '#FFFFFF',
  selected,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  iconColor?: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.catItem, pressed && { opacity: 0.8 }, selected && styles.catItemOn]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!selected }}
    >
      <View style={[styles.catIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={26} color={iconColor} />
      </View>
      <Text style={[styles.catLabel, selected && styles.catLabelOn]} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {},
  bannerWrap: {
    width: '100%',
    height: 450,
  },
  banner: {
    ...StyleSheet.absoluteFill,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  favBtn: {
    paddingTop: 2,
  },
  welcome: {
    fontFamily: fonts.medium,
    fontSize: 22,
    lineHeight: 28,
    color: '#FFFFFF',
    textShadowColor: 'rgba(12, 42, 67, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  city: {
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 46,
    color: '#FFFFFF',
    letterSpacing: -0.6,
    textShadowColor: 'rgba(12, 42, 67, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  searchWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.xl + 30,
    paddingHorizontal: spacing.xl,
    zIndex: 2,
  },
  searchBar: {
    borderRadius: 999,
    ...(shadow.lifted as object),
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    height: 52,
    overflow: 'hidden',
    paddingLeft: 20,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    color: colors.text,
    paddingRight: spacing.sm,
  },
  searchBtn: {
    width: 58,
    alignSelf: 'stretch',
    backgroundColor: HOME_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
  },
  categories: {
    backgroundColor: '#FFFFFF',
    marginTop: -25,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.sm,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    zIndex: 1,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  catItem: {
    width: '20%',
    alignItems: 'center',
    gap: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: 2,
  },
  catItemOn: {
    opacity: 1,
  },
  catIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 15,
    color: colors.text,
    textAlign: 'center',
  },
  catLabelOn: {
    color: HOME_GREEN,
    fontFamily: fonts.bodySemi,
  },
  offers: {
    marginTop: spacing.md,
    marginHorizontal: -spacing.sm,
  },
  offerCard: {
    height: 168,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0C3F3A',
  },
  offerImg: {
    ...StyleSheet.absoluteFill,
  },
  offerCopy: {
    flex: 1,
    width: '58%',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingLeft: 18,
    paddingRight: 8,
    zIndex: 1,
  },
  offerKicker: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  offerTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 28,
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  offerSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.88)',
    marginTop: 2,
  },
  offerCta: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: HOME_GREEN,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  offerCtaText: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: '#FFFFFF',
  },
  offerDots: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  offerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  offerDotOn: {
    backgroundColor: '#FFFFFF',
  },
  popular: {
    marginTop: spacing.xxl,
    marginHorizontal: -spacing.sm,
  },
  popularList: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  popularImg: {
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
  },
  near: {
    marginTop: spacing.xxl,
    marginHorizontal: -spacing.sm,
  },
  nearCard: {
    marginHorizontal: spacing.xl,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
  },
  nearClip: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
  },
  results: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  resultsHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  resultsCount: {
    fontFamily: fonts.heading,
    fontSize: fontSize.lg,
    color: colors.navy,
  },
  resultsClear: {
    fontFamily: fonts.bodySemi,
    fontSize: fontSize.sm,
    color: HOME_GREEN,
  },
  resultsList: {
    gap: spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: 6,
  },
  emptyTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSize.lg,
    color: colors.navy,
    marginTop: spacing.sm,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});
