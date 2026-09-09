import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradientView } from './Gradient';
import { Place, MenuSection } from '../data/types';
import { colors } from '../theme/colors';
import { fonts, fontSize, radius, spacing, shadow } from '../theme/tokens';

const brl = (n: number) => `R$ ${n.toFixed(2).replace('.', ',')}`;

export function openMaps(place: Place) {
  const { lat, lng } = place.coords;
  const label = encodeURIComponent(place.name);
  const url = Platform.select({
    ios: `http://maps.apple.com/?q=${label}&ll=${lat},${lng}`,
    default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  });
  Linking.openURL(url!);
}

export function openWhatsApp(number?: string, name?: string) {
  if (!number) return;
  const msg = encodeURIComponent(`Olá! Vi o ${name ?? 'local'} no FozGo e gostaria de mais informações.`);
  Linking.openURL(`https://wa.me/${number}?text=${msg}`);
}

/** Bloco de informação com ícone. */
export function InfoRow({
  icon,
  title,
  children,
  onPress,
  actionIcon,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children?: React.ReactNode;
  onPress?: () => void;
  actionIcon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.tealDeep} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{title}</Text>
        {typeof children === 'string' ? <Text style={styles.infoText}>{children}</Text> : children}
      </View>
      {onPress && <Ionicons name={actionIcon ?? 'chevron-forward'} size={18} color={colors.textFaint} />}
    </Pressable>
  );
}

/** Card de mapa estático com botão para abrir no app de mapas. */
export function MapCard({ place }: { place: Place }) {
  return (
    <Pressable style={styles.map} onPress={() => openMaps(place)}>
      <LinearGradientView colors={['#DCEFF2', '#C7E6EB']} style={StyleSheet.absoluteFill} />
      {/* grade decorativa simulando ruas */}
      <View style={styles.mapGrid}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={`h${i}`} style={[styles.mapLine, { top: `${18 * (i + 1)}%` }]} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={`v${i}`} style={[styles.mapLineV, { left: `${15 * (i + 1)}%` }]} />
        ))}
      </View>
      <View style={styles.mapPin}>
        <Ionicons name="location" size={34} color={colors.teal} />
      </View>
      <View style={styles.mapBtn}>
        <Ionicons name="navigate" size={15} color="#fff" />
        <Text style={styles.mapBtnText}>Abrir no mapa</Text>
      </View>
    </Pressable>
  );
}

/** Cardápio dividido em seções. */
export function Menu({ sections }: { sections: MenuSection[] }) {
  const [open, setOpen] = React.useState<string>(sections[0]?.title ?? '');
  return (
    <View>
      {/* Abas de categorias do cardápio */}
      <View style={styles.menuTabs}>
        {sections.map((s) => {
          const active = open === s.title;
          return (
            <Pressable key={s.title} onPress={() => setOpen(s.title)} style={[styles.menuTab, active && styles.menuTabActive]}>
              <Text style={[styles.menuTabText, active && styles.menuTabTextActive]}>{s.title}</Text>
            </Pressable>
          );
        })}
      </View>

      {sections
        .filter((s) => s.title === open)
        .map((s) => (
          <View key={s.title} style={{ gap: spacing.md }}>
            {s.items.map((item) => (
              <View key={item.name} style={styles.menuItem}>
                {item.photo && (
                  <Image source={item.photo} style={styles.menuImg} contentFit="cover" transition={150} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  {item.description && <Text style={styles.menuDesc}>{item.description}</Text>}
                  <Text style={styles.menuPrice}>{brl(item.price)}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: { fontFamily: fonts.bodySemi, fontSize: fontSize.sm, color: colors.navy },
  infoText: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted, marginTop: 1 },

  map: {
    height: 150,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginTop: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapGrid: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  mapLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.6)' },
  mapLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.6)' },
  mapPin: { ...(shadow.soft as object) },
  mapBtn: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  mapBtnText: { fontFamily: fonts.bodySemi, fontSize: fontSize.xs, color: '#fff' },

  menuTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  menuTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuTabActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  menuTabText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: colors.textMuted },
  menuTabTextActive: { color: '#fff' },
  menuItem: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  menuImg: { width: 72, height: 72, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt },
  menuName: { fontFamily: fonts.bodySemi, fontSize: fontSize.md, color: colors.navy },
  menuDesc: { fontFamily: fonts.body, fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  menuPrice: { fontFamily: fonts.bodySemi, fontSize: fontSize.md, color: colors.tealDeep, marginTop: 6 },
});

export { brl };
