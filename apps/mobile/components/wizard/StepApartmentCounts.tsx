import { useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';

import type { StepProps } from './NewInspectionWizard.types';

// --- Component ---

export function StepApartmentCounts({ state, dispatch }: StepProps) {
  const handleCountChange = useCallback(
    (buildingIndex: number, delta: number) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      const current = state.newApartmentCounts[buildingIndex] ?? 1;
      dispatch({
        type: 'SET_APARTMENT_COUNT',
        payload: { buildingIndex, count: current + delta },
      });
    },
    [state.newApartmentCounts, dispatch]
  );

  const handleCountInput = useCallback(
    (buildingIndex: number, text: string) => {
      const num = parseInt(text, 10);
      if (!isNaN(num)) {
        dispatch({
          type: 'SET_APARTMENT_COUNT',
          payload: { buildingIndex, count: num },
        });
      } else if (text === '') {
        dispatch({
          type: 'SET_APARTMENT_COUNT',
          payload: { buildingIndex, count: 1 },
        });
      }
    },
    [dispatch]
  );

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 8, flex: 1 }}>
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
        כמה דירות בכל בניין?
      </Text>

      <ScrollView
        style={{ maxHeight: 360 }}
        showsVerticalScrollIndicator={false}
      >
        {state.newBuildings.map((building, index) => {
          const count = state.newApartmentCounts[index] ?? 1;
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 12,
                paddingHorizontal: 14,
                marginBottom: 8,
                borderRadius: 10,
                backgroundColor: COLORS.cream[50],
                borderWidth: 1,
                borderColor: COLORS.cream[200],
              }}
            >
              {/* Building name */}
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 8,
                  flex: 1,
                }}
              >
                <Feather name="home" size={16} color={COLORS.primary[500]} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    fontFamily: 'Rubik-SemiBold',
                    color: COLORS.neutral[700],
                  }}
                  numberOfLines={1}
                >
                  {building.name || `בניין ${index + 1}`}
                </Text>
              </View>

              {/* Count controls */}
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Pressable
                  onPress={() => handleCountChange(index, 1)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: COLORS.primary[50],
                    borderWidth: 1,
                    borderColor: COLORS.primary[200],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="plus" size={16} color={COLORS.primary[600]} />
                </Pressable>

                <TextInput
                  value={String(count)}
                  onChangeText={(text) => handleCountInput(index, text)}
                  keyboardType="number-pad"
                  style={{
                    width: 48,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: COLORS.white,
                    borderWidth: 1,
                    borderColor: COLORS.cream[200],
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: '700',
                    fontFamily: 'Rubik-Bold',
                    color: COLORS.neutral[800],
                  }}
                />

                <Pressable
                  onPress={() => handleCountChange(index, -1)}
                  disabled={count <= 1}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor:
                      count > 1 ? COLORS.cream[100] : COLORS.neutral[100],
                    borderWidth: 1,
                    borderColor:
                      count > 1 ? COLORS.cream[200] : COLORS.neutral[200],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather
                    name="minus"
                    size={16}
                    color={
                      count > 1 ? COLORS.neutral[600] : COLORS.neutral[300]
                    }
                  />
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Summary */}
      <View
        style={{
          marginTop: 12,
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 10,
          backgroundColor: COLORS.primary[50],
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Feather name="info" size={14} color={COLORS.primary[600]} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Rubik-Regular',
            color: COLORS.primary[700],
          }}
        >
          סה״כ{' '}
          {Object.values(state.newApartmentCounts).reduce((a, b) => a + b, 0)}{' '}
          דירות ב-{state.newBuildings.length} בניינים
        </Text>
      </View>
    </View>
  );
}
