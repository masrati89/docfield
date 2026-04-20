import { useState } from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { PressableScale } from '@/components/ui';
import { HeaderDropdownMenu } from './HeaderDropdownMenu';

type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'sent';

const STATUS_LABEL: Record<string, string> = {
  draft: 'טיוטה',
  in_progress: 'בביצוע',
  completed: 'הושלם',
  sent: 'נשלח',
};

interface ReportHeaderBarProps {
  subtitle: string;
  topInset: number;
  status: ReportStatus;
  isStatusUpdating: boolean;
  onMenu: () => void;
  onStatusChange: (newStatus: ReportStatus) => void;
  totalFindings?: number;
  totalCost?: number;
  activeCategories?: number;
  totalCategories?: number;
  onPreview?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
  onDownload?: () => void;
  onManageCategories?: () => void;
  onSaveDraft?: () => void;
}

export function ReportHeaderBar({
  subtitle,
  topInset,
  status,
  onMenu: _onMenu,
  totalFindings = 0,
  totalCost = 0,
  activeCategories = 0,
  totalCategories = 0,
  onPreview,
  onShare,
  onSettings,
  onDownload,
  onManageCategories,
  onSaveDraft,
}: ReportHeaderBarProps) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View>
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
        {/* Top row: back + title + status + 3-dot */}
        <Animated.View
          entering={FadeInDown.duration(200)}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Back button */}
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
            <Feather name="chevron-right" size={18} color="#fff" />
          </PressableScale>

          {/* Title + subtitle */}
          <View style={{ flex: 1 }}>
            {subtitle ? (
              <Text
                style={{
                  fontSize: 11,
                  color: '#fff',
                  opacity: 0.75,
                  fontFamily: 'Rubik-Regular',
                  textAlign: 'right',
                  marginBottom: 2,
                }}
              >
                {subtitle}
              </Text>
            ) : null}
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#fff',
                fontFamily: 'Rubik-Bold',
                letterSpacing: -0.2,
                textAlign: 'right',
              }}
            >
              בדק בית
            </Text>
          </View>

          {/* Status badge */}
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.14)',
              paddingVertical: 4,
              paddingHorizontal: 9,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.18)',
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: '#fff',
                fontFamily: 'Rubik-SemiBold',
              }}
            >
              {STATUS_LABEL[status] ?? 'טיוטה'}
            </Text>
          </View>

          {/* 3-dot menu */}
          <PressableScale
            onPress={() => setMenuVisible(true)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.12)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="more-horizontal" size={18} color="#fff" />
          </PressableScale>
        </Animated.View>

        {/* Summary metrics row */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(250)}
          style={{
            flexDirection: 'row-reverse',
            gap: 12,
            marginTop: 14,
          }}
        >
          {/* Total findings */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: '#fff',
                fontFamily: 'Inter-Bold',
                lineHeight: 22,
              }}
            >
              {totalFindings}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: '#fff',
                opacity: 0.7,
                fontFamily: 'Rubik-Regular',
                marginTop: 2,
              }}
            >
              ממצאים
            </Text>
          </View>

          {/* Divider */}
          <View
            style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.14)' }}
          />

          {/* Total cost */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: '#fff',
                fontFamily: 'Inter-Bold',
                lineHeight: 22,
                writingDirection: 'ltr',
              }}
            >
              ₪{totalCost > 0 ? totalCost.toLocaleString() : '0'}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: '#fff',
                opacity: 0.7,
                fontFamily: 'Rubik-Regular',
                marginTop: 2,
              }}
            >
              סה״כ עלות
            </Text>
          </View>

          {/* Divider */}
          <View
            style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.14)' }}
          />

          {/* Active categories */}
          <View style={{ flex: 1 }}>
            <Text style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '700',
                  color: '#fff',
                  fontFamily: 'Inter-Bold',
                  lineHeight: 22,
                }}
              >
                {activeCategories}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: '#fff',
                  opacity: 0.6,
                  fontFamily: 'Inter-Regular',
                }}
              >
                /{totalCategories}
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: '#fff',
                opacity: 0.7,
                fontFamily: 'Rubik-Regular',
                marginTop: 2,
              }}
            >
              קטגוריות פעילות
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Dropdown menu */}
      <HeaderDropdownMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onPreview={onPreview}
        onDownload={onDownload}
        onSettings={onSettings}
        onManageCategories={onManageCategories}
        onShare={onShare}
        onSaveDraft={onSaveDraft}
      />
    </View>
  );
}
