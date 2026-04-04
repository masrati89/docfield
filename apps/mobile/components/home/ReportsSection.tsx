import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { SkeletonBlock, EmptyState } from '@/components/ui';

// --- Types ---

interface ReportItem {
  id: string;
  project: string;
  apartment: string;
  type: string;
  status: string;
  defects: number;
  time: string;
}

interface ReportsSectionProps {
  reports: ReportItem[];
  isLoading: boolean;
  onViewAll?: () => void;
  onReportPress?: (id: string) => void;
}

// --- Report Row ---

function ReportRow({
  report,
  isLast,
  index,
  onPress,
}: {
  report: ReportItem;
  isLast: boolean;
  index: number;
  onPress?: () => void;
}) {
  const isDraft = report.status === 'draft';
  const typeLabel = report.type === 'delivery' ? 'מסירה' : 'בדק בית';

  return (
    <Animated.View entering={FadeInUp.delay(50 * index).duration(350)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingVertical: 11,
          paddingHorizontal: 16,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: COLORS.cream[200],
          backgroundColor: pressed ? COLORS.cream[100] : 'transparent',
        })}
      >
        {/* Status dot — right in RTL */}
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: isDraft ? COLORS.gold[500] : COLORS.primary[500],
            marginLeft: 6,
          }}
        />

        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: COLORS.neutral[800],
              fontFamily: 'Rubik-SemiBold',
              textAlign: 'right',
              marginBottom: 2,
            }}
          >
            {report.project}
          </Text>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: COLORS.neutral[500],
                fontFamily: 'Rubik-Regular',
              }}
            >
              {report.apartment}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.neutral[300],
                includeFontPadding: false,
              }}
            >
              ·
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.neutral[400],
                fontFamily: 'Rubik-Regular',
                includeFontPadding: false,
              }}
            >
              {typeLabel}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: COLORS.neutral[300],
                includeFontPadding: false,
              }}
            >
              ·
            </Text>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
            >
              <Feather name="clock" size={16} color={COLORS.neutral[400]} />
              <Text
                style={{
                  fontSize: 10,
                  color: COLORS.neutral[400],
                  fontFamily: 'Rubik-Regular',
                }}
              >
                {report.time}
              </Text>
            </View>
          </View>
        </View>

        {/* Status badge + defects — left in RTL */}
        <View
          style={{
            alignItems: 'center',
            gap: 3,
            marginRight: 8,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '600',
              fontFamily: 'Rubik-SemiBold',
              color: isDraft ? COLORS.gold[700] : COLORS.primary[700],
              backgroundColor: isDraft ? COLORS.gold[100] : COLORS.primary[50],
              borderRadius: 5,
              paddingHorizontal: 7,
              paddingVertical: 2,
              overflow: 'hidden',
            }}
          >
            {isDraft ? 'טיוטה' : 'הושלם'}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Feather name="alert-triangle" size={16} color={COLORS.gold[500]} />
            <Text
              style={{
                fontSize: 10,
                fontWeight: '500',
                color: COLORS.neutral[500],
                fontFamily: 'Rubik-Medium',
              }}
            >
              {report.defects}
            </Text>
          </View>
        </View>

        <Feather name="chevron-left" size={16} color={COLORS.neutral[300]} />
      </Pressable>
    </Animated.View>
  );
}

// --- Section ---

export function ReportsSection({
  reports,
  isLoading,
  onViewAll,
  onReportPress,
}: ReportsSectionProps) {
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: 12,
        backgroundColor: COLORS.cream[50],
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[200],
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: COLORS.neutral[800],
            fontFamily: 'Rubik-Bold',
            flex: 1,
            textAlign: 'right',
          }}
        >
          דוחות אחרונים
        </Text>
        <Pressable
          onPress={onViewAll}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              color: COLORS.primary[500],
              fontFamily: 'Rubik-Medium',
            }}
          >
            עוד
          </Text>
          <Feather name="chevron-left" size={16} color={COLORS.neutral[300]} />
        </Pressable>
      </View>

      {/* Report rows, loading skeleton, or empty state */}
      {isLoading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ flexDirection: 'row-reverse', gap: 8 }}>
              <SkeletonBlock width={7} height={7} borderRadius={3.5} />
              <View style={{ flex: 1, gap: 6 }}>
                <SkeletonBlock width="70%" height={14} borderRadius={4} />
                <SkeletonBlock width="50%" height={10} borderRadius={4} />
              </View>
            </View>
          ))}
        </View>
      ) : reports.length === 0 ? (
        <EmptyState
          icon="file-text"
          title="אין דוחות עדיין"
          subtitle="צור בדיקה חדשה כדי להתחיל"
        />
      ) : (
        reports.map((r, i) => (
          <ReportRow
            key={r.id}
            report={r}
            isLast={i === reports.length - 1}
            index={i}
            onPress={() => onReportPress?.(r.id)}
          />
        ))
      )}
    </View>
  );
}
