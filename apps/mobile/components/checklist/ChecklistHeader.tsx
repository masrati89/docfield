import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';
import { SkeletonBlock } from '@/components/ui';

// --- Types ---

interface ChecklistHeaderProps {
  isLoading: boolean;
  reportTitle: string;
  projectName: string;
  tenantName: string;
  reportDate: string;
  checked: number;
  total: number;
  defectCount: number;
  roomCount: number;
  onPreview?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
  onDownload?: () => void;
  onMenuPress?: () => void;
}

// --- Component ---

export function ChecklistHeader({
  isLoading,
  checked,
  total,
  defectCount,
  onMenuPress,
}: ChecklistHeaderProps) {
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

  if (isLoading) {
    return (
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 8,
        }}
      >
        <SkeletonBlock width="60%" height={18} />
        <SkeletonBlock width="40%" height={14} />
        <SkeletonBlock width="100%" height={6} />
      </View>
    );
  }

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 14,
      }}
    >
      {/* Metrics row */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left group (RTL leading): stats */}
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Checked / Total */}
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'baseline',
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: COLORS.white,
                fontFamily: 'Rubik-Bold',
              }}
            >
              {checked}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'Rubik-Regular',
              }}
            >
              / {total} נבדקו
            </Text>
          </View>

          {/* Divider */}
          <View
            style={{
              width: 1,
              height: 16,
              backgroundColor: 'rgba(255,255,255,0.3)',
            }}
          />

          {/* Defects */}
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Feather
              name="alert-triangle"
              size={14}
              color="rgba(255,255,255,0.7)"
            />
            <Text
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'Rubik-Regular',
              }}
            >
              {defectCount} ממצאים
            </Text>
          </View>

          {/* Divider */}
          <View
            style={{
              width: 1,
              height: 16,
              backgroundColor: 'rgba(255,255,255,0.3)',
            }}
          />

          {/* Progress % */}
          <Text
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'Rubik-Medium',
              fontWeight: '500',
            }}
          >
            {pct}%
          </Text>
        </View>

        {/* 3-dot menu */}
        {onMenuPress && (
          <Pressable
            onPress={onMenuPress}
            hitSlop={8}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.15)',
            }}
          >
            <Feather name="more-vertical" size={18} color={COLORS.white} />
          </Pressable>
        )}
      </View>

      {/* Progress bar */}
      <View
        style={{
          height: 6,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 3,
          overflow: 'hidden',
          marginTop: 10,
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${pct}%`,
            backgroundColor: COLORS.white,
            borderRadius: 3,
          }}
        />
      </View>
    </View>
  );
}
