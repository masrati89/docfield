import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { PROFESSION_LABELS } from '@infield/shared';
import type { ProfessionValue } from '@infield/shared';

// --- Types ---

interface ProfileSectionProps {
  fullName: string | undefined;
  email: string | undefined;
  role: string | undefined;
  profession: ProfessionValue | undefined;
  organizationName: string | undefined;
}

// --- Helpers ---

function getRoleLabel(role: string | undefined): string {
  if (role === 'admin') return 'מנהל';
  if (role === 'project_manager') return 'מנהל פרויקט';
  return 'מפקח';
}

function getInitial(name: string | undefined): string {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

// --- Component ---

export function ProfileSection({
  fullName,
  email,
  role,
  profession,
  organizationName,
}: ProfileSectionProps) {
  return (
    <Animated.View
      entering={FadeInUp.delay(100).duration(400)}
      className="mx-[20px] mb-[24px] bg-cream-100 rounded-[14px] p-[20px] border border-cream-200"
    >
      {/* Avatar + Name + Role */}
      <View className="flex-row items-center mb-[16px]">
        <View
          style={{ backgroundColor: COLORS.primary[500] }}
          className="w-[40px] h-[40px] rounded-full items-center justify-center"
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 18,
              fontFamily: 'Rubik-SemiBold',
            }}
          >
            {getInitial(fullName)}
          </Text>
        </View>
        <View className="flex-1 me-[12px]">
          <Text className="text-[18px] font-rubik-semibold text-neutral-800 text-right">
            {fullName ?? '---'}
          </Text>
          <Text className="text-[14px] font-rubik text-neutral-500 text-right mt-[2px]">
            {profession ? PROFESSION_LABELS[profession] : getRoleLabel(role)}
          </Text>
        </View>
      </View>

      {/* Email (read-only) */}
      <View className="mb-[12px]">
        <Text className="text-[13px] font-rubik text-neutral-400 text-right mb-[4px]">
          אימייל
        </Text>
        <Text
          className="text-[15px] font-rubik text-neutral-500 text-right"
          style={{ direction: 'ltr' }}
        >
          {email ?? '---'}
        </Text>
      </View>

      {/* Organization (read-only) */}
      <View>
        <Text className="text-[13px] font-rubik text-neutral-400 text-right mb-[4px]">
          ארגון
        </Text>
        <Text className="text-[15px] font-rubik text-neutral-700 text-right">
          {organizationName ?? '---'}
        </Text>
      </View>
    </Animated.View>
  );
}
