import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://nnsperehtnqwpbwugjxb.supabase.co';
const anonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uc3BlcmVodG5xd3Bid3VnanhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5ODcxOTcsImV4cCI6MjEwNDU2MzE5N30.gYRHzAv2XsgLv8ZCu7RfoL7kMU0rCZi41vXpQBPe1Gg';

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    void supabase.auth.startAutoRefresh();
  } else {
    void supabase.auth.stopAutoRefresh();
  }
});

export function authErrorMessage(error: { message?: string; code?: string } | null): string {
  const raw = (error?.message ?? '').toLowerCase();
  if (raw.includes('invalid login')) return 'E-mail ou senha incorretos.';
  if (raw.includes('already registered') || raw.includes('already been registered')) {
    return 'Este e-mail já tem conta.';
  }
  if (raw.includes('password')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (raw.includes('email')) return 'E-mail inválido.';
  if (raw.includes('rate limit')) return 'Muitas tentativas. Espere um pouco e tente de novo.';
  return error?.message || 'Não foi possível concluir. Tente de novo.';
}
