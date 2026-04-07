import { useCallback } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';

import type { StepProps, ReportType } from './NewInspectionWizard.types';

// --- Config ---

const REPORT_TYPES: {
  key: ReportType;
  label: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  {
    key: 'bedek_bait',
    label: 'בדק בית',
    subtitle: 'ליקויים חופשיים',
    icon: 'search',
  },
  {
    key: 'delivery',
    label: 'פרוטוקול מסירה',
    subtitle: 'צ׳קליסט מובנה',
    icon: 'clipboard',
  },
];

// --- Component ---

export function StepReportType({ state, dispatch, readOnly }: StepProps) {
  const handleSelect = useCallback(
    (type: ReportType) => {
      if (readOnly) return;
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      dispatch({ type: 'SET_REPORT_TYPE', payload: type });
    },
    [dispatch, readOnly]
  );

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '500',
          fontFamily: 'Rubik-Medium',
          color: COLORS.neutral[500],
          textAlign: 'right',
          marginBottom: 16,
        }}
      >
        בחר את סוג הבדיקה
      </Text>

      <View style={{ gap: 8 }}>
        {REPORT_TYPES.map((type) => {
          const isSelected = state.reportType === type.key;

          return (
            <Pressable
              key={type.key}
              onPress={() => handleSelect(type.key)}
              disabled={readOnly}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={{
                height: 56,
                borderRadius: 14,
                flexDirection: 'row-reverse',
                alignItems: 'center',
                paddingHorizontal: 16,
                borderWidth: 1.5,
                backgroundColor: isSelected
                  ? COLORS.primary[50]
                  : COLORS.cream[100],
                borderColor: isSelected
                  ? COLORS.primary[500]
                  : COLORS.cream[200],
                opacity: readOnly && !isSelected ? 0.4 : 1,
              }}
            >
              {/* Radio dot */}
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: isSelected
                    ? COLORS.primary[500]
                    : COLORS.neutral[300],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 12,
                }}
              >
                {isSelected && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: COLORS.primary[500],
                    }}
                  />
                )}
              </View>

              {/* Icon */}
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 12,
                  backgroundColor: isSelected
                    ? COLORS.primary[100]
                    : COLORS.cream[200],
                }}
              >
                <Feather
                  name={type.icon}
                  size={20}
                  color={isSelected ? COLORS.primary[500] : COLORS.neutral[500]}
                />
              </View>

              {/* Text */}
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: isSelected ? '600' : '500',
                    fontFamily: isSelected ? 'Rubik-SemiBold' : 'Rubik-Medium',
                    color: isSelected
                      ? COLORS.primary[700]
                      : COLORS.neutral[700],
                  }}
                >
                  {type.label}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: 'Rubik-Regular',
                    color: COLORS.neutral[400],
                    marginTop: 1,
                  }}
                >
                  {type.subtitle}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {readOnly && (
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 4,
            marginTop: 12,
          }}
        >
          <Feather name="lock" size={12} color={COLORS.neutral[400]} />
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[400],
            }}
          >
            נקבע מהקשר הפרויקט
          </Text>
        </View>
      )}
    </View>
  );
}
