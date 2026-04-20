import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS, SHADOWS } from '@infield/ui';
import { SkeletonBlock, EmptyState } from '@/components/ui';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const typeIcon = report.type === 'delivery' ? 'clipboard' : 'file-text';

  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(50 * index).duration(350)}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.98);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={[
          {
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: COLORS.cream[100],
          },
          animStyle,
        ]}
      >
        {/* Type icon tile — 40×40 */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: isDraft ? COLORS.gold[100] : COLORS.primary[50],
            borderWidth: 1,
            borderColor: isDraft ? '#F0D890' : COLORS.primary[200],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather
            name={typeIcon as keyof typeof Feather.glyphMap}
            size={19}
            color={isDraft ? COLORS.gold[700] : COLORS.primary[700]}
          />
        </View>

        {/* Content */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: COLORS.neutral[800],
              fontFamily: 'Rubik-Bold',
              textAlign: 'right',
              letterSpacing: -0.15,
              marginBottom: 2,
            }}
          >
            {report.project}
          </Text>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                color: COLORS.neutral[500],
                fontFamily: 'Rubik-Regular',
              }}
            >
              {report.apartment}
            </Text>
            <Text style={{ fontSize: 10, color: COLORS.neutral[300] }}>·</Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: isDraft ? COLORS.gold[700] : COLORS.primary[700],
                fontFamily: 'Rubik-SemiBold',
              }}
            >
              {typeLabel}
            </Text>
          </View>
        </View>

        {/* Trailing: status badge + meta */}
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 4,
            width: 78,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              color: isDraft ? COLORS.gold[700] : COLORS.primary[700],
              backgroundColor: isDraft ? COLORS.gold[100] : COLORS.primary[50],
              borderWidth: 1,
              borderColor: isDraft ? '#F0D890' : COLORS.primary[200],
              borderRadius: 6,
              paddingVertical: 2,
              width: 56,
              textAlign: 'center',
              overflow: 'hidden',
              fontFamily: 'Rubik-Bold',
            }}
          >
            {isDraft ? 'טיוטה' : 'הושלם'}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: COLORS.neutral[400],
              fontFamily: 'Inter-Regular',
            }}
          >
            {report.defects} ממצאים · {report.time}
          </Text>
        </View>
      </AnimatedPressable>
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
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        overflow: 'hidden',
        ...SHADOWS.sm,
      }}
    >
      {/* Section header */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: '700',
            color: COLORS.neutral[800],
            fontFamily: 'Rubik-Bold',
            letterSpacing: -0.2,
          }}
        >
          דוחות אחרונים
        </Text>
        {!isLoading && reports.length > 0 && (
          <View
            style={{
              backgroundColor: COLORS.cream[100],
              paddingHorizontal: 7,
              paddingVertical: 2,
              borderRadius: 10,
              marginRight: 8,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: COLORS.neutral[500],
                fontFamily: 'Inter-SemiBold',
              }}
            >
              {reports.length}
            </Text>
          </View>
        )}
        <View style={{ flex: 1 }} />
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
              fontWeight: '600',
              color: COLORS.primary[500],
              fontFamily: 'Rubik-SemiBold',
            }}
          >
            עוד
          </Text>
          <Feather name="chevron-left" size={14} color={COLORS.primary[500]} />
        </Pressable>
      </View>

      <View style={{ height: 1, backgroundColor: COLORS.cream[200] }} />

      {/* Report rows, loading skeleton, or empty state */}
      {isLoading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ flexDirection: 'row-reverse', gap: 12 }}>
              <SkeletonBlock width={40} height={40} borderRadius={10} />
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
