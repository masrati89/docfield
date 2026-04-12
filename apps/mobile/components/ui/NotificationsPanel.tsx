import { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutUp,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import {
  useNotifications,
  type NotificationItem,
} from '@/hooks/useNotifications';
import { SkeletonBlock } from './SkeletonBlock';
import { EmptyState } from './EmptyState';

// --- Types ---

interface NotificationsPanelProps {
  visible: boolean;
  onClose: () => void;
}

// --- Relative time formatter (Hebrew) ---

function formatRelativeTime(isoString: string): string {
  try {
    const then = new Date(isoString).getTime();
    if (Number.isNaN(then)) return '';
    const now = Date.now();
    const diffSec = Math.max(0, Math.floor((now - then) / 1000));

    if (diffSec < 60) return 'עכשיו';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `לפני ${diffMin} דק׳`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `לפני ${diffHr} שע׳`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `לפני ${diffDay} ימים`;
    const diffWeek = Math.floor(diffDay / 7);
    if (diffWeek < 5) return `לפני ${diffWeek} שבועות`;
    const diffMonth = Math.floor(diffDay / 30);
    if (diffMonth < 12) return `לפני ${diffMonth} חודשים`;
    return new Date(isoString).toLocaleDateString('he-IL');
  } catch {
    return '';
  }
}

// --- Type → icon mapping ---

const TYPE_ICON: Record<
  NotificationItem['type'],
  keyof typeof Feather.glyphMap
> = {
  app_update: 'download',
  system_message: 'info',
  reminder: 'clock',
};

const TYPE_COLOR: Record<NotificationItem['type'], string> = {
  app_update: COLORS.primary[500],
  system_message: COLORS.gold[500],
  reminder: COLORS.warning[500],
};

// --- Component ---

export function NotificationsPanel({
  visible,
  onClose,
}: NotificationsPanelProps) {
  const insets = useSafeAreaInsets();
  const { notifications, unreadCount, isLoading, markRead, markAllRead } =
    useNotifications();

  const handleItemPress = useCallback(
    (item: NotificationItem) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      if (!item.isRead) {
        markRead(item.id);
      }
    },
    [markRead]
  );

  const handleMarkAllRead = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    markAllRead();
  }, [markAllRead]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View
        entering={FadeIn.duration(180)}
        exiting={FadeOut.duration(180)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(60,54,42,0.4)',
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Panel — slides down from top */}
      <Animated.View
        entering={SlideInUp.duration(300).springify()}
        exiting={SlideOutUp.duration(220)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: COLORS.cream[50],
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          maxHeight: '85%',
          shadowColor: 'rgb(60,54,42)',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 20,
        }}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 12,
            paddingHorizontal: 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.cream[200],
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Close */}
          <Pressable
            onPress={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: BORDER_RADIUS.md,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.cream[100],
              borderWidth: 1,
              borderColor: COLORS.cream[200],
            }}
            accessibilityLabel="סגור התראות"
            accessibilityRole="button"
          >
            <Feather name="x" size={20} color={COLORS.neutral[600]} />
          </Pressable>

          {/* Title + count */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Rubik-SemiBold',
                color: COLORS.neutral[800],
                textAlign: 'right',
              }}
            >
              התראות
            </Text>
            {unreadCount > 0 && (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[500],
                  textAlign: 'right',
                  marginTop: 2,
                }}
              >
                {unreadCount} חדשות
              </Text>
            )}
          </View>

          {/* Mark all as read */}
          {unreadCount > 0 && (
            <Pressable
              onPress={handleMarkAllRead}
              style={{
                paddingHorizontal: 12,
                height: 36,
                borderRadius: BORDER_RADIUS.md,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.primary[50],
                borderWidth: 1,
                borderColor: COLORS.primary[200],
              }}
              accessibilityLabel="סמן הכל כנקרא"
              accessibilityRole="button"
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Rubik-Medium',
                  color: COLORS.primary[700],
                }}
              >
                סמן הכל כנקרא
              </Text>
            </Pressable>
          )}
        </View>

        {/* Body */}
        {isLoading ? (
          <View style={{ padding: 16, gap: 12 }}>
            <SkeletonBlock width="100%" height={72} borderRadius={12} />
            <SkeletonBlock width="100%" height={72} borderRadius={12} />
            <SkeletonBlock width="100%" height={72} borderRadius={12} />
          </View>
        ) : notifications.length === 0 ? (
          <View style={{ minHeight: 220, paddingVertical: 24 }}>
            <EmptyState
              icon="bell-off"
              title="אין התראות"
              subtitle="התראות חדשות יופיעו כאן"
            />
          </View>
        ) : (
          <ScrollView
            style={{ maxHeight: 560 }}
            contentContainerStyle={{ paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
          >
            {notifications.map((item, idx) => (
              <NotificationRow
                key={item.id}
                item={item}
                index={idx}
                onPress={() => handleItemPress(item)}
              />
            ))}
            <View style={{ height: 12 }} />
          </ScrollView>
        )}
      </Animated.View>
    </Modal>
  );
}

// --- Row Sub-Component ---

interface NotificationRowProps {
  item: NotificationItem;
  index: number;
  onPress: () => void;
}

function NotificationRow({ item, index, onPress }: NotificationRowProps) {
  const icon = TYPE_ICON[item.type] ?? 'bell';
  const color = TYPE_COLOR[item.type] ?? COLORS.primary[500];

  return (
    <Animated.View entering={FadeIn.delay(40 * index).duration(220)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          flexDirection: 'row-reverse',
          alignItems: 'flex-start',
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: pressed
            ? COLORS.cream[100]
            : item.isRead
              ? 'transparent'
              : COLORS.primary[50],
        })}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        {/* Icon badge */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: COLORS.cream[200],
          }}
        >
          <Feather name={icon} size={18} color={color} />
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: item.isRead ? 'Rubik-Medium' : 'Rubik-SemiBold',
                color: COLORS.neutral[800],
                textAlign: 'right',
                flex: 1,
              }}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {!item.isRead && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: COLORS.primary[500],
                }}
              />
            )}
          </View>
          {item.body && (
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[600],
                textAlign: 'right',
                marginTop: 2,
                lineHeight: 18,
              }}
              numberOfLines={2}
            >
              {item.body}
            </Text>
          )}
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[400],
              textAlign: 'right',
              marginTop: 4,
            }}
          >
            {formatRelativeTime(item.sentAt)}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
