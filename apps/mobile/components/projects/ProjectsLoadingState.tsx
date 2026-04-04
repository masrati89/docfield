import { View, Text, Pressable, I18nManager } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';

export function SkeletonCardList() {
  return (
    <View style={{ gap: 10, marginHorizontal: 16, marginTop: 12 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <View
          key={i}
          style={{
            backgroundColor: COLORS.cream[50],
            borderRadius: 14,
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            padding: 16,
          }}
        >
          <SkeletonBlock
            width="50%"
            height={14}
            borderRadius={4}
            style={{ alignSelf: 'flex-end', marginBottom: 8 }}
          />
          <SkeletonBlock
            width="70%"
            height={10}
            borderRadius={3}
            style={{ alignSelf: 'flex-end', marginBottom: 14 }}
          />
          <SkeletonBlock
            width="100%"
            height={6}
            borderRadius={3}
            style={{ marginBottom: 12 }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <SkeletonBlock width={60} height={10} borderRadius={3} />
            <SkeletonBlock width={80} height={10} borderRadius={3} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: 12,
        backgroundColor: COLORS.cream[50],
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        padding: 48,
        paddingHorizontal: 24,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 36, marginBottom: 10 }}>😕</Text>
      <Text
        style={{
          fontSize: 15,
          fontFamily: 'Rubik-SemiBold',
          color: COLORS.neutral[700],
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        משהו השתבש
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'Rubik-Regular',
          color: COLORS.neutral[400],
          marginBottom: 16,
          lineHeight: 18,
          textAlign: 'center',
        }}
      >
        {'לא הצלחנו לטעון את הפרויקטים.\nבדוק את החיבור ונסה שוב.'}
      </Text>
      <Pressable
        onPress={onRetry}
        style={{
          height: 38,
          borderRadius: 10,
          backgroundColor: COLORS.cream[50],
          borderWidth: 1,
          borderColor: COLORS.primary[200],
          paddingHorizontal: 20,
          flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Feather name="refresh-cw" size={16} color={COLORS.primary[500]} />
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'Rubik-SemiBold',
            color: COLORS.primary[700],
          }}
        >
          נסה שוב
        </Text>
      </Pressable>
    </View>
  );
}
