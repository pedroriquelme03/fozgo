import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { placeById } from '../../src/data/places';
import { categoryById } from '../../src/data/categories';
import { Rating, PriceLevel, Tag } from '../../src/components/ui';
import { LinearGradientView } from '../../src/components/Gradient';
import { useFavorites } from '../../src/favorites/FavoritesProvider';
import { useLocation } from '../../src/integrations/LocationProvider';
import { ReviewsSection } from '../../src/components/ReviewsSection';
import {
  InfoRow,
  MapCard,
  Menu,
  callPhone,
  openMaps,
  openWhatsApp,
  sharePlace,
} from '../../src/components/PlaceDetailParts';
import { colors } from '../../src/theme/colors';
import { fonts, fontSize, radius, spacing, shadow } from '../../src/theme/tokens';

export default function PlaceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [photo, setPhoto] = React.useState(0);
  const { isFavorite, toggle } = useFavorites();
  const { labelFor } = useLocation();

  const place = placeById(String(id));
  if (!place) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.nfText}>Local não encontrado.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.nfLink}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const cat = categoryById(place.category);
  const galleryW = Math.min(width, 900);
  const isFood = place.category === 'restaurantes' || place.category === 'cafes' || place.category === 'bares';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}>
        {/* ── Galeria ── */}
        <View style={{ height: 320 }}>
          <FlatList
            data={place.photos}
            keyExtractor={(u, i) => u + i}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setPhoto(Math.round(e.nativeEvent.contentOffset.x / galleryW))}
            renderItem={({ item }) => (
              <Image source={item} style={{ width: galleryW, height: 320 }} contentFit="cover" transition={200} />
            )}
          />
          <LinearGradientView colors={['rgba(12,42,67,0.45)', 'transparent']} style={styles.topScrim} />
          {/* dots */}
          <View style={styles.dots}>
            {place.photos.map((_, i) => (
              <View key={i} style={[styles.dot, i === photo && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* ── Corpo ── */}
        <View style={styles.body}>
          <View style={styles.headRow}>
            <View style={[styles.catBadge, { backgroundColor: cat.tint }]}>
              <Ionicons name={cat.icon as keyof typeof Ionicons.glyphMap} size={13} color={cat.base} />
              <Text style={[styles.catBadgeText, { color: cat.base }]}>{cat.label}</Text>
            </View>
            <PriceLevel level={place.priceRange} size={fontSize.md} />
          </View>

          <Text style={styles.name}>{place.name}</Text>
          <Text style={styles.tagline}>{place.tagline}</Text>

          <View style={styles.metaRow}>
            <Rating value={place.rating} count={place.reviewsCount} size={fontSize.md} />
            <View style={styles.metaDot} />
            <View style={styles.metaLoc}>
              <Ionicons name="location-outline" size={15} color={colors.textMuted} />
              <Text style={styles.metaLocText}>{labelFor(place)}</Text>
            </View>
          </View>

          {/* tags */}
          <View style={styles.tags}>
            {place.tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </View>

          {/* Ações rápidas de contato */}
          <View style={styles.quickRow}>
            <QuickAction icon="navigate" label="Rotas" onPress={() => openMaps(place)} />
            {place.phone && <QuickAction icon="call" label="Ligar" onPress={() => callPhone(place.phone)} />}
            {place.whatsapp && (
              <QuickAction icon="logo-whatsapp" label="WhatsApp" onPress={() => openWhatsApp(place.whatsapp, place.name)} />
            )}
            <QuickAction icon="share-social" label="Compartilhar" onPress={() => void sharePlace(place)} />
          </View>

          <Divider />

          {/* Sobre */}
          <Section title="Sobre">
            <Text style={styles.desc}>{place.description}</Text>
          </Section>

          {/* Informações */}
          <Section title="Informações">
            <InfoRow icon="time-outline" title="Horário de funcionamento">
              <View style={{ marginTop: 2, gap: 2 }}>
                {place.hours.map((h) => (
                  <Text key={h.label} style={styles.hoursText}>
                    <Text style={{ fontFamily: fonts.bodySemi, color: colors.text }}>{h.label}:</Text> {h.value}
                  </Text>
                ))}
              </View>
            </InfoRow>
            <InfoRow icon="location-outline" title="Endereço" onPress={() => openMaps(place)} actionIcon="open-outline">
              {place.address}
            </InfoRow>
            {place.phone && (
              <InfoRow icon="call-outline" title="Telefone" onPress={() => callPhone(place.phone)} actionIcon="call">
                {place.phone}
              </InfoRow>
            )}
            {place.socials && (
              <InfoRow icon="at-outline" title="Redes sociais">
                <View style={styles.socials}>
                  {place.socials.instagram && <SocialChip icon="logo-instagram" label={place.socials.instagram} />}
                  {place.socials.facebook && <SocialChip icon="logo-facebook" label={place.socials.facebook} />}
                  {place.socials.website && <SocialChip icon="globe-outline" label={place.socials.website} />}
                </View>
              </InfoRow>
            )}
          </Section>

          {/* Localização / mapa */}
          <Section title="Localização">
            <MapCard place={place} />
            {place.howToArrive && (
              <View style={styles.howTo}>
                <Ionicons name="bus-outline" size={16} color={colors.tealDeep} />
                <Text style={styles.howToText}>{place.howToArrive}</Text>
              </View>
            )}
          </Section>

          {/* Ingresso / info importante (pontos turísticos e passeios) */}
          {place.ticket && (
            <Section title="Ingresso">
              <View style={styles.ticket}>
                <Ionicons name="pricetag" size={18} color={colors.pin} />
                <Text style={styles.ticketText}>{place.ticket}</Text>
              </View>
            </Section>
          )}
          {place.importantInfo && place.importantInfo.length > 0 && (
            <Section title="Informações importantes">
              <View style={{ gap: spacing.sm }}>
                {place.importantInfo.map((info, i) => (
                  <View key={i} style={styles.bullet}>
                    <Ionicons name="checkmark-circle" size={17} color={colors.teal} />
                    <Text style={styles.bulletText}>{info}</Text>
                  </View>
                ))}
              </View>
            </Section>
          )}

          {/* Cardápio (restaurantes/cafés/bares) */}
          {isFood && place.menu && place.menu.length > 0 && (
            <Section title="Cardápio">
              <Menu sections={place.menu} />
            </Section>
          )}

          {/* Formas de pagamento */}
          {place.paymentMethods && place.paymentMethods.length > 0 && (
            <Section title="Formas de pagamento">
              <View style={styles.tags}>
                {place.paymentMethods.map((m) => (
                  <View key={m} style={styles.payChip}>
                    <Ionicons name="card-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.payText}>{m}</Text>
                  </View>
                ))}
              </View>
            </Section>
          )}

          <View style={{ marginTop: spacing.xl }}>
            <ReviewsSection place={place} />
          </View>
        </View>
      </ScrollView>

      {/* ── Top bar flutuante ── */}
      <View style={[styles.topBar, { top: insets.top + spacing.sm }]}>
        <FloatBtn icon="arrow-back" onPress={() => router.back()} />
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <FloatBtn icon={isFavorite(place.id) ? 'heart' : 'heart-outline'} color={isFavorite(place.id) ? colors.danger : colors.navy} onPress={() => toggle(place.id)} />
          <FloatBtn icon="share-social-outline" onPress={() => void sharePlace(place)} />
        </View>
      </View>

      {/* ── Barra de ação fixa ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <View>
          <Text style={styles.bottomLabel}>{isFood ? 'A partir de' : 'Entrada'}</Text>
          <Text style={styles.bottomPrice}>{bottomPrice(place)}</Text>
        </View>
        <Pressable
          style={styles.cta}
          onPress={() => (place.whatsapp ? openWhatsApp(place.whatsapp, place.name) : openMaps(place))}
        >
          <Ionicons name={isFood ? 'restaurant' : 'navigate'} size={18} color="#fff" />
          <Text style={styles.ctaText}>{isFood ? 'Reservar mesa' : 'Como chegar'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function bottomPrice(place: ReturnType<typeof placeById>) {
  if (!place) return '';
  if (place.ticket) return place.ticket.split('—')[0].replace('A partir de', '').trim();
  return `${'$'.repeat(place.priceRange)} · por pessoa`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: spacing.xl }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function QuickAction({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.quick, pressed && { opacity: 0.7 }]} onPress={onPress}>
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={20} color={colors.tealDeep} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

function FloatBtn({ icon, onPress, color = colors.navy }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void; color?: string }) {
  return (
    <Pressable style={styles.floatBtn} onPress={onPress}>
      <Ionicons name={icon} size={20} color={color} />
    </Pressable>
  );
}

function SocialChip({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.socialChip}>
      <Ionicons name={icon} size={15} color={colors.tealDeep} />
      <Text style={styles.socialText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.background },
  nfText: { fontFamily: fonts.body, color: colors.textMuted },
  nfLink: { fontFamily: fonts.bodySemi, color: colors.teal },

  topScrim: { position: 'absolute', top: 0, left: 0, right: 0, height: 90 },
  dots: { position: 'absolute', bottom: spacing.xxl, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.55)' },
  dotActive: { width: 20, backgroundColor: '#fff' },

  body: {
    backgroundColor: colors.background,
    marginTop: -spacing.xxl,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  catBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  catBadgeText: { fontFamily: fonts.bodySemi, fontSize: fontSize.xs },
  name: { fontFamily: fonts.display, fontSize: fontSize.xxxl, color: colors.navy, letterSpacing: -0.6, marginTop: spacing.md, lineHeight: fontSize.xxxl + 2 },
  tagline: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.textMuted, marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong },
  metaLoc: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaLocText: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },

  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xl },
  quick: { alignItems: 'center', gap: 6, flex: 1 },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { fontFamily: fonts.bodyMedium, fontSize: fontSize.xs, color: colors.textMuted },

  divider: { height: 1, backgroundColor: colors.border, marginTop: spacing.xl },
  sectionTitle: { fontFamily: fonts.heading, fontSize: fontSize.xl, color: colors.navy, letterSpacing: -0.3, marginBottom: spacing.md },
  desc: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.text, lineHeight: 23 },
  hoursText: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted },

  socials: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: 6 },
  socialChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.tealSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  socialText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.xs, color: colors.tealDeep },

  howTo: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, backgroundColor: colors.tealSoft, padding: spacing.md, borderRadius: radius.md },
  howToText: { flex: 1, fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },

  ticket: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: '#EAF8EE', padding: spacing.lg, borderRadius: radius.md },
  ticketText: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: colors.text },
  bullet: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  bulletText: { flex: 1, fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },

  payChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  payText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.xs, color: colors.textMuted },

  review: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  reviewHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.heading, fontSize: fontSize.md, color: '#fff' },
  reviewAuthor: { fontFamily: fonts.bodySemi, fontSize: fontSize.sm, color: colors.navy },
  reviewDate: { fontFamily: fonts.body, fontSize: fontSize.xs, color: colors.textFaint },
  reviewText: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },

  topBar: { position: 'absolute', left: spacing.xl, right: spacing.xl, flexDirection: 'row', justifyContent: 'space-between' },
  floatBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...(shadow.soft as object),
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    ...(shadow.lifted as object),
  },
  bottomLabel: { fontFamily: fonts.body, fontSize: fontSize.xs, color: colors.textMuted },
  bottomPrice: { fontFamily: fonts.heading, fontSize: fontSize.lg, color: colors.navy },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.teal,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  ctaText: { fontFamily: fonts.bodySemi, fontSize: fontSize.md, color: '#fff' },
});
