import { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';

import { StepReportType } from './StepReportType';
import { StepProperty } from './StepProperty';
import { StepClientDetails } from './StepClientDetails';
import { StepRoundSummary } from './StepRoundSummary';

import type {
  WizardState,
  WizardAction,
  WizardStepId,
} from './NewInspectionWizard.types';

// --- Step titles ---

const STEP_TITLES: Record<WizardStepId, string> = {
  report_type: 'בדיקה חדשה',
  property: 'פרטי נכס (אופציונלי)',
  client_details: 'פרטי מזמין (אופציונלי)',
  round_summary: 'סבב נוסף',
};

// --- Props ---

interface WizardShellProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  visibleSteps: WizardStepId[];
  currentStepId: WizardStepId;
  isLastStep: boolean;
  canGoNext: boolean;
  isStepPrefilled: (stepId: WizardStepId) => boolean;
  onSubmit: () => void;
  onClose: () => void;
}

// --- Component ---

export function WizardShell({
  state,
  dispatch,
  visibleSteps,
  currentStepId,
  isLastStep,
  canGoNext,
  isStepPrefilled,
  onSubmit,
  onClose,
}: WizardShellProps) {
  const { width: screenWidth } = useWindowDimensions();
  const translateX = useSharedValue(0);

  // Animate step transitions
  useEffect(() => {
    translateX.value = withTiming(state.currentStepIndex * screenWidth, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [state.currentStepIndex, screenWidth, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -translateX.value }],
  }));

  const handleBack = useCallback(() => {
    if (state.currentStepIndex === 0) {
      onClose();
    } else {
      dispatch({ type: 'PREV_STEP' });
    }
  }, [state.currentStepIndex, dispatch, onClose]);

  const handleNext = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isLastStep) {
      onSubmit();
    } else {
      dispatch({ type: 'NEXT_STEP' });
    }
  }, [isLastStep, onSubmit, dispatch]);

  const title = STEP_TITLES[currentStepId];

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[200],
        }}
      >
        {/* Title (right in RTL) */}
        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: '700',
            fontFamily: 'Rubik-Bold',
            color: COLORS.neutral[800],
            textAlign: 'right',
          }}
        >
          {title}
        </Text>

        {/* Back / Close buttons */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {state.currentStepIndex > 0 && (
            <Pressable
              onPress={handleBack}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.cream[100],
                borderWidth: 1,
                borderColor: COLORS.cream[200],
              }}
              accessibilityLabel="חזרה"
            >
              <Feather
                name="arrow-right"
                size={20}
                color={COLORS.neutral[600]}
              />
            </Pressable>
          )}
          <Pressable
            onPress={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.cream[100],
              borderWidth: 1,
              borderColor: COLORS.cream[200],
            }}
            accessibilityLabel="סגור"
          >
            <Feather name="x" size={20} color={COLORS.neutral[600]} />
          </Pressable>
        </View>
      </View>

      {/* Progress dots */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 6,
          paddingVertical: 12,
        }}
      >
        {visibleSteps.map((_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                i <= state.currentStepIndex
                  ? COLORS.primary[500]
                  : COLORS.cream[300],
            }}
          />
        ))}
      </View>

      {/* Step content — animated horizontal container */}
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              width: screenWidth * visibleSteps.length,
            },
            animatedStyle,
          ]}
        >
          {visibleSteps.map((stepId) => (
            <View key={stepId} style={{ width: screenWidth }}>
              {renderStep(stepId, state, dispatch, isStepPrefilled(stepId))}
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Footer — CTA */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 24,
          borderTopWidth: 1,
          borderTopColor: COLORS.cream[200],
        }}
      >
        {/* CTA button */}
        <Pressable
          onPress={handleNext}
          disabled={!canGoNext || state.isSubmitting}
          style={{
            height: 46,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row-reverse',
            gap: 6,
            backgroundColor:
              canGoNext && !state.isSubmitting
                ? COLORS.primary[500]
                : COLORS.neutral[200],
            shadowColor: 'rgb(27,122,68)',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: canGoNext ? 0.18 : 0,
            shadowRadius: 8,
            elevation: canGoNext ? 4 : 0,
          }}
          accessibilityRole="button"
          accessibilityLabel={isLastStep ? 'התחל בדיקה' : 'המשך'}
        >
          {isLastStep && (
            <Feather
              name={currentStepId === 'round_summary' ? 'refresh-cw' : 'plus'}
              size={16}
              color="white"
            />
          )}
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: 'Rubik-SemiBold',
              color:
                canGoNext && !state.isSubmitting
                  ? 'white'
                  : COLORS.neutral[400],
            }}
          >
            {state.isSubmitting
              ? 'יוצר דוח...'
              : isLastStep
                ? currentStepId === 'round_summary'
                  ? `התחל סבב ${state.roundNumber}`
                  : 'התחל בדיקה'
                : 'המשך'}
          </Text>
          {!isLastStep && !state.isSubmitting && (
            <Feather
              name="arrow-left"
              size={16}
              color={canGoNext ? 'white' : COLORS.neutral[400]}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

// --- Step renderer ---

function renderStep(
  stepId: WizardStepId,
  state: WizardState,
  dispatch: React.Dispatch<WizardAction>,
  readOnly: boolean
) {
  const props = { state, dispatch, readOnly };

  switch (stepId) {
    case 'report_type':
      return <StepReportType {...props} />;
    case 'property':
      return <StepProperty {...props} />;
    case 'client_details':
      return <StepClientDetails {...props} />;
    case 'round_summary':
      return <StepRoundSummary {...props} />;
  }
}
