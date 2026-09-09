import { supabase } from '../lib/supabase';
import { FavoriteRow } from './db';

export { getCurrentUserId } from '../auth/session';

function toRow(userId: string, placeId: string, createdAt: string): FavoriteRow {
  return {
    placeId,
    ownerId: userId,
    createdAt: new Date(createdAt).getTime(),
  };
}

export async function fetchRemoteFavorites(userId: string): Promise<FavoriteRow[] | null> {
  const { data, error } = await supabase
    .from('favorites')
    .select('place_id, created_at')
    .eq('user_id', userId);
  if (error) return null;
  return (data ?? []).map((row) => toRow(userId, row.place_id, row.created_at));
}

export async function pushRemoteFavorites(userId: string, rows: FavoriteRow[]): Promise<void> {
  const mine = rows.filter((row) => row.ownerId === userId);
  const { data: existing, error: readError } = await supabase
    .from('favorites')
    .select('place_id')
    .eq('user_id', userId);
  if (readError) return;

  const localIds = new Set(mine.map((row) => row.placeId));
  const remoteIds = new Set((existing ?? []).map((row) => row.place_id as string));
  const toDelete = [...remoteIds].filter((id) => !localIds.has(id));
  const toInsert = mine.filter((row) => !remoteIds.has(row.placeId));

  if (toDelete.length > 0) {
    await supabase.from('favorites').delete().eq('user_id', userId).in('place_id', toDelete);
  }
  if (toInsert.length > 0) {
    await supabase.from('favorites').insert(
      toInsert.map((row) => ({
        user_id: userId,
        place_id: row.placeId,
        created_at: new Date(row.createdAt).toISOString(),
      })),
    );
  }
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
