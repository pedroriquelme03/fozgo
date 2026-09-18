import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FOZ_CENTER } from '../integrations/geo';
import { colors } from '../theme/colors';

export { FOZ_CENTER as FOZ };

export function googleMapsHereUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function NearYouMap({ lat, lng }: { lat?: number | null; lng?: number | null }) {
  const point = {
    lat: lat ?? FOZ_CENTER.lat,
    lng: lng ?? FOZ_CENTER.lng,
  };
  return (
    <View style={styles.fill}>
      {React.createElement('iframe', {
        key: `${point.lat},${point.lng}`,
        src: `https://www.google.com/maps?q=${point.lat},${point.lng}&z=15&output=embed`,
        title: 'Near You',
        width: '100%',
        height: '100%',
        style: { border: 0, display: 'block', width: '100%', height: '100%' },
        loading: 'lazy',
        referrerPolicy: 'no-referrer-when-downgrade',
        allowFullScreen: true,
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
  },
});
