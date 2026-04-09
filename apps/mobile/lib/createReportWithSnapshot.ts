import { supabase } from '@/lib/supabase';

// --- Types ---

interface SnapshotInsertData {
  apartment_id: string | null;
  organization_id: string;
  inspector_id: string;
  report_type: string;
  status: 'draft';
  round_number: number;
  previous_round_id?: string | null;
  report_date: string;
  project_name_freetext?: string | null;
  apartment_label_freetext?: string | null;
  tenant_name?: string | null;
  tenant_phone?: string | null;
  tenant_email?: string | null;
  // 16 snapshot fields
  inspector_full_name_snapshot: string | null;
  inspector_license_number_snapshot: string | null;
  inspector_professional_title_snapshot: string | null;
  inspector_education_snapshot: string | null;
  inspector_signature_url_snapshot: string | null;
  inspector_stamp_url_snapshot: string | null;
  inspector_phone_snapshot: string | null;
  inspector_email_snapshot: string | null;
  organization_name_snapshot: string | null;
  organization_logo_url_snapshot: string | null;
  organization_legal_name_snapshot: string | null;
  organization_tax_id_snapshot: string | null;
  organization_address_snapshot: string | null;
  organization_phone_snapshot: string | null;
  organization_email_snapshot: string | null;
  organization_legal_disclaimer_snapshot: string | null;
}

interface CreateReportParams {
  apartmentId: string | null;
  organizationId: string;
  inspectorId: string;
  reportType: string;
  roundNumber: number;
  previousRoundId?: string | null;
  reportDate: string;
  projectNameFreetext?: string | null;
  apartmentLabelFreetext?: string | null;
  tenantName?: string | null;
  tenantPhone?: string | null;
  tenantEmail?: string | null;
}

/**
 * Creates a delivery report with Iron Rule snapshot fields.
 * Fetches live inspector + organization data and freezes it into the report row.
 */
export async function createReportWithSnapshot(
  params: CreateReportParams
): Promise<{ id: string }> {
  // Fetch inspector data (user profile + inspector_settings)
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select(
      'full_name, phone, email, signature_url, stamp_url, inspector_settings'
    )
    .eq('id', params.inspectorId)
    .single();

  if (userError || !userData) {
    throw new Error('שגיאה בטעינת פרטי המפקח');
  }

  const settings =
    (userData.inspector_settings as Record<string, string | null>) ?? {};

  // Fetch organization data
  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .select('name, logo_url, settings')
    .eq('id', params.organizationId)
    .single();

  if (orgError || !orgData) {
    throw new Error('שגיאה בטעינת פרטי הארגון');
  }

  const orgSettings = (orgData.settings as Record<string, string | null>) ?? {};

  // Build INSERT data with snapshot fields
  const insertData: SnapshotInsertData = {
    apartment_id: params.apartmentId,
    organization_id: params.organizationId,
    inspector_id: params.inspectorId,
    report_type: params.reportType,
    status: 'draft',
    round_number: params.roundNumber,
    previous_round_id: params.previousRoundId ?? null,
    report_date: params.reportDate,
    project_name_freetext: params.projectNameFreetext ?? null,
    apartment_label_freetext: params.apartmentLabelFreetext ?? null,
    tenant_name: params.tenantName ?? null,
    tenant_phone: params.tenantPhone ?? null,
    tenant_email: params.tenantEmail ?? null,

    // Inspector snapshots (8)
    inspector_full_name_snapshot: userData.full_name ?? null,
    inspector_license_number_snapshot: settings.license_number ?? null,
    inspector_professional_title_snapshot: null, // Future: from inspector_settings
    inspector_education_snapshot: settings.education ?? null,
    inspector_signature_url_snapshot: userData.signature_url ?? null,
    inspector_stamp_url_snapshot: userData.stamp_url ?? null,
    inspector_phone_snapshot: userData.phone ?? null,
    inspector_email_snapshot: userData.email ?? null,

    // Organization snapshots (8)
    organization_name_snapshot: orgData.name ?? null,
    organization_logo_url_snapshot: orgData.logo_url ?? null,
    organization_legal_name_snapshot: orgSettings.legal_name ?? null,
    organization_tax_id_snapshot: orgSettings.tax_id ?? null,
    organization_address_snapshot: orgSettings.address ?? null,
    organization_phone_snapshot: orgSettings.phone ?? null,
    organization_email_snapshot: orgSettings.email ?? null,
    organization_legal_disclaimer_snapshot:
      orgSettings.legal_disclaimer ?? null,
  };

  const { data, error } = await supabase
    .from('delivery_reports')
    .insert(insertData)
    .select('id')
    .single();

  if (error) throw error;

  return { id: data.id as string };
}
