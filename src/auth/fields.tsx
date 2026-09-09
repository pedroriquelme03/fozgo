import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts, fontSize, radius, spacing } from '../theme/tokens';

export function Field({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textFaint}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
        style={[styles.input, props.style, props.editable === false && styles.inputLocked]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export function PasswordField({
  label,
  value,
  onChangeText,
  placeholder = '••••••••',
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = React.useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textFaint}
          secureTextEntry={!show}
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.input, { paddingRight: 44 }]}
        />
        <Pressable style={styles.eye} onPress={() => setShow((s) => !s)} hitSlop={8}>
          <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  busy,
}: {
  label: string;
  onPress: () => void;
  busy?: boolean;
}) {
  return (
    <Pressable style={[styles.primary, busy && { opacity: 0.7 }]} onPress={onPress} disabled={busy}>
      <Text style={styles.primaryText}>{busy ? 'Aguarde…' : label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.bodySemi, fontSize: fontSize.sm, color: colors.navy },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  inputLocked: { backgroundColor: colors.surfaceAlt, color: colors.textMuted },
  error: { fontFamily: fonts.body, fontSize: fontSize.xs, color: colors.danger },
  eye: { position: 'absolute', right: 12, top: 14 },
  primary: {
    height: 50,
    borderRadius: radius.lg,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  primaryText: { fontFamily: fonts.bodySemi, fontSize: fontSize.md, color: '#fff' },
});
