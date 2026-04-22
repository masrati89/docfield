import { Stack } from 'expo-router';

export default function ProjectDetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_left' }} />
  );
}
