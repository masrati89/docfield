import { Stack } from 'expo-router';

export default function ReportDetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="checklist" />
      <Stack.Screen name="defects" />
    </Stack>
  );
}
