import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useReducer } from 'react';

import { HealthRecord } from '../models/HealthRecord';
import { loadRecords, saveRecords } from '../storage/recordsStorage';
import { sortRecordsByDateDesc, upsertHealthRecord } from '../utils/recordUtils';
import { recordsReducer } from './recordsReducer';
import { initialRecordsState, RecordsState } from './recordsState';

type RecordsContextValue = RecordsState & {
  upsertRecord: (record: HealthRecord) => Promise<void>;
  refreshRecords: () => Promise<void>;
};

export const RecordsContext = createContext<RecordsContextValue | undefined>(undefined);

export function RecordsProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(recordsReducer, initialRecordsState);

  const refreshRecords = useCallback(async () => {
    dispatch({ type: 'LOAD_RECORDS_START' });

    try {
      const records = await loadRecords();
      dispatch({ type: 'LOAD_RECORDS_SUCCESS', payload: sortRecordsByDateDesc(records) });
    } catch {
      dispatch({
        type: 'LOAD_RECORDS_FAILURE',
        payload: 'Não foi possível carregar seus registros.',
      });
    }
  }, []);

  useEffect(() => {
    void refreshRecords();
  }, [refreshRecords]);

  const upsertRecord = useCallback(
    async (record: HealthRecord) => {
      const nextRecords = upsertHealthRecord(state.records, record);

      try {
        await saveRecords(nextRecords);
        dispatch({ type: 'UPSERT_RECORD', payload: nextRecords });
      } catch {
        dispatch({
          type: 'LOAD_RECORDS_FAILURE',
          payload: 'Não foi possível salvar o registro. Tente novamente.',
        });
      }
    },
    [state.records],
  );

  const value = useMemo(
    () => ({
      ...state,
      upsertRecord,
      refreshRecords,
    }),
    [refreshRecords, state, upsertRecord],
  );

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}
