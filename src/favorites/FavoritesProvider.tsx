import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { FavoriteRow, loadFavorites, saveFavorites } from './db';
import { fetchRemoteFavorites, mergeFavorites, pushRemoteFavorites } from './remote';

type FavoritesContextValue = {
  ready: boolean;
  ids: string[];
  isFavorite: (placeId: string) => boolean;
  toggle: (placeId: string) => void;
};

const FavoritesContext = React.createContext<FavoritesContextValue | null>(null);

function ownedBy(row: FavoriteRow, actorId: string) {
  return (row.ownerId ?? 'guest') === actorId || (!row.ownerId && actorId.startsWith('guest-'));
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { ready: authReady, actorId, user } = useAuth();
  const [rows, setRows] = React.useState<FavoriteRow[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (!authReady) return;
    let alive = true;
    (async () => {
      try {
        const local = await loadFavorites();
        let next = local;
        if (user) {
          const remote = await fetchRemoteFavorites(user.id);
          if (remote) {
            next = mergeFavorites(local, remote);
            await saveFavorites(next);
            await pushRemoteFavorites(user.id, next);
          }
        }
        if (alive) setRows(next);
      } catch {
        if (alive) setRows([]);
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [actorId, authReady, user]);

  const mine = React.useMemo(
    () => rows.filter((r) => ownedBy(r, actorId)),
    [actorId, rows],
  );

  const persist = React.useCallback(async (next: FavoriteRow[]) => {
    setRows(next);
    await saveFavorites(next);
    if (user) await pushRemoteFavorites(user.id, next);
  }, [user]);

  const toggle = React.useCallback(
    (placeId: string) => {
      const exists = rows.some((r) => r.placeId === placeId && ownedBy(r, actorId));
      const next = exists
        ? rows.filter((r) => !(r.placeId === placeId && ownedBy(r, actorId)))
        : [{ placeId, createdAt: Date.now(), ownerId: actorId }, ...rows];
      void persist(next);
    },
    [actorId, persist, rows],
  );

  const value = React.useMemo<FavoritesContextValue>(
    () => ({
      ready: ready && authReady,
      ids: mine.map((r) => r.placeId),
      isFavorite: (placeId) => mine.some((r) => r.placeId === placeId),
      toggle,
    }),
    [authReady, mine, ready, toggle],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = React.useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
}
