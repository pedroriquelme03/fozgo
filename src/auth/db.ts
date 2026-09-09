import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserAccount } from './types';

const USERS_KEY = 'fozgo.users.v1';
const SESSION_KEY = 'fozgo.session.v1';

export async function loadUsers(): Promise<UserAccount[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UserAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveUsers(users: UserAccount[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function loadSessionId(): Promise<string | null> {
  return AsyncStorage.getItem(SESSION_KEY);
}

export async function saveSessionId(userId: string | null) {
  if (!userId) await AsyncStorage.removeItem(SESSION_KEY);
  else await AsyncStorage.setItem(SESSION_KEY, userId);
}
