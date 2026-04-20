import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';

// --- Types ---

interface FormFieldProps {
  label: string;
  required?: boolean;
  filled?: boolean;
  muted?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  iconColor?: string;
  /** Extra element rendered between label and checkmark (e.g. badge) */
  labelExtra?: React.ReactNode;
  /** Hint text on the far-left side */
  hint?: string;
  /** Photo/doc count shown as Inter number next to label */
  count?: number;
  children: React.ReactNode;
}

// --- Component ---

export function FormField({
  label,
  required,
  filled,
  muted,
  icon,
  iconColor,
  labelExtra,
  hint,
  count,
  children,
}: FormFieldProps) {
  const resolvedIconColor =
    iconColor ??
    (muted
      ? COLORS.neutral[500]
      : required
        ? COLORS.primary[500]
        : COLORS.neutral[500]);

  return (
    <View style={{ marginBottom: 14 }}>
      {/* Label row */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 6,
          marginBottom: 6,
        }}
      >
        {icon ? (
          <Feather name={icon} size={14} color={resolvedIconColor} />
        ) : null}
        <Text
          style={{
            fontSize: 12,
            fontWeight: muted ? '500' : '600',
            color: muted ? COLORS.neutral[500] : COLORS.neutral[700],
            fontFamily: muted ? 'Rubik-Medium' : 'Rubik-SemiBold',
          }}
        >
          {label}
        </Text>
        {required ? (
          <Text
            style={{
              fontSize: 12,
              color: COLORS.danger[500],
              fontFamily: 'Rubik-Regular',
            }}
          >
            *
          </Text>
        ) : null}
        {labelExtra}
        {count !== null && count !== undefined ? (
          <Text
            style={{
              fontSize: 10,
              color: COLORS.neutral[400],
              fontFamily: 'Inter-Regular',
            }}
          >
            {count}
          </Text>
        ) : null}
        <View style={{ flex: 1 }} />
        {hint ? (
          <Text
            style={{
              fontSize: 10,
              color: COLORS.neutral[400],
              fontFamily: 'Rubik-Regular',
            }}
          >
            {hint}
          </Text>
        ) : null}
        {filled ? (
          <Text
            style={{
              fontSize: 11,
              color: COLORS.primary[500],
            }}
          >
            ✓
          </Text>
        ) : null}
      </View>

      {/* Field content */}
      {children}
    </View>
  );
}
