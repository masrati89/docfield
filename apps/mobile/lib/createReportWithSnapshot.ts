import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { REPORT_DEFAULTS } from '@infield/shared/src/constants/reportDefaults';

// --- Phone normalization ---

/**
 * Normalize an Israeli phone number to digits-only format matching the DB
 * CHECK constraint: ^0[2-9]\d{7,8}$
 * Handles: +972-54-1234567, 054-123-4567, 0541234567, etc.
 * Returns null for empty/invalid input.
 */
function normalizePhone(raw?: string | null): string | null {
  if (!raw || !raw.trim()) return null;
  // Strip everything except digits and leading +
  let digits = raw.replace(/[^\d+]/g, '');
  // Convert +972 / 972 prefix to local 0
  if (digits.startsWith('+972')) digits = '0' + digits.slice(4);
  else if (digits.startsWith('972') && digits.length > 9)
    digits = '0' + digits.slice(3);
  // Must match DB CHECK constraint: ^0[2-9]\d{7,8}$
  // If it doesn't match, return null to avoid INSERT failure
  if (/^0[2-9]\d{7,8}$/.test(digits)) return digits;
  return null;
}

// --- Types ---

interface SnapshotInsertData {
  apartment_id: string | null;
  organization_id: string;
  inspector_id: string;
  report_type: string;
  status: 'draft' | 'in_progress';
  round_number: number;
  previous_round_id?: string | null;
  report_date: string;
  project_name_freetext?: string | null;
  apartment_label_freetext?: string | null;
  tenant_name?: string | null;
  tenant_phone?: string | null;
  tenant_email?: string | null;
  // Client + property fields (migration 026)
  client_id_number?: string | null;
  property_type?: string | null;
  property_area?: number | null;
  property_floor?: number | null;
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
  // BOQ rate snapshots (3) — migration 037
  org_boq_batzam_rate_snapshot: number | null;
  org_boq_supervision_rate_snapshot: number | null;
  org_boq_vat_rate_snapshot: number | null;
  // Report content snapshot (text defaults + visibility flags)
  report_content: Record<string, unknown>;
  // Checklist template (migration 005 FK)
  checklist_template_id: string | null;
  // No-checklist flag (migration 041)
  no_checklist: boolean;
  // Severity display toggle (migration 047)
  show_severity: boolean;
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
  /** When true, report is created as draft (status='draft') instead of in_progress. */
  isDraft?: boolean;
  /** When true, billing is deferred to finalization (report_created_draft). */
  isDraftBilling?: boolean;
  // Client + property fields (migration 026)
  clientIdNumber?: string | null;
  propertyType?: string | null;
  propertyArea?: number | null;
  propertyFloor?: number | null;
  propertyAddress?: string | null;
  checklistTemplateId?: string | null;
  noChecklist?: boolean;
  showSeverity?: boolean;
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
  apartmentLabelFreetext: string | null,
  propertyAddress?: string | null
): Promise<PropertySnapshot> {
  // Free-text fallback path (no apartment row exists)
  if (!apartmentId) {
    return {
      projectName: projectNameFreetext,
      projectAddress: propertyAddress ?? null,
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
  // TODO: wire Zod validation (createReportSchema) when schema is updated
  // to support nullable apartmentId and additional fields like roundNumber,
  // inspectorId, organizationId, projectNameFreetext, etc. The current
  // createReportSchema requires apartmentId as a non-nullable UUID, which
  // doesn't match free-text report creation flow. (security M1)

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
    (userData.inspector_settings as Record<string, unknown>) ?? {};

  // Fetch organization data
  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .select('name, logo_url, settings')
    .eq('id', params.organizationId)
    .single();

  if (orgError || !orgData) {
    throw new Error('שגיאה בטעינת פרטי הארגון');
  }

  const orgSettings = (orgData.settings as Record<string, unknown>) ?? {};
  const boqRates =
    (orgSettings.boqRates as Record<string, number> | undefined) ?? {};

  // Fetch property snapshot (Iron Rule — migration 033)
  const propertySnapshot = await fetchPropertySnapshot(
    params.apartmentId,
    params.projectNameFreetext ?? null,
    params.apartmentLabelFreetext ?? null,
    params.propertyAddress ?? null
  );

  // Resolve show_severity from template default if not explicitly set
  let resolvedShowSeverity = params.showSeverity ?? true;
  if (params.showSeverity === undefined && params.checklistTemplateId) {
    const { data: tpl } = await supabase
      .from('checklist_templates')
      .select('show_severity_default')
      .eq('id', params.checklistTemplateId)
      .single();
    if (tpl) {
      resolvedShowSeverity = (tpl.show_severity_default as boolean) ?? true;
    }
  }

  // Build INSERT data with snapshot fields
  const insertData: SnapshotInsertData = {
    apartment_id: params.apartmentId,
    organization_id: params.organizationId,
    inspector_id: params.inspectorId,
    report_type: params.reportType,
    status: params.isDraft ? 'draft' : 'in_progress',
    round_number: params.roundNumber,
    previous_round_id: params.previousRoundId ?? null,
    report_date: params.reportDate,
    project_name_freetext: params.projectNameFreetext ?? null,
    apartment_label_freetext: params.apartmentLabelFreetext ?? null,
    tenant_name: params.tenantName ?? null,
    tenant_phone: normalizePhone(params.tenantPhone) || null,
    tenant_email: params.tenantEmail ?? null,

    // Inspector snapshots (10)
    inspector_full_name_snapshot: userData.full_name ?? null,
    inspector_license_number_snapshot:
      (settings.license_number as string) ?? null,
    // TODO: map professional_title when Organization Module (Phase 2) decides
    // whether it lives on users.profession or users.inspector_settings.
    inspector_professional_title_snapshot: null,
    inspector_education_snapshot: (settings.education as string) ?? null,
    inspector_experience_snapshot: (settings.experience as string) ?? null,
    inspector_company_name_snapshot: (settings.company_name as string) ?? null,
    inspector_signature_url_snapshot: userData.signature_url ?? null,
    inspector_stamp_url_snapshot: userData.stamp_url ?? null,
    inspector_phone_snapshot: userData.phone ?? null,
    inspector_email_snapshot: userData.email ?? null,

    // Organization snapshots (8)
    organization_name_snapshot: orgData.name ?? null,
    organization_logo_url_snapshot: orgData.logo_url ?? null,
    organization_legal_name_snapshot:
      (orgSettings.legal_name as string) ?? null,
    organization_tax_id_snapshot: (orgSettings.tax_id as string) ?? null,
    organization_address_snapshot: (orgSettings.address as string) ?? null,
    organization_phone_snapshot: (orgSettings.phone as string) ?? null,
    organization_email_snapshot: (orgSettings.email as string) ?? null,
    organization_legal_disclaimer_snapshot:
      (orgSettings.legal_disclaimer as string) ?? null,

    // Property snapshots (4) — Iron Rule completion
    property_project_name: propertySnapshot.projectName,
    property_project_address: propertySnapshot.projectAddress,
    property_building_name: propertySnapshot.buildingName,
    property_apartment_number: propertySnapshot.apartmentNumber,

    // BOQ rate snapshots (3) — Iron Rule (migration 037)
    org_boq_batzam_rate_snapshot: boqRates.batzam ?? null,
    org_boq_supervision_rate_snapshot: boqRates.supervision ?? null,
    org_boq_vat_rate_snapshot: boqRates.vat ?? null,

    // Report content snapshot — freeze text defaults + visibility flags
    // from inspector_settings merged with REPORT_DEFAULTS (Iron Rule)
    report_content: {
      declaration:
        (settings.default_declaration as string) || REPORT_DEFAULTS.declaration,
      work_method:
        (settings.work_method as string) || REPORT_DEFAULTS.work_method,
      tools: (settings.default_tools as string)
        ? (settings.default_tools as string)
            .split(',')
            .map((t: string) => t.trim())
        : REPORT_DEFAULTS.default_tools.split(',').map((t: string) => t.trim()),
      limitations:
        (settings.default_limitations as string) ||
        REPORT_DEFAULTS.default_limitations,
      standards_boilerplate:
        (settings.standards_boilerplate as string[]) ||
        REPORT_DEFAULTS.standards_boilerplate,
      tenant_rights_text:
        (settings.tenant_rights_text as string) ||
        REPORT_DEFAULTS.tenant_rights_text,
      warranty_periods:
        (settings.warranty_periods as { desc: string; period: string }[]) ||
        REPORT_DEFAULTS.warranty_periods,
      required_docs:
        (settings.required_docs as string[]) || REPORT_DEFAULTS.required_docs,
      financial_notes:
        (settings.financial_notes as string[]) ||
        REPORT_DEFAULTS.financial_notes,
      disclaimer: (settings.disclaimer as string) || REPORT_DEFAULTS.disclaimer,
      inspector_declaration:
        (settings.inspector_declaration as string) ||
        REPORT_DEFAULTS.inspector_declaration,
      tenant_acknowledgment:
        (settings.tenant_acknowledgment as string) ||
        REPORT_DEFAULTS.tenant_acknowledgment,
      protocol_terms:
        (settings.protocol_terms as string) || REPORT_DEFAULTS.protocol_terms,
      inspection_purpose:
        (settings.inspection_purpose as string) ||
        REPORT_DEFAULTS.inspection_purpose,
      // Visibility flags (default true if not set)
      show_declaration: settings.show_declaration ?? true,
      show_work_method: settings.show_work_method ?? true,
      show_tools: settings.show_tools ?? true,
      show_limitations: settings.show_limitations ?? true,
      show_standards: settings.show_standards ?? true,
      show_tenant_rights: settings.show_tenant_rights ?? true,
      show_warranty_periods: settings.show_warranty_periods ?? true,
      show_required_docs: settings.show_required_docs ?? true,
      show_financial_notes: settings.show_financial_notes ?? true,
      show_disclaimer: settings.show_disclaimer ?? true,
      show_inspector_declaration: settings.show_inspector_declaration ?? true,
      show_tenant_acknowledgment: settings.show_tenant_acknowledgment ?? true,
      show_protocol_terms: settings.show_protocol_terms ?? true,
    },

    // Client + property fields (migration 026)
    client_id_number: params.clientIdNumber ?? null,
    property_type: params.propertyType ?? null,
    property_area: params.propertyArea ?? null,
    property_floor: params.propertyFloor ?? null,

    // Checklist template (migration 005 FK)
    checklist_template_id: params.checklistTemplateId ?? null,
    // No-checklist flag (migration 041)
    no_checklist: params.noChecklist ?? false,
    // Severity display toggle (migration 047)
    show_severity: resolvedShowSeverity,
  };

  const { data, error } = await supabase
    .from('delivery_reports')
    .insert(insertData)
    .select('id')
    .single();

  if (error) throw error;

  const reportId = data.id as string;

  // Write billing event to report_log (append-only, non-blocking).
  // Regular reports are billable at INSERT; drafts are billed at finalization.
  // Non-fatal: report_log writes are deferred to P2 — never block report creation.
  try {
    const billingAction =
      params.isDraft || params.isDraftBilling
        ? 'report_created_draft'
        : 'report_created_billable';

    await supabase.from('report_log').insert({
      delivery_report_id: reportId,
      organization_id: params.organizationId,
      user_id: params.inspectorId,
      action: billingAction,
      details: {
        report_type: params.reportType,
        round_number: params.roundNumber,
      },
    });
  } catch (logErr) {
    logger.warn('[createReportWithSnapshot] report_log write failed:', logErr);
  }

  return { id: reportId };
}
