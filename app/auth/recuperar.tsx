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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomNav } from '../../src/components/BottomNav';
import { Field, PrimaryButton } from '../../src/auth/fields';
import { useAuth } from '../../src/auth/AuthProvider';
import { colors } from '../../src/theme/colors';
import { fonts, fontSize, spacing } from '../../src/theme/tokens';

export default function Recuperar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const onSubmit = async () => {
    setBusy(true);
    setError(null);
    const msg = await resetPassword(email);
    setBusy(false);
    if (msg) {
      setError(msg);
      return;
    }
    Alert.alert('E-mail enviado', 'Se essa conta existir, você recebe um link para criar uma senha nova.', [
      { text: 'Ok', onPress: () => router.back() },
    ]);
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
          <Text style={styles.kicker}>Conta</Text>
          <Text style={styles.title}>Recuperar senha</Text>
          <Text style={styles.subtitle}>
            Informe o e-mail da conta. Enviamos um link para você definir uma senha nova.
          </Text>

          <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
            <Field
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="voce@email.com"
            />
            {error ? <Text style={styles.formError}>{error}</Text> : null}
            <PrimaryButton label="Enviar link" onPress={onSubmit} busy={busy} />
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
