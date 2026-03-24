import { Stack } from 'expo-router';

export default function BuildingDetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[apartmentId]" />
      <Stack.Screen name="create-report" />
    </Stack>
  );
}
