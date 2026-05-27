import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { z } from 'zod';

import { CustomButton } from '../components/CustomButton';
import { MoodSelector } from '../components/MoodSelector';
import { MAX_MOOD, MIN_MOOD } from '../constants/health';
import { colors, radii, spacing, typography } from '../constants/theme';
import { useRecords } from '../hooks/useRecords';
import { RootStackParamList } from '../navigation/types';
import { createId } from '../services/idService';
import { getTodayDateKey } from '../utils/dateUtils';

const schema = z.object({
  water: z
    .string()
    .min(1, 'Informe a quantidade de água.')
    .refine((value) => Number(value) >= 0, 'A água não pode ser negativa.')
    .refine((value) => Number(value) <= 10000, 'Informe um valor realista.'),
  sleep: z
    .string()
    .min(1, 'Informe as horas de sono.')
    .refine((value) => Number(value) >= 0, 'O sono não pode ser negativo.')
    .refine((value) => Number(value) <= 24, 'O sono deve estar entre 0 e 24 horas.'),
  mood: z.number().min(MIN_MOOD, 'Selecione seu humor.').max(MAX_MOOD, 'Selecione seu humor.'),
  exercise: z.string().trim().min(2, 'Descreva o exercício ou informe "Nenhum".'),
});

type FormValues = z.infer<typeof schema>;
type DailyRecordScreenProps = NativeStackScreenProps<RootStackParamList, 'DailyRecord'>;

const fieldTitles = {
  water: 'água',
  sleep: 'sono',
  mood: 'humor',
  exercise: 'exercício',
};

export function DailyRecordScreen({ navigation, route }: DailyRecordScreenProps) {
  const { records, upsertRecord, error } = useRecords();
  const today = getTodayDateKey();
  const selectedDate = route.params?.date ?? today;
  const focusField = route.params?.focusField;
  const selectedRecord = records.find((record) => record.date === selectedDate);
  const isToday = selectedDate === today;

  const defaultValues = useMemo<FormValues>(
    () => ({
      water: selectedRecord ? String(selectedRecord.water) : focusField ? '0' : '',
      sleep: selectedRecord ? String(selectedRecord.sleep) : focusField ? '0' : '',
      mood: selectedRecord?.mood ?? 3,
      exercise: selectedRecord?.exercise ?? (focusField ? 'Nenhum' : ''),
    }),
    [focusField, selectedRecord],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  async function onSubmit(values: FormValues) {
    await upsertRecord({
      id: selectedRecord?.id ?? createId(),
      date: selectedDate,
      water: Number(values.water),
      sleep: Number(values.sleep),
      mood: values.mood,
      exercise: values.exercise.trim(),
    });

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Home');
  }

  const title = focusField
    ? `Editar ${fieldTitles[focusField]}`
    : selectedRecord
      ? `Editar registro ${isToday ? 'de hoje' : 'do dia'}`
      : 'Novo registro diário';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>
            {focusField
              ? 'Atualize apenas este dado. Os demais campos do registro serão preservados.'
              : 'Preencha seus dados de saúde do dia. As informações ficam salvas localmente no dispositivo.'}
          </Text>
        </View>

        <View style={styles.form}>
          {(!focusField || focusField === 'water') && (
            <Controller
              control={control}
              name="water"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Água consumida (ml)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  placeholder="Ex: 2000"
                  error={errors.water?.message}
                />
              )}
            />
          )}

          {(!focusField || focusField === 'sleep') && (
            <Controller
              control={control}
              name="sleep"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Horas dormidas"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  placeholder="Ex: 7.5"
                  error={errors.sleep?.message}
                />
              )}
            />
          )}

          {(!focusField || focusField === 'mood') && (
            <Controller
              control={control}
              name="mood"
              render={({ field: { onChange, value } }) => (
                <MoodSelector value={value} onChange={onChange} error={errors.mood?.message} />
              )}
            />
          )}

          {(!focusField || focusField === 'exercise') && (
            <Controller
              control={control}
              name="exercise"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Exercício realizado"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ex: Caminhada de 30 minutos"
                  error={errors.exercise?.message}
                  multiline
                />
              )}
            />
          )}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <CustomButton
          title={selectedRecord ? 'Salvar alterações' : 'Salvar registro'}
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          accessibilityLabel="Salvar registro diário"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur: () => void;
  placeholder: string;
  error?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  multiline?: boolean;
};

function Input({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  keyboardType = 'default',
  multiline = false,
}: InputProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        keyboardType={keyboardType}
        multiline={multiline}
        onBlur={onBlur}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, multiline && styles.textArea, error && styles.inputError]}
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
    gap: spacing.lg,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
  },
  form: {
    gap: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
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
  textArea: {
    minHeight: 92,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    marginTop: spacing.xs,
    color: colors.danger,
    fontSize: typography.caption,
    fontWeight: '700',
  },
});
