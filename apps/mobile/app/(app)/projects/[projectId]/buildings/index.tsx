import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { COLORS } from '@infield/ui';
import { supabase } from '@/lib/supabase';
import { SkeletonBlock, EmptyState } from '@/components/ui';
import { SubHeader, ProgressStrip, BuildingCard } from '@/components/projects';

import type { BuildingItem } from '@/components/projects';

// --- Types ---

interface ProjectInfo {
  name: string;
  address: string | null;
}

// --- Screen ---

export default function BuildingsScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const router = useRouter();

  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [buildings, setBuildings] = useState<BuildingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(
    async (silent = false) => {
      if (!projectId) return;
      if (!silent) setIsLoading(true);
      try {
        // Fetch project info
        const { data: proj } = await supabase
          .from('projects')
          .select('name, address')
          .eq('id', projectId)
          .single();

        if (proj) {
          setProject({ name: proj.name, address: proj.address });
        }

        // Fetch buildings with apartment counts
        const { data: blds } = await supabase
          .from('buildings')
          .select('id, name, floors_count, apartments(id, status)')
          .eq('project_id', projectId)
          .order('name');

        const mapped: BuildingItem[] = (blds ?? []).map(
          (b: Record<string, unknown>) => {
            const apts = (b.apartments as Array<{ status: string }>) ?? [];
            const completedApts = apts.filter(
              (a) => a.status === 'completed' || a.status === 'delivered'
            ).length;
            return {
              id: b.id as string,
              name: b.name as string,
              floorsCount: b.floors_count as number | null,
              totalApts: apts.length,
              completedApts,
              openDefects: 0,
            };
          }
        );
        setBuildings(mapped);
      } catch {
        // Silent fail — shows empty state
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [projectId]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData(true);
  }, [fetchData]);

  const totalApts = buildings.reduce((s, b) => s + b.totalApts, 0);
  const completedApts = buildings.reduce((s, b) => s + b.completedApts, 0);

  const handleBuildingPress = (buildingId: string) => {
    router.push(
      `/(app)/projects/${projectId}/apartments?buildingId=${buildingId}`
    );
  };

  const renderBuilding = ({
    item,
    index,
  }: {
    item: BuildingItem;
    index: number;
  }) => (
    <BuildingCard
      building={item}
      index={index}
      onPress={() => handleBuildingPress(item.id)}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream[100] }}>
      <StatusBar style="dark" />

      <SubHeader
        title={project?.name ?? ''}
        subtitle={project?.address ?? undefined}
        onBack={() => router.back()}
      />

      {isLoading ? (
        <View style={{ padding: 16, gap: 12, marginTop: 12 }}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={{
                backgroundColor: COLORS.cream[50],
                borderRadius: 12,
                borderWidth: 1,
                borderColor: COLORS.cream[200],
                padding: 16,
              }}
            >
              <View
                style={{
                  flexDirection: 'row-reverse',
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <SkeletonBlock width={32} height={32} borderRadius={8} />
                <View style={{ flex: 1, gap: 6 }}>
                  <SkeletonBlock width="40%" height={13} borderRadius={4} />
                  <SkeletonBlock width="55%" height={9} borderRadius={3} />
                </View>
              </View>
              <SkeletonBlock width="100%" height={4} borderRadius={2} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={buildings}
          keyExtractor={(item) => item.id}
          renderItem={renderBuilding}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary[500]}
            />
          }
          ListHeaderComponent={
            totalApts > 0 ? (
              <>
                <ProgressStrip
                  completed={completedApts}
                  total={totalApts}
                  label="דירות הושלמו"
                />
                <View style={{ marginTop: 16, marginBottom: 8 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '700',
                      color: COLORS.neutral[800],
                      fontFamily: 'Rubik-Bold',
                      textAlign: 'right',
                    }}
                  >
                    בניינים
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '500',
                        color: COLORS.neutral[400],
                      }}
                    >
                      {'  '}
                      {buildings.length}
                    </Text>
                  </Text>
                </View>
              </>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="grid"
              title="אין בניינים"
              subtitle="הוסף בניין ראשון לפרויקט"
              ctaLabel="הוסף בניין"
              onCta={() => {}}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
