import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';
import { useReportContent } from '@/hooks/useReportContent';
import { useInspectorSettings } from '@/hooks/useInspectorSettings';
import type { ReportContent } from '@/hooks/useReportContent';

// --- Section config ---

interface SectionConfig {
  key: keyof ReportContent;
  title: string;
  lines: number;
  placeholder: string;
}

const SECTIONS: SectionConfig[] = [
  {
    key: 'declaration',
    title: 'הצהרת בודק',
    lines: 5,
    placeholder: 'הצהרת הבודק תופיע בתחילת הדוח...',
  },
  {
    key: 'scope',
    title: 'היקף הבדיקה',
    lines: 3,
    placeholder: 'תאר את היקף הבדיקה...',
  },
  {
    key: 'property_description',
    title: 'תיאור הנכס',
    lines: 3,
    placeholder: 'תיאור כללי של הנכס...',
  },
  {
    key: 'limitations',
    title: 'מגבלות הבדיקה',
    lines: 3,
    placeholder: 'מגבלות שהיו במהלך הבדיקה...',
  },
  {
    key: 'tools',
    title: 'כלי בדיקה',
    lines: 2,
    placeholder: 'פטיש, מד לחות, פלס...',
  },
  {
    key: 'weather',
    title: 'מזג אוויר',
    lines: 1,
    placeholder: 'בהיר, גשום, חם...',
  },
  {
    key: 'general_notes',
    title: 'הערות כלליות',
    lines: 4,
    placeholder: 'הערות נוספות...',
  },
];

// --- Chevron component ---

function AnimatedChevron({ isOpen }: { isOpen: boolean }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(isOpen ? 180 : 0, { duration: 250 });
  }, [isOpen, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Feather name="chevron-down" size={18} color={COLORS.neutral[500]} />
    </Animated.View>
  );
}

// --- Section card ---

interface SectionCardProps {
  config: SectionConfig;
  value: string;
  isOpen: boolean;
  onToggle: () => void;
  onChangeText: (key: keyof ReportContent, text: string) => void;
  index: number;
}

function SectionCard({
  config,
  value,
  isOpen,
  onToggle,
  onChangeText,
  index,
}: SectionCardProps) {
  const [localValue, setLocalValue] = useState(value);
  const scaleValue = useSharedValue(1);

  // Sync from parent when content loads/changes externally
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handlePressIn = useCallback(() => {
    scaleValue.value = withTiming(0.98, { duration: 100 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [scaleValue]);

  const handlePressOut = useCallback(() => {
    scaleValue.value = withTiming(1, { duration: 100 });
  }, [scaleValue]);

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handleBlur = useCallback(() => {
    if (localValue !== value) {
      onChangeText(config.key, localValue);
    }
  }, [localValue, value, config.key, onChangeText]);

  return (
    <Animated.View
      entering={FadeInUp.delay(60 * index).duration(200)}
      style={{
        backgroundColor: COLORS.cream[100],
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        borderRadius: 14,
        marginBottom: 10,
        overflow: 'hidden',
      }}
    >
      <Pressable
        onPress={onToggle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            {
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 14,
            },
            headerStyle,
          ]}
        >
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Rubik-SemiBold',
              color: COLORS.neutral[800],
              textAlign: 'right',
            }}
          >
            {config.title}
          </Text>
          <AnimatedChevron isOpen={isOpen} />
        </Animated.View>
      </Pressable>

      {isOpen && (
        <Animated.View
          entering={FadeInUp.duration(200)}
          exiting={FadeOutUp.duration(150)}
          style={{ paddingHorizontal: 14, paddingBottom: 14 }}
        >
          <TextInput
            multiline
            numberOfLines={config.lines}
            value={localValue}
            onChangeText={setLocalValue}
            onBlur={handleBlur}
            placeholder={config.placeholder}
            placeholderTextColor={COLORS.neutral[400]}
            textAlignVertical="top"
            style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: COLORS.cream[200],
              borderRadius: 10,
              padding: 12,
              textAlign: 'right',
              fontFamily: 'Rubik-Regular',
              fontSize: 14,
              color: COLORS.neutral[800],
              minHeight: config.lines * 24 + 24,
              writingDirection: 'rtl',
            }}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
}

// --- Main tab component ---

interface ReportContentTabProps {
  reportId: string;
}

export function ReportContentTab({ reportId }: ReportContentTabProps) {
  const {
    content,
    updateSection,
    initializeDefaults,
    isLoading,
    isSaving,
    defaultsLoaded,
  } = useReportContent(reportId);
  const { settings, isLoading: settingsLoading } = useInspectorSettings();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [showBanner, setShowBanner] = useState(false);

  // Initialize defaults on first load
  useEffect(() => {
    if (!isLoading && !settingsLoading) {
      initializeDefaults(settings as Record<string, unknown>);
    }
  }, [isLoading, settingsLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show banner when defaults are loaded
  useEffect(() => {
    if (defaultsLoaded) {
      setShowBanner(true);
      const timer = setTimeout(() => setShowBanner(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [defaultsLoaded]);

  const toggleSection = useCallback((key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const sectionList = useMemo(() => SECTIONS, []);

  if (isLoading) {
    return (
      <View style={{ padding: 16, gap: 10 }}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              height: 52,
              backgroundColor: COLORS.cream[100],
              borderRadius: 14,
              borderWidth: 1,
              borderColor: COLORS.cream[200],
            }}
          />
        ))}
      </View>
    );
  }

  return (
    <View>
      {/* Defaults banner */}
      {showBanner && (
        <Animated.View
          entering={FadeInUp.duration(250)}
          exiting={FadeOutUp.duration(200)}
          style={{
            backgroundColor: COLORS.primary[50],
            borderWidth: 1,
            borderColor: COLORS.primary[200],
            borderRadius: 10,
            padding: 10,
            marginBottom: 12,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Feather name="info" size={14} color={COLORS.primary[500]} />
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Rubik-Regular',
              color: COLORS.primary[700],
              textAlign: 'right',
              flex: 1,
            }}
          >
            ברירות מחדל הוטענו מהגדרות הפרופיל
          </Text>
        </Animated.View>
      )}

      {/* Saving indicator */}
      {isSaving && (
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 6,
            marginBottom: 8,
          }}
        >
          <Feather name="save" size={12} color={COLORS.neutral[400]} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[400],
              textAlign: 'right',
            }}
          >
            שומר...
          </Text>
        </View>
      )}

      {/* Section cards */}
      {sectionList.map((config, idx) => (
        <SectionCard
          key={config.key}
          config={config}
          value={content[config.key] ?? ''}
          isOpen={openSections[config.key] ?? false}
          onToggle={() => toggleSection(config.key)}
          onChangeText={updateSection}
          index={idx}
        />
      ))}
    </View>
  );
}
