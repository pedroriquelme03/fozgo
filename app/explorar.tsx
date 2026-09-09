import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { BottomNav } from '../src/components/BottomNav';
import { LinearGradientView } from '../src/components/Gradient';
import { Rating, SectionHeader } from '../src/components/ui';

import {
  itineraries,
  itineraryById,
  makeCustomItinerary,
  addCustomItinerary,
  getCustomItineraries,
  subscribeCustomItineraries,
  Itinerary,
} from '../src/data/itineraries';
import { mustVisitPlaces, imperdiblePlaces, placeById, places } from '../src/data/places';
import { Place } from '../src/data/types';
import { colors } from '../src/theme/colors';
import { fonts, fontSize, radius, spacing, shadow } from '../src/theme/tokens';

export default function Explorar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { roteiro, novo } = useLocalSearchParams<{ roteiro?: string; novo?: string }>();
  const mine = React.useSyncExternalStore(subscribeCustomItineraries, getCustomItineraries, getCustomItineraries);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const composing = novo === '1';
  const itinerary = roteiro ? itineraryById(String(roteiro), mine) ?? null : null;

  React.useEffect(() => {
    setSelectedId(itinerary ? itinerary.stops[0]?.placeId ?? null : null);
  }, [itinerary]);

  const openPlace = (p: Place) => router.push(`/place/${p.id}`);
  const backHome = () => router.navigate('/explorar');

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          {itinerary || composing ? (
            <Pressable onPress={backHome} style={styles.backRow} hitSlop={8}>
              <Ionicons name="chevron-back" size={22} color={colors.navy} />
              <View>
                <Text style={styles.backHint}>Explorar</Text>
                <Text style={styles.title}>
                  {composing ? 'Novo roteiro' : itinerary?.title}
                </Text>
              </View>
            </Pressable>
          ) : (
            <>
              <Text style={styles.kicker}>Descubra Foz</Text>
              <Text style={styles.title}>Explorar</Text>
              <Text style={styles.subtitle}>Destaques, roteiros prontos ou monte o seu.</Text>
            </>
          )}
        </View>

        {composing ? (
          <Composer
            onCancel={backHome}
            onSave={(it) => {
              addCustomItinerary(it);
              router.navigate({ pathname: '/explorar', params: { roteiro: it.id } });
            }}
          />
        ) : itinerary ? (
          <ItineraryDetail itinerary={itinerary} selectedId={selectedId} onSelectStop={setSelectedId} onOpen={openPlace} />
        ) : (
          <>
            <View style={{ marginTop: spacing.md }}>
              <SectionHeader title="Você tem que ir" actionLabel="" />
              <Text style={styles.sectionHint}>Os mais visitados de Foz — vale encaixar na viagem.</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: spacing.xl, gap: spacing.lg }}
              >
                {mustVisitPlaces.map((p, i) => (
                  <HighlightCard
                    key={p.id}
                    place={p}
                    badge={i === 0 ? 'Você tem que ir' : p.rating >= 4.8 ? 'Imperdível' : 'Mais visitado'}
                    onPress={() => openPlace(p)}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={{ marginTop: spacing.xxl }}>
              <SectionHeader title="Imperdível" actionLabel="" />
              <Text style={styles.sectionHint}>Nota alta e fila de avaliações — o que a cidade recomenda.</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: spacing.xl, gap: spacing.md }}
              >
                {imperdiblePlaces.map((p) => (
                  <Pressable key={p.id} onPress={() => openPlace(p)} style={({ pressed }) => [styles.rateCard, pressed && { opacity: 0.92 }]}>
                    <Image source={p.photos[0]} style={styles.rateImg} contentFit="cover" />
                    <View style={styles.rateBadge}>
                      <Text style={styles.rateBadgeText}>Imperdível</Text>
                    </View>
                    <View style={styles.rateBody}>
                      <Text style={styles.rateName} numberOfLines={2}>
                        {p.name}
                      </Text>
                      <Rating value={p.rating} count={p.reviewsCount} size={fontSize.xs} />
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={{ marginTop: spacing.xxl }}>
              <SectionHeader title="Roteiros" actionLabel="" />
              <View style={{ gap: spacing.lg, paddingHorizontal: spacing.xl, marginTop: spacing.xs }}>
                <Pressable
                  onPress={() => router.setParams({ novo: '1' })}
                  style={({ pressed }) => [styles.addCard, pressed && { opacity: 0.9 }]}
                >
                  <View style={styles.addIcon}>
                    <Ionicons name="add" size={26} color={colors.tealDeep} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.addTitle}>Adicionar roteiro</Text>
                    <Text style={styles.addSub}>Escolha os lugares e a ordem. É o seu dia em Foz.</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
                </Pressable>

                {[...mine, ...itineraries].map((it) => (
                  <ItineraryCard key={it.id} itinerary={it} onPress={() => router.setParams({ roteiro: it.id })} />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <BottomNav active="explorar" />
    </View>
  );
}

function HighlightCard({ place, badge, onPress }: { place: Place; badge: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.hi, pressed && { transform: [{ scale: 0.98 }] }]}>
      <Image source={place.photos[0]} style={styles.hiImg} contentFit="cover" transition={200} />
      <LinearGradientView colors={['transparent', 'rgba(12,42,67,0.9)']} style={StyleSheet.absoluteFill} />
      <View style={styles.hiBadge}>
        <Text style={styles.hiBadgeText}>{badge}</Text>
      </View>
      <View style={styles.hiBody}>
        <Rating value={place.rating} count={place.reviewsCount} size={fontSize.xs} onDark />
        <Text style={styles.hiTitle} numberOfLines={2}>
          {place.name}
        </Text>
      </View>
    </Pressable>
  );
}

function ItineraryCard({ itinerary, onPress }: { itinerary: Itinerary; onPress: () => void }) {
  const cover = placeById(itinerary.coverPlaceId)?.photos[0];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.985 }] }]}>
      <View style={styles.cardImgWrap}>
        {cover ? (
          <Image source={cover} style={styles.cardImg} contentFit="cover" transition={200} />
        ) : (
          <View style={[styles.cardImg, { backgroundColor: itinerary.tint }]} />
        )}
        <LinearGradientView colors={['transparent', 'rgba(12,42,67,0.55)']} style={StyleSheet.absoluteFill} />
        <View style={[styles.cardBadge, { backgroundColor: itinerary.tint }]}>
          <Ionicons name={itinerary.icon} size={13} color={itinerary.color} />
          <Text style={[styles.cardBadgeText, { color: itinerary.color }]}>{itinerary.tag}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{itinerary.title}</Text>
        <Text style={styles.cardSub}>{itinerary.subtitle}</Text>
        <View style={styles.cardMeta}>
          <Meta icon="time-outline" label={itinerary.duration} />
          <Meta icon="flag-outline" label={`${itinerary.stops.length} paradas`} />
        </View>
      </View>
    </Pressable>
  );
}

function ItineraryDetail({
  itinerary,
  selectedId,
  onSelectStop,
  onOpen,
}: {
  itinerary: Itinerary;
  selectedId: string | null;
  onSelectStop: (id: string) => void;
  onOpen: (p: Place) => void;
}) {
  return (
    <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.md }}>
      <View style={[styles.detailTag, { backgroundColor: itinerary.tint }]}>
        <Ionicons name={itinerary.icon} size={14} color={itinerary.color} />
        <Text style={[styles.detailTagText, { color: itinerary.color }]}>{itinerary.tag}</Text>
      </View>
      <Text style={styles.subtitle}>{itinerary.description}</Text>
      <View style={[styles.cardMeta, { marginTop: spacing.md }]}>
        <Meta icon="time-outline" label={itinerary.duration} />
        <Meta icon="flag-outline" label={`${itinerary.stops.length} paradas`} />
      </View>

      <Text style={styles.timelineTitle}>Passo a passo</Text>
      {itinerary.stops.map((stop, i) => {
        const place = placeById(stop.placeId);
        if (!place) return null;
        const on = selectedId === place.id;
        const last = i === itinerary.stops.length - 1;
        return (
          <View key={stop.placeId} style={styles.stepRow}>
            <View style={styles.rail}>
              <View style={[styles.railDot, on && styles.railDotOn]}>
                <Text style={[styles.railNum, on && { color: '#fff' }]}>{i + 1}</Text>
              </View>
              {!last && <View style={styles.railLine} />}
            </View>
            <Pressable onPress={() => onSelectStop(place.id)} style={[styles.stepCard, on && styles.stepCardOn]}>
              <View style={styles.stepHead}>
                <Text style={styles.stepTime}>
                  {stop.time} · {stop.duration}
                </Text>
                <Pressable onPress={() => onOpen(place)} hitSlop={6}>
                  <Text style={styles.stepLink}>Ver local</Text>
                </Pressable>
              </View>
              <Text style={styles.stepName}>{place.name}</Text>
              <Text style={styles.stepTip}>{stop.tip}</Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

function Composer({ onCancel, onSave }: { onCancel: () => void; onSave: (it: Itinerary) => void }) {
  const [title, setTitle] = React.useState('');
  const [picked, setPicked] = React.useState<string[]>([]);

  const toggle = (id: string) =>
    setPicked((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const canSave = picked.length >= 2;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.md }}>
        <Text style={styles.subtitle}>Dê um nome e toque nos lugares na ordem em que quer visitar.</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ex.: Domingo em Foz"
          placeholderTextColor={colors.textFaint}
          style={styles.input}
        />
        <Text style={styles.pickCount}>
          {picked.length === 0 ? 'Nenhuma parada ainda' : `${picked.length} ${picked.length === 1 ? 'parada' : 'paradas'} · toque de novo para tirar`}
        </Text>
      </View>

      <View style={{ gap: spacing.sm, paddingHorizontal: spacing.xl, marginTop: spacing.md }}>
        {places.map((p) => {
          const order = picked.indexOf(p.id);
          const on = order >= 0;
          return (
            <Pressable key={p.id} onPress={() => toggle(p.id)} style={[styles.pickRow, on && styles.pickRowOn]}>
              <Image source={p.photos[0]} style={styles.pickImg} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <Text style={styles.pickName} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={styles.pickMeta} numberOfLines={1}>
                  {p.neighborhood} · {p.rating.toFixed(1)}
                </Text>
              </View>
              <View style={[styles.pickCheck, on && styles.pickCheckOn]}>
                {on ? <Text style={styles.pickNum}>{order + 1}</Text> : <Ionicons name="add" size={16} color={colors.textFaint} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.composerActions}>
        <Pressable onPress={onCancel} style={styles.ghostBtn}>
          <Text style={styles.ghostBtnText}>Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={() => canSave && onSave(makeCustomItinerary(title, picked))}
          style={[styles.saveBtn, !canSave && { opacity: 0.45 }]}
          disabled={!canSave}
        >
          <Text style={styles.saveBtnText}>Salvar roteiro</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Meta({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.meta}>
      <Ionicons name={icon} size={14} color={colors.textMuted} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
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
  backRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  backHint: { fontFamily: fonts.bodyMedium, fontSize: fontSize.xs, color: colors.teal, marginTop: 2 },
  sectionHint: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    paddingHorizontal: spacing.xl,
    marginTop: -4,
    marginBottom: spacing.md,
  },

  hi: {
    width: 220,
    height: 280,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    ...(shadow.card as object),
  },
  hiImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  hiBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.pin,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  hiBadgeText: { fontFamily: fonts.bodySemi, fontSize: fontSize.xs, color: '#fff' },
  hiBody: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.lg, gap: 6 },
  hiTitle: { fontFamily: fonts.heading, fontSize: fontSize.lg, color: '#fff', letterSpacing: -0.3 },

  rateCard: {
    width: 168,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...(shadow.soft as object),
  },
  rateImg: { width: '100%', height: 110, backgroundColor: colors.surfaceAlt },
  rateBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.navy,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  rateBadgeText: { fontFamily: fonts.bodySemi, fontSize: 10, color: '#fff' },
  rateBody: { padding: spacing.md, gap: 6 },
  rateName: { fontFamily: fonts.heading, fontSize: fontSize.sm, color: colors.navy },

  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  addIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTitle: { fontFamily: fonts.heading, fontSize: fontSize.lg, color: colors.navy },
  addSub: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...(shadow.card as object),
  },
  cardImgWrap: { height: 132 },
  cardImg: { width: '100%', height: '100%' },
  cardBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  cardBadgeText: { fontFamily: fonts.bodySemi, fontSize: fontSize.xs },
  cardBody: { padding: spacing.lg, gap: 4 },
  cardTitle: { fontFamily: fonts.heading, fontSize: fontSize.xl, color: colors.navy, letterSpacing: -0.3 },
  cardSub: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted },
  cardMeta: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: colors.textMuted },

  detailTag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
  },
  detailTagText: { fontFamily: fonts.bodySemi, fontSize: fontSize.xs },
  timelineTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSize.lg,
    color: colors.navy,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  stepRow: { flexDirection: 'row', gap: spacing.md },
  rail: { width: 28, alignItems: 'center' },
  railDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  railDotOn: { backgroundColor: colors.teal },
  railNum: { fontFamily: fonts.heading, fontSize: fontSize.sm, color: colors.tealDeep },
  railLine: { flex: 1, width: 2, backgroundColor: colors.borderStrong, marginVertical: 4 },
  stepCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  stepCardOn: { borderColor: colors.teal, backgroundColor: colors.tealSoft },
  stepHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepTime: { fontFamily: fonts.bodySemi, fontSize: fontSize.xs, color: colors.tealDeep },
  stepLink: { fontFamily: fonts.bodySemi, fontSize: fontSize.xs, color: colors.teal },
  stepName: { fontFamily: fonts.heading, fontSize: fontSize.md, color: colors.navy, marginTop: 4 },
  stepTip: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted, marginTop: 4, lineHeight: 18 },

  input: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    height: 52,
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    color: colors.text,
  },
  pickCount: { fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: colors.tealDeep, marginTop: spacing.md },
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  pickRowOn: { borderColor: colors.teal, backgroundColor: colors.tealSoft },
  pickImg: { width: 48, height: 48, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt },
  pickName: { fontFamily: fonts.bodySemi, fontSize: fontSize.sm, color: colors.navy },
  pickMeta: { fontFamily: fonts.body, fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  pickCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickCheckOn: { backgroundColor: colors.teal, borderColor: colors.teal },
  pickNum: { fontFamily: fonts.heading, fontSize: fontSize.sm, color: '#fff' },
  composerActions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  ghostBtn: {
    flex: 1,
    height: 48,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtnText: { fontFamily: fonts.bodySemi, fontSize: fontSize.md, color: colors.textMuted },
  saveBtn: {
    flex: 1.4,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { fontFamily: fonts.bodySemi, fontSize: fontSize.md, color: '#fff' },
});
