import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useUploadPhoto } from '@/hooks/useDefects';
import { DefectCamera } from '@/components/camera/DefectCamera';

export default function CameraScreen() {
  const router = useRouter();
  const { reportId, defectId } = useLocalSearchParams<{
    reportId: string;
    defectId: string;
  }>();

  const uploadPhoto = useUploadPhoto(reportId ?? '');

  const handlePhotoTaken = useCallback(
    async (uri: string) => {
      try {
        await uploadPhoto.mutateAsync({
          defectId: defectId ?? '',
          photoUri: uri,
        });
        router.back();
      } catch {
        Alert.alert('שגיאה', 'לא הצלחנו להעלות את התמונה. נסה שוב.');
        router.back();
      }
    },
    [uploadPhoto, defectId, router]
  );

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  return <DefectCamera onPhotoTaken={handlePhotoTaken} onClose={handleClose} />;
}
