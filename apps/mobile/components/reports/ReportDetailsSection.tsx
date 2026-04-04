import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';
import {
  STATUS_CONFIG,
  REPORT_TYPE_LABELS,
  formatDate,
} from '@/components/reports/reportDetailConstants';
import type { ReportInfo } from '@/hooks/useReport';

interface ReportDetailsSectionProps {
  report: ReportInfo;
}

export function ReportDetailsSection({ report }: ReportDetailsSectionProps) {
  const statusConfig =
    STATUS_CONFIG[report.status ?? 'draft'] ?? STATUS_CONFIG.draft;

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={{
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.cream[50],
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        padding: 16,
        gap: 12,
        ...SHADOWS.sm,
      }}
    >
      {[
        ['סוג דוח', REPORT_TYPE_LABELS[report.reportType] ?? report.reportType],
        ['פרויקט', report.projectName],
        ['בניין', report.buildingName],
        ['דירה', report.apartmentNumber],
        ['סטטוס', statusConfig.label],
        ['תאריך', formatDate(report.reportDate)],
        ...(report.tenantName ? [['מזמין', report.tenantName]] : []),
        ...(report.address ? [['כתובת', report.address]] : []),
      ].map(([label, value], i) => (
        <View
          key={i}
          style={{
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.cream[200],
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: COLORS.neutral[400],
              fontFamily: 'Rubik-Regular',
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '500',
              color: COLORS.neutral[700],
              fontFamily: 'Rubik-Medium',
            }}
          >
            {value}
          </Text>
        </View>
      ))}
      {report.notes && (
        <View>
          <Text
            style={{
              fontSize: 13,
              color: COLORS.neutral[400],
              fontFamily: 'Rubik-Regular',
              marginBottom: 4,
              textAlign: 'right',
            }}
          >
            הערות
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: COLORS.neutral[700],
              fontFamily: 'Rubik-Regular',
              textAlign: 'right',
              lineHeight: 20,
            }}
          >
            {report.notes}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}
