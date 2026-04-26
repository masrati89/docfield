import { useCallback, useMemo, useRef, useState } from 'react';
import { View, RefreshControl, Modal, Pressable, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import type BottomSheetType from '@gorhom/bottom-sheet';
import Fuse from 'fuse.js';

import { COLORS } from '@infield/ui';
import { EmptyState } from '@/components/ui/EmptyState';
import { BottomSheetWrapper } from '@/components/ui/BottomSheetWrapper';
import { useProjects } from '@/hooks/useProjects';
import { useDeleteProject } from '@/hooks/useDeleteProject';
import {
  Header,
  SearchBar,
  FilterChips,
  ActiveSortTag,
  ProjectCard,
  SortSheetContent,
  SkeletonCardList,
  ErrorState,
  FAB,
  NewProjectSheet,
} from '@/components/projects';
import type { StatusFilter, SortBy } from '@/components/projects';
import type { ProjectItem } from '@/hooks/useProjects';

// --- Main Screen ---

export default function ProjectsScreen() {
  const router = useRouter();
  const { projects, isLoading, isRefreshing, error, refetch } = useProjects();
  const {
    handleDeleteProject,
    pendingAction: deleteAction,
    dismissAction: dismissDelete,
    errorMessage: deleteError,
    clearError: clearDeleteError,
  } = useDeleteProject(projects, refetch);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('name');

  const sheetRef = useRef<BottomSheetType>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const newProjectSheetRef = useRef<BottomSheetType>(null);
  const hasActiveSort = sortBy !== 'name';

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // --- Filtering + Search ---

  const fuse = useMemo(
    () =>
      new Fuse(projects, {
        keys: ['name', 'address'],
        threshold: 0.35,
      }),
    [projects]
  );

  const filtered = useMemo(() => {
    let list = [...projects];

    // Status filter
    if (statusFilter === 'active') {
      list = list.filter((p) => p.status === 'active');
    } else if (statusFilter === 'completed') {
      list = list.filter((p) => p.status === 'completed');
    }

    // Search
    if (search.trim()) {
      const ids = new Set(fuse.search(search.trim()).map((r) => r.item.id));
      list = list.filter((p) => ids.has(p.id));
    }

    // Sort
    switch (sortBy) {
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name, 'he'));
        break;
      case 'activity':
        list.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
      case 'progress':
        list.sort((a, b) => {
          const pctA = a.totalApts > 0 ? a.completedApts / a.totalApts : 0;
          const pctB = b.totalApts > 0 ? b.completedApts / b.totalApts : 0;
          return pctB - pctA;
        });
        break;
      case 'defects':
        list.sort((a, b) => b.openDefects - a.openDefects);
        break;
    }

    return list;
  }, [projects, statusFilter, search, sortBy, fuse]);

  // --- Bottom sheet ---

  const openSheet = useCallback(() => {
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
  }, []);

  // --- Render ---

  const handleProjectPress = useCallback(
    (project: ProjectItem) => {
      if (project.buildingsCount <= 1) {
        router.push(`/(app)/projects/${project.id}/apartments`);
      } else {
        router.push(`/(app)/projects/${project.id}/buildings`);
      }
    },
    [router]
  );

  const renderProjectItem = useCallback(
    ({ item }: { item: ProjectItem }) => (
      <ProjectCard
        item={item}
        onPress={() => handleProjectPress(item)}
        onDelete={(id: string) => handleDeleteProject(id)}
      />
    ),
    [handleProjectPress, handleDeleteProject]
  );

  const keyExtractor = useCallback((item: ProjectItem) => item.id, []);

  const renderContent = () => {
    if (isLoading) return <SkeletonCardList />;
    if (error) return <ErrorState onRetry={() => refetch()} />;
    if (filtered.length === 0) {
      return (
        <View style={{ marginHorizontal: 16, marginTop: 12 }}>
          <EmptyState
            icon="folder"
            title="אין פרויקטים"
            subtitle={
              search.trim() || statusFilter !== 'all'
                ? 'לא נמצאו פרויקטים התואמים לחיפוש.\nנסה לשנות את הפילטרים.'
                : 'עדיין לא יצרת פרויקטים.\nלחץ על + כדי להתחיל.'
            }
            ctaLabel="פרויקט חדש"
            onCta={() => setNewProjectOpen(true)}
          />
        </View>
      );
    }

    return (
      <FlashList
        data={filtered}
        renderItem={renderProjectItem}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
        }}
      />
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
            <Header count={filtered.length} total={projects.length} />
            <SearchBar value={search} onChange={setSearch} />
            <FilterChips
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              hasActiveSort={hasActiveSort}
              onOpenSort={openSheet}
            />
            <ActiveSortTag sortBy={sortBy} onReset={() => setSortBy('name')} />
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

      <FAB onPress={() => setNewProjectOpen(true)} />

      {sheetOpen && (
        <BottomSheetWrapper
          ref={sheetRef}
          enableDynamicSizing
          onClose={() => setSheetOpen(false)}
        >
          <SortSheetContent
            sortBy={sortBy}
            setSortBy={setSortBy}
            onClose={closeSheet}
          />
        </BottomSheetWrapper>
      )}

      {newProjectOpen && (
        <BottomSheetWrapper
          ref={newProjectSheetRef}
          snapPoints={['90%']}
          onClose={() => setNewProjectOpen(false)}
        >
          <NewProjectSheet
            onClose={() => {
              setNewProjectOpen(false);
            }}
            onCreated={() => {
              refetch();
              setNewProjectOpen(false);
            }}
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
