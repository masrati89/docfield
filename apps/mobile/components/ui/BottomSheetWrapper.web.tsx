import { forwardRef } from 'react';
import { View } from 'react-native';

import { COLORS } from '@infield/ui';

// --- Types ---

interface BottomSheetWrapperProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  onClose?: () => void;
  enableDynamicSizing?: boolean;
}

// --- Web Fallback ---
// @gorhom/bottom-sheet has no web support.
// Render children in a simple styled container.

export const BottomSheetWrapper = forwardRef<View, BottomSheetWrapperProps>(
  function BottomSheetWrapper({ children }, ref) {
    return (
      <View
        ref={ref}
        style={{
          backgroundColor: COLORS.cream[50],
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          flex: 1,
        }}
      >
        {children}
      </View>
    );
  }
);
