import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

import { COLORS } from '@infield/ui';
import { supabase } from '@/lib/supabase';
import { SkeletonBlock, EmptyState, BottomSheetWrapper } from '@/components/ui';
import {
  SubHeader,
  ProgressStrip,
  BuildingCard,
  AddBuildingSheet,
} from '@/components/projects';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui';

import type { BuildingItem } from '@/components/projects';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const [error, setError] = useState<string | null>(null);

  const sheetRef = useRef<BottomSheet>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const fetchData = useCallback(
    async (silent = false) => {
      if (!projectId) return;
      if (!silent) setIsLoading(true);
      setError(null);
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

        // Fetch buildings with apartment counts and nested defects
        const { data: blds } = await supabase
          .from('buildings')
          .select(
            'id, name, floors_count, apartments(id, status, delivery_reports(defects(id, status)))'
          )
          .eq('project_id', projectId)
          .order('name');

        const mapped: BuildingItem[] = (blds ?? []).map(
          (b: Record<string, unknown>) => {
            const apts =
              (b.apartments as Array<{
                status: string;
                delivery_reports: Array<{
                  defects: Array<{ id: string; status: string }>;
                }>;
              }>) ?? [];
            const completedApts = apts.filter(
              (a) => a.status === 'completed' || a.status === 'delivered'
            ).length;
            // Count open defects across all apartments → reports → defects
            const openDefects = apts.reduce((sum, apt) => {
              const reports = apt.delivery_reports ?? [];
              return (
                sum +
                reports.reduce((rSum, report) => {
                  const defects = report.defects ?? [];
                  return (
                    rSum +
                    defects.filter(
                      (d) => d.status === 'open' || d.status === 'in_progress'
                    ).length
                  );
                }, 0)
              );
            }, 0);
            return {
              id: b.id as string,
              name: b.name as string,
              floorsCount: b.floors_count as number | null,
              totalApts: apts.length,
              completedApts,
              openDefects,
            };
          }
        );
        setBuildings(mapped);
      } catch {
        setError('שגיאה בטעינת הבניינים');
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

      {error && !isLoading ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
            gap: 12,
          }}
        >
          <Feather name="alert-circle" size={40} color={COLORS.neutral[400]} />
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Rubik-Medium',
              color: COLORS.neutral[600],
              textAlign: 'center',
            }}
          >
            {error}
          </Text>
          <Pressable
            onPress={() => fetchData()}
            style={{
              marginTop: 8,
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: COLORS.primary[500],
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Rubik-SemiBold',
                color: '#FFFFFF',
              }}
            >
              נסה שוב
            </Text>
          </Pressable>
        </View>
      ) : isLoading ? (
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
              subtitle="בניינים נוצרים בעת הקמת פרויקט"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB — Add Building */}
      <BuildingsFAB onPress={() => setShowAddSheet(true)} />

      {/* Add Building Sheet */}
      {showAddSheet && projectId && (
        <BottomSheetWrapper
          ref={sheetRef}
          snapPoints={['45%']}
          onClose={() => setShowAddSheet(false)}
        >
          <AddBuildingSheet
            projectId={projectId}
            onClose={() => {
              sheetRef.current?.close();
              setShowAddSheet(false);
            }}
            onCreated={() => {
              fetchData(true);
              showToast('הבניין נוסף בהצלחה', 'success');
            }}
          />
        </BottomSheetWrapper>
      )}

      {/* Toast */}
      <Toast
        message={toast?.message ?? ''}
        type={toast?.type ?? 'success'}
        visible={!!toast}
        onDismiss={hideToast}
      />
    </View>
  );
}

// --- FAB Component ---

function BuildingsFAB({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
      }}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 15, stiffness: 150 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      }}
      style={[
        {
          position: 'absolute',
          bottom: 24,
          left: 16,
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: COLORS.primary[500],
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#1B7A44',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8,
        },
        animStyle,
      ]}
    >
      <Feather name="plus" size={24} color={COLORS.white} />
    </AnimatedPressable>
  );
}
