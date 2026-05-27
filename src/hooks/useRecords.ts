import { useContext } from 'react';

import { RecordsContext } from '../context/RecordsContext';

export function useRecords() {
  const context = useContext(RecordsContext);

  if (!context) {
    throw new Error('useRecords deve ser usado dentro de RecordsProvider.');
  }

  return context;
}
