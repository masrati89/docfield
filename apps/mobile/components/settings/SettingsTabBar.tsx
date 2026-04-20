import { View, Text, Pressable, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';

// --- Types ---

export type SettingsTab = 'general' | 'inspector' | 'report';

const SETTINGS_TABS: { key: SettingsTab; label: string }[] = [
  { key: 'general', label: 'כללי' },
  { key: 'inspector', label: 'פרופיל מפקח' },
  { key: 'report', label: 'הגדרות דוח' },
];

interface SettingsTabBarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

// --- Component ---

export function SettingsTabBar({
  activeTab,
  onTabChange,
}: SettingsTabBarProps) {
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cream[200],
      }}
    >
      {SETTINGS_TABS.map((tab) => {
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
              paddingVertical: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderBottomWidth: isActive ? 2 : 0,
              borderBottomColor: isActive ? COLORS.primary[500] : 'transparent',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: isActive ? '500' : '400',
                color: isActive ? COLORS.primary[500] : COLORS.neutral[400],
                fontFamily: isActive ? 'Rubik-Medium' : 'Rubik-Regular',
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
