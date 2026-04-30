import { RecordsAction } from './recordsActions';
import { RecordsState } from './recordsState';

export function recordsReducer(state: RecordsState, action: RecordsAction): RecordsState {
  switch (action.type) {
    case 'LOAD_RECORDS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOAD_RECORDS_SUCCESS':
      return {
        records: action.payload,
        isLoading: false,
        error: null,
      };
    case 'LOAD_RECORDS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'UPSERT_RECORD':
      return {
        records: action.payload,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}
