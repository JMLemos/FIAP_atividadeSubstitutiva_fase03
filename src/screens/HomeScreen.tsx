import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Activity, Bed, Droplets, History, PenLine } from 'lucide-react-native';

import { CustomButton } from '../components/CustomButton';
import { MetricCard } from '../components/MetricCard';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { getAvatarOption } from '../constants/avatars';
import { WATER_GOAL_ML } from '../constants/health';
import { colors, radii, spacing, typography } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { useRecords } from '../hooks/useRecords';
import { RootStackParamList } from '../navigation/types';
import { calculateWaterProgress, getTodayRecord } from '../utils/recordUtils';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function getMoodEmoji(mood?: number) {
  if (!mood) {
    return '😐';
  }

  const moodEmojis: Record<number, string> = {
    1: '😞',
    2: '🙁',
    3: '😐',
    4: '🙂',
    5: '😄',
  };

  return moodEmojis[mood] ?? '😐';
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { user, logout } = useAuth();
  const { records, isLoading, error } = useRecords();
  const todayRecord = getTodayRecord(records);
  const water = todayRecord?.water ?? 0;
  const progress = calculateWaterProgress(water);
  const avatar = getAvatarOption(user?.avatarId);
  const moodEmoji = getMoodEmoji(todayRecord?.mood);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Carregando seus hábitos...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.sessionCard}>
        <View style={styles.avatarBadge}>
          <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
        </View>
        <View style={styles.sessionInfo}>
          <Text style={styles.welcome}>Olá, {user?.name ?? 'colaborador'}!</Text>
          <Text style={styles.sessionHint}>Sessão local ativa</Text>
        </View>
        <CustomButton
          title="Sair"
          variant="outline"
          onPress={logout}
          style={styles.logoutButton}
          accessibilityLabel="Sair da conta"
        />
      </View>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Resumo de hoje</Text>
        <Text style={styles.title}>Acompanhe seus hábitos de saúde</Text>
        <Text style={styles.description}>
          Registre água, sono, humor e exercícios para manter uma rotina mais equilibrada.
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.progressCard}>
        <ProgressIndicator
          label="Meta de água"
          progress={progress}
          valueLabel={`${water} / ${WATER_GOAL_ML} ml`}
          color={colors.water}
          trackColor={colors.waterTrack}
        />
      </View>

      <View style={styles.metrics}>
        <MetricCard
          icon={<Droplets size={22} color={colors.water} />}
          label="Água"
          value={`${water} ml`}
          helper="Toque para editar"
          cardColor={colors.waterSoft}
          accentColor={colors.water}
          iconBackgroundColor={colors.white}
          onPress={() => navigation.navigate('DailyRecord', { focusField: 'water' })}
          accessibilityLabel="Editar água consumida hoje"
        />
        <MetricCard
          icon={<Bed size={22} color={colors.sleep} />}
          label="Sono"
          value={todayRecord ? `${todayRecord.sleep} h` : '0 h'}
          helper="Toque para editar"
          cardColor={colors.sleepSoft}
          accentColor={colors.sleep}
          iconBackgroundColor={colors.white}
          onPress={() => navigation.navigate('DailyRecord', { focusField: 'sleep' })}
          accessibilityLabel="Editar horas de sono de hoje"
        />
        <MetricCard
          icon={<Text style={styles.moodEmoji}>{moodEmoji}</Text>}
          label="Humor"
          value={todayRecord ? `${todayRecord.mood}/5` : '-'}
          helper="Toque para editar"
          cardColor={colors.moodSoft}
          accentColor={colors.mood}
          iconBackgroundColor={colors.white}
          onPress={() => navigation.navigate('DailyRecord', { focusField: 'mood' })}
          accessibilityLabel="Editar humor de hoje"
        />
        <MetricCard
          icon={<Activity size={22} color={colors.exercise} />}
          label="Exercício"
          value={todayRecord?.exercise ? 'Feito' : 'Pendente'}
          helper={todayRecord?.exercise || 'Toque para editar'}
          cardColor={colors.exerciseSoft}
          accentColor={colors.exercise}
          iconBackgroundColor={colors.white}
          onPress={() => navigation.navigate('DailyRecord', { focusField: 'exercise' })}
          accessibilityLabel="Editar exercício de hoje"
        />
      </View>

      <View style={styles.actions}>
        <CustomButton
          title={todayRecord ? 'Editar registro de hoje' : 'Registrar novo dado'}
          onPress={() => navigation.navigate('DailyRecord')}
          accessibilityLabel="Abrir tela de registro diário"
        />
        <CustomButton
          title="Ver histórico"
          variant="outline"
          onPress={() => navigation.navigate('History')}
          accessibilityLabel="Abrir histórico de registros"
        />
      </View>

      <View style={styles.tip}>
        <PenLine size={18} color={colors.primary} />
        <Text style={styles.tipText}>
          {todayRecord
            ? 'Você já registrou o dia. Volte quando quiser para ajustar as informações.'
            : 'Comece registrando seus dados de hoje para montar seu histórico.'}
        </Text>
      </View>

      <View style={styles.historyHint}>
        <History size={18} color={colors.textMuted} />
        <Text style={styles.historyHintText}>{records.length} registro(s) salvos localmente</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: spacing.lg,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sessionInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  avatarBadge: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.color2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  moodEmoji: {
    fontSize: 24,
  },
  welcome: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  sessionHint: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  logoutButton: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  hero: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: colors.color5,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 4,
  },
  eyebrow: {
    color: colors.color5,
    fontSize: typography.small,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    marginTop: spacing.sm,
    color: colors.color5,
    fontSize: typography.title,
    fontWeight: '900',
  },
  description: {
    marginTop: spacing.sm,
    color: colors.color4,
    fontSize: typography.body,
    lineHeight: 24,
  },
  error: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: '700',
  },
  progressCard: {
    borderRadius: radii.lg,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.water,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  actions: {
    gap: spacing.md,
  },
  tip: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: colors.primarySoft,
  },
  tipText: {
    flex: 1,
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 20,
  },
  historyHint: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  historyHintText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '600',
  },
});
