import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS, SHADOWS } from '@infield/ui';
import { SkeletonBlock } from '@/components/ui';

// --- Types ---

interface ChecklistHeaderProps {
  isLoading: boolean;
  reportTitle: string;
  projectName: string;
  tenantName: string;
  reportDate: string;
  checked: number;
  total: number;
  defectCount: number;
  roomCount: number;
}

// --- Component ---

export function ChecklistHeader({
  isLoading,
  reportTitle,
  projectName,
  tenantName,
  reportDate,
  checked,
  total,
  defectCount,
  roomCount,
}: ChecklistHeaderProps) {
  return (
    <View
      style={{
        marginHorizontal: 12,
        marginTop: 8,
        padding: 14,
        borderRadius: 12,
        backgroundColor: COLORS.cream[50],
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        ...SHADOWS.sm,
      }}
    >
      {isLoading ? (
        <View style={{ gap: 8 }}>
          <SkeletonBlock width="70%" height={18} />
          <SkeletonBlock width="50%" height={12} />
          <SkeletonBlock width="40%" height={12} />
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: COLORS.cream[200],
              paddingTop: 8,
              marginTop: 4,
            }}
          >
            <SkeletonBlock width="60%" height={14} />
          </View>
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <View style={{ flex: 1 }}>
              {/* Title + Draft badge */}
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: COLORS.neutral[800],
                    fontFamily: 'Rubik-SemiBold',
                    textAlign: 'right',
                  }}
                >
                  {reportTitle}
                </Text>
                <View
                  style={{
                    backgroundColor: COLORS.primary[500],
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#FFFFFF',
                      fontWeight: '500',
                      fontFamily: 'Rubik-Medium',
                    }}
                  >
                    טיוטה
                  </Text>
                </View>
              </View>

              {/* Details */}
              {[
                ['פרויקט:', projectName],
                ['דייר:', tenantName],
                ['תאריך:', reportDate],
              ].map(([label, value]) => (
                <View
                  key={label}
                  style={{
                    flexDirection: 'row-reverse',
                    gap: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.neutral[400],
                      fontFamily: 'Rubik-Regular',
                    }}
                  >
                    {label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.neutral[600],
                      fontWeight: '500',
                      fontFamily: 'Rubik-Medium',
                    }}
                  >
                    {value}
                  </Text>
                </View>
              ))}
            </View>

            {/* Toolbar buttons */}
            <View style={{ flexDirection: 'row-reverse', gap: 4 }}>
              {(['eye', 'share', 'settings', 'download'] as const).map(
                (icon) => (
                  <Pressable
                    key={icon}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: COLORS.cream[200],
                      backgroundColor: COLORS.cream[50],
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Feather
                      name={icon}
                      size={20}
                      color={COLORS.neutral[500]}
                    />
                  </Pressable>
                )
              )}
            </View>
          </View>

          {/* Stats row */}
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 8,
              marginTop: 8,
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: COLORS.cream[200],
            }}
          >
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'baseline',
                gap: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: COLORS.primary[700],
                  fontFamily: 'Rubik-Bold',
                }}
              >
                {checked}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: COLORS.neutral[500],
                  fontFamily: 'Rubik-Regular',
                }}
              >
                / {total} נבדקו
              </Text>
            </View>
            <View
              style={{
                width: 1,
                height: 14,
                backgroundColor: COLORS.cream[300],
                marginHorizontal: 4,
              }}
            />
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Feather name="camera" size={16} color={COLORS.neutral[400]} />
              <Text
                style={{
                  fontSize: 10,
                  color: COLORS.neutral[400],
                  fontFamily: 'Rubik-Regular',
                }}
              >
                {defectCount} ליקויים
              </Text>
            </View>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.neutral[400],
                fontFamily: 'Rubik-Regular',
              }}
            >
              {roomCount} חדרים
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
