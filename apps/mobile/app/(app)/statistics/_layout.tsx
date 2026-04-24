import { Stack } from 'expo-router';

export default function StatisticsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_left' }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
