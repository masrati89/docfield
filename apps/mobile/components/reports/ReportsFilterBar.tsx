import { View, Text, TextInput, Pressable, I18nManager } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { PressableScale } from '@/components/ui';

import { STATUS_CHIPS, TYPE_LABELS, haptic } from './reportsConstants';
import type { StatusFilter, SortBy, TypeFilter } from './reportsConstants';

export function Header({ count, total }: { count: number; total: number }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      style={{ paddingHorizontal: 16, paddingTop: 8 }}
    >
      <View
        style={{
          flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Rubik-Bold',
            color: COLORS.neutral[800],
          }}
        >
          הדוחות שלי
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[400],
          }}
        >
          {count === total ? `${total}` : `${count}/${total}`}
        </Text>
      </View>
    </Animated.View>
  );
}

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(50).duration(200)}
      style={{
        marginHorizontal: 16,
        marginTop: 10,
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        alignItems: 'center',
        backgroundColor: COLORS.cream[100],
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        height: 38,
        paddingHorizontal: 12,
      }}
    >
      {value.length > 0 && (
        <Pressable onPress={() => onChange('')} hitSlop={8}>
          <Feather name="x-circle" size={16} color={COLORS.neutral[400]} />
        </Pressable>
      )}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="חיפוש..."
        placeholderTextColor={COLORS.neutral[400]}
        autoComplete="off"
        autoCorrect={false}
        style={{
          flex: 1,
          fontSize: 16,
          fontFamily: 'Rubik-Regular',
          color: COLORS.neutral[800],
          textAlign: 'right',
          writingDirection: 'rtl',
          paddingHorizontal: 8,
          paddingVertical: 0,
        }}
      />
      <Feather name="search" size={16} color={COLORS.neutral[400]} />
    </Animated.View>
  );
}

export function FilterChips({
  statusFilter,
  onStatusChange,
  hasActiveFilters,
  onOpenSort,
}: {
  statusFilter: StatusFilter;
  onStatusChange: (s: StatusFilter) => void;
  hasActiveFilters: boolean;
  onOpenSort: () => void;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(200)}
      style={{
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        alignItems: 'center',
        gap: 8,
        marginHorizontal: 16,
        marginTop: 10,
      }}
    >
      <View
        style={{
          flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
          gap: 6,
          flex: 1,
        }}
      >
        {STATUS_CHIPS.map((ch) => {
          const on = statusFilter === ch.key;
          return (
            <PressableScale
              key={ch.key}
              onPress={() => {
                haptic();
                onStatusChange(ch.key);
              }}
              style={{
                height: 36,
                borderRadius: 10,
                backgroundColor: on ? COLORS.primary[50] : 'transparent',
                borderWidth: 1,
                borderColor: on ? COLORS.primary[200] : COLORS.cream[200],
                paddingHorizontal: 14,
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: on ? 'Rubik-SemiBold' : 'Rubik-Regular',
                  color: on ? COLORS.primary[700] : COLORS.neutral[500],
                }}
              >
                {ch.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>

      <PressableScale
        onPress={() => {
          haptic();
          onOpenSort();
        }}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: hasActiveFilters
            ? COLORS.primary[50]
            : COLORS.cream[50],
          borderWidth: 1,
          borderColor: hasActiveFilters
            ? COLORS.primary[200]
            : COLORS.cream[200],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather
          name="sliders"
          size={16}
          color={hasActiveFilters ? COLORS.primary[500] : COLORS.neutral[500]}
        />
        {hasActiveFilters && (
          <View
            style={{
              position: 'absolute',
              top: -3,
              right: -3,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: COLORS.primary[500],
              borderWidth: 1.5,
              borderColor: COLORS.cream[50],
            }}
          />
        )}
      </PressableScale>
    </Animated.View>
  );
}

export function ActiveTags({
  typeFilter,
  setTypeFilter,
  sortBy,
}: {
  typeFilter: TypeFilter;
  setTypeFilter: (t: TypeFilter) => void;
  sortBy: SortBy;
}) {
  const hasType = typeFilter !== 'all';
  const hasSort = sortBy !== 'date';
  if (!hasType && !hasSort) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      style={{
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        gap: 6,
        marginHorizontal: 16,
        marginTop: 8,
      }}
    >
      {hasType && (
        <PressableScale
          onPress={() => setTypeFilter('all')}
          style={{
            minHeight: 36,
            borderRadius: 10,
            backgroundColor: COLORS.gold[100],
            borderWidth: 1,
            borderColor: COLORS.gold[100],
            paddingHorizontal: 12,
            flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Rubik-Medium',
              color: COLORS.gold[700],
            }}
          >
            ✕
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Rubik-Medium',
              color: COLORS.gold[700],
            }}
          >
            {TYPE_LABELS[typeFilter]}
          </Text>
        </PressableScale>
      )}
      {hasSort && (
        <View
          style={{
            minHeight: 36,
            borderRadius: 10,
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            paddingHorizontal: 12,
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Rubik-Medium',
              color: COLORS.neutral[600],
            }}
          >
            {sortBy === 'project' ? 'לפי פרויקט' : 'לפי תאריך'}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}
