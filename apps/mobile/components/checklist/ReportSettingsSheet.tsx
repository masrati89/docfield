import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { Button } from '@/components/ui';
import { supabase } from '@/lib/supabase';

// --- Types ---

interface ReportSettingsSheetProps {
  reportId: string;
  tenantName: string | null;
  tenantPhone: string | null;
  notes: string | null;
  roundNumber: number;
  onSaved: () => void;
  onClose?: () => void;
}

// --- Component ---

export function ReportSettingsSheet({
  reportId,
  tenantName: initialName,
  tenantPhone: initialPhone,
  notes: initialNotes,
  roundNumber,
  onSaved,
  onClose,
}: ReportSettingsSheetProps) {
  const [name, setName] = useState(initialName ?? '');
  const [phone, setPhone] = useState(initialPhone ?? '');
  const [notes, setNotes] = useState(initialNotes ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const roundLabel =
    roundNumber === 1 ? 'מסירה ראשונית' : `מסירה ${roundNumber}`;

  const handleSave = useCallback(async () => {
    if (phone.trim() && !/^[\d\-\s()+]{9,15}$/.test(phone.trim())) {
      Alert.alert('שגיאה', 'מספר טלפון לא תקין');
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('delivery_reports')
        .update({
          tenant_name: name.trim() || null,
          tenant_phone: phone.trim().replace(/[-\s]/g, '') || null,
          notes: notes.trim() || null,
        })
        .eq('id', reportId);

      if (error) throw error;

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onSaved();
    } catch {
      Alert.alert('שגיאה', 'לא הצלחנו לשמור את ההגדרות. נסה שוב.');
    } finally {
      setIsSaving(false);
    }
  }, [reportId, name, phone, notes, onSaved]);

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: '700',
            fontFamily: 'Rubik-Bold',
            color: COLORS.neutral[800],
            textAlign: 'right',
          }}
        >
          הגדרות הדוח
        </Text>
        {onClose && (
          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.cream[100],
              borderWidth: 1,
              borderColor: COLORS.cream[200],
            }}
          >
            <Feather name="x" size={18} color={COLORS.neutral[600]} />
          </Pressable>
        )}
      </View>

      {/* Round badge */}
      <View
        style={{
          alignSelf: 'flex-end',
          backgroundColor: COLORS.primary[50],
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 6,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Rubik-Medium',
            color: COLORS.primary[700],
          }}
        >
          {roundLabel}
        </Text>
      </View>

      {/* Tenant name */}
      <Text style={labelStyle}>שם הדייר</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="הכנס שם דייר"
        placeholderTextColor={COLORS.neutral[400]}
        style={inputStyle}
      />

      {/* Tenant phone */}
      <Text style={labelStyle}>טלפון דייר</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="050-0000000"
        placeholderTextColor={COLORS.neutral[400]}
        keyboardType="phone-pad"
        style={inputStyle}
      />

      {/* Notes */}
      <Text style={labelStyle}>הערות לתחילת הדוח</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="הערות כלליות..."
        placeholderTextColor={COLORS.neutral[400]}
        multiline
        numberOfLines={3}
        maxLength={500}
        style={[inputStyle, { minHeight: 80, textAlignVertical: 'top' }]}
      />

      {/* Save button */}
      <View style={{ marginTop: 16 }}>
        <Button
          label={isSaving ? 'שומר...' : 'שמור הגדרות'}
          onPress={handleSave}
          disabled={isSaving}
          size="lg"
        />
      </View>
    </View>
  );
}

// --- Styles ---

const labelStyle = {
  fontSize: 13,
  fontFamily: 'Rubik-Regular',
  color: COLORS.neutral[600],
  textAlign: 'right' as const,
  marginBottom: 6,
  marginTop: 12,
};

const inputStyle = {
  height: 44,
  borderWidth: 1,
  borderColor: COLORS.cream[200],
  borderRadius: BORDER_RADIUS.md,
  paddingHorizontal: 14,
  fontSize: 14,
  fontFamily: 'Rubik-Regular',
  color: COLORS.neutral[800],
  textAlign: 'right' as const,
  backgroundColor: COLORS.cream[50],
};
