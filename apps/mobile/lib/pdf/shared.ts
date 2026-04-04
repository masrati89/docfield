// --- Shared PDF Utilities & Styles ---

// Design system colors aligned with @infield/ui
export const PDF = {
  dk: '#1a1a1a',
  md: '#444444',
  lt: '#777777',
  vlt: '#aaaaaa',
  bg: '#FEFDFB',
  bdr: '#D1CEC8',
  bdrLt: '#F5EFE6',
  accent: '#1B7A44',
  accentLt: '#F0F7F4',
  accentMd: '#D1E7DD',
  red: '#b91c1c',
  amber: '#92600a',
} as const;

export function baseStyles(): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Rubik', 'Heebo', 'Assistant', system-ui, sans-serif;
      direction: rtl;
      color: ${PDF.md};
      font-size: 9px;
      line-height: 1.5;
      background: white;
    }
    .page {
      width: 100%;
      min-height: 100vh;
      padding: 20px 24px;
      page-break-after: always;
      position: relative;
    }
    .page:last-child { page-break-after: auto; }
  `;
}

export function watermarkStyle(isDraft: boolean): string {
  if (!isDraft) return '';
  return `
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      font-size: 80px;
      font-weight: 700;
      color: rgba(27, 122, 68, 0.06);
      letter-spacing: 12px;
      pointer-events: none;
      z-index: 0;
      white-space: nowrap;
    }
  `;
}

export function logoHtml(logoUrl?: string): string {
  if (logoUrl) {
    return `<img src="${logoUrl}" style="width:40px;height:16px;object-fit:contain;border-radius:2px;" />`;
  }
  return `<div style="width:40px;height:16px;border:1px solid ${PDF.bdrLt};border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:6px;color:${PDF.vlt};">LOGO</div>`;
}

export function footerHtml(
  pageNum: number,
  title: string,
  date: string,
  logoUrl?: string
): string {
  return `
    <div style="margin-top:auto;padding-top:6px;border-top:1px solid ${PDF.bdr};display:flex;justify-content:space-between;align-items:center;font-size:7px;color:${PDF.vlt};">
      ${logoHtml(logoUrl)}
      <span>\u05E2\u05DE\u05D5\u05D3 ${pageNum}</span>
      <span>${title} \u2014 ${date}</span>
    </div>
  `;
}

export function sectionTitle(text: string): string {
  return `<div style="font-size:10px;font-weight:700;color:${PDF.dk};padding:4px 0 2px;border-bottom:1px solid ${PDF.bdr};margin-top:8px;margin-bottom:4px;">${text}</div>`;
}

export function subSectionTitle(text: string): string {
  return `<div style="font-size:10px;font-weight:700;color:${PDF.accent};padding:4px 8px 3px;margin:6px 0 3px;background:${PDF.accentLt};border-right:3px solid ${PDF.accent};border-radius:0 2px 2px 0;">${text}</div>`;
}

export function miniHeader(text: string, logoUrl?: string): string {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
      <div style="font-size:8px;font-weight:600;color:${PDF.dk};">${text}</div>
      ${logoHtml(logoUrl)}
    </div>
  `;
}

export function detailRow(label: string, value: string): string {
  return `<div style="display:flex;gap:4px;"><span style="color:${PDF.lt};font-weight:500;">${label}</span><span style="font-weight:500;color:${PDF.dk};">${value}</span></div>`;
}

export function detailBox(rows: string): string {
  return `<div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:8px;line-height:1.8;">${rows}</div>`;
}

export function photoHtml(url?: string): string {
  if (url) {
    return `<img src="${url}" style="width:56px;height:42px;border-radius:2px;object-fit:cover;border:1px solid ${PDF.bdrLt};" />`;
  }
  return `<div style="width:56px;height:42px;border-radius:2px;background:${PDF.bdrLt};display:flex;align-items:center;justify-content:center;border:1px solid ${PDF.bdrLt};flex-shrink:0;">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${PDF.bdr}" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
  </div>`;
}

export function signatureBoxHtml(
  label: string,
  name: string,
  date: string,
  imageUrl?: string
): string {
  const sigContent = imageUrl
    ? `<img src="${imageUrl}" style="max-height:28px;max-width:100%;object-fit:contain;" />`
    : `<span style="font-size:7px;color:${PDF.vlt};font-style:italic;">\u05D7\u05EA\u05D9\u05DE\u05D4</span>`;

  return `
    <div style="flex:1;text-align:center;">
      <div style="font-size:7.5px;color:${PDF.lt};margin-bottom:3px;">${label}</div>
      <div style="height:34px;border:1px solid ${PDF.bdr};border-radius:2px;display:flex;align-items:center;justify-content:center;">${sigContent}</div>
      <div style="font-size:8px;color:${PDF.dk};margin-top:3px;font-weight:600;">${name}</div>
      <div style="font-size:7px;color:${PDF.lt};">\u05EA\u05D0\u05E8\u05D9\u05DA: ${date}</div>
    </div>
  `;
}

export function formatCurrency(amount: number): string {
  return `\u20AA${amount.toLocaleString('he-IL')}`;
}

import type { PdfDefect, DefectGroup } from './types';

export function groupDefectsByCategory(defects: PdfDefect[]): DefectGroup[] {
  const groups: DefectGroup[] = [];
  const map = new Map<string, PdfDefect[]>();

  for (const d of defects) {
    const cat = d.category || '\u05DB\u05DC\u05DC\u05D9';
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(d);
  }

  for (const [category, items] of map) {
    groups.push({ category, defects: items });
  }

  return groups;
}
