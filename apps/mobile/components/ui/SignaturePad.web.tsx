import { View, Text } from 'react-native';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

// --- Types ---

interface SignaturePadProps {
  onSave: (base64Png: string) => void;
  onClear?: () => void;
  height?: number;
  disabled?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
}

// --- Web Fallback ---
// @shopify/react-native-skia does not support web.
// This placeholder informs the user to use the native app for signatures.

export function SignaturePad({ height = 200 }: SignaturePadProps) {
  return (
    <View
      style={{
        height,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: COLORS.cream[300],
        backgroundColor: COLORS.cream[100],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: 'Rubik-Regular',
          color: COLORS.neutral[500],
          textAlign: 'center',
        }}
      >
        חתימה דיגיטלית זמינה רק באפליקציה
      </Text>
    </View>
  );
}
