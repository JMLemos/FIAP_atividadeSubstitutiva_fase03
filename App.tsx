import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import { RecordsProvider } from './src/context/RecordsContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RecordsProvider>
          <AppNavigator />
          <StatusBar style="dark" />
        </RecordsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
