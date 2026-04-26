import { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

import { STATUS } from './constants';
import type { ChecklistItemData, ChecklistStatus } from './types';

// --- Types ---

interface CheckItemProps {
  item: ChecklistItemData;
  status?: ChecklistStatus;
  defectText?: string;
  onStatus: (status: ChecklistStatus) => void;
  onDefectText: (text: string) => void;
  isChild?: boolean;
  isHidden?: boolean;
  isActiveDefect: boolean;
  onActivate: (id: string | null) => void;
}

// --- Component ---

export function CheckItem({
  item,
  status,
  defectText,
  onStatus,
  onDefectText,
  isChild: _isChild,
  isHidden,
  isActiveDefect,
  onActivate,
}: CheckItemProps) {
  const [expanded, setExpanded] = useState(false);

  const cfg = status ? STATUS[status] : null;
  const hasText = !!defectText?.trim();

  // Tap on item: open status picker (or toggle defect input for defect/partial)
  const handleTap = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (status === 'defect' || status === 'partial') {
      onActivate(isActiveDefect ? null : item.id);
    } else {
      setExpanded((e) => !e);
    }
  }, [status, isActiveDefect, item.id, onActivate]);

  const handleStatusSelect = useCallback(
    (key: string) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onStatus(key as ChecklistStatus);
      if (key === 'defect' || key === 'partial') {
        onActivate(item.id);
      } else {
        onActivate(null);
      }
      setExpanded(false);
    },
    [onStatus, onActivate, item.id]
  );

  // Long press to change status when already set
  const handleLongPress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (status === 'defect' || status === 'partial') {
      onActivate(null);
    }
    setExpanded((e) => !e);
  }, [status, onActivate]);

  if (isHidden) return null;

  return (
    <View>
      {/* Item row — matches DS: badge + text + optional "ליקוי" badge */}
      <Pressable
        onPress={handleTap}
        onLongPress={handleLongPress}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[100],
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {/* Status badge — 22×22, 6px radius */}
        {cfg ? (
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              backgroundColor: cfg.bg,
              borderWidth: 1,
              borderColor: cfg.border,
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: cfg.color,
                fontFamily: 'Inter-Bold',
              }}
            >
              {cfg.sym}
            </Text>
          </View>
        ) : (
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: COLORS.cream[300],
              backgroundColor: COLORS.cream[200],
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: COLORS.neutral[400],
                fontFamily: 'Inter-Bold',
              }}
            >
              ·
            </Text>
          </View>
        )}

        {/* Text */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontSize: 13,
              color:
                status === 'skip' ? COLORS.neutral[400] : COLORS.neutral[800],
              lineHeight: 17,
              fontFamily: 'Rubik-Regular',
              textAlign: 'right',
            }}
          >
            {item.text}
          </Text>
          {(status === 'defect' || status === 'partial') &&
          hasText &&
          !isActiveDefect ? (
            <Text
              style={{
                fontSize: 11,
                color:
                  status === 'defect' ? COLORS.danger[700] : COLORS.gold[600],
                marginTop: 2,
                fontFamily: 'Rubik-Regular',
                textAlign: 'right',
              }}
            >
              {defectText}
            </Text>
          ) : null}
        </View>

        {/* "ליקוי" badge for defect items */}
        {status === 'defect' && (
          <View
            style={{
              paddingHorizontal: 7,
              paddingVertical: 2,
              borderRadius: 5,
              backgroundColor: COLORS.danger[50],
              borderWidth: 1,
              borderColor: COLORS.danger[200],
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: COLORS.danger[700],
                fontFamily: 'Rubik-SemiBold',
              }}
            >
              ליקוי
            </Text>
          </View>
        )}
      </Pressable>

      {/* Status picker — shown on tap (no status) or long-press (has status) */}
      {expanded ? (
        <View
          style={{
            flexDirection: 'row-reverse',
            gap: 4,
            padding: 8,
            paddingHorizontal: 14,
            backgroundColor: COLORS.cream[100],
            borderBottomWidth: 1,
            borderBottomColor: COLORS.cream[100],
          }}
        >
          {Object.entries(STATUS).map(([key, s]) => {
            const isSelected = status === key;
            return (
              <Pressable
                key={key}
                onPress={() => handleStatusSelect(key)}
                style={{
                  flex: key === 'skip' ? 0.7 : 1,
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  paddingVertical: 8,
                  borderRadius: BORDER_RADIUS.md,
                  borderWidth: 1.5,
                  borderColor: isSelected ? s.color : COLORS.cream[200],
                  backgroundColor: isSelected ? s.bg : COLORS.cream[50],
                  minHeight: 36,
                }}
              >
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 13,
                    color: isSelected ? s.color : COLORS.neutral[500],
                  }}
                >
                  {s.sym}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: isSelected ? '600' : '500',
                    color: isSelected ? s.color : COLORS.neutral[500],
                    fontFamily: isSelected ? 'Rubik-SemiBold' : 'Rubik-Medium',
                  }}
                >
                  {s.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {/* Defect text area */}
      {(status === 'defect' || status === 'partial') && isActiveDefect ? (
        <DefectInput
          status={status}
          defectText={defectText ?? ''}
          onDefectText={onDefectText}
          onSave={() => onActivate(null)}
        />
      ) : null}
    </View>
  );
}

// --- Defect Input Sub-component ---

function DefectInput({
  status,
  defectText,
  onDefectText,
  onSave,
}: {
  status: 'defect' | 'partial';
  defectText: string;
  onDefectText: (t: string) => void;
  onSave: () => void;
}) {
  const isDefect = status === 'defect';
  const accentColor = isDefect ? COLORS.danger[700] : COLORS.gold[600];
  const borderColor = isDefect ? COLORS.danger[200] : COLORS.warning[200];
  const bgColor = isDefect ? COLORS.danger[50] : COLORS.warning[50];
  const hasText = !!defectText.trim();

  return (
    <View
      style={{
        padding: 8,
        paddingHorizontal: 14,
        backgroundColor: bgColor,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
      }}
    >
      <View
        style={{
          flexDirection: 'row-reverse',
          gap: 8,
          alignItems: 'flex-start',
        }}
      >
        <TextInput
          value={defectText}
          onChangeText={onDefectText}
          placeholder="תאר את הליקוי..."
          placeholderTextColor={COLORS.neutral[400]}
          multiline
          style={{
            flex: 1,
            minHeight: 40,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor,
            backgroundColor: COLORS.cream[50],
            fontSize: 14,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[800],
            textAlign: 'right',
          }}
        />
        <Pressable
          style={{
            width: 40,
            height: 40,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor,
            backgroundColor: COLORS.cream[50],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="camera" size={20} color={accentColor} />
        </Pressable>
      </View>
      <Pressable
        onPress={onSave}
        style={{
          marginTop: 8,
          height: 36,
          borderRadius: 8,
          backgroundColor: accentColor,
          opacity: hasText ? 1 : 0.7,
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Feather name="check" size={16} color={COLORS.white} />
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: COLORS.white,
            fontFamily: 'Rubik-SemiBold',
          }}
        >
          שמור
        </Text>
      </Pressable>
    </View>
  );
}
