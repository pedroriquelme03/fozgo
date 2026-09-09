import AsyncStorage from '@react-native-async-storage/async-storage';

export type FavoriteRow = { placeId: string; createdAt: number; ownerId?: string };

const KEY = 'fozgo.favorites.v1';

export async function loadFavorites(): Promise<FavoriteRow[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteRow[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r) => r && typeof r.placeId === 'string');
  } catch {
    return [];
  }
}

export async function saveFavorites(rows: FavoriteRow[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(rows));
}
