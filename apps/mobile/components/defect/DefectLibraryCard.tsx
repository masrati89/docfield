import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';
import Animated, {
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';

import type { DefectLibraryItem } from '@/hooks/useDefectLibrary';

// --- Props ---

interface DefectLibraryCardProps {
  item: DefectLibraryItem;
  onPress: () => void;
  onLongPress?: () => void;
}

// --- Detail Row ---

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'flex-start',
        gap: 6,
        marginBottom: 6,
      }}
    >
      <Feather
        name={icon as keyof typeof Feather.glyphMap}
        size={12}
        color={COLORS.neutral[400]}
        style={{ marginTop: 2 }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 10,
            fontFamily: 'Rubik-Medium',
            color: COLORS.neutral[400],
            textAlign: 'right',
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[700],
            textAlign: 'right',
            marginTop: 1,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

// --- Component ---

function DefectLibraryCardInner({
  item,
  onPress,
  onLongPress,
}: DefectLibraryCardProps) {
  const isSystem = item.source === 'system';
  const [expanded, setExpanded] = useState(false);
  const chevronRotation = useSharedValue(0);

  const hasDetails = !!(item.standardRef || item.recommendation || item.notes);

  const handleToggle = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (hasDetails) {
      setExpanded((prev) => !prev);
      chevronRotation.value = withTiming(expanded ? 0 : 90, { duration: 200 });
    } else {
      onPress();
    }
  }, [hasDetails, expanded, chevronRotation, onPress]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  return (
    <View
      style={{
        backgroundColor: expanded ? COLORS.cream[100] : COLORS.cream[50],
        borderWidth: 1,
        borderColor: expanded ? COLORS.primary[200] : COLORS.cream[200],
        borderRadius: BORDER_RADIUS.md,
        marginBottom: 6,
        overflow: 'hidden',
        ...SHADOWS.sm,
      }}
    >
      {/* Header row — always visible */}
      <Pressable
        onPress={handleToggle}
        onLongPress={() => {
          if (!isSystem && onLongPress) {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            onLongPress();
          }
        }}
        style={({ pressed }) => ({
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 10,
          padding: 12,
          paddingHorizontal: 14,
          backgroundColor: pressed ? COLORS.cream[100] : 'transparent',
        })}
      >
        {/* Source icon */}
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: isSystem ? COLORS.cream[100] : COLORS.primary[50],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 14 }}>{isSystem ? '🔒' : '✏️'}</Text>
        </View>

        {/* Content */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={expanded ? undefined : 1}
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: COLORS.neutral[800],
              fontFamily: 'Rubik-SemiBold',
              textAlign: 'right',
            }}
          >
            {item.title}
          </Text>

          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 6,
              marginTop: 4,
            }}
          >
            {/* Category badge */}
            <View
              style={{
                backgroundColor: COLORS.primary[50],
                paddingHorizontal: 6,
                paddingVertical: 1,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: COLORS.primary[700],
                  fontFamily: 'Rubik-Medium',
                  fontWeight: '500',
                }}
              >
                {item.category}
              </Text>
            </View>

            {/* Location */}
            {item.location ? (
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Feather name="map-pin" size={10} color={COLORS.neutral[400]} />
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.neutral[400],
                    fontFamily: 'Rubik-Regular',
                  }}
                  numberOfLines={1}
                >
                  {item.location}
                </Text>
              </View>
            ) : null}

            {/* Details indicator */}
            {hasDetails && !expanded && (
              <Feather name="info" size={10} color={COLORS.neutral[300]} />
            )}
          </View>
        </View>

        {/* Price badge — default from library */}
        {item.price !== null && item.price !== undefined && item.price > 0 && (
          <View
            style={{
              backgroundColor: COLORS.gold[100],
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: COLORS.gold[700],
                fontFamily: 'Rubik-Medium',
              }}
            >
              ₪{item.price.toLocaleString()}
            </Text>
          </View>
        )}

        {/* Chevron */}
        {hasDetails ? (
          <Animated.View style={chevronStyle}>
            <Feather
              name="chevron-down"
              size={16}
              color={COLORS.neutral[300]}
            />
          </Animated.View>
        ) : (
          <Feather name="chevron-left" size={16} color={COLORS.neutral[300]} />
        )}
      </Pressable>

      {/* Expanded details */}
      {expanded && (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutUp.duration(200)}
          style={{
            paddingHorizontal: 14,
            paddingBottom: 12,
            borderTopWidth: 1,
            borderTopColor: COLORS.cream[200],
            paddingTop: 10,
          }}
        >
          {item.standardRef && (
            <DetailRow
              icon="book"
              label="תקן / הפניה"
              value={item.standardRef}
            />
          )}
          {item.recommendation && (
            <DetailRow icon="tool" label="המלצה" value={item.recommendation} />
          )}
          {item.notes && (
            <DetailRow icon="file-text" label="הערות" value={item.notes} />
          )}
        </Animated.View>
      )}
    </View>
  );
}

export const DefectLibraryCard = React.memo(DefectLibraryCardInner);
