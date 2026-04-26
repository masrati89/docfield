import { View, Text, Pressable, Image, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';

import { COLORS } from '@infield/ui';

// --- Types ---

interface AppendixDocument {
  id: string;
  uri: string;
}

interface AppendixSectionProps {
  documents: AppendixDocument[];
  onAddFromLibrary?: () => void;
  onAddFromCamera?: () => void;
  onDelete?: (id: string) => void;
}

// --- Component ---

export function AppendixSection({
  documents,
  onAddFromLibrary,
  onAddFromCamera,
  onDelete,
}: AppendixSectionProps) {
  const handleDelete = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onDelete?.(id);
  };

  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      {/* Document thumbnails */}
      {documents.map((doc) => (
        <View key={doc.id} style={{ position: 'relative' }}>
          <Image
            source={{ uri: doc.uri }}
            style={{
              width: 64,
              height: 64,
              borderRadius: 8,
              backgroundColor: COLORS.cream[100],
            }}
          />
          {onDelete && (
            <Pressable
              onPress={() => handleDelete(doc.id)}
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: COLORS.danger[500],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="x" size={10} color={COLORS.white} />
            </Pressable>
          )}
        </View>
      ))}

      {/* Add from library button */}
      {onAddFromLibrary && (
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onAddFromLibrary();
          }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 8,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: COLORS.cream[300],
            backgroundColor: COLORS.cream[50],
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Feather name="book" size={16} color={COLORS.neutral[400]} />
          <Text
            style={{
              fontSize: 9,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[400],
              textAlign: 'center',
            }}
          >
            מהספרייה
          </Text>
        </Pressable>
      )}

      {/* Add from camera button */}
      {onAddFromCamera && (
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onAddFromCamera();
          }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 8,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: COLORS.cream[300],
            backgroundColor: COLORS.cream[50],
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Feather name="camera" size={16} color={COLORS.neutral[400]} />
          <Text
            style={{
              fontSize: 9,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[400],
              textAlign: 'center',
            }}
          >
            צלם
          </Text>
        </Pressable>
      )}
    </View>
  );
}
