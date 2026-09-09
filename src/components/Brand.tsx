import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/tokens';

/** Logotipo textual "FozGo" reproduzindo a marca (FOZ navy + GO teal + pin). */
export function Logo({ size = 26, onDark = false }: { size?: number; onDark?: boolean }) {
  const foz = onDark ? '#FFFFFF' : colors.navy;
  return (
    <View style={styles.row}>
      <Text style={[styles.word, { fontSize: size, color: foz }]}>Foz</Text>
      <Text style={[styles.word, { fontSize: size, color: colors.teal }]}>Go</Text>
      <View style={[styles.pinDot, { top: size * 0.05 }]}>
        <Ionicons name="location" size={size * 0.7} color={colors.teal} />
        <View style={styles.pinInner} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  word: { fontFamily: fonts.display, letterSpacing: -0.5 },
  pinDot: { marginLeft: -2, alignItems: 'center', justifyContent: 'center' },
  pinInner: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.pin,
    top: '30%',
  },
});
