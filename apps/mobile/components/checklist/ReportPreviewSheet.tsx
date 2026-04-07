import { useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

// --- Types ---

interface DefectPreview {
  id: string;
  description: string;
  room: string | null;
  category: string | null;
  severity: string;
}

interface ReportPreviewSheetProps {
  defects: DefectPreview[];
  reportTitle: string;
  projectName: string;
  apartmentNumber: string;
  onClose?: () => void;
}

// --- Helpers ---

const SEVERITY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  critical: {
    label: 'קריטי',
    color: COLORS.danger[700],
    bg: COLORS.danger[50],
  },
  medium: { label: 'בינוני', color: COLORS.gold[700], bg: COLORS.warning[50] },
  low: { label: 'קל', color: COLORS.primary[500], bg: COLORS.primary[50] },
};

// --- Component ---

export function ReportPreviewSheet({
  defects,
  reportTitle,
  projectName,
  apartmentNumber: _apartmentNumber,
  onClose,
}: ReportPreviewSheetProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, DefectPreview[]>();
    for (const d of defects) {
      const cat = d.category ?? 'כללי';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(d);
    }
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [defects]);

  return (
    <View style={{ paddingBottom: 20 }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
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
            תצוגה מקדימה
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
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[500],
            textAlign: 'right',
            marginTop: 2,
          }}
        >
          {projectName} — {reportTitle}
        </Text>
      </View>

      {/* Summary */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: BORDER_RADIUS.md,
          backgroundColor:
            defects.length > 0 ? COLORS.danger[50] : COLORS.success[50],
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            fontFamily: 'Rubik-SemiBold',
            color: COLORS.neutral[700],
          }}
        >
          סה״כ ליקויים
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            fontFamily: 'Rubik-Bold',
            color:
              defects.length > 0 ? COLORS.danger[700] : COLORS.success[500],
          }}
        >
          {defects.length}
        </Text>
      </View>

      {/* Grouped defects */}
      <ScrollView
        style={{ maxHeight: 400, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {defects.length === 0 ? (
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
              }}
            >
              אין ליקויים — הכל תקין
            </Text>
          </View>
        ) : (
          grouped.map(([category, items]) => (
            <View key={category} style={{ marginBottom: 12 }}>
              {/* Category header */}
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    fontFamily: 'Rubik-SemiBold',
                    color: COLORS.neutral[700],
                  }}
                >
                  {category}
                </Text>
                <View
                  style={{
                    backgroundColor: COLORS.cream[200],
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      fontFamily: 'Rubik-Medium',
                      color: COLORS.neutral[600],
                    }}
                  >
                    {items.length}
                  </Text>
                </View>
              </View>

              {/* Defect items */}
              {items.map((d) => {
                const sev =
                  SEVERITY_CONFIG[d.severity] ?? SEVERITY_CONFIG.medium;
                return (
                  <View
                    key={d.id}
                    style={{
                      flexDirection: 'row-reverse',
                      alignItems: 'flex-start',
                      gap: 8,
                      paddingVertical: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.cream[200],
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: 'Rubik-Regular',
                          color: COLORS.neutral[700],
                          textAlign: 'right',
                        }}
                        numberOfLines={2}
                      >
                        {d.description}
                      </Text>
                      {d.room ? (
                        <Text
                          style={{
                            fontSize: 11,
                            fontFamily: 'Rubik-Regular',
                            color: COLORS.neutral[400],
                            textAlign: 'right',
                            marginTop: 2,
                          }}
                        >
                          {d.room}
                        </Text>
                      ) : null}
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 6,
                        backgroundColor: sev.bg,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '500',
                          color: sev.color,
                        }}
                      >
                        {sev.label}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
