import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { getActorName } from '../auth/session';
import { StoredReport, StoredReview, loadReports, loadReviews, saveReports, saveReviews } from './db';
import { fetchRemoteReviews, pushRemoteReport, pushRemoteReviews } from './remote';

type ReviewsContextValue = {
  ready: boolean;
  actorId: string;
  reviews: StoredReview[];
  reports: StoredReport[];
  myReviewFor: (placeId: string) => StoredReview | undefined;
  reviewsFor: (placeId: string) => StoredReview[];
  hasReported: (reviewId: string) => boolean;
  upsert: (placeId: string, rating: number, comment: string) => Promise<void>;
  remove: (reviewId: string) => Promise<void>;
  report: (reviewId: string, placeId: string, reason: string) => Promise<void>;
};

const ReviewsContext = React.createContext<ReviewsContextValue | null>(null);

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const { ready: authReady, actorId, user } = useAuth();
  const [reviews, setReviews] = React.useState<StoredReview[]>([]);
  const [reports, setReports] = React.useState<StoredReport[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (!authReady) return;
    let alive = true;
    (async () => {
      try {
        const [local, localReports] = await Promise.all([loadReviews(), loadReports()]);
        let next = local;
        if (user) {
          const remote = await fetchRemoteReviews(user.id);
          if (remote) {
            next = [...remote.filter((r) => !local.some((l) => l.id === r.id)), ...local];
            await saveReviews(next);
            await pushRemoteReviews(user.id, next);
          }
        }
        if (alive) {
          setReviews(next);
          setReports(localReports);
        }
      } catch {
        if (alive) {
          setReviews([]);
          setReports([]);
        }
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [actorId, authReady, user]);

  const persistReviews = React.useCallback(
    async (next: StoredReview[]) => {
      setReviews(next);
      await saveReviews(next);
      if (user) await pushRemoteReviews(user.id, next);
    },
    [user],
  );

  const upsert = React.useCallback(
    async (placeId: string, rating: number, comment: string) => {
      const now = Date.now();
      const existing = reviews.find((r) => r.placeId === placeId && r.userId === actorId);
      const row: StoredReview = existing
        ? { ...existing, rating, comment: comment.trim(), updatedAt: now }
        : {
            id: `rev-${now}-${Math.random().toString(36).slice(2, 7)}`,
            placeId,
            userId: actorId,
            author: getActorName(),
            rating,
            comment: comment.trim(),
            createdAt: now,
            updatedAt: now,
          };
      const next = existing
        ? reviews.map((r) => (r.id === existing.id ? row : r))
        : [row, ...reviews];
      await persistReviews(next);
    },
    [actorId, persistReviews, reviews],
  );

  const remove = React.useCallback(
    async (reviewId: string) => {
      await persistReviews(reviews.filter((r) => r.id !== reviewId || r.userId !== actorId));
    },
    [actorId, persistReviews, reviews],
  );

  const report = React.useCallback(
    async (reviewId: string, placeId: string, reason: string) => {
      if (reports.some((r) => r.reviewId === reviewId && r.userId === actorId)) return;
      const row: StoredReport = {
        id: `rep-${Date.now()}`,
        reviewId,
        placeId,
        reason,
        createdAt: Date.now(),
        userId: actorId,
      };
      const next = [row, ...reports];
      setReports(next);
      await saveReports(next);
      if (user) await pushRemoteReport(user.id, row);
    },
    [actorId, reports, user],
  );

  const value = React.useMemo<ReviewsContextValue>(
    () => ({
      ready: ready && authReady,
      actorId,
      reviews,
      reports,
      myReviewFor: (placeId) => reviews.find((r) => r.placeId === placeId && r.userId === actorId),
      reviewsFor: (placeId) => reviews.filter((r) => r.placeId === placeId),
      hasReported: (reviewId) => reports.some((r) => r.reviewId === reviewId && r.userId === actorId),
      upsert,
      remove,
      report,
    }),
    [actorId, authReady, ready, remove, report, reports, reviews, upsert],
  );

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const ctx = React.useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used inside ReviewsProvider');
  return ctx;
}
