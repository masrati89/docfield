import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { StatusBadge } from './StatusBadge';

type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'sent';

interface ReportHeaderBarProps {
  subtitle: string;
  topInset: number;
  status: ReportStatus;
  isStatusUpdating: boolean;
  onBack: () => void;
  onStatusChange: (newStatus: ReportStatus) => void;
}

export function ReportHeaderBar({
  subtitle,
  topInset,
  status,
  isStatusUpdating,
  onBack,
  onStatusChange,
}: ReportHeaderBarProps) {
  return (
    <View
      style={{
        backgroundColor: COLORS.primary[700],
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
          {/* Back button */}
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onBack();
            }}
            style={{
              padding: 4,
            }}
          >
            <Feather name="chevron-right" size={24} color={COLORS.white} />
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
              <StatusBadge
                status={status}
                isUpdating={isStatusUpdating}
                onStatusChange={onStatusChange}
              />
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
    </View>
  );
}
