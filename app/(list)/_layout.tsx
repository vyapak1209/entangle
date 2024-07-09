import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { bootCryptoPolyfill } from '@/utils/crypto-polyfill';
import { ReplicacheProvider } from '@/context/ReplicacheContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

bootCryptoPolyfill();

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="[listID]" options={{ headerShown: false }} />
    </Stack>
  );
}
