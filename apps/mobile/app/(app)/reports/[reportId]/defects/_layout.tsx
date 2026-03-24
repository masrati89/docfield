import { Stack } from 'expo-router';

export default function DefectsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[defectId]" />
      <Stack.Screen
        name="camera"
        options={{ presentation: 'fullScreenModal' }}
      />
    </Stack>
  );
}
