import { Place } from '../data/types';

export type Coords = { lat: number; lng: number };

const EARTH_KM = 6371;

export function haversineKm(a: Coords, b: Coords) {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function formatKm(km: number) {
  if (km < 0.1) return 'perto';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function distanceOf(place: Place, origin: Coords | null) {
  if (origin) return haversineKm(origin, place.coords);
  return place.distanceKm ?? 99;
}

export function distanceLabel(place: Place, origin: Coords | null) {
  const km = origin ? haversineKm(origin, place.coords) : place.distanceKm;
  if (km == null) return place.neighborhood;
  return `${place.neighborhood} · ${formatKm(km)}`;
}
