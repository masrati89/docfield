import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { COLORS, SHADOWS } from '@infield/ui';
import {
  REPORT_TYPE_LABELS,
  formatDate,
} from '@/components/reports/reportDetailConstants';

interface ReportInfoCardProps {
  report: {
    reportType: string;
    apartmentNumber: string;
    tenantName?: string | null;
    reportDate: string;
  };
  statusConfig: { label: string; bg: string; text: string };
  defectsCount: number;
  totalPhotos: number;
  categoryCount: number;
}

export function ReportInfoCard({
  report,
  statusConfig,
  defectsCount,
  totalPhotos,
  categoryCount,
}: ReportInfoCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={{
        margin: 12,
        marginBottom: 0,
        padding: 14,
        borderRadius: 12,
        backgroundColor: COLORS.cream[50],
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        ...SHADOWS.sm,
      }}
    >
      {/* Title + status badge */}
      <View
        style={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <View style={{ flex: 1 }}>
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
              }}
            >
              {REPORT_TYPE_LABELS[report.reportType] ?? report.reportType} —
              דירה {report.apartmentNumber}
            </Text>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 4,
                backgroundColor: statusConfig.bg,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '500',
                  color: statusConfig.text,
                  fontFamily: 'Rubik-Medium',
                }}
              >
                {statusConfig.label}
              </Text>
            </View>
          </View>

          {/* Tenant name */}
          {report.tenantName && (
            <View style={{ flexDirection: 'row-reverse', gap: 4 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.neutral[400],
                  fontFamily: 'Rubik-Regular',
                }}
              >
                מזמין:
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.neutral[600],
                  fontWeight: '500',
                  fontFamily: 'Rubik-Medium',
                }}
              >
                {report.tenantName}
              </Text>
            </View>
          )}

          {/* Date */}
          <View style={{ flexDirection: 'row-reverse', gap: 4 }}>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.neutral[400],
                fontFamily: 'Rubik-Regular',
              }}
            >
              תאריך:
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.neutral[600],
                fontWeight: '500',
                fontFamily: 'Rubik-Medium',
              }}
            >
              {formatDate(report.reportDate)}
            </Text>
          </View>
        </View>

        {/* Search/preview button */}
        <Pressable
          onPress={() => {
            // TODO: open search overlay
          }}
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
          <Feather name="search" size={20} color={COLORS.neutral[500]} />
        </Pressable>
      </View>

      {/* Counter strip */}
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
            {defectsCount}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: COLORS.neutral[500],
              fontWeight: '500',
              fontFamily: 'Rubik-Medium',
            }}
          >
            ממצאים
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
            {totalPhotos}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 10,
            color: COLORS.neutral[400],
            fontFamily: 'Rubik-Regular',
          }}
        >
          {categoryCount} קטגוריות
        </Text>
      </View>
    </Animated.View>
  );
}
