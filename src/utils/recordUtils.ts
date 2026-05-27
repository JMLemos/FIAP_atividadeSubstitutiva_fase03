import { WATER_GOAL_ML } from '../constants/health';
import { HealthRecord } from '../models/HealthRecord';
import { getTodayDateKey } from './dateUtils';

export function getTodayRecord(records: HealthRecord[]): HealthRecord | undefined {
  const today = getTodayDateKey();

  return records.find((record) => record.date === today);
}

export function calculateWaterProgress(water: number, goal = WATER_GOAL_ML): number {
  if (goal <= 0) {
    return 0;
  }

  return Math.min(water / goal, 1);
}

export function isWaterGoalAchieved(water: number, goal = WATER_GOAL_ML): boolean {
  return water >= goal;
}

export function sortRecordsByDateDesc(records: HealthRecord[]): HealthRecord[] {
  return [...records].sort((a, b) => b.date.localeCompare(a.date));
}

export function upsertHealthRecord(records: HealthRecord[], record: HealthRecord): HealthRecord[] {
  const existingIndex = records.findIndex((item) => item.date === record.date);

  if (existingIndex === -1) {
    return sortRecordsByDateDesc([...records, record]);
  }

  const nextRecords = [...records];
  nextRecords[existingIndex] = record;

  return sortRecordsByDateDesc(nextRecords);
}
