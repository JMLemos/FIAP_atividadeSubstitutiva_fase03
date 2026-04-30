export type EditableHealthField = 'water' | 'sleep' | 'mood' | 'exercise';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  DailyRecord:
    | {
        date?: string;
        focusField?: EditableHealthField;
      }
    | undefined;
  History: undefined;
};
