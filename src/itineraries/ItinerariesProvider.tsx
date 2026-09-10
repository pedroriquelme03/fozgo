import React from 'react';
import { itineraries as fallbackItineraries, Itinerary } from '../data/itineraries';
import { fetchRemoteItineraries } from './remote';

type ItinerariesContextValue = {
  itineraries: Itinerary[];
  /** Procura primeiro em `extras` (roteiros do usuário) e depois nos remotos. */
  itineraryById: (id: string, extras?: Itinerary[]) => Itinerary | undefined;
};

const ItinerariesContext = React.createContext<ItinerariesContextValue | null>(null);

export function ItinerariesProvider({ children }: { children: React.ReactNode }) {
  const [itineraries, setItineraries] = React.useState<Itinerary[]>(fallbackItineraries);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const remote = await fetchRemoteItineraries();
      if (alive && remote?.length) setItineraries(remote);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const value = React.useMemo<ItinerariesContextValue>(
    () => ({
      itineraries,
      itineraryById: (id, extras = []) =>
        extras.find((i) => i.id === id) ?? itineraries.find((i) => i.id === id),
    }),
    [itineraries],
  );

  return (
    <ItinerariesContext.Provider value={value}>{children}</ItinerariesContext.Provider>
  );
}

export function useItineraries() {
  const ctx = React.useContext(ItinerariesContext);
  if (!ctx) throw new Error('useItineraries must be used inside ItinerariesProvider');
  return ctx;
}
