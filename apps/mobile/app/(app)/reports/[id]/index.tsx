import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from '@/lib/haptics';
import { COLORS } from '@infield/ui';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';
import { SideMenu } from '@/components/ui/SideMenu';
import { useSideMenu } from '@/hooks/useSideMenu';
import { useToast } from '@/hooks/useToast';
import { usePdfGeneration } from '@/hooks/usePdfGeneration';
import { useReportStatus } from '@/hooks/useReportStatus';
import { useReport } from '@/hooks/useReport';
import { useDefectReviewStatus } from '@/hooks/useDefectReviewStatus';
import { useSignature } from '@/hooks/useSignature';
import { CategoryAccordion } from '@/components/reports/CategoryAccordion';
import { ReportSkeleton } from '@/components/reports/ReportSkeleton';
import { ReportHeaderBar } from '@/components/reports/ReportHeaderBar';
import { ReportActionsBar } from '@/components/reports/ReportActionsBar';
import { PrePdfSummary } from '@/components/reports/PrePdfSummary';
import { ReportPreviewModal } from '@/components/reports/ReportPreviewModal';
import { TenantSignatureScreen } from '@/components/reports/TenantSignatureScreen';
import { SearchOverlay } from '@/components/reports/SearchOverlay';
import type { CategoryGroup } from '@/components/reports/reportDetailConstants';

type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'sent';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const { profile } = useAuth();
  const { isOpen: menuOpen, open: openMenu, close: closeMenu } = useSideMenu();

  const {
    report,
    defects,
    isLoading,
    error: hasError,
    refetch,
  } = useReport(id);

  // Delivery reports → checklist is the main page
  useEffect(() => {
    if (report?.reportType === 'delivery' && id) {
      router.replace(`/(app)/reports/${id}/checklist`);
    }
  }, [report?.reportType, id, router]);

  // Refetch when screen regains focus (e.g., after adding a defect)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );
  const [_pdfUri, setPdfUri] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showTenantSignature, setShowTenantSignature] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfAction, setPdfAction] = useState<'generate' | 'share'>('generate');
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [alertMessage, setAlertMessage] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const { generatePdf, sharePdf } = usePdfGeneration(
    (msg) => showToast(msg, 'success'),
    (msg) => showToast(msg, 'error')
  );

  const {
    isUpdating: isStatusUpdating,
    markCompleted,
    reopenForEditing,
    finalizeFromDraft,
    pendingAction: statusAction,
    dismissAction: dismissStatusAction,
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
    errorMessage: signatureError,
    clearError: clearSignatureError,
  } = useSignature();

  const { updateReviewStatus, isUpdating: isReviewUpdating } =
    useDefectReviewStatus(id);

  // Iron Rule: PDF generator reads all inspector/org data from snapshot columns.

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

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleDeleteDefect = useCallback(
    (defectId: string) => {
      setConfirmAction({
        title: 'מחיקת ממצא',
        message: 'למחוק את הממצא? פעולה זו אינה הפיכה.',
        onConfirm: async () => {
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
            setAlertMessage({
              title: 'שגיאה',
              message: 'לא הצלחנו למחוק את הממצא. נסה שוב.',
            });
          }
        },
      });
    },
    [refetch]
  );

  const navigateToAddDefect = useCallback(
    (category?: string) => {
      console.warn(
        '[ReportDetail] navigateToAddDefect called with category:',
        category
      );
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      const path = `/(app)/reports/${id}/add-defect` as const;
      console.warn('[ReportDetail] navigating to path:', path);
      if (category) {
        router.push({ pathname: path, params: { category } });
      } else {
        router.push(path);
      }
    },
    [id, router]
  );

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

  // Called from inside ReportPreviewModal — must close preview first to
  // avoid two React Native Modals stacking (BUG-02).
  const handleGeneratePdfFromPreview = useCallback(() => {
    setShowPreview(false);
    // Defer to next tick so the preview finishes its close animation
    // before the summary sheet mounts.
    setTimeout(() => {
      handleGeneratePdf();
    }, 0);
  }, [handleGeneratePdf]);

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
      await sharePdf(id);
    } else {
      const uri = await generatePdf(id);
      if (uri) setPdfUri(uri);
    }
  }, [id, pdfAction, profile, generatePdf, sharePdf, showToast]);

  const handleContinueToSignature = useCallback(async () => {
    if (!id) return;
    const existing = await getTenantSignature(id);
    if (existing) {
      showToast('חתימת דייר קיימת', 'info');
      setShowSummary(false);
      if (pdfAction === 'share') {
        await sharePdf(id);
      } else {
        const uri = await generatePdf(id);
        if (uri) setPdfUri(uri);
      }
      return;
    }
    setShowSummary(false);
    setShowTenantSignature(true);
  }, [id, pdfAction, getTenantSignature, generatePdf, sharePdf, showToast]);

  const handleTenantSign = useCallback(
    async (name: string, base64Png: string) => {
      if (!id) return;
      await saveTenantSignature(id, name, base64Png);
      setShowTenantSignature(false);
      if (pdfAction === 'share') {
        await sharePdf(id);
      } else {
        const uri = await generatePdf(id);
        if (uri) setPdfUri(uri);
      }
    },
    [id, pdfAction, saveTenantSignature, generatePdf, sharePdf]
  );

  const handleStatusChange = useCallback(
    (newStatus: ReportStatus) => {
      if (!id || !report) return;
      if (newStatus === 'completed') {
        markCompleted(id);
      } else if (report.status === 'completed' && newStatus === 'in_progress') {
        reopenForEditing(id);
      } else if (report.status === 'draft' && newStatus === 'in_progress') {
        // Draft → in_progress: billing moment with confirmation
        finalizeFromDraft({
          reportId: id,
          userId: profile?.id ?? '',
          organizationId: profile?.organizationId ?? '',
        });
      }
      // in_progress → draft: blocked (one-way transition)
    },
    [id, report, profile, markCompleted, reopenForEditing, finalizeFromDraft]
  );

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
        onMenu={openMenu}
        onStatusChange={handleStatusChange}
        totalFindings={defects.length}
        totalCost={defects.reduce((sum, d) => sum + (d.cost ?? 0), 0)}
        activeCategories={
          categoryGroups.filter((g) => g.defects.length > 0).length
        }
        totalCategories={categoryGroups.length}
        onPreview={() => setShowPreview(true)}
        onShare={handleSharePdf}
        onSettings={
          report?.reportType === 'delivery'
            ? () => showToast('הגדרות דוח — בקרוב', 'info')
            : undefined
        }
        onDownload={handleGeneratePdf}
        roundNumber={report?.roundNumber ?? 1}
        reportType={report?.reportType}
        inheritedReviewedCount={
          defects.filter(
            (d) =>
              d.source === 'inherited' && d.reviewStatus !== 'pending_review'
          ).length
        }
        inheritedTotalCount={
          defects.filter((d) => d.source === 'inherited').length
        }
        onViewPreviousRound={
          report?.previousRoundId
            ? () =>
                router.push(`/(app)/reports/${report.previousRoundId}` as const)
            : undefined
        }
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
            onPress={() => router.replace('/(app)/reports')}
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
            contentContainerStyle={{ paddingBottom: 96 }}
          >
            {/* Categories — grouped accordion, DS: padding 12px 16px 0, gap 10 */}
            <View
              style={{
                padding: 12,
                paddingHorizontal: 16,
                paddingTop: 12,
                gap: 10,
              }}
            >
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
                    onReviewStatusChange={updateReviewStatus}
                    isReviewUpdating={isReviewUpdating}
                  />
                ))
              )}
            </View>
          </ScrollView>

          {/* Bottom action bar: search + add defect */}
          <ReportActionsBar
            bottomInset={insets.bottom}
            onAddDefect={() => navigateToAddDefect()}
            onSearch={() => setShowSearch(true)}
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

          {/* Search overlay */}
          {showSearch && (
            <SearchOverlay
              defects={defects}
              onSelect={(defectId) => {
                setShowSearch(false);
                // Open the category containing this defect so the user can see it
                const defect = defects.find((d) => d.id === defectId);
                if (defect?.category) {
                  setOpenCategories((prev) => ({
                    ...prev,
                    [defect.category as string]: true,
                  }));
                }
              }}
              onClose={() => setShowSearch(false)}
            />
          )}

          {/* PDF Preview modal */}
          {id && (
            <ReportPreviewModal
              visible={showPreview}
              onClose={() => setShowPreview(false)}
              onGeneratePdf={handleGeneratePdfFromPreview}
              reportId={id}
            />
          )}
        </>
      )}

      {/* Confirmation modal (replaces Alert.alert for cross-platform) */}
      <Modal
        visible={!!confirmAction}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmAction(null)}
      >
        <Pressable
          onPress={() => setConfirmAction(null)}
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
              {confirmAction?.title}
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
              {confirmAction?.message}
            </Text>
            <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
              <Pressable
                onPress={() => {
                  confirmAction?.onConfirm();
                  setConfirmAction(null);
                }}
                style={{
                  flex: 1,
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
                  אישור
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setConfirmAction(null)}
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

      {/* Info/error alert modal (replaces Alert.alert for cross-platform) */}
      <Modal
        visible={!!alertMessage}
        transparent
        animationType="fade"
        onRequestClose={() => setAlertMessage(null)}
      >
        <Pressable
          onPress={() => setAlertMessage(null)}
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
              {alertMessage?.title}
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
              {alertMessage?.message}
            </Text>
            <Pressable
              onPress={() => setAlertMessage(null)}
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

      {/* Signature error modal */}
      <Modal
        visible={!!signatureError}
        transparent
        animationType="fade"
        onRequestClose={clearSignatureError}
      >
        <Pressable
          onPress={clearSignatureError}
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
              {signatureError}
            </Text>
            <Pressable
              onPress={clearSignatureError}
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

      {/* Status action confirmation modal (from useReportStatus) */}
      <Modal
        visible={!!statusAction}
        transparent
        animationType="fade"
        onRequestClose={dismissStatusAction}
      >
        <Pressable
          onPress={dismissStatusAction}
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
              {statusAction?.title}
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
              {statusAction?.message}
            </Text>
            <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
              <Pressable
                onPress={() => {
                  statusAction?.onConfirm();
                }}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: statusAction?.destructive
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
                  {statusAction?.confirmLabel ?? 'אישור'}
                </Text>
              </Pressable>
              <Pressable
                onPress={dismissStatusAction}
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

      <SideMenu visible={menuOpen} onClose={closeMenu} />
    </View>
  );
}
