import { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as Linking from 'expo-linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import * as Haptics from '@/lib/haptics';
import Animated, { FadeIn } from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { useToast } from '@/hooks/useToast';
import { CameraPreview } from './CameraPreview';

// Lazy-load AnnotationEditor to avoid loading @shopify/react-native-skia on web
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnnotationEditor: React.ComponentType<any> =
  Platform.OS !== 'web'
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('./AnnotationEditor').AnnotationEditor
    : () => null;

import type { CapturedPhoto, AnnotationLayer } from '@/lib/annotations';

// --- Types ---

interface CameraCaptureProps {
  visible: boolean;
  onClose: () => void;
  onPhotosConfirmed: (photos: CapturedPhoto[]) => void;
  initialPhotoCount?: number;
  maxPhotos?: number;
}

interface PendingPreview {
  uri: string;
  width: number;
  height: number;
}

// --- Constants ---

const MAX_IMAGE_DIMENSION = 1200;
const JPEG_QUALITY = 0.7;
const DEFAULT_MAX_PHOTOS = 20;

// --- Component ---

export function CameraCapture({
  visible,
  onClose,
  onPhotosConfirmed,
  initialPhotoCount = 0,
  maxPhotos = DEFAULT_MAX_PHOTOS,
}: CameraCaptureProps) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  // Continuous capture state
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<PendingPreview | null>(null);
  const [showAnnotationEditor, setShowAnnotationEditor] = useState(false);
  const [pendingAnnotations, setPendingAnnotations] = useState<
    AnnotationLayer | undefined
  >(undefined);

  const totalCount = initialPhotoCount + capturedPhotos.length;
  const isAtMax = totalCount >= maxPhotos;

  // --- Helpers ---

  const resizePhoto = useCallback(async (localUri: string) => {
    const context = ImageManipulator.manipulate(localUri);
    const imageRef = await context
      .resize({ width: MAX_IMAGE_DIMENSION })
      .renderAsync();

    const result = await imageRef.saveAsync({
      compress: JPEG_QUALITY,
      format: SaveFormat.JPEG,
    });

    return result;
  }, []);

  const resetState = useCallback(() => {
    setCapturedPhotos([]);
    setPreviewPhoto(null);
    setShowAnnotationEditor(false);
    setPendingAnnotations(undefined);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // --- Permissions ---

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

  // --- Capture ---

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isProcessing) return;

    if (isAtMax) {
      showToast(`הגעת למקסימום של ${maxPhotos} תמונות`, 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });

      if (!photo?.uri) {
        throw new Error('No photo captured');
      }

      const resized = await resizePhoto(photo.uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      setPreviewPhoto({
        uri: resized.uri,
        width: resized.width,
        height: resized.height,
      });
      setPendingAnnotations(undefined);
    } catch {
      showToast('לא הצלחנו לצלם את התמונה. נסה שוב', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isAtMax, resizePhoto, showToast, maxPhotos]);

  // --- Preview actions ---

  const handlePreviewConfirm = useCallback(() => {
    if (!previewPhoto) return;

    const newPhoto: CapturedPhoto = {
      id: Crypto.randomUUID(),
      uri: previewPhoto.uri,
      width: previewPhoto.width,
      height: previewPhoto.height,
      annotations: pendingAnnotations,
    };

    setCapturedPhotos((prev) => [...prev, newPhoto]);
    setPreviewPhoto(null);
    setPendingAnnotations(undefined);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [previewPhoto, pendingAnnotations]);

  const handlePreviewEdit = useCallback(() => {
    setShowAnnotationEditor(true);
  }, []);

  const handlePreviewRetake = useCallback(() => {
    setPreviewPhoto(null);
    setPendingAnnotations(undefined);
  }, []);

  // --- Annotation editor actions ---

  const handleAnnotationSave = useCallback((annotations: AnnotationLayer) => {
    setPendingAnnotations(annotations);
    setShowAnnotationEditor(false);
  }, []);

  const handleAnnotationClose = useCallback(() => {
    setShowAnnotationEditor(false);
  }, []);

  // --- Done ---

  const handleDone = useCallback(() => {
    if (capturedPhotos.length === 0) return;
    const photos = capturedPhotos;
    resetState();
    onPhotosConfirmed(photos);
  }, [capturedPhotos, resetState, onPhotosConfirmed]);

  // Web: camera not supported
  if (Platform.OS === 'web') return null;

  // --- Permission screens ---

  if (!permission) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <ActivityIndicator size="large" color={COLORS.primary[500]} />
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          {/* Close button */}
          <Pressable
            onPress={handleClose}
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

  // --- Camera view ---

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          mode="picture"
        />

        {/* Close button — top start (RTL: top-left) */}
        <Pressable
          onPress={handleClose}
          style={[
            styles.cameraCloseButton,
            { top: insets.top + 16, start: 16 },
          ]}
          disabled={isProcessing}
        >
          <Feather name="x" size={24} color={COLORS.white} />
        </Pressable>

        {/* Badge counter — top end (RTL: top-right) */}
        {totalCount > 0 && (
          <Animated.View
            entering={FadeIn.duration(200)}
            style={[styles.badgeContainer, { top: insets.top + 16, end: 16 }]}
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalCount}</Text>
            </View>
          </Animated.View>
        )}

        {/* Done button — below badge, top end */}
        {capturedPhotos.length > 0 && (
          <Animated.View
            entering={FadeIn.duration(200)}
            style={[
              styles.doneButtonContainer,
              { top: insets.top + 68, end: 16 },
            ]}
          >
            <Pressable
              onPress={handleDone}
              style={({ pressed }) => [
                styles.doneButton,
                pressed && styles.doneButtonPressed,
              ]}
            >
              <Text style={styles.doneButtonText}>סיום</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Capture area — bottom center */}
        <View
          style={[
            styles.captureArea,
            { paddingBottom: Math.max(insets.bottom + 16, 32) },
          ]}
        >
          {isAtMax ? (
            <View style={styles.maxReachedContainer}>
              <Text style={styles.maxReachedText}>
                הגעת למקסימום של {maxPhotos} תמונות
              </Text>
              <Pressable onPress={handleDone} style={styles.doneButtonLarge}>
                <Text style={styles.doneButtonLargeText}>סיום וחזרה</Text>
              </Pressable>
            </View>
          ) : isProcessing ? (
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

        {/* CameraPreview overlay */}
        {previewPhoto && (
          <CameraPreview
            uri={previewPhoto.uri}
            onConfirm={handlePreviewConfirm}
            onEdit={handlePreviewEdit}
            onRetake={handlePreviewRetake}
          />
        )}
      </View>

      {/* Annotation editor — opens as full-screen modal inside */}
      {previewPhoto && (
        <AnnotationEditor
          visible={showAnnotationEditor}
          imageUri={previewPhoto.uri}
          imageWidth={previewPhoto.width}
          imageHeight={previewPhoto.height}
          initialAnnotations={pendingAnnotations}
          onSave={handleAnnotationSave}
          onClose={handleAnnotationClose}
        />
      )}
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
  badgeContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  badge: {
    minWidth: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    shadowColor: 'rgba(20, 19, 17, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    fontSize: 16,
    fontFamily: 'Rubik-Bold',
    fontWeight: '700',
    color: COLORS.white,
  },
  doneButtonContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: 'rgba(20, 19, 17, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  doneButtonPressed: {
    transform: [{ scale: 0.97 }],
  },
  doneButtonText: {
    fontSize: 14,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.white,
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
  maxReachedContainer: {
    alignItems: 'center',
    gap: 12,
  },
  maxReachedText: {
    fontSize: 13,
    fontFamily: 'Rubik-Regular',
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  doneButtonLarge: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary[500],
  },
  doneButtonLargeText: {
    fontSize: 16,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.white,
  },
});
