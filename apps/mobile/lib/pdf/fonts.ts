import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

interface FontEntry {
  weight: number;
  asset: number;
}

/* eslint-disable @typescript-eslint/no-require-imports */
const FONT_ASSETS: FontEntry[] = [
  { weight: 400, asset: require('../../assets/fonts/Rubik-Regular.ttf') },
  { weight: 500, asset: require('../../assets/fonts/Rubik-Medium.ttf') },
  { weight: 600, asset: require('../../assets/fonts/Rubik-SemiBold.ttf') },
  { weight: 700, asset: require('../../assets/fonts/Rubik-Bold.ttf') },
];
/* eslint-enable @typescript-eslint/no-require-imports */

let cachedFontFaceCss: string | null = null;

export async function loadFontFaceCss(): Promise<string> {
  if (cachedFontFaceCss) return cachedFontFaceCss;

  if (Platform.OS === 'web') {
    cachedFontFaceCss =
      "@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap');";
    return cachedFontFaceCss;
  }

  const declarations: string[] = [];

  for (const { weight, asset } of FONT_ASSETS) {
    const resolved = Asset.fromModule(asset);
    await resolved.downloadAsync();

    if (!resolved.localUri) continue;

    const base64 = await FileSystem.readAsStringAsync(resolved.localUri, {
      encoding: 'base64',
    });

    declarations.push(`
      @font-face {
        font-family: 'Rubik';
        font-weight: ${weight};
        font-style: normal;
        src: url(data:font/truetype;base64,${base64}) format('truetype');
      }
    `);
  }

  cachedFontFaceCss = declarations.join('\n');
  return cachedFontFaceCss;
}
