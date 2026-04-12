import { supabase } from '@/lib/supabase';

// --- Types ---

interface PreviousDefect {
  id: string;
  organization_id: string;
  description: string;
  room: string | null;
  category: string | null;
  severity: string;
  status: string;
  standard_ref: string | null;
  recommendation: string | null;
  notes: string | null;
  cost: number | null;
  cost_unit: string | null;
  sort_order: number;
}

interface PreviousPhoto {
  defect_id: string;
  organization_id: string;
  image_url: string;
  thumbnail_url: string | null;
  annotations: unknown;
  sort_order: number;
}

// --- Function ---

/**
 * Copies unresolved defects from a previous round (round N) into a new round
 * (round N+1). Each copied defect is marked `source = 'inherited'`,
 * `review_status = 'pending_review'`, and `source_defect_id` points to the
 * original. Photos are cloned so each round has its own independent rows that
 * reference the same storage objects.
 *
 * Only defects with `status IN ('open', 'in_progress', 'not_fixed')` are
 * copied. Fixed defects stay behind in the previous round.
 *
 * The new report itself is expected to already exist and have its own ID.
 *
 * Safe to call when `previousRoundId` is null — it becomes a no-op.
 *
 * @returns The number of defects copied forward. 0 if no previous round,
 *   or if the previous round had no unresolved defects.
 */
export async function copyInheritedDefects(params: {
  newReportId: string;
  previousRoundId: string | null;
}): Promise<number> {
  const { newReportId, previousRoundId } = params;
  if (!previousRoundId) return 0;

  // Defense in depth: resolve the org_id from the *new* report rather than
  // trusting whatever organization_id comes back on the previous defects. RLS
  // already prevents cross-tenant reads, but this guarantees inherited rows
  // are always stamped with the current report's org even if RLS were ever
  // relaxed.
  const { data: newReport, error: newReportError } = await supabase
    .from('delivery_reports')
    .select('organization_id')
    .eq('id', newReportId)
    .single();

  if (newReportError) throw newReportError;
  const orgId = (newReport as { organization_id: string } | null)
    ?.organization_id;
  if (!orgId) {
    throw new Error('copyInheritedDefects: new report has no organization_id');
  }

  // Fetch unresolved defects from previous round
  const { data: prevDefects, error: prevError } = await supabase
    .from('defects')
    .select(
      `id, organization_id, description, room, category, severity, status,
       standard_ref, recommendation, notes, cost, cost_unit, sort_order`
    )
    .eq('delivery_report_id', previousRoundId)
    .in('status', ['open', 'in_progress', 'not_fixed'])
    .order('sort_order', { ascending: true });

  if (prevError) throw prevError;
  if (!prevDefects || prevDefects.length === 0) return 0;

  const defects = prevDefects as unknown as PreviousDefect[];

  // Insert new defect rows
  const insertRows = defects.map((d, idx) => ({
    delivery_report_id: newReportId,
    organization_id: orgId,
    description: d.description,
    room: d.room,
    category: d.category,
    severity: d.severity,
    status: 'open',
    source: 'inherited' as const,
    source_defect_id: d.id,
    review_status: 'pending_review' as const,
    standard_ref: d.standard_ref,
    recommendation: d.recommendation,
    notes: d.notes,
    cost: d.cost,
    cost_unit: d.cost_unit,
    sort_order: idx,
  }));

  const { data: insertedRows, error: insertError } = await supabase
    .from('defects')
    .insert(insertRows)
    .select('id, source_defect_id, organization_id');

  if (insertError) throw insertError;
  if (!insertedRows || insertedRows.length === 0) return 0;

  // Build map: original defect id → new defect id
  const idMap = new Map<string, string>();
  for (const row of insertedRows as unknown as Array<{
    id: string;
    source_defect_id: string;
  }>) {
    idMap.set(row.source_defect_id, row.id);
  }

  // Copy photos for each inherited defect
  const originalIds = defects.map((d) => d.id);
  const { data: photos, error: photosError } = await supabase
    .from('defect_photos')
    .select(
      'defect_id, organization_id, image_url, thumbnail_url, annotations, sort_order'
    )
    .in('defect_id', originalIds);

  if (photosError) throw photosError;

  if (photos && photos.length > 0) {
    const photoRows = (photos as unknown as PreviousPhoto[])
      .map((p) => {
        const newDefectId = idMap.get(p.defect_id);
        if (!newDefectId) return null;
        return {
          defect_id: newDefectId,
          organization_id: orgId,
          image_url: p.image_url,
          thumbnail_url: p.thumbnail_url,
          annotations: p.annotations,
          sort_order: p.sort_order,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    if (photoRows.length > 0) {
      const { error: photoInsertError } = await supabase
        .from('defect_photos')
        .insert(photoRows);

      if (photoInsertError) throw photoInsertError;
    }
  }

  return insertedRows.length;
}
