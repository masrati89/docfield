import { Text, Pressable, FlatList, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';
import type { DefectPhoto } from '@docfield/shared';

interface PhotoGalleryProps {
  photos: DefectPhoto[];
  onAddPhoto: () => void;
  onDeletePhoto: (photoId: string, imageUrl: string) => void;
}

const PHOTO_SIZE = 100;

function PhotoThumbnail({
  photo,
  onDelete,
}: {
  photo: DefectPhoto;
  onDelete: () => void;
}) {
  const handleLongPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert('מחיקת תמונה', 'למחוק את התמונה?', [
      { text: 'ביטול', style: 'cancel' },
      {
        text: 'מחק',
        style: 'destructive',
        onPress: onDelete,
      },
    ]);
  };

  return (
    <Animated.View entering={FadeIn.duration(200)}>
      <Pressable onLongPress={handleLongPress} delayLongPress={500}>
        <Image
          source={{ uri: photo.imageUrl }}
          style={{
            width: PHOTO_SIZE,
            height: PHOTO_SIZE,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: COLORS.cream[200],
          }}
          contentFit="cover"
          transition={200}
        />
      </Pressable>
    </Animated.View>
  );
}

function AddPhotoButton({ onPress }: { onPress: () => void }) {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      className="items-center justify-center active:bg-cream-100"
      style={{
        width: PHOTO_SIZE,
        height: PHOTO_SIZE,
        borderRadius: 14,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: COLORS.neutral[300],
      }}
    >
      <Feather name="camera" size={24} color={COLORS.neutral[400]} />
      <Text className="text-[11px] font-rubik text-neutral-400 mt-[4px]">
        צלם
      </Text>
    </Pressable>
  );
}

export function PhotoGallery({
  photos,
  onAddPhoto,
  onDeletePhoto,
}: PhotoGalleryProps) {
  const renderItem = ({
    item,
  }: {
    item: DefectPhoto | { id: 'add-button' };
  }) => {
    if (item.id === 'add-button') {
      return <AddPhotoButton onPress={onAddPhoto} />;
    }

    const photo = item as DefectPhoto;
    return (
      <PhotoThumbnail
        photo={photo}
        onDelete={() => onDeletePhoto(photo.id, photo.imageUrl)}
      />
    );
  };

  const data = [...photos, { id: 'add-button' as const }];

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
      className="py-[4px]"
    />
  );
}
