import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useReducer } from 'react';

import { AvatarId } from '../constants/avatars';
import { AuthUser } from '../models/AuthUser';
import { createId } from '../services/idService';
import { clearAuthUser, loadAuthUser, saveAuthUser } from '../storage/authStorage';
import { authReducer } from './authReducer';
import { AuthState, initialAuthState } from './authState';

type LoginPayload = {
  name: string;
  password: string;
  avatarId: AvatarId;
};

type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const refreshSession = useCallback(async () => {
    dispatch({ type: 'LOAD_AUTH_START' });

    try {
      const user = await loadAuthUser();
      dispatch({ type: 'LOAD_AUTH_SUCCESS', payload: user });
    } catch {
      dispatch({
        type: 'LOAD_AUTH_FAILURE',
        payload: 'Não foi possível carregar sua sessão.',
      });
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(async ({ name, avatarId }: LoginPayload) => {
    const user: AuthUser = {
      id: createId(),
      name: name.trim(),
      avatarId,
    };

    try {
      await saveAuthUser(user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch {
      dispatch({
        type: 'LOAD_AUTH_FAILURE',
        payload: 'Não foi possível iniciar a sessão. Tente novamente.',
      });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await clearAuthUser();
      dispatch({ type: 'LOGOUT_SUCCESS' });
    } catch {
      dispatch({
        type: 'LOAD_AUTH_FAILURE',
        payload: 'Não foi possível sair da conta.',
      });
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.user),
      login,
      logout,
      refreshSession,
    }),
    [login, logout, refreshSession, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
