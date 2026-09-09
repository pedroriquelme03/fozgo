import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomNav } from '../../src/components/BottomNav';
import { Logo } from '../../src/components/Brand';
import { Field, PasswordField, PrimaryButton } from '../../src/auth/fields';
import { useAuth } from '../../src/auth/AuthProvider';
import { colors } from '../../src/theme/colors';
import { fonts, fontSize, spacing } from '../../src/theme/tokens';

export default function Cadastro() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, signUp } = useAuth();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (user) router.replace('/perfil');
  }, [router, user]);

  const onSubmit = async () => {
    setBusy(true);
    setError(null);
    const msg = await signUp({ name, email, phone, password });
    setBusy(false);
    if (msg) setError(msg);
    else router.replace('/perfil');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingHorizontal: spacing.xl }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={() => router.back()}
            style={[styles.back, { marginTop: insets.top + spacing.md }]}
          >
            <Ionicons name="chevron-back" size={22} color={colors.navy} />
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>
          <Logo size={26} />
          <Text style={styles.kicker}>Cadastro obrigatório</Text>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Nome, e-mail, telefone e senha. O e-mail não poderá ser alterado depois.</Text>

          <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
            <Field
              label="Nome"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              placeholder="Seu nome"
            />
            <Field
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="voce@email.com"
            />
            <Field
              label="Telefone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="(45) 99999-0000"
              autoCapitalize="none"
            />
            <PasswordField label="Senha" value={password} onChangeText={setPassword} placeholder="Mínimo 6 caracteres" />
            {error ? <Text style={styles.formError}>{error}</Text> : null}
            <PrimaryButton label="Cadastrar" onPress={onSubmit} busy={busy} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNav active="perfil" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.lg, alignSelf: 'flex-start' },
  backText: { fontFamily: fonts.bodySemi, fontSize: fontSize.sm, color: colors.navy },
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
});
