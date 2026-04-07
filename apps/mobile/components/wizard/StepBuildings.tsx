import { useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';

import type { StepProps } from './NewInspectionWizard.types';

// --- Component ---

export function StepBuildings({ state, dispatch }: StepProps) {
  const count = state.newBuildings.length;

  const handleCountChange = useCallback(
    (delta: number) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      dispatch({ type: 'SET_BUILDINGS_COUNT', payload: count + delta });
    },
    [count, dispatch]
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
        כמה בניינים יש בפרויקט?
      </Text>

      {/* Count selector */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <Pressable
          onPress={() => handleCountChange(1)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: COLORS.primary[50],
            borderWidth: 1,
            borderColor: COLORS.primary[200],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="plus" size={20} color={COLORS.primary[600]} />
        </Pressable>

        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            fontFamily: 'Rubik-Bold',
            color: COLORS.neutral[800],
            minWidth: 40,
            textAlign: 'center',
          }}
        >
          {count}
        </Text>

        <Pressable
          onPress={() => handleCountChange(-1)}
          disabled={count <= 1}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor:
              count > 1 ? COLORS.cream[100] : COLORS.neutral[100],
            borderWidth: 1,
            borderColor: count > 1 ? COLORS.cream[200] : COLORS.neutral[200],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather
            name="minus"
            size={20}
            color={count > 1 ? COLORS.neutral[600] : COLORS.neutral[300]}
          />
        </Pressable>
      </View>

      {/* Building name inputs */}
      <Text
        style={{
          fontSize: 13,
          fontWeight: '500',
          fontFamily: 'Rubik-Medium',
          color: COLORS.neutral[500],
          textAlign: 'right',
          marginBottom: 8,
        }}
      >
        שמות הבניינים
      </Text>

      <ScrollView
        style={{ maxHeight: 280 }}
        showsVerticalScrollIndicator={false}
      >
        {state.newBuildings.map((building, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 10,
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: COLORS.primary[50],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="home" size={14} color={COLORS.primary[500]} />
            </View>
            <TextInput
              value={building.name}
              onChangeText={(text) =>
                dispatch({
                  type: 'SET_BUILDING_NAME',
                  payload: { index, name: text },
                })
              }
              placeholder={`בניין ${index + 1}`}
              placeholderTextColor={COLORS.neutral[400]}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 10,
                backgroundColor: COLORS.cream[100],
                borderWidth: 1,
                borderColor: building.name.trim()
                  ? COLORS.primary[200]
                  : COLORS.cream[200],
                paddingHorizontal: 12,
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[800],
                textAlign: 'right',
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
