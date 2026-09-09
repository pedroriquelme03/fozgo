import { FavoriteRow } from './db';
import { getCurrentUserId } from '../auth/session';

/**
 * Ponto único para o backend (Supabase + Auth).
 * Enquanto não houver login, retorna null e os favoritos ficam só neste aparelho.
 */
export { getCurrentUserId };

export async function fetchRemoteFavorites(_userId: string): Promise<FavoriteRow[] | null> {
  return null;
}

export async function pushRemoteFavorites(_userId: string, _rows: FavoriteRow[]): Promise<void> {
  // no-op until auth exists
}

export function mergeFavorites(local: FavoriteRow[], remote: FavoriteRow[]): FavoriteRow[] {
  const map = new Map<string, FavoriteRow>();
  for (const row of [...remote, ...local]) {
    const key = `${row.ownerId ?? ''}:${row.placeId}`;
    const prev = map.get(key);
    if (!prev || row.createdAt > prev.createdAt) map.set(key, row);
  }
  return [...map.values()].sort((a, b) => b.createdAt - a.createdAt);
}
