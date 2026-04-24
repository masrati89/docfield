#!/usr/bin/env node
/**
 * Generates app icons for iOS and Android from an SVG template.
 * Run: node scripts/generate-icons.mjs
 * Requires: sharp (npm install --no-save sharp)
 */
import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'apps', 'mobile', 'assets');

// inField brand colors
const PRIMARY_700 = '#0F4F2E';
const PRIMARY_500 = '#1B7A44';
const CREAM_50 = '#FEFDFB';

// Icon SVG — "iF" monogram on forest green background
function iconSvg(size) {
  const fontSize = Math.round(size * 0.42);
  const cornerRadius = Math.round(size * 0.22);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${PRIMARY_700}"/>
      <stop offset="100%" stop-color="${PRIMARY_500}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="url(#bg)"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700"
        fill="white" letter-spacing="-2">iF</text>
</svg>`;
}

// Adaptive icon foreground — just the "iF" text on transparent, centered in safe zone
function adaptiveForegroundSvg(size) {
  const fontSize = Math.round(size * 0.30);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700"
        fill="white" letter-spacing="-2">iF</text>
</svg>`;
}

async function generate() {
  // 1. iOS icon (1024x1024) — rounded corners baked in
  const iosBuffer = Buffer.from(iconSvg(1024));
  await sharp(iosBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(join(assetsDir, 'icon.png'));
  console.log('✓ icon.png (1024x1024) — iOS app icon');

  // 2. Android adaptive icon foreground (1024x1024)
  const fgBuffer = Buffer.from(adaptiveForegroundSvg(1024));
  await sharp(fgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(join(assetsDir, 'adaptive-icon.png'));
  console.log('✓ adaptive-icon.png (1024x1024) — Android foreground');

  // 3. Splash icon (200x200) — used in splash screen
  const splashBuffer = Buffer.from(iconSvg(200));
  await sharp(splashBuffer)
    .resize(200, 200)
    .png()
    .toFile(join(assetsDir, 'splash-icon.png'));
  console.log('✓ splash-icon.png (200x200) — splash screen');

  // 4. Favicon (48x48)
  const faviconBuffer = Buffer.from(iconSvg(48));
  await sharp(faviconBuffer)
    .resize(48, 48)
    .png()
    .toFile(join(assetsDir, 'favicon.png'));
  console.log('✓ favicon.png (48x48) — web favicon');

  console.log('\nDone! Update app.json icon paths if needed.');
}

generate().catch(console.error);
