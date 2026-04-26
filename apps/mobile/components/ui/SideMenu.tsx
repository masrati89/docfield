import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, Platform, Modal } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from '@/lib/haptics';
import { useRouter } from 'expo-router';

import { COLORS } from '@infield/ui';
import { useAuth } from '@/contexts/AuthContext';
import { PressableScale } from './PressableScale';

// --- Constants ---

const MENU_WIDTH = 280;

// --- Types ---

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItemData {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  route: string | null;
  toastMessage?: string;
}

const MENU_ITEMS: MenuItemData[] = [
  { label: 'דאשבורד', icon: 'home', route: '/(app)' },
  { label: 'הדוחות שלי', icon: 'file-text', route: '/(app)/reports' },
  { label: 'פרויקטים', icon: 'folder', route: '/(app)/projects' },
  { label: 'מאגר ממצאים', icon: 'book-open', route: '/(app)/library' },
  { label: 'הגדרות', icon: 'settings', route: '/(app)/settings' },
];

// --- Component ---

export function SideMenu({ visible, onClose }: SideMenuProps) {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleMenuPress = useCallback(
    (item: MenuItemData) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      if (item.toastMessage) {
        onClose();
        return;
      }

      if (item.route) {
        onClose();
        setTimeout(() => {
          router.push(item.route as never);
        }, 100);
      }
    },
    [onClose, router]
  );

  const handleSignOut = useCallback(() => {
    onClose();
    setTimeout(async () => {
      await signOut();
    }, 200);
  }, [onClose, signOut]);

  const avatarLetter = profile?.fullName?.charAt(0) ?? '?';
  const planLabel = 'חינם';

  // Keep modal mounted during exit animation so SlideOutRight can play
  const [showContent, setShowContent] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      // Small delay to ensure Modal is mounted before animating content in
      requestAnimationFrame(() => setShowContent(true));
    } else if (showContent) {
      // Unmount content to trigger exiting animations
      setShowContent(false);
      // Wait for exit animation to finish, then hide modal
      const timer = setTimeout(() => setModalVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!modalVisible) return null;

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      {showContent && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(260)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(60,54,42,0.5)',
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>
      )}

      {/* Menu Panel — slides in from the right (RTL layout) */}
      {showContent && (
        <Animated.View
          entering={SlideInRight.duration(320).springify()}
          exiting={SlideOutRight.duration(260)}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: MENU_WIDTH,
            backgroundColor: COLORS.cream[50],
            shadowColor: 'rgb(20,19,17)',
            shadowOffset: { width: -4, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 20,
          }}
        >
          {/* Close Button */}
          <View
            style={{
              paddingTop: insets.top + 12,
              paddingHorizontal: 16,
              paddingBottom: 8,
            }}
          >
            <PressableScale
              onPress={onClose}
              accessibilityLabel="סגור תפריט"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.cream[100],
                borderWidth: 1,
                borderColor: COLORS.cream[200],
              }}
            >
              <Feather name="x" size={20} color={COLORS.neutral[600]} />
            </PressableScale>
          </View>

          {/* User Info Section */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: 24,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.cream[200],
            }}
          >
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {/* Avatar */}
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: COLORS.primary[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Rubik-Bold',
                    color: COLORS.white,
                  }}
                >
                  {avatarLetter}
                </Text>
              </View>

              {/* Name + Plan */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Rubik-SemiBold',
                    color: COLORS.neutral[800],
                    textAlign: 'right',
                  }}
                  numberOfLines={1}
                >
                  {profile?.fullName ?? 'משתמש'}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Rubik-Regular',
                    color: COLORS.neutral[500],
                    textAlign: 'right',
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                >
                  {planLabel}
                </Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View style={{ paddingTop: 8, flex: 1 }}>
            {MENU_ITEMS.map((item) => (
              <MenuItem
                key={item.label}
                item={item}
                onPress={() => handleMenuPress(item)}
              />
            ))}
          </View>

          {/* Sign Out */}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: COLORS.cream[200],
              paddingBottom: Math.max(insets.bottom, 20),
            }}
          >
            <PressableScale
              onPress={handleSignOut}
              accessibilityRole="menuitem"
              accessibilityLabel="התנתקות"
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.danger[50],
                }}
              >
                <Feather name="log-out" size={20} color={COLORS.danger[500]} />
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Rubik-Medium',
                  color: COLORS.danger[500],
                  textAlign: 'right',
                  flex: 1,
                }}
              >
                התנתקות
              </Text>
            </PressableScale>
          </View>
        </Animated.View>
      )}
    </Modal>
  );
}

// --- MenuItem Sub-Component ---

interface MenuItemProps {
  item: MenuItemData;
  onPress: () => void;
}

function MenuItem({ item, onPress }: MenuItemProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="menuitem"
      accessibilityLabel={item.label}
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.cream[100],
        }}
      >
        <Feather name={item.icon} size={20} color={COLORS.primary[500]} />
      </View>
      <Text
        style={{
          fontSize: 15,
          fontFamily: 'Rubik-Medium',
          color: COLORS.neutral[700],
          textAlign: 'right',
          flex: 1,
        }}
      >
        {item.label}
      </Text>
    </PressableScale>
  );
}
