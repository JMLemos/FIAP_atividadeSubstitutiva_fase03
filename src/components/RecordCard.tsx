import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Activity, Bed, CalendarDays, Droplets } from 'lucide-react-native';

import { colors, radii, spacing, typography } from '../constants/theme';
import { WATER_GOAL_ML } from '../constants/health';
import { HealthRecord } from '../models/HealthRecord';
import { formatDate } from '../utils/dateUtils';
import { isWaterGoalAchieved } from '../utils/recordUtils';

type RecordCardProps = {
  record: HealthRecord;
  onPress?: () => void;
};

export function RecordCard({ record, onPress }: RecordCardProps) {
  const waterGoalAchieved = isWaterGoalAchieved(record.water);
  const hasExercise = record.exercise.trim().length > 0;
  const moodEmoji = getMoodEmoji(record.mood);

  return (
    <Pressable
      accessible
      accessibilityLabel={`Registro de ${formatDate(record.date)}. Toque para editar.`}
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && onPress && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.dateRow}>
          <CalendarDays size={18} color={colors.primary} />
          <Text style={styles.date}>{formatDate(record.date)}</Text>
        </View>
        <View style={[styles.badge, waterGoalAchieved ? styles.successBadge : styles.warningBadge]}>
          <Text style={[styles.badgeText, waterGoalAchieved ? styles.successText : styles.warningText]}>
            {waterGoalAchieved ? 'Meta atingida' : `Meta ${WATER_GOAL_ML}ml`}
          </Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <Metric
          icon={<Droplets size={18} color={colors.water} />}
          label="Água"
          value={`${record.water} ml`}
          backgroundColor={colors.waterSoft}
          accentColor={colors.water}
        />
        <Metric
          icon={<Bed size={18} color={colors.sleep} />}
          label="Sono"
          value={`${record.sleep} h`}
          backgroundColor={colors.sleepSoft}
          accentColor={colors.sleep}
        />
        <Metric
          icon={<Text style={styles.moodEmoji}>{moodEmoji}</Text>}
          label="Humor"
          value={`${record.mood}/5`}
          backgroundColor={colors.moodSoft}
          accentColor={colors.mood}
        />
      </View>

      <View style={[styles.exercise, hasExercise && styles.exerciseDone]}>
        <Activity size={18} color={hasExercise ? colors.exercise : colors.textMuted} />
        <Text style={[styles.exerciseText, hasExercise && styles.exerciseTextDone]} numberOfLines={2}>
          {hasExercise ? record.exercise : 'Sem exercício registrado'}
        </Text>
      </View>
    </Pressable>
  );
}

function getMoodEmoji(mood: number) {
  const moodEmojis: Record<number, string> = {
    1: '😞',
    2: '🙁',
    3: '😐',
    4: '🙂',
    5: '😄',
  };

  return moodEmojis[mood] ?? '😐';
}

type MetricProps = {
  icon: ReactNode;
  label: string;
  value: string;
  backgroundColor: string;
  accentColor: string;
};

function Metric({ icon, label, value, backgroundColor, accentColor }: MetricProps) {
  return (
    <View style={[styles.metric, { backgroundColor, borderColor: accentColor }]}>
      {icon}
      <Text style={[styles.metricLabel, { color: accentColor }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: accentColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  dateRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  date: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  successBadge: {
    backgroundColor: colors.secondarySoft,
  },
  warningBadge: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: typography.caption,
    fontWeight: '800',
  },
  successText: {
    color: colors.success,
  },
  warningText: {
    color: '#B45309',
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metric: {
    flex: 1,
    gap: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.sm,
    backgroundColor: colors.surfaceMuted,
  },
  moodEmoji: {
    fontSize: 18,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  metricValue: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '800',
  },
  exercise: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    backgroundColor: colors.background,
  },
  exerciseDone: {
    borderColor: colors.exercise,
    backgroundColor: colors.exerciseSoft,
  },
  exerciseText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '600',
  },
  exerciseTextDone: {
    color: colors.exercise,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
