import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';
import type { ReportInfo } from '@/hooks/useReport';

interface ReportActionsBarProps {
  report: ReportInfo;
  bottomInset: number;
  defectsCount: number;
  isCompleted: boolean;
  isGenerating: boolean;
  isSharing: boolean;
  isStatusUpdating: boolean;
  onStatusAction: () => void;
  onGeneratePdf: () => void;
  onSharePdf: () => void;
  onChecklist: () => void;
  onAddDefect: () => void;
  onCamera: () => void;
  onLibrary: () => void;
}

export function ReportActionsBar({
  report,
  bottomInset,
  defectsCount,
  isCompleted,
  isGenerating,
  isSharing,
  isStatusUpdating,
  onStatusAction,
  onGeneratePdf,
  onSharePdf,
  onChecklist,
  onAddDefect,
  onCamera,
  onLibrary,
}: ReportActionsBarProps) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.cream[50],
        borderTopWidth: 1,
        borderTopColor: COLORS.cream[200],
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: Math.max(bottomInset, 24),
        gap: 8,
        ...SHADOWS.md,
      }}
    >
      {/* Status action bar */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* Status transition button */}
        {report.status === 'draft' && (
          <Pressable
            onPress={onStatusAction}
            disabled={isStatusUpdating}
            style={{
              flex: 1,
              height: 38,
              borderRadius: BORDER_RADIUS.md,
              backgroundColor: COLORS.warning[500],
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              opacity: isStatusUpdating ? 0.5 : 1,
            }}
          >
            <Feather name="play" size={16} color={COLORS.white} />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: COLORS.white,
                fontFamily: 'Rubik-SemiBold',
              }}
            >
              התחל עבודה
            </Text>
          </Pressable>
        )}
        {report.status === 'in_progress' && (
          <Pressable
            onPress={onStatusAction}
            disabled={isStatusUpdating}
            style={{
              flex: 1,
              height: 38,
              borderRadius: BORDER_RADIUS.md,
              backgroundColor: COLORS.success[500],
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              opacity: isStatusUpdating ? 0.5 : 1,
            }}
          >
            <Feather name="check-circle" size={16} color={COLORS.white} />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: COLORS.white,
                fontFamily: 'Rubik-SemiBold',
              }}
            >
              סמן כהושלם
            </Text>
          </Pressable>
        )}
        {report.status === 'completed' && (
          <Pressable
            onPress={onStatusAction}
            disabled={isStatusUpdating}
            style={{
              flex: 1,
              height: 38,
              borderRadius: BORDER_RADIUS.md,
              backgroundColor: COLORS.cream[100],
              borderWidth: 1,
              borderColor: COLORS.cream[300],
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              opacity: isStatusUpdating ? 0.5 : 1,
            }}
          >
            <Feather name="edit-3" size={16} color={COLORS.neutral[600]} />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: COLORS.neutral[600],
                fontFamily: 'Rubik-SemiBold',
              }}
            >
              חזרה לעריכה
            </Text>
          </Pressable>
        )}

        {/* PDF download */}
        <Pressable
          onPress={onGeneratePdf}
          disabled={isGenerating}
          style={{
            width: 38,
            height: 38,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            backgroundColor: COLORS.cream[50],
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isGenerating ? 0.5 : 1,
          }}
        >
          <Feather name="download" size={20} color={COLORS.primary[500]} />
        </Pressable>

        {/* Share */}
        <Pressable
          onPress={onSharePdf}
          disabled={isSharing}
          style={{
            width: 38,
            height: 38,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            backgroundColor: COLORS.cream[50],
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isSharing ? 0.5 : 1,
          }}
        >
          <Feather name="share-2" size={20} color={COLORS.primary[500]} />
        </Pressable>
      </View>

      {/* Checklist button */}
      {!isCompleted && (
        <Pressable
          onPress={onChecklist}
          style={{
            height: 40,
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: COLORS.gold[100],
            borderWidth: 1,
            borderColor: COLORS.gold[300],
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Feather name="check-square" size={16} color={COLORS.gold[700]} />
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: COLORS.gold[700],
              fontFamily: 'Rubik-SemiBold',
            }}
          >
            {defectsCount > 0 ? 'המשך בדיקה' : 'התחל בדיקה'}
          </Text>
        </Pressable>
      )}

      {/* Add defect row */}
      {!isCompleted && (
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {/* Add defect — primary */}
          <Pressable
            onPress={onAddDefect}
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
            <Feather name="plus" size={20} color={COLORS.white} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.white,
                fontFamily: 'Rubik-SemiBold',
              }}
            >
              הוסף ממצא
            </Text>
          </Pressable>

          {/* Camera button */}
          <Pressable
            onPress={onCamera}
            style={{
              width: 44,
              height: 44,
              borderRadius: BORDER_RADIUS.md,
              borderWidth: 1,
              borderColor: COLORS.cream[200],
              backgroundColor: COLORS.cream[50],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="camera" size={20} color={COLORS.neutral[500]} />
          </Pressable>

          {/* Library button */}
          <Pressable
            onPress={onLibrary}
            style={{
              width: 44,
              height: 44,
              borderRadius: BORDER_RADIUS.md,
              borderWidth: 1,
              borderColor: COLORS.cream[200],
              backgroundColor: COLORS.cream[50],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="database" size={20} color={COLORS.neutral[500]} />
          </Pressable>
        </View>
      )}
    </View>
  );
}
