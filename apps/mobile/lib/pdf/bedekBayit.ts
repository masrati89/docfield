// --- Bedek Bayit PDF Template ---
// Generates HTML string for expo-print

import type { PdfReportData } from './types';
import {
  PDF,
  baseStyles,
  watermarkStyle,
  logoHtml,
  footerHtml,
  sectionTitle,
  subSectionTitle,
  miniHeader,
  detailRow,
  detailBox,
  photoHtml,
  signatureBoxHtml,
  escapeHtml,
  formatCurrency,
  groupDefectsByCategory,
} from './shared';

// --- Defect card (full detail for bedek bayit) ---

function defectFullHtml(d: {
  num: number;
  title: string;
  location: string;
  standardRef?: string;
  standardText?: string;
  recommendation?: string;
  cost?: number;
  costLabel?: string;
  note?: string;
  photoUrls?: string[];
  annexText?: string;
}): string {
  const photos = d.photoUrls ?? [];
  const costDisplay = d.costLabel
    ? escapeHtml(d.costLabel)
    : d.cost
      ? formatCurrency(d.cost)
      : '';

  let html = `
    <div style="padding:6px 0;border-bottom:1px solid ${PDF.bdrLt};margin-bottom:2px;">
      <div style="display:flex;align-items:flex-start;gap:6px;">
        <div style="font-size:8px;font-weight:700;color:white;background:${PDF.dk};width:20px;height:20px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${d.num}</div>
        <div style="flex:1;">
          <div style="font-size:9px;font-weight:600;color:${PDF.dk};line-height:1.4;">${escapeHtml(d.title)}</div>
          <div style="font-size:7.5px;color:${PDF.lt};margin-top:1px;">\u05DE\u05D9\u05E7\u05D5\u05DD: ${escapeHtml(d.location)}</div>
        </div>
        ${costDisplay ? `<div style="font-size:8px;font-weight:700;color:${PDF.accent};flex-shrink:0;background:${PDF.accentLt};padding:2px 6px;border-radius:10px;">${costDisplay}</div>` : ''}
      </div>`;

  if (d.standardRef) {
    html += `
      <div style="margin:4px 0 3px;margin-right:26px;padding:3px 6px;background:${PDF.bg};border-right:2px solid ${PDF.accent};font-size:7.5px;color:${PDF.md};line-height:1.5;">
        <span style="font-weight:600;color:${PDF.dk};">${escapeHtml(d.standardRef)}</span>${d.standardText ? ` \u2014 ${escapeHtml(d.standardText)}` : ''}
      </div>`;
  }

  if (d.recommendation) {
    html += `
      <div style="margin:3px 0 0;margin-right:26px;font-size:7.5px;color:${PDF.md};">
        <span style="font-weight:600;color:${PDF.accent};">\u05D4\u05DE\u05DC\u05E6\u05D4: </span>${escapeHtml(d.recommendation)}
      </div>`;
  }

  if (d.note) {
    html += `
      <div style="margin:2px 0 0;margin-right:26px;font-size:7px;color:${PDF.lt};font-style:italic;">
        \u05D4\u05E2\u05E8\u05D4: ${escapeHtml(d.note)}
      </div>`;
  }

  if (photos.length > 0) {
    html += `<div style="display:flex;gap:3px;margin-top:4px;margin-right:26px;flex-wrap:wrap;">`;
    for (const url of photos.slice(0, 6)) {
      html += photoHtml(url);
    }
    html += `</div>`;
  }

  if (d.annexText) {
    html += `
      <div style="margin:4px 0 2px;margin-right:26px;padding:3px 6px;background:${PDF.bg};border-radius:2px;font-size:7px;color:${PDF.lt};display:flex;align-items:center;gap:4px;">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${PDF.lt}" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
        ${escapeHtml(d.annexText)}
      </div>`;
  }

  html += `</div>`;
  return html;
}

// --- Cost table ---

function costTableHtml(
  groups: {
    category: string;
    defects: {
      num: number;
      title: string;
      cost?: number;
      costLabel?: string;
    }[];
  }[],
  vatRate = 0.17
): string {
  let subtotal = 0;
  let rows = '';

  for (const g of groups) {
    rows += `<div style="padding:4px 6px;background:${PDF.accentLt};font-weight:700;font-size:7.5px;color:${PDF.accent};">${escapeHtml(g.category)}</div>`;
    for (const d of g.defects) {
      const cost = d.cost ?? 0;
      subtotal += cost;
      const costStr = d.costLabel
        ? escapeHtml(d.costLabel)
        : cost.toLocaleString('he-IL');
      rows += `
        <div style="display:grid;grid-template-columns:36px 1fr 80px;padding:4px 6px;border-bottom:1px solid ${PDF.bdrLt};font-size:8px;">
          <span style="font-weight:600;">${d.num}</span>
          <span>${escapeHtml(d.title)}</span>
          <span style="text-align:left;font-weight:600;">${costStr}</span>
        </div>`;
    }
  }

  const vat = subtotal * vatRate;
  const total = subtotal + vat;

  return `
    <div style="border:1px solid ${PDF.bdr};border-radius:2px;overflow:hidden;font-size:8px;">
      <div style="display:grid;grid-template-columns:36px 1fr 80px;background:${PDF.dk};color:#fff;padding:4px 6px;font-weight:600;font-size:7.5px;">
        <span>#</span><span>\u05EA\u05D9\u05D0\u05D5\u05E8</span><span style="text-align:left;">\u05E2\u05DC\u05D5\u05EA (\u20AA)</span>
      </div>
      ${rows}
      <div style="display:grid;grid-template-columns:36px 1fr 80px;padding:5px 6px;background:${PDF.bg};font-weight:700;border-top:1px solid ${PDF.bdr};">
        <span></span><span style="color:${PDF.dk};">\u05E1\u05D4\u0022\u05DB \u05DC\u05E4\u05E0\u05D9 \u05DE\u05E2\u0022\u05DE</span><span style="text-align:left;">${subtotal.toLocaleString('he-IL')}</span>
      </div>
      <div style="display:grid;grid-template-columns:36px 1fr 80px;padding:4px 6px;background:${PDF.bg};">
        <span></span><span style="color:${PDF.md};">\u05DE\u05E2\u0022\u05DE (${Math.round(vatRate * 100)}%)</span><span style="text-align:left;">${vat.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div style="display:grid;grid-template-columns:36px 1fr 80px;padding:5px 6px;background:${PDF.dk};color:#fff;font-weight:700;">
        <span></span><span>\u05E1\u05D4\u0022\u05DB \u05DB\u05D5\u05DC\u05DC \u05DE\u05E2\u0022\u05DE</span><span style="text-align:left;">${total.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>`;
}

// --- Main export ---

export function generateBedekBayitHtml(data: PdfReportData): string {
  const isDraft = data.status === 'draft' || data.status === 'in_progress';
  const title = '\u05D3\u05D5\u05D7 \u05D1\u05D3\u05E7 \u05D1\u05D9\u05EA';
  const groups = groupDefectsByCategory(data.defects);
  const totalCost = data.defects.reduce((s, d) => s + (d.cost ?? 0), 0);
  const totalPhotos = data.defects.reduce(
    (s, d) => s + (d.photoUrls?.length ?? 0),
    0
  );

  // --- PAGE 1: Cover ---
  const coverPage = `
    <div class="page" style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
      <div style="align-self:flex-end;margin-bottom:16px;">${logoHtml(data.logoUrl)}</div>
      <div style="width:160px;height:1px;background:${PDF.dk};margin-bottom:24px;"></div>
      <div style="font-size:22px;font-weight:700;color:${PDF.dk};letter-spacing:-0.5px;margin-bottom:6px;">${title}</div>
      <div style="font-size:11px;color:${PDF.lt};margin-bottom:24px;">\u05D1\u05D3\u05D9\u05E7\u05EA \u05E7\u05D1\u05DC\u05D4 \u05DC\u05D3\u05D9\u05E8\u05D4 \u05D7\u05D3\u05E9\u05D4</div>
      <div style="width:160px;height:1px;background:${PDF.bdr};margin-bottom:20px;"></div>
      <div style="font-size:9px;color:${PDF.md};line-height:2;text-align:center;">
        ${detailRow('\u05E4\u05E8\u05D5\u05D9\u05E7\u05D8:', escapeHtml(data.property.projectName))}
        ${detailRow('\u05D3\u05D9\u05E8\u05D4:', `\u05D3\u05D9\u05E8\u05D4 ${escapeHtml(data.property.apartmentNumber)}${data.property.floor !== null && data.property.floor !== undefined ? `, \u05E7\u05D5\u05DE\u05D4 ${data.property.floor}` : ''}`)}
        ${detailRow('\u05DE\u05D6\u05DE\u05D9\u05DF:', escapeHtml(data.client.name))}
        ${detailRow('\u05DE\u05E4\u05E7\u05D7:', escapeHtml(data.inspector.name))}
        ${detailRow('\u05EA\u05D0\u05E8\u05D9\u05DA:', escapeHtml(data.reportDate))}
        ${detailRow('\u05DE\u05E1\u05E4\u05E8 \u05D3\u05D5\u05D7:', escapeHtml(data.reportNumber))}
      </div>
      <div style="width:160px;height:1px;background:${PDF.bdr};margin-top:24px;margin-bottom:12px;"></div>
      <div style="font-size:7px;color:${PDF.vlt};">\u05DE\u05E1\u05DE\u05DA \u05D6\u05D4 \u05D4\u05D5\u05D0 \u05D7\u05D5\u05D5\u05EA \u05D3\u05E2\u05EA \u05D4\u05E0\u05D3\u05E1\u05D9\u05EA \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9\u05EA. \u05DB\u05DC \u05D4\u05D6\u05DB\u05D5\u05D9\u05D5\u05EA \u05E9\u05DE\u05D5\u05E8\u05D5\u05EA.</div>
    </div>`;

  // --- PAGE 2: Details ---
  const detailsPage = `
    <div class="page" style="display:flex;flex-direction:column;">
      ${miniHeader(`${title} \u2014 ${escapeHtml(data.property.projectName)}`, data.logoUrl)}
      ${sectionTitle('\u05E4\u05E8\u05D8\u05D9 \u05D4\u05DE\u05E4\u05E7\u05D7')}
      ${detailBox(`
        ${detailRow('\u05E9\u05DD:', escapeHtml(data.inspector.name))}
        ${data.inspector.licenseNumber ? detailRow('\u05DE.\u05E8.:', escapeHtml(data.inspector.licenseNumber)) : ''}
        ${data.inspector.education ? detailRow('\u05D4\u05E9\u05DB\u05DC\u05D4:', escapeHtml(data.inspector.education)) : ''}
        ${data.inspector.experience ? detailRow('\u05E0\u05D9\u05E1\u05D9\u05D5\u05DF:', escapeHtml(data.inspector.experience)) : ''}
      `)}
      ${sectionTitle('\u05E4\u05E8\u05D8\u05D9 \u05D4\u05E0\u05DB\u05E1')}
      ${detailBox(`
        ${detailRow('\u05E4\u05E8\u05D5\u05D9\u05E7\u05D8:', escapeHtml(data.property.projectName))}
        ${data.property.address ? detailRow('\u05DB\u05EA\u05D5\u05D1\u05EA:', escapeHtml(data.property.address)) : ''}
        ${detailRow('\u05D3\u05D9\u05E8\u05D4:', `\u05D3\u05D9\u05E8\u05D4 ${escapeHtml(data.property.apartmentNumber)}${data.property.floor !== null && data.property.floor !== undefined ? `, \u05E7\u05D5\u05DE\u05D4 ${data.property.floor}` : ''}`)}
        ${data.property.area ? detailRow('\u05E9\u05D8\u05D7:', escapeHtml(data.property.area)) : ''}
        ${data.property.contractor ? detailRow('\u05E7\u05D1\u05DC\u05DF:', escapeHtml(data.property.contractor)) : ''}
      `)}
      ${sectionTitle('\u05E4\u05E8\u05D8\u05D9 \u05D4\u05DE\u05D6\u05DE\u05D9\u05DF')}
      ${detailBox(`
        ${detailRow('\u05E9\u05DD:', escapeHtml(data.client.name))}
        ${data.client.phone ? detailRow('\u05D8\u05DC\u05E4\u05D5\u05DF:', escapeHtml(data.client.phone)) : ''}
        ${data.client.email ? detailRow('\u05D0\u05D9\u05DE\u05D9\u05D9\u05DC:', escapeHtml(data.client.email)) : ''}
      `)}
      ${sectionTitle('\u05EA\u05E0\u05D0\u05D9 \u05D4\u05D1\u05D3\u05D9\u05E7\u05D4')}
      ${detailBox(`
        <div><span style="color:${PDF.lt};">\u05DE\u05D8\u05E8\u05D4: </span>\u05D1\u05D3\u05D9\u05E7\u05EA \u05DC\u05D9\u05E7\u05D5\u05D9\u05D9 \u05D1\u05E0\u05D9\u05D9\u05D4 \u05DC\u05E4\u05E0\u05D9 \u05E7\u05D1\u05DC\u05EA \u05D3\u05D9\u05E8\u05D4 \u05D7\u05D3\u05E9\u05D4</div>
        ${data.weatherConditions ? `<div><span style="color:${PDF.lt};">\u05DE\u05D6\u05D2 \u05D0\u05D5\u05D5\u05D9\u05E8: </span>${escapeHtml(data.weatherConditions)}</div>` : ''}
        ${data.limitations ? `<div><span style="color:${PDF.lt};">\u05DE\u05D2\u05D1\u05DC\u05D5\u05EA: </span>${escapeHtml(data.limitations)}</div>` : ''}
      `)}
      ${
        data.tools && data.tools.length > 0
          ? `
        ${sectionTitle('\u05DB\u05DC\u05D9\u05DD \u05D1\u05E9\u05D9\u05DE\u05D5\u05E9')}
        <div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:8px;display:flex;flex-wrap:wrap;gap:4px;">
          ${data.tools.map((t) => `<span style="display:flex;align-items:center;gap:3px;"><span style="color:${PDF.accent};">\u2713</span>${escapeHtml(t)}</span>`).join('')}
        </div>
      `
          : ''
      }
      ${footerHtml(2, title, data.reportDate, data.logoUrl)}
    </div>`;

  // --- DEFECT PAGES ---
  const defectPages: string[] = [];
  let currentPageDefects = '';
  let defectsOnPage = 0;
  const maxDefectsPerPage = 3;
  let pageNum = 3;

  for (const group of groups) {
    currentPageDefects += subSectionTitle(escapeHtml(group.category));
    for (const defect of group.defects) {
      currentPageDefects += defectFullHtml({
        num: defect.number,
        title: defect.title,
        location: defect.location,
        standardRef: defect.standardRef,
        standardText: defect.standardText,
        recommendation: defect.recommendation,
        cost: defect.cost,
        costLabel: defect.costLabel,
        note: defect.note,
        photoUrls: defect.photoUrls,
        annexText: defect.annexText,
      });
      defectsOnPage++;

      if (defectsOnPage >= maxDefectsPerPage) {
        defectPages.push(`
          <div class="page" style="display:flex;flex-direction:column;">
            ${miniHeader(`${title} \u2014 \u05DE\u05DE\u05E6\u05D0\u05D9\u05DD`, data.logoUrl)}
            ${currentPageDefects}
            ${footerHtml(pageNum, title, data.reportDate, data.logoUrl)}
          </div>`);
        currentPageDefects = '';
        defectsOnPage = 0;
        pageNum++;
      }
    }
  }

  // Flush remaining defects
  if (defectsOnPage > 0) {
    defectPages.push(`
      <div class="page" style="display:flex;flex-direction:column;">
        ${miniHeader(`${title} \u2014 \u05DE\u05DE\u05E6\u05D0\u05D9\u05DD`, data.logoUrl)}
        ${currentPageDefects}
        ${footerHtml(pageNum, title, data.reportDate, data.logoUrl)}
      </div>`);
    pageNum++;
  }

  // --- LAST PAGE: Costs + Summary ---
  const costGroups = groups.map((g) => ({
    category: g.category,
    defects: g.defects.map((d) => ({
      num: d.number,
      title: d.recommendation ?? d.title,
      cost: d.cost,
      costLabel: d.costLabel,
    })),
  }));

  const summaryPage = `
    <div class="page" style="display:flex;flex-direction:column;">
      ${miniHeader(`${title} \u2014 \u05DB\u05EA\u05D1 \u05DB\u05DE\u05D5\u05D9\u05D5\u05EA + \u05E1\u05D9\u05DB\u05D5\u05DD`, data.logoUrl)}

      ${sectionTitle('\u05DB\u05EA\u05D1 \u05DB\u05DE\u05D5\u05D9\u05D5\u05EA \u2014 \u05D0\u05D5\u05DE\u05D3\u05DF \u05E2\u05DC\u05D5\u05D9\u05D5\u05EA')}
      ${costTableHtml(costGroups)}

      ${sectionTitle('\u05E1\u05D9\u05DB\u05D5\u05DD')}
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin:3px 0 8px;">
        <div style="text-align:center;padding:6px 3px;background:${PDF.bg};border-radius:3px;border:1px solid ${PDF.bdrLt};">
          <div style="font-size:14px;font-weight:700;color:${PDF.dk};">${data.defects.length}</div>
          <div style="font-size:6.5px;color:${PDF.lt};margin-top:1px;">\u05DE\u05DE\u05E6\u05D0\u05D9\u05DD</div>
        </div>
        <div style="text-align:center;padding:6px 3px;background:${PDF.bg};border-radius:3px;border:1px solid ${PDF.bdrLt};">
          <div style="font-size:14px;font-weight:700;color:${PDF.dk};">${totalPhotos}</div>
          <div style="font-size:6.5px;color:${PDF.lt};margin-top:1px;">\u05EA\u05DE\u05D5\u05E0\u05D5\u05EA</div>
        </div>
        <div style="text-align:center;padding:6px 3px;background:${PDF.accentLt};border-radius:3px;border:1px solid ${PDF.bdrLt};">
          <div style="font-size:14px;font-weight:700;color:${PDF.dk};">${formatCurrency(totalCost)}</div>
          <div style="font-size:6.5px;color:${PDF.lt};margin-top:1px;">\u05E2\u05DC\u05D5\u05EA \u05DB\u05D5\u05DC\u05DC\u05EA</div>
        </div>
      </div>

      ${
        data.notes
          ? `
        ${sectionTitle('\u05D4\u05E2\u05E8\u05D5\u05EA \u05DB\u05DC\u05DC\u05D9\u05D5\u05EA')}
        <div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:8px;line-height:1.6;">${escapeHtml(data.notes)}</div>
      `
          : ''
      }

      ${sectionTitle('\u05D7\u05EA\u05D9\u05DE\u05D4')}
      <div style="display:flex;gap:20px;margin-top:4px;">
        ${signatureBoxHtml(
          '\u05D7\u05EA\u05D9\u05DE\u05EA \u05DE\u05E4\u05E7\u05D7',
          escapeHtml(data.inspector.name),
          escapeHtml(data.reportDate),
          data.signatures?.find((s) => s.signerType === 'inspector')?.imageUrl
        )}
        ${
          data.stampUrl
            ? `
          <div style="width:60px;text-align:center;">
            <div style="height:34px;border:1px solid ${PDF.bdr};border-radius:2px;display:flex;align-items:center;justify-content:center;">
              ${data.stampUrl ? `<img src="${data.stampUrl}" style="max-height:28px;max-width:50px;object-fit:contain;" />` : `<span style="font-size:7px;color:${PDF.vlt};">\u05D7\u05D5\u05EA\u05DE\u05EA</span>`}
            </div>
          </div>
        `
            : ''
        }
      </div>

      <div style="margin-top:8px;padding:4px 0;border-top:0.5px solid ${PDF.bdrLt};font-size:6.5px;color:${PDF.vlt};line-height:1.6;text-align:center;">
        \u05D3\u05D5\u05D7 \u05D6\u05D4 \u05DE\u05D4\u05D5\u05D5\u05D4 \u05D7\u05D5\u05D5\u05EA \u05D3\u05E2\u05EA \u05D4\u05E0\u05D3\u05E1\u05D9\u05EA \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9\u05EA. \u05D4\u05D0\u05D5\u05DE\u05D3\u05E0\u05D9\u05DD \u05D4\u05DD \u05D4\u05E2\u05E8\u05DB\u05D4 \u05D1\u05DC\u05D1\u05D3 \u05D5\u05D0\u05D9\u05E0\u05DD \u05DE\u05D7\u05D9\u05D9\u05D1\u05D9\u05DD. \u05D9\u05E9 \u05DC\u05E7\u05D1\u05DC \u05D4\u05E6\u05E2\u05D5\u05EA \u05DE\u05D7\u05D9\u05E8 \u05DE\u05DE\u05E7\u05E6\u05D5\u05E2\u05E0\u05D9\u05DD \u05DE\u05D5\u05E1\u05DE\u05DB\u05D9\u05DD.
      </div>
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
  ${coverPage}
  ${detailsPage}
  ${defectPages.join('')}
  ${summaryPage}
</body>
</html>`;
}
