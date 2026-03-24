import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getDefectsByReport,
  createDefect,
  updateDefect,
  deleteDefect,
  uploadDefectPhoto,
  deleteDefectPhoto,
} from '@docfield/shared';
import type { CreateDefectInput, UpdateDefectInput } from '@docfield/shared';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export function useDefects(reportId: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['defects', reportId],
    queryFn: () => getDefectsByReport(supabase, reportId),
    enabled: !!reportId && !!session,
  });
}

export function useCreateDefect(reportId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDefectInput) => createDefect(supabase, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects', reportId] });
    },
  });
}

export function useUpdateDefect(reportId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      defectId,
      data,
    }: {
      defectId: string;
      data: UpdateDefectInput;
    }) => updateDefect(supabase, defectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects', reportId] });
    },
  });
}

export function useDeleteDefect(reportId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (defectId: string) => deleteDefect(supabase, defectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects', reportId] });
    },
  });
}

export function useUploadPhoto(reportId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: ({
      defectId,
      photoUri,
    }: {
      defectId: string;
      photoUri: string;
    }) =>
      uploadDefectPhoto(
        supabase,
        defectId,
        reportId,
        profile?.organizationId ?? '',
        photoUri
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects', reportId] });
    },
  });
}

export function useDeletePhoto(reportId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      photoId,
      imageUrl,
    }: {
      photoId: string;
      imageUrl: string;
    }) => deleteDefectPhoto(supabase, photoId, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects', reportId] });
    },
  });
}
