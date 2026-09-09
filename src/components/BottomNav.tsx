import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Href, usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts, fontSize, radius, spacing, shadow } from '../theme/tokens';

const tabs = [
  { key: 'inicio', label: 'Início', icon: 'home', href: '/' as Href },
  { key: 'explorar', label: 'Explorar', icon: 'compass', href: '/explorar' as Href },
  { key: 'favoritos', label: 'Favoritos', icon: 'heart', href: '/favoritos' as Href },
  { key: 'perfil', label: 'Perfil', icon: 'person', href: '/perfil' as Href },
] as const;

function isPerfilPath(pathname: string) {
  return (
    pathname.startsWith('/perfil') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/editar-perfil')
  );
}

function tabFromPath(pathname: string) {
  if (pathname.startsWith('/explorar')) return 'explorar';
  if (pathname.startsWith('/favoritos')) return 'favoritos';
  if (isPerfilPath(pathname)) return 'perfil';
  return 'inicio';
}

export function BottomNav({
  active,
  onChange,
}: {
  active?: string;
  onChange?: (key: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const current = active ?? tabFromPath(pathname);

  const onPress = (key: (typeof tabs)[number]['key'], href: Href | null) => {
    onChange?.(key);
    if (!href) return;
    const already =
      (key === 'inicio' && (pathname === '/' || pathname === '/index')) ||
      (key === 'explorar' && pathname.startsWith('/explorar')) ||
      (key === 'favoritos' && pathname.startsWith('/favoritos')) ||
      (key === 'perfil' && (pathname === '/perfil' || pathname === '/perfil/'));
    if (already) return;
    router.navigate(href);
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {tabs.map((t) => {
        const on = current === t.key;
        return (
          <Pressable key={t.key} style={styles.tab} onPress={() => onPress(t.key, t.href)}>
            <Ionicons
              name={(on ? t.icon : `${t.icon}-outline`) as keyof typeof Ionicons.glyphMap}
              size={23}
              color={on ? colors.teal : colors.textFaint}
            />
            <Text style={[styles.label, on && { color: colors.teal, fontFamily: fonts.bodySemi }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    ...(shadow.lifted as object),
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontFamily: fonts.bodyMedium, fontSize: fontSize.xs, color: colors.textFaint },
});
