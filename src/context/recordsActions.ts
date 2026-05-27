import { HealthRecord } from '../models/HealthRecord';

export type RecordsAction =
  | { type: 'LOAD_RECORDS_START' }
  | { type: 'LOAD_RECORDS_SUCCESS'; payload: HealthRecord[] }
  | { type: 'LOAD_RECORDS_FAILURE'; payload: string }
  | { type: 'UPSERT_RECORD'; payload: HealthRecord[] };
