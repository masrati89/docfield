import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from '@/lib/haptics';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { COLORS } from '@infield/ui';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// --- Types ---

interface BOQRates {
  batzam: number;
  supervision: number;
  vat: number;
}

interface BOQRatesSectionProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

// --- Component ---

export function BOQRatesSection({ onSuccess, onError }: BOQRatesSectionProps) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const orgId = profile?.organizationId ?? '';

  const { data: orgSettings, isLoading } = useQuery({
    queryKey: ['org-settings', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('settings')
        .eq('id', orgId)
        .single();
      if (error) throw error;
      return (data?.settings as Record<string, unknown>) ?? {};
    },
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
  });

  const savedRates = useMemo(
    () =>
      (orgSettings?.boqRates as BOQRates | undefined) ?? {
        batzam: 10,
        supervision: 10,
        vat: 18,
      },
    [orgSettings?.boqRates]
  );

  const [batzam, setBatzam] = useState('');
  const [supervision, setSupervision] = useState('');
  const [vat, setVat] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isLoading && !initialized) {
      setBatzam(String(savedRates.batzam));
      setSupervision(String(savedRates.supervision));
      setVat(String(savedRates.vat));
      setInitialized(true);
    }
  }, [isLoading, initialized, savedRates]);

  const isDirty =
    initialized &&
    (Number(batzam) !== savedRates.batzam ||
      Number(supervision) !== savedRates.supervision ||
      Number(vat) !== savedRates.vat);

  const mutation = useMutation({
    mutationFn: async (rates: BOQRates) => {
      const newSettings = { ...orgSettings, boqRates: rates };
      const { error } = await supabase
        .from('organizations')
        .update({ settings: newSettings })
        .eq('id', orgId);
      if (error) throw error;
      return newSettings;
    },
    onSuccess: (newSettings) => {
      queryClient.setQueryData(['org-settings', orgId], newSettings);
      onSuccess?.('הגדרות כספיות נשמרו');
    },
    onError: () => {
      onError?.('שגיאה בשמירת ההגדרות');
    },
  });

  const handleSave = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    mutation.mutate({
      batzam: Number(batzam) || 0,
      supervision: Number(supervision) || 0,
      vat: Number(vat) || 0,
    });
  }, [batzam, supervision, vat, mutation]);

  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  if (isLoading) return null;

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 15,
          fontFamily: 'Rubik-SemiBold',
          color: COLORS.neutral[700],
          textAlign: 'right',
          marginBottom: 12,
        }}
      >
        הגדרות כספיות
      </Text>

      <View
        style={{
          backgroundColor: COLORS.cream[50],
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          borderRadius: 10,
          padding: 14,
          gap: 12,
        }}
      >
        <RateField label='בצמ"ה %' value={batzam} onChangeText={setBatzam} />
        <RateField
          label="פיקוח %"
          value={supervision}
          onChangeText={setSupervision}
        />
        <RateField label='מע"מ %' value={vat} onChangeText={setVat} />

        {/* Save button */}
        <Animated.View style={buttonStyle}>
          <Pressable
            onPress={handleSave}
            onPressIn={() => {
              buttonScale.value = withSpring(0.98, {
                damping: 15,
                stiffness: 150,
              });
            }}
            onPressOut={() => {
              buttonScale.value = withSpring(1, {
                damping: 15,
                stiffness: 150,
              });
            }}
            disabled={!isDirty || mutation.isPending}
            style={{
              backgroundColor: COLORS.primary[500],
              height: 40,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: !isDirty || mutation.isPending ? 0.4 : 1,
              marginTop: 4,
            }}
          >
            {mutation.isPending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 14,
                  fontFamily: 'Rubik-Medium',
                }}
              >
                שמור
              </Text>
            )}
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

// --- RateField sub-component ---

function RateField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontFamily: 'Rubik-Regular',
          color: COLORS.neutral[600],
          width: 70,
          textAlign: 'right',
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        style={{
          flex: 1,
          height: 38,
          borderRadius: 8,
          paddingHorizontal: 12,
          fontSize: 14,
          fontFamily: 'Rubik-Regular',
          color: COLORS.neutral[700],
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          textAlign: 'center',
        }}
      />
    </View>
  );
}
