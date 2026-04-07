import { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

// --- Types ---

interface ComboFieldProps {
  value: string;
  onSelect: (value: string) => void;
  options: string[];
  placeholder?: string;
  allowCustom?: boolean;
}

// --- Component ---

export function ComboField({
  value,
  onSelect,
  options,
  placeholder = 'הקלד לחיפוש...',
  allowCustom = true,
}: ComboFieldProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [query, options]);

  const showAddNew =
    allowCustom &&
    query.trim().length > 0 &&
    !options.some((o) => o.toLowerCase() === query.trim().toLowerCase());

  const handleSelect = useCallback(
    (opt: string) => {
      onSelect(opt);
      setQuery('');
      setIsOpen(false);
    },
    [onSelect]
  );

  const handleClear = useCallback(() => {
    onSelect('');
    setQuery('');
    setIsOpen(false);
  }, [onSelect]);

  // If a value is selected, show it as an input-like container with inline text and X button
  if (value && !isOpen) {
    return (
      <View
        style={{
          position: 'relative',
          borderRadius: BORDER_RADIUS.md,
          borderWidth: 1,
          borderColor: COLORS.primary[200],
          backgroundColor: COLORS.primary[50],
        }}
      >
        <TextInput
          value={value}
          onFocus={() => setIsOpen(true)}
          onChangeText={(text) => {
            onSelect(text);
          }}
          style={{
            paddingVertical: 9,
            paddingHorizontal: 12,
            paddingEnd: 36,
            fontSize: 14,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[800],
            textAlign: 'right',
          }}
        />
        <Pressable
          onPress={handleClear}
          hitSlop={8}
          style={{
            position: 'absolute',
            top: 10,
            start: 10,
          }}
        >
          <Feather name="x" size={16} color={COLORS.neutral[400]} />
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      {/* Search input */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          borderRadius: BORDER_RADIUS.md,
          borderWidth: 1,
          borderColor: isOpen ? COLORS.primary[300] : COLORS.cream[300],
          backgroundColor: COLORS.cream[50],
          paddingHorizontal: 10,
        }}
      >
        <TextInput
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          placeholderTextColor={COLORS.neutral[400]}
          style={{
            flex: 1,
            paddingVertical: 9,
            fontSize: 14,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[800],
            textAlign: 'right',
          }}
        />
      </View>

      {/* Dropdown */}
      {isOpen && (filtered.length > 0 || showAddNew) && (
        <View
          style={{
            marginTop: 4,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            backgroundColor: COLORS.cream[50],
            maxHeight: 200,
            overflow: 'hidden',
          }}
        >
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item)}
                style={({ pressed }) => ({
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.cream[200],
                  backgroundColor: pressed ? COLORS.primary[50] : 'transparent',
                })}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Rubik-Regular',
                    color: COLORS.neutral[700],
                    textAlign: 'right',
                  }}
                  numberOfLines={1}
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />

          {/* Add new option */}
          {showAddNew && (
            <Pressable
              onPress={() => handleSelect(query.trim())}
              style={({ pressed }) => ({
                paddingVertical: 10,
                paddingHorizontal: 12,
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: 6,
                backgroundColor: pressed ? COLORS.primary[50] : 'transparent',
              })}
            >
              <Feather name="plus" size={14} color={COLORS.primary[500]} />
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Rubik-Medium',
                  color: COLORS.primary[500],
                  textAlign: 'right',
                }}
              >
                הוסף: &quot;{query.trim()}&quot;
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
