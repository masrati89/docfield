import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';

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
}

interface PhotoGridProps {
  photos: PhotoItem[];
  onAddPhoto: () => void;
  onDeletePhoto: (id: string) => void;
  maxReached?: boolean;
}

// --- Component ---

export function PhotoGrid({
  photos,
  onAddPhoto,
  onDeletePhoto,
  maxReached,
}: PhotoGridProps) {
  const isMaxReached = maxReached ?? photos.length >= MAX_PHOTOS;

  return (
    <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6 }}>
      {photos.map((ph) => {
        const imageUri = ph.localUri ?? ph.publicUrl;

        return (
          <View
            key={ph.id}
            style={{
              width: 64,
              height: 64,
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
                style={{ width: 64, height: 64 }}
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
                  backgroundColor: 'rgba(0,0,0,0.35)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ActivityIndicator size="small" color="#FFFFFF" />
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
          </View>
        );
      })}

      {/* Add photo button */}
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
            הוסף תמונה
          </Text>
        </Pressable>
      )}
    </View>
  );
}
