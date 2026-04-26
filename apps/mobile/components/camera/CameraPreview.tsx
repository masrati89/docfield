import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

interface CameraPreviewProps {
  uri: string;
  onConfirm: () => void;
  onEdit: () => void;
  onRetake: () => void;
}

export function CameraPreview({
  uri,
  onConfirm,
  onEdit,
  onRetake,
}: CameraPreviewProps) {
  const insets = useSafeAreaInsets();

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onConfirm();
  };

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit();
  };

  const handleRetake = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRetake();
  };

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={StyleSheet.absoluteFill}
    >
      {/* Full-screen preview */}
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
        transition={200}
      />

      {/* Dark overlay at bottom for buttons */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom + 16, 32) },
        ]}
      >
        {/* Retake — top of bar */}
        <Pressable onPress={handleRetake} style={styles.retakeButton}>
          <Feather name="refresh-cw" size={16} color={COLORS.white} />
          <Text style={styles.retakeText}>צלם שוב</Text>
        </Pressable>

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          {/* Confirm (primary) */}
          <Pressable onPress={handleConfirm} style={styles.confirmButton}>
            <Feather name="check" size={22} color={COLORS.white} />
            <Text style={styles.confirmText}>אשר</Text>
          </Pressable>

          {/* Edit (secondary) */}
          <Pressable onPress={handleEdit} style={styles.editButton}>
            <Feather name="edit-2" size={20} color={COLORS.white} />
            <Text style={styles.editText}>ערוך</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20, 19, 17, 0.85)',
    paddingTop: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  retakeButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  retakeText: {
    fontSize: 13,
    fontFamily: 'Rubik-Regular',
    color: COLORS.white,
    opacity: 0.8,
  },
  actionsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary[500],
  },
  confirmText: {
    fontSize: 16,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.white,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  editText: {
    fontSize: 16,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.white,
  },
});
