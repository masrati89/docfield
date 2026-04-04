import { View, Text, Pressable, I18nManager } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';

import { haptic } from './reportsConstants';
import type { SortBy, TypeFilter } from './reportsConstants';

function SheetOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
        minHeight: 44,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cream[200],
      }}
    >
      <Text
        style={{
          flex: 1,
          fontSize: 14,
          fontFamily: selected ? 'Rubik-SemiBold' : 'Rubik-Regular',
          color: selected ? COLORS.primary[700] : COLORS.neutral[700],
          textAlign: 'right',
        }}
      >
        {label}
      </Text>
      {selected ? (
        <Feather name="check" size={20} color={COLORS.primary[500]} />
      ) : (
        <View style={{ width: 18 }} />
      )}
    </Pressable>
  );
}

export function SortSheetContent({
  sortBy,
  setSortBy,
  typeFilter,
  setTypeFilter,
  onClose,
}: {
  sortBy: SortBy;
  setSortBy: (s: SortBy) => void;
  typeFilter: TypeFilter;
  setTypeFilter: (t: TypeFilter) => void;
  onClose: () => void;
}) {
  const sortOptions: { key: SortBy; label: string }[] = [
    { key: 'date', label: 'תאריך (חדש → ישן)' },
    { key: 'project', label: 'פרויקט (א-ת)' },
  ];

  const typeOptions: { key: TypeFilter; label: string }[] = [
    { key: 'all', label: 'הכל' },
    { key: 'delivery', label: 'פרוטוקול מסירה' },
    { key: 'bedek_bait', label: 'בדק בית' },
  ];

  return (
    <View style={{ paddingBottom: 32 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[200],
        }}
      >
        <Pressable onPress={onClose} hitSlop={8}>
          <Feather name="x" size={20} color={COLORS.neutral[600]} />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Rubik-Bold',
              color: COLORS.neutral[800],
            }}
          >
            מיון וסינון
          </Text>
        </View>
        <Pressable
          onPress={() => {
            setSortBy('date');
            setTypeFilter('all');
          }}
          hitSlop={8}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[400],
            }}
          >
            איפוס
          </Text>
        </Pressable>
      </View>

      {/* Sort section */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Rubik-SemiBold',
            color: COLORS.neutral[500],
            textAlign: 'right',
            marginBottom: 8,
          }}
        >
          מיון לפי
        </Text>
        {sortOptions.map((o) => (
          <SheetOption
            key={o.key}
            label={o.label}
            selected={sortBy === o.key}
            onPress={() => setSortBy(o.key)}
          />
        ))}
      </View>

      {/* Type section */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Rubik-SemiBold',
            color: COLORS.neutral[500],
            textAlign: 'right',
            marginBottom: 8,
          }}
        >
          סוג דוח
        </Text>
        {typeOptions.map((o) => (
          <SheetOption
            key={o.key}
            label={o.label}
            selected={typeFilter === o.key}
            onPress={() => setTypeFilter(o.key)}
          />
        ))}
      </View>

      {/* Apply button */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <Pressable
          onPress={() => {
            haptic();
            onClose();
          }}
          style={{
            height: 46,
            borderRadius: 12,
            backgroundColor: COLORS.primary[500],
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#1B7A44',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 14,
              fontFamily: 'Rubik-SemiBold',
            }}
          >
            החל
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
