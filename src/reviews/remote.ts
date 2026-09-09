import { getCurrentUserId } from '../auth/session';
import { StoredReport, StoredReview } from './db';

/**
 * Quando Auth + banco existirem:
 *   reviews (id, user_id, place_id, rating, comment, created_at, updated_at)
 *   review_reports (id, user_id, review_id, reason, created_at)
 * RLS: autor edita/apaga a própria; qualquer autenticado denuncia; leitura pública.
 */
export { getCurrentUserId };

export async function fetchRemoteReviews(_userId: string): Promise<StoredReview[] | null> {
  return null;
}

export async function pushRemoteReviews(_userId: string, _rows: StoredReview[]): Promise<void> {}

export async function pushRemoteReport(_userId: string, _report: StoredReport): Promise<void> {}

export function mergeReviews(local: StoredReview[], remote: StoredReview[]): StoredReview[] {
  const map = new Map<string, StoredReview>();
  for (const row of [...remote, ...local]) {
    const prev = map.get(row.id);
    if (!prev || row.updatedAt >= prev.updatedAt) map.set(row.id, row);
  }
  return [...map.values()].sort((a, b) => b.updatedAt - a.updatedAt);
}
