import { useCallback, useMemo, useRef, useState } from 'react';
import { View, RefreshControl, Modal, Pressable, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import type BottomSheetType from '@gorhom/bottom-sheet';
import Fuse from 'fuse.js';

import { useRouter } from 'expo-router';

import { COLORS } from '@infield/ui';
import { NewInspectionWizard } from '@/components/wizard';
import { EmptyState } from '@/components/ui/EmptyState';
import { BottomSheetWrapper } from '@/components/ui/BottomSheetWrapper';
import { useReports } from '@/hooks/useReports';
import { useDeleteReport } from '@/hooks/useDeleteReport';
import type { ReportItem } from '@/hooks/useReports';

import {
  Header,
  SearchBar,
  FilterChips,
  ActiveTags,
  ReportRow,
  GroupHeader,
  SortSheetContent,
  SkeletonList,
  ErrorState,
  FAB,
} from '@/components/reports';
import type { StatusFilter, SortBy, TypeFilter } from '@/components/reports';

export default function ReportsScreen() {
  const router = useRouter();
  const { reports, isLoading, isRefreshing, error, refetch } = useReports();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  const sheetRef = useRef<BottomSheetType>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const hasActiveFilters =
    typeFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'date';

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // --- Filtering + Search ---

  const fuse = useMemo(
    () =>
      new Fuse(reports, {
        keys: ['project', 'apartment'],
        threshold: 0.35,
      }),
    [reports]
  );

  const filtered = useMemo(() => {
    let list = [...reports];

    // Status filter
    if (statusFilter === 'active') {
      list = list.filter(
        (r) => r.status === 'draft' || r.status === 'in_progress'
      );
    } else if (statusFilter === 'completed') {
      list = list.filter(
        (r) => r.status === 'completed' || r.status === 'sent'
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      list = list.filter((r) => r.reportType === typeFilter);
    }

    // Search
    if (search.trim()) {
      const ids = new Set(fuse.search(search.trim()).map((r) => r.item.id));
      list = list.filter((r) => ids.has(r.id));
    }

    // Sort
    if (sortBy === 'date') {
      list.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } else if (sortBy === 'project') {
      list.sort((a, b) => a.project.localeCompare(b.project, 'he'));
    }

    return list;
  }, [reports, statusFilter, typeFilter, search, sortBy, fuse]);

  // --- Grouped data for project sort ---

  const groupedByProject = useMemo(() => {
    if (sortBy !== 'project') return null;
    const groups: { title: string; data: ReportItem[] }[] = [];
    const map = new Map<string, ReportItem[]>();
    for (const r of filtered) {
      const arr = map.get(r.project) ?? [];
      arr.push(r);
      map.set(r.project, arr);
    }
    for (const [title, data] of map) {
      groups.push({ title, data });
    }
    return groups;
  }, [filtered, sortBy]);

  // --- Bottom sheet ---

  const openSheet = useCallback(() => {
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
  }, []);

  // --- Handlers ---

  const {
    handleDeleteReport,
    pendingAction: deleteAction,
    dismissAction: dismissDelete,
    errorMessage: deleteError,
    clearError: clearDeleteError,
  } = useDeleteReport(reports, refetch);

  const handleReportPress = useCallback(
    (id: string) => {
      router.push(`/(app)/reports/${id}`);
    },
    [router]
  );

  const renderReportItem = useCallback(
    ({ item, index }: { item: ReportItem; index: number }) => (
      <ReportRow
        item={item}
        index={index}
        isLast={sortBy === 'project' ? false : index === filtered.length - 1}
        onPress={() => handleReportPress(item.id)}
        onDelete={(id: string) => handleDeleteReport(id)}
      />
    ),
    [filtered.length, sortBy, handleReportPress, handleDeleteReport]
  );

  const keyExtractor = useCallback((item: ReportItem) => item.id, []);

  const renderContent = () => {
    if (isLoading) return <SkeletonList />;
    if (error) return <ErrorState onRetry={() => refetch()} />;
    if (filtered.length === 0) {
      return (
        <View style={{ marginHorizontal: 16, marginTop: 12 }}>
          <EmptyState
            icon="file-text"
            title="אין דוחות"
            subtitle={
              search.trim() || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'לא נמצאו דוחות התואמים לחיפוש.\nנסה לשנות את הפילטרים.'
                : 'עדיין לא יצרת דוחות.\nלחץ על + כדי להתחיל.'
            }
            ctaLabel="בדיקה חדשה"
            onCta={() => setShowWizard(true)}
          />
        </View>
      );
    }

    // Grouped by project
    if (sortBy === 'project' && groupedByProject) {
      return (
        <View
          style={{ marginTop: 8, paddingHorizontal: 16, paddingBottom: 80 }}
        >
          {groupedByProject.map((group) => (
            <View key={group.title} style={{ marginBottom: 8 }}>
              <GroupHeader name={group.title} count={group.data.length} />
              <View
                style={{
                  backgroundColor: COLORS.cream[50],
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: COLORS.cream[200],
                  overflow: 'hidden',
                }}
              >
                {group.data.map((item, i) => (
                  <ReportRow
                    key={item.id}
                    item={item}
                    index={i}
                    isLast={i === group.data.length - 1}
                    onPress={() => handleReportPress(item.id)}
                    onDelete={(id: string) => handleDeleteReport(id)}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      );
    }

    // Flat list by date
    return (
      <View
        style={{
          marginHorizontal: 16,
          marginTop: 12,
          backgroundColor: COLORS.cream[50],
          borderRadius: 12,
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          overflow: 'hidden',
        }}
      >
        <FlashList
          data={filtered}
          renderItem={renderReportItem}
          keyExtractor={keyExtractor}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: COLORS.cream[50] }}
    >
      <StatusBar style="dark" animated />

      <FlashList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            <Header count={filtered.length} total={reports.length} />
            <SearchBar value={search} onChange={setSearch} />
            <FilterChips
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              hasActiveFilters={hasActiveFilters}
              onOpenSort={openSheet}
            />
            <ActiveTags
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              sortBy={sortBy}
            />
            {renderContent()}
            <View style={{ height: 80 }} />
          </>
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary[500]}
          />
        }
      />

      <FAB onPress={() => setShowWizard(true)} />

      <NewInspectionWizard
        visible={showWizard}
        onClose={() => setShowWizard(false)}
      />

      {sheetOpen && (
        <BottomSheetWrapper
          ref={sheetRef}
          enableDynamicSizing
          onClose={() => setSheetOpen(false)}
        >
          <SortSheetContent
            sortBy={sortBy}
            setSortBy={setSortBy}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onClose={closeSheet}
          />
        </BottomSheetWrapper>
      )}
      {/* Delete confirmation modal */}
      <Modal
        visible={!!deleteAction}
        transparent
        animationType="fade"
        onRequestClose={dismissDelete}
      >
        <Pressable
          onPress={dismissDelete}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              width: '100%',
              maxWidth: 320,
              backgroundColor: COLORS.cream[50],
              borderRadius: 14,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Rubik-SemiBold',
                color: COLORS.neutral[800],
                textAlign: 'right',
                marginBottom: 8,
              }}
            >
              {deleteAction?.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[600],
                textAlign: 'right',
                marginBottom: 20,
              }}
            >
              {deleteAction?.message}
            </Text>
            <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
              <Pressable
                onPress={() => {
                  deleteAction?.onConfirm();
                }}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: deleteAction?.destructive
                    ? COLORS.danger[500]
                    : COLORS.primary[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Rubik-SemiBold',
                    color: COLORS.white,
                  }}
                >
                  {deleteAction?.confirmLabel ?? 'אישור'}
                </Text>
              </Pressable>
              <Pressable
                onPress={dismissDelete}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: COLORS.cream[100],
                  borderWidth: 1,
                  borderColor: COLORS.cream[200],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Rubik-Medium',
                    color: COLORS.neutral[600],
                  }}
                >
                  ביטול
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Delete error modal */}
      <Modal
        visible={!!deleteError}
        transparent
        animationType="fade"
        onRequestClose={clearDeleteError}
      >
        <Pressable
          onPress={clearDeleteError}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              width: '100%',
              maxWidth: 320,
              backgroundColor: COLORS.cream[50],
              borderRadius: 14,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Rubik-SemiBold',
                color: COLORS.neutral[800],
                textAlign: 'right',
                marginBottom: 8,
              }}
            >
              שגיאה
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[600],
                textAlign: 'right',
                marginBottom: 20,
              }}
            >
              {deleteError}
            </Text>
            <Pressable
              onPress={clearDeleteError}
              style={{
                height: 40,
                borderRadius: 10,
                backgroundColor: COLORS.primary[500],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik-SemiBold',
                  color: COLORS.white,
                }}
              >
                הבנתי
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
