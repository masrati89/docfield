import type { SupabaseClient } from '@supabase/supabase-js';

import type {
  ChecklistCategory,
  ChecklistItem,
} from '../types/checklist.types';
import type {
  ChecklistResult,
  ChecklistResultValue,
} from '../types/inspection.types';

// --- Response types ---

export interface ChecklistItemWithResult extends ChecklistItem {
  result?: ChecklistResultValue;
  note?: string;
  resultId?: string;
}

export interface ChecklistSection {
  category: ChecklistCategory;
  items: ChecklistItemWithResult[];
}

// --- Supabase row mappers ---

function mapCategory(row: Record<string, unknown>): ChecklistCategory {
  const createdAt = row.created_at as string;
  return {
    id: row.id as string,
    templateId: row.template_id as string,
    name: row.name as string,
    sortOrder: row.sort_order as number,
    createdAt,
    updatedAt: (row.updated_at as string) ?? createdAt,
  };
}

function mapItem(row: Record<string, unknown>): ChecklistItem {
  const createdAt = row.created_at as string;
  return {
    id: row.id as string,
    categoryId: row.category_id as string,
    description: row.description as string,
    defaultSeverity: row.default_severity as ChecklistItem['defaultSeverity'],
    requiresPhoto: row.requires_photo as boolean,
    sortOrder: row.sort_order as number,
    createdAt,
    updatedAt: (row.updated_at as string) ?? createdAt,
  };
}

function mapResult(row: Record<string, unknown>): ChecklistResult {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    deliveryReportId: row.delivery_report_id as string,
    checklistItemId: row.checklist_item_id as string,
    result: row.result as ChecklistResultValue,
    note: (row.note as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// --- API Functions ---

/**
 * Fetch checklist items grouped by category, merged with existing results.
 */
export async function getChecklistWithResults(
  supabase: SupabaseClient,
  templateId: string,
  reportId: string
): Promise<ChecklistSection[]> {
  // Fetch categories for this template
  const { data: categoryRows, error: categoryError } = await supabase
    .from('checklist_categories')
    .select('*')
    .eq('template_id', templateId)
    .order('sort_order', { ascending: true });

  if (categoryError) throw categoryError;
  if (!categoryRows || categoryRows.length === 0) return [];

  const categories = categoryRows.map(mapCategory);
  const categoryIds = categories.map((category) => category.id);

  // Fetch items for all categories
  const { data: itemRows, error: itemError } = await supabase
    .from('checklist_items')
    .select('*')
    .in('category_id', categoryIds)
    .order('sort_order', { ascending: true });

  if (itemError) throw itemError;

  const items = (itemRows ?? []).map(mapItem);

  // Fetch existing results for this report
  const { data: resultRows, error: resultError } = await supabase
    .from('checklist_results')
    .select('*')
    .eq('delivery_report_id', reportId);

  if (resultError) throw resultError;

  const results = (resultRows ?? []).map(mapResult);

  // Build a lookup: checklistItemId → result
  const resultByItemId = new Map<string, ChecklistResult>();
  for (const result of results) {
    resultByItemId.set(result.checklistItemId, result);
  }

  // Group items by category, merge with results
  const sections: ChecklistSection[] = categories.map((category) => {
    const categoryItems = items
      .filter((item) => item.categoryId === category.id)
      .map((item): ChecklistItemWithResult => {
        const existing = resultByItemId.get(item.id);
        return {
          ...item,
          result: existing?.result,
          note: existing?.note,
          resultId: existing?.id,
        };
      });

    return { category, items: categoryItems };
  });

  // Filter out empty categories
  return sections.filter((section) => section.items.length > 0);
}

/**
 * Upsert a checklist result (insert or update on conflict).
 */
export async function upsertChecklistResult(
  supabase: SupabaseClient,
  data: {
    deliveryReportId: string;
    checklistItemId: string;
    result: ChecklistResultValue;
    note?: string;
  }
): Promise<ChecklistResult> {
  // Get user's organization_id
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('יש להתחבר מחדש');
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('לא נמצא פרופיל משתמש');
  }

  const { data: row, error } = await supabase
    .from('checklist_results')
    .upsert(
      {
        delivery_report_id: data.deliveryReportId,
        checklist_item_id: data.checklistItemId,
        organization_id: profile.organization_id,
        result: data.result,
        note: data.note ?? null,
      },
      {
        onConflict: 'delivery_report_id,checklist_item_id',
      }
    )
    .select('*')
    .single();

  if (error) throw error;
  if (!row) throw new Error('לא הצלחנו לשמור את התוצאה');

  return mapResult(row);
}
