import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { COLORS } from '@infield/ui';

import {
  useInspectorSettings,
  type InspectorSettings,
} from '@/hooks/useInspectorSettings';

// --- Types ---

interface FieldConfig {
  key: keyof InspectorSettings;
  label: string;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
}

// --- Field definitions ---

const FIELDS: FieldConfig[] = [
  {
    key: 'license_number',
    label: 'מספר רישיון',
    placeholder: 'הזן מספר רישיון',
  },
  {
    key: 'education',
    label: 'השכלה',
    placeholder: 'הזן השכלה',
  },
  {
    key: 'experience',
    label: 'שנות ניסיון',
    placeholder: 'הזן שנות ניסיון',
  },
  {
    key: 'company_name',
    label: 'שם החברה',
    placeholder: 'הזן שם חברה',
  },
  {
    key: 'default_declaration',
    label: 'הצהרת בודק',
    placeholder: 'הזן הצהרת בודק ברירת מחדל',
    multiline: true,
    numberOfLines: 4,
  },
  {
    key: 'default_tools',
    label: 'כלי בדיקה',
    placeholder: 'הזן כלי בדיקה',
  },
  {
    key: 'default_limitations',
    label: 'מגבלות ברירת מחדל',
    placeholder: 'הזן מגבלות ברירת מחדל',
    multiline: true,
    numberOfLines: 3,
  },
];

// --- Component ---

export function InspectorProfileSection() {
  const { settings, updateSettings, isLoading, isSaved } =
    useInspectorSettings();

  const [localValues, setLocalValues] = useState<InspectorSettings>({});
  const [showSaved, setShowSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  // Sync remote settings into local state once loaded
  useEffect(() => {
    if (!isLoading && !initializedRef.current) {
      setLocalValues(settings);
      initializedRef.current = true;
    }
  }, [isLoading, settings]);

  // Show saved indicator briefly
  useEffect(() => {
    if (isSaved) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaved]);

  const handleChange = useCallback(
    (key: keyof InspectorSettings, value: string) => {
      setLocalValues((prev) => ({ ...prev, [key]: value }));

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateSettings({ [key]: value });
      }, 1000);
    },
    [updateSettings]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (isLoading) {
    return (
      <View className="mx-[20px] mb-[24px]">
        <View className="h-[20px] w-[120px] bg-cream-200 rounded-[6px] mb-[16px] self-end" />
        <View className="bg-cream-100 rounded-[14px] p-[20px] border border-cream-200">
          {[1, 2, 3].map((i) => (
            <View key={i} className="mb-[16px]">
              <View className="h-[14px] w-[80px] bg-cream-200 rounded-[4px] mb-[6px] self-end" />
              <View className="h-[44px] bg-cream-200 rounded-[10px]" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      entering={FadeInUp.delay(350).duration(400)}
      className="mx-[20px] mb-[24px]"
    >
      {/* Section header */}
      <View className="flex-row-reverse items-center justify-between mb-[16px]">
        <Text className="text-[18px] font-rubik-semibold text-neutral-800 text-right">
          פרטי מפקח
        </Text>
        {showSaved && (
          <Animated.Text
            entering={FadeInUp.duration(200)}
            className="text-[13px] font-rubik text-primary-600"
          >
            נשמר ✓
          </Animated.Text>
        )}
      </View>

      {/* Fields card */}
      <View className="bg-cream-100 rounded-[14px] p-[20px] border border-cream-200">
        {FIELDS.map((field, index) => (
          <View
            key={field.key}
            className={index < FIELDS.length - 1 ? 'mb-[16px]' : ''}
          >
            <Text className="text-[14px] font-rubik-medium text-neutral-700 text-right mb-[6px]">
              {field.label}
            </Text>
            <TextInput
              value={localValues[field.key] ?? ''}
              onChangeText={(text) => handleChange(field.key, text)}
              placeholder={field.placeholder}
              placeholderTextColor={COLORS.neutral[400]}
              multiline={field.multiline}
              numberOfLines={field.numberOfLines}
              className="bg-white border border-cream-200 rounded-[10px] p-[12px] text-[14px] font-rubik text-neutral-700"
              style={{
                textAlign: 'right',
                textAlignVertical: field.multiline ? 'top' : 'center',
                minHeight: field.multiline
                  ? (field.numberOfLines ?? 3) * 28
                  : undefined,
              }}
            />
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
