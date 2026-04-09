import { useCallback, useState } from 'react';
import * as Print from 'expo-print';
import { Platform, Share } from 'react-native';

import { supabase } from '@/lib/supabase';
import { generateBedekBayitHtml, generateProtocolHtml } from '@/lib/pdf';
import type { PdfReportData, PdfDefect, PdfSignature } from '@/lib/pdf';
import type { AnnotationLayer } from '@/lib/annotations';

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

interface InspectorProfile {
  name: string;
  signatureUrl?: string;
  stampUrl?: string;
}

interface UsePdfGenerationResult {
  isGenerating: boolean;
  isSharing: boolean;
  generatePdf: (
    reportId: string,
    inspector?: InspectorProfile
  ) => Promise<string | null>;
  sharePdf: (
    reportId: string,
    inspector?: InspectorProfile,
    existingPdfUri?: string
  ) => Promise<void>;
}

// --- Fetcher ---

async function fetchFullReportData(
  reportId: string,
  inspector?: InspectorProfile
): Promise<PdfReportData> {
  // Fetch report with relations
  const { data: report, error: reportError } = await supabase
    .from('delivery_reports')
    .select(
      `id, report_type, status, tenant_name, tenant_phone, report_date, notes,
       report_number, client_name, client_phone, client_email, client_id_number,
       property_type, property_area, property_floor, property_description,
       report_content, weather_conditions, contractor_name, contractor_phone,
       inspector_full_name_snapshot, inspector_license_number_snapshot,
       inspector_professional_title_snapshot, inspector_education_snapshot,
       inspector_signature_url_snapshot, inspector_stamp_url_snapshot,
       inspector_phone_snapshot, inspector_email_snapshot,
       organization_name_snapshot, organization_logo_url_snapshot,
       organization_legal_name_snapshot, organization_tax_id_snapshot,
       organization_address_snapshot, organization_phone_snapshot,
       organization_email_snapshot, organization_legal_disclaimer_snapshot,
       apartments(
         number, floor,
         buildings(
           name,
           projects(name, address)
         )
       )`
    )
    .eq('id', reportId)
    .single();

  if (reportError || !report) throw new Error('שגיאה בטעינת נתוני הדוח');

  const reportRecord = report as Record<string, unknown>;

  const apt = report.apartments as unknown as {
    number: string;
    floor: number | null;
    buildings: {
      name: string;
      projects: { name: string; address: string | null };
    };
  } | null;

  // Fetch defects with photos
  const { data: defectsData, error: defectsError } = await supabase
    .from('defects')
    .select(
      `id, description, room, category, severity, status, sort_order,
       standard_ref, recommendation, notes, cost, cost_unit,
       defect_photos(image_url, sort_order, annotations_json, caption)`
    )
    .eq('delivery_report_id', reportId)
    .order('sort_order')
    .order('created_at');

  if (defectsError) throw new Error('שגיאה בטעינת ממצאים');

  const defects: PdfDefect[] = await Promise.all(
    (defectsData ?? []).map(async (d: Record<string, unknown>, idx: number) => {
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
            } catch {
              // Fallback to original if compositing fails
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

      return {
        number: idx + 1,
        title: d.description as string,
        location: (d.room as string) ?? '',
        category: (d.category as string) ?? 'כללי',
        standardRef: d.standard_ref as string | undefined,
        recommendation: d.recommendation as string | undefined,
        cost: d.cost as number | undefined,
        costLabel: d.cost_unit as string | undefined,
        note: d.notes as string | undefined,
        photoUrls,
        photos: photosWithCaptions,
      };
    })
  );

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

  // Add inspector signature from snapshot or user profile if not already in signatures table
  const sigUrl =
    (reportRecord.inspector_signature_url_snapshot as string) ??
    inspector?.signatureUrl;
  if (sigUrl) {
    const hasInspectorSig = signatures.some(
      (s) => s.signerType === 'inspector'
    );
    if (!hasInspectorSig) {
      signatures.push({
        signerType: 'inspector',
        signerName:
          (reportRecord.inspector_full_name_snapshot as string) ??
          inspector?.name ??
          '',
        imageUrl: sigUrl,
        signedAt: new Date().toISOString(),
      });
    }
  }

  // Iron Rule: prefer snapshot fields from report, fallback to live data
  const hasSnapshot = !!reportRecord.inspector_full_name_snapshot;

  let inspectorSettings: Record<string, unknown> = {};
  if (!hasSnapshot && inspector) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (userId) {
      const { data: userData } = await supabase
        .from('users')
        .select('inspector_settings')
        .eq('id', userId)
        .single();
      inspectorSettings =
        (userData?.inspector_settings as Record<string, unknown>) ?? {};
    }
  }

  // Parse report_content JSONB
  const reportContent =
    ((report as Record<string, unknown>).report_content as Record<
      string,
      unknown
    >) ?? {};

  return {
    reportType: report.report_type as 'bedek_bait' | 'delivery',
    reportNumber:
      (reportRecord.report_number as string) ??
      reportId.slice(0, 8).toUpperCase(),
    reportDate: report.report_date,
    status: report.status as PdfReportData['status'],
    inspector: {
      name:
        (reportRecord.inspector_full_name_snapshot as string) ??
        inspector?.name ??
        '',
      licenseNumber:
        (reportRecord.inspector_license_number_snapshot as string) ??
        (inspectorSettings.license_number as string | undefined),
      education:
        (reportRecord.inspector_education_snapshot as string) ??
        (inspectorSettings.education as string | undefined),
      experience: inspectorSettings.experience as string | undefined,
      companyName: inspectorSettings.company_name as string | undefined,
      companyLogoUrl:
        (reportRecord.organization_logo_url_snapshot as string) ??
        (inspectorSettings.company_logo_url as string | undefined),
    },
    property: {
      projectName: apt?.buildings?.projects?.name ?? '',
      address: apt?.buildings?.projects?.address ?? undefined,
      apartmentNumber: apt?.number ?? '',
      floor: (reportRecord.property_floor as number) ?? apt?.floor ?? undefined,
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
    signatures,
    notes: report.notes ?? undefined,
    stampUrl:
      (reportRecord.inspector_stamp_url_snapshot as string) ??
      inspector?.stampUrl,
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
    logoUrl:
      (reportRecord.organization_logo_url_snapshot as string) ??
      (inspectorSettings.company_logo_url as string | undefined),
  };
}

// --- Hook ---

export function usePdfGeneration(
  onSuccess?: (message: string) => void,
  onError?: (message: string) => void
): UsePdfGenerationResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const generatePdf = useCallback(
    async (
      reportId: string,
      inspector?: InspectorProfile
    ): Promise<string | null> => {
      setIsGenerating(true);
      try {
        const data = await fetchFullReportData(reportId, inspector);

        // Generate HTML based on report type
        const html =
          data.reportType === 'bedek_bait'
            ? generateBedekBayitHtml(data)
            : generateProtocolHtml(data);

        // Generate PDF file
        const { uri } = await Print.printToFileAsync({
          html,
          base64: false,
        });

        // Update pdf_url in Supabase
        await supabase
          .from('delivery_reports')
          .update({ pdf_url: uri })
          .eq('id', reportId);

        onSuccess?.('הדוח הופק בהצלחה');
        return uri;
      } catch {
        onError?.('שגיאה בהפקת הדוח');
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [onSuccess, onError]
  );

  const sharePdf = useCallback(
    async (
      reportId: string,
      inspector?: InspectorProfile,
      existingPdfUri?: string
    ) => {
      setIsSharing(true);
      try {
        let uri = existingPdfUri;

        // Generate if no existing URI
        if (!uri) {
          uri = (await generatePdf(reportId, inspector)) ?? undefined;
        }

        if (!uri) {
          onError?.('שגיאה בהפקת הדוח לשיתוף');
          return;
        }

        if (Platform.OS === 'web') {
          onError?.('שיתוף אינו נתמך בדפדפן');
          return;
        }

        await Share.share({
          url: uri,
          title: 'דוח inField',
        });
      } catch {
        // User cancelled share — not an error
      } finally {
        setIsSharing(false);
      }
    },
    [generatePdf, onError]
  );

  return { isGenerating, isSharing, generatePdf, sharePdf };
}
