import { useRef } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import type { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

import { COLORS } from '@infield/ui';
import { AnimatedPressable } from '@/components/reports/reportDetailConstants';
import type { DefectItem, ReviewStatus } from '@/hooks/useReport';
import { ReviewStatusPill } from './ReviewStatusPill';

interface DefectRowProps {
  defect: DefectItem;
  isLast: boolean;
  onDelete: (defectId: string) => void;
  onReviewStatusChange?: (defectId: string, next: ReviewStatus) => void;
  isReviewUpdating?: boolean;
}

function DeleteAction({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 80,
        backgroundColor: '#b91c1c',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        borderRadius: 10,
      }}
    >
      <Feather name="trash-2" size={20} color="white" />
      <Text
        style={{
          color: 'white',
          fontSize: 11,
          fontFamily: 'Rubik-Medium',
        }}
      >
        מחיקה
      </Text>
    </Pressable>
  );
}

export function DefectRow({
  defect,
  isLast: _isLast,
  onDelete,
  onReviewStatusChange,
  isReviewUpdating = false,
}: DefectRowProps) {
  const scale = useSharedValue(1);
  const swipeableRef = useRef<SwipeableMethods>(null);
  const isDraft = defect.status === 'draft';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handleDelete() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    swipeableRef.current?.close();
    onDelete(defect.id);
  }

  function renderRightActions() {
    return <DeleteAction onPress={handleDelete} />;
  }

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
      onSwipeableOpenStartDrag={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
    >
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
        }}
        style={[
          {
            backgroundColor: COLORS.cream[50],
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            borderRadius: 10,
            padding: 10,
            paddingHorizontal: 12,
            overflow: 'hidden',
          },
          animatedStyle,
        ]}
      >
        {/* Right color bar — DS: 3px, go500 draft / g500 final */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: 3,
            backgroundColor: isDraft ? COLORS.gold[500] : COLORS.primary[500],
          }}
        />

        {/* Top row: room + draft badge */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 6,
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '500',
              color: COLORS.neutral[600],
              fontFamily: 'Rubik-Medium',
              textAlign: 'right',
            }}
          >
            {defect.room || ''}
          </Text>
          <View style={{ flex: 1 }} />

          {/* Inherited badge */}
          {defect.source === 'inherited' && (
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: 3,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 6,
                backgroundColor: COLORS.info[50],
                borderWidth: 1,
                borderColor: COLORS.info[500],
              }}
            >
              <Feather
                name="corner-up-left"
                size={9}
                color={COLORS.info[700]}
              />
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: 'Rubik-SemiBold',
                  color: COLORS.info[700],
                }}
              >
                מסבב קודם
              </Text>
            </View>
          )}

          {defect.source === 'inherited' &&
            defect.reviewStatus &&
            onReviewStatusChange && (
              <ReviewStatusPill
                status={defect.reviewStatus}
                isUpdating={isReviewUpdating}
                onChange={(next) => onReviewStatusChange(defect.id, next)}
              />
            )}

          {isDraft && (
            <View
              style={{
                paddingVertical: 1,
                paddingHorizontal: 6,
                borderRadius: 4,
                backgroundColor: COLORS.gold[100],
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: '600',
                  color: COLORS.gold[700],
                  fontFamily: 'Rubik-SemiBold',
                }}
              >
                טיוטה
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        <Text
          style={{
            fontSize: 13,
            color: COLORS.neutral[800],
            fontFamily: 'Rubik-Regular',
            textAlign: 'right',
            lineHeight: 18,
            marginBottom: 6,
          }}
          numberOfLines={2}
        >
          {defect.description}
        </Text>

        {/* Bottom row: standard + cost + photos */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {defect.standardRef ? (
            <Text
              style={{
                fontSize: 10,
                color: COLORS.neutral[400],
                fontFamily: 'Rubik-Regular',
              }}
            >
              {defect.standardRef}
            </Text>
          ) : null}

          {defect.standardRef && defect.cost ? (
            <Text
              style={{
                fontSize: 9,
                color: COLORS.neutral[300],
                fontFamily: 'Rubik-Regular',
              }}
            >
              ·
            </Text>
          ) : null}

          {defect.cost ? (
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: COLORS.gold[700],
                fontFamily: 'Inter-SemiBold',
                writingDirection: 'ltr',
              }}
            >
              ₪{defect.cost.toLocaleString()}
            </Text>
          ) : null}

          <View style={{ flex: 1 }} />

          {defect.photoCount > 0 && (
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Feather name="camera" size={12} color={COLORS.neutral[400]} />
              <Text
                style={{
                  fontSize: 10,
                  color: COLORS.neutral[400],
                  fontFamily: 'Inter-Regular',
                }}
              >
                {defect.photoCount}
              </Text>
            </View>
          )}
        </View>
      </AnimatedPressable>
    </ReanimatedSwipeable>
  );
}
