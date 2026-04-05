import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { usePdfGeneration } from '@/hooks/usePdfGeneration';
import { useReportStatus } from '@/hooks/useReportStatus';
import { useReport } from '@/hooks/useReport';
import { useSignature } from '@/hooks/useSignature';
import { STATUS_CONFIG } from '@/components/reports/reportDetailConstants';
import { CategoryAccordion } from '@/components/reports/CategoryAccordion';
import { ReportTabBar } from '@/components/reports/ReportTabBar';
import { ReportSkeleton } from '@/components/reports/ReportSkeleton';
import { ReportDetailsSection } from '@/components/reports/ReportDetailsSection';
import { ReportHeaderBar } from '@/components/reports/ReportHeaderBar';
import { ReportActionsBar } from '@/components/reports/ReportActionsBar';
import { ReportInfoCard } from '@/components/reports/ReportInfoCard';
import { PrePdfSummary } from '@/components/reports/PrePdfSummary';
import { TenantSignatureScreen } from '@/components/reports/TenantSignatureScreen';
import type {
  CategoryGroup,
  TabKey,
} from '@/components/reports/reportDetailConstants';

type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'sent';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const { profile } = useAuth();

  const {
    report,
    defects,
    isLoading,
    error: hasError,
    refetch,
  } = useReport(id);

  // Protocol mesira → checklist is the main page
  useEffect(() => {
    if (report?.reportType === 'protocol_mesira' && id) {
      router.replace(`/(app)/reports/${id}/checklist`);
    }
  }, [report?.reportType, id, router]);

  // Refetch when screen regains focus (e.g., after adding a defect)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const [activeTab, setActiveTab] = useState<TabKey>('findings');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );
  const [_pdfUri, setPdfUri] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showTenantSignature, setShowTenantSignature] = useState(false);
  const [pdfAction, setPdfAction] = useState<'generate' | 'share'>('generate');

  const { isGenerating, isSharing, generatePdf, sharePdf } = usePdfGeneration(
    (msg) => showToast(msg, 'success'),
    (msg) => showToast(msg, 'error')
  );

  const {
    isUpdating: isStatusUpdating,
    markCompleted,
    reopenForEditing,
    transitionToDraft,
  } = useReportStatus(
    (msg) => {
      showToast(msg, 'success');
      refetch();
    },
    (msg) => showToast(msg, 'error'),
    () => refetch()
  );

  const {
    saveTenantSignature,
    getTenantSignature,
    isUploading: isSignatureUploading,
  } = useSignature();

  const inspectorProfile = useMemo(
    () => ({
      name: profile?.fullName ?? '',
      signatureUrl: profile?.signatureUrl,
      stampUrl: profile?.stampUrl,
    }),
    [profile]
  );

  // Group defects by category
  const categoryGroups = useMemo<CategoryGroup[]>(() => {
    const map = new Map<string, typeof defects>();
    defects.forEach((d) => {
      const cat = d.category ?? 'כללי';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(d);
    });
    return Array.from(map.entries()).map(([name, items]) => ({
      name,
      defects: items,
      photoCount: items.reduce((sum, d) => sum + d.photoCount, 0),
    }));
  }, [defects]);

  const totalPhotos = defects.reduce((sum, d) => sum + d.photoCount, 0);

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleDeleteDefect = useCallback(
    (defectId: string) => {
      Alert.alert('מחיקת ממצא', 'למחוק את הממצא? פעולה זו אינה הפיכה.', [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'מחק',
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: photoData } = await supabase
                .from('defect_photos')
                .select('id, image_url')
                .eq('defect_id', defectId);

              if (photoData && photoData.length > 0) {
                const storagePaths = photoData
                  .map((p) => {
                    const url = p.image_url as string;
                    const match = url.match(/defect-photos\/(.+)$/);
                    return match ? match[1] : null;
                  })
                  .filter((p): p is string => !!p);

                if (storagePaths.length > 0) {
                  await supabase.storage
                    .from('defect-photos')
                    .remove(storagePaths);
                }
              }

              await supabase
                .from('defect_photos')
                .delete()
                .eq('defect_id', defectId);

              const { error: deleteError } = await supabase
                .from('defects')
                .delete()
                .eq('id', defectId);

              if (deleteError) throw deleteError;
              refetch();
            } catch {
              Alert.alert('שגיאה', 'לא הצלחנו למחוק את הממצא. נסה שוב.');
            }
          },
        },
      ]);
    },
    [refetch]
  );

  const navigateToAddDefect = useCallback(
    (category?: string) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      const path = `/(app)/reports/${id}/add-defect` as const;
      if (category) {
        router.push({ pathname: path, params: { category } });
      } else {
        router.push(path);
      }
    },
    [id, router]
  );

  const navigateToChecklist = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/(app)/reports/${id}/checklist`);
  }, [id, router]);

  const statusConfig =
    STATUS_CONFIG[report?.status ?? 'draft'] ?? STATUS_CONFIG.draft;
  const subtitle = report
    ? `${report.address ?? report.projectName}, דירה ${report.apartmentNumber}`
    : '';

  const handleGeneratePdf = useCallback(() => {
    if (!id) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPdfAction('generate');
    setShowSummary(true);
  }, [id]);

  const handleSharePdf = useCallback(() => {
    if (!id) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPdfAction('share');
    setShowSummary(true);
  }, [id]);

  // Summary → generate PDF (bedek bayit) or continue to signature (delivery)
  const handleSummaryGenerate = useCallback(async () => {
    if (!id) return;
    setShowSummary(false);
    if (!profile?.signatureUrl) {
      showToast('לא הוגדרה חתימה — הגדר בהגדרות', 'info');
    }
    if (pdfAction === 'share') {
      await sharePdf(id, inspectorProfile);
    } else {
      const uri = await generatePdf(id, inspectorProfile);
      if (uri) setPdfUri(uri);
    }
  }, [
    id,
    pdfAction,
    profile,
    inspectorProfile,
    generatePdf,
    sharePdf,
    showToast,
  ]);

  const handleContinueToSignature = useCallback(async () => {
    if (!id) return;
    const existing = await getTenantSignature(id);
    if (existing) {
      showToast('חתימת דייר קיימת', 'info');
      setShowSummary(false);
      if (pdfAction === 'share') {
        await sharePdf(id, inspectorProfile);
      } else {
        const uri = await generatePdf(id, inspectorProfile);
        if (uri) setPdfUri(uri);
      }
      return;
    }
    setShowSummary(false);
    setShowTenantSignature(true);
  }, [
    id,
    pdfAction,
    inspectorProfile,
    getTenantSignature,
    generatePdf,
    sharePdf,
    showToast,
  ]);

  const handleTenantSign = useCallback(
    async (name: string, base64Png: string) => {
      if (!id) return;
      await saveTenantSignature(id, name, base64Png);
      setShowTenantSignature(false);
      if (pdfAction === 'share') {
        await sharePdf(id, inspectorProfile);
      } else {
        const uri = await generatePdf(id, inspectorProfile);
        if (uri) setPdfUri(uri);
      }
    },
    [
      id,
      pdfAction,
      inspectorProfile,
      saveTenantSignature,
      generatePdf,
      sharePdf,
    ]
  );

  const handleStatusChange = useCallback(
    (newStatus: ReportStatus) => {
      if (!id || !report) return;
      if (newStatus === 'completed') {
        markCompleted(id);
      } else if (report.status === 'completed' && newStatus === 'in_progress') {
        reopenForEditing(id);
      } else if (newStatus === 'in_progress') {
        transitionToDraft(id);
      } else {
        supabase
          .from('delivery_reports')
          .update({ status: newStatus })
          .eq('id', id)
          .then(() => refetch());
      }
    },
    [id, report, markCompleted, reopenForEditing, transitionToDraft, refetch]
  );

  const handleCamera = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const handleLibrary = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/(app)/library');
  }, [router]);

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

      <ReportHeaderBar
        subtitle={subtitle}
        topInset={insets.top}
        status={(report?.status as ReportStatus) ?? 'draft'}
        isStatusUpdating={isStatusUpdating}
        onBack={() => router.back()}
        onStatusChange={handleStatusChange}
      />

      {isLoading ? (
        <ReportSkeleton />
      ) : hasError || (!isLoading && !report) ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
          }}
        >
          <EmptyState
            icon="alert-circle"
            title="לא ניתן לטעון את הדוח"
            subtitle="ייתכן שהדוח נמחק או שאין הרשאת צפייה. נסה שוב."
            ctaLabel="נסה שוב"
            onCta={() => refetch()}
          />
          <Pressable
            onPress={() => router.back()}
            style={{
              marginTop: 12,
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: COLORS.primary[500],
                fontFamily: 'Rubik-SemiBold',
              }}
            >
              חזרה
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Report Info Card */}
            {report && (
              <ReportInfoCard
                report={report}
                statusConfig={statusConfig}
                defectsCount={defects.length}
                totalPhotos={totalPhotos}
                categoryCount={categoryGroups.length}
              />
            )}

            <ReportTabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              shortagesCount={0}
            />

            {/* Tab Content */}
            <View style={{ padding: 12, paddingTop: 8 }}>
              {activeTab === 'findings' && (
                <>
                  {categoryGroups.length === 0 ? (
                    <EmptyState
                      icon="file-text"
                      title="אין ממצאים עדיין"
                      subtitle="הוסף ממצא ראשון מהכפתור למטה, מהמאגר, או צלם תמונה"
                      ctaLabel="הוסף ממצא"
                      onCta={() => navigateToAddDefect()}
                    />
                  ) : (
                    categoryGroups.map((group, idx) => (
                      <CategoryAccordion
                        key={group.name}
                        group={group}
                        isOpen={openCategories[group.name] ?? false}
                        onToggle={() => toggleCategory(group.name)}
                        index={idx}
                        onAddDefect={navigateToAddDefect}
                        onDeleteDefect={handleDeleteDefect}
                      />
                    ))
                  )}
                </>
              )}

              {activeTab === 'details' && report && (
                <ReportDetailsSection report={report} />
              )}

              {activeTab === 'content' && (
                <EmptyState
                  icon="list"
                  title="תוכן הדוח"
                  subtitle="תוכן עניינים יתעדכן אוטומטית"
                />
              )}

              {activeTab === 'shortages' && (
                <EmptyState
                  icon="alert-circle"
                  title="חוסרים"
                  subtitle="אין חוסרים מתועדים עדיין"
                />
              )}
            </View>
          </ScrollView>

          <ReportActionsBar
            bottomInset={insets.bottom}
            defectsCount={defects.length}
            isGenerating={isGenerating}
            isSharing={isSharing}
            onGeneratePdf={handleGeneratePdf}
            onSharePdf={handleSharePdf}
            onChecklist={navigateToChecklist}
            onAddDefect={() => navigateToAddDefect()}
            onCamera={handleCamera}
            onLibrary={handleLibrary}
          />

          {/* Summary modal */}
          {report && (
            <PrePdfSummary
              visible={showSummary}
              report={report}
              defects={defects}
              onGeneratePdf={handleSummaryGenerate}
              onContinueToSignature={handleContinueToSignature}
              onClose={() => setShowSummary(false)}
            />
          )}

          {/* Tenant signature modal (delivery only) */}
          {report && (
            <TenantSignatureScreen
              visible={showTenantSignature}
              initialName={report.tenantName ?? ''}
              isUploading={isSignatureUploading}
              onSign={handleTenantSign}
              onClose={() => setShowTenantSignature(false)}
            />
          )}
        </>
      )}
    </View>
  );
}
