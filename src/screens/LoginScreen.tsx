import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { HeartPulse, LockKeyhole } from 'lucide-react-native';
import { z } from 'zod';

import { CustomButton } from '../components/CustomButton';
import { AvatarId, avatarOptions, defaultAvatarId } from '../constants/avatars';
import { colors, radii, spacing, typography } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  avatarId: z.custom<AvatarId>(
    (value) => typeof value === 'string' && avatarOptions.some((avatar) => avatar.id === value),
    'Escolha um avatar.',
  ),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginScreen() {
  const { login, error } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      name: '',
      password: '',
      avatarId: defaultAvatarId,
    },
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    await login(values);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.brandCard}>
          <View style={styles.logo}>
            <HeartPulse size={40} color={colors.white} />
          </View>
          <Text style={styles.appName}>FitTrack</Text>
          <Text style={styles.subtitle}>Entre para acompanhar seus hábitos de saúde.</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <LockKeyhole size={22} color={colors.primary} />
            <Text style={styles.formTitle}>Login</Text>
          </View>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Seu nome"
                error={errors.name?.message}
                textContentType="name"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Senha"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Digite sua senha"
                error={errors.password?.message}
                secureTextEntry
                textContentType="password"
              />
            )}
          />

          <Controller
            control={control}
            name="avatarId"
            render={({ field: { onChange, value } }) => (
              <AvatarSelector value={value} onChange={onChange} error={errors.avatarId?.message} />
            )}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <CustomButton
            title="Entrar"
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            accessibilityLabel="Entrar no FitTrack"
          />
        </View>

        <Text style={styles.privacyText}>Sua sessão e seus registros ficam salvos localmente neste dispositivo.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type AvatarSelectorProps = {
  value: AvatarId;
  onChange: (value: AvatarId) => void;
  error?: string;
};

function AvatarSelector({ value, onChange, error }: AvatarSelectorProps) {
  return (
    <View>
      <Text style={styles.label}>Avatar</Text>
      <View style={styles.avatarGrid}>
        {avatarOptions.map((avatar) => {
          const isSelected = avatar.id === value;

          return (
            <Pressable
              key={avatar.id}
              accessibilityLabel={`Selecionar avatar ${avatar.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onChange(avatar.id)}
              style={({ pressed }) => [
                styles.avatarOption,
                isSelected && styles.avatarOptionSelected,
                pressed && styles.avatarOptionPressed,
              ]}
            >
              <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
              <Text style={[styles.avatarLabel, isSelected && styles.avatarLabelSelected]}>{avatar.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

type InputProps = {
  label: string;
  value: string;
  onBlur: () => void;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  textContentType?: 'name' | 'password';
};

function Input({
  label,
  value,
  onBlur,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  textContentType,
}: InputProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={secureTextEntry ? 'none' : 'words'}
        autoCorrect={!secureTextEntry}
        onBlur={onBlur}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={secureTextEntry}
        style={[styles.input, error && styles.inputError]}
        textContentType={textContentType}
        value={value}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },
  brandCard: {
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.xl,
    backgroundColor: colors.primary,
  },
  logo: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.primaryDark,
  },
  appName: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.primarySoft,
    fontSize: typography.body,
    lineHeight: 24,
    textAlign: 'center',
  },
  formCard: {
    gap: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  formTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '900',
  },
  label: {
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  input: {
    minHeight: 52,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.text,
    backgroundColor: colors.white,
    fontSize: typography.body,
  },
  inputError: {
    borderColor: colors.danger,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  avatarOption: {
    width: '31%',
    minHeight: 88,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.primarySoft,
  },
  avatarOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.color2,
  },
  avatarOptionPressed: {
    transform: [{ scale: 0.98 }],
  },
  avatarEmoji: {
    fontSize: 30,
  },
  avatarLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    textAlign: 'center',
  },
  avatarLabelSelected: {
    color: colors.text,
  },
  error: {
    marginTop: spacing.xs,
    color: colors.danger,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  privacyText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
    textAlign: 'center',
  },
});
