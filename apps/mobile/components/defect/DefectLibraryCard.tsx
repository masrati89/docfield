import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';

import type { DefectLibraryItem } from '@/hooks/useDefectLibrary';

// --- Props ---

interface DefectLibraryCardProps {
  item: DefectLibraryItem;
  onPress: () => void;
  onLongPress?: () => void;
}

// --- Component ---

function DefectLibraryCardInner({
  item,
  onPress,
  onLongPress,
}: DefectLibraryCardProps) {
  const isSystem = item.source === 'system';

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
      }}
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
        backgroundColor: pressed ? COLORS.cream[100] : COLORS.cream[50],
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        borderRadius: BORDER_RADIUS.md,
        marginBottom: 6,
        ...SHADOWS.sm,
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
          numberOfLines={1}
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
              <Feather name="map-pin" size={16} color={COLORS.neutral[400]} />
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
        </View>
      </View>

      {/* Cost badge */}
      {item.cost !== null && item.cost !== undefined && item.cost > 0 && (
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
            ₪{item.cost.toLocaleString()}
          </Text>
        </View>
      )}

      {/* Chevron */}
      <Feather name="chevron-left" size={16} color={COLORS.neutral[300]} />
    </Pressable>
  );
}

export const DefectLibraryCard = React.memo(DefectLibraryCardInner);
