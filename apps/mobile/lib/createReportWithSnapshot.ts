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
  // 18 snapshot fields
  inspector_full_name_snapshot: string | null;
  inspector_license_number_snapshot: string | null;
  inspector_professional_title_snapshot: string | null;
  inspector_education_snapshot: string | null;
  inspector_experience_snapshot: string | null;
  inspector_company_name_snapshot: string | null;
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
  // Property snapshots (4) — Iron Rule completion (migration 033)
  property_project_name: string | null;
  property_project_address: string | null;
  property_building_name: string | null;
  property_apartment_number: string | null;
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

// --- Property snapshot resolver ---

interface PropertySnapshot {
  projectName: string | null;
  projectAddress: string | null;
  buildingName: string | null;
  apartmentNumber: string | null;
}

async function fetchPropertySnapshot(
  apartmentId: string | null,
  projectNameFreetext: string | null,
  apartmentLabelFreetext: string | null
): Promise<PropertySnapshot> {
  // Free-text fallback path (no apartment row exists)
  if (!apartmentId) {
    return {
      projectName: projectNameFreetext,
      projectAddress: null,
      buildingName: null,
      apartmentNumber: apartmentLabelFreetext,
    };
  }

  const { data, error } = await supabase
    .from('apartments')
    .select('number, buildings(name, projects(name, address))')
    .eq('id', apartmentId)
    .single();

  if (error || !data) {
    // Do not throw — snapshot fields can be null and will fall back to
    // free-text at render time.
    return {
      projectName: projectNameFreetext,
      projectAddress: null,
      buildingName: null,
      apartmentNumber: apartmentLabelFreetext,
    };
  }

  const apt = data as unknown as {
    number: string;
    buildings: {
      name: string;
      projects: { name: string; address: string | null };
    } | null;
  };

  return {
    projectName: apt.buildings?.projects?.name ?? projectNameFreetext,
    projectAddress: apt.buildings?.projects?.address ?? null,
    buildingName: apt.buildings?.name ?? null,
    apartmentNumber: apt.number ?? apartmentLabelFreetext,
  };
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

  // Fetch property snapshot (Iron Rule — migration 033)
  const propertySnapshot = await fetchPropertySnapshot(
    params.apartmentId,
    params.projectNameFreetext ?? null,
    params.apartmentLabelFreetext ?? null
  );

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
    tenant_phone: params.tenantPhone?.replace(/[-\s]/g, '') || null,
    tenant_email: params.tenantEmail ?? null,

    // Inspector snapshots (10)
    inspector_full_name_snapshot: userData.full_name ?? null,
    inspector_license_number_snapshot: settings.license_number ?? null,
    // TODO: map professional_title when Organization Module (Phase 2) decides
    // whether it lives on users.profession or users.inspector_settings.
    inspector_professional_title_snapshot: null,
    inspector_education_snapshot: settings.education ?? null,
    inspector_experience_snapshot: settings.experience ?? null,
    inspector_company_name_snapshot: settings.company_name ?? null,
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

    // Property snapshots (4) — Iron Rule completion
    property_project_name: propertySnapshot.projectName,
    property_project_address: propertySnapshot.projectAddress,
    property_building_name: propertySnapshot.buildingName,
    property_apartment_number: propertySnapshot.apartmentNumber,
  };

  const { data, error } = await supabase
    .from('delivery_reports')
    .insert(insertData)
    .select('id')
    .single();

  if (error) throw error;

  return { id: data.id as string };
}
