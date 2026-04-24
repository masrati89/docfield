#!/usr/bin/env node
/**
 * Generates marketing screenshots and video frames for app store listings.
 * Run: node scripts/generate-marketing.mjs
 * Requires: sharp (npm install --no-save sharp)
 */
import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outScreenshots = join(root, 'marketing', 'screenshots');
const outVideos = join(root, 'marketing', 'videos');
const framesDir = join(root, 'marketing', 'frames');
const ffmpeg = join(root, 'node_modules', 'ffmpeg-static', 'ffmpeg');

// -- Brand Colors --
const C = {
  bg: '#FEFDFB',
  primary700: '#0F4F2E',
  primary500: '#1B7A44',
  primary400: '#2A9D5C',
  primary50: '#F0F7F4',
  cream200: '#F5EFE6',
  cream100: '#FAF7F2',
  gold500: '#C8952E',
  gold100: '#FDF4E7',
  neutral800: '#2D2A26',
  neutral600: '#6B6560',
  neutral500: '#8A847D',
  neutral400: '#A8A49D',
  neutral200: '#D9D5CF',
  danger500: '#DC2626',
  success500: '#16A34A',
  white: '#FFFFFF',
};

// -- Screen Sizes --
const STORE_W = 1290;
const STORE_H = 2796;
const REEL_W = 1080;
const REEL_H = 1920;

// =====================
// SVG Helpers
// =====================

function phoneSvg(innerContent, { w = STORE_W, h = STORE_H, title, subtitle } = {}) {
  const phoneW = w * 0.72;
  const phoneH = h * 0.62;
  const phoneX = (w - phoneW) / 2;
  const phoneY = h * 0.28;
  const screenPad = phoneW * 0.03;
  const screenW = phoneW - screenPad * 2;
  const screenH = phoneH - screenPad * 2 - phoneW * 0.06;
  const screenX = phoneX + screenPad;
  const screenY = phoneY + screenPad + phoneW * 0.03;
  const cornerR = phoneW * 0.07;

  const titleY = h * 0.06;
  const subtitleY = h * 0.12;
  const titleSize = w * 0.048;
  const subtitleSize = w * 0.028;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="${C.primary700}"/>
      <stop offset="100%" stop-color="#0A3D22"/>
    </linearGradient>
    <clipPath id="screenClip">
      <rect x="${screenX}" y="${screenY}" width="${screenW}" height="${screenH}" rx="12"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="${w}" height="${h}" fill="url(#bgGrad)"/>

  <!-- Decorative circles -->
  <circle cx="${w * 0.85}" cy="${h * 0.08}" r="${w * 0.15}" fill="${C.primary500}" opacity="0.15"/>
  <circle cx="${w * 0.1}" cy="${h * 0.95}" r="${w * 0.12}" fill="${C.gold500}" opacity="0.1"/>

  <!-- Title -->
  ${title ? `<text x="${w / 2}" y="${titleY}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${titleSize}" font-weight="700" fill="${C.white}">${title}</text>` : ''}
  ${subtitle ? `<text x="${w / 2}" y="${subtitleY}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${subtitleSize}" font-weight="400" fill="${C.primary400}" opacity="0.9">${subtitle}</text>` : ''}

  <!-- Logo badge -->
  <rect x="${w / 2 - 28}" y="${h * 0.155}" width="56" height="56" rx="14" fill="${C.primary500}"/>
  <text x="${w / 2}" y="${h * 0.155 + 37}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="${C.white}">iF</text>
  <text x="${w / 2}" y="${h * 0.155 + 72}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${subtitleSize * 0.85}" font-weight="600" fill="${C.white}" opacity="0.8">inField</text>

  <!-- Phone frame -->
  <rect x="${phoneX}" y="${phoneY}" width="${phoneW}" height="${phoneH}" rx="${cornerR}" fill="#1a1a1a" stroke="#333" stroke-width="2"/>

  <!-- Notch -->
  <rect x="${phoneX + phoneW / 2 - 50}" y="${phoneY + 6}" width="100" height="24" rx="12" fill="#000"/>

  <!-- Screen background -->
  <rect x="${screenX}" y="${screenY}" width="${screenW}" height="${screenH}" rx="12" fill="${C.bg}"/>

  <!-- Screen content (clipped) -->
  <g clip-path="url(#screenClip)">
    ${innerContent(screenX, screenY, screenW, screenH)}
  </g>
</svg>`;
}

// =====================
// Screen 1: Home Dashboard
// =====================
function screen1Content(sx, sy, sw, sh) {
  const p = sw * 0.05;
  return `
    <!-- Header gradient -->
    <rect x="${sx}" y="${sy}" width="${sw}" height="${sh * 0.18}" fill="url(#bgGrad)"/>
    <text x="${sx + sw - p}" y="${sy + sh * 0.06}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.05}" font-weight="700" fill="${C.white}" direction="rtl">שלום, חיים</text>
    <text x="${sx + sw - p}" y="${sy + sh * 0.095}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.028}" fill="${C.primary400}" direction="rtl">ביקורת בנייה חכמה</text>

    <!-- Stats strip -->
    ${statsCard(sx + p, sy + sh * 0.13, sw * 0.28, '12', 'דוחות', C.primary500)}
    ${statsCard(sx + p + sw * 0.33, sy + sh * 0.13, sw * 0.28, '47', 'ליקויים', C.gold500)}
    ${statsCard(sx + p + sw * 0.66, sy + sh * 0.13, sw * 0.28, '5', 'פרויקטים', C.primary400)}

    <!-- Recent reports section -->
    <text x="${sx + sw - p}" y="${sy + sh * 0.27}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.035}" font-weight="600" fill="${C.neutral800}" direction="rtl">דוחות אחרונים</text>
    ${reportRow(sx + p, sy + sh * 0.30, sw - p * 2, 'דירה 4, הרצל 15', 'בדק בית', 'טיוטה', C.gold500)}
    ${reportRow(sx + p, sy + sh * 0.375, sw - p * 2, 'דירה 7, סוקולוב 3', 'פרוטוקול מסירה', 'הושלם', C.success500)}
    ${reportRow(sx + p, sy + sh * 0.45, sw - p * 2, 'דירה 12, רוטשילד 8', 'בדק בית', 'בתהליך', C.primary500)}

    <!-- Tools grid -->
    <text x="${sx + sw - p}" y="${sy + sh * 0.555}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.035}" font-weight="600" fill="${C.neutral800}" direction="rtl">כלים</text>
    ${toolCard(sx + p, sy + sh * 0.58, sw * 0.44, 'ביקורת חדשה', '#22C55E')}
    ${toolCard(sx + sw * 0.52, sy + sh * 0.58, sw * 0.44, 'ספריית ליקויים', C.gold500)}
    ${toolCard(sx + p, sy + sh * 0.66, sw * 0.44, 'סטטיסטיקות', C.primary500)}
    ${toolCard(sx + sw * 0.52, sy + sh * 0.66, sw * 0.44, 'עזרה', C.neutral500)}

    <!-- Tab bar -->
    ${tabBar(sx, sy + sh - sh * 0.08, sw, sh * 0.08)}
  `;
}

// =====================
// Screen 2: Reports List
// =====================
function screen2Content(sx, sy, sw, sh) {
  const p = sw * 0.05;
  return `
    <!-- Header -->
    <rect x="${sx}" y="${sy}" width="${sw}" height="${sh * 0.08}" fill="${C.bg}"/>
    <text x="${sx + sw / 2}" y="${sy + sh * 0.05}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${sw * 0.04}" font-weight="600" fill="${C.neutral800}">דוחות</text>

    <!-- Search bar -->
    <rect x="${sx + p}" y="${sy + sh * 0.09}" width="${sw - p * 2}" height="${sh * 0.045}" rx="10" fill="${C.cream100}" stroke="${C.cream200}" stroke-width="1"/>
    <text x="${sx + sw - p * 2}" y="${sy + sh * 0.119}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.025}" fill="${C.neutral400}" direction="rtl">חיפוש דוחות...</text>

    <!-- Filter chips -->
    ${chip(sx + sw - p, sy + sh * 0.15, 'הכל', true)}
    ${chip(sx + sw - p - sw * 0.17, sy + sh * 0.15, 'טיוטה', false)}
    ${chip(sx + sw - p - sw * 0.34, sy + sh * 0.15, 'הושלם', false)}

    <!-- Report cards -->
    ${reportCard(sx + p, sy + sh * 0.19, sw - p * 2, sh * 0.11, 'דוח בדק בית — דירה 4', 'פרויקט הרצל, בניין A', '24/04/2026', 'טיוטה', C.gold500, '5 ליקויים')}
    ${reportCard(sx + p, sy + sh * 0.315, sw - p * 2, sh * 0.11, 'פרוטוקול מסירה — דירה 7', 'פרויקט סוקולוב, בניין B', '22/04/2026', 'הושלם', C.success500, '3 ליקויים')}
    ${reportCard(sx + p, sy + sh * 0.44, sw - p * 2, sh * 0.11, 'דוח בדק בית — דירה 12', 'פרויקט רוטשילד, בניין C', '20/04/2026', 'בתהליך', C.primary500, '8 ליקויים')}
    ${reportCard(sx + p, sy + sh * 0.565, sw - p * 2, sh * 0.11, 'פרוטוקול מסירה — דירה 2', 'פרויקט הרצל, בניין A', '18/04/2026', 'הושלם', C.success500, '2 ליקויים')}
    ${reportCard(sx + p, sy + sh * 0.69, sw - p * 2, sh * 0.11, 'דוח בדק בית — דירה 9', 'פרויקט אלנבי, בניין D', '15/04/2026', 'הושלם', C.success500, '6 ליקויים')}

    <!-- FAB -->
    <circle cx="${sx + p + 24}" cy="${sy + sh * 0.87}" r="24" fill="${C.primary500}"/>
    <text x="${sx + p + 24}" y="${sy + sh * 0.87 + 8}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="28" font-weight="300" fill="${C.white}">+</text>

    ${tabBar(sx, sy + sh - sh * 0.08, sw, sh * 0.08)}
  `;
}

// =====================
// Screen 3: Report Detail with Defects
// =====================
function screen3Content(sx, sy, sw, sh) {
  const p = sw * 0.05;
  return `
    <!-- Header bar -->
    <rect x="${sx}" y="${sy}" width="${sw}" height="${sh * 0.07}" fill="${C.bg}" stroke="${C.cream200}" stroke-width="0 0 1 0"/>
    <text x="${sx + sw / 2}" y="${sy + sh * 0.045}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${sw * 0.035}" font-weight="600" fill="${C.neutral800}">דוח בדק בית</text>

    <!-- Report info card -->
    <rect x="${sx + p}" y="${sy + sh * 0.085}" width="${sw - p * 2}" height="${sh * 0.12}" rx="10" fill="${C.cream100}" stroke="${C.cream200}" stroke-width="1"/>
    <text x="${sx + sw - p * 2}" y="${sy + sh * 0.115}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.03}" font-weight="600" fill="${C.neutral800}" direction="rtl">דירה 4 — הרצל 15, ת"א</text>
    <text x="${sx + sw - p * 2}" y="${sy + sh * 0.145}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.022}" fill="${C.neutral500}" direction="rtl">סבב ראשון • 24/04/2026 • 5 ליקויים</text>
    <text x="${sx + sw - p * 2}" y="${sy + sh * 0.175}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.022}" fill="${C.neutral500}" direction="rtl">דייר: ישראל ישראלי • 050-1234567</text>

    <!-- Category: אינסטלציה -->
    <text x="${sx + sw - p}" y="${sy + sh * 0.235}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.03}" font-weight="600" fill="${C.neutral800}" direction="rtl">אינסטלציה (2)</text>

    ${defectRow(sx + p, sy + sh * 0.255, sw - p * 2, '1', 'נזילה מצנרת תחת הכיור', 'מטבח', 'גבוהה', C.danger500)}
    ${defectRow(sx + p, sy + sh * 0.34, sw - p * 2, '2', 'לחץ מים נמוך בברז מקלחת', 'חדר רחצה', 'בינונית', C.gold500)}

    <!-- Category: חשמל -->
    <text x="${sx + sw - p}" y="${sy + sh * 0.45}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.03}" font-weight="600" fill="${C.neutral800}" direction="rtl">חשמל (2)</text>

    ${defectRow(sx + p, sy + sh * 0.47, sw - p * 2, '3', 'שקע חשמל רופף', 'סלון', 'בינונית', C.gold500)}
    ${defectRow(sx + p, sy + sh * 0.555, sw - p * 2, '4', 'מפסק אור לא פועל', 'חדר שינה', 'נמוכה', C.primary500)}

    <!-- Category: ריצוף -->
    <text x="${sx + sw - p}" y="${sy + sh * 0.665}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.03}" font-weight="600" fill="${C.neutral800}" direction="rtl">ריצוף (1)</text>

    ${defectRow(sx + p, sy + sh * 0.685, sw - p * 2, '5', 'אריח שבור ליד הכניסה', 'כניסה', 'גבוהה', C.danger500)}

    <!-- Action buttons -->
    <rect x="${sx + p}" y="${sy + sh * 0.82}" width="${sw * 0.43}" height="${sh * 0.045}" rx="10" fill="${C.primary500}"/>
    <text x="${sx + p + sw * 0.215}" y="${sy + sh * 0.85}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${sw * 0.025}" font-weight="600" fill="${C.white}">הפקת PDF</text>
    <rect x="${sx + sw * 0.52}" y="${sy + sh * 0.82}" width="${sw * 0.43}" height="${sh * 0.045}" rx="10" fill="${C.white}" stroke="${C.primary500}" stroke-width="1.5"/>
    <text x="${sx + sw * 0.52 + sw * 0.215}" y="${sy + sh * 0.85}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${sw * 0.025}" font-weight="600" fill="${C.primary500}">שיתוף</text>
  `;
}

// =====================
// Screen 4: Checklist
// =====================
function screen4Content(sx, sy, sw, sh) {
  const p = sw * 0.05;
  return `
    <!-- Header -->
    <rect x="${sx}" y="${sy}" width="${sw}" height="${sh * 0.07}" fill="${C.bg}"/>
    <text x="${sx + sw / 2}" y="${sy + sh * 0.045}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${sw * 0.035}" font-weight="600" fill="${C.neutral800}">צ׳קליסט מסירה</text>

    <!-- Progress bar -->
    <rect x="${sx + p}" y="${sy + sh * 0.085}" width="${sw - p * 2}" height="8" rx="4" fill="${C.cream200}"/>
    <rect x="${sx + p}" y="${sy + sh * 0.085}" width="${(sw - p * 2) * 0.72}" height="8" rx="4" fill="${C.primary500}"/>
    <text x="${sx + sw / 2}" y="${sy + sh * 0.115}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${sw * 0.022}" fill="${C.neutral500}">72% הושלם — 18 מתוך 25 פריטים</text>

    <!-- Room: מטבח -->
    <rect x="${sx + p}" y="${sy + sh * 0.14}" width="${sw - p * 2}" height="${sh * 0.04}" rx="8" fill="${C.primary50}"/>
    <text x="${sx + sw - p * 2}" y="${sy + sh * 0.167}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.028}" font-weight="600" fill="${C.primary700}" direction="rtl">מטבח</text>

    ${checkItem(sx + p, sy + sh * 0.19, sw - p * 2, 'ארונות — פתיחה וסגירה תקינה', 'ok')}
    ${checkItem(sx + p, sy + sh * 0.235, sw - p * 2, 'משטח עבודה — ללא שריטות', 'ok')}
    ${checkItem(sx + p, sy + sh * 0.28, sw - p * 2, 'ברז מים — תקינות ואטימות', 'defect')}
    ${checkItem(sx + p, sy + sh * 0.325, sw - p * 2, 'תאורה — כל הנקודות פועלות', 'ok')}

    <!-- Room: חדר רחצה -->
    <rect x="${sx + p}" y="${sy + sh * 0.385}" width="${sw - p * 2}" height="${sh * 0.04}" rx="8" fill="${C.primary50}"/>
    <text x="${sx + sw - p * 2}" y="${sy + sh * 0.412}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.028}" font-weight="600" fill="${C.primary700}" direction="rtl">חדר רחצה</text>

    ${checkItem(sx + p, sy + sh * 0.435, sw - p * 2, 'אסלה — שטיפה תקינה', 'ok')}
    ${checkItem(sx + p, sy + sh * 0.48, sw - p * 2, 'מקלחת — ניקוז תקין', 'partial')}
    ${checkItem(sx + p, sy + sh * 0.525, sw - p * 2, 'מראה — תקינה ומחוברת', 'ok')}
    ${checkItem(sx + p, sy + sh * 0.57, sw - p * 2, 'אוורור — מאוורר פועל', 'unchecked')}

    <!-- Room: סלון -->
    <rect x="${sx + p}" y="${sy + sh * 0.63}" width="${sw - p * 2}" height="${sh * 0.04}" rx="8" fill="${C.primary50}"/>
    <text x="${sx + sw - p * 2}" y="${sy + sh * 0.657}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.028}" font-weight="600" fill="${C.primary700}" direction="rtl">סלון</text>

    ${checkItem(sx + p, sy + sh * 0.68, sw - p * 2, 'חלונות — פתיחה ונעילה', 'ok')}
    ${checkItem(sx + p, sy + sh * 0.725, sw - p * 2, 'שקעי חשמל — כל הנקודות', 'ok')}
    ${checkItem(sx + p, sy + sh * 0.77, sw - p * 2, 'ריצוף — ללא סדקים', 'ok')}

    <!-- Bottom actions -->
    <rect x="${sx + p}" y="${sy + sh * 0.85}" width="${sw - p * 2}" height="${sh * 0.045}" rx="10" fill="${C.primary500}"/>
    <text x="${sx + sw / 2}" y="${sy + sh * 0.88}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${sw * 0.025}" font-weight="600" fill="${C.white}">סיכום ויצירת דוח</text>
  `;
}

// =====================
// Screen 5: PDF Preview
// =====================
function screen5Content(sx, sy, sw, sh) {
  const p = sw * 0.04;
  const pw = sw - p * 2;
  return `
    <!-- PDF page background -->
    <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="#E8E5E0"/>

    <!-- PDF page -->
    <rect x="${sx + p}" y="${sy + sh * 0.02}" width="${pw}" height="${sh * 0.94}" rx="4" fill="${C.white}" stroke="${C.neutral200}" stroke-width="1"/>

    <!-- PDF header -->
    <rect x="${sx + p}" y="${sy + sh * 0.02}" width="${pw}" height="${sh * 0.08}" rx="4" fill="${C.primary700}"/>
    <text x="${sx + sw / 2}" y="${sy + sh * 0.055}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${sw * 0.045}" font-weight="700" fill="${C.white}">דוח בדק בית</text>
    <text x="${sx + sw / 2}" y="${sy + sh * 0.085}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${sw * 0.02}" fill="${C.primary400}">בדיקת קבלה לדירה חדשה</text>

    <!-- PDF details -->
    <text x="${sx + pw}" y="${sy + sh * 0.135}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.022}" fill="${C.neutral800}" direction="rtl">פרויקט: הרצל 15, תל אביב</text>
    <text x="${sx + pw}" y="${sy + sh * 0.165}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.022}" fill="${C.neutral800}" direction="rtl">דירה: 4, קומה 2</text>
    <text x="${sx + pw}" y="${sy + sh * 0.195}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.022}" fill="${C.neutral800}" direction="rtl">מזמין: ישראל ישראלי</text>
    <text x="${sx + pw}" y="${sy + sh * 0.225}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.022}" fill="${C.neutral800}" direction="rtl">מפקח: חיים מסרטי, מ.ר. 12345</text>
    <text x="${sx + pw}" y="${sy + sh * 0.255}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.022}" fill="${C.neutral800}" direction="rtl">תאריך: 24/04/2026</text>

    <!-- Separator -->
    <rect x="${sx + p * 2}" y="${sy + sh * 0.275}" width="${pw - p * 2}" height="1" fill="${C.cream200}"/>

    <!-- Defect summary -->
    <text x="${sx + pw}" y="${sy + sh * 0.31}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.028}" font-weight="600" fill="${C.primary700}" direction="rtl">סיכום ממצאים</text>

    ${pdfSummaryRow(sx + p * 2, sy + sh * 0.33, pw - p * 2, 'אינסטלציה', '2', C.danger500)}
    ${pdfSummaryRow(sx + p * 2, sy + sh * 0.365, pw - p * 2, 'חשמל', '2', C.gold500)}
    ${pdfSummaryRow(sx + p * 2, sy + sh * 0.40, pw - p * 2, 'ריצוף', '1', C.danger500)}

    <!-- Total -->
    <rect x="${sx + p * 2}" y="${sy + sh * 0.435}" width="${pw - p * 2}" height="${sh * 0.04}" rx="6" fill="${C.primary50}"/>
    <text x="${sx + pw - p}" y="${sy + sh * 0.462}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.025}" font-weight="700" fill="${C.primary700}" direction="rtl">סה"כ: 5 ליקויים</text>

    <!-- Defect detail preview -->
    <text x="${sx + pw}" y="${sy + sh * 0.51}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${sw * 0.028}" font-weight="600" fill="${C.primary700}" direction="rtl">פירוט ממצאים</text>

    ${pdfDefectItem(sx + p * 2, sy + sh * 0.535, pw - p * 2, '1', 'נזילה מצנרת תחת הכיור', 'מטבח', 'גבוהה')}
    ${pdfDefectItem(sx + p * 2, sy + sh * 0.62, pw - p * 2, '2', 'לחץ מים נמוך בברז', 'חדר רחצה', 'בינונית')}

    <!-- Signature area -->
    <rect x="${sx + p * 2}" y="${sy + sh * 0.76}" width="${pw - p * 2}" height="1" fill="${C.cream200}"/>
    <text x="${sx + sw / 2}" y="${sy + sh * 0.795}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${sw * 0.022}" fill="${C.neutral500}">חתימת מפקח                    חתימת דייר</text>

    <!-- Signature scribbles -->
    <path d="M${sx + p * 3} ${sy + sh * 0.83} q30 -15 60 0 t60 -5" fill="none" stroke="${C.neutral800}" stroke-width="1.5" opacity="0.6"/>
    <path d="M${sx + pw - p * 2} ${sy + sh * 0.835} q-25 -12 -50 2 t-45 -8" fill="none" stroke="${C.neutral800}" stroke-width="1.5" opacity="0.6"/>

    <!-- Share button overlay -->
    <rect x="${sx + p}" y="${sy + sh * 0.90}" width="${pw}" height="${sh * 0.045}" rx="10" fill="${C.primary500}"/>
    <text x="${sx + sw / 2}" y="${sy + sh * 0.93}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${sw * 0.025}" font-weight="600" fill="${C.white}">שתף דוח PDF</text>
  `;
}

// =====================
// UI Component Helpers
// =====================

function statsCard(x, y, w, num, label, color) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${w * 0.7}" rx="10" fill="${C.white}" stroke="${C.cream200}" stroke-width="1"/>
    <text x="${x + w / 2}" y="${y + w * 0.32}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${w * 0.32}" font-weight="700" fill="${color}">${num}</text>
    <text x="${x + w / 2}" y="${y + w * 0.55}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${w * 0.14}" fill="${C.neutral500}">${label}</text>
  `;
}

function reportRow(x, y, w, title, type, status, statusColor) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${w * 0.16}" rx="10" fill="${C.white}" stroke="${C.cream200}" stroke-width="1"/>
    <text x="${x + w - 12}" y="${y + w * 0.065}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${w * 0.04}" font-weight="500" fill="${C.neutral800}" direction="rtl">${title}</text>
    <text x="${x + w - 12}" y="${y + w * 0.12}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${w * 0.03}" fill="${C.neutral500}" direction="rtl">${type}</text>
    <rect x="${x + 10}" y="${y + w * 0.045}" width="${w * 0.14}" height="${w * 0.055}" rx="8" fill="${statusColor}" opacity="0.15"/>
    <text x="${x + 10 + w * 0.07}" y="${y + w * 0.085}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${w * 0.025}" font-weight="600" fill="${statusColor}">${status}</text>
  `;
}

function toolCard(x, y, w, label, color) {
  const h = w * 0.36;
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${C.white}" stroke="${C.cream200}" stroke-width="1"/>
    <circle cx="${x + w / 2}" cy="${y + h * 0.38}" r="${h * 0.2}" fill="${color}" opacity="0.15"/>
    <text x="${x + w / 2}" y="${y + h * 0.8}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${w * 0.085}" font-weight="500" fill="${C.neutral800}">${label}</text>
  `;
}

function reportCard(x, y, w, h, title, subtitle, date, status, statusColor, count) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${C.white}" stroke="${C.cream200}" stroke-width="1"/>
    <text x="${x + w - 12}" y="${y + h * 0.28}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${w * 0.04}" font-weight="600" fill="${C.neutral800}" direction="rtl">${title}</text>
    <text x="${x + w - 12}" y="${y + h * 0.50}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${w * 0.03}" fill="${C.neutral500}" direction="rtl">${subtitle}</text>
    <text x="${x + w - 12}" y="${y + h * 0.72}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${w * 0.025}" fill="${C.neutral400}" direction="rtl">${date} • ${count}</text>
    <rect x="${x + 10}" y="${y + h * 0.15}" width="${w * 0.13}" height="${h * 0.22}" rx="8" fill="${statusColor}" opacity="0.15"/>
    <text x="${x + 10 + w * 0.065}" y="${y + h * 0.32}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${w * 0.024}" font-weight="600" fill="${statusColor}">${status}</text>
  `;
}

function chip(x, y, label, active) {
  const w = label.length * 9 + 20;
  return `
    <rect x="${x - w}" y="${y}" width="${w}" height="26" rx="13" fill="${active ? C.primary500 : C.cream100}" stroke="${active ? C.primary500 : C.cream200}" stroke-width="1"/>
    <text x="${x - w / 2}" y="${y + 18}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="${active ? '600' : '400'}" fill="${active ? C.white : C.neutral600}">${label}</text>
  `;
}

function defectRow(x, y, w, num, title, location, severity, sevColor) {
  const h = w * 0.16;
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${C.white}" stroke="${C.cream200}" stroke-width="1"/>
    <circle cx="${x + w - 16}" cy="${y + h * 0.35}" r="12" fill="${C.primary50}"/>
    <text x="${x + w - 16}" y="${y + h * 0.42}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="${C.primary700}">${num}</text>
    <text x="${x + w - 38}" y="${y + h * 0.38}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${w * 0.035}" font-weight="500" fill="${C.neutral800}" direction="rtl">${title}</text>
    <text x="${x + w - 38}" y="${y + h * 0.65}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${w * 0.025}" fill="${C.neutral500}" direction="rtl">${location}</text>
    <rect x="${x + 10}" y="${y + h * 0.25}" width="${w * 0.12}" height="${h * 0.25}" rx="6" fill="${sevColor}" opacity="0.15"/>
    <text x="${x + 10 + w * 0.06}" y="${y + h * 0.44}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="${sevColor}">${severity}</text>
    <!-- Photo placeholder -->
    <rect x="${x + 8}" y="${y + h * 0.55}" width="${w * 0.09}" height="${h * 0.35}" rx="4" fill="${C.cream100}" stroke="${C.cream200}" stroke-width="0.5"/>
  `;
}

function checkItem(x, y, w, label, status) {
  const h = 32;
  const iconColor = status === 'ok' ? C.success500 : status === 'defect' ? C.danger500 : status === 'partial' ? C.gold500 : C.neutral400;
  const sym = status === 'ok' ? '✓' : status === 'defect' ? '✗' : status === 'partial' ? '~' : '○';
  const bg = status === 'ok' ? '#ecfdf5' : status === 'defect' ? '#fef2f2' : status === 'partial' ? '#fefaed' : C.cream100;
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${C.white}"/>
    <rect x="${x + w - 28}" y="${y + 5}" width="22" height="22" rx="4" fill="${bg}"/>
    <text x="${x + w - 17}" y="${y + 21}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="${iconColor}">${sym}</text>
    <text x="${x + w - 38}" y="${y + 21}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${w * 0.032}" fill="${C.neutral800}" direction="rtl">${label}</text>
  `;
}

function pdfSummaryRow(x, y, w, cat, count, color) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="24" rx="4" fill="${C.cream100}"/>
    <text x="${x + w - 8}" y="${y + 17}" text-anchor="end" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="${C.neutral800}" direction="rtl">${cat}</text>
    <circle cx="${x + 16}" cy="${y + 12}" r="10" fill="${color}" opacity="0.15"/>
    <text x="${x + 16}" y="${y + 16}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="${color}">${count}</text>
  `;
}

function pdfDefectItem(x, y, w, num, title, loc, sev) {
  return `
    <text x="${x + w - 4}" y="${y + 14}" text-anchor="end" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="${C.neutral800}" direction="rtl">${num}. ${title}</text>
    <text x="${x + w - 4}" y="${y + 32}" text-anchor="end" font-family="system-ui, sans-serif" font-size="11" fill="${C.neutral500}" direction="rtl">מיקום: ${loc} | חומרה: ${sev}</text>
    <rect x="${x}" y="${y + 40}" width="${w * 0.25}" height="${w * 0.15}" rx="4" fill="${C.cream200}"/>
    <text x="${x + w * 0.125}" y="${y + 40 + w * 0.09}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="${C.neutral400}">תמונה</text>
    <rect x="${x}" y="${y + 42 + w * 0.15}" width="${w}" height="1" fill="${C.cream200}"/>
  `;
}

function tabBar(x, y, w, h) {
  const tabs = ['הגדרות', 'פרויקטים', 'דוחות', 'בית'];
  const icons = ['⚙', '📁', '📄', '🏠'];
  const tabW = w / 4;
  return tabs.map((t, i) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.bg}" stroke="${C.cream200}" stroke-width="1 0 0 0"/>
    <text x="${x + tabW * i + tabW / 2}" y="${y + h * 0.42}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${w * 0.035}" fill="${i === 3 ? C.primary500 : C.neutral400}">${icons[i]}</text>
    <text x="${x + tabW * i + tabW / 2}" y="${y + h * 0.75}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${w * 0.023}" font-weight="${i === 3 ? '600' : '400'}" fill="${i === 3 ? C.primary500 : C.neutral400}">${t}</text>
  `).join('');
}

// =====================
// Generate Screenshots
// =====================
async function generateScreenshots() {
  console.log('--- Generating Store Screenshots ---\n');

  const screens = [
    { name: '01-home', fn: screen1Content, title: 'ביקורת בנייה חכמה', subtitle: 'דאשבורד אישי עם כל המידע במקום אחד' },
    { name: '02-reports', fn: screen2Content, title: 'ניהול דוחות', subtitle: 'בדק בית ופרוטוקולי מסירה — הכל מסודר' },
    { name: '03-defects', fn: screen3Content, title: 'תיעוד ליקויים', subtitle: 'צילום, סיווג וחומרה — ישירות מהשטח' },
    { name: '04-checklist', fn: screen4Content, title: 'צ׳קליסט מסירה', subtitle: 'מעקב שיטתי חדר אחר חדר' },
    { name: '05-pdf', fn: screen5Content, title: 'דוח PDF מקצועי', subtitle: 'מסמך משפטי עם חתימה דיגיטלית' },
  ];

  for (const { name, fn, title, subtitle } of screens) {
    const svg = phoneSvg(fn, { w: STORE_W, h: STORE_H, title, subtitle });
    await sharp(Buffer.from(svg)).resize(STORE_W, STORE_H).png().toFile(join(outScreenshots, `${name}.png`));
    console.log(`✓ ${name}.png (${STORE_W}×${STORE_H})`);
  }
}

// =====================
// Generate Video Frames
// =====================
async function generateVideoFrames() {
  console.log('\n--- Generating Video Frames ---\n');

  // Clean frames dir
  if (existsSync(framesDir)) {
    for (const f of readdirSync(framesDir)) unlinkSync(join(framesDir, f));
  }

  const screens = [
    { fn: screen1Content, title: 'ביקורת בנייה חכמה', subtitle: 'דאשבורד אישי' },
    { fn: screen2Content, title: 'ניהול דוחות', subtitle: 'בדק בית ופרוטוקולי מסירה' },
    { fn: screen3Content, title: 'תיעוד ליקויים', subtitle: 'צילום וסיווג מהשטח' },
    { fn: screen4Content, title: 'צ׳קליסט מסירה', subtitle: 'מעקב חדר אחר חדר' },
    { fn: screen5Content, title: 'דוח PDF מקצועי', subtitle: 'חתימה דיגיטלית ושיתוף' },
  ];

  // Intro frame (logo only)
  const introSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${REEL_W}" height="${REEL_H}" viewBox="0 0 ${REEL_W} ${REEL_H}">
    <defs><linearGradient id="introBg" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stop-color="${C.primary700}"/><stop offset="100%" stop-color="#0A3D22"/></linearGradient></defs>
    <rect width="${REEL_W}" height="${REEL_H}" fill="url(#introBg)"/>
    <rect x="${REEL_W / 2 - 50}" y="${REEL_H / 2 - 80}" width="100" height="100" rx="24" fill="${C.primary500}"/>
    <text x="${REEL_W / 2}" y="${REEL_H / 2 - 18}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="44" font-weight="700" fill="${C.white}">iF</text>
    <text x="${REEL_W / 2}" y="${REEL_H / 2 + 60}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="42" font-weight="700" fill="${C.white}">inField</text>
    <text x="${REEL_W / 2}" y="${REEL_H / 2 + 105}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" fill="${C.primary400}">ביקורת בנייה חכמה</text>
  </svg>`;

  // Outro frame (CTA)
  const outroSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${REEL_W}" height="${REEL_H}" viewBox="0 0 ${REEL_W} ${REEL_H}">
    <defs><linearGradient id="outroBg" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stop-color="${C.primary700}"/><stop offset="100%" stop-color="#0A3D22"/></linearGradient></defs>
    <rect width="${REEL_W}" height="${REEL_H}" fill="url(#outroBg)"/>
    <rect x="${REEL_W / 2 - 40}" y="${REEL_H * 0.30}" width="80" height="80" rx="20" fill="${C.primary500}"/>
    <text x="${REEL_W / 2}" y="${REEL_H * 0.30 + 53}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="36" font-weight="700" fill="${C.white}">iF</text>
    <text x="${REEL_W / 2}" y="${REEL_H * 0.48}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="38" font-weight="700" fill="${C.white}">הורידו עכשיו</text>
    <text x="${REEL_W / 2}" y="${REEL_H * 0.53}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" fill="${C.primary400}">חינם — עד 3 דוחות</text>
    <rect x="${REEL_W / 2 - 120}" y="${REEL_H * 0.58}" width="240" height="48" rx="24" fill="${C.white}"/>
    <text x="${REEL_W / 2}" y="${REEL_H * 0.58 + 32}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="${C.primary700}">App Store &amp; Google Play</text>
    <text x="${REEL_W / 2}" y="${REEL_H * 0.72}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" fill="${C.neutral400}">infield.app</text>
  </svg>`;

  const fps = 30;
  const introDuration = 2;    // 2 seconds
  const screenDuration = 2.5; // 2.5 seconds each screen
  const outroDuration = 2;    // 2 seconds
  let frameIdx = 0;

  // Intro frames
  const introBuffer = Buffer.from(introSvg);
  for (let i = 0; i < fps * introDuration; i++) {
    await sharp(introBuffer).resize(REEL_W, REEL_H).png().toFile(join(framesDir, `frame_${String(frameIdx++).padStart(5, '0')}.png`));
  }
  console.log(`✓ Intro frames (${introDuration}s)`);

  // Screen frames
  for (const { fn, title, subtitle } of screens) {
    const svg = phoneSvg(fn, { w: REEL_W, h: REEL_H, title, subtitle });
    const buffer = Buffer.from(svg);
    for (let i = 0; i < fps * screenDuration; i++) {
      await sharp(buffer).resize(REEL_W, REEL_H).png().toFile(join(framesDir, `frame_${String(frameIdx++).padStart(5, '0')}.png`));
    }
    console.log(`✓ ${title} frames (${screenDuration}s)`);
  }

  // Outro frames
  const outroBuffer = Buffer.from(outroSvg);
  for (let i = 0; i < fps * outroDuration; i++) {
    await sharp(outroBuffer).resize(REEL_W, REEL_H).png().toFile(join(framesDir, `frame_${String(frameIdx++).padStart(5, '0')}.png`));
  }
  console.log(`✓ Outro frames (${outroDuration}s)`);

  const totalFrames = frameIdx;
  const totalSeconds = totalFrames / fps;
  console.log(`\nTotal: ${totalFrames} frames (${totalSeconds.toFixed(1)}s at ${fps}fps)`);

  return { fps, totalSeconds };
}

// =====================
// Assemble Videos
// =====================
function assembleVideos(fps) {
  console.log('\n--- Assembling Videos ---\n');

  const inputPattern = join(framesDir, 'frame_%05d.png');

  // 1. Promo video (1080x1920 — Reels/TikTok/Stories)
  const reelOut = join(outVideos, 'infield-reel-1080x1920.mp4');
  execSync(`${ffmpeg} -y -framerate ${fps} -i "${inputPattern}" -c:v libx264 -pix_fmt yuv420p -preset medium -crf 23 -movflags +faststart "${reelOut}" 2>&1`);
  console.log(`✓ ${reelOut}`);

  // 2. Facebook feed (1080x1080 square — center crop)
  const fbOut = join(outVideos, 'infield-facebook-1080x1080.mp4');
  execSync(`${ffmpeg} -y -framerate ${fps} -i "${inputPattern}" -vf "crop=1080:1080:0:420" -c:v libx264 -pix_fmt yuv420p -preset medium -crf 23 -movflags +faststart "${fbOut}" 2>/dev/null`);
  console.log(`✓ ${fbOut}`);

  // 3. App store preview (wider format 1080x1920 — same as reel)
  const storeOut = join(outVideos, 'infield-store-preview.mp4');
  execSync(`${ffmpeg} -y -framerate ${fps} -i "${inputPattern}" -c:v libx264 -pix_fmt yuv420p -preset medium -crf 20 -movflags +faststart "${storeOut}" 2>/dev/null`);
  console.log(`✓ ${storeOut}`);
}

// =====================
// Main
// =====================
async function main() {
  console.log('=== inField Marketing Asset Generator ===\n');

  await generateScreenshots();
  const { fps } = await generateVideoFrames();
  assembleVideos(fps);

  // Cleanup frames
  console.log('\n--- Cleanup ---');
  for (const f of readdirSync(framesDir)) unlinkSync(join(framesDir, f));
  console.log('✓ Temporary frames deleted');

  console.log('\n=== Done! ===');
  console.log(`Screenshots: ${outScreenshots}/`);
  console.log(`Videos: ${outVideos}/`);
}

main().catch(console.error);
