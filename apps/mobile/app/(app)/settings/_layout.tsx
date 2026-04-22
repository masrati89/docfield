import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_left' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit-text" />
      <Stack.Screen name="edit-template" />
    </Stack>
  );
}
