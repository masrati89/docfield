import { useCallback, useState } from 'react';
import { Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useAuth } from '@/contexts/AuthContext';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import {
  SettingsTabBar,
  GeneralTab,
  InspectorTab,
  ReportTab,
  ChangePasswordSheet,
} from '@/components/settings';
import type { SettingsTab } from '@/components/settings';

// --- Screen ---

export default function SettingsScreen() {
  const { user, profile, signOut } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [showPasswordSheet, setShowPasswordSheet] = useState(false);

  const handlePasswordSuccess = useCallback(() => {
    showToast('הסיסמה עודכנה בהצלחה', 'success');
  }, [showToast]);

  const handleSuccess = useCallback(
    (message: string) => {
      showToast(message, 'success');
    },
    [showToast]
  );

  const handleError = useCallback(
    (message: string) => {
      showToast(message, 'error');
    },
    [showToast]
  );

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: '#FEFDFB' }}
    >
      <StatusBar style="dark" animated />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={!!toast}
          onDismiss={hideToast}
        />
      )}

      {/* Header */}
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontFamily: 'Rubik-Bold',
            color: '#1f1f1f',
            textAlign: 'right',
          }}
        >
          הגדרות
        </Text>
      </Animated.View>

      {/* Tab bar */}
      <SettingsTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 40,
            paddingTop: 12,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'general' && (
            <GeneralTab
              fullName={profile?.fullName}
              email={user?.email}
              role={profile?.role}
              profession={profile?.profession}
              organizationName={profile?.organizationName}
              onChangePassword={() => setShowPasswordSheet(true)}
              onSignOut={signOut}
              onError={handleError}
            />
          )}

          {activeTab === 'inspector' && (
            <InspectorTab onSuccess={handleSuccess} onError={handleError} />
          )}

          {activeTab === 'report' && (
            <ReportTab onSuccess={handleSuccess} onError={handleError} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Change password bottom sheet */}
      <ChangePasswordSheet
        visible={showPasswordSheet}
        onClose={() => setShowPasswordSheet(false)}
        userEmail={user?.email ?? ''}
        onSuccess={handlePasswordSuccess}
        onError={handleError}
      />
    </SafeAreaView>
  );
}
