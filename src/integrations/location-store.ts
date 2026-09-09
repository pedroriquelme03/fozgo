import { Place } from '../data/types';
import { Coords, distanceLabel, distanceOf } from './geo';

const FALLBACK_LABEL = 'Foz do Iguaçu, PR';

type LocationState = {
  ready: boolean;
  coords: Coords | null;
  label: string;
  granted: boolean;
};

let state: LocationState = {
  ready: false,
  coords: null,
  label: FALLBACK_LABEL,
  granted: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function getLocationState() {
  return state;
}

export function setLocationState(patch: Partial<LocationState>) {
  state = { ...state, ...patch };
  emit();
}

export function subscribeLocation(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function kmTo(place: Place) {
  return distanceOf(place, state.coords);
}

export function labelFor(place: Place) {
  return distanceLabel(place, state.coords);
}

export { FALLBACK_LABEL };
