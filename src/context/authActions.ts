import { AuthUser } from '../models/AuthUser';

export type AuthAction =
  | { type: 'LOAD_AUTH_START' }
  | { type: 'LOAD_AUTH_SUCCESS'; payload: AuthUser | null }
  | { type: 'LOAD_AUTH_FAILURE'; payload: string }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGOUT_SUCCESS' };
