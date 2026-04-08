import { useEffect } from 'react';
import { Stack, useNavigation } from 'expo-router';
import { StackActions } from '@react-navigation/native';

export default function ProjectsLayout() {
  const navigation = useNavigation();

  // Reset stack to projects list when tab loses focus (user navigated away)
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      try {
        navigation.dispatch(StackActions.popToTop());
      } catch {
        // Already at root — nothing to pop
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'slide_from_left' }}
    />
  );
}
