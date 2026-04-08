import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { useReport } from '@/hooks/useReport';
import { useReportShortages } from '@/hooks/useReportShortages';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';
import type { ShortageCategory } from '@/hooks/useReportShortages';

// --- Props ---

interface ReportShortagesTabProps {
  reportId: string;
}

// --- Summary Banner ---

function SummaryBanner({ totalRequired }: { totalRequired: number }) {
  const isReady = totalRequired === 0;

  return (
    <Animated.View
      entering={FadeInUp.duration(250)}
      style={{
        backgroundColor: isReady ? COLORS.primary[50] : '#FEF2F2',
        borderWidth: 1,
        borderColor: isReady ? COLORS.primary[200] : '#FECACA',
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <Feather
        name={isReady ? 'check-circle' : 'alert-circle'}
        size={20}
        color={isReady ? COLORS.primary[500] : '#DC2626'}
      />
      <Text
        style={{
          fontSize: 14,
          fontFamily: 'Rubik-SemiBold',
          color: isReady ? COLORS.primary[700] : '#DC2626',
          textAlign: 'right',
          flex: 1,
        }}
      >
        {isReady ? 'הדוח מוכן להפקה' : `${totalRequired} שדות חובה חסרים`}
      </Text>
    </Animated.View>
  );
}

// --- Category Card ---

function CategoryCard({
  category,
  index,
}: {
  category: ShortageCategory;
  index: number;
}) {
  return (
    <Animated.View
      entering={FadeInUp.delay(60 * index + 80).duration(250)}
      style={{
        backgroundColor: COLORS.cream[100],
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontFamily: 'Rubik-SemiBold',
          color: COLORS.neutral[800],
          textAlign: 'right',
          marginBottom: 10,
        }}
      >
        {category.name}
      </Text>

      {category.items.map((item) => {
        const iconName = item.isPresent ? 'check-circle' : 'x-circle';
        const iconColor = item.isPresent
          ? COLORS.primary[500]
          : item.isRequired
            ? '#DC2626'
            : '#F59E0B';
        const textColor = item.isPresent
          ? COLORS.neutral[500]
          : item.isRequired
            ? '#DC2626'
            : '#D97706';

        return (
          <View
            key={item.label}
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 8,
              marginBottom: 6,
            }}
          >
            <Feather name={iconName} size={16} color={iconColor} />
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Rubik-Regular',
                color: textColor,
                textAlign: 'right',
              }}
            >
              {item.label}
            </Text>
            {!item.isPresent && !item.isRequired && (
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'Rubik-Regular',
                  color: '#F59E0B',
                }}
              >
                (מומלץ)
              </Text>
            )}
          </View>
        );
      })}
    </Animated.View>
  );
}

// --- Main Component ---

export function ReportShortagesTab({ reportId }: ReportShortagesTabProps) {
  const { defects } = useReport(reportId);
  const { categories, totalRequired, isLoading } = useReportShortages(
    reportId,
    defects
  );

  if (isLoading) {
    return (
      <View style={{ gap: 10 }}>
        <SkeletonBlock width="100%" height={56} borderRadius={12} />
        {[1, 2, 3].map((i) => (
          <SkeletonBlock key={i} width="100%" height={120} borderRadius={14} />
        ))}
      </View>
    );
  }

  return (
    <View>
      <SummaryBanner totalRequired={totalRequired} />

      {categories.map((cat, idx) => (
        <CategoryCard key={cat.name} category={cat} index={idx} />
      ))}
    </View>
  );
}
