import { useCallback } from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';

import { COLORS, SHADOWS } from '@infield/ui';
import { useWizardState } from './useWizardState';
import { WizardShell } from './WizardShell';

import type { NewInspectionWizardProps } from './NewInspectionWizard.types';

// --- Component ---

export function NewInspectionWizard({
  visible,
  onClose,
  prefill,
}: NewInspectionWizardProps) {
  const {
    state,
    dispatch,
    visibleSteps,
    currentStepId,
    isLastStep,
    canGoNext,
    isStepPrefilled,
    handleSubmit,
    submitError,
    clearSubmitError,
  } = useWizardState(prefill, onClose, visible);

  const handleClose = useCallback(() => {
    dispatch({ type: 'RESET' });
    onClose();
  }, [dispatch, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(60,54,42,0.4)',
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={handleClose} />

        {/* Sheet */}
        <Animated.View
          entering={SlideInDown.duration(350).springify()}
          exiting={SlideOutDown.duration(250)}
          style={{
            backgroundColor: COLORS.cream[50],
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '94%',
            minHeight: 400,
            shadowColor: 'rgb(60,54,42)',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 20,
            elevation: 16,
          }}
        >
          {/* Handle bar */}
          <Animated.View
            style={{
              alignItems: 'center',
              paddingTop: 8,
              paddingBottom: 4,
            }}
          >
            <Animated.View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: COLORS.cream[300],
              }}
            />
          </Animated.View>

          {/* Wizard content */}
          <WizardShell
            state={state}
            dispatch={dispatch}
            visibleSteps={visibleSteps}
            currentStepId={currentStepId}
            isLastStep={isLastStep}
            canGoNext={canGoNext}
            isStepPrefilled={isStepPrefilled}
            onSubmit={handleSubmit}
            onClose={handleClose}
          />
        </Animated.View>
      </Animated.View>

      {/* Submit error modal (cross-platform replacement for Alert.alert) */}
      <Modal
        visible={!!submitError}
        transparent
        animationType="fade"
        onRequestClose={clearSubmitError}
      >
        <Pressable
          onPress={clearSubmitError}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              width: '100%',
              maxWidth: 320,
              backgroundColor: COLORS.cream[50],
              borderRadius: 14,
              padding: 20,
              ...SHADOWS.lg,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Rubik-SemiBold',
                color: COLORS.neutral[800],
                textAlign: 'right',
                marginBottom: 8,
              }}
            >
              שגיאה ביצירת הדוח
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[600],
                textAlign: 'right',
                marginBottom: 20,
              }}
            >
              {submitError}
            </Text>
            <View style={{ flexDirection: 'row-reverse' }}>
              <Pressable
                onPress={clearSubmitError}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: COLORS.primary[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Rubik-SemiBold',
                    color: COLORS.white,
                  }}
                >
                  הבנתי
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );
}
