import { Alert, Platform, Share } from 'react-native';
import * as Linking from 'expo-linking';
import { Place } from '../data/types';

function digits(value: string) {
  return value.replace(/\D/g, '');
}

async function openUrl(url: string, fail = 'Não foi possível abrir o app.') {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('FozGo', fail);
  }
}

export function appleMapsUrl(place: Place) {
  const { lat, lng } = place.coords;
  const q = encodeURIComponent(place.name);
  return `http://maps.apple.com/?daddr=${lat},${lng}&q=${q}&dirflg=d`;
}

export function googleMapsUrl(place: Place) {
  const { lat, lng } = place.coords;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

/** iOS: Apple Maps ou Google Maps. Android/web: Google Maps. */
export function openMaps(place: Place) {
  if (Platform.OS === 'ios') {
    Alert.alert('Como chegar', place.name, [
      { text: 'Apple Maps', onPress: () => void openUrl(appleMapsUrl(place), 'Apple Maps não abriu.') },
      { text: 'Google Maps', onPress: () => void openUrl(googleMapsUrl(place), 'Google Maps não abriu.') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
    return;
  }
  void openUrl(googleMapsUrl(place), 'Google Maps não abriu.');
}

export function openWhatsApp(number?: string, name?: string) {
  if (!number) return;
  const phone = digits(number);
  const msg = encodeURIComponent(`Olá! Vi o ${name ?? 'local'} no FozGo e gostaria de mais informações.`);
  void openUrl(`https://wa.me/${phone}?text=${msg}`, 'WhatsApp não está disponível neste aparelho.');
}

export function callPhone(phone?: string) {
  if (!phone) return;
  void openUrl(`tel:${digits(phone)}`, 'Não foi possível abrir o discador.');
}

export async function sharePlace(place: Place) {
  const url = Linking.createURL(`/place/${place.id}`);
  const text = `Olha este lugar no FozGo: ${place.name}\n${place.tagline}\n${place.address}`;
  try {
    await Share.share(
      Platform.OS === 'ios'
        ? { title: place.name, message: text, url }
        : { title: place.name, message: `${text}\n${url}` },
    );
  } catch {
    Alert.alert('Compartilhar', 'Não foi possível abrir o compartilhamento.');
  }
}
