import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  Platform,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';
import { Button } from '@/components/ui';
import { supabase } from '@/lib/supabase';

// --- Types ---

interface ReportSettingsSheetProps {
  reportId: string;
  tenantName: string | null;
  tenantPhone: string | null;
  notes: string | null;
  roundNumber: number;
  noChecklist: boolean;
  onSaved: () => void;
  onClose?: () => void;
}

// --- Error Toast (replaces Alert.alert) ---

function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        padding: 10,
        backgroundColor: COLORS.danger[50],
        borderWidth: 1,
        borderColor: COLORS.danger[200],
        borderRadius: 10,
        marginBottom: 12,
      }}
    >
      <Feather name="alert-circle" size={16} color={COLORS.danger[500]} />
      <Text
        style={{
          flex: 1,
          fontSize: 13,
          fontFamily: 'Rubik-Regular',
          color: COLORS.danger[700],
          textAlign: 'right',
        }}
      >
        {message}
      </Text>
    </View>
  );
}

// --- Confirm Modal ---

function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const btnScale = useSharedValue(1);
  const btnAnim = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        onPress={onCancel}
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
            ...SHADOWS.lg,
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
            {title}
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
            {message}
          </Text>
          <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
            <Animated.View style={[{ flex: 1 }, btnAnim]}>
              <Pressable
                onPress={() => {
                  if (Platform.OS !== 'web')
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onConfirm();
                }}
                onPressIn={() => {
                  btnScale.value = withSpring(0.96, {
                    damping: 15,
                    stiffness: 150,
                  });
                }}
                onPressOut={() => {
                  btnScale.value = withSpring(1, {
                    damping: 15,
                    stiffness: 150,
                  });
                }}
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
                  {confirmLabel}
                </Text>
              </Pressable>
            </Animated.View>
            <Pressable
              onPress={onCancel}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 10,
                backgroundColor: COLORS.cream[100],
                borderWidth: 1,
                borderColor: COLORS.cream[200],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik-Medium',
                  color: COLORS.neutral[600],
                }}
              >
                ביטול
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// --- Component ---

export function ReportSettingsSheet({
  reportId,
  tenantName: initialName,
  tenantPhone: initialPhone,
  notes: initialNotes,
  roundNumber,
  noChecklist: initialNoChecklist,
  onSaved,
  onClose,
}: ReportSettingsSheetProps) {
  const [name, setName] = useState(initialName ?? '');
  const [phone, setPhone] = useState(initialPhone ?? '');
  const [notes, setNotes] = useState(initialNotes ?? '');
  const [noChecklist, setNoChecklist] = useState(initialNoChecklist);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showNoChecklistConfirm, setShowNoChecklistConfirm] = useState(false);

  const roundLabel =
    roundNumber === 1 ? 'מסירה ראשונית' : `מסירה ${roundNumber}`;

  const handleToggleNoChecklist = useCallback(
    (newValue: boolean) => {
      if (newValue && !noChecklist) {
        // Switching to no-checklist: confirm first
        setShowNoChecklistConfirm(true);
      } else {
        setNoChecklist(newValue);
      }
    },
    [noChecklist]
  );

  const handleConfirmNoChecklist = useCallback(() => {
    setShowNoChecklistConfirm(false);
    setNoChecklist(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (phone.trim() && !/^[\d\-\s()+]{9,15}$/.test(phone.trim())) {
      setErrorMsg('מספר טלפון לא תקין');
      return;
    }
    setErrorMsg(null);
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('delivery_reports')
        .update({
          tenant_name: name.trim() || null,
          tenant_phone: phone.trim().replace(/[-\s]/g, '') || null,
          notes: notes.trim() || null,
          no_checklist: noChecklist,
        })
        .eq('id', reportId);

      if (error) throw error;

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onSaved();
    } catch {
      setErrorMsg('לא הצלחנו לשמור את ההגדרות. נסה שוב.');
    } finally {
      setIsSaving(false);
    }
  }, [reportId, name, phone, notes, noChecklist, onSaved]);

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 }}>
      {/* No-checklist confirmation modal */}
      <ConfirmModal
        visible={showNoChecklistConfirm}
        title="ביטול צ׳קליסט"
        message="בהפעלת מצב זה, הצ'קליסט לא יופיע בדוח. הוספת ממצאים תתבצע ידנית בלבד."
        confirmLabel="אישור"
        onConfirm={handleConfirmNoChecklist}
        onCancel={() => setShowNoChecklistConfirm(false)}
      />

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

      {/* Error banner */}
      <ErrorBanner message={errorMsg} />

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

      {/* No-checklist toggle */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
          paddingVertical: 12,
          paddingHorizontal: 14,
          backgroundColor: COLORS.cream[100],
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          borderRadius: BORDER_RADIUS.md,
        }}
      >
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 8,
            flex: 1,
          }}
        >
          <Feather
            name={noChecklist ? 'x-circle' : 'check-circle'}
            size={18}
            color={noChecklist ? COLORS.neutral[400] : COLORS.primary[500]}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Medium',
                color: COLORS.neutral[700],
                textAlign: 'right',
              }}
            >
              {noChecklist ? 'ללא צ׳קליסט' : 'צ׳קליסט פעיל'}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[400],
                textAlign: 'right',
              }}
            >
              {noChecklist
                ? 'הוספת ממצאים ידנית בלבד'
                : 'צ׳קליסט חדרים מוצג בדוח'}
            </Text>
          </View>
        </View>
        <Switch
          value={noChecklist}
          onValueChange={handleToggleNoChecklist}
          trackColor={{
            false: COLORS.cream[200],
            true: COLORS.primary[200],
          }}
          thumbColor={noChecklist ? COLORS.primary[500] : COLORS.neutral[300]}
        />
      </View>

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
