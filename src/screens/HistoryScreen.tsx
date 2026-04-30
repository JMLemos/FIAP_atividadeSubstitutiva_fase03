import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CalendarX } from 'lucide-react-native';

import { CustomButton } from '../components/CustomButton';
import { RecordCard } from '../components/RecordCard';
import { colors, radii, spacing, typography } from '../constants/theme';
import { useRecords } from '../hooks/useRecords';
import { HealthRecord } from '../models/HealthRecord';
import { RootStackParamList } from '../navigation/types';
import { sortRecordsByDateDesc } from '../utils/recordUtils';

type HistoryScreenProps = NativeStackScreenProps<RootStackParamList, 'History'>;

export function HistoryScreen({ navigation }: HistoryScreenProps) {
  const { records } = useRecords();
  const sortedRecords = sortRecordsByDateDesc(records);

  function renderItem({ item }: { item: HealthRecord }) {
    return <RecordCard record={item} onPress={() => navigation.navigate('DailyRecord', { date: item.date })} />;
  }

  return (
    <FlatList
      contentContainerStyle={[styles.container, sortedRecords.length === 0 && styles.emptyContainer]}
      data={sortedRecords}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        sortedRecords.length > 0 ? (
          <View style={styles.header}>
            <Text style={styles.title}>Histórico de saúde</Text>
            <Text style={styles.description}>
              Acompanhe sua evolução diária. Toque em um dia para editar o registro.
            </Text>
          </View>
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <CalendarX size={32} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum registro ainda</Text>
          <Text style={styles.emptyDescription}>
            Seu histórico aparecerá aqui depois que você salvar o primeiro registro diário.
          </Text>
          <CustomButton title="Criar registro" onPress={() => navigation.navigate('DailyRecord')} />
        </View>
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.lg,
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
  separator: {
    height: spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '900',
  },
  emptyDescription: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
    textAlign: 'center',
  },
});
