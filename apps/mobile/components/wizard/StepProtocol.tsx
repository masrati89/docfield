import { useCallback } from 'react';
import { View, Text, Pressable, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';
import { CHECKLIST_TEMPLATES } from '@infield/shared';
import type { ChecklistTemplateValue } from '@infield/shared';

import type { StepProps, ProtocolMode } from './NewInspectionWizard.types';

// --- Mode cards config ---

const PROTOCOL_MODES: {
  key: ProtocolMode;
  label: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  {
    key: 'smart_checklist',
    label: 'עם צ׳קליסט חכם',
    subtitle: 'חדרים ופריטים מוגדרים מראש לפי תבנית',
    icon: 'check-square',
  },
  {
    key: 'empty_protocol',
    label: 'פרוטוקול ריק',
    subtitle: 'המפקח מוסיף הכל באופן חופשי',
    icon: 'edit-3',
  },
];

// --- Component ---

export function StepProtocol({ state, dispatch }: StepProps) {
  const handleModeSelect = useCallback(
    (mode: ProtocolMode) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      dispatch({ type: 'SET_PROTOCOL_MODE', payload: mode });
    },
    [dispatch]
  );

  const handleTemplateSelect = useCallback(
    (template: ChecklistTemplateValue) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      dispatch({ type: 'SET_TEMPLATE', payload: template });
    },
    [dispatch]
  );

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8 }}
      showsVerticalScrollIndicator={false}
    >
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
        בחר מצב עבודה
      </Text>

      {/* Mode cards */}
      <View style={{ gap: 8, marginBottom: 16 }}>
        {PROTOCOL_MODES.map((mode) => {
          const isSelected = state.protocolMode === mode.key;

          return (
            <Pressable
              key={mode.key}
              onPress={() => handleModeSelect(mode.key)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={{
                borderRadius: 14,
                flexDirection: 'row-reverse',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderWidth: 1.5,
                backgroundColor: isSelected
                  ? COLORS.primary[50]
                  : COLORS.cream[100],
                borderColor: isSelected
                  ? COLORS.primary[500]
                  : COLORS.cream[200],
              }}
            >
              {/* Radio */}
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
                  name={mode.icon}
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
                  {mode.label}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: 'Rubik-Regular',
                    color: COLORS.neutral[400],
                    marginTop: 1,
                    textAlign: 'right',
                  }}
                >
                  {mode.subtitle}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Template picker — only when smart_checklist */}
      {state.protocolMode === 'smart_checklist' && (
        <View>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              fontFamily: 'Rubik-SemiBold',
              color: COLORS.neutral[700],
              textAlign: 'right',
              marginBottom: 10,
            }}
          >
            תבנית דירה
          </Text>

          <View style={{ gap: 6 }}>
            {CHECKLIST_TEMPLATES.map((tmpl) => {
              const isSelected = state.selectedTemplate === tmpl.value;

              return (
                <Pressable
                  key={tmpl.value}
                  onPress={() => handleTemplateSelect(tmpl.value)}
                  style={{
                    height: 44,
                    borderRadius: 10,
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    paddingHorizontal: 14,
                    borderWidth: 1,
                    backgroundColor: isSelected
                      ? COLORS.primary[50]
                      : COLORS.cream[50],
                    borderColor: isSelected
                      ? COLORS.primary[500]
                      : COLORS.cream[200],
                  }}
                >
                  {/* Radio */}
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      borderWidth: 1.5,
                      borderColor: isSelected
                        ? COLORS.primary[500]
                        : COLORS.neutral[300],
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 10,
                    }}
                  >
                    {isSelected && (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: COLORS.primary[500],
                        }}
                      />
                    )}
                  </View>

                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'right',
                      fontSize: 14,
                      fontWeight: isSelected ? '600' : '400',
                      fontFamily: isSelected
                        ? 'Rubik-SemiBold'
                        : 'Rubik-Regular',
                      color: isSelected
                        ? COLORS.primary[700]
                        : COLORS.neutral[700],
                    }}
                  >
                    {tmpl.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
