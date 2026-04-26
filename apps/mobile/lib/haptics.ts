import { Platform } from 'react-native';
import * as ExpoHaptics from 'expo-haptics';

export const ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle;
export const NotificationFeedbackType = ExpoHaptics.NotificationFeedbackType;

export async function impactAsync(
  style: ExpoHaptics.ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle.Light
): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await ExpoHaptics.impactAsync(style);
  } catch {
    // Silently ignore — device may lack haptic hardware
  }
}

export async function notificationAsync(
  type: ExpoHaptics.NotificationFeedbackType
): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await ExpoHaptics.notificationAsync(type);
  } catch {
    // Silently ignore — device may lack haptic hardware
  }
}

export async function selectionAsync(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await ExpoHaptics.selectionAsync();
  } catch {
    // Silently ignore — device may lack haptic hardware
  }
}
