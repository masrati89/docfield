import { Stack } from 'expo-router';

export default function ReportDetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_left' }}>
      <Stack.Screen
        name="add-defect"
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </Stack>
  );
}
