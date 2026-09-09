import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradientView } from './Gradient';
import { colors } from '../theme/colors';
import { fonts, fontSize, radius, spacing, shadow } from '../theme/tokens';

type Cond = 'sunny' | 'partly' | 'cloudy' | 'rain' | 'storm';

const icon: Record<Cond, keyof typeof Ionicons.glyphMap> = {
  sunny: 'sunny',
  partly: 'partly-sunny',
  cloudy: 'cloud',
  rain: 'rainy',
  storm: 'thunderstorm',
};
const label: Record<Cond, string> = {
  sunny: 'Ensolarado',
  partly: 'Parcialmente nublado',
  cloudy: 'Nublado',
  rain: 'Chuva',
  storm: 'Tempestade',
};

// Mock — previsão para Foz do Iguaçu
const today = { cond: 'partly' as Cond, temp: 27, feels: 29, min: 16, max: 28, rain: 20, humidity: 62, wind: 12 };
const hourly = [
  { h: 'Agora', t: 27, c: 'partly' as Cond },
  { h: '15h', t: 28, c: 'sunny' as Cond },
  { h: '16h', t: 28, c: 'sunny' as Cond },
  { h: '17h', t: 26, c: 'partly' as Cond },
  { h: '18h', t: 24, c: 'cloudy' as Cond },
  { h: '19h', t: 22, c: 'cloudy' as Cond },
  { h: '20h', t: 21, c: 'rain' as Cond },
];
const week = [
  { d: 'Hoje', c: 'partly' as Cond, min: 16, max: 28, rain: 20 },
  { d: 'Seg', c: 'sunny' as Cond, min: 15, max: 29, rain: 5 },
  { d: 'Ter', c: 'sunny' as Cond, min: 17, max: 31, rain: 0 },
  { d: 'Qua', c: 'rain' as Cond, min: 18, max: 25, rain: 80 },
  { d: 'Qui', c: 'storm' as Cond, min: 17, max: 23, rain: 90 },
  { d: 'Sex', c: 'cloudy' as Cond, min: 16, max: 26, rain: 40 },
  { d: 'Sáb', c: 'partly' as Cond, min: 15, max: 28, rain: 15 },
];

export function WeatherPanel() {
  return (
    <View style={styles.container}>
      {/* Card atual */}
      <LinearGradientView colors={[colors.tealDeep, '#0284C7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <View style={styles.cityRow}>
              <Ionicons name="location" size={15} color="#fff" />
              <Text style={styles.city}>Foz do Iguaçu, PR</Text>
            </View>
            <Text style={styles.cond}>{label[today.cond]}</Text>
          </View>
          <Ionicons name={icon[today.cond]} size={64} color="#fff" />
        </View>
        <View style={styles.tempRow}>
          <Text style={styles.temp}>{today.temp}°</Text>
          <View style={styles.tempMeta}>
            <Text style={styles.tempMetaText}>Sensação {today.feels}°</Text>
            <Text style={styles.tempMetaText}>
              Máx {today.max}° · Mín {today.min}°
            </Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <Stat icon="rainy-outline" label="Chuva" value={`${today.rain}%`} />
          <Stat icon="water-outline" label="Umidade" value={`${today.humidity}%`} />
          <Stat icon="navigate-outline" label="Vento" value={`${today.wind} km/h`} />
        </View>
      </LinearGradientView>

      {/* Por hora */}
      <Text style={styles.blockTitle}>Ao longo do dia</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourScroll}>
        {hourly.map((h, i) => (
          <View key={i} style={[styles.hourCard, i === 0 && styles.hourCardActive]}>
            <Text style={[styles.hourLabel, i === 0 && { color: '#fff' }]}>{h.h}</Text>
            <Ionicons name={icon[h.c]} size={24} color={i === 0 ? '#fff' : colors.tealDeep} />
            <Text style={[styles.hourTemp, i === 0 && { color: '#fff' }]}>{h.t}°</Text>
          </View>
        ))}
      </ScrollView>

      {/* Próximos dias */}
      <Text style={styles.blockTitle}>Próximos 7 dias</Text>
      <View style={styles.weekCard}>
        {week.map((d, i) => (
          <View key={i} style={[styles.weekRow, i < week.length - 1 && styles.weekDivider]}>
            <Text style={styles.weekDay}>{d.d}</Text>
            <View style={styles.weekRain}>
              <Ionicons name="water" size={12} color="#0284C7" />
              <Text style={styles.weekRainText}>{d.rain}%</Text>
            </View>
            <Ionicons name={icon[d.c]} size={22} color={colors.tealDeep} style={{ width: 40, textAlign: 'center' }} />
            <Text style={styles.weekTemp}>
              <Text style={styles.weekMax}>{d.max}°</Text> <Text style={styles.weekMin}>{d.min}°</Text>
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.tip}>
        <Ionicons name="bulb-outline" size={16} color={colors.tealDeep} />
        <Text style={styles.tipText}>
          Dica: leve capa de chuva para as Cataratas — na Garganta do Diabo você se molha em qualquer clima.
        </Text>
      </View>
    </View>
  );
}

function Stat({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={17} color="rgba(255,255,255,0.9)" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.xl, gap: spacing.lg },
  hero: { borderRadius: radius.xl, padding: spacing.xl, ...(shadow.card as object) },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  city: { fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: '#fff' },
  cond: { fontFamily: fonts.medium, fontSize: fontSize.md, color: 'rgba(255,255,255,0.95)', marginTop: 4 },
  tempRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.sm },
  temp: { fontFamily: fonts.display, fontSize: 68, color: '#fff', letterSpacing: -2 },
  tempMeta: { gap: 2 },
  tempMetaText: { fontFamily: fonts.body, fontSize: fontSize.sm, color: 'rgba(255,255,255,0.9)' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  stat: { alignItems: 'center', gap: 3, flex: 1 },
  statValue: { fontFamily: fonts.bodySemi, fontSize: fontSize.md, color: '#fff' },
  statLabel: { fontFamily: fonts.body, fontSize: fontSize.xs, color: 'rgba(255,255,255,0.8)' },

  blockTitle: { fontFamily: fonts.heading, fontSize: fontSize.lg, color: colors.navy, marginTop: spacing.xs },
  hourScroll: { gap: spacing.sm, paddingVertical: 2 },
  hourCard: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hourCardActive: { backgroundColor: colors.teal, borderColor: colors.teal },
  hourLabel: { fontFamily: fonts.bodyMedium, fontSize: fontSize.xs, color: colors.textMuted },
  hourTemp: { fontFamily: fonts.bodySemi, fontSize: fontSize.md, color: colors.navy },

  weekCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...(shadow.soft as object),
  },
  weekRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  weekDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  weekDay: { fontFamily: fonts.bodySemi, fontSize: fontSize.sm, color: colors.navy, width: 56 },
  weekRain: { flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1 },
  weekRainText: { fontFamily: fonts.body, fontSize: fontSize.xs, color: '#0284C7' },
  weekTemp: { width: 80, textAlign: 'right' },
  weekMax: { fontFamily: fonts.bodySemi, fontSize: fontSize.sm, color: colors.navy },
  weekMin: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textFaint },

  tip: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.tealSoft,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'flex-start',
  },
  tipText: { flex: 1, fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },
});
