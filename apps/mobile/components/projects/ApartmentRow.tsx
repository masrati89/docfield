import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { COLORS } from '@infield/ui';

// --- Types ---

export interface ApartmentItem {
  id: string;
  number: string;
  floor: number | null;
  roomsCount: number | null;
  status: string;
  tenantName: string | null;
  defects: number;
  reports: number;
}

const APT_STATUS: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  pending: {
    label: 'ממתין',
    color: COLORS.neutral[500],
    bg: COLORS.cream[200],
    dot: COLORS.neutral[400],
  },
  in_progress: {
    label: 'בבדיקה',
    color: COLORS.gold[700],
    bg: COLORS.gold[100],
    dot: COLORS.gold[500],
  },
  completed: {
    label: 'נבדק',
    color: COLORS.primary[700],
    bg: COLORS.primary[50],
    dot: COLORS.primary[500],
  },
  delivered: {
    label: 'נמסר',
    color: COLORS.primary[700],
    bg: COLORS.primary[100],
    dot: COLORS.primary[500],
  },
};

interface ApartmentRowProps {
  apartment: ApartmentItem;
  isLast: boolean;
  index: number;
  onPress: () => void;
}

// --- Component ---

export const ApartmentRow = React.memo(function ApartmentRow({
  apartment,
  isLast,
  index,
  onPress,
}: ApartmentRowProps) {
  const st = APT_STATUS[apartment.status] ?? APT_STATUS.pending;

  return (
    <Animated.View entering={FadeInUp.delay(60 * index).duration(200)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: COLORS.cream[200],
          backgroundColor: pressed ? COLORS.cream[100] : 'transparent',
        })}
      >
        {/* Status dot */}
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: st.dot,
            marginLeft: 8,
          }}
        />

        {/* Content */}
        <View style={{ flex: 1 }}>
          {/* Row 1: apartment number + rooms + floor */}
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 6,
              marginBottom: 2,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.neutral[800],
                fontFamily: 'Rubik-SemiBold',
              }}
            >
              דירה {apartment.number}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.neutral[400],
                fontFamily: 'Rubik-Regular',
              }}
            >
              {apartment.roomsCount ? `· ${apartment.roomsCount} חד׳` : ''}
              {apartment.floor !== null && apartment.floor !== undefined
                ? ` · קומה ${apartment.floor}`
                : ''}
            </Text>
          </View>

          {/* Row 2: tenant + reports */}
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {apartment.tenantName ? (
              <>
                <Feather name="user" size={16} color={COLORS.neutral[400]} />
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.neutral[400],
                    fontFamily: 'Rubik-Regular',
                  }}
                >
                  {apartment.tenantName}
                </Text>
              </>
            ) : (
              <Text
                style={{
                  fontSize: 10,
                  color: COLORS.neutral[300],
                  fontFamily: 'Rubik-Regular',
                  fontStyle: 'italic',
                }}
              >
                ללא דייר
              </Text>
            )}
            {apartment.reports > 0 ? (
              <>
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.neutral[300],
                    includeFontPadding: false,
                  }}
                >
                  ·
                </Text>
                <Feather
                  name="file-text"
                  size={16}
                  color={COLORS.neutral[400]}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.neutral[400],
                    fontFamily: 'Rubik-Regular',
                  }}
                >
                  {apartment.reports}
                </Text>
              </>
            ) : null}
          </View>
        </View>

        {/* Status badge + defects */}
        <View
          style={{
            alignItems: 'center',
            gap: 3,
            marginRight: 8,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '600',
              fontFamily: 'Rubik-SemiBold',
              color: st.color,
              backgroundColor: st.bg,
              borderRadius: 5,
              paddingHorizontal: 7,
              paddingVertical: 2,
              overflow: 'hidden',
            }}
          >
            {st.label}
          </Text>
          {apartment.defects > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Feather
                name="alert-triangle"
                size={16}
                color={COLORS.gold[500]}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '500',
                  color: COLORS.neutral[500],
                  fontFamily: 'Rubik-Medium',
                }}
              >
                {apartment.defects}
              </Text>
            </View>
          ) : null}
        </View>

        <Feather name="chevron-left" size={16} color={COLORS.neutral[300]} />
      </Pressable>
    </Animated.View>
  );
});
