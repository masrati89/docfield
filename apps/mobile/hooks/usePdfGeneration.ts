import { useCallback, useRef, useState } from 'react';
import * as Print from 'expo-print';
import { Platform, Share } from 'react-native';

import { supabase } from '@/lib/supabase';
import { generateBedekBayitHtml, generateProtocolHtml } from '@/lib/pdf';
import type {
  PdfReportData,
  PdfDefect,
  PdfSignature,
  PdfChecklistItem,
  PdfKeyDelivery,
} from '@/lib/pdf';
import type { AnnotationLayer } from '@/lib/annotations';
import { extractStandardRefsFromText } from '@infield/shared';
import { CHECKLIST_ROOMS } from '@/components/checklist/constants';
import { mapToChecklistRooms } from '@/hooks/useChecklistTemplate';
import type { ChecklistRoom } from '@/components/checklist/types';

// Lazy-load renderAnnotationsToImage to avoid loading @shopify/react-native-skia on web

const getRenderAnnotations = ():
  | ((uri: string, layer: AnnotationLayer) => Promise<string>)
  | null => {
  if (Platform.OS === 'web') return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/lib/annotations/renderAnnotations')
    .renderAnnotationsToImage;
};

// --- Types ---

interface UsePdfGenerationResult {
  isGenerating: boolean;
  isSharing: boolean;
  generatePdf: (reportId: string) => Promise<string | null>;
  sharePdf: (reportId: string, existingPdfUri?: string) => Promise<void>;
}

function deriveRoundStatus(
  d: Record<string, unknown>
): 'fixed' | 'open' | 'new' | undefined {
  const sourceId = d.source_defect_id as string | null;
  const reviewStatus = d.review_status as string | null;
  if (!sourceId && !reviewStatus) return undefined;
  if (sourceId) {
    return reviewStatus === 'fixed' ? 'fixed' : 'open';
  }
  return 'new';
}

// --- Fetcher ---

async function fetchFullReportData(reportId: string): Promise<PdfReportData> {
  // Iron Rule: read ONLY from snapshot columns on delivery_reports.
  // Never join live users/organizations — reports are legal documents
  // and must render from data frozen at report creation time.
  const { data: report, error: reportError } = await supabase
    .from('delivery_reports')
    .select(
      `id, report_type, status, tenant_name, tenant_phone, report_date, notes,
       report_number, client_name, client_phone, client_email, client_id_number,
       property_type, property_area, property_floor, property_description,
       property_project_name, property_project_address,
       property_building_name, property_apartment_number,
       report_content, weather_conditions, contractor_name, contractor_phone,
       inspector_full_name_snapshot, inspector_license_number_snapshot,
       inspector_professional_title_snapshot, inspector_education_snapshot,
       inspector_experience_snapshot, inspector_company_name_snapshot,
       inspector_signature_url_snapshot, inspector_stamp_url_snapshot,
       inspector_phone_snapshot, inspector_email_snapshot,
       organization_name_snapshot, organization_logo_url_snapshot,
       organization_legal_name_snapshot, organization_tax_id_snapshot,
       organization_address_snapshot, organization_phone_snapshot,
       organization_email_snapshot, organization_legal_disclaimer_snapshot,
       org_boq_batzam_rate_snapshot, org_boq_supervision_rate_snapshot,
       org_boq_vat_rate_snapshot, round_number, checklist_state,
       checklist_template_id, show_severity`
    )
    .eq('id', reportId)
    .single();

  if (reportError || !report) throw new Error('שגיאה בטעינת נתוני הדוח');

  const reportRecord = report as Record<string, unknown>;

  // Fetch defects with photos
  const { data: defectsData, error: defectsError } = await supabase
    .from('defects')
    .select(
      `id, description, room, category, severity, status, sort_order,
       standard_ref, standard_section, recommendation, notes, cost, cost_unit,
       unit_price, quantity, unit_label, review_status, source_defect_id,
       defect_photos(image_url, sort_order, annotations_json, caption)`
    )
    .eq('delivery_report_id', reportId)
    .order('sort_order')
    .order('created_at');

  if (defectsError) throw new Error('שגיאה בטעינת ממצאים');

  // Batch-resolve standard titles from israeli_standards registry.
  // Collect refs from two sources:
  //   1. Explicit standard_ref selections (ComboField picks)
  //   2. Keyword-anchored parsing of free-text fields (standard_section, recommendation, notes)
  const allRefs = new Set<string>();

  for (const d of defectsData ?? []) {
    const rec = d as Record<string, unknown>;
    // Source 1: explicit selection
    const explicitRef = rec.standard_ref as string | null;
    if (explicitRef) allRefs.add(explicitRef);

    // Source 2: scan free-text fields for standard references
    for (const field of [rec.standard_section, rec.recommendation, rec.notes]) {
      if (typeof field === 'string' && field.trim()) {
        for (const ref of extractStandardRefsFromText(field)) {
          allRefs.add(ref);
        }
      }
    }
  }

  const standardTitleMap = new Map<string, string>();
  if (allRefs.size > 0) {
    const { data: standardsData } = await supabase
      .from('israeli_standards')
      .select('full_key, title')
      .in('full_key', [...allRefs]);
    for (const s of standardsData ?? []) {
      standardTitleMap.set(s.full_key as string, s.title as string);
    }
  }

  const defects: PdfDefect[] = await Promise.all(
    (defectsData ?? []).map(async (d: Record<string, unknown>) => {
      const photos =
        (d.defect_photos as Array<{
          image_url: string;
          sort_order: number;
          annotations_json: unknown;
          caption: string | null;
        }>) ?? [];
      const sortedPhotos = photos.sort((a, b) => a.sort_order - b.sort_order);
      const photoUrls: string[] = [];
      for (const photo of sortedPhotos) {
        if (photo.annotations_json) {
          const renderFn = getRenderAnnotations();
          if (renderFn) {
            try {
              const layer =
                photo.annotations_json as unknown as AnnotationLayer;
              const composited = await renderFn(photo.image_url, layer);
              photoUrls.push(composited);
            } catch (err) {
              // Fallback to original if compositing fails
              console.error(
                '[usePdfGeneration] annotation compositing failed:',
                err
              );
              photoUrls.push(photo.image_url);
            }
          } else {
            photoUrls.push(photo.image_url);
          }
        } else {
          photoUrls.push(photo.image_url);
        }
      }
      // Build photos array with captions
      const photosWithCaptions = sortedPhotos.map((p, pIdx) => ({
        url: photoUrls[pIdx],
        caption: p.caption ?? undefined,
      }));

      const stdRef = d.standard_ref as string | undefined;
      return {
        number: '',
        title: d.description as string,
        location: (d.room as string) ?? '',
        category: (d.category as string) ?? 'כללי',
        severity: (d.severity as string) ?? 'medium',
        standardRef: stdRef,
        standardText: stdRef ? standardTitleMap.get(stdRef) : undefined,
        standardSection: d.standard_section as string | undefined,
        recommendation: d.recommendation as string | undefined,
        cost: d.cost as number | undefined,
        costLabel: d.cost_unit as string | undefined,
        unitPrice: d.unit_price as number | undefined,
        quantity: d.quantity as number | undefined,
        unitLabel: d.unit_label as string | undefined,
        note: d.notes as string | undefined,
        photoUrls,
        photos: photosWithCaptions,
        roundStatus: deriveRoundStatus(d),
      };
    })
  );

  // Assign hierarchical numbers by category (1.01, 1.02, 2.01...)
  const categoryOrder: string[] = [];
  for (const d of defects) {
    if (!categoryOrder.includes(d.category)) {
      categoryOrder.push(d.category);
    }
  }
  const categoryCounters = new Map<string, number>();
  for (const d of defects) {
    const catIdx = categoryOrder.indexOf(d.category) + 1;
    const counter = (categoryCounters.get(d.category) ?? 0) + 1;
    categoryCounters.set(d.category, counter);
    d.number = `${catIdx}.${String(counter).padStart(2, '0')}`;
  }

  // Fetch signatures
  const { data: sigData } = await supabase
    .from('signatures')
    .select('signer_type, signer_name, image_url, signed_at')
    .eq('delivery_report_id', reportId);

  const signatures: PdfSignature[] = (sigData ?? []).map(
    (s: Record<string, unknown>) => ({
      signerType: s.signer_type as 'inspector' | 'tenant',
      signerName: s.signer_name as string,
      imageUrl: s.image_url as string | undefined,
      signedAt: s.signed_at as string,
    })
  );

  // Synthesize inspector signature from snapshot if not in signatures table.
  // Both name and url come exclusively from the snapshot — no live fallback.
  const snapshotSigUrl = reportRecord.inspector_signature_url_snapshot as
    | string
    | null;
  const snapshotInspectorName = reportRecord.inspector_full_name_snapshot as
    | string
    | null;
  if (snapshotSigUrl) {
    const hasInspectorSig = signatures.some(
      (s) => s.signerType === 'inspector'
    );
    if (!hasInspectorSig) {
      signatures.push({
        signerType: 'inspector',
        signerName: snapshotInspectorName ?? '',
        imageUrl: snapshotSigUrl,
        signedAt: new Date().toISOString(),
      });
    }
  }

  // Parse report_content JSONB
  const reportContent =
    ((report as Record<string, unknown>).report_content as Record<
      string,
      unknown
    >) ?? {};

  // --- Map checklist_state → PdfChecklistItem[] (delivery/protocol reports) ---
  const checklistState = reportRecord.checklist_state as {
    statuses?: Record<string, string>;
    defectTexts?: Record<string, string>;
    bathTypes?: Record<string, string>;
  } | null;

  // Resolve checklist rooms: use template from DB if set, else hardcoded constant
  const pdfTemplateId = reportRecord.checklist_template_id as string | null;
  let pdfRooms: ChecklistRoom[] = CHECKLIST_ROOMS;

  if (pdfTemplateId) {
    const { data: catData } = await supabase
      .from('checklist_categories')
      .select('*, checklist_items(*)')
      .eq('template_id', pdfTemplateId)
      .order('sort_order');

    if (catData && catData.length > 0) {
      pdfRooms = mapToChecklistRooms(
        catData as {
          id: string;
          name: string;
          sort_order: number;
          checklist_items: {
            id: string;
            description: string;
            default_severity: string;
            requires_photo: boolean;
            sort_order: number;
            metadata: Record<string, unknown>;
          }[];
        }[]
      );
    }
  }

  let checklistItems: PdfChecklistItem[] | undefined;
  if (checklistState?.statuses) {
    const { statuses: ckStatuses, bathTypes: ckBathTypes } = checklistState;
    const items: PdfChecklistItem[] = [];
    let refNum = 1;

    for (const room of pdfRooms) {
      const selectedBathType = ckBathTypes?.[room.id] ?? 'shower';

      for (const item of room.items) {
        // Skip bath-type-specific items that don't match the selected type
        if (item.bathType && item.bathType !== selectedBathType) continue;
        // Skip child items whose parent isn't checked ok
        if (item.parentId && ckStatuses[item.parentId] !== 'ok') continue;

        const status = ckStatuses[item.id];
        if (!status || status === 'skip') continue;

        if (status === 'ok' || status === 'defect' || status === 'partial') {
          items.push({
            text: item.text,
            status,
            category: room.name,
            refNumber: refNum++,
          });
        }
      }
    }

    if (items.length > 0) checklistItems = items;
  }

  // --- Extract tenant notes & key delivery from report_content ---
  const tenantNotes = reportContent.tenant_notes as string | undefined;

  let keyDelivery: PdfKeyDelivery[] | undefined;
  const rawKeys = reportContent.key_delivery as
    | Array<{ label: string; value: string }>
    | undefined;
  if (rawKeys && rawKeys.length > 0) {
    keyDelivery = rawKeys;
  }

  return {
    reportType: report.report_type as 'bedek_bait' | 'delivery',
    reportNumber:
      (reportRecord.report_number as string) ??
      reportId.slice(0, 8).toUpperCase(),
    reportDate: report.report_date,
    status: report.status as PdfReportData['status'],
    inspector: {
      name: (reportRecord.inspector_full_name_snapshot as string) ?? '',
      professionalTitle:
        (reportRecord.inspector_professional_title_snapshot as string) ??
        undefined,
      licenseNumber:
        (reportRecord.inspector_license_number_snapshot as string) ?? undefined,
      education:
        (reportRecord.inspector_education_snapshot as string) ?? undefined,
      experience:
        (reportRecord.inspector_experience_snapshot as string) ?? undefined,
      companyName:
        (reportRecord.inspector_company_name_snapshot as string) ?? undefined,
      companyLogoUrl:
        (reportRecord.organization_logo_url_snapshot as string) ?? undefined,
      phone: (reportRecord.inspector_phone_snapshot as string) ?? undefined,
      email: (reportRecord.inspector_email_snapshot as string) ?? undefined,
    },
    property: {
      projectName: (reportRecord.property_project_name as string) ?? '',
      address: (reportRecord.property_project_address as string) ?? undefined,
      apartmentNumber: (reportRecord.property_apartment_number as string) ?? '',
      floor: (reportRecord.property_floor as number) ?? undefined,
      area: (reportRecord.property_area as string) ?? undefined,
      contractor: (reportRecord.contractor_name as string) ?? undefined,
    },
    client: {
      name:
        (reportRecord.client_name as string) ??
        (reportRecord.tenant_name as string) ??
        '',
      phone:
        (reportRecord.client_phone as string) ??
        (reportRecord.tenant_phone as string) ??
        undefined,
      email: reportRecord.client_email as string | undefined,
      idNumber: reportRecord.client_id_number as string | undefined,
    },
    defects,
    checklistItems,
    signatures,
    tenantNotes,
    keyDelivery,
    notes: report.notes ?? undefined,
    stampUrl:
      (reportRecord.inspector_stamp_url_snapshot as string) ?? undefined,
    declaration:
      (reportRecord.organization_legal_disclaimer_snapshot as string) ??
      (reportContent.declaration as string | undefined),
    scope: reportContent.scope as string | undefined,
    propertyDescription:
      (reportRecord.property_description as string) ??
      (reportContent.property_description as string) ??
      undefined,
    limitations: reportContent.limitations as string | undefined,
    tools: reportContent.tools as string[] | undefined,
    weatherConditions: reportRecord.weather_conditions as string | undefined,
    contractorName: reportRecord.contractor_name as string | undefined,
    contractorPhone: reportRecord.contractor_phone as string | undefined,
    generalNotes: reportContent.general_notes as string | undefined,

    // Editable text defaults (snapshotted into report_content at creation)
    workMethod: reportContent.work_method as string | undefined,
    standardsBoilerplate: reportContent.standards_boilerplate as
      | string[]
      | undefined,
    tenantRightsText: reportContent.tenant_rights_text as string | undefined,
    warrantyPeriods: reportContent.warranty_periods as
      | { desc: string; period: string }[]
      | undefined,
    requiredDocs: reportContent.required_docs as string[] | undefined,
    financialNotes: reportContent.financial_notes as string[] | undefined,
    disclaimerText: reportContent.disclaimer as string | undefined,
    inspectorDeclaration: reportContent.inspector_declaration as
      | string
      | undefined,
    tenantAcknowledgment: reportContent.tenant_acknowledgment as
      | string
      | undefined,
    protocolTerms: reportContent.protocol_terms as string | undefined,

    // Visibility flags
    showDeclaration: reportContent.show_declaration as boolean | undefined,
    showWorkMethod: reportContent.show_work_method as boolean | undefined,
    showTools: reportContent.show_tools as boolean | undefined,
    showLimitations: reportContent.show_limitations as boolean | undefined,
    showStandards: reportContent.show_standards as boolean | undefined,
    showTenantRights: reportContent.show_tenant_rights as boolean | undefined,
    showWarrantyPeriods: reportContent.show_warranty_periods as
      | boolean
      | undefined,
    showRequiredDocs: reportContent.show_required_docs as boolean | undefined,
    showFinancialNotes: reportContent.show_financial_notes as
      | boolean
      | undefined,
    showDisclaimer: reportContent.show_disclaimer as boolean | undefined,
    showInspectorDeclaration: reportContent.show_inspector_declaration as
      | boolean
      | undefined,
    showTenantAcknowledgment: reportContent.show_tenant_acknowledgment as
      | boolean
      | undefined,
    showProtocolTerms: reportContent.show_protocol_terms as boolean | undefined,
    showSeverity: (reportRecord.show_severity as boolean) ?? true,

    logoUrl:
      (reportRecord.organization_logo_url_snapshot as string) ?? undefined,
    boqRates: {
      batzam: (reportRecord.org_boq_batzam_rate_snapshot as number) ?? 0.1,
      supervision:
        (reportRecord.org_boq_supervision_rate_snapshot as number) ?? 0.1,
      vat: (reportRecord.org_boq_vat_rate_snapshot as number) ?? 0.18,
    },
    roundNumber: (reportRecord.round_number as number) ?? undefined,
    resolvedStandards: Object.fromEntries(standardTitleMap),
  };
}

function buildPdfFilename(data: PdfReportData): string {
  const d = new Date(data.reportDate);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const dateStr = `${dd}.${mm}.${yyyy}`;

  const title =
    data.reportType === 'bedek_bait' ? 'דוח בדק הנדסי' : 'פרוטוקול מסירה';

  const clientName = data.client.name?.trim();
  if (clientName) {
    return `${title} - ${dateStr} - ${clientName}`;
  }
  return `${title} - ${dateStr}`;
}

// --- Hook ---

export function usePdfGeneration(
  onSuccess?: (message: string) => void,
  onError?: (message: string) => void
): UsePdfGenerationResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const lastFilenameRef = useRef('');

  const generatePdf = useCallback(
    async (reportId: string): Promise<string | null> => {
      setIsGenerating(true);
      try {
        const data = await fetchFullReportData(reportId);
        lastFilenameRef.current = buildPdfFilename(data);

        // Generate HTML based on report type
        const html =
          data.reportType === 'bedek_bait'
            ? await generateBedekBayitHtml(data)
            : await generateProtocolHtml(data);

        // --- Web path: open preview in new tab with print-to-PDF ---
        // html2pdf.js rasterizes content (loses RTL, fonts, quality).
        // Native browser print-to-PDF produces perfect results.
        if (Platform.OS === 'web') {
          if (
            typeof window === 'undefined' ||
            typeof document === 'undefined'
          ) {
            onError?.('הפקת הדוח אינה נתמכת בסביבה זו');
            return null;
          }

          // Inject a floating "Save as PDF" toolbar into the HTML
          const toolbar = `
            <div id="pdf-toolbar" style="
              position:fixed;top:0;left:0;right:0;z-index:9999;
              background:#1B7A44;color:#fff;padding:12px 20px;
              display:flex;justify-content:space-between;align-items:center;
              font-family:'Rubik',system-ui,sans-serif;direction:rtl;
              box-shadow:0 2px 8px rgba(0,0,0,0.15);
            ">
              <div>
                <div style="font-size:14px;font-weight:600;">תצוגה מקדימה — דוח inField</div>
                <div style="font-size:11px;opacity:0.85;margin-top:2px;">בחלון ההדפסה בחר יעד: &laquo;שמור כ-PDF&raquo;</div>
              </div>
              <button onclick="document.getElementById('pdf-toolbar').style.display='none';window.print();document.getElementById('pdf-toolbar').style.display='flex';" style="
                background:#fff;color:#1B7A44;border:none;padding:8px 20px;
                border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;
                font-family:'Rubik',system-ui,sans-serif;white-space:nowrap;
              ">🖨️ הדפס / שמור כ-PDF</button>
            </div>
            <style>
              @media print { #pdf-toolbar { display:none !important; } }
              body { padding-top: 60px; }
              @media print { body { padding-top: 0; } }
            </style>`;

          // Insert toolbar right after <body>
          const htmlWithToolbar = html.replace(/<body>/, `<body>${toolbar}`);

          const blob = new Blob([htmlWithToolbar], { type: 'text/html' });
          const blobUrl = URL.createObjectURL(blob);
          const previewWindow = window.open(blobUrl, '_blank');

          if (!previewWindow) {
            URL.revokeObjectURL(blobUrl);
            onError?.(
              'חלונות קופצים חסומים — אפשר אותם בדפדפן כדי להציג את הדוח'
            );
            return null;
          }

          onSuccess?.('הדוח נפתח בלשונית חדשה — לחץ "שמור כ-PDF"');
          return blobUrl;
        }

        // --- Native path: generate real PDF file via expo-print ---
        const { uri } = await Print.printToFileAsync({
          html,
          base64: false,
        });

        // Update pdf_url in Supabase (native only — blob: URLs are useless
        // to store)
        await supabase
          .from('delivery_reports')
          .update({ pdf_url: uri })
          .eq('id', reportId);

        onSuccess?.('הדוח הופק בהצלחה');
        return uri;
      } catch (err) {
        console.error('[usePdfGeneration] generatePdf failed:', err);
        onError?.('שגיאה בהפקת הדוח');
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [onSuccess, onError]
  );

  const sharePdf = useCallback(
    async (reportId: string, existingPdfUri?: string) => {
      setIsSharing(true);
      try {
        let uri = existingPdfUri;

        // Generate if no existing URI
        if (!uri) {
          uri = (await generatePdf(reportId)) ?? undefined;
        }

        if (!uri) {
          onError?.('שגיאה בהפקת הדוח לשיתוף');
          return;
        }

        // --- Web path: navigator.share with fallback ---
        if (Platform.OS === 'web') {
          if (typeof navigator !== 'undefined' && 'share' in navigator) {
            try {
              await (
                navigator as Navigator & {
                  share: (data: ShareData) => Promise<void>;
                }
              ).share({
                title: lastFilenameRef.current || 'דוח inField',
                text: lastFilenameRef.current || 'דוח inField',
                url: uri,
              });
              return;
            } catch (err) {
              // AbortError = user cancelled — not an error
              if ((err as Error)?.name === 'AbortError') return;
              console.error('[usePdfGeneration] navigator.share failed:', err);
              // Fall through to fallback
            }
          }

          // Fallback: trigger download of the HTML blob
          if (typeof document !== 'undefined') {
            const link = document.createElement('a');
            link.href = uri;
            link.download = `${lastFilenameRef.current || 'infield-report'}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            onSuccess?.('הדוח ירד — אפשר לשתף אותו מהדפדפן');
            return;
          }

          onError?.('שיתוף לא נתמך בדפדפן זה');
          return;
        }

        // --- Native path ---
        await Share.share({
          url: uri,
          title: lastFilenameRef.current || 'דוח inField',
        });
      } catch (err) {
        // User cancelled share — not an error, but log other failures
        if ((err as Error)?.name !== 'AbortError') {
          console.error('[usePdfGeneration] sharePdf failed:', err);
        }
      } finally {
        setIsSharing(false);
      }
    },
    [generatePdf, onError, onSuccess]
  );

  return { isGenerating, isSharing, generatePdf, sharePdf };
}
