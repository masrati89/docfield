import { View, Text, Pressable, Platform } from 'react-native';
import { Link } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from '@/lib/haptics';
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
  organizationName: string | undefined;
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
  organizationName,
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
        organizationName={organizationName}
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

      {/* Legal links */}
      <View
        style={{
          marginHorizontal: 20,
          flexDirection: 'row-reverse',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Link href="/(app)/legal/privacy" asChild>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Rubik-Regular',
                color: COLORS.primary[500],
                textDecorationLine: 'underline',
              }}
            >
              מדיניות הפרטיות
            </Text>
          </Pressable>
        </Link>
        <Text style={{ color: COLORS.cream[300] }}>•</Text>
        <Link href="/(app)/legal/terms" asChild>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Rubik-Regular',
                color: COLORS.primary[500],
                textDecorationLine: 'underline',
              }}
            >
              תנאי השימוש
            </Text>
          </Pressable>
        </Link>
      </View>

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
