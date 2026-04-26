import { View, Text, Pressable, Platform, Linking } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from '@/lib/haptics';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';

import { ProfileSection } from './ProfileSection';
import { PreferencesSection } from './PreferencesSection';
import { SignOutButton } from './SignOutButton';
import { useDeleteAccount } from '@/hooks/useDeleteAccount';

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

      {/* Manage Subscription */}
      <ManagedSubscriptionButton />

      {/* Delete Account */}
      <DeleteAccountButton />

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

// --- Manage Subscription Button ---

function ManagedSubscriptionButton() {
  const handlePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const url =
      Platform.OS === 'ios'
        ? 'itms-apps://apps.apple.com/account/subscriptions'
        : 'https://play.google.com/store/account/subscriptions';
    await Linking.openURL(url);
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(100).duration(400)}
      style={{
        marginHorizontal: 20,
        marginBottom: 12,
      }}
    >
      <Pressable
        onPress={handlePress}
        style={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[200],
        }}
      >
        <View
          style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }}
        >
          <Feather name="credit-card" size={20} color={COLORS.neutral[600]} />
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[700],
            }}
          >
            ניהול מנוי
          </Text>
        </View>
        <Feather name="chevron-left" size={16} color={COLORS.neutral[400]} />
      </Pressable>
    </Animated.View>
  );
}

// --- Delete Account Button ---

function DeleteAccountButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [step, setStep] = useState<'button' | 'confirm1' | 'confirm2'>(
    'button'
  );
  const { isDeleting, deleteAccount } = useDeleteAccount();

  const handlePressDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowConfirm(true);
    setStep('confirm1');
  };

  const handleConfirmStep1 = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep('confirm2');
    setConfirmText('');
  };

  const handleConfirmStep2 = async () => {
    if (confirmText.trim() !== 'מחק') {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await deleteAccount();
  };

  if (showConfirm && step === 'confirm1') {
    return (
      <Animated.View
        entering={FadeInUp.duration(300)}
        style={{
          marginHorizontal: 20,
          marginBottom: 12,
          backgroundColor: COLORS.danger[50],
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: COLORS.danger[200],
        }}
      >
        <View
          style={{ flexDirection: 'row-reverse', gap: 8, marginBottom: 12 }}
        >
          <Feather name="alert-circle" size={20} color={COLORS.danger[500]} />
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              fontFamily: 'Rubik-Medium',
              color: COLORS.danger[700],
              textAlign: 'right',
            }}
          >
            מחיקת חשבון
          </Text>
        </View>

        <Text
          style={{
            fontSize: 13,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[700],
            marginBottom: 16,
            textAlign: 'right',
            lineHeight: 20,
          }}
        >
          פעולה זו בלתי הפיכה. כל הדוחות, התמונות, והחתימות שלך יימחקו לצמיתות.
        </Text>

        <View style={{ gap: 8 }}>
          <Pressable
            onPress={handleConfirmStep1}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              backgroundColor: COLORS.danger[500],
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Medium',
                color: COLORS.white,
              }}
            >
              המשך
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowConfirm(false)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[600],
              }}
            >
              ביטול
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  }

  if (showConfirm && step === 'confirm2') {
    return (
      <Animated.View
        entering={FadeInUp.duration(300)}
        style={{
          marginHorizontal: 20,
          marginBottom: 12,
          backgroundColor: COLORS.danger[50],
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: COLORS.danger[200],
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[700],
            marginBottom: 12,
            textAlign: 'right',
          }}
        >
          הקלד את המילה "מחק" לאישור סופי:
        </Text>

        <View
          style={{
            borderWidth: 1,
            borderColor: COLORS.neutral[300],
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            marginBottom: 12,
            backgroundColor: COLORS.white,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Rubik-Regular',
              color: confirmText ? COLORS.neutral[800] : COLORS.neutral[400],
              textAlign: 'right',
            }}
          >
            {confirmText || 'הקלד כאן...'}
          </Text>
        </View>

        <View style={{ gap: 8 }}>
          <Pressable
            disabled={confirmText.trim() !== 'מחק' || isDeleting}
            onPress={handleConfirmStep2}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              backgroundColor:
                confirmText.trim() === 'מחק'
                  ? COLORS.danger[500]
                  : COLORS.danger[200],
              borderRadius: 8,
              alignItems: 'center',
              opacity: confirmText.trim() === 'מחק' ? 1 : 0.5,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Medium',
                color: COLORS.white,
              }}
            >
              {isDeleting ? 'מוחק...' : 'מחק חשבון לצמיתות'}
            </Text>
          </Pressable>
          <Pressable
            disabled={isDeleting}
            onPress={() => {
              setShowConfirm(false);
              setStep('button');
              setConfirmText('');
            }}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[600],
              }}
            >
              ביטול
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInUp.delay(50).duration(400)}
      style={{
        marginHorizontal: 20,
        marginBottom: 12,
      }}
    >
      <Pressable
        onPress={handlePressDelete}
        style={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[200],
        }}
      >
        <View
          style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }}
        >
          <Feather name="trash-2" size={20} color={COLORS.danger[500]} />
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Rubik-Regular',
              color: COLORS.danger[700],
            }}
          >
            מחיקת חשבון
          </Text>
        </View>
        <Feather name="chevron-left" size={16} color={COLORS.danger[500]} />
      </Pressable>
    </Animated.View>
  );
}
