import { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@docfield/ui';
import type { ProjectWithCounts } from '@docfield/shared';

import { useProjects } from '@/hooks/useProjects';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { CardSkeleton } from '@/components/ui/CardSkeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';

function ProjectCard({
  project,
  index,
  onPress,
}: {
  project: ProjectWithCounts;
  index: number;
  onPress: () => void;
}) {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Animated.View entering={FadeInUp.delay(index * 50).duration(200)}>
      <Pressable
        onPress={handlePress}
        className="bg-white rounded-[14px] border border-cream-200 p-[16px] mb-[12px] active:scale-[0.98]"
      >
        <View className="flex-row items-start">
          {/* Icon */}
          <View className="w-[44px] h-[44px] rounded-[10px] bg-primary-50 items-center justify-center">
            <Feather name="briefcase" size={20} color={COLORS.primary[500]} />
          </View>

          {/* Content */}
          <View className="flex-1 me-[12px]">
            <Text
              className="text-[17px] font-rubik-semibold text-neutral-800"
              numberOfLines={1}
            >
              {project.name}
            </Text>
            {(project.address || project.city) && (
              <Text
                className="text-[13px] font-rubik text-neutral-500 mt-[2px]"
                numberOfLines={1}
              >
                {[project.address, project.city].filter(Boolean).join(', ')}
              </Text>
            )}
          </View>

          {/* Chevron (RTL — points left = forward in RTL) */}
          <Feather name="chevron-left" size={20} color={COLORS.neutral[400]} />
        </View>

        {/* Bottom row: counters + status */}
        <View className="flex-row items-center mt-[12px] gap-[8px]">
          <View className="flex-row items-center bg-cream-100 rounded-[6px] px-[8px] py-[4px]">
            <Text className="text-[13px] font-rubik-medium text-neutral-700">
              {project.apartmentCount}
            </Text>
            <Text className="text-[11px] font-rubik text-neutral-500 me-[4px]">
              דירות
            </Text>
          </View>
          <View className="flex-row items-center bg-cream-100 rounded-[6px] px-[8px] py-[4px]">
            <Text className="text-[13px] font-rubik-medium text-neutral-700">
              {project.buildingCount}
            </Text>
            <Text className="text-[11px] font-rubik text-neutral-500 me-[4px]">
              בניינים
            </Text>
          </View>
          <View className="flex-1" />
          <StatusBadge status={project.status} type="project" />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function ProjectsListScreen() {
  const router = useRouter();
  const {
    data: projects,
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useProjects();

  const handleProjectPress = useCallback(
    (projectId: string) => {
      router.push(`/(app)/projects/${projectId}`);
    },
    [router]
  );

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-cream-50">
        <StatusBar style="dark" />
        <ScreenHeader title="פרויקטים" />
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />
      <ScreenHeader title="פרויקטים" />

      {isLoading ? (
        <View className="px-[20px] gap-[12px]">
          {[0, 1, 2].map((index) => (
            <CardSkeleton key={index} lines={3} />
          ))}
        </View>
      ) : !projects || projects.length === 0 ? (
        <EmptyState
          icon="folder"
          title="אין פרויקטים עדיין"
          description="צור פרויקט חדש כדי להתחיל"
          actionLabel="+ צור פרויקט ראשון"
        />
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ProjectCard
              project={item}
              index={index}
              onPress={() => handleProjectPress(item.id)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={COLORS.primary[500]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
