import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from '@/lib/haptics';
import Animated, {
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import type BottomSheetType from '@gorhom/bottom-sheet';

import { COLORS, SHADOWS } from '@infield/ui';
import { supabase } from '@/lib/supabase';
import { SideMenu } from '@/components/ui/SideMenu';
import { useSideMenu } from '@/hooks/useSideMenu';
import {
  SkeletonBlock,
  BottomSheetWrapper,
  PressableScale,
} from '@/components/ui';
import { Toast } from '@/components/ui/Toast';
import {
  ChecklistFooter,
  RoomAccordion,
  ReportPreviewSheet,
  ReportSettingsSheet,
} from '@/components/checklist';
import { SearchOverlay } from '@/components/reports/SearchOverlay';
import { useChecklist } from '@/hooks/useChecklist';
import { useReport } from '@/hooks/useReport';
import { useDefectReviewStatus } from '@/hooks/useDefectReviewStatus';
import { usePdfGeneration } from '@/hooks/usePdfGeneration';
import { useToast } from '@/hooks/useToast';
import { ReviewStatusPill } from '@/components/reports/ReviewStatusPill';

// --- Confirm Modal (replaces Alert.alert — works on all platforms) ---

function DeleteConfirmModal({
  visible,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const btnScale = useSharedValue(1);
  const btnAnim = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        onPress={onCancel}
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
            ...SHADOWS.lg,
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
            מחיקת ממצא
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
            למחוק את הממצא? פעולה זו אינה הפיכה.
          </Text>
          <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
            <Animated.View style={[{ flex: 1 }, btnAnim]}>
              <Pressable
                onPress={() => {
                  if (Platform.OS !== 'web')
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onConfirm();
                }}
                onPressIn={() => {
                  btnScale.value = withSpring(0.96, {
                    damping: 15,
                    stiffness: 150,
                  });
                }}
                onPressOut={() => {
                  btnScale.value = withSpring(1, {
                    damping: 15,
                    stiffness: 150,
                  });
                }}
                style={{
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: COLORS.danger[500],
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
                  מחק
                </Text>
              </Pressable>
            </Animated.View>
            <Pressable
              onPress={onCancel}
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
  );
}

// --- Screen ---

export default function ChecklistScreen() {
  const { id: reportId } = useLocalSearchParams<{ id: string }>();

  // Web fallback: extract id from URL path (pathname or hash) if not in params
  const finalReportId =
    reportId ||
    (typeof window !== 'undefined'
      ? window.location.pathname.match(/\/reports\/([^/]+)/)?.[1] ||
        window.location.hash.match(/\/reports\/([^/]+)/)?.[1]
      : undefined);

  if (typeof window !== 'undefined') {
    console.error('[Checklist ID Debug]', {
      reportId,
      finalReportId,
      pathname: window.location.pathname,
      hash: window.location.hash,
      pathnameMatch: window.location.pathname.match(/\/reports\/([^/]+)/)?.[1],
      hashMatch: window.location.hash.match(/\/reports\/([^/]+)/)?.[1],
    });
  }

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const { isOpen: menuOpen, open: _openMenu, close: closeMenu } = useSideMenu();

  // Report data
  const {
    report,
    defects,
    isLoading: reportLoading,
    refetch,
  } = useReport(finalReportId);

  const { updateReviewStatus, isUpdating: isReviewUpdating } =
    useDefectReviewStatus(finalReportId);

  // PDF generation — Iron Rule: all inspector/org data comes from snapshot columns
  const { generatePdf, sharePdf } = usePdfGeneration(
    (msg) => showToast(msg, 'success'),
    (msg) => showToast(msg, 'error')
  );

  // Checklist state — loaded from and persisted to delivery_reports.checklist_state
  const templateId = report?.checklistTemplateId ?? null;
  const {
    rooms,
    openRooms,
    statuses,
    defectTexts,
    bathTypes,
    activeDefect,
    stats,
    isLoadingState,
    toggleRoom,
    setItemStatus,
    setDefectText,
    setBathType,
    setActiveDefect,
  } = useChecklist(finalReportId, templateId, (msg) => showToast(msg, 'error'));

  // Refetch when screen regains focus (e.g. after adding a defect via add-defect screen)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Sheet states
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const previewSheetRef = useRef<BottomSheetType>(null);
  const settingsSheetRef = useRef<BottomSheetType>(null);

  // Extended report info (round_number, tenant details)
  const [roundNumber, setRoundNumber] = useState(1);
  const [tenantPhone, setTenantPhone] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);

  const fetchExtended = useCallback(async () => {
    if (!finalReportId) return;
    try {
      const { data } = await supabase
        .from('delivery_reports')
        .select('round_number, tenant_phone, notes')
        .eq('id', finalReportId)
        .single();
      if (data) {
        setRoundNumber((data.round_number as number) ?? 1);
        setTenantPhone(data.tenant_phone as string | null);
        setNotes(data.notes as string | null);
      }
    } catch {
      // Silent fail
    }
  }, [finalReportId]);

  useEffect(() => {
    fetchExtended();
  }, [fetchExtended]);

  // Derived info
  const reportTitle = report
    ? `פרוטוקול מסירה — דירה ${report.apartmentNumber}`
    : 'פרוטוקול מסירה';
  const projectName = report?.projectName ?? '';
  const _tenantName = report?.tenantName ?? '';
  const _reportDate = report?.reportDate
    ? new Date(report.reportDate).toLocaleDateString('he-IL')
    : '';

  // --- Delete defect (modal-based — Alert.alert broken on Expo web) ---

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteDefect = useCallback((defectId: string) => {
    if (Platform.OS !== 'web')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDeleteConfirmId(defectId);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteConfirmId) return;
    const defectId = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      await supabase.from('defect_photos').delete().eq('defect_id', defectId);
      const { error } = await supabase
        .from('defects')
        .delete()
        .eq('id', defectId);
      if (error) throw error;
      refetch();
      showToast('הממצא נמחק', 'success');
    } catch {
      showToast('שגיאה במחיקת הממצא', 'error');
    }
  }, [deleteConfirmId, refetch, showToast]);

  // --- Handlers ---

  const handlePreview = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowPreview(true);
  }, []);

  const handleShare = useCallback(async () => {
    if (!finalReportId) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await sharePdf(finalReportId);
  }, [finalReportId, sharePdf]);

  const handleSettings = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowSettings(true);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!finalReportId) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await generatePdf(finalReportId);
  }, [finalReportId, generatePdf]);

  const handleSettingsSaved = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (settingsSheetRef.current as any)?.close?.();
    setShowSettings(false);
    refetch();
    fetchExtended();
    showToast('ההגדרות נשמרו', 'success');
  }, [refetch, fetchExtended, showToast]);

  const pct =
    stats.total > 0 ? Math.round((stats.checked / stats.total) * 100) : 0;
  const headerSubtitle = projectName
    ? `${projectName} · דירה ${report?.apartmentNumber ?? ''}`
    : '';

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream[100] }}>
      <StatusBar style="light" />

      {/* Delete confirm modal */}
      <DeleteConfirmModal
        visible={!!deleteConfirmId}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={!!toast}
          onDismiss={hideToast}
        />
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 96 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient header — matches new DS */}
        <LinearGradient
          colors={[COLORS.primary[700], COLORS.primary[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 12,
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          {/* Top row: back + title/subtitle + status badge + 3-dot */}
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {/* Back button (right in RTL) */}
            <PressableScale
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/(app)/reports');
                }
              }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.12)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="chevron-right" size={18} color={COLORS.white} />
            </PressableScale>

            {/* Title block */}
            <View style={{ flex: 1 }}>
              {headerSubtitle ? (
                <Text
                  style={{
                    fontSize: 11,
                    color: COLORS.white,
                    opacity: 0.75,
                    fontFamily: 'Rubik-Regular',
                    marginBottom: 2,
                    textAlign: 'right',
                  }}
                >
                  {headerSubtitle}
                </Text>
              ) : null}
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  fontFamily: 'Rubik-Bold',
                  color: COLORS.white,
                  letterSpacing: -0.2,
                  textAlign: 'right',
                }}
              >
                פרוטוקול מסירה
              </Text>
            </View>

            {/* Status badge */}
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.14)',
                paddingHorizontal: 9,
                paddingVertical: 4,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.18)',
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '600',
                  color: COLORS.white,
                  fontFamily: 'Rubik-SemiBold',
                }}
              >
                {report?.status === 'draft'
                  ? 'טיוטה'
                  : report?.status === 'in_progress'
                    ? 'בביצוע'
                    : report?.status === 'completed'
                      ? 'הושלם'
                      : 'טיוטה'}
              </Text>
            </View>

            {/* 3-dot menu */}
            <PressableScale
              onPress={() => {
                if (Platform.OS !== 'web')
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setMenuVisible(true);
              }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.12)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="more-horizontal" size={18} color={COLORS.white} />
            </PressableScale>
          </View>

          {/* Summary row — 3 metrics columns */}
          {reportLoading ? (
            <View
              style={{ flexDirection: 'row-reverse', gap: 12, marginTop: 14 }}
            >
              <View style={{ flex: 1 }}>
                <SkeletonBlock width="60%" height={22} />
                <SkeletonBlock width="40%" height={10} />
              </View>
              <View style={{ flex: 1 }}>
                <SkeletonBlock width="40%" height={22} />
                <SkeletonBlock width="40%" height={10} />
              </View>
              <View style={{ flex: 1 }}>
                <SkeletonBlock width="40%" height={22} />
                <SkeletonBlock width="40%" height={10} />
              </View>
            </View>
          ) : (
            <View
              style={{ flexDirection: 'row-reverse', gap: 12, marginTop: 14 }}
            >
              {/* Checked / Total */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '700',
                    fontFamily: 'Inter-Bold',
                    color: COLORS.white,
                    lineHeight: 22,
                  }}
                >
                  {stats.checked}
                  <Text style={{ fontSize: 13, opacity: 0.6 }}>
                    /{stats.total}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.white,
                    opacity: 0.7,
                    marginTop: 2,
                    fontFamily: 'Rubik-Regular',
                    textAlign: 'right',
                  }}
                >
                  נבדקו
                </Text>
              </View>
              {/* Divider */}
              <View
                style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.14)' }}
              />
              {/* Defects */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '700',
                    fontFamily: 'Inter-Bold',
                    color: COLORS.white,
                    lineHeight: 22,
                  }}
                >
                  {stats.defectCount}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.white,
                    opacity: 0.7,
                    marginTop: 2,
                    fontFamily: 'Rubik-Regular',
                    textAlign: 'right',
                  }}
                >
                  ליקויים
                </Text>
              </View>
              {/* Divider */}
              <View
                style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.14)' }}
              />
              {/* Progress % */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '700',
                    fontFamily: 'Inter-Bold',
                    color: COLORS.white,
                    lineHeight: 22,
                    writingDirection: 'ltr',
                  }}
                >
                  {pct}%
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.white,
                    opacity: 0.7,
                    marginTop: 2,
                    fontFamily: 'Rubik-Regular',
                    textAlign: 'right',
                  }}
                >
                  התקדמות
                </Text>
              </View>
            </View>
          )}

          {/* Progress bar */}
          <View
            style={{
              height: 4,
              backgroundColor: 'rgba(255,255,255,0.16)',
              borderRadius: 2,
              overflow: 'hidden',
              marginTop: 10,
            }}
          >
            <View
              style={{
                width: `${pct}%`,
                height: '100%',
                backgroundColor: COLORS.primary[200],
                borderRadius: 2,
              }}
            />
          </View>
        </LinearGradient>

        {/* Rooms */}
        <View style={{ padding: 16, paddingTop: 12, gap: 10 }}>
          {reportLoading || isLoadingState ? (
            <View style={{ gap: 8 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonBlock
                  key={i}
                  width="100%"
                  height={52}
                  borderRadius={10}
                />
              ))}
            </View>
          ) : report?.noChecklist ? (
            <>
              {/* No-checklist mode */}
              <Animated.View entering={FadeInDown.duration(300)}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 32,
                    paddingHorizontal: 16,
                    backgroundColor: COLORS.cream[100],
                    borderWidth: 1,
                    borderColor: COLORS.cream[200],
                    borderRadius: 12,
                    marginBottom: 16,
                  }}
                >
                  <Feather
                    name="file-text"
                    size={48}
                    color={COLORS.neutral[300]}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Rubik-Medium',
                      color: COLORS.neutral[500],
                      textAlign: 'center',
                      marginTop: 12,
                    }}
                  >
                    דוח זה ללא צ׳קליסט
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Rubik-Regular',
                      color: COLORS.neutral[400],
                      textAlign: 'center',
                      marginTop: 4,
                    }}
                  >
                    הוספת ממצאים ידנית בלבד
                  </Text>
                  <PressableScale
                    onPress={() => {
                      if (finalReportId) {
                        router.push(
                          `/(app)/reports/${finalReportId}/add-defect`
                        );
                      }
                    }}
                    style={{
                      marginTop: 16,
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      gap: 6,
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 10,
                      backgroundColor: COLORS.primary[500],
                    }}
                  >
                    <Feather name="plus" size={16} color={COLORS.white} />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Rubik-Medium',
                        color: COLORS.white,
                      }}
                    >
                      הוסף ממצא
                    </Text>
                  </PressableScale>
                </View>
              </Animated.View>
            </>
          ) : (
            <>
              {rooms.map((room, roomIdx) => (
                <Animated.View
                  key={room.id}
                  entering={FadeInUp.delay(60 * roomIdx).duration(200)}
                >
                  <RoomAccordion
                    room={room}
                    isOpen={!!openRooms[room.id]}
                    onToggle={() => toggleRoom(room.id)}
                    statuses={statuses}
                    defectTexts={defectTexts}
                    bathType={bathTypes[room.id] || 'shower'}
                    activeDefect={activeDefect}
                    onStatus={setItemStatus}
                    onDefectText={setDefectText}
                    onBathTypeChange={(v) => setBathType(room.id, v)}
                    onActivateDefect={setActiveDefect}
                  />
                </Animated.View>
              ))}

              {/* Inherited defects section (round 2+) */}
              {roundNumber > 1 &&
                defects.filter((d) => d.source === 'inherited').length > 0 && (
                  <View style={{ marginTop: 16 }}>
                    <View
                      style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 8,
                        paddingBottom: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.info[50],
                      }}
                    >
                      <Feather
                        name="refresh-cw"
                        size={14}
                        color={COLORS.info[500]}
                      />
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 15,
                          fontWeight: '700',
                          fontFamily: 'Rubik-Bold',
                          color: COLORS.info[700],
                          textAlign: 'right',
                        }}
                      >
                        ליקויים מסבב קודם (
                        {defects.filter((d) => d.source === 'inherited').length}
                        )
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          fontFamily: 'Rubik-Medium',
                          color: COLORS.primary[500],
                        }}
                      >
                        {`${defects.filter((d) => d.source === 'inherited' && d.reviewStatus !== 'pending_review').length}/${defects.filter((d) => d.source === 'inherited').length} נבדקו`}
                      </Text>
                    </View>
                    {defects
                      .filter((d) => d.source === 'inherited')
                      .map((defect, idx) => (
                        <Animated.View
                          key={defect.id}
                          entering={FadeInUp.delay(idx * 60).duration(200)}
                          style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            gap: 10,
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            marginBottom: 6,
                            backgroundColor: COLORS.info[50],
                            borderWidth: 1,
                            borderColor: COLORS.info[500] + '33',
                            borderRadius: 10,
                            borderRightWidth: 3,
                            borderRightColor: COLORS.info[500],
                          }}
                        >
                          <View
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              backgroundColor: COLORS.info[500] + '22',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Feather
                              name="corner-up-left"
                              size={12}
                              color={COLORS.info[500]}
                            />
                          </View>
                          <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: '600',
                                fontFamily: 'Rubik-SemiBold',
                                color: COLORS.neutral[800],
                                textAlign: 'right',
                              }}
                              numberOfLines={2}
                            >
                              {defect.description}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                gap: 6,
                              }}
                            >
                              {defect.category && (
                                <Text
                                  style={{
                                    fontSize: 10,
                                    fontFamily: 'Rubik-Regular',
                                    color: COLORS.neutral[400],
                                  }}
                                >
                                  {defect.category}
                                </Text>
                              )}
                            </View>
                            {defect.reviewStatus && (
                              <ReviewStatusPill
                                status={defect.reviewStatus}
                                onChange={(newStatus) =>
                                  updateReviewStatus(defect.id, newStatus)
                                }
                                isUpdating={isReviewUpdating}
                              />
                            )}
                          </View>
                          <Pressable
                            onPress={() => handleDeleteDefect(defect.id)}
                            hitSlop={8}
                            style={({ pressed }) => ({
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: pressed
                                ? COLORS.danger[50]
                                : COLORS.cream[100],
                              transform: [{ scale: pressed ? 0.9 : 1 }],
                            })}
                          >
                            <Feather
                              name="trash-2"
                              size={14}
                              color={COLORS.neutral[400]}
                            />
                          </Pressable>
                        </Animated.View>
                      ))}
                  </View>
                )}

              {/* Defects list (non-inherited) */}
              {defects.filter((d) => d.source !== 'inherited').length > 0 && (
                <View style={{ marginTop: 16 }}>
                  <View
                    style={{
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '700',
                        fontFamily: 'Rubik-Bold',
                        color: COLORS.neutral[800],
                        textAlign: 'right',
                      }}
                    >
                      {roundNumber > 1
                        ? `ממצאים חדשים (${defects.filter((d) => d.source !== 'inherited').length})`
                        : `ממצאים (${defects.length})`}
                    </Text>
                    <PressableScale
                      onPress={() => {
                        if (finalReportId) {
                          router.push(
                            `/(app)/reports/${finalReportId}/add-defect`
                          );
                        }
                      }}
                      style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        gap: 4,
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 8,
                        backgroundColor: COLORS.primary[50],
                      }}
                    >
                      <Feather
                        name="plus"
                        size={14}
                        color={COLORS.primary[500]}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'Rubik-Medium',
                          color: COLORS.primary[500],
                        }}
                      >
                        הוסף
                      </Text>
                    </PressableScale>
                  </View>

                  {defects
                    .filter((d) => d.source !== 'inherited')
                    .map((defect, idx) => (
                      <Animated.View
                        key={defect.id}
                        entering={FadeInUp.delay(idx * 60).duration(200)}
                        style={{
                          flexDirection: 'row-reverse',
                          alignItems: 'center',
                          gap: 10,
                          paddingVertical: 10,
                          paddingHorizontal: 12,
                          marginBottom: 6,
                          backgroundColor: COLORS.cream[50],
                          borderWidth: 1,
                          borderColor: COLORS.cream[200],
                          borderRadius: 10,
                          borderRightWidth: 3,
                          borderRightColor:
                            defect.severity === 'high' ||
                            defect.severity === 'critical'
                              ? COLORS.danger[500]
                              : defect.severity === 'low'
                                ? COLORS.primary[500]
                                : COLORS.gold[500],
                        }}
                      >
                        {/* Number badge */}
                        <View
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            backgroundColor: COLORS.cream[200],
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: '700',
                              color: COLORS.neutral[600],
                            }}
                          >
                            {idx + 1}
                          </Text>
                        </View>

                        {/* Content */}
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: '600',
                              fontFamily: 'Rubik-SemiBold',
                              color: COLORS.neutral[800],
                              textAlign: 'right',
                            }}
                            numberOfLines={2}
                          >
                            {defect.description}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row-reverse',
                              alignItems: 'center',
                              gap: 8,
                              marginTop: 2,
                            }}
                          >
                            {defect.category && (
                              <Text
                                style={{
                                  fontSize: 10,
                                  fontFamily: 'Rubik-Regular',
                                  color: COLORS.neutral[400],
                                }}
                              >
                                {defect.category}
                              </Text>
                            )}
                            {defect.room && (
                              <Text
                                style={{
                                  fontSize: 10,
                                  fontFamily: 'Rubik-Regular',
                                  color: COLORS.neutral[400],
                                }}
                              >
                                {defect.room}
                              </Text>
                            )}
                            {defect.photoCount > 0 && (
                              <View
                                style={{
                                  flexDirection: 'row-reverse',
                                  alignItems: 'center',
                                  gap: 2,
                                }}
                              >
                                <Feather
                                  name="camera"
                                  size={10}
                                  color={COLORS.neutral[400]}
                                />
                                <Text
                                  style={{
                                    fontSize: 10,
                                    color: COLORS.neutral[400],
                                  }}
                                >
                                  {defect.photoCount}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>

                        {/* Delete button */}
                        <Pressable
                          onPress={() => handleDeleteDefect(defect.id)}
                          hitSlop={8}
                          style={({ pressed }) => ({
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: pressed
                              ? COLORS.danger[50]
                              : COLORS.cream[100],
                            transform: [{ scale: pressed ? 0.9 : 1 }],
                          })}
                        >
                          <Feather
                            name="trash-2"
                            size={14}
                            color={COLORS.neutral[400]}
                          />
                        </Pressable>
                      </Animated.View>
                    ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <ChecklistFooter
        onAddDefect={() => {
          if (!finalReportId) {
            return;
          }
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          router.push(`/(app)/reports/${finalReportId}/add-defect`);
        }}
        onSearch={() => setShowSearch(true)}
      />

      {/* Search overlay */}
      {showSearch && (
        <SearchOverlay
          defects={defects}
          onSelect={() => setShowSearch(false)}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Add defect now navigates to the popup screen — AddDefectSheet removed */}

      {/* Preview bottom sheet */}
      {showPreview && (
        <BottomSheetWrapper
          ref={previewSheetRef}
          enableDynamicSizing
          onClose={() => setShowPreview(false)}
        >
          <ReportPreviewSheet
            defects={defects}
            reportTitle={reportTitle}
            projectName={projectName}
            apartmentNumber={report?.apartmentNumber ?? ''}
            onClose={() => setShowPreview(false)}
          />
        </BottomSheetWrapper>
      )}

      {/* Settings bottom sheet */}
      {showSettings && finalReportId && (
        <BottomSheetWrapper
          ref={settingsSheetRef}
          enableDynamicSizing
          onClose={() => setShowSettings(false)}
        >
          <ReportSettingsSheet
            reportId={finalReportId}
            tenantName={report?.tenantName ?? null}
            tenantPhone={tenantPhone}
            notes={notes}
            roundNumber={roundNumber}
            noChecklist={report?.noChecklist ?? false}
            showSeverity={report?.showSeverity ?? true}
            onSaved={handleSettingsSaved}
            onClose={() => setShowSettings(false)}
          />
        </BottomSheetWrapper>
      )}

      {/* Floating dropdown menu (3-dot) — matches new DS */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable onPress={() => setMenuVisible(false)} style={{ flex: 1 }}>
          <Pressable
            onPress={() => {}}
            style={{
              position: 'absolute',
              top: insets.top + 56,
              left: 12,
              width: 220,
              backgroundColor: COLORS.white,
              borderWidth: 1,
              borderColor: COLORS.cream[200],
              borderRadius: 12,
              overflow: 'hidden',
              shadowColor: 'rgb(60,54,42)',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.18,
              shadowRadius: 28,
              elevation: 12,
            }}
          >
            {[
              {
                icon: 'eye' as const,
                label: 'תצוגה מקדימה',
                handler: handlePreview,
              },
              {
                icon: 'file-text' as const,
                label: 'הפקת פרוטוקול PDF',
                handler: handleDownload,
              },
              {
                icon: 'book-open' as const,
                label: 'הגדרות תבנית',
                handler: handleSettings,
              },
              {
                icon: 'grid' as const,
                label: 'ניהול חדרים',
                handler: undefined,
                comingSoon: true,
              },
              {
                icon: 'share-2' as const,
                label: 'שיתוף פרוטוקול',
                handler: handleShare,
              },
            ].map((item, idx) => (
              <Pressable
                key={`${item.icon}-${idx}`}
                onPress={() => {
                  setMenuVisible(false);
                  if (item.comingSoon) {
                    showToast('בקרוב...', 'info');
                    return;
                  }
                  item.handler?.();
                }}
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 10,
                  paddingVertical: 11,
                  paddingHorizontal: 14,
                  borderTopWidth: idx === 0 ? 0 : 1,
                  borderTopColor: COLORS.cream[100],
                  opacity: item.comingSoon ? 0.45 : 1,
                }}
              >
                <Feather
                  name={item.comingSoon ? 'lock' : item.icon}
                  size={16}
                  color={COLORS.neutral[500]}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '500',
                    fontFamily: 'Rubik-Medium',
                    color: COLORS.neutral[700],
                    textAlign: 'right',
                    flex: 1,
                  }}
                >
                  {item.label}
                </Text>
                {item.comingSoon && (
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: 'Rubik-Regular',
                      color: COLORS.neutral[400],
                    }}
                  >
                    בקרוב
                  </Text>
                )}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <SideMenu visible={menuOpen} onClose={closeMenu} />
    </View>
  );
}
