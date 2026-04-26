import { useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from '@/lib/haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { useReport } from '@/hooks/useReport';
import { useAuth } from '@/contexts/AuthContext';
import { generatePreviewHtml } from '@/lib/pdf/previewHtml';
import { SkeletonBlock } from '@/components/ui';
import type { PdfReportData } from '@/lib/pdf';

// --- Types ---

interface ReportPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  onGeneratePdf?: () => void;
  reportId: string;
}

// --- Build preview data from useReport ---

function buildPreviewData(
  report: ReturnType<typeof useReport>['report'],
  defects: ReturnType<typeof useReport>['defects'],
  inspectorName: string
): PdfReportData | null {
  if (!report) return null;

  return {
    reportType: report.reportType as 'bedek_bait' | 'delivery',
    reportNumber: report.id.slice(0, 8).toUpperCase(),
    reportDate: report.reportDate,
    status: report.status as PdfReportData['status'],
    inspector: { name: inspectorName },
    property: {
      projectName: report.projectName,
      address: report.address ?? undefined,
      apartmentNumber: report.apartmentNumber,
      floor: report.floor ?? undefined,
    },
    client: {
      name: report.tenantName ?? '',
    },
    defects: defects.map((d, idx) => ({
      number: String(idx + 1),
      title: d.description,
      location: d.room ?? '',
      category: d.category ?? '\u05DB\u05DC\u05DC\u05D9',
    })),
    notes: report.notes ?? undefined,
  };
}

// --- Component ---

export function ReportPreviewModal({
  visible,
  onClose,
  onGeneratePdf,
  reportId,
}: ReportPreviewModalProps) {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const { report, defects, isLoading, refetch } = useReport(reportId);

  // Refetch fresh data every time the modal opens
  useEffect(() => {
    if (visible) {
      refetch();
    }
  }, [visible, refetch]);

  const previewData = useMemo(
    () => buildPreviewData(report, defects, profile?.fullName ?? ''),
    [report, defects, profile?.fullName]
  );

  const previewHtml = useMemo(
    () => (previewData ? generatePreviewHtml(previewData) : ''),
    [previewData]
  );

  const handleClose = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  }, [onClose]);

  const handleGenerate = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onGeneratePdf?.();
  }, [onGeneratePdf]);

  // Conditionally require WebView only on native (avoids web issues)
  const WebViewComponent = useMemo(() => {
    if (Platform.OS === 'web') return null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('react-native-webview').default;
    } catch {
      return null;
    }
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
      transparent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(60,54,42,0.6)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            height: '96%',
            backgroundColor: COLORS.cream[50],
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            overflow: 'hidden',
          }}
        >
          {/* Drag handle */}
          <View
            style={{
              alignItems: 'center',
              paddingTop: 8,
              paddingBottom: 4,
            }}
          >
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: COLORS.cream[300],
              }}
            />
          </View>

          {/* Header */}
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.cream[200],
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: '700',
                color: COLORS.neutral[800],
                fontFamily: 'Rubik-Bold',
              }}
            >
              {
                '\u05EA\u05E6\u05D5\u05D2\u05D4 \u05DE\u05E7\u05D3\u05D9\u05DE\u05D4'
              }
            </Text>
            <Pressable
              onPress={handleClose}
              hitSlop={8}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: COLORS.cream[100],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="x" size={20} color={COLORS.neutral[600]} />
            </Pressable>
          </View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            {isLoading ? (
              <View style={{ padding: 16, gap: 12 }}>
                <SkeletonBlock width="100%" height={80} borderRadius={12} />
                <SkeletonBlock width="100%" height={120} borderRadius={10} />
                <SkeletonBlock width="100%" height={60} borderRadius={10} />
              </View>
            ) : WebViewComponent ? (
              <WebViewComponent
                source={{ html: previewHtml, baseUrl: '' }}
                style={{ flex: 1, backgroundColor: COLORS.cream[50] }}
                scrollEnabled
                showsVerticalScrollIndicator
                originWhitelist={['*']}
                allowsInlineMediaPlayback={false}
                cacheEnabled
                textZoom={100}
              />
            ) : (
              // Web fallback: render HTML in an iframe
              <View style={{ flex: 1 }}>
                {Platform.OS === 'web' ? (
                  <iframe
                    srcDoc={previewHtml}
                    style={
                      {
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        backgroundColor: COLORS.cream[50],
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      } as any
                    }
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ActivityIndicator color={COLORS.primary[500]} />
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Footer */}
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: Math.max(insets.bottom, 24),
              borderTopWidth: 1,
              borderTopColor: COLORS.cream[200],
            }}
          >
            {onGeneratePdf && (
              <Pressable
                onPress={handleGenerate}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: BORDER_RADIUS.md,
                  backgroundColor: COLORS.primary[500],
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Feather name="download" size={18} color={COLORS.white} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: COLORS.white,
                    fontFamily: 'Rubik-SemiBold',
                  }}
                >
                  {'\u05D4\u05E4\u05E7 PDF'}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleClose}
              style={{
                flex: onGeneratePdf ? 0 : 1,
                minWidth: onGeneratePdf ? undefined : undefined,
                height: 44,
                paddingHorizontal: onGeneratePdf ? 24 : 0,
                borderRadius: BORDER_RADIUS.md,
                borderWidth: 1,
                borderColor: COLORS.cream[200],
                backgroundColor: COLORS.cream[50],
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: COLORS.neutral[600],
                  fontFamily: 'Rubik-Medium',
                }}
              >
                {'\u05E1\u05D2\u05D5\u05E8'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
