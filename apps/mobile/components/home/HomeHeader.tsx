import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { PressableScale } from '@/components/ui';
import { useNotifications } from '@/hooks/useNotifications';

// --- Types ---

interface HomeHeaderProps {
  userName: string;
  onBell?: () => void;
  onMenu?: () => void;
}

// --- Component ---

export function HomeHeader({ userName, onBell, onMenu }: HomeHeaderProps) {
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotifications();

  // Format today's date in Hebrew
  const today = new Date();
  const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const monthNames = [
    'בינואר',
    'בפברואר',
    'במרץ',
    'באפריל',
    'במאי',
    'ביוני',
    'ביולי',
    'באוגוסט',
    'בספטמבר',
    'באוקטובר',
    'בנובמבר',
    'בדצמבר',
  ];
  const dateStr = `יום ${dayNames[today.getDay()]} · ${today.getDate()} ${monthNames[today.getMonth()]}`;

  return (
    <LinearGradient
      colors={[COLORS.primary[700], COLORS.primary[600]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingTop: insets.top + 12,
        paddingBottom: 20,
        paddingHorizontal: 16,
      }}
    >
      {/* Nav bar: bell | logo | menu */}
      <Animated.View
        entering={FadeInDown.delay(50).duration(350)}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}
      >
        {/* Menu button — right in RTL */}
        <PressableScale
          onPress={onMenu}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.14)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.18)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="menu" size={20} color="#fff" />
        </PressableScale>

        {/* Logo — center */}
        <View
          style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 7 }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: '700',
              color: '#fff',
              fontFamily: 'Inter-Bold',
              letterSpacing: -0.3,
            }}
          >
            in<Text style={{ fontWeight: '800' }}>Field</Text>
          </Text>
        </View>

        {/* Bell button — left in RTL */}
        <PressableScale
          onPress={onBell}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.14)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.18)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="bell" size={18} color="#fff" />
          {unreadCount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: 7,
                right: 8,
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: COLORS.danger[500],
                borderWidth: 1.5,
                borderColor: COLORS.primary[700],
              }}
            />
          )}
        </PressableScale>
      </Animated.View>

      {/* Greeting + date + sync */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: '#fff',
            fontFamily: 'Rubik-Bold',
            textAlign: 'right',
            letterSpacing: -0.4,
            lineHeight: 28,
          }}
        >
          {`שלום, ${userName}`}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'Rubik-Regular',
            textAlign: 'right',
            marginTop: 4,
          }}
        >
          {dateStr}
        </Text>
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 5,
            marginTop: 8,
          }}
        >
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#7EE2AB',
            }}
          />
          <Text
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.75)',
              fontFamily: 'Rubik-Medium',
            }}
          >
            מסונכרן · עודכן לפני דקה
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}
