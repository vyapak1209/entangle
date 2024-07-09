/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#181818',
    background: '#f4f4f4',
    subtleBackground: '#18181812',
    placeholder: '#18181845',
    purple: '#d5bbd6',
    yellow: '#e9e7b4',
    teal: '#b7e4dd',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    purple: '#d5bbd6',
    subtleBackground: '#18181812',
    placeholder: '#18181826',
    yellow: '#e9e7b4',
    teal: '#b7e4dd',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
