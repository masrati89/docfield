import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { SkeletonBlock, EmptyState } from '@/components/ui';

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

  return (
    <Animated.View entering={FadeInUp.delay(50 * index).duration(350)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          paddingVertical: 11,
          paddingHorizontal: 16,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: COLORS.cream[200],
          backgroundColor: pressed ? COLORS.cream[100] : 'transparent',
        })}
      >
        {/* Row 1: dot + name + chevron */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            marginBottom: 3,
          }}
        >
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 3.5,
              backgroundColor: isFull ? COLORS.primary[500] : COLORS.gold[500],
              marginLeft: 6,
            }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: 13,
              fontWeight: '600',
              color: COLORS.neutral[800],
              fontFamily: 'Rubik-SemiBold',
              textAlign: 'right',
            }}
          >
            {project.name}
          </Text>
          <Feather name="chevron-left" size={16} color={COLORS.neutral[300]} />
        </View>

        {/* Row 2: address */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 3,
            marginBottom: 7,
          }}
        >
          <Feather name="map-pin" size={16} color={COLORS.neutral[400]} />
          <Text
            style={{
              fontSize: 11,
              color: COLORS.neutral[400],
              fontFamily: 'Rubik-Regular',
            }}
          >
            {project.address}
          </Text>
        </View>

        {/* Row 3: progress bar */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: COLORS.neutral[400],
              fontFamily: 'Rubik-Regular',
            }}
          >
            דירות
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontWeight: '600',
              color: isFull ? COLORS.primary[500] : COLORS.neutral[600],
              fontFamily: 'Rubik-SemiBold',
            }}
          >
            {project.done}/{project.total}
          </Text>
          <View
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: COLORS.cream[200],
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: `${pct}%`,
                height: '100%',
                borderRadius: 2,
                backgroundColor: isFull
                  ? COLORS.primary[500]
                  : COLORS.gold[500],
              }}
            />
          </View>
        </View>
      </Pressable>
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
          הפרויקטים שלי
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

      {/* Project rows, loading skeleton, or empty state */}
      {isLoading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ gap: 6 }}>
              <SkeletonBlock width="60%" height={14} borderRadius={4} />
              <SkeletonBlock width="80%" height={10} borderRadius={4} />
              <SkeletonBlock width="100%" height={4} borderRadius={2} />
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
