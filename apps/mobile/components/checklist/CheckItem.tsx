import { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

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
  isChild,
  isHidden,
  isActiveDefect,
  onActivate,
}: CheckItemProps) {
  const [expanded, setExpanded] = useState(false);

  const cfg = status ? STATUS[status] : null;
  const hasText = !!defectText?.trim();

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

  if (isHidden) return null;

  return (
    <View>
      {/* Item row */}
      <Pressable
        onPress={handleTap}
        style={{
          paddingVertical: 12,
          paddingLeft: 16,
          paddingRight: isChild ? 32 : 16,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[200],
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 12,
          backgroundColor: COLORS.cream[50],
          minHeight: 48,
        }}
      >
        {/* Child indent line */}
        {isChild ? (
          <View
            style={{
              position: 'absolute',
              right: 20,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: COLORS.primary[200],
              borderRadius: 1,
              opacity: 0.3,
            }}
          />
        ) : null}

        {/* Status badge */}
        {cfg ? (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 5,
              backgroundColor: cfg.bg,
              borderWidth: 1,
              borderColor: cfg.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: cfg.color,
              }}
            >
              {cfg.sym}
            </Text>
          </View>
        ) : (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 5,
              borderWidth: 2,
              borderColor: COLORS.cream[300],
              backgroundColor: COLORS.cream[50],
            }}
          />
        )}

        {/* Text */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '500',
              color:
                status === 'skip' ? COLORS.neutral[400] : COLORS.neutral[700],
              lineHeight: 20,
              fontFamily: 'Rubik-Medium',
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
                lineHeight: 16,
                opacity: 0.8,
                fontFamily: 'Rubik-Regular',
                textAlign: 'right',
              }}
            >
              {defectText}
            </Text>
          ) : null}
        </View>

        {/* Change button */}
        {cfg ? (
          <Pressable
            onPress={() => {
              setExpanded((e) => !e);
              if (status === 'defect' || status === 'partial') {
                onActivate(null);
              }
            }}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: COLORS.cream[200],
              backgroundColor: COLORS.cream[50],
            }}
          >
            <Text
              style={{
                fontSize: 10,
                color: COLORS.neutral[400],
                fontFamily: 'Rubik-Regular',
              }}
            >
              שנה
            </Text>
          </Pressable>
        ) : null}
      </Pressable>

      {/* Status picker */}
      {expanded ? (
        <View
          style={{
            flexDirection: 'row-reverse',
            gap: 4,
            padding: 8,
            paddingHorizontal: 16,
            backgroundColor: COLORS.cream[100],
            borderBottomWidth: 1,
            borderBottomColor: COLORS.cream[200],
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
  const canSave = !!defectText.trim();

  return (
    <View
      style={{
        padding: 8,
        paddingHorizontal: 16,
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
        onPress={canSave ? onSave : undefined}
        style={{
          marginTop: 8,
          height: 36,
          borderRadius: 8,
          backgroundColor: accentColor,
          opacity: canSave ? 1 : 0.5,
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
