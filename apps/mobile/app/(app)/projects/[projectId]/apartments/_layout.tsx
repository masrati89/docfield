import { Stack } from 'expo-router';

export default function ApartmentsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_left' }} />
  );
}
