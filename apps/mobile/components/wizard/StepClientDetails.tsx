import { useCallback } from 'react';
import { View, Text, TextInput } from 'react-native';

import { COLORS } from '@infield/ui';

import type { StepProps } from './NewInspectionWizard.types';

// --- Component ---

export function StepClientDetails({ state, dispatch, readOnly }: StepProps) {
  const handleNameChange = useCallback(
    (text: string) => dispatch({ type: 'SET_TENANT_NAME', payload: text }),
    [dispatch]
  );

  const handlePhoneChange = useCallback(
    (text: string) => dispatch({ type: 'SET_TENANT_PHONE', payload: text }),
    [dispatch]
  );

  const handleEmailChange = useCallback(
    (text: string) => dispatch({ type: 'SET_TENANT_EMAIL', payload: text }),
    [dispatch]
  );

  const handleIdChange = useCallback(
    (text: string) => dispatch({ type: 'SET_CLIENT_ID_NUMBER', payload: text }),
    [dispatch]
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
        פרטי המזמין
      </Text>

      {/* Name */}
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
          שם מלא
        </Text>
        <TextInput
          value={state.tenantName}
          onChangeText={handleNameChange}
          editable={!readOnly}
          placeholder="שם המזמין"
          placeholderTextColor={COLORS.neutral[300]}
          autoComplete="off"
          spellCheck={false}
          style={{
            height: 46,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: state.tenantName.trim()
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

      {/* ID number */}
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
          ת.ז.
        </Text>
        <TextInput
          value={state.clientIdNumber}
          onChangeText={handleIdChange}
          editable={!readOnly}
          placeholder="מספר תעודת זהות"
          placeholderTextColor={COLORS.neutral[300]}
          keyboardType="number-pad"
          autoComplete="off"
          spellCheck={false}
          style={{
            height: 46,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: state.clientIdNumber.trim()
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

      {/* Phone */}
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
          טלפון
        </Text>
        <TextInput
          value={state.tenantPhone}
          onChangeText={handlePhoneChange}
          editable={!readOnly}
          placeholder="050-0000000"
          placeholderTextColor={COLORS.neutral[300]}
          keyboardType="phone-pad"
          autoComplete="off"
          spellCheck={false}
          style={{
            height: 46,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: state.tenantPhone.trim()
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

      {/* Email */}
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
          אימייל
        </Text>
        <TextInput
          value={state.tenantEmail}
          onChangeText={handleEmailChange}
          editable={!readOnly}
          placeholder="email@example.com"
          placeholderTextColor={COLORS.neutral[300]}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          style={{
            height: 46,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: state.tenantEmail.trim()
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
  );
}
