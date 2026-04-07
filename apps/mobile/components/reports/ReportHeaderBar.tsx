import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { COLORS, SHADOWS } from '@infield/ui';
import { StatusBadge } from './StatusBadge';
import {
  STATUS_CONFIG,
  formatDate,
} from '@/components/reports/reportDetailConstants';

type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'sent';

interface ReportHeaderBarProps {
  subtitle: string;
  topInset: number;
  status: ReportStatus;
  isStatusUpdating: boolean;
  onMenu: () => void;
  onStatusChange: (newStatus: ReportStatus) => void;
  // SubHeader props — report meta + 4 action buttons
  reportTitle?: string;
  projectName?: string;
  inspectorName?: string;
  reportDate?: string;
  onPreview?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
  onDownload?: () => void;
}

// --- Action button config (RTL order: download, settings, share, preview) ---
interface ActionBtn {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  handler?: () => void;
}

export function ReportHeaderBar({
  subtitle,
  topInset,
  status,
  isStatusUpdating,
  onMenu,
  onStatusChange,
  reportTitle,
  projectName,
  inspectorName,
  reportDate,
  onPreview,
  onShare,
  onSettings,
  onDownload,
}: ReportHeaderBarProps) {
  const statusConfig = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;

  const actionButtons: ActionBtn[] = [
    { label: 'הורדת דוח', icon: 'download', handler: onDownload },
    { label: 'הגדרות דוח', icon: 'settings', handler: onSettings },
    { label: 'שיתוף', icon: 'share', handler: onShare },
    { label: 'תצוגה מקדימה', icon: 'eye', handler: onPreview },
  ];

  return (
    <View>
      {/* Green gradient header */}
      <LinearGradient
        colors={[COLORS.primary[700], COLORS.primary[600]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: topInset + 8,
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        <Animated.View
          entering={FadeInDown.duration(200)}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {/* Menu button (right in RTL) */}
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                onMenu();
              }}
              style={{
                padding: 4,
              }}
            >
              <Feather name="menu" size={24} color={COLORS.white} />
            </Pressable>
            <View>
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
                    color: COLORS.white,
                    fontFamily: 'Rubik-Bold',
                    letterSpacing: -0.3,
                  }}
                >
                  inField
                </Text>
              </View>
              {subtitle ? (
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.white,
                    opacity: 0.7,
                    fontWeight: '300',
                    fontFamily: 'Rubik-Regular',
                    marginTop: 4,
                  }}
                >
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* SubHeader — 4 action buttons + report meta */}
      <Animated.View
        entering={FadeInDown.delay(50).duration(250)}
        style={{
          marginHorizontal: 12,
          marginTop: 8,
          padding: 14,
          borderRadius: 12,
          backgroundColor: COLORS.cream[50],
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          ...SHADOWS.sm,
        }}
      >
        {/* 4 Action buttons row (RTL) */}
        <View
          style={{
            flexDirection: 'row-reverse',
            gap: 6,
            marginBottom: 12,
          }}
        >
          {actionButtons.map(({ label, icon, handler }) => (
            <Pressable
              key={icon}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                handler?.();
              }}
              style={({ pressed }) => ({
                flex: 1,
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                paddingVertical: 8,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: pressed ? COLORS.primary[200] : COLORS.cream[200],
                backgroundColor: pressed
                  ? COLORS.primary[50]
                  : COLORS.cream[50],
              })}
            >
              <Feather name={icon} size={14} color={COLORS.neutral[600]} />
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'Rubik-Medium',
                  color: COLORS.neutral[600],
                }}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Status badge + report title */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 8,
            marginBottom: 6,
          }}
        >
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 4,
              backgroundColor: statusConfig.bg,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: '500',
                color: statusConfig.text,
                fontFamily: 'Rubik-Medium',
              }}
            >
              {statusConfig.label}
            </Text>
          </View>
          <StatusBadge
            status={status}
            isUpdating={isStatusUpdating}
            onStatusChange={onStatusChange}
          />
          {reportTitle ? (
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.neutral[800],
                fontFamily: 'Rubik-SemiBold',
                textAlign: 'right',
                flex: 1,
              }}
              numberOfLines={1}
            >
              {reportTitle}
            </Text>
          ) : null}
        </View>

        {/* Meta info: project, inspector, date */}
        <View style={{ gap: 2 }}>
          {[
            { label: 'פרויקט:', value: projectName },
            { label: 'בודק:', value: inspectorName },
            {
              label: 'תאריך:',
              value: reportDate ? formatDate(reportDate) : undefined,
            },
          ]
            .filter((m) => m.value)
            .map(({ label, value }) => (
              <View
                key={label}
                style={{ flexDirection: 'row-reverse', gap: 4 }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.neutral[400],
                    fontFamily: 'Rubik-Regular',
                  }}
                >
                  {label}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.neutral[600],
                    fontWeight: '500',
                    fontFamily: 'Rubik-Medium',
                  }}
                >
                  {value}
                </Text>
              </View>
            ))}
        </View>
      </Animated.View>
    </View>
  );
}
