// --- Preview HTML Generator ---
// Generates HTML for in-app preview (WebView), NOT for PDF generation.
// Based on bedekBayit.ts + protocol.ts structure but simplified:
// - No page breaks, continuous scroll
// - Thumbnail images (120×90px, max 3 per defect)
// - System fonts (no embedded fonts)
// - Signature/stamp placeholders instead of real images
// - No QR code

import type { PdfReportData, PdfChecklistItem } from './types';
import {
  PDF,
  escapeHtml,
  formatCurrency,
  groupDefectsByCategory,
} from './shared';

// --- Preview-specific styles ---

function previewStyles(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Rubik', sans-serif;
      direction: rtl;
      background: #FEFDFB;
      color: ${PDF.md};
      font-size: 14px;
      line-height: 1.6;
      padding: 16px;
    }
    .report-header {
      background: linear-gradient(135deg, #0F4F2E, #1B7A44);
      color: white;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 16px;
    }
    .report-header h1 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
    .report-header .subtitle { font-size: 12px; opacity: 0.8; }
    .detail-card {
      background: #FEFDFB;
      border: 1px solid #F5EFE6;
      border-radius: 10px;
      padding: 14px;
      margin-bottom: 12px;
    }
    .detail-row {
      display: flex;
      gap: 6px;
      font-size: 13px;
      line-height: 2;
    }
    .detail-label { color: ${PDF.lt}; font-weight: 500; white-space: nowrap; }
    .detail-value { color: ${PDF.dk}; font-weight: 500; }
    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: ${PDF.dk};
      padding: 8px 0 4px;
      border-bottom: 2px solid #F5EFE6;
      margin: 16px 0 8px;
    }
    .category-header {
      background: #F0F7F4;
      color: #1B7A44;
      font-weight: 700;
      padding: 8px 12px;
      border-right: 3px solid #1B7A44;
      border-radius: 0 8px 8px 0;
      margin: 10px 0 6px;
      font-size: 14px;
    }
    .defect-row {
      border-bottom: 1px solid #F5EFE6;
      padding: 12px 0;
    }
    .defect-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      background: ${PDF.dk};
      color: white;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .defect-title { font-size: 13px; font-weight: 600; color: ${PDF.dk}; }
    .defect-location { font-size: 11px; color: ${PDF.lt}; margin-top: 2px; }
    .defect-cost {
      color: #C8952E;
      font-weight: 600;
      font-size: 12px;
      background: #FDF4E7;
      padding: 2px 8px;
      border-radius: 10px;
    }
    .defect-standard {
      margin: 4px 0;
      padding: 4px 8px;
      background: #FEFDFB;
      border-right: 2px solid #C8952E;
      font-size: 11px;
      color: ${PDF.md};
    }
    .defect-recommendation { font-size: 11px; color: ${PDF.md}; margin-top: 4px; }
    .defect-recommendation strong { color: #C8952E; }
    .defect-images {
      display: flex;
      gap: 6px;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .defect-image {
      width: 120px;
      height: 90px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #F5EFE6;
    }
    .defect-image-placeholder {
      width: 120px;
      height: 90px;
      border-radius: 4px;
      background: #F5EFE6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${PDF.lt};
      font-size: 10px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin: 8px 0;
    }
    .stats-grid.four { grid-template-columns: repeat(4, 1fr); }
    .stat-box {
      text-align: center;
      padding: 10px 4px;
      background: #FEFDFB;
      border-radius: 8px;
      border: 1px solid #F5EFE6;
    }
    .stat-num { font-size: 20px; font-weight: 700; color: ${PDF.dk}; }
    .stat-label { font-size: 10px; color: ${PDF.lt}; margin-top: 2px; }
    .cost-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin: 8px 0;
    }
    .cost-table th {
      background: ${PDF.dk};
      color: white;
      padding: 6px 10px;
      text-align: right;
      font-weight: 600;
    }
    .cost-table td { padding: 6px 10px; border-bottom: 1px solid #F5EFE6; }
    .cost-table .cat-row { background: #F0F7F4; font-weight: 600; color: #1B7A44; }
    .cost-table .total-row { background: ${PDF.dk}; color: white; font-weight: 700; }
    .cost-table .subtotal-row { background: #FEFDFB; font-weight: 700; border-top: 1px solid ${PDF.bdr}; }
    .signature-placeholder {
      height: 60px;
      border: 2px dashed #F5EFE6;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${PDF.lt};
      font-size: 12px;
      font-style: italic;
    }
    .signature-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 8px;
    }
    .signature-box { text-align: center; }
    .signature-label { font-size: 11px; color: ${PDF.lt}; margin-bottom: 6px; }
    .signature-name { font-size: 13px; color: ${PDF.dk}; font-weight: 600; margin-top: 6px; }
    .checklist-grid {
      border: 1px solid #F5EFE6;
      border-radius: 8px;
      padding: 12px;
      background: #FEFDFB;
    }
    .checklist-cat { font-size: 12px; font-weight: 700; color: ${PDF.dk}; border-bottom: 1px solid #F5EFE6; padding-bottom: 4px; margin-bottom: 4px; }
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 3px 0;
      font-size: 12px;
      color: ${PDF.md};
    }
    .status-ok { color: #1B7A44; font-weight: 700; }
    .status-defect { color: #b91c1c; font-weight: 700; }
    .status-partial { color: #92600a; font-weight: 700; }
    .status-skip { color: #A8A49D; }
    .status-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 4px;
      font-size: 12px;
      flex-shrink: 0;
    }
    .status-badge.ok { background: #ecfdf5; }
    .status-badge.defect { background: #fef2f2; }
    .status-badge.partial { background: #fefaed; }
    .legend {
      display: flex;
      gap: 12px;
      margin-top: 8px;
      padding-top: 6px;
      border-top: 1px solid #F5EFE6;
      font-size: 11px;
      color: ${PDF.lt};
    }
    .preview-footer {
      text-align: center;
      color: #A8A49D;
      font-size: 11px;
      border-top: 2px dashed #F5EFE6;
      padding: 12px;
      margin-top: 24px;
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      font-size: 60px;
      font-weight: 700;
      color: rgba(27, 122, 68, 0.06);
      letter-spacing: 10px;
      pointer-events: none;
      z-index: 0;
      white-space: nowrap;
    }
    .legal-text {
      font-size: 10px;
      color: ${PDF.lt};
      line-height: 1.6;
      padding: 8px 0;
    }
  `;
}

// --- Bedek Bayit Preview ---

function bedekBayitPreview(data: PdfReportData): string {
  const groups = groupDefectsByCategory(data.defects);
  const totalCost = data.defects.reduce((s, d) => s + (d.cost ?? 0), 0);
  const totalPhotos = data.defects.reduce(
    (s, d) => s + (d.photoUrls?.length ?? 0),
    0
  );

  let defectsHtml = '';
  for (const group of groups) {
    defectsHtml += `<div class="category-header">${escapeHtml(group.category)}</div>`;
    for (const d of group.defects) {
      const costStr = d.costLabel
        ? escapeHtml(d.costLabel)
        : d.cost
          ? formatCurrency(d.cost)
          : '';
      const photos = (d.photoUrls ?? []).slice(0, 3);

      defectsHtml += `<div class="defect-row">
        <div style="display:flex;align-items:flex-start;gap:8px;">
          <div class="defect-num">${d.number}</div>
          <div style="flex:1;">
            <div class="defect-title">${escapeHtml(d.title)}</div>
            <div class="defect-location">\u05DE\u05D9\u05E7\u05D5\u05DD: ${escapeHtml(d.location)}</div>
          </div>
          ${costStr ? `<span class="defect-cost">${costStr}</span>` : ''}
        </div>
        ${d.standardRef ? `<div class="defect-standard"><strong>${escapeHtml(d.standardRef)}</strong>${d.standardText ? ` \u2014 ${escapeHtml(d.standardText)}` : ''}</div>` : ''}
        ${d.recommendation ? `<div class="defect-recommendation"><strong>\u05D4\u05DE\u05DC\u05E6\u05D4: </strong>${escapeHtml(d.recommendation)}</div>` : ''}
        ${
          photos.length > 0
            ? `<div class="defect-images">${photos.map((url) => `<img class="defect-image" src="${url}" onerror="this.style.display='none'" />`).join('')}</div>`
            : ''
        }
      </div>`;
    }
  }

  // Cost table
  let costTableHtml = '';
  if (totalCost > 0) {
    let subtotal = 0;
    let costRows = '';
    for (const g of groups) {
      costRows += `<tr class="cat-row"><td colspan="3">${escapeHtml(g.category)}</td></tr>`;
      for (const d of g.defects) {
        const cost = d.cost ?? 0;
        subtotal += cost;
        const costStr = d.costLabel
          ? escapeHtml(d.costLabel)
          : cost.toLocaleString('he-IL');
        costRows += `<tr><td>${d.number}</td><td>${escapeHtml(d.recommendation ?? d.title)}</td><td style="text-align:left;font-weight:600;">${costStr}</td></tr>`;
      }
    }
    const vat = subtotal * 0.17;
    const total = subtotal + vat;

    costTableHtml = `
      <div class="section-title">\u05DB\u05EA\u05D1 \u05DB\u05DE\u05D5\u05D9\u05D5\u05EA</div>
      <table class="cost-table">
        <thead><tr><th>#</th><th>\u05EA\u05D9\u05D0\u05D5\u05E8</th><th style="text-align:left;">\u05E2\u05DC\u05D5\u05EA (\u20AA)</th></tr></thead>
        <tbody>
          ${costRows}
          <tr class="subtotal-row"><td></td><td>\u05E1\u05D4\u0022\u05DB \u05DC\u05E4\u05E0\u05D9 \u05DE\u05E2\u0022\u05DE</td><td style="text-align:left;">${subtotal.toLocaleString('he-IL')}</td></tr>
          <tr><td></td><td style="color:${PDF.lt};">\u05DE\u05E2\u0022\u05DE (17%)</td><td style="text-align:left;">${vat.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
          <tr class="total-row"><td></td><td>\u05E1\u05D4\u0022\u05DB \u05DB\u05D5\u05DC\u05DC \u05DE\u05E2\u0022\u05DE</td><td style="text-align:left;">${total.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
        </tbody>
      </table>`;
  }

  return `
    <div class="report-header">
      <h1>\u05D3\u05D5\u05D7 \u05D1\u05D3\u05E7 \u05D1\u05D9\u05EA</h1>
      <div class="subtitle">\u05D1\u05D3\u05D9\u05E7\u05EA \u05E7\u05D1\u05DC\u05D4 \u05DC\u05D3\u05D9\u05E8\u05D4 \u05D7\u05D3\u05E9\u05D4</div>
    </div>

    <div class="detail-card">
      <div class="detail-row"><span class="detail-label">\u05E4\u05E8\u05D5\u05D9\u05E7\u05D8:</span> <span class="detail-value">${escapeHtml(data.property.projectName)}</span></div>
      ${data.property.address ? `<div class="detail-row"><span class="detail-label">\u05DB\u05EA\u05D5\u05D1\u05EA:</span> <span class="detail-value">${escapeHtml(data.property.address)}</span></div>` : ''}
      <div class="detail-row"><span class="detail-label">\u05D3\u05D9\u05E8\u05D4:</span> <span class="detail-value">\u05D3\u05D9\u05E8\u05D4 ${escapeHtml(data.property.apartmentNumber)}${data.property.floor !== null ? `, \u05E7\u05D5\u05DE\u05D4 ${data.property.floor}` : ''}</span></div>
      <div class="detail-row"><span class="detail-label">\u05DE\u05D6\u05DE\u05D9\u05DF:</span> <span class="detail-value">${escapeHtml(data.client.name)}</span></div>
      <div class="detail-row"><span class="detail-label">\u05DE\u05E4\u05E7\u05D7:</span> <span class="detail-value">${escapeHtml(data.inspector.name)}</span></div>
      <div class="detail-row"><span class="detail-label">\u05EA\u05D0\u05E8\u05D9\u05DA:</span> <span class="detail-value">${escapeHtml(data.reportDate)}</span></div>
      <div class="detail-row"><span class="detail-label">\u05DE\u05E1\u05E4\u05E8 \u05D3\u05D5\u05D7:</span> <span class="detail-value">${escapeHtml(data.reportNumber)}</span></div>
    </div>

    <div class="section-title">\u05DE\u05DE\u05E6\u05D0\u05D9\u05DD</div>
    ${defectsHtml || '<div style="text-align:center;padding:20px;color:#A8A49D;">\u05D0\u05D9\u05DF \u05DE\u05DE\u05E6\u05D0\u05D9\u05DD \u05E2\u05D3\u05D9\u05D9\u05DF</div>'}

    ${costTableHtml}

    <div class="section-title">\u05E1\u05D9\u05DB\u05D5\u05DD</div>
    <div class="stats-grid">
      <div class="stat-box"><div class="stat-num">${data.defects.length}</div><div class="stat-label">\u05DE\u05DE\u05E6\u05D0\u05D9\u05DD</div></div>
      <div class="stat-box"><div class="stat-num">${totalPhotos}</div><div class="stat-label">\u05EA\u05DE\u05D5\u05E0\u05D5\u05EA</div></div>
      <div class="stat-box" style="background:#FDF4E7;"><div class="stat-num">${totalCost > 0 ? formatCurrency(totalCost) : '\u20AA0'}</div><div class="stat-label">\u05E2\u05DC\u05D5\u05EA \u05DB\u05D5\u05DC\u05DC\u05EA</div></div>
    </div>

    ${data.notes ? `<div class="section-title">\u05D4\u05E2\u05E8\u05D5\u05EA</div><div class="detail-card">${escapeHtml(data.notes)}</div>` : ''}

    <div class="section-title">\u05D7\u05EA\u05D9\u05DE\u05D4</div>
    <div style="text-align:center;">
      <div class="signature-placeholder">\u05D7\u05EA\u05D9\u05DE\u05D4 \u05EA\u05D5\u05D8\u05DE\u05E2 \u05D1-PDF</div>
      <div class="signature-name">${escapeHtml(data.inspector.name)}</div>
      <div style="font-size:11px;color:${PDF.lt};">\u05EA\u05D0\u05E8\u05D9\u05DA: ${escapeHtml(data.reportDate)}</div>
    </div>
  `;
}

// --- Protocol Mesira Preview ---

function protocolPreview(data: PdfReportData): string {
  const groups = groupDefectsByCategory(data.defects);
  const clItems = data.checklistItems ?? [];
  const clTotal = clItems.length;
  const clOk = clItems.filter((i) => i.status === 'ok').length;
  const clDefect = clItems.filter((i) => i.status === 'defect').length;
  const clPartial = clItems.filter((i) => i.status === 'partial').length;

  // Group checklist items by category
  const clCategories = new Map<string, PdfChecklistItem[]>();
  for (const item of clItems) {
    if (!clCategories.has(item.category)) clCategories.set(item.category, []);
    clCategories.get(item.category)!.push(item);
  }

  let checklistHtml = '';
  for (const [cat, items] of clCategories) {
    checklistHtml += `<div class="checklist-cat">${escapeHtml(cat)}</div>`;
    for (const item of items) {
      const sym =
        item.status === 'ok'
          ? '\u2713'
          : item.status === 'partial'
            ? '~'
            : '\u2717';
      const statusClass =
        item.status === 'ok'
          ? 'ok'
          : item.status === 'partial'
            ? 'partial'
            : 'defect';
      checklistHtml += `<div class="checklist-item">
        <span class="status-badge ${statusClass}"><span class="status-${statusClass}">${sym}</span></span>
        <span>${escapeHtml(item.text)}</span>
      </div>`;
    }
  }

  let defectsHtml = '';
  for (const group of groups) {
    defectsHtml += `<div class="category-header">${escapeHtml(group.category)}</div>`;
    for (const d of group.defects) {
      const photos = (d.photoUrls ?? []).slice(0, 3);
      defectsHtml += `<div class="defect-row">
        <div style="display:flex;align-items:flex-start;gap:8px;">
          <div style="font-size:12px;font-weight:600;color:${PDF.md};width:20px;flex-shrink:0;">${d.number}.</div>
          <div style="flex:1;">
            <div class="defect-title">${escapeHtml(d.title)}</div>
            <div class="defect-location">${escapeHtml(d.location)}</div>
          </div>
        </div>
        ${
          photos.length > 0
            ? `<div class="defect-images">${photos.map((url) => `<img class="defect-image" src="${url}" onerror="this.style.display='none'" />`).join('')}</div>`
            : ''
        }
      </div>`;
    }
  }

  return `
    <div class="report-header">
      <h1>\u05E4\u05E8\u05D5\u05D8\u05D5\u05E7\u05D5\u05DC \u05DE\u05E1\u05D9\u05E8\u05D4</h1>
      <div class="subtitle">\u05DE\u05E1\u05D9\u05E8\u05D4 \u05E8\u05D0\u05E9\u05D5\u05E0\u05D9\u05EA | \u05EA\u05D0\u05E8\u05D9\u05DA: ${escapeHtml(data.reportDate)} | \u05DE\u05E1\u05E4\u05E8 \u05D3\u05D5\u05D7: ${escapeHtml(data.reportNumber)}</div>
    </div>

    <div class="detail-card">
      <div class="detail-row"><span class="detail-label">\u05E4\u05E8\u05D5\u05D9\u05E7\u05D8:</span> <span class="detail-value">${escapeHtml(data.property.projectName)}</span></div>
      <div class="detail-row"><span class="detail-label">\u05D3\u05D9\u05E8\u05D4:</span> <span class="detail-value">\u05D3\u05D9\u05E8\u05D4 ${escapeHtml(data.property.apartmentNumber)}${data.property.floor !== null ? `, \u05E7\u05D5\u05DE\u05D4 ${data.property.floor}` : ''}</span></div>
      <div class="detail-row"><span class="detail-label">\u05D3\u05D9\u05D9\u05E8:</span> <span class="detail-value">${escapeHtml(data.client.name)}</span></div>
      <div class="detail-row"><span class="detail-label">\u05DE\u05E4\u05E7\u05D7:</span> <span class="detail-value">${escapeHtml(data.inspector.name)}</span></div>
    </div>

    ${
      clTotal > 0
        ? `
      <div class="section-title">\u05E6\u05F3\u05E7\u05DC\u05D9\u05E1\u05D8 \u05DE\u05E1\u05D9\u05E8\u05D4</div>
      <div class="checklist-grid">
        ${checklistHtml}
        <div class="legend">
          <span><span class="status-ok">\u2713</span> \u05EA\u05E7\u05D9\u05DF</span>
          <span><span class="status-defect">\u2717</span> \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF</span>
          <span><span class="status-partial">~</span> \u05EA\u05E7\u05D9\u05DF \u05D7\u05DC\u05E7\u05D9\u05EA</span>
          <span style="margin-right:auto;font-weight:600;color:${PDF.md};">${clTotal} \u05E4\u05E8\u05D9\u05D8\u05D9\u05DD | ${clOk} \u05EA\u05E7\u05D9\u05DF | ${clDefect} \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF | ${clPartial} \u05D7\u05DC\u05E7\u05D9</span>
        </div>
      </div>
    `
        : ''
    }

    <div class="section-title">\u05DE\u05DE\u05E6\u05D0\u05D9\u05DD</div>
    ${defectsHtml || '<div style="text-align:center;padding:20px;color:#A8A49D;">\u05D0\u05D9\u05DF \u05DE\u05DE\u05E6\u05D0\u05D9\u05DD</div>'}

    <div class="section-title">\u05E1\u05D9\u05DB\u05D5\u05DD</div>
    <div class="stats-grid four">
      <div class="stat-box"><div class="stat-num">${clTotal}</div><div class="stat-label">\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD</div></div>
      <div class="stat-box" style="background:#ecfdf5;"><div class="stat-num">${clOk}</div><div class="stat-label">\u05EA\u05E7\u05D9\u05DF</div></div>
      <div class="stat-box" style="background:#fef2f2;"><div class="stat-num">${clDefect}</div><div class="stat-label">\u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF</div></div>
      <div class="stat-box" style="background:#fefaed;"><div class="stat-num">${clPartial}</div><div class="stat-label">\u05D7\u05DC\u05E7\u05D9</div></div>
    </div>

    <div class="legal-text">
      \u05E4\u05E8\u05D5\u05D8\u05D5\u05E7\u05D5\u05DC \u05D6\u05D4 \u05E0\u05E2\u05E8\u05DA \u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05D7\u05D5\u05E7 \u05D4\u05DE\u05DB\u05E8 (\u05D3\u05D9\u05E8\u05D5\u05EA), \u05EA\u05E9\u05DC\u0022\u05D2-1973. \u05EA\u05E7\u05D5\u05E4\u05EA \u05D4\u05D1\u05D3\u05E7 \u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05E1\u05D5\u05D2 \u05D4\u05DC\u05D9\u05E7\u05D5\u05D9 (\u05D1\u05D9\u05DF \u05E9\u05E0\u05D4 \u05DC-7 \u05E9\u05E0\u05D9\u05DD). \u05EA\u05E7\u05D5\u05E4\u05EA \u05D0\u05D7\u05E8\u05D9\u05D5\u05EA 3 \u05E9\u05E0\u05D9\u05DD \u05DE\u05EA\u05D5\u05DD \u05EA\u05E7\u05D5\u05E4\u05EA \u05D4\u05D1\u05D3\u05E7. \u05D4\u05D3\u05D9\u05D9\u05E8 \u05DE\u05EA\u05D1\u05E7\u05E9 \u05DC\u05E9\u05DE\u05D5\u05E8 \u05DE\u05E1\u05DE\u05DA \u05D6\u05D4 \u05DB\u05D0\u05E1\u05DE\u05DB\u05EA\u05D0.
    </div>

    <div class="section-title">\u05D7\u05EA\u05D9\u05DE\u05D5\u05EA</div>
    <div class="signature-section">
      <div class="signature-box">
        <div class="signature-label">\u05DE\u05E4\u05E7\u05D7</div>
        <div class="signature-placeholder">\u05D7\u05EA\u05D9\u05DE\u05D4 \u05EA\u05D5\u05D8\u05DE\u05E2 \u05D1-PDF</div>
        <div class="signature-name">${escapeHtml(data.inspector.name)}</div>
      </div>
      <div class="signature-box">
        <div class="signature-label">\u05D3\u05D9\u05D9\u05E8</div>
        <div class="signature-placeholder">\u05D7\u05EA\u05D9\u05DE\u05D4 \u05EA\u05D5\u05D8\u05DE\u05E2 \u05D1-PDF</div>
        <div class="signature-name">${escapeHtml(data.client.name)}</div>
      </div>
    </div>
  `;
}

// --- Main export ---

export function generatePreviewHtml(data: PdfReportData): string {
  const isDraft = data.status === 'draft' || data.status === 'in_progress';
  const content =
    data.reportType === 'bedek_bait'
      ? bedekBayitPreview(data)
      : protocolPreview(data);

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <style>${previewStyles()}</style>
</head>
<body>
  ${isDraft ? '<div class="watermark">\u05D8\u05D9\u05D5\u05D8\u05D4</div>' : ''}
  ${content}
  <div class="preview-footer">\u05EA\u05E6\u05D5\u05D2\u05D4 \u05DE\u05E7\u05D3\u05D9\u05DE\u05D4 \u05D1\u05DC\u05D1\u05D3 \u2014 \u05DC\u05D0 \u05DE\u05E1\u05DE\u05DA \u05E8\u05E9\u05DE\u05D9</div>
</body>
</html>`;
}
