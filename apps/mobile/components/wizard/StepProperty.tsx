import { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';

import type { StepProps } from './NewInspectionWizard.types';

// --- Property type presets ---

const PROPERTY_TYPES = [
  'דירה',
  'פנטהאוז',
  'דופלקס',
  "קוטג'",
  'בית פרטי',
  'משרד',
  'חנות',
];

// --- Component ---

export function StepProperty({ state, dispatch, readOnly }: StepProps) {
  const [showTypes, setShowTypes] = useState(false);

  const handleAddressChange = useCallback(
    (text: string) => dispatch({ type: 'SET_PROPERTY_ADDRESS', payload: text }),
    [dispatch]
  );

  const handleApartmentChange = useCallback(
    (text: string) => dispatch({ type: 'SET_APARTMENT_LABEL', payload: text }),
    [dispatch]
  );

  const handleFloorChange = useCallback(
    (text: string) => dispatch({ type: 'SET_PROPERTY_FLOOR', payload: text }),
    [dispatch]
  );

  const handleAreaChange = useCallback(
    (text: string) => dispatch({ type: 'SET_PROPERTY_AREA', payload: text }),
    [dispatch]
  );

  const handleTypeChange = useCallback(
    (text: string) => {
      dispatch({ type: 'SET_PROPERTY_TYPE', payload: text });
      setShowTypes(false);
    },
    [dispatch]
  );

  const filteredTypes = useMemo(() => {
    if (!state.propertyType.trim()) return PROPERTY_TYPES;
    const q = state.propertyType.trim().toLowerCase();
    return PROPERTY_TYPES.filter((t) => t.toLowerCase().includes(q));
  }, [state.propertyType]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 24,
      }}
      keyboardShouldPersistTaps="handled"
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
        פרטי הנכס
      </Text>

      {/* Address */}
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'Rubik-Medium',
            color: COLORS.neutral[500],
            textAlign: 'right',
            marginBottom: 6,
          }}
        >
          כתובת
        </Text>
        <TextInput
          value={state.propertyAddress}
          onChangeText={handleAddressChange}
          editable={!readOnly}
          placeholder="רחוב, מספר בית, עיר"
          placeholderTextColor={COLORS.neutral[300]}
          autoComplete="off"
          spellCheck={false}
          style={{
            height: 46,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: state.propertyAddress.trim()
              ? COLORS.primary[500]
              : COLORS.cream[200],
            backgroundColor: COLORS.cream[50],
            paddingHorizontal: 14,
            fontSize: 16,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[800],
            textAlign: 'right',
          }}
        />
      </View>

      {/* Apartment label */}
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'Rubik-Medium',
            color: COLORS.neutral[500],
            textAlign: 'right',
            marginBottom: 6,
          }}
        >
          דירה
        </Text>
        <TextInput
          value={state.apartmentLabel}
          onChangeText={handleApartmentChange}
          editable={!readOnly}
          placeholder="מספר / שם דירה"
          placeholderTextColor={COLORS.neutral[300]}
          autoComplete="off"
          spellCheck={false}
          style={{
            height: 46,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: state.apartmentLabel.trim()
              ? COLORS.primary[500]
              : COLORS.cream[200],
            backgroundColor: COLORS.cream[50],
            paddingHorizontal: 14,
            fontSize: 16,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[800],
            textAlign: 'right',
          }}
        />
      </View>

      {/* Floor + Area row */}
      <View style={{ flexDirection: 'row-reverse', gap: 12, marginBottom: 16 }}>
        {/* Floor */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Rubik-Medium',
              color: COLORS.neutral[500],
              textAlign: 'right',
              marginBottom: 6,
            }}
          >
            קומה
          </Text>
          <TextInput
            value={state.propertyFloor}
            onChangeText={handleFloorChange}
            editable={!readOnly}
            placeholder="0"
            placeholderTextColor={COLORS.neutral[300]}
            keyboardType="number-pad"
            autoComplete="off"
            style={{
              height: 46,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: state.propertyFloor.trim()
                ? COLORS.primary[500]
                : COLORS.cream[200],
              backgroundColor: COLORS.cream[50],
              paddingHorizontal: 14,
              fontSize: 16,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[800],
              textAlign: 'right',
            }}
          />
        </View>

        {/* Area */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Rubik-Medium',
              color: COLORS.neutral[500],
              textAlign: 'right',
              marginBottom: 6,
            }}
          >
            שטח (מ"ר)
          </Text>
          <TextInput
            value={state.propertyArea}
            onChangeText={handleAreaChange}
            editable={!readOnly}
            placeholder="0"
            placeholderTextColor={COLORS.neutral[300]}
            keyboardType="decimal-pad"
            autoComplete="off"
            style={{
              height: 46,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: state.propertyArea.trim()
                ? COLORS.primary[500]
                : COLORS.cream[200],
              backgroundColor: COLORS.cream[50],
              paddingHorizontal: 14,
              fontSize: 16,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[800],
              textAlign: 'left',
              direction: 'ltr',
            }}
          />
        </View>
      </View>

      {/* Property type */}
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'Rubik-Medium',
            color: COLORS.neutral[500],
            textAlign: 'right',
            marginBottom: 6,
          }}
        >
          סוג נכס
        </Text>
        <View>
          <TextInput
            value={state.propertyType}
            onChangeText={(text) => {
              dispatch({ type: 'SET_PROPERTY_TYPE', payload: text });
              setShowTypes(true);
            }}
            onFocus={() => setShowTypes(true)}
            editable={!readOnly}
            placeholder="דירה, פנטהאוז, משרד..."
            placeholderTextColor={COLORS.neutral[300]}
            autoComplete="off"
            spellCheck={false}
            style={{
              height: 46,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: state.propertyType.trim()
                ? COLORS.primary[500]
                : COLORS.cream[200],
              backgroundColor: COLORS.cream[50],
              paddingHorizontal: 14,
              fontSize: 16,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[800],
              textAlign: 'right',
            }}
          />

          {/* Dropdown suggestions */}
          {showTypes && filteredTypes.length > 0 && (
            <View
              style={{
                marginTop: 4,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: COLORS.cream[200],
                backgroundColor: COLORS.cream[50],
                overflow: 'hidden',
              }}
            >
              {filteredTypes.map((type) => (
                <Pressable
                  key={type}
                  onPress={() => handleTypeChange(type)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.cream[200],
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {state.propertyType === type && (
                    <Feather
                      name="check"
                      size={14}
                      color={COLORS.primary[500]}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Rubik-Regular',
                      color: COLORS.neutral[700],
                      textAlign: 'right',
                    }}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
