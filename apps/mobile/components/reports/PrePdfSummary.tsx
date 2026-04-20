import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import type { ReportInfo } from '@/hooks/useReport';

// --- Types ---

interface DefectInfo {
  id: string;
  category: string | null;
  severity?: string;
}

interface PrePdfSummaryProps {
  visible: boolean;
  report: ReportInfo;
  defects: DefectInfo[];
  onGeneratePdf: () => void;
  onContinueToSignature: () => void;
  onClose: () => void;
}

// --- Category Mappings ---

const CATEGORY_ICONS: Record<string, string> = {
  plaster: 'layers',
  painting: 'edit-2',
  tiling: 'grid',
  wall_cladding: 'sidebar',
  plumbing: 'droplet',
  electrical: 'zap',
  carpentry: 'tool',
  aluminum: 'square',
  waterproofing: 'umbrella',
  cleaning: 'wind',
  hvac: 'thermometer',
  gas: 'alert-triangle',
  elevators: 'arrow-up',
  general: 'file-text',
};

const CATEGORY_LABELS: Record<string, string> = {
  plaster: 'טיח',
  painting: 'צביעה',
  tiling: 'ריצוף',
  wall_cladding: 'חיפוי קירות',
  plumbing: 'אינסטלציה',
  electrical: 'חשמל',
  carpentry: 'נגרות',
  aluminum: 'אלומיניום',
  waterproofing: 'איטום',
  cleaning: 'ניקיון',
  hvac: 'מיזוג אוויר',
  gas: 'גז',
  elevators: 'מעליות',
  general: 'כללי',
};

// --- Helpers ---

function groupDefectsByCategory(defects: DefectInfo[]) {
  const map = new Map<string, number>();
  for (const d of defects) {
    const cat = d.category ?? 'general';
    map.set(cat, (map.get(cat) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

// --- Shadow for sheet (no SHADOWS.up exists) ---

const SHEET_SHADOW = {
  shadowColor: 'rgba(60,54,42,0.12)',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 1,
  shadowRadius: 20,
  elevation: 12,
};

// --- Component ---

export function PrePdfSummary({
  visible,
  report,
  defects,
  onGeneratePdf,
  onContinueToSignature,
  onClose,
}: PrePdfSummaryProps) {
  const isDelivery = report.reportType === 'delivery';
  const totalDefects = defects.length;
  const categoryGroups = groupDefectsByCategory(defects);

  const handleCta = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isDelivery) {
      onContinueToSignature();
    } else {
      onGeneratePdf();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(60,54,42,0.4)',
          justifyContent: 'flex-end',
        }}
        onPress={onClose}
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
              minHeight: 300,
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
                  textAlign: 'right',
                }}
              >
                סיכום דוח
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[500],
                  textAlign: 'right',
                  marginTop: 4,
                }}
              >
                {report.projectName} — דירה {report.apartmentNumber}
              </Text>
            </View>

            {/* Total defects row */}
            <View
              style={{
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  fontFamily: 'Rubik-Medium',
                  color: COLORS.neutral[700],
                }}
              >
                סה״כ ליקויים
              </Text>
              <View
                style={{
                  backgroundColor:
                    totalDefects > 0 ? COLORS.danger[50] : COLORS.success[50],
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: BORDER_RADIUS.full,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    fontFamily: 'Rubik-Bold',
                    color:
                      totalDefects > 0
                        ? COLORS.danger[500]
                        : COLORS.success[500],
                  }}
                >
                  {totalDefects}
                </Text>
              </View>
            </View>

            {/* Category breakdown */}
            <ScrollView
              style={{ paddingHorizontal: 20, flex: 1 }}
              contentContainerStyle={{ paddingBottom: 8 }}
              showsVerticalScrollIndicator={false}
            >
              {totalDefects === 0 ? (
                <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                  <Feather
                    name="check-circle"
                    size={32}
                    color={COLORS.success[500]}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Rubik-Regular',
                      color: COLORS.neutral[500],
                      marginTop: 12,
                      textAlign: 'center',
                    }}
                  >
                    אין ליקויים
                  </Text>
                </View>
              ) : (
                categoryGroups.map(([category, count]) => (
                  <View
                    key={category}
                    style={{
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.cream[200],
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: BORDER_RADIUS.md,
                        backgroundColor: COLORS.cream[100],
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Feather
                        name={
                          (CATEGORY_ICONS[category] ??
                            'file-text') as keyof typeof Feather.glyphMap
                        }
                        size={16}
                        color={COLORS.neutral[600]}
                      />
                    </View>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 14,
                        fontFamily: 'Rubik-Regular',
                        color: COLORS.neutral[700],
                        marginEnd: 10,
                        textAlign: 'right',
                      }}
                    >
                      {CATEGORY_LABELS[category] ?? category}
                    </Text>
                    <View
                      style={{
                        backgroundColor: COLORS.cream[200],
                        paddingHorizontal: 10,
                        paddingVertical: 2,
                        borderRadius: BORDER_RADIUS.full,
                        minWidth: 28,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          fontFamily: 'Rubik-Medium',
                          color: COLORS.neutral[700],
                        }}
                      >
                        {count}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Footer */}
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                borderTopWidth: 1,
                borderTopColor: COLORS.cream[200],
                paddingHorizontal: 20,
                paddingVertical: 16,
              }}
            >
              <Pressable
                onPress={handleCta}
                style={{
                  flex: 1,
                  height: 48,
                  marginStart: 12,
                  borderRadius: BORDER_RADIUS.md,
                  backgroundColor: COLORS.primary[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    fontFamily: 'Rubik-Bold',
                    color: COLORS.white,
                  }}
                >
                  {isDelivery ? 'המשך לחתימה' : 'הפק PDF'}
                </Text>
              </Pressable>
              <Pressable
                onPress={onClose}
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
      </Pressable>
    </Modal>
  );
}
