import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

export default function ProjectsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />

      <View className="flex-1 px-[16px] pt-[16px]">
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(500).springify()}>
          <Text className="text-[20px] font-rubik-bold text-neutral-800 text-right">
            הפרויקטים שלי
          </Text>
        </Animated.View>

        {/* Empty state */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(500).springify()}
          className="flex-1 items-center justify-center"
        >
          <View className="w-[64px] h-[64px] rounded-xl bg-primary-50 items-center justify-center mb-[16px]">
            <Feather name="folder" size={24} color="#1B7A44" />
          </View>
          <Text className="text-[17px] font-rubik-semibold text-neutral-700 mb-[8px]">
            אין פרויקטים עדיין
          </Text>
          <Text className="text-[15px] font-rubik text-neutral-500 text-center">
            צור פרויקט חדש כדי להתחיל
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
