import { useCallback } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useAuth } from '@/contexts/AuthContext';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import {
  ProfileSection,
  ChangePasswordSection,
  PreferencesSection,
  SignatureStampSection,
  InspectorProfileSection,
  StatisticsSection,
  InfoSection,
  SignOutButton,
} from '@/components/settings';

// --- Screen ---

export default function SettingsScreen() {
  const { user, profile, signOut } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const handlePasswordSuccess = useCallback(() => {
    showToast('הסיסמה עודכנה בהצלחה', 'success');
  }, [showToast]);

  const handleError = useCallback(
    (message: string) => {
      showToast(message, 'error');
    },
    [showToast]
  );

  const handleComingSoon = useCallback(() => {
    showToast('בקרוב', 'info');
  }, [showToast]);

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={!!toast}
          onDismiss={hideToast}
        />
      )}

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInUp.duration(400)}
            className="px-[20px] pt-[16px] pb-[24px]"
          >
            <Text className="text-[28px] font-rubik-bold text-neutral-800 text-right">
              הגדרות
            </Text>
          </Animated.View>

          {/* 1. Profile */}
          <ProfileSection
            fullName={profile?.fullName}
            email={user?.email}
            role={profile?.role}
            profession={profile?.profession}
            organizationId={profile?.organizationId}
          />

          {/* Divider */}
          <View className="mx-[20px] h-[1px] bg-cream-200 mb-[24px]" />

          {/* 2. Security (Change password) */}
          <ChangePasswordSection
            userEmail={user?.email ?? ''}
            onSuccess={handlePasswordSuccess}
            onError={handleError}
          />

          {/* Divider */}
          <View className="mx-[20px] h-[1px] bg-cream-200 mb-[24px]" />

          {/* 3. Preferences */}
          <PreferencesSection />

          {/* Divider */}
          <View className="mx-[20px] h-[1px] bg-cream-200 mb-[24px]" />

          {/* 3.5 Signature & Stamp */}
          <SignatureStampSection
            onSuccess={(msg) => showToast(msg, 'success')}
            onError={(msg) => showToast(msg, 'error')}
          />

          {/* Divider */}
          <View className="mx-[20px] h-[1px] bg-cream-200 mb-[24px]" />

          {/* 4. Inspector Profile */}
          <InspectorProfileSection />

          {/* Divider */}
          <View className="mx-[20px] h-[1px] bg-cream-200 mb-[24px]" />

          {/* 5. Statistics */}
          <StatisticsSection organizationId={profile?.organizationId} />

          {/* Divider */}
          <View className="mx-[20px] h-[1px] bg-cream-200 mb-[24px]" />

          {/* 6. Info */}
          <InfoSection onComingSoon={handleComingSoon} />

          {/* Divider */}
          <View className="mx-[20px] h-[1px] bg-cream-200 mb-[24px]" />

          {/* 5. Sign out */}
          <SignOutButton onSignOut={signOut} onError={handleError} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
