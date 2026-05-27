import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthUser } from '../models/AuthUser';

const STORAGE_KEY = '@fittrack:auth-user';

export async function loadAuthUser(): Promise<AuthUser | null> {
  const payload = await AsyncStorage.getItem(STORAGE_KEY);

  if (!payload) {
    return null;
  }

  return JSON.parse(payload) as AuthUser;
}

export async function saveAuthUser(user: AuthUser): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export async function clearAuthUser(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
