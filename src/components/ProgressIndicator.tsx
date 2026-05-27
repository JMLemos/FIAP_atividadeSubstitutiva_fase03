import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../constants/theme';

type ProgressIndicatorProps = {
  progress: number;
  label: string;
  valueLabel: string;
  color?: string;
  trackColor?: string;
};

export function ProgressIndicator({ progress, label, valueLabel, color = colors.primary, trackColor }: ProgressIndicatorProps) {
  const normalizedProgress = Math.max(0, Math.min(progress, 1));
  const percentage = Math.round(normalizedProgress * 100);

  return (
    <View accessible accessibilityLabel={`${label}: ${valueLabel}. ${percentage}% concluído.`}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{valueLabel}</Text>
      </View>
      <View style={[styles.track, trackColor ? { backgroundColor: trackColor } : null]}>
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.percentage}>{percentage}% da meta diária</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  value: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '600',
  },
  track: {
    height: 16,
    overflow: 'hidden',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.border,
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  percentage: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: typography.caption,
  },
});
