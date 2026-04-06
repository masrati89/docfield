import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  I18nManager,
  Platform,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type BottomSheetType from '@gorhom/bottom-sheet';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { supabase } from '@/lib/supabase';
import { SkeletonBlock, EmptyState } from '@/components/ui';
import { BottomSheetWrapper } from '@/components/ui/BottomSheetWrapper';
import { Toast } from '@/components/ui/Toast';
import { SubHeader, ProgressStrip, ApartmentRow } from '@/components/projects';
import { NewInspectionWizard } from '@/components/wizard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';

import type { WizardPrefill } from '@/components/wizard/NewInspectionWizard.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

import type { ApartmentItem } from '@/components/projects';

// --- Types ---

interface ScreenInfo {
  projectName: string;
  buildingName: string;
  address: string | null;
}

interface FloorGroup {
  floor: number;
  apartments: ApartmentItem[];
}

interface ApartmentReportMap {
  [apartmentId: string]: string; // apartmentId → first report ID
}

type ReportType = 'delivery' | 'bedek_bait';

const REPORT_TYPE_OPTIONS: { key: ReportType; label: string }[] = [
  { key: 'delivery', label: 'פרוטוקול מסירה' },
  { key: 'bedek_bait', label: 'בדק בית' },
];

// --- Floor Card ---

function FloorCard({
  group,
  baseIndex,
  onApartmentPress,
}: {
  group: FloorGroup;
  baseIndex: number;
  onApartmentPress: (apt: ApartmentItem) => void;
}) {
  return (
    <View>
      {/* Floor header */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 4,
        }}
      >
        <View
          style={{
            width: 3,
            height: 14,
            borderRadius: 2,
            backgroundColor: COLORS.primary[500],
          }}
        />
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: COLORS.primary[700],
            fontFamily: 'Rubik-Bold',
          }}
        >
          קומה {group.floor}
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: '500',
            color: COLORS.neutral[400],
            fontFamily: 'Rubik-Medium',
          }}
        >
          {group.apartments.length}
        </Text>
      </View>

      {/* Apartments card */}
      <View
        style={{
          marginHorizontal: 16,
          marginBottom: 8,
          backgroundColor: COLORS.cream[50],
          borderRadius: BORDER_RADIUS.lg,
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          overflow: 'hidden',
        }}
      >
        {group.apartments.map((apt, i) => (
          <ApartmentRow
            key={apt.id}
            apartment={apt}
            isLast={i === group.apartments.length - 1}
            index={baseIndex + i}
            onPress={() => onApartmentPress(apt)}
          />
        ))}
      </View>
    </View>
  );
}

// --- Add Report Sheet Content ---

function AddReportSheetContent({
  apartmentNumber,
  selectedType,
  onSelectType,
  onConfirm,
  onClose,
  isCreating,
}: {
  apartmentNumber: string;
  selectedType: ReportType;
  onSelectType: (t: ReportType) => void;
  onConfirm: () => void;
  onClose: () => void;
  isCreating: boolean;
}) {
  return (
    <View style={{ paddingBottom: 32 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[200],
        }}
      >
        <Pressable onPress={onClose} hitSlop={8}>
          <Feather name="x" size={20} color={COLORS.neutral[600]} />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Rubik-Bold',
              color: COLORS.neutral[800],
            }}
          >
            בדיקה חדשה — דירה {apartmentNumber}
          </Text>
        </View>
        <View style={{ width: 20 }} />
      </View>

      {/* Report type options */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'Rubik-SemiBold',
            color: COLORS.neutral[700],
            textAlign: 'right',
            marginBottom: 12,
          }}
        >
          סוג בדיקה
        </Text>
        {REPORT_TYPE_OPTIONS.map((o) => {
          const isSelected = selectedType === o.key;
          return (
            <Pressable
              key={o.key}
              onPress={() => onSelectType(o.key)}
              style={{
                flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 4,
                minHeight: 44,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.cream[200],
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontFamily: isSelected ? 'Rubik-SemiBold' : 'Rubik-Regular',
                  color: isSelected ? COLORS.primary[700] : COLORS.neutral[700],
                  textAlign: 'right',
                }}
              >
                {o.label}
              </Text>
              {isSelected ? (
                <Feather name="check" size={20} color={COLORS.primary[500]} />
              ) : (
                <View style={{ width: 20 }} />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Confirm button */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <Pressable
          onPress={onConfirm}
          disabled={isCreating}
          style={{
            height: 46,
            borderRadius: 12,
            backgroundColor: isCreating
              ? COLORS.neutral[300]
              : COLORS.primary[500],
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isCreating ? 0.7 : 1,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 14,
              fontFamily: 'Rubik-SemiBold',
            }}
          >
            {isCreating ? 'יוצר דוח...' : 'התחל בדיקה'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// --- Screen ---

export default function ApartmentsScreen() {
  const { projectId, buildingId } = useLocalSearchParams<{
    projectId: string;
    buildingId: string;
  }>();
  const router = useRouter();
  const { profile } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const insets = useSafeAreaInsets();

  // Wizard state
  const [showWizard, setShowWizard] = useState(false);
  const [wizardPrefill, setWizardPrefill] = useState<WizardPrefill | undefined>(
    undefined
  );

  const [info, setInfo] = useState<ScreenInfo | null>(null);
  const [apartments, setApartments] = useState<ApartmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apartmentReports, setApartmentReports] = useState<ApartmentReportMap>(
    {}
  );

  // Bottom sheet state
  const sheetRef = useRef<BottomSheetType>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedApartment, setSelectedApartment] =
    useState<ApartmentItem | null>(null);
  const [selectedReportType, setSelectedReportType] =
    useState<ReportType>('delivery');
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = useCallback(
    async (silent = false) => {
      if (!projectId) return;
      if (!silent) setIsLoading(true);
      setError(null);
      try {
        // If no buildingId was provided (single-building project), resolve it
        let resolvedBuildingId = buildingId;
        if (!resolvedBuildingId) {
          const { data: firstBuilding } = await supabase
            .from('buildings')
            .select('id')
            .eq('project_id', projectId)
            .order('name')
            .limit(1)
            .single();

          if (!firstBuilding) {
            setIsLoading(false);
            return;
          }
          resolvedBuildingId = firstBuilding.id;
        }

        const { data: bld } = await supabase
          .from('buildings')
          .select('name, projects!inner(name, address)')
          .eq('id', resolvedBuildingId)
          .single();

        if (bld) {
          const proj = bld.projects as unknown as Record<string, unknown>;
          setInfo({
            projectName: proj.name as string,
            buildingName: bld.name as string,
            address: (proj.address as string) ?? null,
          });
        }

        const { data: apts } = await supabase
          .from('apartments')
          .select(
            'id, number, floor, rooms_count, status, delivery_reports(id, tenant_name, defects(id))'
          )
          .eq('building_id', resolvedBuildingId)
          .order('floor')
          .order('number');

        const reportMap: ApartmentReportMap = {};
        const mapped: ApartmentItem[] = (apts ?? []).map(
          (a: Record<string, unknown>) => {
            const reps =
              (a.delivery_reports as Array<{
                id: string;
                tenant_name: string | null;
                defects: Array<{ id: string }>;
              }>) ?? [];
            const defectCount = reps.reduce(
              (sum, r) => sum + (r.defects?.length ?? 0),
              0
            );

            // Store the first report ID for navigation
            if (reps.length > 0) {
              reportMap[a.id as string] = reps[0].id;
            }

            return {
              id: a.id as string,
              number: a.number as string,
              floor: a.floor as number | null,
              roomsCount: a.rooms_count as number | null,
              status: (a.status as string) ?? 'pending',
              tenantName:
                reps.length > 0 ? (reps[0].tenant_name ?? null) : null,
              defects: defectCount,
              reports: reps.length,
            };
          }
        );
        setApartments(mapped);
        setApartmentReports(reportMap);
      } catch {
        setError('שגיאה בטעינת הדירות');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [projectId, buildingId]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData(true);
  }, [fetchData]);

  const floorGroups = useMemo<FloorGroup[]>(() => {
    const map = new Map<number, ApartmentItem[]>();
    apartments.forEach((a) => {
      const floor = a.floor ?? 0;
      if (!map.has(floor)) map.set(floor, []);
      map.get(floor)!.push(a);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([floor, apts]) => ({ floor, apartments: apts }));
  }, [apartments]);

  const completed = apartments.filter(
    (a) => a.status === 'completed' || a.status === 'delivered'
  ).length;

  const title = info ? `${info.projectName} — ${info.buildingName}` : '';

  // Calculate base index for staggered animation per floor group
  const baseIndices = useMemo(() => {
    let idx = 0;
    return floorGroups.map((g) => {
      const base = idx;
      idx += g.apartments.length;
      return base;
    });
  }, [floorGroups]);

  const handleApartmentPress = useCallback(
    (apt: ApartmentItem) => {
      const existingReportId = apartmentReports[apt.id];
      if (existingReportId) {
        router.push(`/(app)/reports/${existingReportId}`);
      } else {
        setSelectedApartment(apt);
        setSelectedReportType('delivery');
        setSheetOpen(true);
      }
    },
    [apartmentReports, router]
  );

  const handleCreateReport = useCallback(async () => {
    if (!selectedApartment || !profile) return;
    setIsCreating(true);

    try {
      const { data, error: insertError } = await supabase
        .from('delivery_reports')
        .insert({
          apartment_id: selectedApartment.id,
          organization_id: profile.organizationId,
          inspector_id: profile.id,
          report_type: selectedReportType,
          status: 'draft',
          round_number: 1,
          report_date: new Date().toISOString().split('T')[0],
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      sheetRef.current?.close();
      setSheetOpen(false);
      router.push(`/(app)/reports/${data.id}`);
    } catch {
      showToast('שגיאה ביצירת הדוח. נסה שוב.', 'error');
    } finally {
      setIsCreating(false);
    }
  }, [selectedApartment, profile, selectedReportType, router, showToast]);

  const closeSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  // FAB press — open wizard with project/building prefill
  const handleFabPress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setWizardPrefill({
      projectId: projectId ?? undefined,
      projectName: info?.projectName ?? undefined,
      buildingName: info?.buildingName ?? undefined,
    });
    setShowWizard(true);
  }, [projectId, info]);

  const fabScale = useSharedValue(1);
  const fabAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream[100] }}>
      <StatusBar style="dark" />

      <SubHeader
        title={title}
        subtitle={info?.address ?? undefined}
        onBack={() => router.back()}
      />

      {isLoading ? (
        <View
          style={{
            margin: 16,
            backgroundColor: COLORS.cream[50],
            borderRadius: BORDER_RADIUS.lg,
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            overflow: 'hidden',
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderBottomWidth: i < 3 ? 1 : 0,
                borderBottomColor: COLORS.cream[200],
                flexDirection: 'row-reverse',
                gap: 10,
              }}
            >
              <SkeletonBlock width={7} height={7} borderRadius={3.5} />
              <View style={{ flex: 1, gap: 6 }}>
                <SkeletonBlock width="50%" height={12} borderRadius={4} />
                <SkeletonBlock width="35%" height={9} borderRadius={3} />
              </View>
              <SkeletonBlock width={40} height={18} borderRadius={5} />
            </View>
          ))}
        </View>
      ) : error ? (
        <EmptyState
          icon="alert-circle"
          title={error}
          subtitle="לא ניתן היה לטעון את רשימת הדירות"
          ctaLabel="נסה שוב"
          onCta={() => fetchData()}
        />
      ) : (
        <FlatList
          data={floorGroups}
          keyExtractor={(item) => String(item.floor)}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary[500]}
            />
          }
          renderItem={({ item, index }) => (
            <FloorCard
              group={item}
              baseIndex={baseIndices[index]}
              onApartmentPress={handleApartmentPress}
            />
          )}
          ListHeaderComponent={
            apartments.length > 0 ? (
              <ProgressStrip
                completed={completed}
                total={apartments.length}
                label="דירות הושלמו"
              />
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="home"
              title="אין דירות"
              subtitle="הוסף דירות לבניין"
              ctaLabel="הוסף דירה"
              onCta={() => {}}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 88 + insets.bottom }}
        />
      )}

      {sheetOpen && (
        <BottomSheetWrapper
          ref={sheetRef}
          enableDynamicSizing
          onClose={() => setSheetOpen(false)}
        >
          <AddReportSheetContent
            apartmentNumber={selectedApartment?.number ?? ''}
            selectedType={selectedReportType}
            onSelectType={setSelectedReportType}
            onConfirm={handleCreateReport}
            onClose={closeSheet}
            isCreating={isCreating}
          />
        </BottomSheetWrapper>
      )}

      {/* FAB — New Inspection */}
      <AnimatedPressable
        onPress={handleFabPress}
        onPressIn={() => {
          fabScale.value = withSpring(0.92, { damping: 15, stiffness: 150 });
        }}
        onPressOut={() => {
          fabScale.value = withSpring(1, { damping: 15, stiffness: 150 });
        }}
        style={[
          {
            position: 'absolute',
            bottom: 24 + insets.bottom,
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
          fabAnimStyle,
        ]}
      >
        <Feather name="plus" size={24} color={COLORS.white} />
      </AnimatedPressable>

      {/* New Inspection Wizard */}
      <NewInspectionWizard
        visible={showWizard}
        onClose={() => setShowWizard(false)}
        prefill={wizardPrefill}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={!!toast}
          onDismiss={hideToast}
        />
      )}
    </View>
  );
}
