// --- Protocol Mesira PDF Template ---
// Two variants: round 1 (first delivery) and round 2+ (follow-up)
// Two modes: with checklist and without checklist

import type { PdfReportData, PdfChecklistItem } from './types';
import { REPORT_DEFAULTS } from '@infield/shared/src/constants/reportDefaults';
import {
  PDF,
  baseStyles,
  watermarkStyle,
  logoHtml,
  sectionTitle,
  subSectionTitle,
  escapeAttr,
  escapeHtml,
  signatureBoxHtml,
  groupDefectsByCategory,
  formatDate,
} from './shared';

// --- Helpers ---

const ROUND_LABELS: Record<number, string> = {
  1: 'ראשונה',
  2: 'שנייה',
  3: '��לישית',
  4: 'רביעית',
  5: 'חמישי��',
};

function roundLabel(round: number): string {
  return ROUND_LABELS[round] ?? `${round}`;
}

function protocolFooter(
  pageNum: number,
  totalPages: number,
  title: string,
  date: string,
  logoUrl?: string
): string {
  return `<div style="margin-top:auto;padding-top:8px;border-top:1px solid ${PDF.bdr};display:flex;justify-content:space-between;align-items:center;font-size:10px;color:${PDF.vlt};">
    ${logoHtml(logoUrl)}
    <span>עמוד ${pageNum} מתוך ${totalPages}</span>
    <span>${escapeHtml(title)} — ${date}</span>
  </div>`;
}

function protocolPhoto(url?: string): string {
  if (url) {
    return `<img src="${escapeAttr(url)}" style="width:80px;height:60px;border-radius:2px;object-fit:cover;border:1px solid ${PDF.bdrLt};" />`;
  }
  return `<div style="width:80px;height:60px;border-radius:2px;background:${PDF.bdrLt};display:flex;align-items:center;justify-content:center;border:1px solid ${PDF.bdrLt};flex-shrink:0;">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${PDF.bdr}" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
  </div>`;
}

function statusBadge(status: 'fixed' | 'open' | 'new'): string {
  const cfg = {
    fixed: { label: 'תוקן', bg: '#ecfdf5', color: PDF.accent, sym: '✓' },
    open: { label: 'נותר פתוח', bg: '#fef2f2', color: PDF.red, sym: '✗' },
    new: { label: 'ממצא חדש', bg: '#fef7e6', color: PDF.amber, sym: '★' },
  };
  const c = cfg[status];
  return `<span style="display:inline-flex;align-items:center;gap:3px;padding:1.5px 6px;border-radius:10px;background:${c.bg};color:${c.color};font-size:9px;font-weight:700;flex-shrink:0;">
    <span style="font-size:10px;">${c.sym}</span>${c.label}
  </span>`;
}

function miniHeader(text: string, logoUrl?: string): string {
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:4px;border-bottom:1px solid ${PDF.bdr};margin-bottom:4px;">
    <div style="font-size:11px;font-weight:600;color:${PDF.dk};">${escapeHtml(text)}</div>
    ${logoHtml(logoUrl)}
  </div>`;
}

// --- Checklist ---

function checklistItemHtml(item: PdfChecklistItem): string {
  const sym =
    item.status === 'ok' ? '✓' : item.status === 'partial' ? '~' : '✗';
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

  return `<div style="display:flex;align-items:center;gap:4px;padding:1.5px 0;font-size:10px;color:${PDF.md};line-height:1.3;">
    <span style="color:${color};font-weight:700;font-size:12px;width:16px;height:16px;border-radius:2px;background:${bg};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">${sym}</span>
    <span style="flex:1;">${escapeHtml(item.text)}</span>
    ${item.status !== 'ok' && item.refNumber ? `<span style="color:${PDF.red};font-size:8px;flex-shrink:0;">ראה ממצא #${item.refNumber}</span>` : ''}
  </div>`;
}

function checklistHtml(items: PdfChecklistItem[], isRound2: boolean): string {
  const clTotal = items.length;
  const clOk = items.filter((i) => i.status === 'ok').length;
  const clDefect = items.filter((i) => i.status === 'defect').length;
  const clPartial = items.filter((i) => i.status === 'partial').length;

  const categories = new Map<string, PdfChecklistItem[]>();
  for (const item of items) {
    if (!categories.has(item.category)) categories.set(item.category, []);
    categories.get(item.category)!.push(item);
  }

  const catEntries = Array.from(categories.entries());
  const midpoint = Math.ceil(catEntries.length / 2);

  function colHtml(entries: [string, PdfChecklistItem[]][]): string {
    return entries
      .map(
        ([cat, catItems], idx) =>
          `<div style="font-size:10px;font-weight:700;color:${PDF.dk};border-bottom:0.5px solid ${PDF.bdr};padding-bottom:2px;margin-bottom:2px;${idx > 0 ? 'margin-top:4px;' : ''}">${escapeHtml(cat)}</div>
        ${catItems.map((item) => checklistItemHtml(item)).join('')}`
      )
      .join('');
  }

  const title = isRound2 ? 'צ׳קליסט מסירה — בדיקה חוזרת' : 'צ׳קליסט מסירה';

  return `${sectionTitle(title)}
    <div style="border:1px solid ${PDF.bdr};border-radius:2px;padding:6px 8px;background:${PDF.bg};">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 20px;">
        <div>${colHtml(catEntries.slice(0, midpoint))}</div>
        <div>${colHtml(catEntries.slice(midpoint))}</div>
      </div>
      <div style="margin-top:5px;padding-top:3px;border-top:0.5px solid ${PDF.bdr};display:flex;justify-content:space-between;align-items:center;font-size:9px;color:${PDF.lt};">
        <div style="display:flex;gap:8px;">
          <span><span style="color:${PDF.accent};font-weight:700;">✓</span> תקין</span>
          <span><span style="color:${PDF.red};font-weight:700;">✗</span> לא תקין</span>
          <span><span style="color:${PDF.amber};font-weight:700;">~</span> תקין חלקית</span>
        </div>
        <span style="font-weight:600;color:${PDF.md};">${clTotal} פריטים | ${clOk} תקין | ${clDefect} לא תקין | ${clPartial} חלקי</span>
      </div>
    </div>`;
}

// --- Defect row ---

function defectRowHtml(
  defect: {
    number: number;
    title: string;
    location: string;
    recommendation?: string;
    note?: string;
    photoUrls?: string[];
    roundStatus?: 'fixed' | 'open' | 'new';
  },
  isRound2: boolean
): string {
  const photos = defect.photoUrls ?? [];
  const isFixed = defect.roundStatus === 'fixed';

  let html = `<div style="padding:4px 0 5px;border-bottom:0.5px solid ${PDF.bdrLt};${isFixed ? 'opacity:0.72;' : ''}">
    <div style="display:flex;align-items:flex-start;gap:6px;">
      <div style="font-size:11px;font-weight:600;color:${PDF.md};width:18px;text-align:center;flex-shrink:0;margin-top:1px;">${defect.number}.</div>
      <div style="flex:1;">
        <div style="display:flex;align-items:flex-start;gap:6px;justify-content:space-between;">
          <div style="font-size:11px;font-weight:500;color:${PDF.dk};line-height:1.4;flex:1;${isFixed ? 'text-decoration:line-through;text-decoration-color:' + PDF.lt + ';' : ''}"><span style="font-size:9px;color:${PDF.lt};font-weight:400;">תיאור ממצא: </span>${escapeHtml(defect.title)}</div>
          ${isRound2 && defect.roundStatus ? statusBadge(defect.roundStatus) : ''}
        </div>
        <div style="font-size:9px;color:${PDF.lt};margin-top:1px;"><span style="font-weight:500;">מיקום: </span>${escapeHtml(defect.location)}</div>`;

  if (defect.recommendation) {
    html += `<div style="font-size:9px;color:${PDF.accent};margin-top:2px;"><span style="font-weight:500;">המלצה: </span>${escapeHtml(defect.recommendation)}</div>`;
  }

  if (defect.note) {
    html += `<div style="font-size:9px;color:${PDF.md};margin-top:2px;"><span style="color:${PDF.lt};font-weight:500;">הערה: </span>${escapeHtml(defect.note)}</div>`;
  }

  html += `</div></div>`;

  if (photos.length > 0) {
    html += `<div style="display:flex;gap:3px;margin-top:4px;margin-right:24px;padding-top:4px;border-top:0.5px solid ${PDF.bdrLt};">`;
    for (const url of photos.slice(0, 4)) {
      html += protocolPhoto(url);
    }
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}

// --- Cover Page ---

function coverPageHtml(data: PdfReportData, _totalPages: number): string {
  const round = data.roundNumber ?? 1;
  const isRound2 = round >= 2;
  const rLabel = roundLabel(round);
  const title = `מסירה ${rLabel}`;
  const badgeBg = isRound2 ? PDF.accent : PDF.dk;
  const dotColor = isRound2 ? '#fff' : PDF.accent;
  const accentBarColor = isRound2 ? PDF.accent : PDF.accent;

  const metaRows: [string, string][] = [
    ['פרויקט', data.property.projectName],
    ['כתובת', data.property.address ?? ''],
    [
      'דירה',
      `דירה ${data.property.apartmentNumber}${data.property.floor !== null && data.property.floor !== undefined ? `, קומה ${data.property.floor}` : ''}`,
    ],
    ['דייר', data.client.name],
    ['תאריך מסירה', formatDate(data.reportDate)],
  ];

  if (isRound2 && data.previousDeliveryDate) {
    metaRows.push(['מסירה קודמת', formatDate(data.previousDeliveryDate)]);
  }

  metaRows.push([
    'מבצע המסירה',
    `${data.inspector.name}${data.inspector.companyName ? ' — ' + data.inspector.companyName : ''}`,
  ]);

  const descriptionText = isRound2
    ? 'פרוטוקול זה מתעד את מסירת הדירה הסופית לדייר, לרבות סטטוס הממצאים, מסירת מפתחות והצהרת קבלת הדירה.'
    : 'פרוטוקול זה מתעד את מצב הדירה במעמד מסירתה הראשונית לדייר, לרבות ממצאים שנמצאו ויטופלו טרם המסירה הסופית.';

  return `<div class="page" style="display:flex;flex-direction:column;padding:0;">
    <div style="padding:22px 28px 18px;border-bottom:1px solid ${PDF.bdr};display:flex;justify-content:space-between;align-items:center;">
      ${data.logoUrl ? `<img src="${escapeAttr(data.logoUrl)}" style="max-width:110px;max-height:38px;object-fit:contain;" />` : `<div style="width:110px;height:38px;border:1.5px dashed ${PDF.bdr};border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:10px;color:${PDF.vlt};background:${PDF.bg};">לוגו החברה</div>`}
      <div style="text-align:left;font-size:9px;color:${PDF.lt};letter-spacing:.3px;line-height:1.6;">
        <div>מסמך רשמי</div>
        <div style="color:${PDF.vlt};">מס׳ ${escapeHtml(data.reportNumber)}</div>
      </div>
    </div>

    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 36px;position:relative;">
      <div style="position:absolute;right:0;top:18%;bottom:18%;width:4px;background:${PDF.dk};"></div>
      <div style="position:absolute;right:0;top:18%;width:4px;height:60px;background:${accentBarColor};"></div>

      <div style="font-size:12px;color:${PDF.lt};letter-spacing:3px;font-weight:500;margin-bottom:10px;">INFIELD — מסמך מסירה</div>
      <div style="font-size:42px;font-weight:700;color:${PDF.dk};letter-spacing:-1.2px;line-height:1;">פרוטוקול</div>
      <div style="font-size:42px;font-weight:300;color:${PDF.dk};letter-spacing:-1.2px;line-height:1;margin-top:2px;">מסירה</div>

      <div style="margin-top:18px;display:inline-flex;align-items:center;gap:8px;padding:5px 14px 5px 10px;background:${badgeBg};color:#fff;border-radius:2px;align-self:flex-start;">
        <span style="width:6px;height:6px;border-radius:50%;background:${dotColor};"></span>
        <span style="font-size:12px;font-weight:600;letter-spacing:.4px;">${escapeHtml(title)}</span>
      </div>

      <div style="margin-top:30px;display:grid;grid-template-columns:auto 1fr;gap:10px 24px;max-width:380px;font-size:12px;line-height:1.5;">
        ${metaRows
          .filter(([, v]) => v)
          .map(
            ([k, v]) =>
              `<div style="font-size:9px;color:${PDF.lt};letter-spacing:.5px;font-weight:500;padding-top:3px;border-bottom:0.5px solid ${PDF.bdrLt};padding-bottom:3px;">${escapeHtml(k)}</div>
               <div style="font-size:12px;color:${PDF.dk};font-weight:500;padding-bottom:3px;border-bottom:0.5px solid ${PDF.bdrLt};">${escapeHtml(v)}</div>`
          )
          .join('')}
      </div>
    </div>

    <div style="padding:16px 28px 22px;border-top:1px solid ${PDF.bdr};background:${PDF.bg};display:flex;justify-content:space-between;align-items:flex-end;gap:16px;">
      <div style="font-size:9px;color:${PDF.lt};line-height:1.5;max-width:300px;">${escapeHtml(descriptionText)}</div>
      <div style="text-align:left;">
        <div style="font-size:9px;color:${PDF.vlt};letter-spacing:.4px;margin-bottom:2px;">הופק באמצעות</div>
        <div style="font-size:12px;font-weight:700;color:${PDF.dk};letter-spacing:.3px;">inField</div>
      </div>
    </div>
  </div>`;
}

// --- Details Page ---

function detailsPageHtml(
  data: PdfReportData,
  pageNum: number,
  totalPages: number
): string {
  const round = data.roundNumber ?? 1;
  const isRound2 = round >= 2;
  const rLabel = roundLabel(round);
  const pdfTitle = `פרוטוקול מסירה ${rLabel}`;
  const date = formatDate(data.reportDate);

  const hasChecklist = (data.checklistItems ?? []).length > 0;

  // Build compact detail pairs (mockup style: single box, flex-wrap)
  const detailPairs: [string, string][] = [];
  detailPairs.push(['פרויקט:', data.property.projectName]);
  if (data.property.address)
    detailPairs.push(['כתובת:', data.property.address]);
  const aptParts = [`דירה ${data.property.apartmentNumber}`];
  if (data.property.floor !== null && data.property.floor !== undefined)
    aptParts.push(`קומה ${data.property.floor}`);
  detailPairs.push(['דירה:', aptParts.join(', ')]);
  if (data.property.area)
    detailPairs.push(['שטח:', `${data.property.area} מ"ר`]);

  const tenantParts = [data.client.name];
  if (data.client.idNumber) tenantParts.push(`ת.ז. ${data.client.idNumber}`);
  if (data.client.phone) tenantParts.push(data.client.phone);
  if (data.client.email) tenantParts.push(data.client.email);
  detailPairs.push(['דייר:', tenantParts.join(' | ')]);

  const inspectorParts = [data.inspector.name];
  if (data.inspector.professionalTitle)
    inspectorParts.push(data.inspector.professionalTitle);
  const inspectorValue = inspectorParts.join(', ');
  const inspectorExtra: string[] = [];
  if (data.inspector.companyName)
    inspectorExtra.push(data.inspector.companyName);
  if (data.inspector.phone) inspectorExtra.push(data.inspector.phone);
  const fullInspector =
    inspectorExtra.length > 0
      ? `${inspectorValue} — ${inspectorExtra.join(' — ')}`
      : inspectorValue;
  detailPairs.push(['מבצע המסירה:', fullInspector]);

  // Running header
  const roundBadgeBg = isRound2 ? PDF.accent : PDF.dk;
  const header = `<div style="border-bottom:2px solid ${PDF.dk};padding-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
    <div style="display:flex;align-items:center;gap:8px;">
      ${data.logoUrl ? `<img src="${escapeAttr(data.logoUrl)}" style="max-width:70px;max-height:22px;object-fit:contain;" />` : `<div style="width:70px;height:22px;border:1px dashed ${PDF.bdr};border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:9px;color:${PDF.vlt};background:${PDF.bg};">לוגו החברה</div>`}
      <div style="width:1px;height:22px;background:${PDF.bdr};"></div>
      <div>
        <div style="font-size:12px;font-weight:700;color:${PDF.dk};">פרוטוקול מסירה</div>
        <div style="font-size:9px;color:${PDF.lt};margin-top:1px;">${escapeHtml(data.property.projectName)} — די��ה ${escapeHtml(data.property.apartmentNumber)} · מסירה ${escapeHtml(rLabel)}</div>
      </div>
    </div>
    <div style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;background:${roundBadgeBg};color:#fff;font-size:9px;font-weight:600;border-radius:2px;">
      <span style="width:4px;height:4px;border-radius:50%;background:${isRound2 ? '#fff' : PDF.accent};"></span>
      מסירה ${escapeHtml(rLabel)}
    </div>
  </div>`;

  const detailsHtml = detailPairs
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<div style="display:flex;gap:3px;"><span style="color:${PDF.lt};">${escapeHtml(k)}</span><span style="color:${PDF.dk};font-weight:500;">${escapeHtml(v)}</span></div>`
    )
    .join('');

  let content = `${header}
    <div style="margin-top:4px;padding:4px 8px;border:1px solid ${PDF.bdr};border-radius:2px;font-size:9px;display:flex;flex-wrap:wrap;gap:2px 14px;background:${PDF.bg};">${detailsHtml}</div>`;

  if (hasChecklist) {
    content += checklistHtml(data.checklistItems!, isRound2);
  }

  if (!hasChecklist) {
    const firstDefects = data.defects.slice(0, 2);
    if (firstDefects.length > 0) {
      content += sectionTitle('ממצאים');
      content += `<div style="font-size:10px;color:${PDF.lt};margin-bottom:4px;">הממצאים להלן תועדו במהלך סיור המסירה ונדרשים לתיקון טרם המסירה הסופית.</div>`;
      const groups = groupDefectsByCategory(firstDefects);
      for (const group of groups) {
        content += subSectionTitle(escapeHtml(group.category));
        for (const d of group.defects) {
          content += defectRowHtml(d, isRound2);
        }
      }
    }
  }

  return `<div class="page" style="display:flex;flex-direction:column;">
    ${content}
    ${protocolFooter(pageNum, totalPages, pdfTitle, date, data.logoUrl)}
  </div>`;
}

// --- Defects Page ---

function defectsPageHtml(
  data: PdfReportData,
  defects: PdfReportData['defects'],
  pageNum: number,
  totalPages: number,
  isFirst: boolean
): string {
  const round = data.roundNumber ?? 1;
  const isRound2 = round >= 2;
  const rLabel = roundLabel(round);
  const pdfTitle = `פרוטוקול מסירה ${rLabel}`;
  const date = formatDate(data.reportDate);
  const headerText = `${pdfTitle} | ${data.property.projectName} | דירה ${data.property.apartmentNumber}`;

  const sTitle = isFirst
    ? isRound2
      ? 'ממצאים — בדיקה חוזרת'
      : 'ממצאים'
    : isRound2
      ? 'ממצאים — בדיקה חוזרת (המשך)'
      : 'ממצאים (המשך)';

  let intro = '';
  if (isFirst) {
    intro = isRound2
      ? `<div style="font-size:10px;color:${PDF.lt};margin-bottom:4px;">בדיקה חוזרת של הממצאים ממסירה קודמת — כולל ממצאים שטופלו, נותרו פתוחים, וממצאים חדשים שנמצאו.</div>`
      : `<div style="font-size:10px;color:${PDF.lt};margin-bottom:4px;">הממצאים להלן תועדו במהלך סיור המסירה ונדרשים לתיקון טרם המסירה הסופית.</div>`;
  }

  let statusLegend = '';
  if (isFirst && isRound2) {
    statusLegend = `<div style="display:flex;gap:10px;padding:4px 8px;background:${PDF.bg};border:1px solid ${PDF.bdrLt};border-radius:2px;font-size:9px;color:${PDF.md};margin-bottom:4px;">
      <span><span style="color:${PDF.accent};font-weight:700;">✓</span> תוקן</span>
      <span><span style="color:${PDF.red};font-weight:700;">✗</span> נותר פ��וח</span>
      <span><span style="color:${PDF.amber};font-weight:700;">★</span> ממצא חדש</span>
    </div>`;
  }

  const groups = groupDefectsByCategory(defects);
  let defectsHtml = '';
  for (const group of groups) {
    defectsHtml += subSectionTitle(escapeHtml(group.category));
    for (const d of group.defects) {
      defectsHtml += defectRowHtml(d, isRound2);
    }
  }

  return `<div class="page" style="display:flex;flex-direction:column;">
    ${miniHeader(headerText, data.logoUrl)}
    ${sectionTitle(sTitle)}
    ${intro}
    ${statusLegend}
    ${defectsHtml}
    ${protocolFooter(pageNum, totalPages, pdfTitle, date, data.logoUrl)}
  </div>`;
}

// --- Summary Page (Round 1) ---

function summaryRound1Html(
  data: PdfReportData,
  pageNum: number,
  totalPages: number
): string {
  const round = data.roundNumber ?? 1;
  const rLabel = roundLabel(round);
  const pdfTitle = `פרוטוקול מסירה ${rLabel}`;
  const date = formatDate(data.reportDate);
  const headerText = `${pdfTitle} | ${data.property.projectName} | דירה ${data.property.apartmentNumber}`;

  const totalDefects = data.defects.length;
  const defectCount = data.defects.filter(
    (d) => !d.roundStatus || d.roundStatus !== 'fixed'
  ).length;
  const partialCount = 0;

  const isCompleted = data.status === 'completed' || data.status === 'sent';
  const statusBg = isCompleted ? '#ecfdf5' : '#fef2f2';
  const statusColor = isCompleted ? PDF.accent : PDF.red;
  const statusText = isCompleted
    ? 'המסירה הושלמה.'
    : 'הכנת הדירה תתבצע בהתאם לפרוטוקול המסירה וחוק המכר, לאחר ביצוע התיקונים תיקבע מסירה שנייה (סופית) לקבלת הדירה על ידי הדייר.';

  const termsText = (data.protocolTerms ?? REPORT_DEFAULTS.protocol_terms)
    .replace('הדייר מתבקש לשמור מסמך זה כאסמכתא.', '')
    .trim();

  let html = `<div class="page" style="display:flex;flex-direction:column;">
    ${miniHeader(headerText, data.logoUrl)}

    ${sectionTitle('סיכום')}
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin:3px 0 6px;">
      <div style="text-align:center;padding:6px 3px;background:${PDF.bg};border-radius:3px;border:1px solid ${PDF.bdrLt};">
        <div style="font-size:18px;font-weight:700;color:${PDF.dk};">${totalDefects}</div>
        <div style="font-size:9px;color:${PDF.lt};margin-top:1px;">סה״כ ממצאים</div>
      </div>
      <div style="text-align:center;padding:6px 3px;background:#fef2f2;border-radius:3px;border:1px solid ${PDF.bdrLt};">
        <div style="font-size:18px;font-weight:700;color:${PDF.dk};">${defectCount}</div>
        <div style="font-size:9px;color:${PDF.lt};margin-top:1px;">דורש תיקון</div>
      </div>
      <div style="text-align:center;padding:6px 3px;background:#fefaed;border-radius:3px;border:1px solid ${PDF.bdrLt};">
        <div style="font-size:18px;font-weight:700;color:${PDF.dk};">${partialCount}</div>
        <div style="font-size:9px;color:${PDF.lt};margin-top:1px;">תיקון חלקי</div>
      </div>
    </div>

    ${sectionTitle('סטטוס המסירה')}
    <div style="padding:6px 10px;border:1px solid ${PDF.bdr};border-radius:2px;background:${statusBg};font-size:10px;color:${PDF.md};line-height:1.6;">
      <span style="font-weight:700;color:${statusColor};">${escapeHtml(statusText)}</span>
    </div>`;

  if (data.tenantNotes) {
    html += `${sectionTitle('הערות הדייר')}
      <div style="padding:6px 10px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};min-height:32px;font-size:10px;color:${PDF.md};line-height:1.6;">${escapeHtml(data.tenantNotes)}</div>`;
  }

  if (data.showProtocolTerms !== false && termsText) {
    html += `${sectionTitle('תנאים ואחריות')}
      <div style="font-size:9px;color:${PDF.lt};line-height:1.5;padding:2px 0;">${escapeHtml(termsText)}</div>`;
  }

  html += signaturesHtml(data, date);

  html += protocolFooter(pageNum, totalPages, pdfTitle, date, data.logoUrl);
  html += `</div>`;
  return html;
}

// --- Summary Page (Round 2+) ---

function summaryRound2Html(
  data: PdfReportData,
  pageNum: number,
  totalPages: number
): string {
  const round = data.roundNumber ?? 2;
  const rLabel = roundLabel(round);
  const pdfTitle = `פרוטוקול מסירה ${rLabel}`;
  const date = formatDate(data.reportDate);
  const headerText = `${pdfTitle} | ${data.property.projectName} | דירה ${data.property.apartmentNumber}`;

  const totalDefects = data.defects.length;
  const fixedCount = data.defects.filter(
    (d) => d.roundStatus === 'fixed'
  ).length;
  const openCount = data.defects.filter((d) => d.roundStatus === 'open').length;
  const newCount = data.defects.filter((d) => d.roundStatus === 'new').length;

  let html = `<div class="page" style="display:flex;flex-direction:column;">
    ${miniHeader(headerText, data.logoUrl)}

    ${sectionTitle('סיכום בדיקה חוזרת')}
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:5px;margin:3px 0 6px;">
      <div style="text-align:center;padding:5px 3px;background:${PDF.bg};border-radius:3px;border:1px solid ${PDF.bdrLt};">
        <div style="font-size:17px;font-weight:700;color:${PDF.dk};">${totalDefects}</div>
        <div style="font-size:9px;color:${PDF.lt};margin-top:1px;">סה״כ</div>
      </div>
      <div style="text-align:center;padding:5px 3px;background:#ecfdf5;border-radius:3px;border:1px solid ${PDF.bdrLt};">
        <div style="font-size:17px;font-weight:700;color:${PDF.dk};">${fixedCount}</div>
        <div style="font-size:9px;color:${PDF.lt};margin-top:1px;">תוקנו</div>
      </div>
      <div style="text-align:center;padding:5px 3px;background:#fef2f2;border-radius:3px;border:1px solid ${PDF.bdrLt};">
        <div style="font-size:17px;font-weight:700;color:${PDF.dk};">${openCount}</div>
        <div style="font-size:9px;color:${PDF.lt};margin-top:1px;">נותרו פתוחים</div>
      </div>
      <div style="text-align:center;padding:5px 3px;background:#fef7e6;border-radius:3px;border:1px solid ${PDF.bdrLt};">
        <div style="font-size:17px;font-weight:700;color:${PDF.dk};">${newCount}</div>
        <div style="font-size:9px;color:${PDF.lt};margin-top:1px;">חדשים</div>
      </div>
    </div>`;

  // Key delivery
  if (data.keyDelivery && data.keyDelivery.length > 0) {
    html += `${sectionTitle('מסירת מפתחות ואמצעי גישה')}
      <div style="border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};padding:6px 10px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 14px;">
          ${data.keyDelivery
            .map(
              (k) =>
                `<div style="display:flex;align-items:center;gap:6px;padding:2px 0;border-bottom:0.5px dashed ${PDF.bdrLt};font-size:10px;">
                  <span style="width:12px;height:12px;border:1px solid ${PDF.accent};border-radius:2px;background:${PDF.accent};display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:700;flex-shrink:0;">✓</span>
                  <span style="flex:1;color:${PDF.md};">${escapeHtml(k.label)}</span>
                  <span style="color:${PDF.dk};font-weight:600;">${escapeHtml(k.value)}</span>
                </div>`
            )
            .join('')}
        </div>
        <div style="margin-top:5px;padding-top:4px;border-top:0.5px solid ${PDF.bdr};font-size:9px;color:${PDF.lt};">
          כל המפתחות ואמצעי הגישה המפורטים נמסרו לדייר במעמד זה.
        </div>
      </div>`;
  }

  // Acceptance declaration
  if (data.tenantAcknowledgment) {
    html += `${sectionTitle('הצהרת קבלת הדירה')}
      <div style="padding:8px 12px;border:1.5px solid ${PDF.dk};border-radius:2px;background:#FBF9F2;font-size:10px;color:${PDF.dk};line-height:1.7;">
        ${escapeHtml(data.tenantAcknowledgment)}
      </div>`;
  }

  if (data.tenantNotes) {
    html += `${sectionTitle('הערות הדייר')}
      <div style="padding:6px 10px;border:1px solid ${PDF.bdr};border-radius:2px;background:${PDF.bg};min-height:32px;font-size:10px;color:${PDF.md};line-height:1.6;">${escapeHtml(data.tenantNotes)}</div>`;
  }

  html += signaturesHtml(data, date);

  html += protocolFooter(pageNum, totalPages, pdfTitle, date, data.logoUrl);
  html += `</div>`;
  return html;
}

// --- Signatures (shared) ---

function signaturesHtml(data: PdfReportData, date: string): string {
  let html = sectionTitle('חתימות');
  html += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:3px;">
    ${signatureBoxHtml(
      'מבצע המסירה',
      escapeHtml(data.inspector.name),
      date,
      data.signatures?.find((s) => s.signerType === 'inspector')?.imageUrl
    )}
    ${signatureBoxHtml(
      'הדייר',
      escapeHtml(data.client.name),
      date,
      data.signatures?.find((s) => s.signerType === 'tenant')?.imageUrl
    )}
  </div>`;

  if (data.stampUrl) {
    html += `<div style="margin-top:10px;text-align:center;">
      <div style="display:inline-block;">
        <div style="width:74px;height:74px;border:1.5px dashed ${PDF.bdr};border-radius:50%;display:flex;align-items:center;justify-content:center;overflow:hidden;">
          <img src="${escapeAttr(data.stampUrl)}" style="max-width:68px;max-height:68px;object-fit:contain;" />
        </div>
        <div style="font-size:9px;color:${PDF.lt};margin-top:3px;">חותמת</div>
      </div>
    </div>`;
  }

  return html;
}

// --- Main Export ---

export function generateProtocolHtml(data: PdfReportData): string {
  const isDraft = data.status === 'draft';
  const round = data.roundNumber ?? 1;
  const isRound2 = round >= 2;
  const hasChecklist = (data.checklistItems ?? []).length > 0;

  const page1DefectsMax = hasChecklist ? 0 : 2;
  const defectsPerPage = 5;
  const defectsForPages = data.defects.slice(page1DefectsMax);
  const defectPageCount =
    defectsForPages.length > 0
      ? Math.ceil(defectsForPages.length / defectsPerPage)
      : 0;
  const totalPages = 3 + defectPageCount;

  let pageNum = 1;

  // Cover
  const cover = coverPageHtml(data, totalPages);
  pageNum++;

  // Details page
  const details = detailsPageHtml(data, pageNum, totalPages);
  pageNum++;

  // Defect pages
  const defectPages: string[] = [];
  for (let i = 0; i < defectsForPages.length; i += defectsPerPage) {
    const batch = defectsForPages.slice(i, i + defectsPerPage);
    defectPages.push(
      defectsPageHtml(data, batch, pageNum, totalPages, i === 0)
    );
    pageNum++;
  }

  // Summary page
  const summary = isRound2
    ? summaryRound2Html(data, pageNum, totalPages)
    : summaryRound1Html(data, pageNum, totalPages);

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${baseStyles()}${watermarkStyle(isDraft)}</style>
</head>
<body>
  ${isDraft ? '<div class="watermark">טיוטה</div>' : ''}
  ${cover}
  ${details}
  ${defectPages.join('')}
  ${summary}
</body>
</html>`;
}
