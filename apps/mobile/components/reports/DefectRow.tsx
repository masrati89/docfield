import { View, Text, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { AnimatedPressable } from '@/components/reports/reportDetailConstants';
import type { DefectItem } from '@/hooks/useReport';

interface DefectRowProps {
  defect: DefectItem;
  isLast: boolean;
  onDelete: (defectId: string) => void;
}

export function DefectRow({ defect, isLast, onDelete }: DefectRowProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      }}
      onPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // TODO: navigate to defect detail
      }}
      onLongPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onDelete(defect.id);
      }}
      style={[
        {
          padding: 12,
          paddingHorizontal: 16,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: COLORS.cream[200],
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 8,
          backgroundColor: COLORS.cream[50],
        },
        animatedStyle,
      ]}
    >
      {/* Small grip */}
      <View style={{ width: 6, alignItems: 'center' }}>
        {[0, 4, 8].map((y) => (
          <View
            key={y}
            style={{
              flexDirection: 'row',
              gap: 3,
              marginBottom: y < 8 ? 2 : 0,
            }}
          >
            <View
              style={{
                width: 2,
                height: 2,
                borderRadius: 1,
                backgroundColor: COLORS.cream[300],
              }}
            />
            <View
              style={{
                width: 2,
                height: 2,
                borderRadius: 1,
                backgroundColor: COLORS.cream[300],
              }}
            />
          </View>
        ))}
      </View>

      {/* Defect info */}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: '500',
            color: COLORS.neutral[700],
            fontFamily: 'Rubik-Medium',
            textAlign: 'right',
            lineHeight: 18,
          }}
          numberOfLines={2}
        >
          {defect.description}
        </Text>
        <View
          style={{
            flexDirection: 'row-reverse',
            gap: 8,
            marginTop: 4,
          }}
        >
          {defect.room && (
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Feather name="map-pin" size={12} color={COLORS.neutral[400]} />
              <Text
                style={{
                  fontSize: 10,
                  color: COLORS.neutral[400],
                  fontFamily: 'Rubik-Regular',
                }}
              >
                {defect.room}
              </Text>
            </View>
          )}
        </View>
        {defect.standardRef && (
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 4,
              marginTop: 2,
            }}
          >
            <Feather name="book-open" size={12} color={COLORS.neutral[400]} />
            <Text
              style={{
                fontSize: 11,
                color: COLORS.neutral[500],
                fontFamily: 'Rubik-Regular',
              }}
            >
              {defect.standardRef}
            </Text>
          </View>
        )}
      </View>

      {/* Photo count */}
      {defect.photoCount > 0 && (
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 3,
            flexShrink: 0,
          }}
        >
          <Feather name="camera" size={12} color={COLORS.neutral[400]} />
          <Text
            style={{
              fontSize: 10,
              fontWeight: '500',
              color: COLORS.neutral[400],
              fontFamily: 'Rubik-Medium',
            }}
          >
            {defect.photoCount}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
}
