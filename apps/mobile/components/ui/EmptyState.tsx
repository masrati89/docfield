import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';
import { Button } from './Button';

// --- Types ---

interface EmptyStateProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

// --- Component ---

export function EmptyState({
  icon,
  title,
  subtitle,
  ctaLabel,
  onCta,
}: EmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 12,
      }}
    >
      <Feather name={icon} size={48} color={COLORS.neutral[400]} />
      <Text
        style={{
          fontSize: 16,
          fontFamily: 'Rubik-SemiBold',
          color: COLORS.neutral[700],
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[400],
            textAlign: 'center',
            lineHeight: 20,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
      {ctaLabel && onCta ? (
        <View style={{ marginTop: 8 }}>
          <Button
            label={ctaLabel}
            onPress={onCta}
            size="md"
            fullWidth={false}
          />
        </View>
      ) : null}
    </View>
  );
}
