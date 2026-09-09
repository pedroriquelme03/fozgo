import React from 'react';
import * as Crypto from 'expo-crypto';
import { getGuestId, loadReviews, saveReviews } from '../reviews/db';
import { loadSessionId, loadUsers, saveSessionId, saveUsers } from './db';
import { migrateGuestToUser, purgeUserData } from './migrate';
import { hashPassword, newSalt, passwordsMatch } from './password';
import { setSession } from './session';
import { PublicUser, UserAccount, toPublicUser } from './types';

type AuthContextValue = {
  ready: boolean;
  user: PublicUser | null;
  actorId: string;
  signUp: (input: { name: string; email: string; phone: string; password: string }) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  updateProfile: (input: { name: string; phone: string; password?: string }) => Promise<string | null>;
  resetPassword: (email: string, newPassword: string) => Promise<string | null>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

function normEmail(email: string) {
  return email.trim().toLowerCase();
}

function digits(phone: string) {
  return phone.replace(/\D/g, '');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<PublicUser | null>(null);
  const [actorId, setActorId] = React.useState('guest');
  const [guestId, setGuestId] = React.useState('guest');
  const [ready, setReady] = React.useState(false);

  const applyUser = React.useCallback((next: PublicUser | null, guest: string) => {
    setUser(next);
    setActorId(next?.id ?? guest);
    setSession({ userId: next?.id ?? null, name: next?.name ?? null });
  }, []);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [users, sessionId, guest] = await Promise.all([loadUsers(), loadSessionId(), getGuestId()]);
        const found = sessionId ? (users.find((u) => u.id === sessionId) ?? null) : null;
        if (alive) {
          setGuestId(guest);
          applyUser(found ? toPublicUser(found) : null, guest);
        }
      } catch {
        if (alive) applyUser(null, 'guest');
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [applyUser]);

  const persistSession = React.useCallback(
    async (account: UserAccount | null) => {
      await saveSessionId(account?.id ?? null);
      applyUser(account ? toPublicUser(account) : null, guestId);
    },
    [applyUser, guestId],
  );

  const signUp = React.useCallback<AuthContextValue['signUp']>(
    async ({ name, email, phone, password }) => {
      const n = name.trim();
      const em = normEmail(email);
      const ph = phone.trim();
      if (n.length < 2) return 'Informe seu nome.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return 'E-mail inválido.';
      if (digits(ph).length < 10) return 'Telefone inválido.';
      if (password.length < 6) return 'A senha precisa ter pelo menos 6 caracteres.';
      const users = await loadUsers();
      if (users.some((u) => u.email === em)) return 'Este e-mail já tem conta.';
      const salt = await newSalt();
      const account: UserAccount = {
        id: Crypto.randomUUID(),
        name: n,
        email: em,
        phone: ph,
        salt,
        passwordHash: await hashPassword(password, salt),
        createdAt: Date.now(),
      };
      await saveUsers([...users, account]);
      await migrateGuestToUser(guestId, { id: account.id, name: account.name });
      await persistSession(account);
      return null;
    },
    [guestId, persistSession],
  );

  const signIn = React.useCallback<AuthContextValue['signIn']>(
    async (email, password) => {
      const em = normEmail(email);
      const users = await loadUsers();
      const found = users.find((u) => u.email === em);
      if (!found) return 'E-mail ou senha incorretos.';
      const ok = await passwordsMatch(password, found.salt, found.passwordHash);
      if (!ok) return 'E-mail ou senha incorretos.';
      await migrateGuestToUser(guestId, { id: found.id, name: found.name });
      await persistSession(found);
      return null;
    },
    [guestId, persistSession],
  );

  const signOut = React.useCallback(async () => {
    await persistSession(null);
  }, [persistSession]);

  const updateProfile = React.useCallback<AuthContextValue['updateProfile']>(
    async ({ name, phone, password }) => {
      if (!user) return 'Entre na sua conta.';
      const n = name.trim();
      const ph = phone.trim();
      if (n.length < 2) return 'Informe seu nome.';
      if (digits(ph).length < 10) return 'Telefone inválido.';
      if (password != null && password.length > 0 && password.length < 6) {
        return 'A senha precisa ter pelo menos 6 caracteres.';
      }
      const users = await loadUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx < 0) return 'Conta não encontrada.';
      const current = users[idx];
      let salt = current.salt;
      let passwordHash = current.passwordHash;
      if (password) {
        salt = await newSalt();
        passwordHash = await hashPassword(password, salt);
      }
      const next: UserAccount = { ...current, name: n, phone: ph, salt, passwordHash };
      const copy = [...users];
      copy[idx] = next;
      await saveUsers(copy);
      const revs = await loadReviews();
      await saveReviews(revs.map((r) => (r.userId === user.id ? { ...r, author: n } : r)));
      await persistSession(next);
      return null;
    },
    [persistSession, user],
  );

  const resetPassword = React.useCallback<AuthContextValue['resetPassword']>(async (email, newPassword) => {
    const em = normEmail(email);
    if (newPassword.length < 6) return 'A senha precisa ter pelo menos 6 caracteres.';
    const users = await loadUsers();
    const idx = users.findIndex((u) => u.email === em);
    if (idx < 0) return 'Não encontramos uma conta com esse e-mail.';
    const salt = await newSalt();
    const copy = [...users];
    copy[idx] = { ...copy[idx], salt, passwordHash: await hashPassword(newPassword, salt) };
    await saveUsers(copy);
    return null;
  }, []);

  const deleteAccount = React.useCallback(async () => {
    if (!user) return;
    const users = await loadUsers();
    await saveUsers(users.filter((u) => u.id !== user.id));
    await purgeUserData(user.id);
    await persistSession(null);
  }, [persistSession, user]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      ready,
      user,
      actorId,
      signUp,
      signIn,
      signOut,
      updateProfile,
      resetPassword,
      deleteAccount,
    }),
    [actorId, deleteAccount, ready, resetPassword, signIn, signOut, signUp, updateProfile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
