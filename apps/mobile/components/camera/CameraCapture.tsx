import { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as Linking from 'expo-linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';

// --- Types ---

interface CameraCaptureProps {
  visible: boolean;
  onCapture: (result: { localUri: string; publicUrl: string }) => void;
  onClose: () => void;
  organizationId: string;
  reportId: string;
}

// --- Constants ---

const MAX_IMAGE_DIMENSION = 1200;
const JPEG_QUALITY = 0.7;
const STORAGE_BUCKET = 'defect-photos';

// --- Component ---

export function CameraCapture({
  visible,
  onCapture,
  onClose,
  organizationId,
  reportId,
}: CameraCaptureProps) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  const handleRequestPermission = useCallback(async () => {
    try {
      await requestPermission();
    } catch {
      showToast('אירעה שגיאה בבקשת הרשאת מצלמה', 'error');
    }
  }, [requestPermission, showToast]);

  const handleOpenSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const processAndUpload = useCallback(
    async (localUri: string) => {
      // Resize image using the new contextual API
      const context = ImageManipulator.manipulate(localUri);
      const imageRef = await context
        .resize({ width: MAX_IMAGE_DIMENSION })
        .renderAsync();

      const result = await imageRef.saveAsync({
        compress: JPEG_QUALITY,
        format: SaveFormat.JPEG,
      });

      const resizedUri = result.uri;

      // Generate unique filename
      const uuid = Crypto.randomUUID();
      const filePath = `${organizationId}/${reportId}/${uuid}.jpg`;

      // Read the file and upload
      const response = await fetch(resizedUri);
      const blob = await response.blob();

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

      return { localUri: resizedUri, publicUrl };
    },
    [organizationId, reportId]
  );

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (!photo?.uri) {
        throw new Error('No photo captured');
      }

      const result = await processAndUpload(photo.uri);
      onCapture(result);
      onClose();
    } catch {
      showToast('לא הצלחנו להעלות את התמונה. נסה שוב', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, processAndUpload, onCapture, onClose, showToast]);

  // Permission not yet determined
  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <ActivityIndicator size="large" color={COLORS.primary[500]} />
        </View>
      </Modal>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={[styles.container, { paddingTop: insets.top }]}>
          {/* Close button */}
          <Pressable
            onPress={onClose}
            style={[styles.closeButton, { top: insets.top + 16, start: 16 }]}
          >
            <Feather name="x" size={24} color={COLORS.neutral[800]} />
          </Pressable>

          {/* Permission denied message */}
          <View style={styles.permissionContainer}>
            <View style={styles.permissionIconCircle}>
              <Feather
                name="camera-off"
                size={48}
                color={COLORS.neutral[400]}
              />
            </View>
            <Text style={styles.permissionTitle}>נדרשת הרשאת מצלמה</Text>
            <Text style={styles.permissionDescription}>
              כדי לצלם תמונות של ממצאים, יש לאפשר גישה למצלמה.
              {'\n'}
              ניתן לשנות זאת בהגדרות המכשיר.
            </Text>

            {permission.canAskAgain ? (
              <Pressable
                onPress={handleRequestPermission}
                style={styles.permissionButton}
              >
                <Text style={styles.permissionButtonText}>
                  אפשר גישה למצלמה
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleOpenSettings}
                style={styles.permissionButton}
              >
                <Feather name="settings" size={16} color={COLORS.white} />
                <Text style={styles.permissionButtonText}>פתח הגדרות</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  // Camera view
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          mode="picture"
        />

        {/* Close button - top start (RTL: top-left) */}
        <Pressable
          onPress={onClose}
          style={[
            styles.cameraCloseButton,
            { top: insets.top + 16, start: 16 },
          ]}
          disabled={isProcessing}
        >
          <Feather name="x" size={24} color={COLORS.white} />
        </Pressable>

        {/* Capture button - bottom center */}
        <View
          style={[
            styles.captureArea,
            { paddingBottom: Math.max(insets.bottom + 16, 32) },
          ]}
        >
          {isProcessing ? (
            <View style={styles.captureButtonOuter}>
              <View style={styles.captureButtonProcessing}>
                <ActivityIndicator size="small" color={COLORS.white} />
              </View>
            </View>
          ) : (
            <Pressable
              onPress={handleCapture}
              style={({ pressed }) => [
                styles.captureButtonOuter,
                pressed && styles.captureButtonPressed,
              ]}
            >
              <View style={styles.captureButtonInner} />
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.cream[200],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  permissionContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionIconCircle: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.cream[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontFamily: 'Rubik-Bold',
    fontWeight: '700',
    color: COLORS.neutral[800],
    textAlign: 'center',
    marginBottom: 12,
  },
  permissionDescription: {
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    fontWeight: '400',
    color: COLORS.neutral[500],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  permissionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary[500],
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.white,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  cameraCloseButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(20, 19, 17, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  captureArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  captureButtonOuter: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 4,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.white,
  },
  captureButtonProcessing: {
    width: 58,
    height: 58,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
