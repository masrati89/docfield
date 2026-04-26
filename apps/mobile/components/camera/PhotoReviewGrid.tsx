import { useState, useEffect, useCallback } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from '@/lib/haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

// Lazy-load AnnotationEditor to avoid loading @shopify/react-native-skia on web
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnnotationEditor: React.ComponentType<any> =
  Platform.OS !== 'web'
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('./AnnotationEditor').AnnotationEditor
    : () => null;

import type { CapturedPhoto, AnnotationLayer } from '@/lib/annotations';

// --- Constants ---

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_GAP = 4;
const GRID_COLUMNS = 3;
const THUMB_SIZE = Math.floor(
  (SCREEN_WIDTH - 24 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS
);

// --- Props ---

interface PhotoReviewGridProps {
  visible: boolean;
  photos: CapturedPhoto[];
  onPhotosConfirmed: (photos: CapturedPhoto[]) => void;
  onClose: () => void;
}

// --- Component ---

export function PhotoReviewGrid({
  visible,
  photos,
  onPhotosConfirmed,
  onClose,
}: PhotoReviewGridProps) {
  const insets = useSafeAreaInsets();
  const [localPhotos, setLocalPhotos] = useState<CapturedPhoto[]>(photos);
  const [enlargedPhoto, setEnlargedPhoto] = useState<CapturedPhoto | null>(
    null
  );
  const [editingPhoto, setEditingPhoto] = useState<CapturedPhoto | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    if (visible) setLocalPhotos(photos);
  }, [visible, photos]);

  const handleThumbnailPress = useCallback((photo: CapturedPhoto) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEnlargedPhoto(photo);
  }, []);

  const handleDelete = useCallback((photo: CapturedPhoto) => {
    setConfirmAction({
      title: 'מחיקת תמונה',
      message: 'האם למחוק את התמונה?',
      onConfirm: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setLocalPhotos((prev) => prev.filter((p) => p.id !== photo.id));
        setEnlargedPhoto(null);
      },
    });
  }, []);

  const handleEditPress = useCallback((photo: CapturedPhoto) => {
    setEnlargedPhoto(null);
    setEditingPhoto(photo);
  }, []);

  const handleAnnotationSave = useCallback(
    (annotations: AnnotationLayer) => {
      if (!editingPhoto) return;
      setLocalPhotos((prev) =>
        prev.map((p) => (p.id === editingPhoto.id ? { ...p, annotations } : p))
      );
      setEditingPhoto(null);
    },
    [editingPhoto]
  );

  const handleConfirm = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPhotosConfirmed(localPhotos);
  }, [localPhotos, onPhotosConfirmed]);

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={onClose}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.backBtn} hitSlop={8}>
              <Feather
                name="chevron-right"
                size={24}
                color={COLORS.neutral[700]}
              />
            </Pressable>
            <Text style={styles.title}>סקירת תמונות</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{localPhotos.length}</Text>
            </View>
          </View>

          {/* Grid */}
          {localPhotos.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather
                name="camera-off"
                size={40}
                color={COLORS.neutral[400]}
              />
              <Text style={styles.emptyText}>אין תמונות</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.grid}
              showsVerticalScrollIndicator={false}
            >
              {localPhotos.map((photo) => (
                <Pressable
                  key={photo.id}
                  onPress={() => handleThumbnailPress(photo)}
                  style={styles.thumbWrapper}
                >
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.thumb}
                    contentFit="cover"
                  />
                  {photo.annotations &&
                    photo.annotations.annotations.length > 0 && (
                      <View style={styles.annotationBadge}>
                        <Feather name="edit-2" size={10} color={COLORS.white} />
                      </View>
                    )}
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Confirm button */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <Pressable
              onPress={handleConfirm}
              style={({ pressed }) => [
                styles.confirmBtn,
                pressed && styles.confirmBtnPressed,
              ]}
            >
              <Text style={styles.confirmText}>אשר הכל</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Enlarged view */}
      <Modal
        visible={!!enlargedPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setEnlargedPhoto(null)}
      >
        <View style={styles.enlargedOverlay}>
          {enlargedPhoto && (
            <>
              <Image
                source={{ uri: enlargedPhoto.uri }}
                style={styles.enlargedImage}
                contentFit="contain"
              />
              <View style={styles.enlargedActions}>
                <Pressable
                  onPress={() => handleEditPress(enlargedPhoto)}
                  style={styles.actionBtn}
                >
                  <Text style={styles.editText}>ערוך</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(enlargedPhoto)}
                  style={styles.actionBtn}
                >
                  <Text style={styles.deleteText}>מחק</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </Modal>

      {/* Confirmation modal (replaces Alert.alert for cross-platform) */}
      <Modal
        visible={!!confirmAction}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmAction(null)}
      >
        <Pressable
          onPress={() => setConfirmAction(null)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              width: '100%',
              maxWidth: 320,
              backgroundColor: COLORS.cream[50],
              borderRadius: 14,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Rubik-SemiBold',
                color: COLORS.neutral[800],
                textAlign: 'right',
                marginBottom: 8,
              }}
            >
              {confirmAction?.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[600],
                textAlign: 'right',
                marginBottom: 20,
              }}
            >
              {confirmAction?.message}
            </Text>
            <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
              <Pressable
                onPress={() => {
                  confirmAction?.onConfirm();
                  setConfirmAction(null);
                }}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: COLORS.primary[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Rubik-SemiBold',
                    color: COLORS.white,
                  }}
                >
                  אישור
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setConfirmAction(null)}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: COLORS.cream[100],
                  borderWidth: 1,
                  borderColor: COLORS.cream[200],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Rubik-Medium',
                    color: COLORS.neutral[600],
                  }}
                >
                  ביטול
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Annotation editor */}
      {editingPhoto && (
        <AnnotationEditor
          visible={!!editingPhoto}
          imageUri={editingPhoto.uri}
          imageWidth={editingPhoto.width}
          imageHeight={editingPhoto.height}
          initialAnnotations={editingPhoto.annotations}
          onSave={handleAnnotationSave}
          onClose={() => setEditingPhoto(null)}
        />
      )}
    </>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream[50],
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cream[200],
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontFamily: 'Rubik-Bold',
    fontSize: 17,
    color: COLORS.neutral[900],
  },
  badge: {
    backgroundColor: COLORS.primary[500],
    borderRadius: BORDER_RADIUS.full,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 12,
    color: COLORS.white,
  },
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    padding: 12,
    gap: GRID_GAP,
  },
  thumbWrapper: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.cream[200],
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  annotationBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    color: COLORS.neutral[400],
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.cream[200],
  },
  confirmBtn: {
    backgroundColor: COLORS.primary[500],
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnPressed: {
    opacity: 0.85,
  },
  confirmText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    color: COLORS.white,
  },
  // Enlarged overlay
  enlargedOverlay: {
    flex: 1,
    backgroundColor: 'rgba(60,54,42,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enlargedImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2,
  },
  enlargedActions: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginTop: 20,
  },
  actionBtn: {
    backgroundColor: COLORS.cream[50],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  editText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 15,
    color: COLORS.primary[500],
  },
  deleteText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 15,
    color: COLORS.danger[500],
  },
});
