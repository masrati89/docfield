import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder — will be implemented in a future task
export default function RegisterScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <StatusBar style="dark" />

      <View className="flex-1 items-center justify-center px-[20px]">
        <Text className="text-[24px] font-rubik-bold text-primary-700 mb-[12px]">
          הרשמה
        </Text>
        <Text className="text-[15px] font-rubik text-neutral-500 text-center mb-[32px]">
          מסך ההרשמה יהיה זמין בקרוב
        </Text>

        <Link href="/(auth)/login" asChild>
          <Pressable className="bg-primary-500 h-[52px] rounded-[14px] items-center justify-center px-[32px]">
            <Text className="text-white text-[15px] font-rubik-semibold">
              חזור להתחברות
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
