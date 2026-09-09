import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomNav } from '../src/components/BottomNav';
import { Logo } from '../src/components/Brand';
import { Field, PasswordField, PrimaryButton } from '../src/auth/fields';
import { useAuth } from '../src/auth/AuthProvider';
import { colors } from '../src/theme/colors';
import { fonts, fontSize, radius, spacing, shadow } from '../src/theme/tokens';

export default function Perfil() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { ready, user, signIn, signOut, deleteAccount } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const onLogin = async () => {
    setBusy(true);
    setError(null);
    const msg = await signIn(email, password);
    setBusy(false);
    if (msg) setError(msg);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Excluir conta',
      'Isso apaga seu cadastro, favoritos e avaliações neste aparelho. Não dá para desfazer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            void deleteAccount();
          },
        },
      ],
    );
  };

  const confirmLogout = () => {
    Alert.alert('Sair', 'Você pode entrar de novo quando quiser.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: () => void signOut() },
    ]);
  };

  if (!ready) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={colors.teal} size="large" />
        <BottomNav active="perfil" />
      </View>
    );
  }

  if (user) {
    const initial = user.name.trim().charAt(0).toUpperCase() || 'U';
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingHorizontal: spacing.xl }}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
            <Text style={styles.kicker}>Conta</Text>
            <Text style={styles.title}>Perfil</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.meta}>{user.email}</Text>
            <Text style={styles.meta}>{user.phone}</Text>
          </View>

          <Pressable style={styles.row} onPress={() => router.push('/editar-perfil')}>
            <Ionicons name="create-outline" size={22} color={colors.tealDeep} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Editar dados</Text>
              <Text style={styles.rowHint}>Nome, telefone e senha</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
          </Pressable>

          <Pressable style={styles.row} onPress={confirmLogout}>
            <Ionicons name="log-out-outline" size={22} color={colors.navy} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Sair</Text>
              <Text style={styles.rowHint}>Encerrar sessão neste aparelho</Text>
            </View>
          </Pressable>

          <Pressable style={styles.row} onPress={confirmDelete}>
            <Ionicons name="trash-outline" size={22} color={colors.danger} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.danger }]}>Excluir conta</Text>
              <Text style={styles.rowHint}>Remove cadastro, favoritos e avaliações</Text>
            </View>
          </Pressable>
        </ScrollView>
        <BottomNav active="perfil" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingHorizontal: spacing.xl }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
            <Logo size={28} />
            <Text style={styles.kicker}>Conta</Text>
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.subtitle}>
              Cadastro é obrigatório para usar o perfil. Favoritos e avaliações passam para a sua conta.
            </Text>
          </View>

          <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
            <Field
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="voce@email.com"
              keyboardType="email-address"
            />
            <PasswordField label="Senha" value={password} onChangeText={setPassword} />
            {error ? <Text style={styles.formError}>{error}</Text> : null}
            <PrimaryButton label="Entrar" onPress={onLogin} busy={busy} />
            <Pressable onPress={() => router.push('/auth/recuperar')}>
              <Text style={styles.link}>Esqueci minha senha</Text>
            </Pressable>
          </View>

          <View style={styles.signupBox}>
            <Text style={styles.signupText}>Ainda não tem conta?</Text>
            <Pressable style={styles.signupBtn} onPress={() => router.push('/auth/cadastro')}>
              <Text style={styles.signupBtnText}>Criar conta</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNav active="perfil" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: { paddingBottom: spacing.md },
  kicker: {
    fontFamily: fonts.bodySemi,
    fontSize: fontSize.xs,
    color: colors.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.md,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSize.xxxl,
    color: colors.navy,
    letterSpacing: -0.6,
    marginTop: 2,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  formError: { fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: colors.danger },
  link: {
    fontFamily: fonts.bodySemi,
    fontSize: fontSize.sm,
    color: colors.tealDeep,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  signupBox: {
    marginTop: spacing.xxl,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.md,
  },
  signupText: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted },
  signupBtn: {
    alignSelf: 'stretch',
    height: 46,
    borderRadius: radius.lg,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupBtnText: { fontFamily: fonts.bodySemi, fontSize: fontSize.md, color: colors.tealDeep },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...(shadow.card as object),
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: { fontFamily: fonts.display, fontSize: fontSize.xxl, color: '#fff' },
  name: { fontFamily: fonts.heading, fontSize: fontSize.xl, color: colors.navy },
  meta: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  rowTitle: { fontFamily: fonts.bodySemi, fontSize: fontSize.md, color: colors.navy },
  rowHint: { fontFamily: fonts.body, fontSize: fontSize.xs, color: colors.textFaint, marginTop: 2 },
});
