import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
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
      <MapView
        key={`${point.lat},${point.lng}`}
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: point.lat,
          longitude: point.lng,
          latitudeDelta: 0.035,
          longitudeDelta: 0.035,
        }}
        scrollEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        zoomEnabled={false}
      >
        <Marker coordinate={{ latitude: point.lat, longitude: point.lng }} title="You" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
  },
});
