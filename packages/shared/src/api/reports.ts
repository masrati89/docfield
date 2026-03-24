import type { SupabaseClient } from '@supabase/supabase-js';

import type { ChecklistTemplate } from '../types/checklist.types';
import type { DeliveryReport } from '../types/inspection.types';

// --- Response types ---

export interface ChecklistTemplateWithCounts extends ChecklistTemplate {
  categoryCount: number;
  itemCount: number;
}

// --- Supabase row to camelCase mappers ---

function mapTemplate(
  row: Record<string, unknown>
): ChecklistTemplateWithCounts {
  return {
    id: row.id as string,
    organizationId: (row.organization_id as string) ?? undefined,
    name: row.name as string,
    reportType: row.report_type as ChecklistTemplate['reportType'],
    isGlobal: row.is_global as boolean,
    isActive: row.is_active as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    categoryCount: Number(row.category_count ?? 0),
    itemCount: Number(row.item_count ?? 0),
  };
}

function mapReport(row: Record<string, unknown>): DeliveryReport {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    apartmentId: row.apartment_id as string,
    inspectorId: row.inspector_id as string,
    checklistTemplateId: (row.checklist_template_id as string) ?? undefined,
    reportType: row.report_type as DeliveryReport['reportType'],
    roundNumber: row.round_number as number,
    status: row.status as DeliveryReport['status'],
    tenantName: (row.tenant_name as string) ?? undefined,
    tenantPhone: (row.tenant_phone as string) ?? undefined,
    tenantEmail: (row.tenant_email as string) ?? undefined,
    notes: (row.notes as string) ?? undefined,
    pdfUrl: (row.pdf_url as string) ?? undefined,
    reportDate: row.report_date as string,
    completedAt: (row.completed_at as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// --- API Functions ---

export async function getChecklistTemplates(
  supabase: SupabaseClient,
  organizationId: string
): Promise<ChecklistTemplateWithCounts[]> {
  // Fetch active templates (org-specific + global)
  const { data, error } = await supabase
    .from('checklist_templates')
    .select('*')
    .or(`organization_id.eq.${organizationId},is_global.eq.true`)
    .eq('is_active', true)
    .order('is_global', { ascending: false })
    .order('name', { ascending: true });

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const templateIds = data.map((template) => template.id as string);

  // Fetch categories with item counts
  const { data: categories } = await supabase
    .from('checklist_categories')
    .select('id, template_id')
    .in('template_id', templateIds);

  const categoryCountByTemplate = new Map<string, number>();
  const categoryIds: string[] = [];

  for (const category of categories ?? []) {
    const templateId = category.template_id as string;
    categoryCountByTemplate.set(
      templateId,
      (categoryCountByTemplate.get(templateId) ?? 0) + 1
    );
    categoryIds.push(category.id as string);
  }

  // Fetch item counts per template (via categories)
  const itemCountByTemplate = new Map<string, number>();

  if (categoryIds.length > 0) {
    const { data: items } = await supabase
      .from('checklist_items')
      .select('category_id')
      .in('category_id', categoryIds);

    // Build category → template lookup
    const categoryToTemplate = new Map<string, string>();
    for (const category of categories ?? []) {
      categoryToTemplate.set(
        category.id as string,
        category.template_id as string
      );
    }

    for (const item of items ?? []) {
      const templateId = categoryToTemplate.get(item.category_id as string);
      if (templateId) {
        itemCountByTemplate.set(
          templateId,
          (itemCountByTemplate.get(templateId) ?? 0) + 1
        );
      }
    }
  }

  return data.map((row) =>
    mapTemplate({
      ...row,
      category_count: categoryCountByTemplate.get(row.id as string) ?? 0,
      item_count: itemCountByTemplate.get(row.id as string) ?? 0,
    })
  );
}

export interface CreateDeliveryReportInput {
  apartmentId: string;
  checklistTemplateId?: string;
  reportType?: string;
  tenantName?: string;
  tenantPhone?: string;
  deliveryDate?: string;
}

export async function createDeliveryReport(
  supabase: SupabaseClient,
  data: CreateDeliveryReportInput
): Promise<DeliveryReport> {
  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('יש להתחבר מחדש כדי ליצור דוח');
  }

  // Get user profile for organization_id
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('לא נמצא פרופיל משתמש');
  }

  // Calculate round number (count existing reports for this apartment + 1)
  const { count } = await supabase
    .from('delivery_reports')
    .select('id', { count: 'exact', head: true })
    .eq('apartment_id', data.apartmentId);

  const roundNumber = (count ?? 0) + 1;

  // Insert the report
  const { data: report, error: insertError } = await supabase
    .from('delivery_reports')
    .insert({
      apartment_id: data.apartmentId,
      organization_id: profile.organization_id,
      inspector_id: user.id,
      checklist_template_id: data.checklistTemplateId ?? null,
      report_type: data.reportType ?? 'delivery',
      round_number: roundNumber,
      status: 'draft',
      tenant_name: data.tenantName ?? null,
      tenant_phone: data.tenantPhone ?? null,
      report_date: data.deliveryDate ?? new Date().toISOString(),
    })
    .select('*')
    .single();

  if (insertError) throw insertError;
  if (!report) throw new Error('לא הצלחנו ליצור את הדוח');

  return mapReport(report);
}
