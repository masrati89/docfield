import { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import type { PhotoItem } from '@/components/defect/PhotoGrid';
import type { CapturedPhoto } from '@/lib/annotations';
import type { AnnotationLayer } from '@/lib/annotations';

// --- Constants ---

const MAX_PHOTOS = 20;

// --- Types ---

export interface UseDefectPhotosReturn {
  photos: PhotoItem[];
  setPhotos: (val: PhotoItem[]) => void;
  appendixDocs: { id: string; uri: string }[];
  setAppendixDocs: (val: { id: string; uri: string }[]) => void;
  cameraVisible: boolean;
  setCameraVisible: (val: boolean) => void;
  handleAddPhoto: () => void;
  handlePickFromGallery: () => Promise<void>;
  handlePhotosConfirmed: (captured: CapturedPhoto[]) => void;
  handleUpdateAnnotations: (
    photoId: string,
    annotations: AnnotationLayer
  ) => void;
  handleUpdateCaption: (photoId: string, caption: string) => void;
  handleDeletePhoto: (photoId: string) => Promise<void>;
}

// --- Hook ---

export function useDefectPhotos(input: {
  showToast: (msg: string, type: 'success' | 'error') => void;
}): UseDefectPhotosReturn {
  const { showToast } = input;

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [appendixDocs, setAppendixDocs] = useState<
    { id: string; uri: string }[]
  >([]);
  const [cameraVisible, setCameraVisible] = useState(false);

  const handleAddPhoto = useCallback(() => {
    if (photos.length >= MAX_PHOTOS) {
      showToast('ניתן להוסיף עד 20 תמונות', 'error');
      return;
    }
    setCameraVisible(true);
  }, [photos.length, showToast]);

  const handlePickFromGallery = useCallback(async () => {
    if (photos.length >= MAX_PHOTOS) {
      showToast('ניתן להוסיף עד 20 תמונות', 'error');
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast('נדרשת גישה לספריית התמונות כדי להוסיף תמונות', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photos.length,
    });

    if (result.canceled || !result.assets) return;

    const newPhotos: PhotoItem[] = result.assets.map((asset, i) => ({
      id: String(Date.now() + i),
      localUri: asset.uri,
      publicUrl: asset.uri,
      isUploading: false,
    }));

    setPhotos((prev) => [...prev, ...newPhotos].slice(0, MAX_PHOTOS));
  }, [photos.length, showToast]);

  const handlePhotosConfirmed = useCallback((captured: CapturedPhoto[]) => {
    const newPhotos: PhotoItem[] = captured.map((photo, i) => ({
      id: String(Date.now() + i),
      localUri: photo.uri,
      isUploading: false,
      annotations: photo.annotations,
    }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, MAX_PHOTOS));
    setCameraVisible(false);
  }, []);

  const handleUpdateAnnotations = useCallback(
    (photoId: string, annotations: AnnotationLayer) => {
      setPhotos((prev) =>
        prev.map((p) => (p.id === photoId ? { ...p, annotations } : p))
      );
    },
    []
  );

  const handleUpdateCaption = useCallback(
    (photoId: string, caption: string) => {
      setPhotos((prev) =>
        prev.map((p) => (p.id === photoId ? { ...p, caption } : p))
      );
    },
    []
  );

  const handleDeletePhoto = useCallback(
    async (photoId: string) => {
      const photo = photos.find((p) => p.id === photoId);
      if (!photo) return;

      // Remove from local state immediately
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));

      // If photo was saved to DB, delete from defect_photos table and storage
      if (photo.dbId) {
        try {
          await supabase.from('defect_photos').delete().eq('id', photo.dbId);
        } catch {
          // Photo already removed from UI — log silently
        }
      }

      if (photo.storagePath) {
        try {
          await supabase.storage
            .from('defect-photos')
            .remove([photo.storagePath]);
        } catch {
          // Storage deletion failed silently — not critical
        }
      }
    },
    [photos]
  );

  return {
    photos,
    setPhotos,
    appendixDocs,
    setAppendixDocs,
    cameraVisible,
    setCameraVisible,
    handleAddPhoto,
    handlePickFromGallery,
    handlePhotosConfirmed,
    handleUpdateAnnotations,
    handleUpdateCaption,
    handleDeletePhoto,
  };
}
