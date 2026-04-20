import { useCallback, useState } from 'react';
import { View, Text, Switch, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// --- Component ---

export function PreferencesSection() {
  const { profile, refreshProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const notificationsEnabled =
    profile?.preferences?.notificationsEnabled ?? true;

  const handleToggleNotifications = useCallback(
    async (value: boolean) => {
      if (!profile || isSaving) return;
      setIsSaving(true);

      try {
        // Merge with existing preferences to preserve other settings
        const updatedPreferences = {
          ...profile.preferences,
          notificationsEnabled: value,
        };

        const { error } = await supabase
          .from('users')
          .update({ preferences: updatedPreferences })
          .eq('id', profile.id);

        if (error) throw error;

        await refreshProfile();
      } catch {
        // Silent fail — preference is non-critical
      } finally {
        setIsSaving(false);
      }
    },
    [profile, isSaving, refreshProfile]
  );

  return (
    <Animated.View
      entering={FadeInUp.delay(300).duration(400)}
      className="mx-[20px] mb-[24px]"
    >
      <Text className="text-[18px] font-rubik-semibold text-neutral-800 text-right mb-[16px]">
        העדפות
      </Text>

      {/* Language (locked for MVP) */}
      <View className="flex-row items-center justify-between py-[14px] border-b border-cream-200">
        <View className="flex-row items-center gap-[8px]">
          <Feather name="globe" size={20} color={COLORS.neutral[400]} />
          <Text className="text-[15px] font-rubik text-neutral-500">שפה</Text>
        </View>
        <Text className="text-[14px] font-rubik text-neutral-400">עברית</Text>
      </View>

      {/* Notifications toggle */}
      <View className="flex-row items-center justify-between py-[14px]">
        <View className="flex-row items-center gap-[8px]">
          <Feather name="bell" size={20} color={COLORS.neutral[600]} />
          <Text className="text-[15px] font-rubik text-neutral-700">
            התראות
          </Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
          disabled={isSaving}
          trackColor={{
            false: COLORS.cream[300],
            true: COLORS.primary[200],
          }}
          thumbColor={
            notificationsEnabled
              ? COLORS.primary[500]
              : Platform.OS === 'android'
                ? COLORS.neutral[300]
                : undefined
          }
          ios_backgroundColor={COLORS.cream[300]}
        />
      </View>
    </Animated.View>
  );
}
