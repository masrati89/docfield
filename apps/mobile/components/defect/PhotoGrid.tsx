import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';

// Lazy-load AnnotationEditor to avoid loading @shopify/react-native-skia on web
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnnotationEditor: React.ComponentType<any> =
  Platform.OS !== 'web'
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('@/components/camera/AnnotationEditor').AnnotationEditor
    : () => null;
import type { AnnotationLayer } from '@/lib/annotations';

// --- Constants ---

const MAX_PHOTOS = 10;

// --- Types ---

export interface PhotoItem {
  id: string;
  localUri?: string;
  publicUrl?: string;
  isUploading?: boolean;
  dbId?: string; // defect_photos row ID, set after saving to DB
  storagePath?: string; // storage path for deletion
  annotations?: AnnotationLayer;
  caption?: string;
}

interface PhotoGridProps {
  photos: PhotoItem[];
  onAddPhoto: () => void;
  onPickFromGallery?: () => void;
  onDeletePhoto: (id: string) => void;
  onUpdateAnnotations?: (id: string, annotations: AnnotationLayer) => void;
  onUpdateCaption?: (id: string, caption: string) => void;
  maxReached?: boolean;
}

// --- Component ---

export function PhotoGrid({
  photos,
  onAddPhoto,
  onPickFromGallery,
  onDeletePhoto,
  onUpdateAnnotations,
  onUpdateCaption,
  maxReached,
}: PhotoGridProps) {
  const isMaxReached = maxReached ?? photos.length >= MAX_PHOTOS;
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);

  const handleAnnotationSave = (annotations: AnnotationLayer) => {
    if (editingPhoto && onUpdateAnnotations) {
      onUpdateAnnotations(editingPhoto.id, annotations);
    }
    setEditingPhoto(null);
  };

  return (
    <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 }}>
      {photos.map((ph) => {
        const imageUri = ph.localUri ?? ph.publicUrl;

        return (
          <View key={ph.id} style={{ width: 80, alignItems: 'center' }}>
            <Pressable
              onPress={() => {
                if (onUpdateAnnotations && imageUri) {
                  setEditingPhoto(ph);
                }
              }}
              style={{
                width: 72,
                height: 72,
                borderRadius: 8,
                backgroundColor: COLORS.cream[200],
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: COLORS.cream[300],
                overflow: 'hidden',
              }}
            >
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: 72, height: 72 }}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <Feather name="image" size={20} color={COLORS.neutral[400]} />
              )}

              {/* Upload indicator */}
              {ph.isUploading && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(60,54,42,0.35)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ActivityIndicator size="small" color="#FFFFFF" />
                </View>
              )}

              {/* Annotation indicator */}
              {ph.annotations && ph.annotations.annotations.length > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    left: 2,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: COLORS.primary[500],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="edit-2" size={8} color="#FFFFFF" />
                </View>
              )}

              {/* Remove button */}
              <Pressable
                onPress={() => onDeletePhoto(ph.id)}
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: COLORS.danger[500],
                  borderWidth: 2,
                  borderColor: COLORS.cream[50],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="x" size={16} color="#FFFFFF" />
              </Pressable>
            </Pressable>

            {/* Caption input */}
            {onUpdateCaption && (
              <TextInput
                value={ph.caption ?? ''}
                onChangeText={(text) => onUpdateCaption(ph.id, text)}
                placeholder="כיתוב..."
                placeholderTextColor={COLORS.neutral[400]}
                style={{
                  width: 80,
                  fontSize: 10,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[700],
                  textAlign: 'center',
                  marginTop: 3,
                  paddingVertical: 2,
                  paddingHorizontal: 4,
                  backgroundColor: COLORS.cream[100],
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: COLORS.cream[200],
                }}
              />
            )}
          </View>
        );
      })}

      {/* Camera button */}
      {!isMaxReached && (
        <Pressable
          onPress={onAddPhoto}
          style={({ pressed }) => ({
            width: 64,
            height: 64,
            borderRadius: 8,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: COLORS.primary[200],
            backgroundColor: pressed ? COLORS.primary[100] : COLORS.primary[50],
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
          })}
        >
          <Feather name="camera" size={20} color={COLORS.primary[500]} />
          <Text
            style={{
              fontSize: 10,
              fontWeight: '500',
              color: COLORS.primary[500],
              fontFamily: 'Rubik-Medium',
            }}
          >
            צלם
          </Text>
        </Pressable>
      )}

      {/* Gallery button */}
      {!isMaxReached && onPickFromGallery && (
        <Pressable
          onPress={onPickFromGallery}
          style={({ pressed }) => ({
            width: 64,
            height: 64,
            borderRadius: 8,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: COLORS.gold[300],
            backgroundColor: pressed ? COLORS.gold[100] : COLORS.cream[50],
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
          })}
        >
          <Feather name="image" size={20} color={COLORS.gold[700]} />
          <Text
            style={{
              fontSize: 10,
              fontWeight: '500',
              color: COLORS.gold[700],
              fontFamily: 'Rubik-Medium',
            }}
          >
            גלריה
          </Text>
        </Pressable>
      )}

      {/* Annotation editor modal */}
      {editingPhoto && (
        <AnnotationEditor
          visible={!!editingPhoto}
          imageUri={editingPhoto.localUri ?? editingPhoto.publicUrl ?? ''}
          imageWidth={1200}
          imageHeight={900}
          initialAnnotations={editingPhoto.annotations}
          onSave={handleAnnotationSave}
          onClose={() => setEditingPhoto(null)}
        />
      )}
    </View>
  );
}
