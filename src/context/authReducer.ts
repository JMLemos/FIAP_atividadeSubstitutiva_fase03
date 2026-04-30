import { AuthAction } from './authActions';
import { AuthState } from './authState';

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOAD_AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOAD_AUTH_SUCCESS':
      return {
        user: action.payload,
        isLoading: false,
        error: null,
      };
    case 'LOAD_AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT_SUCCESS':
      return {
        user: null,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}
