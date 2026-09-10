import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradientView } from './Gradient';
import { Rating, PriceLevel, Pill, Tag } from './ui';
import { FavoriteHeart } from './FavoriteHeart';
import { Place } from '../data/types';
import { useCategories } from '../categories/CategoriesProvider';
import { useLocation } from '../integrations/LocationProvider';
import { colors } from '../theme/colors';
import { fonts, fontSize, radius, spacing, shadow } from '../theme/tokens';

const BLUR = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

/** Card grande de destaque (carrossel horizontal). */
export function FeaturedCard({ place, onPress }: { place: Place; onPress: () => void }) {
  const { categoryById } = useCategories();
  const cat = categoryById(place.category);
  const { labelFor } = useLocation();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.feat, pressed && { transform: [{ scale: 0.98 }] }]}>
      <Image source={place.photos[0]} style={styles.featImg} contentFit="cover" placeholder={BLUR} transition={250} />
      <LinearGradientView
        colors={['transparent', 'rgba(12,42,67,0.15)', 'rgba(12,42,67,0.9)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.featTop}>
        <Pill icon="star" label={`${place.rating.toFixed(1)}`} />
        <FavoriteHeart placeId={place.id} />
      </View>
      <View style={styles.featBottom}>
        <View style={[styles.catBadge, { backgroundColor: cat.base }]}>
          <Ionicons name={cat.icon as keyof typeof Ionicons.glyphMap} size={12} color="#fff" />
          <Text style={styles.catBadgeText}>{cat.label}</Text>
        </View>
        <Text style={styles.featTitle} numberOfLines={1}>
          {place.name}
        </Text>
        <Text style={styles.featTagline} numberOfLines={1}>
          {place.tagline}
        </Text>
        <View style={styles.featMeta}>
          <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.85)" />
          <Text style={styles.featMetaText} numberOfLines={1}>
            {labelFor(place)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/** Card horizontal para listas (imagem à esquerda). */
export function PlaceCard({ place, onPress }: { place: Place; onPress: () => void }) {
  const { categoryById } = useCategories();
  const cat = categoryById(place.category);
  const { labelFor } = useLocation();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}>
      <View>
        <Image source={place.photos[0]} style={styles.cardImg} contentFit="cover" placeholder={BLUR} transition={200} />
        <FavoriteHeart placeId={place.id} size={16} style={styles.cardHeart} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <Tag label={cat.label} color={cat.base} tint={cat.tint} />
          <Rating value={place.rating} count={place.reviewsCount} size={fontSize.xs} />
        </View>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {place.name}
        </Text>
        <Text style={styles.cardTagline} numberOfLines={1}>
          {place.tagline}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.cardLoc}>
            <Ionicons name="location-outline" size={13} color={colors.textMuted} />
            <Text style={styles.cardLocText} numberOfLines={1}>
              {labelFor(place)}
            </Text>
          </View>
          <PriceLevel level={place.priceRange} size={fontSize.xs} />
        </View>
      </View>
    </Pressable>
  );
}

/** Card compacto vertical (grade de recomendados). */
export function CompactCard({ place, onPress, width }: { place: Place; onPress: () => void; width: number }) {
  const { categoryById } = useCategories();
  const cat = categoryById(place.category);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.compact, { width }, pressed && { opacity: 0.92 }]}>
      <View>
        <Image source={place.photos[0]} style={styles.compactImg} contentFit="cover" placeholder={BLUR} transition={200} />
        <View style={styles.compactBadge}>
          <Ionicons name={cat.icon as keyof typeof Ionicons.glyphMap} size={12} color={cat.base} />
        </View>
      </View>
      <View style={styles.compactBody}>
        <Text style={styles.compactTitle} numberOfLines={1}>
          {place.name}
        </Text>
        <View style={styles.cardTopRow}>
          <Rating value={place.rating} size={fontSize.xs} />
          <PriceLevel level={place.priceRange} size={fontSize.xs} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Featured
  feat: {
    width: 280,
    height: 340,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    ...(shadow.card as object),
  },
  featImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  featTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  featBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, gap: 4 },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginBottom: 6,
  },
  catBadgeText: { fontFamily: fonts.bodySemi, fontSize: fontSize.xs, color: '#fff' },
  featTitle: { fontFamily: fonts.heading, fontSize: fontSize.xxl, color: '#fff', letterSpacing: -0.4 },
  featTagline: { fontFamily: fonts.body, fontSize: fontSize.sm, color: 'rgba(255,255,255,0.9)' },
  featMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  featMetaText: { fontFamily: fonts.body, fontSize: fontSize.xs, color: 'rgba(255,255,255,0.85)' },

  // Horizontal card
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
    gap: spacing.md,
    marginHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...(shadow.soft as object),
  },
  cardImg: { width: 104, height: 104, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  cardHeart: { position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: 14 },
  cardBody: { flex: 1, justifyContent: 'space-between', paddingVertical: 2, paddingRight: 4 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontFamily: fonts.heading, fontSize: fontSize.lg, color: colors.navy, letterSpacing: -0.3 },
  cardTagline: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLoc: { flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1 },
  cardLocText: { fontFamily: fonts.body, fontSize: fontSize.xs, color: colors.textMuted, flexShrink: 1 },

  // Compact
  compact: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...(shadow.soft as object),
  },
  compactImg: { width: '100%', height: 120, backgroundColor: colors.surfaceAlt },
  compactBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactBody: { padding: spacing.md, gap: 6 },
  compactTitle: { fontFamily: fonts.heading, fontSize: fontSize.md, color: colors.navy },
});
