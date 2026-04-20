import { useCallback, forwardRef } from 'react';
import { Platform, KeyboardAvoidingView } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetProps,
} from '@gorhom/bottom-sheet';

import { COLORS } from '@infield/ui';

// --- Types ---

interface BottomSheetWrapperProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  onClose?: () => void;
  enableDynamicSizing?: boolean;
}

// --- Component ---

export const BottomSheetWrapper = forwardRef<
  BottomSheet,
  BottomSheetWrapperProps
>(function BottomSheetWrapper(
  { children, snapPoints = ['85%'], onClose, enableDynamicSizing = false },
  ref
) {
  const renderBackdrop = useCallback(
    (
      props: Parameters<NonNullable<BottomSheetProps['backdropComponent']>>[0]
    ) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={enableDynamicSizing ? undefined : snapPoints}
      enableDynamicSizing={enableDynamicSizing}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: COLORS.cream[50],
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
      handleIndicatorStyle={{
        backgroundColor: COLORS.cream[300],
        width: 36,
        height: 4,
      }}
      style={{
        shadowColor: 'rgb(60,54,42)',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 10,
      }}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {children}
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
});
