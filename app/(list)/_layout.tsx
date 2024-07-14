import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { bootCryptoPolyfill } from '@/utils/crypto-polyfill';

SplashScreen.preventAutoHideAsync();

bootCryptoPolyfill();

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="[listID]" options={{ headerShown: false }} />
    </Stack>
  );
}
