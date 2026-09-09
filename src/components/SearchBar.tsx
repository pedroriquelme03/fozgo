import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts, fontSize, radius, spacing, shadow } from '../theme/tokens';

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar restaurantes, passeios...',
  onFilterPress,
  showFilter = true,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  showFilter?: boolean;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.field}>
        <Ionicons name="search" size={19} color={colors.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textFaint}
          style={[styles.input, Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChangeText('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textFaint} />
          </Pressable>
        )}
      </View>
      {showFilter && (
        <Pressable
          style={({ pressed }) => [styles.filterBtn, pressed && { opacity: 0.85 }]}
          onPress={onFilterPress}
        >
          <Ionicons name="options" size={22} color={colors.onPrimary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xl },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    ...(shadow.soft as object),
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    color: colors.text,
    height: '100%',
  },
  filterBtn: {
    width: 54,
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    ...(shadow.soft as object),
  },
});
