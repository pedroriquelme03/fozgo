import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../favorites/FavoritesProvider';
import { colors } from '../theme/colors';

export function FavoriteHeart({
  placeId,
  size = 18,
  style,
}: {
  placeId: string;
  size?: number;
  style?: ViewStyle;
}) {
  const { isFavorite, toggle } = useFavorites();
  const on = isFavorite(placeId);

  return (
    <Pressable
      onPress={() => toggle(placeId)}
      hitSlop={8}
      style={({ pressed }) => [styles.wrap, style, pressed && { opacity: 0.8 }]}
    >
      <Ionicons name={on ? 'heart' : 'heart-outline'} size={size} color={on ? colors.danger : colors.navy} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
