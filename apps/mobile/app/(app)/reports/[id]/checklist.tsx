import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import type BottomSheetType from '@gorhom/bottom-sheet';

import { COLORS } from '@infield/ui';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { SkeletonBlock, BottomSheetWrapper } from '@/components/ui';
import { Toast } from '@/components/ui/Toast';
import {
  ChecklistHeader,
  ChecklistFooter,
  RoomAccordion,
  AddDefectSheet,
  ReportPreviewSheet,
  ReportSettingsSheet,
  CHECKLIST_ROOMS,
} from '@/components/checklist';
import { useChecklist } from '@/hooks/useChecklist';
import { useReport } from '@/hooks/useReport';
import { usePdfGeneration } from '@/hooks/usePdfGeneration';
import { useToast } from '@/hooks/useToast';

// --- Screen ---

export default function ChecklistScreen() {
  const { id: reportId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const organizationId = profile?.organizationId;
  const { toast, showToast, hideToast } = useToast();

  // Report data
  const {
    report,
    defects,
    isLoading: reportLoading,
    refetch,
  } = useReport(reportId);

  // PDF generation
  const inspectorProfile = useMemo(
    () => ({
      name: profile?.fullName ?? '',
      signatureUrl: profile?.signatureUrl,
      stampUrl: profile?.stampUrl,
    }),
    [profile]
  );

  const { generatePdf, sharePdf } = usePdfGeneration(
    (msg) => showToast(msg, 'success'),
    (msg) => showToast(msg, 'error')
  );

  // Checklist state
  const {
    openRooms,
    statuses,
    defectTexts,
    bathTypes,
    activeDefect,
    stats,
    toggleRoom,
    setItemStatus,
    setDefectText,
    setBathType,
    setActiveDefect,
  } = useChecklist();

  // Sheet states
  const [showAddDefect, setShowAddDefect] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const previewSheetRef = useRef<BottomSheetType>(null);
  const settingsSheetRef = useRef<BottomSheetType>(null);

  // Extended report info (round_number, tenant details)
  const [roundNumber, setRoundNumber] = useState(1);
  const [tenantPhone, setTenantPhone] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExtended() {
      if (!reportId) return;
      try {
        const { data } = await supabase
          .from('delivery_reports')
          .select('round_number, tenant_phone, notes')
          .eq('id', reportId)
          .single();
        if (data) {
          setRoundNumber((data.round_number as number) ?? 1);
          setTenantPhone(data.tenant_phone as string | null);
          setNotes(data.notes as string | null);
        }
      } catch {
        // Silent fail
      }
    }
    fetchExtended();
  }, [reportId]);

  // Derived info
  const reportTitle = report
    ? `פרוטוקול מסירה — דירה ${report.apartmentNumber}`
    : 'פרוטוקול מסירה';
  const projectName = report?.projectName ?? '';
  const tenantName = report?.tenantName ?? '';
  const reportDate = report?.reportDate
    ? new Date(report.reportDate).toLocaleDateString('he-IL')
    : '';

  // --- Handlers ---

  const handleAddDefectSave = useCallback(
    async (data: {
      category: string;
      location: string;
      description: string;
    }) => {
      if (!reportId || !organizationId) {
        console.warn('[AddDefect] Missing data:', { reportId, organizationId });
        Alert.alert('שגיאה', 'חסרים נתונים — נסה לטעון מחדש');
        return;
      }
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      const { error } = await supabase.from('defects').insert({
        delivery_report_id: reportId,
        organization_id: organizationId,
        description: data.description,
        room: data.location || null,
        category: data.category || null,
        severity: 'medium',
        source: 'checklist',
      });
      if (error) {
        console.error('[AddDefect] Insert error:', error);
        Alert.alert('שגיאה', 'לא הצלחנו להוסיף את הליקוי');
        return;
      }
      refetch();
    },
    [reportId, organizationId, refetch]
  );

  const handlePreview = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowPreview(true);
  }, []);

  const handleShare = useCallback(async () => {
    if (!reportId) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await sharePdf(reportId, inspectorProfile);
  }, [reportId, inspectorProfile, sharePdf]);

  const handleSettings = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowSettings(true);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!reportId) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await generatePdf(reportId, inspectorProfile);
  }, [reportId, inspectorProfile, generatePdf]);

  const handleSettingsSaved = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (settingsSheetRef.current as any)?.close?.();
    setShowSettings(false);
    refetch();
    showToast('ההגדרות נשמרו', 'success');
  }, [refetch, showToast]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream[50] }}>
      <StatusBar style="light" />

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
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Green header bar */}
        <View
          style={{
            paddingTop: insets.top + 12,
            paddingHorizontal: 16,
            paddingBottom: 12,
            backgroundColor: COLORS.primary[700],
          }}
        >
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* App title + subtitle */}
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    fontFamily: 'Rubik-Bold',
                    color: COLORS.white,
                    letterSpacing: -0.3,
                  }}
                >
                  inField
                </Text>
                <View
                  style={{
                    backgroundColor: `${COLORS.success[500]}33`,
                    borderRadius: 20,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: COLORS.success[500],
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      color: COLORS.success[500],
                      fontWeight: '500',
                      fontFamily: 'Rubik-Medium',
                    }}
                  >
                    מסונכרן
                  </Text>
                </View>
              </View>
              {projectName ? (
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Rubik-Regular',
                    color: COLORS.white,
                    opacity: 0.7,
                    marginTop: 4,
                  }}
                >
                  {projectName}, דירה {report?.apartmentNumber ?? ''}
                </Text>
              ) : null}
            </View>

            {/* Back button */}
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.15)',
              }}
            >
              <Feather name="arrow-left" size={20} color={COLORS.white} />
            </Pressable>
          </View>
        </View>

        {/* Report card */}
        <ChecklistHeader
          isLoading={reportLoading}
          reportTitle={reportTitle}
          projectName={projectName}
          tenantName={tenantName}
          reportDate={reportDate}
          checked={stats.checked}
          total={stats.total}
          defectCount={stats.defectCount}
          roomCount={CHECKLIST_ROOMS.length}
          onPreview={handlePreview}
          onShare={handleShare}
          onSettings={handleSettings}
          onDownload={handleDownload}
        />

        {/* Rooms */}
        <View style={{ padding: 12, paddingTop: 8 }}>
          {reportLoading ? (
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
          ) : (
            CHECKLIST_ROOMS.map((room) => (
              <RoomAccordion
                key={room.id}
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
            ))
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <ChecklistFooter
        onAddDefect={() => setShowAddDefect(true)}
        onCamera={() => {}}
        onSearch={() => {}}
      />

      {/* Add defect bottom sheet */}
      <AddDefectSheet
        visible={showAddDefect}
        onClose={() => setShowAddDefect(false)}
        onSave={handleAddDefectSave}
      />

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
      {showSettings && reportId && (
        <BottomSheetWrapper
          ref={settingsSheetRef}
          enableDynamicSizing
          onClose={() => setShowSettings(false)}
        >
          <ReportSettingsSheet
            reportId={reportId}
            tenantName={report?.tenantName ?? null}
            tenantPhone={tenantPhone}
            notes={notes}
            roundNumber={roundNumber}
            onSaved={handleSettingsSaved}
            onClose={() => setShowSettings(false)}
          />
        </BottomSheetWrapper>
      )}
    </View>
  );
}
