import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '../constants/theme';

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  helper?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  cardColor?: string;
  accentColor?: string;
  iconBackgroundColor?: string;
  style?: ViewStyle;
};

export function MetricCard({
  icon,
  label,
  value,
  helper,
  onPress,
  accessibilityLabel,
  cardColor,
  accentColor,
  iconBackgroundColor,
  style,
}: MetricCardProps) {
  return (
    <Pressable
      accessible
      accessibilityLabel={accessibilityLabel ?? `${label}: ${value}`}
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        cardColor ? { backgroundColor: cardColor } : null,
        accentColor ? { borderColor: accentColor } : null,
        pressed && onPress && styles.pressed,
        style,
      ]}
    >
      <View style={[styles.icon, iconBackgroundColor ? { backgroundColor: iconBackgroundColor } : null]}>{icon}</View>
      <Text style={[styles.label, accentColor ? { color: accentColor } : null]}>{label}</Text>
      <Text style={[styles.value, accentColor ? { color: accentColor } : null]}>{value}</Text>
      {helper ? <Text style={[styles.helper, accentColor ? { color: accentColor } : null]}>{helper}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 142,
    justifyContent: 'space-between',
    borderRadius: radii.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  value: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '900',
  },
  helper: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
