import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { bootCryptoPolyfill } from '@/utils/crypto-polyfill';
import { ReplicacheProvider } from '@/context/ReplicacheContext';
import { LogBox, StatusBar } from 'react-native';

// Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);

//Ignore all log notifications
LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

bootCryptoPolyfill();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Rubik400: require('../assets/fonts/Rubik-Light.ttf'),
    Rubik500: require('../assets/fonts/Rubik-Regular.ttf'),
    Rubik600: require('../assets/fonts/Rubik-Medium.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      StatusBar.setBarStyle('dark-content');
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ReplicacheProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="(list)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </ReplicacheProvider>
  );
}
