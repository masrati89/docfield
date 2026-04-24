// --- Bedek Bayit PDF Template v3 ---
// Generates 14-page legal-grade HTML string for expo-print
// Design reference: mockups/inField-BedekBayit-PDF-v3.jsx

const DEFECTS_PER_PAGE = 3;

import type { PdfReportData, PdfDefect, DefectGroup } from './types';
import { REPORT_DEFAULTS } from '@infield/shared/src/constants/reportDefaults';
import {
  PDF,
  baseStyles,
  watermarkStyle,
  logoHtml,
  footerHtml,
  sectionTitle,
  subSectionTitle,
  detailRow,
  detailBox,
  escapeAttr,
  escapeHtml,
  formatCurrency,
  declarationHtml,
  groupDefectsByCategory,
  SEV_COLORS,
  sevBadgeHtml,
  breadcrumbHeaderHtml,
  photoHtmlV3,
  formatDate,
} from './shared';
// ═══════════════════════════════════════════════════════════
// PAGE 1: COVER — with legal declaration
// ═══════════════════════════════════════════════════════════

function coverPageHtml(data: PdfReportData): string {
  const title = '\u05D3\u05D5\u05D7 \u05D1\u05D3\u05E7 \u05D1\u05D9\u05EA';
  const roundLabel = data.roundNumber
    ? `\u05E1\u05D1\u05D1 \u05D1\u05D3\u05D9\u05E7\u05D4 ${data.roundNumber === 1 ? '\u05E8\u05D0\u05E9\u05D5\u05DF' : String(data.roundNumber)}`
    : '\u05E1\u05D1\u05D1 \u05D1\u05D3\u05D9\u05E7\u05D4 \u05E8\u05D0\u05E9\u05D5\u05DF';

  const declarationText = data.declaration ?? REPORT_DEFAULTS.declaration;

  // Big logo for cover (120×48) — hidden when no logo uploaded
  const bigLogo = data.logoUrl
    ? `<img src="${escapeAttr(data.logoUrl)}" style="width:120px;height:48px;object-fit:contain;border-radius:2px;" />`
    : '';

  return `
    <div style="margin-bottom:16px;align-self:center;">${bigLogo}</div>
    <div style="width:160px;height:1px;background:${PDF.dk};margin:0 auto 16px;"></div>
    <div style="font-size:30px;font-weight:700;color:${PDF.dk};letter-spacing:-0.5px;margin-bottom:6px;text-align:center;">${title}</div>
    <div style="font-size:14px;color:${PDF.lt};margin-bottom:6px;text-align:center;">\u05D1\u05D3\u05D9\u05E7\u05EA \u05E7\u05D1\u05DC\u05D4 \u05DC\u05D3\u05D9\u05E8\u05D4 \u05D7\u05D3\u05E9\u05D4</div>
    <div style="font-size:12px;color:${PDF.accent};font-weight:600;margin-bottom:14px;padding:3px 10px;border:1px solid ${PDF.accentMd};border-radius:10px;background:${PDF.accentLt};display:inline-block;align-self:center;">${roundLabel}</div>
    <div style="width:160px;height:1px;background:${PDF.bdr};margin:0 auto 14px;"></div>
    <div style="font-size:12px;color:${PDF.md};line-height:2;text-align:center;margin-bottom:14px;">
      ${detailRow('\u05E4\u05E8\u05D5\u05D9\u05E7\u05D8:', escapeHtml(data.property.projectName))}
      ${data.property.address ? detailRow('\u05DB\u05EA\u05D5\u05D1\u05EA:', escapeHtml(data.property.address)) : ''}
      ${detailRow('\u05D3\u05D9\u05E8\u05D4:', `\u05D3\u05D9\u05E8\u05D4 ${escapeHtml(data.property.apartmentNumber)}${data.property.floor !== null && data.property.floor !== undefined ? `, \u05E7\u05D5\u05DE\u05D4 ${data.property.floor}` : ''}`)}
      ${detailRow('\u05DE\u05D6\u05DE\u05D9\u05DF:', escapeHtml(data.client.name))}
      ${detailRow('\u05DE\u05E4\u05E7\u05D7:', `${escapeHtml(data.inspector.name)}${data.inspector.licenseNumber ? `, \u05DE.\u05E8. ${escapeHtml(data.inspector.licenseNumber)}` : ''}`)}
      ${detailRow('\u05EA\u05D0\u05E8\u05D9\u05DA \u05D1\u05D3\u05D9\u05E7\u05D4:', escapeHtml(formatDate(data.reportDate)))}
      ${detailRow('\u05DE\u05E1\u05E4\u05E8 \u05D3\u05D5\u05D7:', escapeHtml(data.reportNumber))}
    </div>
    <div style="width:160px;height:1px;background:${PDF.bdr};margin:0 auto 10px;"></div>
    <div style="padding:6px 12px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};max-width:380px;font-size:9px;color:${PDF.md};line-height:1.7;text-align:center;align-self:center;">
      <span style="font-weight:600;color:${PDF.dk};">\u05D4\u05E6\u05D4\u05E8\u05D4: </span>${escapeHtml(declarationText)}
    </div>
    <div style="margin-top:8px;font-size:8px;color:${PDF.vlt};text-align:center;">\u00A9 ${new Date(data.reportDate).getFullYear() || new Date().getFullYear()} ${escapeHtml(data.inspector.companyName ?? data.inspector.name)}. \u05DB\u05DC \u05D4\u05D6\u05DB\u05D5\u05D9\u05D5\u05EA \u05E9\u05DE\u05D5\u05E8\u05D5\u05EA.</div>
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE 2: TOC + LEGEND (merged)
// ═══════════════════════════════════════════════════════════

interface TocEntry {
  num: string;
  title: string;
  page: number;
  bold: boolean;
}

function tocLegendPageHtml(
  tocEntries: TocEntry[],
  defects: PdfDefect[],
  logoUrl?: string
): string {
  const tocRows = tocEntries
    .map(
      (e) => `
    <div style="display:flex;align-items:baseline;gap:6px;${e.bold ? '' : 'padding-right:12px;'}">
      <span style="font-weight:${e.bold ? 700 : 500};color:${e.bold ? PDF.dk : PDF.md};min-width:22px;">${e.num}</span>
      <span style="flex:0;font-weight:${e.bold ? 600 : 400};color:${e.bold ? PDF.dk : PDF.md};white-space:nowrap;">${escapeHtml(e.title)}</span>
      <span style="flex:1;border-bottom:1px dotted ${PDF.bdr};margin:0 4px;height:1px;align-self:center;"></span>
      <span style="font-weight:600;color:${e.bold ? PDF.dk : PDF.lt};min-width:14px;text-align:left;">${e.page}</span>
    </div>`
    )
    .join('');

  // Severity counts
  const sevCounts: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  for (const d of defects) {
    const sev = d.severity ?? 'medium';
    if (sev in sevCounts) sevCounts[sev]++;
  }

  const sevDescriptions: Record<string, string> = {
    critical: '\u05D3\u05D7\u05D5\u05E3',
    high: '\u05DC\u05E4\u05E0\u05D9 \u05DE\u05E1\u05D9\u05E8\u05D4',
    medium: '\u05DC\u05D9\u05E7\u05D5\u05D9 \u05D2\u05DE\u05E8',
    low: '\u05E7\u05D5\u05E1\u05DE\u05D8\u05D9',
  };

  return `
    ${breadcrumbHeaderHtml('\u05EA\u05D5\u05DB\u05DF \u05E2\u05E0\u05D9\u05D9\u05E0\u05D9\u05DD', logoUrl)}
    <div style="font-size:16px;font-weight:700;color:${PDF.dk};margin-bottom:8px;">\u05EA\u05D5\u05DB\u05DF \u05E2\u05E0\u05D9\u05D9\u05E0\u05D9\u05DD</div>
    <div style="font-size:11px;line-height:1.9;margin-bottom:8px;">
      ${tocRows}
    </div>
    ${sectionTitle('\u05DE\u05E7\u05E8\u05D0')}
    <div style="display:flex;flex-direction:column;gap:4px;font-size:10px;color:${PDF.md};line-height:1.5;">
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${(['critical', 'high', 'medium', 'low'] as const)
          .map(
            (lev) =>
              `<div style="display:flex;gap:3px;align-items:center;">${sevBadgeHtml(lev)}<span style="font-size:9px;color:${PDF.lt};">${sevDescriptions[lev]}</span></div>`
          )
          .join('')}
      </div>
      <div style="display:flex;gap:8px;font-size:9px;color:${PDF.lt};">
        <span style="display:flex;align-items:center;gap:3px;">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="${PDF.lt}" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
          \u05E0\u05E1\u05E4\u05D7 \u05EA\u05E7\u05DF \u05DE\u05E6\u05D5\u05E8\u05E3
        </span>
        <span style="display:flex;align-items:center;gap:3px;">
          <div style="width:10px;height:8px;border:1.5px solid #B42318;border-radius:1px;"></div>
          \u05E1\u05D9\u05DE\u05D5\u05DF \u05E2\u05DC \u05EA\u05DE\u05D5\u05E0\u05D4
        </span>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE 3: EXECUTIVE SUMMARY + DEFECT INDEX
// ═══════════════════════════════════════════════════════════

function execSummaryPageHtml(
  data: PdfReportData,
  groups: DefectGroup[],
  defectStartPage: number,
  logoUrl?: string
): string {
  const _totalCost = data.defects.reduce((s, d) => s + (d.cost ?? 0), 0);

  // Severity counts
  const sevCounts: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  for (const d of data.defects) {
    const sev = d.severity ?? 'medium';
    if (sev in sevCounts) sevCounts[sev]++;
  }

  const sevCards = (['critical', 'high', 'medium', 'low'] as const)
    .map((lev) => {
      const c = SEV_COLORS[lev];
      return `<div style="text-align:center;padding:5px 3px;background:${c.bg};border-radius:3px;border:1px solid ${c.bdr};">
        <div style="font-size:18px;font-weight:700;color:${c.fg};">${sevCounts[lev]}</div>
        <div style="font-size:8px;color:${c.fg};font-weight:600;">${c.label}</div>
      </div>`;
    })
    .join('');

  // Defect index rows
  let defectPageOffset = defectStartPage;
  let defectsOnPage = 0;
  const defectPageMap = new Map<number, number>();
  for (const g of groups) {
    for (const d of g.defects) {
      defectPageMap.set(d.number, defectPageOffset);
      defectsOnPage++;
      if (defectsOnPage >= DEFECTS_PER_PAGE) {
        defectPageOffset++;
        defectsOnPage = 0;
      }
    }
  }

  const indexRows = data.defects
    .map(
      (d) => `
    <div style="display:grid;grid-template-columns:28px 1fr 70px 50px 50px 32px;padding:4px 6px;border-bottom:1px solid ${PDF.bdrLt};align-items:center;">
      <span style="font-weight:700;color:${PDF.dk};">${d.number}</span>
      <span style="color:${PDF.md};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(d.title)}</span>
      <span style="color:${PDF.accent};font-weight:500;font-size:9px;">${escapeHtml(d.category)}</span>
      <span>${sevBadgeHtml(d.severity ?? 'medium')}</span>
      <span style="text-align:left;font-weight:600;font-size:9px;">${d.cost ? formatCurrency(d.cost) : '\u2014'}</span>
      <span style="text-align:left;color:${PDF.lt};">${defectPageMap.get(d.number) ?? ''}</span>
    </div>`
    )
    .join('');

  return `
    ${breadcrumbHeaderHtml('\u05EA\u05E7\u05E6\u05D9\u05E8 \u05DE\u05E0\u05D4\u05DC\u05D9\u05DD', logoUrl)}
    <div style="font-size:16px;font-weight:700;color:${PDF.dk};margin-bottom:6px;">\u05EA\u05E7\u05E6\u05D9\u05E8 \u05DE\u05E0\u05D4\u05DC\u05D9\u05DD</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px;margin:0 0 6px;">
      ${sevCards}
    </div>
    ${sectionTitle('\u05DE\u05E4\u05EA\u05D7 \u05DC\u05D9\u05E7\u05D5\u05D9\u05D9\u05DD')}
    <div style="border:1px solid ${PDF.bdr};border-radius:2px;overflow:hidden;font-size:10px;">
      <div style="display:grid;grid-template-columns:28px 1fr 70px 50px 50px 32px;background:${PDF.dk};color:#fff;padding:4px 6px;font-weight:600;font-size:9px;">
        <span>#</span><span>\u05EA\u05D9\u05D0\u05D5\u05E8</span><span>\u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4</span><span>\u05D7\u05D5\u05DE\u05E8\u05D4</span><span style="text-align:left;">\u05E2\u05DC\u05D5\u05EA</span><span style="text-align:left;">\u05E2\u05DE'</span>
      </div>
      ${indexRows}
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE 4: STANDARDS & REFERENCES (conditional)
// ═══════════════════════════════════════════════════════════

function standardsPageHtml(
  data: PdfReportData,
  standards: { ref: string; text: string }[],
  logoUrl?: string
): string {
  const boilerplateList =
    data.standardsBoilerplate ?? REPORT_DEFAULTS.standards_boilerplate;

  const specificRows = standards
    .map(
      (s) => `
    <div style="display:flex;gap:6px;">
      <span style="font-weight:600;color:${PDF.dk};min-width:70px;">${escapeHtml(s.ref)}</span>
      <span style="color:${PDF.md};">${escapeHtml(s.text)}</span>
    </div>`
    )
    .join('');

  return `
    ${breadcrumbHeaderHtml('\u05EA\u05E7\u05E0\u05D9\u05DD \u05D5\u05DE\u05E1\u05DE\u05DB\u05D9 \u05D9\u05D9\u05D7\u05D5\u05E1', logoUrl)}
    <div style="font-size:16px;font-weight:700;color:${PDF.dk};margin-bottom:6px;">\u05EA\u05E7\u05E0\u05D9\u05DD \u05D5\u05DE\u05E1\u05DE\u05DB\u05D9 \u05D9\u05D9\u05D7\u05D5\u05E1</div>
    <div style="font-size:10px;color:${PDF.md};line-height:1.6;margin-bottom:6px;">\u05D7\u05D5\u05D5\u05EA \u05D4\u05D3\u05E2\u05EA \u05DE\u05E1\u05EA\u05DE\u05DB\u05EA \u05E2\u05DC \u05D4\u05DE\u05E1\u05DE\u05DB\u05D9\u05DD \u05D5\u05D4\u05EA\u05E7\u05E0\u05D9\u05DD \u05D4\u05D1\u05D0\u05D9\u05DD:</div>
    <div style="padding:6px 10px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:10px;line-height:2;">
      ${boilerplateList.map((t) => `<div style="display:flex;gap:4px;align-items:baseline;"><span style="color:${PDF.accent};font-weight:700;font-size:13px;">\u2022</span><span>${t}</span></div>`).join('')}
    </div>
    ${
      standards.length > 0
        ? `
      ${sectionTitle('\u05EA\u05E7\u05E0\u05D9\u05DD \u05E1\u05E4\u05E6\u05D9\u05E4\u05D9\u05D9\u05DD \u05E9\u05E6\u05D5\u05D8\u05D8\u05D5 \u05D1\u05D3\u05D5\u05D7 \u05D6\u05D4')}
      <div style="padding:6px 10px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:10px;line-height:1.9;">
        ${specificRows}
      </div>
    `
        : ''
    }
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE 5: TENANT RIGHTS (always shown)
// ═══════════════════════════════════════════════════════════

function tenantRightsPageHtml(data: PdfReportData, logoUrl?: string): string {
  const warrantyPeriods =
    data.warrantyPeriods ?? REPORT_DEFAULTS.warranty_periods;
  const warrantyRows = warrantyPeriods.map((w) => [w.desc, w.period]);

  const warrantyRowsHtml = warrantyRows
    .map(
      ([desc, period]) => `
    <div style="display:grid;grid-template-columns:1fr 80px;padding:3px 6px;border-bottom:1px solid ${PDF.bdrLt};">
      <span>${desc}</span><span style="text-align:left;font-weight:600;color:${PDF.dk};">${period}</span>
    </div>`
    )
    .join('');

  const requiredDocs = data.requiredDocs ?? REPORT_DEFAULTS.required_docs;

  // General notes sections (merged from former separate page)
  let generalNotesSections = '';

  if (data.showWorkMethod !== false) {
    const workMethodText = data.workMethod ?? REPORT_DEFAULTS.work_method;
    generalNotesSections += `
      ${sectionTitle('שיטת עבודה')}
      <div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:10px;line-height:1.7;">
        ${escapeHtml(workMethodText)}
      </div>
    `;
  }

  if (data.generalNotes?.trim()) {
    const lines = data.generalNotes
      .trim()
      .split('\n')
      .filter((l) => l.trim());
    generalNotesSections += `
      ${sectionTitle('הערות כלליות')}
      <div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:10px;line-height:1.7;">
        ${lines.map((l) => `<div>• ${escapeHtml(l)}</div>`).join('')}
      </div>
    `;
  }

  if (data.showLimitations !== false && data.limitations?.trim()) {
    generalNotesSections += `
      ${sectionTitle('מגבלות הבדיקה')}
      <div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:10px;line-height:1.7;">
        ${data.limitations
          .trim()
          .split('\n')
          .filter((l) => l.trim())
          .map((l) => `<div>• ${escapeHtml(l)}</div>`)
          .join('')}
      </div>
    `;
  }

  if (data.propertyDescription?.trim()) {
    generalNotesSections += `
      ${sectionTitle('תיאור הנכס')}
      <div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:10px;line-height:1.8;">
        <div style="white-space:pre-wrap;">${escapeHtml(data.propertyDescription)}</div>
      </div>
    `;
  }

  return `
    ${breadcrumbHeaderHtml('ידע כללי לדייר', logoUrl)}
    <div style="font-size:16px;font-weight:700;color:${PDF.dk};margin-bottom:6px;">ידע כללי לדייר</div>
    ${sectionTitle('אחריות קבלן — חוק המכר (דירות)')}
    <div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:10px;line-height:1.7;">
      <div style="margin-bottom:4px;">קבלן המוכר דירה נושא באחריות לתיקון ליקויים שנתגלו בדירה בתקופה שלאחר מסירתה לקונה. האחריות מתחלקת לשתי תקופות:</div>
      <div style="font-weight:600;color:${PDF.dk};margin-top:4px;">1. תקופת הבדק</div>
      <div>חובה על המוכר לתקן את הליקוי אלא אם הוכיח שנגרם באשמת בעל הדירה. התקופה נמשכת בין שנה ל-7 שנים לפי מהות הליקוי.</div>
      <div style="font-weight:600;color:${PDF.dk};margin-top:4px;">2. תקופת האחריות</div>
      <div>חובת ההוכחה על הרוכש — עליו להוכיח שהליקוי נובע מתכנון, עבודה או חומרים. מתחילה עם סיום תקופת הבדק, נמשכת 3 שנים.</div>
    </div>
    ${sectionTitle('תקופות בדק לפי חוק מכר')}
    <div style="border:1px solid ${PDF.bdr};border-radius:2px;overflow:hidden;font-size:10px;">
      <div style="display:grid;grid-template-columns:1fr 80px;background:${PDF.dk};color:#fff;padding:4px 6px;font-weight:600;">
        <span>סוג הליקוי</span><span style="text-align:left;">תקופה</span>
      </div>
      ${warrantyRowsHtml}
    </div>
    ${sectionTitle('מסמכים נדרשים ביום מסירה')}
    <div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:10px;line-height:1.7;">
      ${requiredDocs.map((t, i) => `<div style="display:flex;gap:4px;"><span style="color:${PDF.accent};font-weight:700;">${i + 1}.</span><span>${t}</span></div>`).join('')}
    </div>
    ${generalNotesSections}
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE 7: INSPECTION DETAILS
// ═══════════════════════════════════════════════════════════

function detailsPageHtml(data: PdfReportData, logoUrl?: string): string {
  return `
    ${breadcrumbHeaderHtml('\u05E4\u05E8\u05D8\u05D9 \u05D4\u05D1\u05D3\u05D9\u05E7\u05D4', logoUrl)}
    ${
      data.inspector.name ||
      data.inspector.licenseNumber ||
      data.inspector.education ||
      data.inspector.phone ||
      data.inspector.email
        ? `
    ${sectionTitle('\u05E4\u05E8\u05D8\u05D9 \u05D4\u05DE\u05E4\u05E7\u05D7')}
    ${detailBox(`
      ${data.inspector.name ? detailRow('\u05E9\u05DD:', escapeHtml(data.inspector.name)) : ''}
      ${data.inspector.licenseNumber ? detailRow('\u05DE.\u05E8.:', escapeHtml(data.inspector.licenseNumber)) : ''}
      ${data.inspector.education ? detailRow('\u05D4\u05E9\u05DB\u05DC\u05D4:', escapeHtml(data.inspector.education)) : ''}
      ${data.inspector.experience ? detailRow('\u05E0\u05D9\u05E1\u05D9\u05D5\u05DF:', escapeHtml(data.inspector.experience)) : ''}
      ${data.inspector.companyName ? detailRow('\u05D7\u05D1\u05E8\u05D4:', escapeHtml(data.inspector.companyName)) : ''}
      ${data.inspector.phone ? detailRow('\u05D8\u05DC\u05E4\u05D5\u05DF:', escapeHtml(data.inspector.phone)) : ''}
      ${data.inspector.email ? detailRow('\u05D0\u05D9\u05DE\u05D9\u05D9\u05DC:', escapeHtml(data.inspector.email)) : ''}
    `)}`
        : ''
    }
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
      ${data.client.idNumber ? detailRow('\u05EA.\u05D6.:', escapeHtml(data.client.idNumber)) : ''}
    `)}
    ${
      data.contractorName
        ? `
      ${sectionTitle('\u05E4\u05E8\u05D8\u05D9 \u05E7\u05D1\u05DC\u05DF')}
      ${detailBox(`
        ${detailRow('\u05E9\u05DD:', escapeHtml(data.contractorName))}
        ${data.contractorPhone ? detailRow('\u05D8\u05DC\u05E4\u05D5\u05DF:', escapeHtml(data.contractorPhone)) : ''}
      `)}
    `
        : ''
    }
    ${
      data.showDeclaration !== false && data.declaration
        ? `
      ${sectionTitle('\u05D4\u05E6\u05D4\u05E8\u05EA \u05D1\u05D5\u05D3\u05E7')}
      ${declarationHtml(data.declaration)}
    `
        : ''
    }
    ${sectionTitle('\u05EA\u05E0\u05D0\u05D9 \u05D4\u05D1\u05D3\u05D9\u05E7\u05D4')}
    ${detailBox(`
      <div><span style="color:${PDF.lt};">\u05DE\u05D8\u05E8\u05D4: </span>\u05D1\u05D3\u05D9\u05E7\u05EA \u05DC\u05D9\u05E7\u05D5\u05D9\u05D9 \u05D1\u05E0\u05D9\u05D9\u05D4 \u05DC\u05E4\u05E0\u05D9 \u05E7\u05D1\u05DC\u05EA \u05D3\u05D9\u05E8\u05D4 \u05D7\u05D3\u05E9\u05D4</div>
      ${data.weatherConditions ? `<div><span style="color:${PDF.lt};">\u05DE\u05D6\u05D2 \u05D0\u05D5\u05D5\u05D9\u05E8: </span>${escapeHtml(data.weatherConditions)}</div>` : ''}
      ${data.showLimitations !== false && data.limitations ? `<div><span style="color:${PDF.lt};">\u05DE\u05D2\u05D1\u05DC\u05D5\u05EA: </span>${escapeHtml(data.limitations)}</div>` : ''}
    `)}
    ${
      data.showTools !== false && data.tools && data.tools.length > 0
        ? `
      ${sectionTitle('\u05DB\u05DC\u05D9\u05DD \u05D1\u05E9\u05D9\u05DE\u05D5\u05E9')}
      <div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:10px;display:flex;flex-wrap:wrap;gap:6px;">
        ${data.tools.map((t) => `<span style="display:flex;align-items:center;gap:3px;"><span style="color:${PDF.accent};">\u2713</span>${escapeHtml(t)}</span>`).join('')}
      </div>
    `
        : ''
    }
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGES 8-N: DEFECT PAGES — with severity + price×qty + 100×75 photos
// ═══════════════════════════════════════════════════════════

function defectFullHtml(d: PdfDefect): string {
  const photos =
    d.photos ?? d.photoUrls?.map((url) => ({ url, caption: undefined })) ?? [];
  const total = d.unitPrice && d.quantity ? d.unitPrice * d.quantity : null;
  const costDisplay = total
    ? formatCurrency(total)
    : d.cost
      ? formatCurrency(d.cost)
      : '';

  const labelStyle = `font-weight:600;color:${PDF.lt};font-size:10px;min-width:90px;flex-shrink:0;`;
  const valueStyle = `font-size:10px;color:${PDF.dk};flex:1;`;
  const rowStyle = `display:flex;gap:6px;padding:3px 0;border-bottom:1px solid ${PDF.bdrLt};`;

  let html = `
    <div style="padding:8px 0;border:1px solid ${PDF.bdr};border-radius:3px;margin-bottom:6px;overflow:hidden;">
      <div style="display:flex;align-items:center;gap:6px;padding:4px 8px;background:${PDF.bg};border-bottom:1px solid ${PDF.bdr};">
        <div style="font-size:11px;font-weight:700;color:white;background:${PDF.dk};width:24px;height:24px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${d.number}</div>
        <div style="flex:1;font-size:12px;font-weight:700;color:${PDF.dk};">ממצא ${d.number}</div>
        ${d.severity ? sevBadgeHtml(d.severity) : ''}
        ${costDisplay ? `<div style="font-size:10px;font-weight:700;color:${PDF.accent};background:${PDF.accentLt};padding:2px 8px;border-radius:10px;">${costDisplay}</div>` : ''}
      </div>
      <div style="padding:4px 10px;">
        <div style="${rowStyle}">
          <span style="${labelStyle}">תיאור ממצא:</span>
          <span style="${valueStyle}">${escapeHtml(d.title)}</span>
        </div>`;

  if (d.location) {
    html += `
        <div style="${rowStyle}">
          <span style="${labelStyle}">מיקום:</span>
          <span style="${valueStyle}">${escapeHtml(d.location)}</span>
        </div>`;
  }

  if (d.standardRef && d.standardRef !== 'NULL' && d.standardRef !== 'null') {
    html += `
        <div style="${rowStyle}">
          <span style="${labelStyle}">תקן:</span>
          <span style="${valueStyle}">${escapeHtml(d.standardRef)}${d.standardText ? ` — ${escapeHtml(d.standardText)}` : ''}</span>
        </div>`;
  }

  if (d.recommendation) {
    html += `
        <div style="${rowStyle}">
          <span style="${labelStyle}">המלצה לתיקון:</span>
          <span style="${valueStyle}">${escapeHtml(d.recommendation)}</span>
        </div>`;
  }

  if (total && d.unitPrice && d.quantity) {
    html += `
        <div style="${rowStyle}">
          <span style="${labelStyle}">עלות:</span>
          <span style="${valueStyle}">${formatCurrency(d.unitPrice)} × ${d.quantity} ${d.unitLabel ? escapeHtml(d.unitLabel) : ''} = ${formatCurrency(total)}</span>
        </div>`;
  }

  if (d.note) {
    html += `
        <div style="${rowStyle}">
          <span style="${labelStyle}">הערה:</span>
          <span style="${valueStyle}font-style:italic;">${escapeHtml(d.note)}</span>
        </div>`;
  }

  html += `</div>`;

  if (photos.length > 0) {
    html += `<div style="display:flex;gap:4px;padding:4px 10px;flex-wrap:wrap;">`;
    for (const photo of photos.slice(0, 6)) {
      html += photoHtmlV3(photo.url);
    }
    html += `</div>`;
  }

  if (d.annexText) {
    html += `
      <div style="padding:3px 10px;font-size:9px;color:${PDF.lt};display:flex;align-items:center;gap:4px;">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${PDF.lt}" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
        ${escapeHtml(d.annexText)}
      </div>`;
  }

  html += `</div>`;
  return html;
}

function defectPagesContent(
  defects: PdfDefect[],
  groups: DefectGroup[],
  logoUrl?: string
): string[] {
  const pages: string[] = [];
  const maxDefectsPerPage = DEFECTS_PER_PAGE;
  let isFirstPage = true;

  for (let gi = 0; gi < groups.length; gi++) {
    const group = groups[gi];
    let currentContent = '';
    let defectsOnPage = 0;

    // Add main "ממצאים" title on the very first defect page
    if (isFirstPage) {
      currentContent += `<div style="font-size:16px;font-weight:700;color:${PDF.dk};margin-bottom:8px;">ממצאים</div>`;
      isFirstPage = false;
    }

    const categoryHeader = subSectionTitle(escapeHtml(group.category));
    currentContent += categoryHeader;

    for (let di = 0; di < group.defects.length; di++) {
      currentContent += defectFullHtml(group.defects[di]);
      defectsOnPage++;

      if (defectsOnPage >= maxDefectsPerPage && di < group.defects.length - 1) {
        pages.push(`
          ${breadcrumbHeaderHtml('ממצאים', logoUrl)}
          ${currentContent}
        `);
        currentContent = '';
        defectsOnPage = 0;

        currentContent += subSectionTitle(
          `${escapeHtml(group.category)} (המשך)`
        );
      }
    }

    // Flush remaining content for this category as a page
    if (defectsOnPage > 0) {
      pages.push(`
        ${breadcrumbHeaderHtml('ממצאים', logoUrl)}
        ${currentContent}
      `);
    }
  }

  return pages;
}

// ═══════════════════════════════════════════════════════════
// PAGE N+1: BOQ — enhanced with בצ"מ + פיקוח + מע"מ
// ═══════════════════════════════════════════════════════════

function boqPageHtml(
  groups: DefectGroup[],
  boqRates?: { batzam: number; supervision: number; vat: number },
  logoUrl?: string
): string {
  const rates = {
    batzam: boqRates?.batzam ?? 0.1,
    supervision: boqRates?.supervision ?? 0.1,
    vat: boqRates?.vat ?? 0.18,
  };

  let rows = '';
  let grandTotal = 0;

  for (const g of groups) {
    rows += `<div style="padding:3px 6px;background:${PDF.accentLt};font-weight:700;font-size:10px;color:${PDF.accent};">${escapeHtml(g.category)}</div>`;
    let categoryTotal = 0;

    for (const d of g.defects) {
      const unitPrice = d.unitPrice ?? d.cost ?? 0;
      const qty = d.quantity ?? 1;
      const lineTotal =
        d.unitPrice && d.quantity ? d.unitPrice * d.quantity : (d.cost ?? 0);
      categoryTotal += lineTotal;

      rows += `
        <div style="display:grid;grid-template-columns:28px 1fr 56px 42px 64px;padding:3px 6px;border-bottom:1px solid ${PDF.bdrLt};">
          <span style="font-weight:600;">${d.number}</span>
          <span>${escapeHtml(d.recommendation ?? d.title)}</span>
          <span style="text-align:left;">${formatCurrency(unitPrice)}</span>
          <span style="text-align:left;">${qty}</span>
          <span style="text-align:left;font-weight:600;">${formatCurrency(lineTotal)}</span>
        </div>`;
    }

    grandTotal += categoryTotal;

    // Category subtotal
    rows += `
      <div style="display:grid;grid-template-columns:28px 1fr 60px;padding:3px 6px;background:${PDF.bg};border-bottom:1px solid ${PDF.bdr};font-weight:600;font-size:10px;">
        <span></span><span style="color:${PDF.lt};">\u05E1\u05D4"\u05DB ${escapeHtml(g.category)}</span><span style="text-align:left;">${formatCurrency(categoryTotal)}</span>
      </div>`;
  }

  const batzam = grandTotal * rates.batzam;
  const supervision = (grandTotal + batzam) * rates.supervision;
  const preVat = grandTotal + batzam + supervision;
  const vat = preVat * rates.vat;
  const total = preVat + vat;

  return `
    ${breadcrumbHeaderHtml('\u05DB\u05EA\u05D1 \u05DB\u05DE\u05D5\u05D9\u05D5\u05EA', logoUrl)}
    <div style="font-size:16px;font-weight:700;color:${PDF.dk};margin-bottom:6px;">\u05DB\u05EA\u05D1 \u05DB\u05DE\u05D5\u05D9\u05D5\u05EA \u2014 \u05D0\u05D5\u05DE\u05D3\u05DF \u05E2\u05DC\u05D5\u05D9\u05D5\u05EA</div>
    <div style="border:1px solid ${PDF.bdr};border-radius:2px;overflow:hidden;font-size:10px;">
      <div style="display:grid;grid-template-columns:28px 1fr 56px 42px 64px;background:${PDF.dk};color:#fff;padding:4px 6px;font-weight:600;font-size:9px;">
        <span>#</span><span>\u05EA\u05D9\u05D0\u05D5\u05E8</span><span style="text-align:left;">\u05DE\u05D7\u05D9\u05E8/\u05D9\u05D7'</span><span style="text-align:left;">\u05DB\u05DE\u05D5\u05EA</span><span style="text-align:left;">\u05E1\u05D4"\u05DB (\u20AA)</span>
      </div>
      ${rows}
      <div style="display:grid;grid-template-columns:28px 1fr 60px;padding:4px 6px;background:${PDF.bg};font-weight:700;border-top:2px solid ${PDF.bdr};">
        <span></span><span style="color:${PDF.dk};">\u05E1\u05D4"\u05DB \u05D1\u05D9\u05E0\u05D9\u05D9\u05DD</span><span style="text-align:left;">${formatCurrency(grandTotal)}</span>
      </div>
      <div style="display:grid;grid-template-columns:28px 1fr 60px;padding:3px 6px;background:${PDF.bg};">
        <span></span><span style="color:${PDF.md};">\u05D1\u05E6"\u05DE (${Math.round(rates.batzam * 100)}%)</span><span style="text-align:left;">${formatCurrency(Math.round(batzam))}</span>
      </div>
      <div style="display:grid;grid-template-columns:28px 1fr 60px;padding:3px 6px;background:${PDF.bg};">
        <span></span><span style="color:${PDF.md};">\u05E4\u05D9\u05E7\u05D5\u05D7 \u05D4\u05E0\u05D3\u05E1\u05D9 (${Math.round(rates.supervision * 100)}%)</span><span style="text-align:left;">${formatCurrency(Math.round(supervision))}</span>
      </div>
      <div style="display:grid;grid-template-columns:28px 1fr 60px;padding:4px 6px;background:${PDF.bg};font-weight:700;border-top:1px solid ${PDF.bdr};">
        <span></span><span style="color:${PDF.dk};">\u05E1\u05D4"\u05DB \u05DC\u05E4\u05E0\u05D9 \u05DE\u05E2"\u05DE</span><span style="text-align:left;">${formatCurrency(Math.round(preVat))}</span>
      </div>
      <div style="display:grid;grid-template-columns:28px 1fr 60px;padding:3px 6px;background:${PDF.bg};">
        <span></span><span style="color:${PDF.md};">\u05DE\u05E2"\u05DE (${Math.round(rates.vat * 100)}%)</span><span style="text-align:left;">${formatCurrency(Math.round(vat))}</span>
      </div>
      <div style="display:grid;grid-template-columns:28px 1fr 60px;padding:5px 6px;background:${PDF.dk};color:#fff;font-weight:700;">
        <span></span><span>\u05E1\u05D4"\u05DB \u05DB\u05D5\u05DC\u05DC \u05DE\u05E2"\u05DE</span><span style="text-align:left;">${formatCurrency(Math.round(total))}</span>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE N+2: BOQ NOTES (always shown)
// ═══════════════════════════════════════════════════════════

function boqNotesPageHtml(
  data: PdfReportData,
  groups: DefectGroup[],
  totalCostWithVat: number,
  logoUrl?: string
): string {
  const totalPhotos = data.defects.reduce(
    (s, d) => s + (d.photos?.length ?? d.photoUrls?.length ?? 0),
    0
  );

  const notes = data.financialNotes ?? REPORT_DEFAULTS.financial_notes;

  return `
    ${breadcrumbHeaderHtml('\u05D4\u05E2\u05E8\u05D5\u05EA \u05DC\u05D4\u05E2\u05E8\u05DB\u05D4 \u05DB\u05E1\u05E4\u05D9\u05EA', logoUrl)}
    <div style="font-size:16px;font-weight:700;color:${PDF.dk};margin-bottom:6px;">\u05D4\u05E2\u05E8\u05D5\u05EA \u05DC\u05D4\u05E2\u05E8\u05DB\u05D4 \u05DB\u05E1\u05E4\u05D9\u05EA</div>
    ${
      data.showFinancialNotes !== false
        ? `
    <div style="padding:6px 10px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:10px;line-height:1.8;">
      ${notes.map((n) => `<div>\u2022 ${escapeHtml(n)}</div>`).join('')}
    </div>`
        : ''
    }
    ${sectionTitle('\u05E1\u05D9\u05DB\u05D5\u05DD \u05DB\u05DE\u05D5\u05EA\u05D9')}
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:5px;margin:4px 0;">
      <div style="text-align:center;padding:6px 3px;background:${PDF.bg};border-radius:3px;border:1px solid ${PDF.bdrLt};">
        <div style="font-size:18px;font-weight:700;color:${PDF.dk};">${data.defects.length}</div>
        <div style="font-size:8px;color:${PDF.lt};margin-top:1px;">\u05DE\u05DE\u05E6\u05D0\u05D9\u05DD</div>
      </div>
      <div style="text-align:center;padding:6px 3px;background:${PDF.bg};border-radius:3px;border:1px solid ${PDF.bdrLt};">
        <div style="font-size:18px;font-weight:700;color:${PDF.dk};">${totalPhotos}</div>
        <div style="font-size:8px;color:${PDF.lt};margin-top:1px;">\u05EA\u05DE\u05D5\u05E0\u05D5\u05EA</div>
      </div>
      <div style="text-align:center;padding:6px 3px;background:${PDF.bg};border-radius:3px;border:1px solid ${PDF.bdrLt};">
        <div style="font-size:18px;font-weight:700;color:${PDF.dk};">${groups.length}</div>
        <div style="font-size:8px;color:${PDF.lt};margin-top:1px;">\u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D5\u05EA</div>
      </div>
      <div style="text-align:center;padding:6px 3px;background:${PDF.accentLt};border-radius:3px;border:1px solid ${PDF.bdrLt};">
        <div style="font-size:18px;font-weight:700;color:${PDF.dk};">${formatCurrency(Math.round(totalCostWithVat))}</div>
        <div style="font-size:8px;color:${PDF.lt};margin-top:1px;">\u05E2\u05DC\u05D5\u05EA \u05DB\u05D5\u05DC\u05DC\u05EA</div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE N+3: SIGNATURES
// ═══════════════════════════════════════════════════════════

function signaturesPageHtml(data: PdfReportData, logoUrl?: string): string {
  const inspectorSig = data.signatures?.find(
    (s) => s.signerType === 'inspector'
  );
  const tenantSig = data.signatures?.find((s) => s.signerType === 'tenant');

  return `
    ${breadcrumbHeaderHtml('חתימות ואישורים', logoUrl)}
    <div style="font-size:16px;font-weight:700;color:${PDF.dk};margin-bottom:6px;">חתימות ואישורים</div>
    ${
      data.showInspectorDeclaration !== false
        ? `
    ${sectionTitle('הצהרת המפקח')}
    <div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:10px;line-height:1.7;color:${PDF.md};">
      ${escapeHtml((data.inspectorDeclaration ?? REPORT_DEFAULTS.inspector_declaration).replace('{name}', data.inspector.name).replace('{license}', data.inspector.licenseNumber ?? ''))}
    </div>`
        : ''
    }
    ${
      data.showTenantAcknowledgment !== false
        ? `
    ${sectionTitle('אישור המזמין')}
    <div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:10px;line-height:1.7;color:${PDF.md};">
      ${escapeHtml(data.tenantAcknowledgment ?? REPORT_DEFAULTS.tenant_acknowledgment)}
    </div>`
        : ''
    }
    <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div style="text-align:center;">
        <div style="font-size:10px;font-weight:600;color:${PDF.dk};margin-bottom:4px;">חתימת המפקח</div>
        <div style="height:60px;border:1px solid ${PDF.bdr};border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:9px;color:${PDF.vlt};font-style:italic;background:${PDF.bg};">
          ${inspectorSig?.imageUrl ? `<img src="${escapeAttr(inspectorSig.imageUrl)}" style="max-height:52px;max-width:100%;object-fit:contain;" />` : '[חתימה דיגיטלית]'}
        </div>
        <div style="font-size:10px;color:${PDF.dk};margin-top:3px;font-weight:600;">${escapeHtml(data.inspector.name)}</div>
        <div style="font-size:9px;color:${PDF.lt};">${escapeHtml(formatDate(data.reportDate))}</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:10px;font-weight:600;color:${PDF.dk};margin-bottom:4px;">חתימת המזמין</div>
        <div style="height:60px;border:1px solid ${PDF.bdr};border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:9px;color:${PDF.vlt};font-style:italic;background:${PDF.bg};">
          ${tenantSig?.imageUrl ? `<img src="${escapeAttr(tenantSig.imageUrl)}" style="max-height:52px;max-width:100%;object-fit:contain;" />` : '[חתימה דיגיטלית]'}
        </div>
        <div style="font-size:10px;color:${PDF.dk};margin-top:3px;font-weight:600;">${escapeHtml(data.client.name)}</div>
        <div style="font-size:9px;color:${PDF.lt};">${escapeHtml(formatDate(data.reportDate))}</div>
      </div>
    </div>
    ${
      data.stampUrl
        ? `
      <div style="margin-top:10px;padding:6px 10px;border:1px dashed ${PDF.bdr};border-radius:2px;display:flex;align-items:center;gap:10px;background:${PDF.bg};">
        <div style="width:50px;height:50px;border-radius:25px;border:2px solid ${PDF.accent};display:flex;align-items:center;justify-content:center;overflow:hidden;background:${PDF.accentLt};">
          <img src="${escapeAttr(data.stampUrl)}" style="max-width:44px;max-height:44px;object-fit:contain;" />
        </div>
        <div style="font-size:10px;color:${PDF.lt};line-height:1.5;flex:1;">
          <div style="font-weight:600;color:${PDF.dk};font-size:10px;">חותמת מקצועית</div>
          <div>${escapeHtml(data.inspector.name)}</div>
        </div>
      </div>
    `
        : ''
    }
    ${
      data.showDisclaimer !== false
        ? `
    ${sectionTitle('כתב ויתור')}
    <div style="padding:5px 8px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};font-size:9px;line-height:1.6;color:${PDF.lt};">
      ${escapeHtml(data.disclaimerText ?? REPORT_DEFAULTS.disclaimer)}
    </div>`
        : ''
    }
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE N+5: BACK COVER — contact + disclaimer
// ═══════════════════════════════════════════════════════════

function backCoverPageHtml(data: PdfReportData, logoUrl?: string): string {
  return `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
      ${logoHtml(logoUrl)}
      <div style="font-size:14px;font-weight:700;color:${PDF.dk};margin-top:12px;">דוח בדק בית</div>
      <div style="font-size:10px;color:${PDF.lt};margin-top:4px;">${escapeHtml(data.property.projectName)} — דירה ${escapeHtml(data.property.apartmentNumber)}</div>
      <div style="font-size:10px;color:${PDF.lt};margin-top:2px;">${escapeHtml(data.inspector.companyName ?? data.inspector.name)}</div>
      <div style="width:120px;height:1px;background:${PDF.bdr};margin:12px auto;"></div>
      <div style="font-size:9px;color:${PDF.vlt};">הופק באמצעות inField · www.infield.co.il</div>
      <div style="font-size:8px;color:${PDF.vlt};margin-top:6px;">© ${new Date(data.reportDate).getFullYear() || new Date().getFullYear()} ${escapeHtml(data.inspector.companyName ?? data.inspector.name)}. כל הזכויות שמורות.</div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// ANNEX PAGES — photo gallery (reuses shared.ts annexPageHtml)
// adapted to use breadcrumb headers
// ═══════════════════════════════════════════════════════════

function annexPagesContent(defects: PdfDefect[], logoUrl?: string): string[] {
  const photosWithDefects: {
    url: string;
    caption?: string;
    defectNum: number;
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

  if (photosWithDefects.length === 0) return [];

  const pages: string[] = [];
  const photosPerPage = 6;

  for (let i = 0; i < photosWithDefects.length; i += photosPerPage) {
    const batch = photosWithDefects.slice(i, i + photosPerPage);
    pages.push(`
      ${breadcrumbHeaderHtml('\u05E0\u05E1\u05E4\u05D7 \u05EA\u05DE\u05D5\u05E0\u05D5\u05EA', logoUrl)}
      ${sectionTitle(`\u05E0\u05E1\u05E4\u05D7 \u05EA\u05DE\u05D5\u05E0\u05D5\u05EA${i > 0 ? ' (\u05D4\u05DE\u05E9\u05DA)' : ''}`)}
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
          </div>`
          )
          .join('')}
      </div>
    `);
  }

  return pages;
}

// ═══════════════════════════════════════════════════════════
// ORCHESTRATOR — Two-pass rendering
// ═══════════════════════════════════════════════════════════

function wrapPage(
  content: string,
  pageNum: number,
  totalPages: number,
  title: string,
  date: string,
  logoUrl?: string,
  isDraft?: boolean,
  isCover?: boolean
): string {
  const style = isCover
    ? 'display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;'
    : 'display:flex;flex-direction:column;';

  return `
    <div class="page" style="${style}">
      ${isDraft ? '<div class="watermark">\u05D8\u05D9\u05D5\u05D8\u05D4</div>' : ''}
      ${content}
      ${isCover ? '' : footerHtml(pageNum, title, date, logoUrl)}
    </div>`;
}

function extractUniqueStandards(
  defects: PdfDefect[],
  resolvedStandards?: Record<string, string>
): { ref: string; text: string }[] {
  const seen = new Set<string>();
  const result: { ref: string; text: string }[] = [];

  // Source 1: explicit standard_ref on each defect
  for (const d of defects) {
    if (d.standardRef && !seen.has(d.standardRef)) {
      seen.add(d.standardRef);
      result.push({ ref: d.standardRef, text: d.standardText ?? '' });
    }
  }

  // Source 2: standards parsed from free text and confirmed in DB
  // (resolvedStandards includes both explicit and parsed refs)
  if (resolvedStandards) {
    for (const [ref, title] of Object.entries(resolvedStandards)) {
      if (!seen.has(ref)) {
        seen.add(ref);
        result.push({ ref, text: title });
      }
    }
  }

  return result;
}

function computeTotalCostWithVat(
  defects: PdfDefect[],
  boqRates?: { batzam: number; supervision: number; vat: number }
): number {
  const rates = {
    batzam: boqRates?.batzam ?? 0.1,
    supervision: boqRates?.supervision ?? 0.1,
    vat: boqRates?.vat ?? 0.18,
  };
  const subtotal = defects.reduce((s, d) => {
    if (d.unitPrice && d.quantity) return s + d.unitPrice * d.quantity;
    return s + (d.cost ?? 0);
  }, 0);
  const batzam = subtotal * rates.batzam;
  const supervision = (subtotal + batzam) * rates.supervision;
  const preVat = subtotal + batzam + supervision;
  return preVat + preVat * rates.vat;
}

export function generateBedekBayitHtml(data: PdfReportData): string {
  const isDraft = data.status === 'draft';
  const title = 'דוח בדק בית';
  const formattedDate = formatDate(data.reportDate);
  const groups = groupDefectsByCategory(data.defects);
  const uniqueStandards = extractUniqueStandards(
    data.defects,
    data.resolvedStandards
  );
  const hasStandards = uniqueStandards.length > 0;
  const hasPhotos = data.defects.some(
    (d) => (d.photos?.length ?? 0) > 0 || (d.photoUrls?.length ?? 0) > 0
  );
  const totalCostWithVat = computeTotalCostWithVat(data.defects, data.boqRates);

  // --- Pass 1: Build all page content ---
  const pages: { content: string; title: string; isCover?: boolean }[] = [];

  // Page 1: Cover
  pages.push({
    content: coverPageHtml(data),
    title: 'שער',
    isCover: true,
  });

  // Page 2: TOC (placeholder — filled in pass 2)
  const tocIndex = pages.length;
  pages.push({
    content: '',
    title: 'תוכן עניינים',
  });

  // Page 3: Details (moved here — right after TOC)
  pages.push({
    content: detailsPageHtml(data, data.logoUrl),
    title: 'פרטי הבדיקה',
  });

  // Page 4: Executive Summary
  const execIndex = pages.length;
  pages.push({
    content: '',
    title: 'תקציר מנהלים',
  });

  // Page 5: Standards (conditional)
  if (hasStandards && data.showStandards !== false) {
    pages.push({
      content: standardsPageHtml(data, uniqueStandards, data.logoUrl),
      title: 'תקנים ומסמכי ייחוס',
    });
  }

  // Page 6: Tenant Rights + General Notes (merged)
  if (data.showTenantRights !== false) {
    pages.push({
      content: tenantRightsPageHtml(data, data.logoUrl),
      title: 'ידע כללי לדייר',
    });
  }

  // Pages N: Defects
  const defectStartPage = pages.length + 1;
  const defectPageContents = defectPagesContent(
    data.defects,
    groups,
    data.logoUrl
  );
  for (let i = 0; i < defectPageContents.length; i++) {
    pages.push({
      content: defectPageContents[i],
      title: `ממצאים ${i + 1}`,
    });
  }

  // BOQ
  pages.push({
    content: boqPageHtml(groups, data.boqRates, data.logoUrl),
    title: 'כתב כמויות',
  });

  // BOQ Notes
  pages.push({
    content: boqNotesPageHtml(data, groups, totalCostWithVat, data.logoUrl),
    title: 'הערות כספיות',
  });

  // Signatures (now includes disclaimer — option A)
  pages.push({
    content: signaturesPageHtml(data, data.logoUrl),
    title: 'חתימות ואישורים',
  });

  // Annex (conditional)
  if (hasPhotos) {
    const annexContents = annexPagesContent(data.defects, data.logoUrl);
    for (let i = 0; i < annexContents.length; i++) {
      pages.push({
        content: annexContents[i],
        title: `נספח${annexContents.length > 1 ? ` ${i + 1}` : ''}`,
      });
    }
  }

  // Back Cover (simplified — no inspector details, just branding)
  pages.push({ content: backCoverPageHtml(data, data.logoUrl), title: '' });

  // --- Pass 2: Fill TOC + Executive Summary with real page numbers ---
  const totalPages = pages.length;

  let sectionNum = 1;
  const tocEntries: TocEntry[] = [];
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    if (!p.title) continue;
    if (p.title.startsWith('ממצאים') && p.title !== 'ממצאים 1') continue;
    if (
      p.title.startsWith('נספח') &&
      p.title !== 'נספח' &&
      p.title !== 'נספח 1'
    )
      continue;

    tocEntries.push({
      num: String(sectionNum),
      title: p.title,
      page: i + 1,
      bold: true,
    });
    sectionNum++;
  }

  pages[tocIndex].content = tocLegendPageHtml(
    tocEntries,
    data.defects,
    data.logoUrl
  );

  pages[execIndex].content = execSummaryPageHtml(
    data,
    groups,
    defectStartPage,
    data.logoUrl
  );

  // --- Assemble HTML ---
  const assembledPages = pages
    .map((p, i) =>
      wrapPage(
        p.content,
        i + 1,
        totalPages,
        title,
        formattedDate,
        data.logoUrl,
        isDraft,
        p.isCover
      )
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${baseStyles()}${watermarkStyle(isDraft)}</style>
</head>
<body>
  ${assembledPages}
</body>
</html>`;
}
// ═══════════════════════════════════════════════════════════
