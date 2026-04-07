// --- Protocol Mesira PDF Template ---
// Generates HTML string for expo-print

import type { PdfReportData, PdfChecklistItem } from './types';
import {
  PDF,
  baseStyles,
  watermarkStyle,
  logoHtml,
  footerHtml,
  sectionTitle,
  subSectionTitle,
  detailRow,
  escapeHtml,
  photoHtml,
  signatureBoxHtml,
  groupDefectsByCategory,
} from './shared';

// --- Checklist item row ---

function checklistItemHtml(item: PdfChecklistItem): string {
  const sym =
    item.status === 'ok'
      ? '\u2713'
      : item.status === 'partial'
        ? '~'
        : '\u2717';
  const color =
    item.status === 'ok'
      ? PDF.accent
      : item.status === 'partial'
        ? PDF.amber
        : PDF.red;
  const bg =
    item.status === 'ok'
      ? '#ecfdf5'
      : item.status === 'partial'
        ? '#fefaed'
        : '#fef2f2';

  return `
    <div style="display:flex;align-items:center;gap:4px;padding:1.5px 0;font-size:7.5px;color:${PDF.md};line-height:1.3;">
      <span style="color:${color};font-weight:700;font-size:9px;width:14px;height:14px;border-radius:2px;background:${bg};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">${sym}</span>
      <span style="flex:1;">${escapeHtml(item.text)}</span>
      ${item.status !== 'ok' && item.refNumber ? `<span style="color:${PDF.red};font-size:6.5px;flex-shrink:0;">\u05E8\u05D0\u05D4 \u05E1\u05E2\u05D9\u05E3 #${item.refNumber}</span>` : ''}
    </div>`;
}

// --- Defect row (simpler than bedek bayit) ---

function defectRowHtml(
  num: number,
  text: string,
  location: string,
  photoUrls?: string[]
): string {
  const photos = photoUrls ?? [];
  let html = `
    <div style="padding:4px 0 5px;border-bottom:0.5px solid ${PDF.bdrLt};">
      <div style="display:flex;align-items:flex-start;gap:6px;">
        <div style="font-size:8px;font-weight:600;color:${PDF.md};width:16px;text-align:center;flex-shrink:0;margin-top:1px;">${num}.</div>
        <div style="flex:1;">
          <div style="font-size:8.5px;font-weight:500;color:${PDF.dk};line-height:1.4;">${escapeHtml(text)}</div>
          <div style="font-size:7px;color:${PDF.lt};margin-top:1px;">${escapeHtml(location)}</div>
        </div>
      </div>`;

  if (photos.length > 0) {
    html += `<div style="display:flex;gap:3px;margin-top:4px;margin-right:22px;padding-top:4px;border-top:0.5px solid ${PDF.bdrLt};">`;
    for (const url of photos.slice(0, 4)) {
      html += photoHtml(url);
    }
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}

// --- Main export ---

export function generateProtocolHtml(data: PdfReportData): string {
  const isDraft = data.status === 'draft' || data.status === 'in_progress';
  const title =
    '\u05E4\u05E8\u05D5\u05D8\u05D5\u05E7\u05D5\u05DC \u05DE\u05E1\u05D9\u05E8\u05D4';
  const groups = groupDefectsByCategory(data.defects);

  // Checklist stats
  const clItems = data.checklistItems ?? [];
  const clTotal = clItems.length;
  const clOk = clItems.filter((i) => i.status === 'ok').length;
  const clDefect = clItems.filter((i) => i.status === 'defect').length;
  const clPartial = clItems.filter((i) => i.status === 'partial').length;

  // Group checklist by category
  const clCategories = new Map<string, PdfChecklistItem[]>();
  for (const item of clItems) {
    const cat = item.category;
    if (!clCategories.has(cat)) clCategories.set(cat, []);
    clCategories.get(cat)!.push(item);
  }

  // --- PAGE 1 ---
  let page1Defects = '';
  const page1Max = 2;
  const _page1Group = data.defects.slice(0, page1Max);
  let defectIdx = 0;

  // Build checklist grid (2 columns)
  const catEntries = Array.from(clCategories.entries());
  const midpoint = Math.ceil(catEntries.length / 2);
  const col1 = catEntries.slice(0, midpoint);
  const col2 = catEntries.slice(midpoint);

  function _colHtml(entries: [string, PdfChecklistItem[]][]): string {
    let html = '';
    for (const [cat, items] of entries) {
      html += `<div style="font-size:7px;font-weight:700;color:${PDF.dk};border-bottom:0.5px solid ${PDF.bdr};padding-bottom:2px;margin-bottom:2px;${entries.indexOf([cat, items]) > 0 ? 'margin-top:4px;' : ''}">${escapeHtml(cat)}</div>`;
      for (const item of items) {
        html += checklistItemHtml(item);
      }
    }
    return html;
  }

  // Build first page defects
  for (const group of groups) {
    let groupHasItems = false;
    for (const defect of group.defects) {
      if (defectIdx >= page1Max) break;
      if (!groupHasItems) {
        page1Defects += subSectionTitle(escapeHtml(group.category));
        groupHasItems = true;
      }
      page1Defects += defectRowHtml(
        defect.number,
        defect.title,
        defect.location,
        defect.photoUrls
      );
      defectIdx++;
    }
    if (defectIdx >= page1Max) break;
  }

  const page1 = `
    <div class="page" style="display:flex;flex-direction:column;">
      <!-- Header -->
      <div style="border-bottom:2px solid ${PDF.dk};padding-bottom:6px;display:flex;justify-content:space-between;align-items:flex-end;">
        <div>
          <div style="font-size:13px;font-weight:700;color:${PDF.dk};letter-spacing:-0.3px;">${title}</div>
          <div style="font-size:7.5px;color:${PDF.lt};margin-top:2px;font-weight:400;">\u05DE\u05E1\u05D9\u05E8\u05D4 \u05E8\u05D0\u05E9\u05D5\u05E0\u05D9\u05EA | \u05EA\u05D0\u05E8\u05D9\u05DA: ${escapeHtml(data.reportDate)} | \u05DE\u05E1\u05E4\u05E8 \u05D3\u05D5\u05D7: ${escapeHtml(data.reportNumber)}</div>
        </div>
        ${logoHtml(data.logoUrl)}
      </div>

      <!-- Details -->
      <div style="margin-top:4px;padding:4px 8px;border:1px solid ${PDF.bdr};border-radius:2px;font-size:7.5px;display:flex;flex-wrap:wrap;gap:2px 14px;background:${PDF.bg};">
        ${detailRow('\u05E4\u05E8\u05D5\u05D9\u05E7\u05D8:', escapeHtml(data.property.projectName))}
        ${detailRow('\u05D3\u05D9\u05E8\u05D4:', `\u05D3\u05D9\u05E8\u05D4 ${escapeHtml(data.property.apartmentNumber)}${data.property.floor !== null && data.property.floor !== undefined ? `, \u05E7\u05D5\u05DE\u05D4 ${data.property.floor}` : ''}`)}
        ${detailRow('\u05D3\u05D9\u05D9\u05E8:', `${escapeHtml(data.client.name)}${data.client.idNumber ? ` | \u05EA.\u05D6. ${escapeHtml(data.client.idNumber)}` : ''}`)}
        ${detailRow('\u05DE\u05E4\u05E7\u05D7:', escapeHtml(data.inspector.name))}
      </div>

      <!-- Checklist -->
      ${sectionTitle('\u05E6\u05F3\u05E7\u05DC\u05D9\u05E1\u05D8 \u05DE\u05E1\u05D9\u05E8\u05D4')}
      <div style="border:1px solid ${PDF.bdr};border-radius:2px;padding:6px 8px;background:${PDF.bg};">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 20px;">
          <div>${col1
            .map(([cat, items]) => {
              let s = `<div style="font-size:7px;font-weight:700;color:${PDF.dk};border-bottom:0.5px solid ${PDF.bdr};padding-bottom:2px;margin-bottom:2px;">${escapeHtml(cat)}</div>`;
              for (const item of items) s += checklistItemHtml(item);
              return s;
            })
            .join('')}</div>
          <div>${col2
            .map(([cat, items]) => {
              let s = `<div style="font-size:7px;font-weight:700;color:${PDF.dk};border-bottom:0.5px solid ${PDF.bdr};padding-bottom:2px;margin-bottom:2px;">${escapeHtml(cat)}</div>`;
              for (const item of items) s += checklistItemHtml(item);
              return s;
            })
            .join('')}</div>
        </div>
        <!-- Legend -->
        <div style="margin-top:4px;padding-top:3px;border-top:0.5px solid ${PDF.bdr};display:flex;justify-content:space-between;align-items:center;font-size:6.5px;color:${PDF.lt};">
          <div style="display:flex;gap:8px;">
            <span><span style="color:${PDF.accent};font-weight:700;">\u2713</span> \u05EA\u05E7\u05D9\u05DF</span>
            <span><span style="color:${PDF.red};font-weight:700;">\u2717</span> \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF</span>
            <span><span style="color:${PDF.amber};font-weight:700;">~</span> \u05EA\u05E7\u05D9\u05DF \u05D7\u05DC\u05E7\u05D9\u05EA</span>
          </div>
          <span style="font-weight:600;color:${PDF.md};">${clTotal} \u05E4\u05E8\u05D9\u05D8\u05D9\u05DD | ${clOk} \u05EA\u05E7\u05D9\u05DF | ${clDefect} \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF | ${clPartial} \u05D7\u05DC\u05E7\u05D9</span>
        </div>
      </div>

      <!-- Defects start -->
      ${sectionTitle('\u05DE\u05DE\u05E6\u05D0\u05D9\u05DD')}
      ${page1Defects}

      ${footerHtml(1, title, data.reportDate, data.logoUrl)}
    </div>`;

  // --- CONTINUATION PAGES (defects) ---
  const remainingDefects = data.defects.slice(page1Max);
  const continuationPages: string[] = [];
  let pageNum = 2;

  if (remainingDefects.length > 0) {
    const remainingGroups = groupDefectsByCategory(remainingDefects);
    let currentPageContent = '';
    let defectsOnPage = 0;
    const maxPerPage = 5;

    for (const group of remainingGroups) {
      currentPageContent += subSectionTitle(escapeHtml(group.category));
      for (const defect of group.defects) {
        currentPageContent += defectRowHtml(
          defect.number,
          defect.title,
          defect.location,
          defect.photoUrls
        );
        defectsOnPage++;

        if (defectsOnPage >= maxPerPage) {
          continuationPages.push(`
            <div class="page" style="display:flex;flex-direction:column;">
              <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:4px;border-bottom:1px solid ${PDF.bdr};margin-bottom:4px;">
                <div style="font-size:9px;font-weight:600;color:${PDF.dk};">${title} | ${escapeHtml(data.property.projectName)} | \u05D3\u05D9\u05E8\u05D4 ${escapeHtml(data.property.apartmentNumber)}</div>
                ${logoHtml(data.logoUrl)}
              </div>
              ${sectionTitle('\u05DE\u05DE\u05E6\u05D0\u05D9\u05DD (\u05D4\u05DE\u05E9\u05DA)')}
              ${currentPageContent}
              ${footerHtml(pageNum, title, data.reportDate, data.logoUrl)}
            </div>`);
          currentPageContent = '';
          defectsOnPage = 0;
          pageNum++;
        }
      }
    }

    if (defectsOnPage > 0) {
      continuationPages.push(`
        <div class="page" style="display:flex;flex-direction:column;">
          <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:4px;border-bottom:1px solid ${PDF.bdr};margin-bottom:4px;">
            <div style="font-size:9px;font-weight:600;color:${PDF.dk};">${title} | ${escapeHtml(data.property.projectName)} | \u05D3\u05D9\u05E8\u05D4 ${escapeHtml(data.property.apartmentNumber)}</div>
            ${logoHtml(data.logoUrl)}
          </div>
          ${sectionTitle('\u05DE\u05DE\u05E6\u05D0\u05D9\u05DD (\u05D4\u05DE\u05E9\u05DA)')}
          ${currentPageContent}
          ${footerHtml(pageNum, title, data.reportDate, data.logoUrl)}
        </div>`);
      pageNum++;
    }
  }

  // --- LAST PAGE: Summary + Signatures ---
  const lastPage = `
    <div class="page" style="display:flex;flex-direction:column;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:4px;border-bottom:1px solid ${PDF.bdr};margin-bottom:4px;">
        <div style="font-size:9px;font-weight:600;color:${PDF.dk};">${title} | ${escapeHtml(data.property.projectName)} | \u05D3\u05D9\u05E8\u05D4 ${escapeHtml(data.property.apartmentNumber)}</div>
        ${logoHtml(data.logoUrl)}
      </div>

      ${sectionTitle('\u05E1\u05D9\u05DB\u05D5\u05DD')}
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:5px;margin:3px 0 6px;">
        <div style="text-align:center;padding:5px 3px;background:${PDF.bg};border-radius:3px;border:1px solid ${PDF.bdrLt};">
          <div style="font-size:14px;font-weight:700;color:${PDF.dk};">${clTotal}</div>
          <div style="font-size:6.5px;color:${PDF.lt};margin-top:1px;">\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD</div>
        </div>
        <div style="text-align:center;padding:5px 3px;background:#ecfdf5;border-radius:3px;border:1px solid ${PDF.bdrLt};">
          <div style="font-size:14px;font-weight:700;color:${PDF.dk};">${clOk}</div>
          <div style="font-size:6.5px;color:${PDF.lt};margin-top:1px;">\u05EA\u05E7\u05D9\u05DF</div>
        </div>
        <div style="text-align:center;padding:5px 3px;background:#fef2f2;border-radius:3px;border:1px solid ${PDF.bdrLt};">
          <div style="font-size:14px;font-weight:700;color:${PDF.dk};">${clDefect}</div>
          <div style="font-size:6.5px;color:${PDF.lt};margin-top:1px;">\u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF</div>
        </div>
        <div style="text-align:center;padding:5px 3px;background:#fefaed;border-radius:3px;border:1px solid ${PDF.bdrLt};">
          <div style="font-size:14px;font-weight:700;color:${PDF.dk};">${clPartial}</div>
          <div style="font-size:6.5px;color:${PDF.lt};margin-top:1px;">\u05D7\u05DC\u05E7\u05D9</div>
        </div>
      </div>

      ${
        data.keyDelivery && data.keyDelivery.length > 0
          ? `
        ${sectionTitle('\u05E7\u05D1\u05DC\u05EA \u05DE\u05E4\u05EA\u05D7\u05D5\u05EA')}
        <div style="padding:4px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:8px;">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px 10px;">
            ${data.keyDelivery.map((k) => `<div style="display:flex;gap:3px;"><span style="color:${PDF.lt};">${escapeHtml(k.label)}:</span><span style="color:${PDF.dk};font-weight:600;">${escapeHtml(k.value)}</span></div>`).join('')}
          </div>
        </div>
      `
          : ''
      }

      ${
        data.tenantNotes
          ? `
        ${sectionTitle('\u05D4\u05E2\u05E8\u05D5\u05EA \u05D4\u05D3\u05D9\u05D9\u05E8')}
        <div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};min-height:24px;font-size:8px;color:${PDF.md};line-height:1.5;">${escapeHtml(data.tenantNotes)}</div>
      `
          : ''
      }

      ${sectionTitle('\u05EA\u05E0\u05D0\u05D9\u05DD \u05D5\u05D0\u05D7\u05E8\u05D9\u05D5\u05EA')}
      <div style="font-size:6.5px;color:${PDF.lt};line-height:1.5;padding:2px 0;">
        \u05E4\u05E8\u05D5\u05D8\u05D5\u05E7\u05D5\u05DC \u05D6\u05D4 \u05E0\u05E2\u05E8\u05DA \u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05D7\u05D5\u05E7 \u05D4\u05DE\u05DB\u05E8 (\u05D3\u05D9\u05E8\u05D5\u05EA), \u05EA\u05E9\u05DC\u0022\u05D2-1973. \u05EA\u05E7\u05D5\u05E4\u05EA \u05D4\u05D1\u05D3\u05E7 \u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05E1\u05D5\u05D2 \u05D4\u05DC\u05D9\u05E7\u05D5\u05D9 (\u05D1\u05D9\u05DF \u05E9\u05E0\u05D4 \u05DC-7 \u05E9\u05E0\u05D9\u05DD). \u05EA\u05E7\u05D5\u05E4\u05EA \u05D0\u05D7\u05E8\u05D9\u05D5\u05EA 3 \u05E9\u05E0\u05D9\u05DD \u05DE\u05EA\u05D5\u05DD \u05EA\u05E7\u05D5\u05E4\u05EA \u05D4\u05D1\u05D3\u05E7. \u05D4\u05D3\u05D9\u05D9\u05E8 \u05DE\u05EA\u05D1\u05E7\u05E9 \u05DC\u05E9\u05DE\u05D5\u05E8 \u05DE\u05E1\u05DE\u05DA \u05D6\u05D4 \u05DB\u05D0\u05E1\u05DE\u05DB\u05EA\u05D0.
      </div>

      ${sectionTitle('\u05D7\u05EA\u05D9\u05DE\u05D5\u05EA')}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:3px;">
        ${signatureBoxHtml(
          '\u05DE\u05E4\u05E7\u05D7',
          escapeHtml(data.inspector.name),
          escapeHtml(data.reportDate),
          data.signatures?.find((s) => s.signerType === 'inspector')?.imageUrl
        )}
        ${signatureBoxHtml(
          '\u05D3\u05D9\u05D9\u05E8',
          escapeHtml(data.client.name),
          escapeHtml(data.reportDate),
          data.signatures?.find((s) => s.signerType === 'tenant')?.imageUrl
        )}
      </div>

      ${
        data.stampUrl
          ? `
        <div style="margin-top:10px;text-align:center;">
          <div style="display:inline-block;padding:5px 18px;border:1px solid ${PDF.bdr};border-radius:3px;">
            <img src="${data.stampUrl}" style="max-height:24px;object-fit:contain;" />
          </div>
        </div>
      `
          : ''
      }

      ${footerHtml(pageNum, title, data.reportDate, data.logoUrl)}
    </div>`;

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${baseStyles()}${watermarkStyle(isDraft)}</style>
</head>
<body>
  ${isDraft ? '<div class="watermark">\u05D8\u05D9\u05D5\u05D8\u05D4</div>' : ''}
  ${page1}
  ${continuationPages.join('')}
  ${lastPage}
</body>
</html>`;
}
