import type { SupabaseClient } from '@supabase/supabase-js';

import type { Defect, DefectPhoto } from '../types/defect.types';
import type {
  CreateDefectInput,
  UpdateDefectInput,
} from '../validation/defect.schema';

// --- Response types ---

export interface DefectWithPhotos extends Defect {
  photos: DefectPhoto[];
}

// --- Supabase row mappers ---

function mapDefect(row: Record<string, unknown>): Defect {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    deliveryReportId: row.delivery_report_id as string,
    checklistResultId: (row.checklist_result_id as string) ?? undefined,
    description: row.description as string,
    room: (row.room as string) ?? '',
    category: (row.category as string) ?? '',
    severity: row.severity as Defect['severity'],
    status: row.status as Defect['status'],
    source: row.source as Defect['source'],
    sortOrder: (row.sort_order as number) ?? 0,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapPhoto(row: Record<string, unknown>): DefectPhoto {
  return {
    id: row.id as string,
    defectId: row.defect_id as string,
    organizationId: row.organization_id as string,
    imageUrl: row.image_url as string,
    thumbnailUrl: (row.thumbnail_url as string) ?? undefined,
    annotations: (row.annotations as DefectPhoto['annotations']) ?? [],
    sortOrder: (row.sort_order as number) ?? 0,
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string) ?? (row.created_at as string),
  };
}

// --- API Functions ---

/**
 * Fetch all defects for a report with their photos.
 */
export async function getDefectsByReport(
  supabase: SupabaseClient,
  reportId: string
): Promise<DefectWithPhotos[]> {
  const { data: defectRows, error: defectError } = await supabase
    .from('defects')
    .select('*')
    .eq('delivery_report_id', reportId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (defectError) throw defectError;
  if (!defectRows || defectRows.length === 0) return [];

  const defects = defectRows.map(mapDefect);
  const defectIds = defects.map((defect) => defect.id);

  // Fetch all photos for these defects
  const { data: photoRows, error: photoError } = await supabase
    .from('defect_photos')
    .select('*')
    .in('defect_id', defectIds)
    .order('sort_order', { ascending: true });

  if (photoError) throw photoError;

  const photos = (photoRows ?? []).map(mapPhoto);

  // Group photos by defect_id
  const photosByDefect = new Map<string, DefectPhoto[]>();
  for (const photo of photos) {
    const existing = photosByDefect.get(photo.defectId) ?? [];
    existing.push(photo);
    photosByDefect.set(photo.defectId, existing);
  }

  return defects.map((defect) => ({
    ...defect,
    photos: photosByDefect.get(defect.id) ?? [],
  }));
}

/**
 * Create a new defect.
 */
export async function createDefect(
  supabase: SupabaseClient,
  data: CreateDefectInput
): Promise<Defect> {
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
    .from('defects')
    .insert({
      delivery_report_id: data.deliveryReportId,
      organization_id: profile.organization_id,
      checklist_result_id: data.checklistResultId ?? null,
      description: data.description,
      room: data.room,
      category: data.category,
      severity: data.severity,
      source: data.source ?? 'manual',
      status: 'open',
    })
    .select('*')
    .single();

  if (error) throw error;
  if (!row) throw new Error('לא הצלחנו ליצור את הליקוי');

  return mapDefect(row);
}

/**
 * Update an existing defect.
 */
export async function updateDefect(
  supabase: SupabaseClient,
  defectId: string,
  data: UpdateDefectInput
): Promise<Defect> {
  const updateData: Record<string, unknown> = {};

  if (data.description !== undefined) updateData.description = data.description;
  if (data.room !== undefined) updateData.room = data.room;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.severity !== undefined) updateData.severity = data.severity;
  if (data.status !== undefined) updateData.status = data.status;

  const { data: row, error } = await supabase
    .from('defects')
    .update(updateData)
    .eq('id', defectId)
    .select('*')
    .single();

  if (error) throw error;
  if (!row) throw new Error('לא הצלחנו לעדכן את הליקוי');

  return mapDefect(row);
}

/**
 * Delete a defect.
 */
export async function deleteDefect(
  supabase: SupabaseClient,
  defectId: string
): Promise<void> {
  const { error } = await supabase.from('defects').delete().eq('id', defectId);

  if (error) throw error;
}

/**
 * Upload a photo for a defect to Supabase Storage.
 */
export async function uploadDefectPhoto(
  supabase: SupabaseClient,
  defectId: string,
  reportId: string,
  organizationId: string,
  photoUri: string
): Promise<DefectPhoto> {
  // Read file and create blob
  const response = await fetch(photoUri);
  const blob = await response.blob();

  const fileExtension = 'jpg';
  const fileName = `${crypto.randomUUID()}.${fileExtension}`;
  const storagePath = `${organizationId}/${reportId}/${defectId}/${fileName}`;

  // Upload to Storage
  const { error: uploadError } = await supabase.storage
    .from('defect-photos')
    .upload(storagePath, blob, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('defect-photos')
    .getPublicUrl(storagePath);

  // Insert record in defect_photos table
  const { data: row, error: insertError } = await supabase
    .from('defect_photos')
    .insert({
      defect_id: defectId,
      organization_id: organizationId,
      image_url: urlData.publicUrl,
    })
    .select('*')
    .single();

  if (insertError) throw insertError;
  if (!row) throw new Error('לא הצלחנו לשמור את התמונה');

  return mapPhoto(row);
}

/**
 * Delete a defect photo from Storage and DB.
 */
export async function deleteDefectPhoto(
  supabase: SupabaseClient,
  photoId: string,
  imageUrl: string
): Promise<void> {
  // Extract storage path from URL
  const urlParts = imageUrl.split('/defect-photos/');
  const storagePath = urlParts[1];
  if (storagePath) {
    await supabase.storage.from('defect-photos').remove([storagePath]);
  }

  // Delete from DB
  const { error } = await supabase
    .from('defect_photos')
    .delete()
    .eq('id', photoId);

  if (error) throw error;
}
