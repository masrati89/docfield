import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';

// --- Types ---

interface FormFieldProps {
  label: string;
  required?: boolean;
  filled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  children: React.ReactNode;
}

// --- Component ---

export function FormField({
  label,
  required,
  filled,
  icon,
  children,
}: FormFieldProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      {/* Label row */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {icon ? (
            <Feather name={icon} size={16} color={COLORS.neutral[400]} />
          ) : null}
          <Text
            style={{
              fontSize: 11,
              fontWeight: '500',
              color: required ? COLORS.neutral[700] : COLORS.neutral[500],
              fontFamily: 'Rubik-Medium',
            }}
          >
            {label}
          </Text>
          {required ? (
            <Text
              style={{
                fontSize: 10,
                color: COLORS.danger[500],
                fontFamily: 'Rubik-Regular',
              }}
            >
              *
            </Text>
          ) : null}
        </View>
        {filled ? (
          <Feather name="check" size={16} color={COLORS.primary[500]} />
        ) : null}
      </View>

      {/* Field content */}
      {children}
    </View>
  );
}
