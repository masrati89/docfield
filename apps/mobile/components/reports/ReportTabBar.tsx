import { View, Text, Pressable, Platform } from 'react-native';
import * as Haptics from '@/lib/haptics';

import { COLORS } from '@infield/ui';
import { TABS } from '@/components/reports/reportDetailConstants';
import type { TabKey } from '@/components/reports/reportDetailConstants';

interface ReportTabBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  shortagesCount: number;
}

export function ReportTabBar({
  activeTab,
  onTabChange,
  shortagesCount,
}: ReportTabBarProps) {
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        marginHorizontal: 12,
        marginTop: 8,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        backgroundColor: COLORS.cream[100],
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onTabChange(tab.key);
            }}
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 4,
              backgroundColor: isActive ? COLORS.cream[50] : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: isActive ? '600' : '400',
                color: isActive ? COLORS.primary[700] : COLORS.neutral[400],
                fontFamily: isActive ? 'Rubik-SemiBold' : 'Rubik-Regular',
              }}
            >
              {tab.label}
            </Text>
            {tab.key === 'shortages' && shortagesCount > 0 && (
              <View
                style={{
                  minWidth: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: COLORS.danger[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: COLORS.white,
                    fontFamily: 'Rubik-Bold',
                  }}
                >
                  {shortagesCount}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
