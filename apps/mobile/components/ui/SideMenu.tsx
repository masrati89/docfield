import { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';

// --- Constants ---

const MENU_WIDTH = 280;
const ANIMATION_DURATION_IN = 300;
const ANIMATION_DURATION_OUT = 250;
const SCREEN_WIDTH = Dimensions.get('window').width;

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
  { label: 'מאגר ממצאים', icon: 'book-open', route: '/(app)/library' },
  { label: 'הגדרות', icon: 'settings', route: '/(app)/settings' },
  { label: 'עזרה', icon: 'help-circle', route: null, toastMessage: 'בקרוב' },
];

// --- Component ---

export function SideMenu({ visible, onClose }: SideMenuProps) {
  const { profile } = useAuth();
  const router = useRouter();

  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH - MENU_WIDTH,
        duration: ANIMATION_DURATION_IN,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION_IN,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, backdropAnim]);

  const animateOut = useCallback(
    (callback?: () => void) => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_WIDTH,
          duration: ANIMATION_DURATION_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION_OUT,
          useNativeDriver: true,
        }),
      ]).start(callback);
    },
    [slideAnim, backdropAnim]
  );

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(SCREEN_WIDTH);
      backdropAnim.setValue(0);
      animateIn();
    }
  }, [visible, animateIn, slideAnim, backdropAnim]);

  const handleClose = useCallback(() => {
    animateOut(() => onClose());
  }, [animateOut, onClose]);

  const handleMenuPress = useCallback(
    (item: MenuItemData) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      if (item.toastMessage) {
        // For items that show a toast instead of navigating
        handleClose();
        return;
      }

      if (item.route) {
        handleClose();
        // Small delay to let the menu close animation start
        setTimeout(() => {
          router.push(item.route as never);
        }, 100);
      }
    },
    [handleClose, router]
  );

  const avatarLetter = profile?.fullName?.charAt(0) ?? '?';
  const planLabel = 'חינם'; // Placeholder — will come from org/subscription data

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View
        className="absolute inset-0"
        style={{ opacity: backdropAnim, backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        <Pressable className="flex-1" onPress={handleClose} />
      </Animated.View>

      {/* Menu Panel */}
      <Animated.View
        className="absolute top-0 bottom-0 bg-cream-50"
        style={{
          width: MENU_WIDTH,
          transform: [{ translateX: slideAnim }],
        }}
      >
        {/* Close Button */}
        <View className="pt-[52px] pe-[16px] ps-[16px] pb-[8px]">
          <Pressable
            onPress={handleClose}
            className="w-[36px] h-[36px] rounded-md items-center justify-center bg-cream-100 border border-cream-200 active:bg-cream-200"
            accessibilityLabel="סגור תפריט"
            accessibilityRole="button"
          >
            <Feather name="x" size={20} color="#3D3A36" />
          </Pressable>
        </View>

        {/* User Info Section */}
        <View className="px-[16px] pt-[8px] pb-[24px] border-b border-cream-200">
          <View className="flex-row-reverse items-center gap-[12px]">
            {/* Avatar */}
            <View className="w-[40px] h-[40px] rounded-full bg-primary-500 items-center justify-center">
              <Text className="text-[18px] font-rubik-bold text-white">
                {avatarLetter}
              </Text>
            </View>

            {/* Name + Org */}
            <View className="flex-1">
              <Text
                className="text-[15px] font-rubik-semibold text-neutral-800 text-right"
                numberOfLines={1}
              >
                {profile?.fullName ?? 'משתמש'}
              </Text>
              <Text
                className="text-[12px] font-rubik text-neutral-500 text-right mt-[2px]"
                numberOfLines={1}
              >
                {planLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="pt-[8px]">
          {MENU_ITEMS.map((item) => (
            <MenuItem
              key={item.label}
              item={item}
              onPress={() => handleMenuPress(item)}
            />
          ))}
        </View>
      </Animated.View>
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
    <Pressable
      onPress={onPress}
      className="flex-row-reverse items-center gap-[12px] px-[16px] py-[14px] active:bg-cream-100"
      accessibilityRole="menuitem"
      accessibilityLabel={item.label}
    >
      <View className="w-[36px] h-[36px] rounded-md items-center justify-center bg-cream-100">
        <Feather name={item.icon} size={20} color="#1B7A44" />
      </View>
      <Text className="text-[15px] font-rubik-medium text-neutral-700 text-right flex-1">
        {item.label}
      </Text>
    </Pressable>
  );
}
