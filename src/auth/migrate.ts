import { loadFavorites, saveFavorites } from '../favorites/db';
import { loadReports, loadReviews, saveReports, saveReviews } from '../reviews/db';

export async function migrateGuestToUser(guestId: string, user: { id: string; name: string }) {
  const favs = await loadFavorites();
  await saveFavorites(
    favs.map((f) => ({
      ...f,
      ownerId: !f.ownerId || f.ownerId === guestId ? user.id : f.ownerId,
    })),
  );
  const revs = await loadReviews();
  await saveReviews(
    revs.map((r) => (r.userId === guestId ? { ...r, userId: user.id, author: user.name } : r)),
  );
}

export async function purgeUserData(userId: string) {
  const favs = await loadFavorites();
  await saveFavorites(favs.filter((f) => f.ownerId !== userId));
  const revs = await loadReviews();
  await saveReviews(revs.filter((r) => r.userId !== userId));
  const reports = await loadReports();
  await saveReports(reports.filter((r) => r.userId !== userId));
}
