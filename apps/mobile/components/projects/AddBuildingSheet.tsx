import { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import * as Haptics from '@/lib/haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { createBuildingSchema } from '@infield/shared/src/validation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';

// --- Types ---

interface AddBuildingSheetProps {
  projectId: string;
  onClose: () => void;
  onCreated: () => void;
}

// --- Component ---

export function AddBuildingSheet({
  projectId,
  onClose,
  onCreated,
}: AddBuildingSheetProps) {
  const { profile } = useAuth();

  const [name, setName] = useState('');
  const [floorsCount, setFloorsCount] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const canSave =
    name.trim().length > 0 &&
    floorsCount.trim().length > 0 &&
    parseInt(floorsCount, 10) > 0;

  const handleSave = useCallback(async () => {
    if (!canSave || !profile?.organizationId) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setIsSaving(true);
    try {
      // Zod validation before Supabase insert (security M1)
      const validation = createBuildingSchema.safeParse({
        projectId,
        name: name.trim(),
        floorsCount: parseInt(floorsCount, 10) || undefined,
      });

      if (!validation.success) {
        const firstError =
          validation.error.errors[0]?.message ?? 'שגיאה בנתונים';
        setAlertMessage({ title: 'שגיאה', message: firstError });
        setIsSaving(false);
        return;
      }

      const { error } = await supabase.from('buildings').insert({
        project_id: projectId,
        organization_id: profile.organizationId,
        name: name.trim(),
        floors_count: parseInt(floorsCount, 10),
      });

      if (error) throw error;

      onCreated();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'שגיאה לא ידועה';
      setAlertMessage({ title: 'שגיאה ביצירת בניין', message });
    } finally {
      setIsSaving(false);
    }
  }, [canSave, profile, projectId, name, floorsCount, onCreated, onClose]);

  const handleFloorsChange = useCallback((text: string) => {
    // Allow only digits
    const cleaned = text.replace(/[^0-9]/g, '');
    setFloorsCount(cleaned);
  }, []);

  return (
    <View style={{ padding: 20, paddingBottom: 32 }}>
      {/* Header */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          fontFamily: 'Rubik-Bold',
          color: COLORS.neutral[800],
          textAlign: 'right',
          marginBottom: 20,
        }}
      >
        בניין חדש
      </Text>

      {/* Building name */}
      <Text style={labelStyle}>שם הבניין *</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="לדוגמה: בניין A"
        placeholderTextColor={COLORS.neutral[400]}
        style={[
          inputStyle,
          {
            borderColor: name.trim() ? COLORS.primary[200] : COLORS.cream[300],
            backgroundColor: name.trim()
              ? COLORS.primary[50]
              : COLORS.cream[50],
          },
        ]}
        autoFocus
      />

      {/* Floors count */}
      <Text style={[labelStyle, { marginTop: 14 }]}>מספר קומות *</Text>
      <TextInput
        value={floorsCount}
        onChangeText={handleFloorsChange}
        placeholder="לדוגמה: 8"
        placeholderTextColor={COLORS.neutral[400]}
        keyboardType="number-pad"
        style={[
          inputStyle,
          {
            borderColor: floorsCount.trim()
              ? COLORS.primary[200]
              : COLORS.cream[300],
            backgroundColor: floorsCount.trim()
              ? COLORS.primary[50]
              : COLORS.cream[50],
          },
        ]}
      />

      {/* Save button */}
      <View style={{ marginTop: 24 }}>
        <Button
          label={isSaving ? 'יוצר בניין...' : 'הוסף בניין'}
          onPress={handleSave}
          disabled={!canSave || isSaving}
          loading={isSaving}
          size="lg"
        />
      </View>

      {/* Info/error alert modal (replaces Alert.alert for cross-platform) */}
      <Modal
        visible={!!alertMessage}
        transparent
        animationType="fade"
        onRequestClose={() => setAlertMessage(null)}
      >
        <Pressable
          onPress={() => setAlertMessage(null)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              width: '100%',
              maxWidth: 320,
              backgroundColor: COLORS.cream[50],
              borderRadius: 14,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Rubik-SemiBold',
                color: COLORS.neutral[800],
                textAlign: 'right',
                marginBottom: 8,
              }}
            >
              {alertMessage?.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[600],
                textAlign: 'right',
                marginBottom: 20,
              }}
            >
              {alertMessage?.message}
            </Text>
            <Pressable
              onPress={() => setAlertMessage(null)}
              style={{
                height: 40,
                borderRadius: 10,
                backgroundColor: COLORS.primary[500],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik-SemiBold',
                  color: COLORS.white,
                }}
              >
                הבנתי
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// --- Styles ---

const labelStyle = {
  fontSize: 13,
  fontFamily: 'Rubik-Medium',
  color: COLORS.neutral[600],
  textAlign: 'right' as const,
  marginBottom: 6,
};

const inputStyle = {
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: BORDER_RADIUS.md,
  borderWidth: 1,
  borderColor: COLORS.cream[300],
  backgroundColor: COLORS.cream[50],
  fontSize: 14,
  fontFamily: 'Rubik-Regular',
  color: COLORS.neutral[800],
  textAlign: 'right' as const,
};
