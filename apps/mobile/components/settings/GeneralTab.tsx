import { View, Text, Pressable, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';

import { ProfileSection } from './ProfileSection';
import { PreferencesSection } from './PreferencesSection';
import { SignOutButton } from './SignOutButton';

// --- Types ---

interface GeneralTabProps {
  fullName: string | undefined;
  email: string | undefined;
  role: string | undefined;
  profession: import('@infield/shared').ProfessionValue | undefined;
  organizationId: string | undefined;
  onChangePassword: () => void;
  onSignOut: () => Promise<void>;
  onError: (message: string) => void;
}

// --- Component ---

export function GeneralTab({
  fullName,
  email,
  role,
  profession,
  organizationId,
  onChangePassword,
  onSignOut,
  onError,
}: GeneralTabProps) {
  return (
    <View>
      {/* Profile */}
      <ProfileSection
        fullName={fullName}
        email={email}
        role={role}
        profession={profession}
        organizationId={organizationId}
      />

      {/* Divider */}
      <View
        style={{
          marginHorizontal: 20,
          height: 1,
          backgroundColor: COLORS.cream[200],
          marginBottom: 24,
        }}
      />

      {/* Change password row */}
      <Animated.View
        entering={FadeInUp.delay(100).duration(400)}
        style={{ marginHorizontal: 20, marginBottom: 24 }}
      >
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onChangePassword();
          }}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            paddingVertical: 14,
            gap: 10,
          }}
        >
          <Feather name="lock" size={20} color={COLORS.neutral[600]} />
          <Text
            style={{
              flex: 1,
              fontSize: 15,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[700],
              textAlign: 'right',
            }}
          >
            שנה סיסמה
          </Text>
          <Feather name="chevron-left" size={20} color={COLORS.neutral[400]} />
        </Pressable>
      </Animated.View>

      {/* Divider */}
      <View
        style={{
          marginHorizontal: 20,
          height: 1,
          backgroundColor: COLORS.cream[200],
          marginBottom: 24,
        }}
      />

      {/* Preferences */}
      <PreferencesSection />

      {/* Divider */}
      <View
        style={{
          marginHorizontal: 20,
          height: 1,
          backgroundColor: COLORS.cream[200],
          marginBottom: 24,
        }}
      />

      {/* App version */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(400)}
        style={{
          marginHorizontal: 20,
          marginBottom: 24,
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 8,
        }}
      >
        <View
          style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }}
        >
          <Feather name="info" size={20} color={COLORS.neutral[600]} />
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[700],
            }}
          >
            גרסת אפליקציה
          </Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[400],
          }}
        >
          1.0.0
        </Text>
      </Animated.View>

      {/* Divider */}
      <View
        style={{
          marginHorizontal: 20,
          height: 1,
          backgroundColor: COLORS.cream[200],
          marginBottom: 24,
        }}
      />

      {/* Sign out */}
      <SignOutButton onSignOut={onSignOut} onError={onError} />
    </View>
  );
}
