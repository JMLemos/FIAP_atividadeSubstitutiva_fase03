import { AuthUser } from '../models/AuthUser';

export type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
};

export const initialAuthState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};
