import { useEffect, useMemo } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInDown,
  FadeOutUp,
} from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';

import { CheckItem } from './CheckItem';
import { BathTypeSelect } from './BathTypeSelect';
import type {
  ChecklistRoom,
  ChecklistStatus,
  StatusMap,
  DefectTextMap,
} from './types';

// --- Types ---

interface RoomAccordionProps {
  room: ChecklistRoom;
  isOpen: boolean;
  onToggle: () => void;
  statuses: StatusMap;
  defectTexts: DefectTextMap;
  bathType: 'shower' | 'bath';
  activeDefect: string | null;
  onStatus: (itemId: string, status: ChecklistStatus) => void;
  onDefectText: (itemId: string, text: string) => void;
  onBathTypeChange: (value: 'shower' | 'bath') => void;
  onActivateDefect: (id: string | null) => void;
}

// --- Component ---

export function RoomAccordion({
  room,
  isOpen,
  onToggle,
  statuses,
  defectTexts,
  bathType,
  activeDefect,
  onStatus,
  onDefectText,
  onBathTypeChange,
  onActivateDefect,
}: RoomAccordionProps) {
  const visibleItems = useMemo(
    () =>
      room.items.filter((i) => {
        if (i.bathType && i.bathType !== bathType) return false;
        if (i.parentId && statuses[i.parentId] !== 'ok') return false;
        return true;
      }),
    [room.items, bathType, statuses]
  );

  const counts = useMemo(() => {
    const ok = visibleItems.filter((i) => statuses[i.id] === 'ok').length;
    const defect = visibleItems.filter(
      (i) => statuses[i.id] === 'defect'
    ).length;
    const partial = visibleItems.filter(
      (i) => statuses[i.id] === 'partial'
    ).length;
    const skip = visibleItems.filter((i) => statuses[i.id] === 'skip').length;
    const done = ok + defect + partial + skip;
    const total = visibleItems.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { ok, defect, partial, skip, done, total, pct };
  }, [visibleItems, statuses]);

  const badgeBg =
    counts.done > 0
      ? counts.defect > 0 || counts.partial > 0
        ? COLORS.danger[700]
        : COLORS.primary[500]
      : COLORS.cream[200];
  const badgeColor = counts.done > 0 ? COLORS.white : COLORS.neutral[500];

  const rotation = useSharedValue(isOpen ? 180 : 0);

  useEffect(() => {
    rotation.value = withTiming(isOpen ? 180 : 0, { duration: 200 });
  }, [isOpen, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      style={{
        marginBottom: 8,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        backgroundColor: COLORS.cream[50],
        borderWidth: 1,
        borderColor: isOpen ? COLORS.primary[200] : COLORS.cream[200],
        ...SHADOWS.sm,
      }}
    >
      {/* Room header */}
      <Pressable
        onPress={() => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          onToggle();
        }}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 8,
          paddingVertical: 14,
          paddingLeft: 12,
          paddingRight: 12,
          backgroundColor: COLORS.primary[50],
          borderRightWidth: 4,
          borderRightColor: COLORS.primary[500],
        }}
      >
        {/* Grip dots */}
        <View style={{ width: 10, alignItems: 'center', gap: 3 }}>
          {[0, 1, 2].map((row) => (
            <View key={row} style={{ flexDirection: 'row', gap: 4 }}>
              <View
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: COLORS.neutral[300],
                }}
              />
              <View
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: COLORS.neutral[300],
                }}
              />
            </View>
          ))}
        </View>

        {/* Count badge */}
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            backgroundColor: badgeBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              color: badgeColor,
            }}
          >
            {counts.done > 0 ? counts.done : counts.total}
          </Text>
        </View>

        {/* Room name + status counts */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: COLORS.primary[700],
              fontFamily: 'Rubik-Bold',
              textAlign: 'right',
            }}
          >
            {room.name}
          </Text>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 8,
              marginTop: 4,
            }}
          >
            {counts.done > 0 ? (
              <>
                {counts.ok > 0 ? (
                  <Text
                    style={{
                      fontSize: 10,
                      color: COLORS.primary[500],
                      fontWeight: '500',
                      fontFamily: 'Rubik-Medium',
                    }}
                  >
                    {counts.ok} {'\u2713'}
                  </Text>
                ) : null}
                {counts.defect > 0 ? (
                  <Text
                    style={{
                      fontSize: 10,
                      color: COLORS.danger[700],
                      fontWeight: '500',
                      fontFamily: 'Rubik-Medium',
                    }}
                  >
                    {counts.defect} {'\u2717'}
                  </Text>
                ) : null}
                {counts.partial > 0 ? (
                  <Text
                    style={{
                      fontSize: 10,
                      color: COLORS.gold[600],
                      fontWeight: '500',
                      fontFamily: 'Rubik-Medium',
                    }}
                  >
                    {counts.partial} ~
                  </Text>
                ) : null}
                {counts.skip > 0 ? (
                  <Text
                    style={{
                      fontSize: 10,
                      color: COLORS.neutral[400],
                      fontFamily: 'Rubik-Regular',
                    }}
                  >
                    {counts.skip} דלג
                  </Text>
                ) : null}
                {counts.done < counts.total ? (
                  <Text
                    style={{
                      fontSize: 10,
                      color: COLORS.neutral[400],
                      fontFamily: 'Rubik-Regular',
                    }}
                  >
                    {counts.total - counts.done} נותרו
                  </Text>
                ) : null}
              </>
            ) : (
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.neutral[500],
                  fontFamily: 'Rubik-Regular',
                }}
              >
                {counts.total} פריטים
              </Text>
            )}
          </View>
        </View>

        {/* Chevron */}
        <Animated.View style={chevronStyle}>
          <Feather name="chevron-down" size={16} color={COLORS.neutral[400]} />
        </Animated.View>
      </Pressable>

      {/* Progress bar (when open) */}
      {isOpen && counts.total > 0 ? (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutUp.duration(200)}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 12,
            paddingBottom: 8,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 3,
              backgroundColor: COLORS.cream[200],
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${counts.pct}%`,
                backgroundColor:
                  counts.pct === 100 ? COLORS.primary[500] : COLORS.gold[500],
                borderRadius: 2,
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 10,
              color:
                counts.pct === 100 ? COLORS.primary[500] : COLORS.neutral[400],
              fontWeight: '500',
              fontFamily: 'Rubik-Medium',
            }}
          >
            {counts.done}/{counts.total}
          </Text>
        </Animated.View>
      ) : null}

      {/* Accordion content */}
      {isOpen ? (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutUp.duration(200)}
          style={{
            borderTopWidth: 1,
            borderTopColor: COLORS.cream[200],
          }}
        >
          {room.hasBathType ? (
            <BathTypeSelect value={bathType} onChange={onBathTypeChange} />
          ) : null}
          {room.items.map((item) => {
            const hidden =
              (item.bathType && item.bathType !== bathType) ||
              (item.parentId && statuses[item.parentId] !== 'ok');
            return (
              <CheckItem
                key={item.id}
                item={item}
                status={statuses[item.id]}
                defectText={defectTexts[item.id]}
                onStatus={(s) => onStatus(item.id, s)}
                onDefectText={(t) => onDefectText(item.id, t)}
                isChild={!!item.parentId}
                isHidden={!!hidden}
                isActiveDefect={activeDefect === item.id}
                onActivate={onActivateDefect}
              />
            );
          })}
        </Animated.View>
      ) : null}
    </View>
  );
}
