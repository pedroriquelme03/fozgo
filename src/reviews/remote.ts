import { supabase } from '../lib/supabase';
import { StoredReport, StoredReview } from './db';

export { getCurrentUserId } from '../auth/session';

function toReview(row: {
  id: string;
  place_id: string;
  user_id: string;
  author: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}): StoredReview {
  return {
    id: row.id,
    placeId: row.place_id,
    userId: row.user_id,
    author: row.author,
    rating: row.rating,
    comment: row.comment,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  };
}

export async function fetchRemoteReviews(_userId: string): Promise<StoredReview[] | null> {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, place_id, user_id, author, rating, comment, created_at, updated_at');
  if (error) return null;
  return (data ?? []).map(toReview);
}

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function pushRemoteReviews(userId: string, rows: StoredReview[]): Promise<void> {
  const mine = rows.filter((row) => row.userId === userId);
  const { data: existing } = await supabase.from('reviews').select('id, place_id').eq('user_id', userId);
  const localPlaces = new Set(mine.map((row) => row.placeId));
  const stale = (existing ?? []).filter((row) => !localPlaces.has(row.place_id)).map((row) => row.id);
  if (stale.length > 0) {
    await supabase.from('reviews').delete().eq('user_id', userId).in('id', stale);
  }
  if (mine.length === 0) return;
  await supabase.from('reviews').upsert(
    mine.map((row) => ({
      id: UUID.test(row.id) ? row.id : undefined,
      user_id: userId,
      place_id: row.placeId,
      author: row.author,
      rating: row.rating,
      comment: row.comment,
      created_at: new Date(row.createdAt).toISOString(),
      updated_at: new Date(row.updatedAt).toISOString(),
    })),
    { onConflict: 'user_id,place_id' },
  );
}

export async function pushRemoteReport(userId: string, report: StoredReport): Promise<void> {
  if (!UUID.test(report.reviewId)) {
    return;
  }
  await supabase.from('review_reports').upsert(
    {
      user_id: userId,
      review_id: report.reviewId,
      place_id: report.placeId,
      reason: report.reason,
    },
    { onConflict: 'user_id,review_id' },
  );
}

export function mergeReviews(local: StoredReview[], remote: StoredReview[]): StoredReview[] {
  const byPair = new Map<string, StoredReview>();
  for (const row of [...remote, ...local]) {
    const key = `${row.userId}:${row.placeId}`;
    const prev = byPair.get(key);
    if (!prev || row.updatedAt >= prev.updatedAt) byPair.set(key, row);
  }
  return [...byPair.values()].sort((a, b) => b.updatedAt - a.updatedAt);
}
