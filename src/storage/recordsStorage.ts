import AsyncStorage from '@react-native-async-storage/async-storage';

import { HealthRecord } from '../models/HealthRecord';

const STORAGE_KEY = '@fittrack:health-records';

export async function loadRecords(): Promise<HealthRecord[]> {
  const payload = await AsyncStorage.getItem(STORAGE_KEY);

  if (!payload) {
    return [];
  }

  return JSON.parse(payload) as HealthRecord[];
}

export async function saveRecords(records: HealthRecord[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}
