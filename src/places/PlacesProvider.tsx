import React from 'react';
import { places as fallbackPlaces } from '../data/places';
import { Place } from '../data/types';
import { fetchRemotePlaces } from './remote';

function derive(list: Place[]) {
  return {
    featuredPlaces: list.filter((p) => p.featured),
    mustVisitPlaces: [...list].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 8),
    imperdiblePlaces: [...list]
      .filter((p) => p.rating >= 4.7)
      .sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount)
      .slice(0, 8),
  };
}

type PlacesContextValue = {
  ready: boolean;
  places: Place[];
  featuredPlaces: Place[];
  mustVisitPlaces: Place[];
  imperdiblePlaces: Place[];
  placeById: (id: string) => Place | undefined;
};

const PlacesContext = React.createContext<PlacesContextValue | null>(null);

export function PlacesProvider({ children }: { children: React.ReactNode }) {
  const [places, setPlaces] = React.useState<Place[]>(fallbackPlaces);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const remote = await fetchRemotePlaces();
        if (alive && remote?.length) setPlaces(remote);
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const value = React.useMemo<PlacesContextValue>(() => {
    const lists = derive(places);
    return {
      ready,
      places,
      ...lists,
      placeById: (id) => places.find((p) => p.id === id),
    };
  }, [places, ready]);

  return <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>;
}

export function usePlaces() {
  const ctx = React.useContext(PlacesContext);
  if (!ctx) throw new Error('usePlaces must be used inside PlacesProvider');
  return ctx;
}
