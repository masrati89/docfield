import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

interface SharedTabHeaderProps {
  notificationCount?: number;
  onBell?: () => void;
  onMenu?: () => void;
}

export function SharedTabHeader({
  notificationCount = 0,
  onBell,
  onMenu,
}: SharedTabHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + 4,
        paddingHorizontal: 16,
        paddingBottom: 8,
        backgroundColor: COLORS.cream[50],
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cream[200],
      }}
    >
      <View
        style={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Hamburger (right in RTL) */}
        <Pressable
          onPress={onMenu}
          style={{
            width: 36,
            height: 36,
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="menu" size={20} color={COLORS.neutral[700]} />
        </Pressable>

        {/* Logo center */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              backgroundColor: COLORS.primary[50],
              borderWidth: 1,
              borderColor: COLORS.primary[200],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="clipboard" size={16} color={COLORS.primary[500]} />
          </View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: COLORS.primary[700],
              fontFamily: 'Rubik-Bold',
            }}
          >
            inField
          </Text>
        </View>

        {/* Bell button (left in RTL) */}
        <Pressable
          onPress={onBell}
          style={{
            width: 36,
            height: 36,
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="bell" size={19} color={COLORS.neutral[500]} />
          {notificationCount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                minWidth: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: COLORS.danger[500],
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: COLORS.cream[50],
                paddingHorizontal: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  color: COLORS.white,
                  fontWeight: '700',
                  fontFamily: 'Rubik-Bold',
                }}
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}
