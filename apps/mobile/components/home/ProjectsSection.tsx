import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from '@/lib/haptics';

import { COLORS, SHADOWS } from '@infield/ui';
import { SkeletonBlock, EmptyState } from '@/components/ui';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// --- Types ---

interface ProjectItem {
  id: string;
  name: string;
  address: string;
  done: number;
  total: number;
}

interface ProjectsSectionProps {
  projects: ProjectItem[];
  isLoading: boolean;
  onViewAll?: () => void;
  onProjectPress?: (id: string) => void;
}

// --- Project Row ---

function ProjectRow({
  project,
  isLast,
  index,
  onPress,
}: {
  project: ProjectItem;
  isLast: boolean;
  index: number;
  onPress?: () => void;
}) {
  const pct = Math.round((project.done / project.total) * 100);
  const isFull = pct === 100;

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
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: COLORS.cream[100],
          },
          animStyle,
        ]}
      >
        {/* Row 1: name + completion chip + percentage */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: '700',
              color: COLORS.neutral[800],
              fontFamily: 'Rubik-Bold',
              textAlign: 'right',
              letterSpacing: -0.15,
            }}
          >
            {project.name}
          </Text>
          {isFull && (
            <Text
              style={{
                fontSize: 9,
                fontWeight: '700',
                color: COLORS.primary[700],
                backgroundColor: COLORS.primary[50],
                borderWidth: 1,
                borderColor: COLORS.primary[200],
                borderRadius: 4,
                paddingHorizontal: 6,
                paddingVertical: 1,
                overflow: 'hidden',
                fontFamily: 'Rubik-Bold',
              }}
            >
              הושלם
            </Text>
          )}
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: isFull ? COLORS.primary[700] : COLORS.gold[700],
              fontFamily: 'Inter-Bold',
            }}
          >
            {pct}%
          </Text>
        </View>

        {/* Row 2: address */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 4,
            marginBottom: 7,
          }}
        >
          <Feather name="map-pin" size={10} color={COLORS.neutral[400]} />
          <Text
            numberOfLines={1}
            style={{
              fontSize: 10,
              color: COLORS.neutral[500],
              fontFamily: 'Rubik-Regular',
            }}
          >
            {project.address}
          </Text>
        </View>

        {/* Row 3: progress bar + count */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 5,
              backgroundColor: COLORS.cream[200],
              borderRadius: 3,
              overflow: 'hidden',
              direction: 'ltr',
            }}
          >
            <View
              style={{
                width: `${pct}%`,
                height: '100%',
                borderRadius: 3,
                backgroundColor: isFull
                  ? COLORS.primary[500]
                  : COLORS.gold[500],
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 10,
              color: COLORS.neutral[500],
              fontFamily: 'Inter-Regular',
            }}
          >
            <Text style={{ fontWeight: '700', color: COLORS.neutral[700] }}>
              {project.done}
            </Text>
            /{project.total} דירות
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

// --- Section ---

export function ProjectsSection({
  projects,
  isLoading,
  onViewAll,
  onProjectPress,
}: ProjectsSectionProps) {
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
          הפרויקטים שלי
        </Text>
        {!isLoading && projects.length > 0 && (
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
              {projects.length}
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

      {/* Project rows, loading skeleton, or empty state */}
      {isLoading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ gap: 6 }}>
              <SkeletonBlock width="60%" height={14} borderRadius={4} />
              <SkeletonBlock width="80%" height={10} borderRadius={4} />
              <SkeletonBlock width="100%" height={5} borderRadius={3} />
            </View>
          ))}
        </View>
      ) : projects.length === 0 ? (
        <EmptyState
          icon="folder"
          title="אין פרויקטים עדיין"
          subtitle="הוסף פרויקט ראשון כדי להתחיל"
        />
      ) : (
        projects.map((p, i) => (
          <ProjectRow
            key={p.id}
            project={p}
            isLast={i === projects.length - 1}
            index={i}
            onPress={() => onProjectPress?.(p.id)}
          />
        ))
      )}
    </View>
  );
}
