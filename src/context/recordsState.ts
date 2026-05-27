import { HealthRecord } from '../models/HealthRecord';

export type RecordsState = {
  records: HealthRecord[];
  isLoading: boolean;
  error: string | null;
};

export const initialRecordsState: RecordsState = {
  records: [],
  isLoading: true,
  error: null,
};
