import { useCallback, useState } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Crypto from 'expo-crypto';
import { decode } from 'base64-arraybuffer';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { PdfSignature } from '@/lib/pdf';

// --- Types ---

interface UseSignatureReturn {
  inspectorSignatureUrl: string | null;
  inspectorStampUrl: string | null;
  saveInspectorSignature: (base64Png: string) => Promise<void>;
  deleteInspectorSignature: () => Promise<void>;
  saveInspectorStamp: (imageUri: string) => Promise<void>;
  deleteInspectorStamp: () => Promise<void>;
  saveTenantSignature: (
    reportId: string,
    name: string,
    base64Png: string
  ) => Promise<void>;
  getTenantSignature: (reportId: string) => Promise<PdfSignature | null>;
  isUploading: boolean;
  error: string | null;
  errorMessage: string | null;
  clearError: () => void;
}

// --- Hook ---

export function useSignature(): UseSignatureReturn {
  const { profile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearError = useCallback(() => setErrorMessage(null), []);

  const inspectorSignatureUrl = profile?.signatureUrl ?? null;
  const inspectorStampUrl = profile?.stampUrl ?? null;

  // Save inspector signature (base64 PNG from SignaturePad)
  const saveInspectorSignature = useCallback(
    async (base64Png: string) => {
      if (!profile) return;
      setIsUploading(true);
      setError(null);

      try {
        const arrayBuffer = decode(base64Png);
        const hash = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          base64Png
        );
        const filePath = `${profile.organizationId}/inspector_${profile.id}_${hash.slice(0, 8)}.png`;

        const { error: uploadError } = await supabase.storage
          .from('signatures')
          .upload(filePath, arrayBuffer, {
            contentType: 'image/png',
          });

        if (uploadError) throw uploadError;

        const { data: signedData, error: signedError } = await supabase.storage
          .from('signatures')
          .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year

        if (signedError || !signedData?.signedUrl) {
          throw signedError ?? new Error('Failed to create signed URL');
        }

        const { error: updateError } = await supabase
          .from('users')
          .update({ signature_url: signedData.signedUrl })
          .eq('id', profile.id);

        if (updateError) throw updateError;
      } catch {
        const msg = 'שגיאה בשמירת החתימה';
        setError(msg);
        setErrorMessage(msg);
      } finally {
        setIsUploading(false);
      }
    },
    [profile]
  );

  // Delete inspector signature (immutable — just nullify URL reference)
  const deleteInspectorSignature = useCallback(async () => {
    if (!profile) return;
    setIsUploading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ signature_url: null })
        .eq('id', profile.id);

      if (updateError) throw updateError;
    } catch {
      const msg = 'שגיאה במחיקת החתימה';
      setError(msg);
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  }, [profile]);

  // Save inspector stamp (image URI from picker)
  const saveInspectorStamp = useCallback(
    async (imageUri: string) => {
      if (!profile) return;
      setIsUploading(true);
      setError(null);

      try {
        // Resize image to max width 300
        const manipulated = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: 300 } }],
          { format: ImageManipulator.SaveFormat.PNG }
        );

        // Fetch resized image as blob and convert to ArrayBuffer
        const response = await fetch(manipulated.uri);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        const hash = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          await blob.text()
        );
        const filePath = `${profile.organizationId}/stamp_${profile.id}_${hash.slice(0, 8)}.png`;

        const { error: uploadError } = await supabase.storage
          .from('signatures')
          .upload(filePath, arrayBuffer, {
            contentType: 'image/png',
          });

        if (uploadError) throw uploadError;

        const { data: signedData, error: signedError } = await supabase.storage
          .from('signatures')
          .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year

        if (signedError || !signedData?.signedUrl) {
          throw signedError ?? new Error('Failed to create signed URL');
        }

        const { error: updateError } = await supabase
          .from('users')
          .update({ stamp_url: signedData.signedUrl })
          .eq('id', profile.id);

        if (updateError) throw updateError;
      } catch {
        const msg = 'שגיאה בשמירת החותמת';
        setError(msg);
        setErrorMessage(msg);
      } finally {
        setIsUploading(false);
      }
    },
    [profile]
  );

  // Delete inspector stamp (immutable — just nullify URL reference)
  const deleteInspectorStamp = useCallback(async () => {
    if (!profile) return;
    setIsUploading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ stamp_url: null })
        .eq('id', profile.id);

      if (updateError) throw updateError;
    } catch {
      const msg = 'שגיאה במחיקת החותמת';
      setError(msg);
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  }, [profile]);

  // Save tenant signature for a specific report
  const saveTenantSignature = useCallback(
    async (reportId: string, name: string, base64Png: string) => {
      if (!profile) return;
      setIsUploading(true);
      setError(null);

      try {
        const uuid = Math.random().toString(36).slice(2, 10);
        const filePath = `${profile.organizationId}/${reportId}/tenant_${uuid}.png`;
        const arrayBuffer = decode(base64Png);

        const { error: uploadError } = await supabase.storage
          .from('signatures')
          .upload(filePath, arrayBuffer, {
            contentType: 'image/png',
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: signedData, error: signedError } = await supabase.storage
          .from('signatures')
          .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year

        if (signedError || !signedData?.signedUrl) {
          throw signedError ?? new Error('Failed to create signed URL');
        }

        const { error: insertError } = await supabase
          .from('signatures')
          .insert({
            delivery_report_id: reportId,
            organization_id: profile.organizationId,
            signer_type: 'tenant',
            signer_name: name,
            image_url: signedData.signedUrl,
          });

        if (insertError) throw insertError;
      } catch {
        const msg = 'שגיאה בשמירת חתימת הדייר';
        setError(msg);
        setErrorMessage(msg);
      } finally {
        setIsUploading(false);
      }
    },
    [profile]
  );

  // Get tenant signature for a report
  const getTenantSignature = useCallback(
    async (reportId: string): Promise<PdfSignature | null> => {
      try {
        const { data, error: queryError } = await supabase
          .from('signatures')
          .select('*')
          .eq('delivery_report_id', reportId)
          .eq('signer_type', 'tenant')
          .maybeSingle();

        if (queryError || !data) return null;

        return {
          signerType: 'tenant',
          signerName: data.signer_name,
          imageUrl: data.image_url ?? undefined,
          signedAt: data.created_at,
        };
      } catch {
        return null;
      }
    },
    []
  );

  return {
    inspectorSignatureUrl,
    inspectorStampUrl,
    saveInspectorSignature,
    deleteInspectorSignature,
    saveInspectorStamp,
    deleteInspectorStamp,
    saveTenantSignature,
    getTenantSignature,
    isUploading,
    error,
    errorMessage,
    clearError,
  };
}
