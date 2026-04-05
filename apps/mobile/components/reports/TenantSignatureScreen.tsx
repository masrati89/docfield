import { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { SignaturePad } from '@/components/ui/SignaturePad';

// --- Types ---

interface TenantSignatureScreenProps {
  visible: boolean;
  initialName?: string;
  isUploading: boolean;
  onSign: (name: string, base64Png: string) => void;
  onClose: () => void;
}

// --- Shadow for sheet ---

const SHEET_SHADOW = {
  shadowColor: 'rgba(60,54,42,0.12)',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 1,
  shadowRadius: 20,
  elevation: 12,
};

// --- Component ---

export function TenantSignatureScreen({
  visible,
  initialName = '',
  isUploading,
  onSign,
  onClose,
}: TenantSignatureScreenProps) {
  const [name, setName] = useState(initialName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null);
  const hasDrawn = useRef(false);

  const canSubmit = name.trim().length > 0 && !!signatureBase64 && !isUploading;

  // --- Handlers ---

  const handleSaveSignature = useCallback((base64: string) => {
    setSignatureBase64(base64);
    hasDrawn.current = true;
  }, []);

  const handleClearSignature = useCallback(() => {
    setSignatureBase64(null);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      setNameError('שם הדייר הוא שדה חובה');
      return;
    }
    if (!signatureBase64) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSign(trimmedName, signatureBase64);
  }, [name, signatureBase64, onSign]);

  const handleClose = useCallback(() => {
    if (hasDrawn.current && signatureBase64) {
      Alert.alert('חתימה לא נשמרה', 'יש חתימה שלא נשמרה. לצאת?', [
        { text: 'ביטול', style: 'cancel' },
        { text: 'כן, צא', style: 'destructive', onPress: onClose },
      ]);
    } else {
      onClose();
    }
  }, [signatureBase64, onClose]);

  const handleNameChange = useCallback((text: string) => {
    setName(text);
    if (text.trim().length > 0) {
      setNameError(null);
    }
  }, []);

  // --- Render ---

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'flex-end',
        }}
        onPress={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ justifyContent: 'flex-end' }}
        >
          {/* Sheet */}
          <Animated.View
            entering={SlideInDown.duration(350).springify()}
            exiting={SlideOutDown.duration(250)}
            style={[
              {
                backgroundColor: COLORS.cream[50],
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                maxHeight: '92%',
                minHeight: 400,
              },
              SHEET_SHADOW,
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              {/* Handle */}
              <View style={{ alignItems: 'center', paddingTop: 8 }}>
                <View
                  style={{
                    width: 36,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: COLORS.cream[300],
                  }}
                />
              </View>

              {/* Header */}
              <View
                style={{
                  flexDirection: 'row-reverse',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingTop: 16,
                  paddingBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    fontFamily: 'Rubik-Bold',
                    color: COLORS.neutral[800],
                  }}
                >
                  חתימת דייר
                </Text>
                <Pressable
                  onPress={handleClose}
                  hitSlop={8}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: BORDER_RADIUS.full,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="x" size={20} color={COLORS.neutral[500]} />
                </Pressable>
              </View>

              {/* Name field */}
              <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Rubik-Regular',
                    color: COLORS.neutral[600],
                    textAlign: 'right',
                    marginBottom: 6,
                  }}
                >
                  שם הדייר
                </Text>
                <TextInput
                  value={name}
                  onChangeText={handleNameChange}
                  placeholder="הכנס שם דייר"
                  placeholderTextColor={COLORS.neutral[400]}
                  editable={!isUploading}
                  style={{
                    height: 44,
                    borderWidth: 1,
                    borderColor: nameError
                      ? COLORS.danger[500]
                      : COLORS.cream[200],
                    borderRadius: BORDER_RADIUS.md,
                    paddingHorizontal: 14,
                    fontSize: 14,
                    fontFamily: 'Rubik-Regular',
                    color: COLORS.neutral[800],
                    textAlign: 'right',
                    backgroundColor: COLORS.white,
                  }}
                />
                {nameError ? (
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.danger[500],
                      textAlign: 'right',
                      marginTop: 4,
                    }}
                  >
                    {nameError}
                  </Text>
                ) : null}
              </View>

              {/* Signature pad */}
              <View style={{ paddingHorizontal: 20, flex: 1, minHeight: 200 }}>
                <SignaturePad
                  onSave={handleSaveSignature}
                  onClear={handleClearSignature}
                  height={200}
                />
              </View>

              {/* Footer */}
              <View
                style={{
                  flexDirection: 'row-reverse',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTopWidth: 1,
                  borderTopColor: COLORS.cream[200],
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                }}
              >
                <Pressable
                  onPress={handleSubmit}
                  disabled={!canSubmit}
                  style={{
                    flex: 1,
                    height: 48,
                    marginStart: 12,
                    borderRadius: BORDER_RADIUS.md,
                    backgroundColor: canSubmit
                      ? COLORS.primary[500]
                      : COLORS.neutral[200],
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isUploading ? 0.6 : 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '700',
                      fontFamily: 'Rubik-Bold',
                      color: canSubmit ? COLORS.white : COLORS.neutral[400],
                    }}
                  >
                    {isUploading ? 'שומר...' : 'חתום והפק PDF'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleClose}
                  style={{
                    height: 48,
                    paddingHorizontal: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Rubik-Regular',
                      color: COLORS.neutral[500],
                    }}
                  >
                    חזרה
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
