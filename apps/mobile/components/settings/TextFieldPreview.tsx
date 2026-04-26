import { View, Text, Pressable, Platform } from 'react-native';
import * as Haptics from '@/lib/haptics';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';

// --- Types ---

interface TextFieldPreviewProps {
  label: string;
  value: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  onPress: () => void;
}

// --- Component ---

export function TextFieldPreview({
  label,
  value,
  checked,
  onToggle,
  onPress,
}: TextFieldPreviewProps) {
  const isEmpty = !value || !value.trim();

  return (
    <View
      style={{
        marginBottom: 12,
        borderRadius: 10,
        backgroundColor: COLORS.cream[50],
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        overflow: 'hidden',
      }}
    >
      {/* Header row: checkbox + label */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
          gap: 8,
        }}
      >
        {/* Checkbox */}
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onToggle(!checked);
          }}
          hitSlop={8}
          style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            borderWidth: 1.5,
            borderColor: checked ? COLORS.primary[500] : COLORS.neutral[300],
            backgroundColor: checked ? COLORS.primary[500] : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {checked && <Feather name="check" size={14} color={COLORS.white} />}
        </Pressable>

        {/* Label */}
        <Text
          style={{
            flex: 1,
            fontSize: 14,
            fontFamily: 'Rubik-Medium',
            color: COLORS.neutral[700],
            textAlign: 'right',
          }}
        >
          {label}
        </Text>

        {/* Edit icon */}
        <Feather name="edit-2" size={14} color={COLORS.neutral[400]} />
      </View>

      {/* Preview area */}
      <Pressable
        onPress={() => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          onPress();
        }}
        style={{
          paddingHorizontal: 12,
          paddingBottom: 10,
        }}
      >
        {isEmpty ? (
          <View
            style={{
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: COLORS.neutral[300],
              borderRadius: 8,
              paddingVertical: 14,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row-reverse',
              gap: 6,
            }}
          >
            <Feather name="plus" size={14} color={COLORS.neutral[400]} />
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[400],
              }}
            >
              לחץ להוספת טקסט
            </Text>
          </View>
        ) : (
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: 12,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[500],
              textAlign: 'right',
              lineHeight: 18,
            }}
          >
            {value}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
