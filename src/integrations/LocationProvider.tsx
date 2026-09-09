import React from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import {
  FALLBACK_LABEL,
  getLocationState,
  kmTo,
  labelFor,
  setLocationState,
  subscribeLocation,
} from './location-store';

function cityLabel(geo: Location.LocationGeocodedAddress) {
  const city = geo.city || geo.subregion || geo.district;
  const region = geo.region;
  if (city && region) return `${city}, ${region}`;
  return city || region || FALLBACK_LABEL;
}

export async function refreshLocation() {
  try {
    const current = await Location.getForegroundPermissionsAsync();
    let status = current.status;
    if (status !== 'granted') {
      const asked = await Location.requestForegroundPermissionsAsync();
      status = asked.status;
    }
    if (status !== 'granted') {
      setLocationState({
        ready: true,
        granted: false,
        coords: null,
        label: FALLBACK_LABEL,
      });
      return;
    }
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    let label = FALLBACK_LABEL;
    try {
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: next.lat,
        longitude: next.lng,
      });
      if (geo) label = cityLabel(geo);
    } catch {
      /* keep fallback city */
    }
    setLocationState({ ready: true, granted: true, coords: next, label });
  } catch {
    setLocationState({
      ready: true,
      granted: false,
      coords: null,
      label: FALLBACK_LABEL,
    });
  }
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    void refreshLocation();
  }, []);
  return <>{children}</>;
}

export function useLocation() {
  const snap = React.useSyncExternalStore(subscribeLocation, getLocationState, getLocationState);

  React.useEffect(() => {
    if (!getLocationState().ready) void refreshLocation();
  }, []);

  return {
    ...snap,
    kmTo,
    labelFor,
    refresh: refreshLocation,
  };
}

export async function openLocationSettings() {
  if (Platform.OS === 'web') {
    Alert.alert('Localização', 'Permita o acesso à localização no navegador.');
    return;
  }
  await Linking.openSettings();
}
