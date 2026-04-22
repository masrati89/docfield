import { Stack } from 'expo-router';

export default function BuildingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_left' }} />
  );
}
