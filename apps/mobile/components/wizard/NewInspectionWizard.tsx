import { useCallback } from 'react';
import { Modal, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
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
    handleSkipProject,
    handleSubmit,
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
          backgroundColor: 'rgba(0,0,0,0.4)',
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
            maxHeight: '85%',
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
            onSkipProject={handleSkipProject}
            onSubmit={handleSubmit}
            onClose={handleClose}
          />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
