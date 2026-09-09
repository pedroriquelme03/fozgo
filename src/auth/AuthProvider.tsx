import React from 'react';
import type { Session } from '@supabase/supabase-js';
import { getGuestId } from '../reviews/db';
import { supabase, authErrorMessage } from '../lib/supabase';
import { migrateGuestToUser, purgeUserData } from './migrate';
import { setSession } from './session';
import { PublicUser } from './types';

type AuthContextValue = {
  ready: boolean;
  user: PublicUser | null;
  actorId: string;
  signUp: (input: { name: string; email: string; phone: string; password: string }) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  updateProfile: (input: { name: string; phone: string; password?: string }) => Promise<string | null>;
  resetPassword: (email: string) => Promise<string | null>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

function normEmail(email: string) {
  return email.trim().toLowerCase();
}

function digits(phone: string) {
  return phone.replace(/\D/g, '');
}

function toPublicUser(id: string, name: string, email: string, phone: string, createdAt: string | number): PublicUser {
  return {
    id,
    name,
    email,
    phone,
    createdAt: typeof createdAt === 'number' ? createdAt : new Date(createdAt).getTime(),
  };
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

  const hydrateFromSession = React.useCallback(
    async (session: Session | null, guest: string) => {
      if (!session?.user) {
        applyUser(null, guest);
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, phone, email, created_at')
        .eq('id', session.user.id)
        .maybeSingle();
      const meta = session.user.user_metadata ?? {};
      applyUser(
        toPublicUser(
          session.user.id,
          profile?.name || meta.name || session.user.email?.split('@')[0] || 'Você',
          profile?.email || session.user.email || '',
          profile?.phone || meta.phone || '',
          profile?.created_at || session.user.created_at,
        ),
        guest,
      );
    },
    [applyUser],
  );

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const guest = await getGuestId();
      if (!alive) return;
      setGuestId(guest);
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      await hydrateFromSession(data.session, guest);
      if (alive) setReady(true);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      void getGuestId().then((guest) => hydrateFromSession(session, guest));
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [hydrateFromSession]);

  const signUp = React.useCallback<AuthContextValue['signUp']>(
    async ({ name, email, phone, password }) => {
      const n = name.trim();
      const em = normEmail(email);
      const ph = phone.trim();
      if (n.length < 2) return 'Informe seu nome.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return 'E-mail inválido.';
      if (digits(ph).length < 10) return 'Telefone inválido.';
      if (password.length < 6) return 'A senha precisa ter pelo menos 6 caracteres.';

      const { data, error } = await supabase.auth.signUp({
        email: em,
        password,
        options: { data: { name: n, phone: ph } },
      });
      if (error) return authErrorMessage(error);
      if (!data.session) {
        return 'Conta criada. Se o e-mail de confirmação estiver ligado, abra o link e depois entre.';
      }
      await migrateGuestToUser(guestId, { id: data.session.user.id, name: n });
      return null;
    },
    [guestId],
  );

  const signIn = React.useCallback<AuthContextValue['signIn']>(
    async (email, password) => {
      const em = normEmail(email);
      const { data, error } = await supabase.auth.signInWithPassword({ email: em, password });
      if (error) return authErrorMessage(error);
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', data.user.id)
          .maybeSingle();
        await migrateGuestToUser(guestId, {
          id: data.user.id,
          name: profile?.name || data.user.user_metadata?.name || 'Você',
        });
      }
      return null;
    },
    [guestId],
  );

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

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

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name: n, phone: ph, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (profileError) return authErrorMessage(profileError);

      if (password) {
        const { error: passError } = await supabase.auth.updateUser({
          password,
          data: { name: n, phone: ph },
        });
        if (passError) return authErrorMessage(passError);
      } else {
        await supabase.auth.updateUser({ data: { name: n, phone: ph } });
      }

      applyUser({ ...user, name: n, phone: ph }, guestId);
      return null;
    },
    [applyUser, guestId, user],
  );

  const resetPassword = React.useCallback<AuthContextValue['resetPassword']>(async (email) => {
    const em = normEmail(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return 'E-mail inválido.';
    const { error } = await supabase.auth.resetPasswordForEmail(em);
    if (error) return authErrorMessage(error);
    return null;
  }, []);

  const deleteAccount = React.useCallback(async () => {
    if (!user) return;
    await supabase.rpc('delete_own_account');
    await purgeUserData(user.id);
    await supabase.auth.signOut();
  }, [user]);

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
