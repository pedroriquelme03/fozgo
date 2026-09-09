import AsyncStorage from '@react-native-async-storage/async-storage';

export type StoredReview = {
  id: string;
  placeId: string;
  userId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: number;
  updatedAt: number;
};

export type StoredReport = {
  id: string;
  reviewId: string;
  placeId: string;
  reason: string;
  createdAt: number;
  userId: string;
};

const REVIEWS_KEY = 'fozgo.reviews.v1';
const REPORTS_KEY = 'fozgo.review-reports.v1';
const GUEST_KEY = 'fozgo.guest-id';

export async function getGuestId() {
  let id = await AsyncStorage.getItem(GUEST_KEY);
  if (!id) {
    id = `guest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    await AsyncStorage.setItem(GUEST_KEY, id);
  }
  return id;
}

export async function loadReviews(): Promise<StoredReview[]> {
  try {
    const raw = await AsyncStorage.getItem(REVIEWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredReview[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveReviews(rows: StoredReview[]) {
  await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(rows));
}

export async function loadReports(): Promise<StoredReport[]> {
  try {
    const raw = await AsyncStorage.getItem(REPORTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredReport[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveReports(rows: StoredReport[]) {
  await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(rows));
}
