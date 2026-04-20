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

import { COLORS } from '@infield/ui';

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

  const hasDefects = counts.defect > 0 || counts.partial > 0;

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
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: hasDefects ? COLORS.danger[200] : COLORS.primary[200],
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: 'rgb(60,54,42)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
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
          gap: 10,
          paddingVertical: 12,
          paddingLeft: 14,
          paddingRight: 0,
          backgroundColor: isOpen
            ? hasDefects
              ? COLORS.danger[50]
              : COLORS.primary[50]
            : 'transparent',
          borderBottomWidth: isOpen ? 1 : 0,
          borderBottomColor: hasDefects
            ? COLORS.danger[200]
            : COLORS.primary[200],
        }}
      >
        {/* Color bar (right side = leading edge in RTL) */}
        <View
          style={{
            width: 6,
            height: 28,
            borderRadius: 3,
            backgroundColor: hasDefects
              ? COLORS.danger[700]
              : COLORS.primary[500],
          }}
        />

        {/* Room name + status line */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: COLORS.neutral[800],
              fontFamily: 'Rubik-Bold',
              textAlign: 'right',
              letterSpacing: -0.1,
            }}
          >
            {room.name}
          </Text>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 6,
              marginTop: 3,
            }}
          >
            {hasDefects ? (
              <Text
                style={{
                  fontSize: 10,
                  color: COLORS.danger[700],
                  fontWeight: '600',
                  fontFamily: 'Rubik-SemiBold',
                }}
              >
                {counts.defect + counts.partial} ליקויים
              </Text>
            ) : counts.done > 0 ? (
              <Text
                style={{
                  fontSize: 10,
                  color: COLORS.primary[700],
                  fontWeight: '600',
                  fontFamily: 'Rubik-SemiBold',
                }}
              >
                הכל תקין ✓
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 10,
                  color: COLORS.neutral[500],
                  fontFamily: 'Rubik-Regular',
                }}
              >
                {counts.total} פריטים
              </Text>
            )}
            <Text style={{ fontSize: 9, color: COLORS.neutral[300] }}>·</Text>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.neutral[500],
                fontFamily: 'Inter-Regular',
              }}
            >
              {counts.done}/{counts.total} · {counts.pct}%
            </Text>
          </View>
        </View>

        {/* Chevron */}
        <Animated.View style={chevronStyle}>
          <Feather name="chevron-down" size={16} color={COLORS.neutral[500]} />
        </Animated.View>
      </Pressable>

      {/* Accordion content */}
      {isOpen ? (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutUp.duration(200)}
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
