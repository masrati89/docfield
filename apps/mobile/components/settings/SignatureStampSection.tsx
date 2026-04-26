import { useCallback, useState } from 'react';
import { View, Text, Pressable, Modal, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from '@/lib/haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { SignaturePad } from '@/components/ui/SignaturePad';
import { useSignature } from '@/hooks/useSignature';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';

// --- Types ---

interface SignatureStampSectionProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

// --- Component ---

export function SignatureStampSection({
  onSuccess,
  onError,
}: SignatureStampSectionProps) {
  const {
    inspectorSignatureUrl,
    inspectorStampUrl,
    saveInspectorSignature,
    deleteInspectorSignature,
    saveInspectorStamp,
    deleteInspectorStamp,
    isUploading,
  } = useSignature();

  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // --- Signature handlers ---

  const handleSaveSignature = useCallback(
    async (base64Png: string) => {
      try {
        await saveInspectorSignature(base64Png);
        setShowSignaturePad(false);
        onSuccess?.('החתימה נשמרה בהצלחה');
      } catch {
        onError?.('שגיאה בשמירת החתימה');
      }
    },
    [saveInspectorSignature, onSuccess, onError]
  );

  const handleDeleteSignature = useCallback(() => {
    setConfirmAction({
      title: 'מחיקת חתימה',
      message: 'למחוק את החתימה?',
      onConfirm: async () => {
        try {
          await deleteInspectorSignature();
          setShowSignaturePad(false);
          onSuccess?.('החתימה נמחקה');
        } catch {
          onError?.('שגיאה במחיקת החתימה');
        }
      },
    });
  }, [deleteInspectorSignature, onSuccess, onError]);

  const handleReplaceSignature = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSignaturePad(true);
  }, []);

  // --- Stamp handlers ---

  const handleUploadStamp = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 0.8,
        allowsEditing: true,
        aspect: [2, 1],
      });

      if (result.canceled || !result.assets?.[0]) return;

      await saveInspectorStamp(result.assets[0].uri);
      onSuccess?.('החותמת נשמרה בהצלחה');
    } catch {
      onError?.('שגיאה בהעלאת החותמת');
    }
  }, [saveInspectorStamp, onSuccess, onError]);

  const handleDeleteStamp = useCallback(() => {
    setConfirmAction({
      title: 'מחיקת חותמת',
      message: 'למחוק את החותמת?',
      onConfirm: async () => {
        try {
          await deleteInspectorStamp();
          onSuccess?.('החותמת נמחקה');
        } catch {
          onError?.('שגיאה במחיקת החותמת');
        }
      },
    });
  }, [deleteInspectorStamp, onSuccess, onError]);

  const handleReplaceStamp = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleUploadStamp();
  }, [handleUploadStamp]);

  // --- Render ---

  const hasSignature = !!inspectorSignatureUrl;
  const hasStamp = !!inspectorStampUrl;

  return (
    <View style={styles.container}>
      {/* Section title */}
      <Text style={styles.sectionTitle}>חתימה וחותמת</Text>

      {/* Signature area */}
      <Text style={styles.label}>חתימת בודק</Text>

      {isUploading ? (
        <SkeletonBlock width="100%" height={120} borderRadius={12} />
      ) : hasSignature && !showSignaturePad ? (
        <>
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: inspectorSignatureUrl }}
              style={styles.signatureImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleReplaceSignature}
              style={styles.replaceButton}
            >
              <Text style={styles.replaceButtonText}>החלף</Text>
            </Pressable>
            <Pressable onPress={handleDeleteSignature}>
              <Text style={styles.deleteButtonText}>מחק</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <SignaturePad onSave={handleSaveSignature} height={180} />
      )}

      {/* Stamp area */}
      <View style={styles.stampSection}>
        <Text style={styles.label}>חותמת (אופציונלי)</Text>

        {hasStamp ? (
          <>
            <View style={styles.stampPreviewContainer}>
              <Image
                source={{ uri: inspectorStampUrl }}
                style={styles.stampImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.actionsRow}>
              <Pressable
                onPress={handleReplaceStamp}
                style={styles.replaceButton}
              >
                <Text style={styles.replaceButtonText}>החלף</Text>
              </Pressable>
              <Pressable onPress={handleDeleteStamp}>
                <Text style={styles.deleteButtonText}>מחק</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Pressable onPress={handleUploadStamp} style={styles.uploadButton}>
            <Feather name="upload" size={20} color={COLORS.primary[500]} />
            <Text style={styles.uploadButtonText}>העלה חותמת</Text>
          </Pressable>
        )}
      </View>

      {/* Confirmation modal (replaces Alert.alert for cross-platform) */}
      <Modal
        visible={!!confirmAction}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmAction(null)}
      >
        <Pressable
          onPress={() => setConfirmAction(null)}
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
              {confirmAction?.title}
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
              {confirmAction?.message}
            </Text>
            <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
              <Pressable
                onPress={() => {
                  confirmAction?.onConfirm();
                  setConfirmAction(null);
                }}
                style={{
                  flex: 1,
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
                  אישור
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setConfirmAction(null)}
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
    </View>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Rubik-SemiBold',
    color: COLORS.neutral[800],
    textAlign: 'right',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Rubik-Regular',
    color: COLORS.neutral[600],
    textAlign: 'right',
    marginBottom: 8,
  },
  previewContainer: {
    height: 120,
    borderWidth: 1,
    borderColor: COLORS.cream[200],
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureImage: {
    width: '80%',
    height: 80,
  },
  stampSection: {
    marginTop: 24,
  },
  stampPreviewContainer: {
    height: 100,
    borderWidth: 1,
    borderColor: COLORS.cream[200],
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stampImage: {
    width: '60%',
    height: 70,
  },
  actionsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  replaceButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.cream[200],
    borderRadius: BORDER_RADIUS.md,
  },
  replaceButtonText: {
    fontSize: 13,
    fontFamily: 'Rubik-Regular',
    color: COLORS.neutral[800],
  },
  deleteButtonText: {
    fontSize: 13,
    fontFamily: 'Rubik-Regular',
    color: COLORS.danger[500],
  },
  uploadButton: {
    height: 80,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row-reverse',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 13,
    fontFamily: 'Rubik-Regular',
    color: COLORS.primary[500],
  },
});
