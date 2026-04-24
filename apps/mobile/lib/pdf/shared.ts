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

export function formatDate(isoOrRaw: string): string {
  if (!isoOrRaw) return '';
  const d = new Date(isoOrRaw);
  if (isNaN(d.getTime())) return isoOrRaw;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function baseStyles(): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap');
    @page {
      size: A4;
      margin: 0;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Rubik', 'Heebo', 'Assistant', system-ui, sans-serif;
      direction: rtl;
      color: ${PDF.md};
      font-size: 12px;
      line-height: 1.5;
      background: white;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 15mm 18mm;
      page-break-after: always;
      position: relative;
      overflow: hidden;
    }
    .page:last-child { page-break-after: auto; }
    @media screen {
      body { background: #c8c8c8; padding: 20px 0; }
      .page {
        background: white;
        margin: 20px auto;
        box-shadow: 0 3px 16px rgba(0,0,0,0.2);
        border-radius: 2px;
      }
    }
    @media print {
      body { background: white; }
      .page {
        width: 100%;
        min-height: 297mm;
        margin: 0;
        box-shadow: none;
        border-radius: 0;
      }
    }
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
    return `<img src="${escapeAttr(logoUrl)}" style="width:40px;height:16px;object-fit:contain;border-radius:2px;" />`;
  }
  return '';
}

export function footerHtml(
  pageNum: number,
  title: string,
  date: string,
  logoUrl?: string
): string {
  return `
    <div style="margin-top:auto;padding-top:8px;border-top:1px solid ${PDF.bdr};display:flex;justify-content:space-between;align-items:center;font-size:10px;color:${PDF.vlt};">
      ${logoHtml(logoUrl)}
      <span>\u05E2\u05DE\u05D5\u05D3 ${pageNum}</span>
      <span>${title} \u2014 ${date}</span>
    </div>
  `;
}

export function sectionTitle(text: string): string {
  return `<div style="font-size:13px;font-weight:700;color:${PDF.dk};padding:4px 0 2px;border-bottom:1px solid ${PDF.bdr};margin-top:8px;margin-bottom:4px;">${text}</div>`;
}

export function subSectionTitle(text: string): string {
  return `<div style="font-size:13px;font-weight:700;color:${PDF.accent};padding:4px 8px 3px;margin:6px 0 5px;background:${PDF.accentLt};border-right:3px solid ${PDF.accent};border-radius:0 2px 2px 0;">${text}</div>`;
}

export function miniHeader(text: string, logoUrl?: string): string {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
      <div style="font-size:10px;font-weight:600;color:${PDF.dk};">${text}</div>
      ${logoHtml(logoUrl)}
    </div>
  `;
}

export function detailRow(label: string, value: string): string {
  return `<div style="display:flex;gap:4px;"><span style="color:${PDF.lt};font-weight:500;">${label}</span><span style="font-weight:500;color:${PDF.dk};">${value}</span></div>`;
}

export function detailBox(rows: string): string {
  return `<div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:10px;line-height:1.8;">${rows}</div>`;
}

/**
 * Render a photo thumbnail for PDF.
 * If the photo has annotations, the caller should pass the composited image URL
 * (from renderAnnotationsToImage) instead of the original URL.
 */
export function photoHtml(url?: string): string {
  if (url) {
    return `<img src="${escapeAttr(url)}" style="width:56px;height:42px;border-radius:2px;object-fit:cover;border:1px solid ${PDF.bdrLt};" />`;
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
    ? `<img src="${escapeAttr(imageUrl)}" style="max-height:36px;max-width:100%;object-fit:contain;" />`
    : `<span style="font-size:9px;color:${PDF.vlt};font-style:italic;">\u05D7\u05EA\u05D9\u05DE\u05D4</span>`;

  return `
    <div style="flex:1;text-align:center;">
      <div style="font-size:10px;color:${PDF.lt};margin-bottom:3px;">${label}</div>
      <div style="height:42px;border:1px solid ${PDF.bdr};border-radius:2px;display:flex;align-items:center;justify-content:center;">${sigContent}</div>
      <div style="font-size:10px;color:${PDF.dk};margin-top:3px;font-weight:600;">${name}</div>
      <div style="font-size:9px;color:${PDF.lt};">\u05EA\u05D0\u05E8\u05D9\u05DA: ${date}</div>
    </div>
  `;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Escape a string for safe interpolation inside an HTML attribute value.
 * Prevents XSS via crafted URLs (e.g. logo_url, photo URLs, signature URLs).
 */
export function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function formatCurrency(amount: number): string {
  return `\u20AA${amount.toLocaleString('he-IL')}`;
}

export function declarationHtml(text: string): string {
  return `
    <div style="padding:8px 10px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:10px;line-height:1.8;white-space:pre-wrap;">${escapeHtml(text)}</div>
  `;
}

export function photoWithCaptionHtml(url: string, caption?: string): string {
  return `
    <div style="text-align:center;flex-shrink:0;">
      <img src="${escapeAttr(url)}" style="width:56px;height:42px;border-radius:2px;object-fit:cover;border:1px solid ${PDF.bdrLt};" />
      ${caption ? `<div style="font-size:8px;color:${PDF.lt};margin-top:1px;max-width:56px;line-height:1.3;word-break:break-word;">${escapeHtml(caption)}</div>` : ''}
    </div>
  `;
}

export function annexPageHtml(
  defects: PdfDefect[],
  pageNum: number,
  title: string,
  date: string,
  logoUrl?: string
): string {
  const photosWithDefects: {
    url: string;
    caption?: string;
    defectNum: string;
    defectTitle: string;
  }[] = [];

  for (const d of defects) {
    const photos =
      d.photos ??
      d.photoUrls?.map((url) => ({ url, caption: undefined })) ??
      [];
    for (const photo of photos) {
      photosWithDefects.push({
        url: photo.url,
        caption: photo.caption,
        defectNum: d.number,
        defectTitle: d.title,
      });
    }
  }

  if (photosWithDefects.length === 0) return '';

  let pages = '';
  const photosPerPage = 6;

  for (let i = 0; i < photosWithDefects.length; i += photosPerPage) {
    const batch = photosWithDefects.slice(i, i + photosPerPage);
    const pageIdx = pageNum + Math.floor(i / photosPerPage);

    pages += `
      <div class="page" style="display:flex;flex-direction:column;">
        ${miniHeader(`${title} \u2014 \u05E0\u05E1\u05E4\u05D7 \u05EA\u05DE\u05D5\u05E0\u05D5\u05EA`, logoUrl)}
        ${sectionTitle(`\u05E0\u05E1\u05E4\u05D7 \u05EA\u05DE\u05D5\u05E0\u05D5\u05EA${i > 0 ? ` (\u05D4\u05DE\u05E9\u05DA)` : ''}`)}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px;">
          ${batch
            .map(
              (p) => `
            <div style="border:1px solid ${PDF.bdrLt};border-radius:3px;overflow:hidden;">
              <img src="${escapeAttr(p.url)}" style="width:100%;height:160px;object-fit:cover;" />
              <div style="padding:4px 6px;background:${PDF.bg};">
                <div style="font-size:9px;font-weight:600;color:${PDF.dk};">\u05DE\u05DE\u05E6\u05D0 ${p.defectNum}: ${escapeHtml(p.defectTitle)}</div>
                ${p.caption ? `<div style="font-size:8px;color:${PDF.lt};margin-top:1px;">${escapeHtml(p.caption)}</div>` : ''}
              </div>
            </div>
          `
            )
            .join('')}
        </div>
        ${footerHtml(pageIdx, title, date, logoUrl)}
      </div>`;
  }

  return pages;
}

// --- Severity color system (from mockup v3 lines 11-16) ---

export const SEV_COLORS = {
  critical: {
    bg: '#FDECEC',
    fg: '#B42318',
    bdr: '#F4C1C1',
    label: '\u05E7\u05E8\u05D9\u05D8\u05D9',
  },
  high: {
    bg: '#FFF4E5',
    fg: '#B54708',
    bdr: '#F5D0A9',
    label: '\u05D2\u05D1\u05D5\u05D4',
  },
  medium: {
    bg: '#FEF7E0',
    fg: '#8A6D1C',
    bdr: '#EEE0B0',
    label: '\u05D1\u05D9\u05E0\u05D5\u05E0\u05D9',
  },
  low: {
    bg: '#ECF6EF',
    fg: '#2B6B3F',
    bdr: '#CDE5D4',
    label: '\u05E0\u05DE\u05D5\u05DA',
  },
} as const;

export type SeverityLevel = keyof typeof SEV_COLORS;

export function sevBadgeHtml(level: string): string {
  const c = SEV_COLORS[level as SeverityLevel] ?? SEV_COLORS.medium;
  return `<span style="font-size:8px;font-weight:700;color:${c.fg};background:${c.bg};border:1px solid ${c.bdr};padding:2px 6px;border-radius:8px;">${c.label}</span>`;
}

export function breadcrumbHeaderHtml(crumb: string, logoUrl?: string): string {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:6px;margin-bottom:8px;border-bottom:1px solid ${PDF.bdrLt};">
      <div style="font-size:10px;color:${PDF.lt};display:flex;gap:3px;align-items:center;">
        <span style="color:${PDF.accent};font-weight:600;">\u05D3\u05D5\u05D7 \u05D1\u05D3\u05E7 \u05D1\u05D9\u05EA</span>
        <span style="color:${PDF.vlt};">\u203A</span>
        <span>${crumb}</span>
      </div>
      ${logoHtml(logoUrl)}
    </div>
  `;
}

// --- Photo helpers (v3 — upgraded to 100×75px) ---

export function photoHtmlV3(url?: string, _hasAnnotation?: boolean): string {
  if (url) {
    return `<div style="position:relative;width:100px;height:75px;border-radius:2px;overflow:hidden;border:1px solid ${PDF.bdrLt};flex-shrink:0;">
      <img src="${escapeAttr(url)}" style="width:100%;height:100%;object-fit:cover;" />
    </div>`;
  }
  return `<div style="position:relative;width:100px;height:75px;border-radius:2px;background:${PDF.bdrLt};display:flex;align-items:center;justify-content:center;border:1px solid ${PDF.bdrLt};overflow:hidden;flex-shrink:0;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${PDF.bdr}" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
  </div>`;
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
