import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../constants/theme';

type MoodSelectorProps = {
  value: number;
  onChange: (value: number) => void;
  error?: string;
};

const moodOptions = [
  { value: 1, emoji: '😞' },
  { value: 2, emoji: '🙁' },
  { value: 3, emoji: '😐' },
  { value: 4, emoji: '🙂' },
  { value: 5, emoji: '😄' },
];

export function MoodSelector({ value, onChange, error }: MoodSelectorProps) {
  return (
    <View>
      <Text style={styles.label}>Humor do dia</Text>
      <View style={styles.options} accessibilityRole="radiogroup">
        {moodOptions.map((option) => {
          const isSelected = option.value === value;

          return (
            <Pressable
              key={option.value}
              accessibilityLabel={`Selecionar humor ${option.value} de 5`}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onChange(option.value)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>{option.value}</Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  options: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    minHeight: 52,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  optionSelected: {
    borderColor: colors.mood,
    backgroundColor: colors.moodSoft,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionLabel: {
    color: colors.mood,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  optionLabelSelected: {
    color: colors.mood,
  },
  error: {
    marginTop: spacing.xs,
    color: colors.danger,
    fontSize: typography.caption,
  },
});
