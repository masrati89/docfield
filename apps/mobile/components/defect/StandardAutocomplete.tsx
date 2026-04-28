import { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  I18nManager,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Fuse from 'fuse.js';
import * as Haptics from '@/lib/haptics';
import { COLORS } from '@infield/ui';
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { DropdownBase } from './DropdownBase';

interface StandardAutocompleteProps {
  label: string;
  standards: string[];
  selectedStandard?: string;
  onSelect: (standard: string | undefined) => void;
  placeholder?: string;
  maxHeight?: number;
}

function StandardItem({
  standard,
  isSelected,
  onPress,
}: {
  standard: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  // Defensive check: ensure standard is a string
  const standardStr = typeof standard === 'string' ? standard : String(standard);
  console.log('🔍 DEBUG StandardItem:', {
    standard: standardStr,
    type: typeof standard,
    isObject: typeof standard === 'object',
  });

  // Truncate long standards to 50 chars
  const displayText =
    standardStr.length > 50 ? standardStr.substring(0, 50) + '...' : standardStr;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'flex-start',
          paddingHorizontal: 12,
          paddingVertical: 10,
          gap: 10,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[100],
          backgroundColor: isSelected ? COLORS.primary[50] : 'transparent',
        }}
      >
        {/* Radio button */}
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: isSelected ? COLORS.primary[500] : COLORS.cream[300],
            backgroundColor: isSelected ? COLORS.primary[500] : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
          }}
        >
          {isSelected && (
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: COLORS.white,
              }}
            />
          )}
        </View>

        {/* Text */}
        <Text
          style={{
            flex: 1,
            fontSize: 12,
            fontFamily: isSelected ? 'Rubik-Medium' : 'Rubik-Regular',
            color: isSelected ? COLORS.primary[700] : COLORS.neutral[700],
            textAlign: 'right',
          }}
          numberOfLines={1}
        >
          {displayText}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function StandardAutocomplete({
  label,
  standards,
  selectedStandard,
  onSelect,
  placeholder = 'הקלד תקן...',
  maxHeight = 300,
}: StandardAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Debug: Log what we receive
  console.log('🔍 DEBUG StandardAutocomplete - received props:', {
    label,
    standardsCount: standards.length,
    standardsType: typeof standards[0],
    standardsSamples: standards.slice(0, 5),
    allStandards: standards,
    selectedStandard,
  });
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Fuse.js search
  const fuse = useMemo(() => {
    // Ensure standards is an array of strings, not objects
    const standardsArray = standards.filter(
      (s): s is string => typeof s === 'string'
    );
    if (standardsArray.length !== standards.length) {
      console.warn('🚨 WARNING: standards contains non-string items!', {
        totalCount: standards.length,
        stringCount: standardsArray.length,
        nonStringItems: standards.filter((s) => typeof s !== 'string'),
      });
    }

    return new Fuse(standardsArray, {
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [standards]);

  // Filtered standards based on search (max 10)
  const filteredStandards = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const results = fuse.search(searchQuery).slice(0, 10);
    const mapped = results.map((r) => r.item);
    console.log('🔍 DEBUG StandardAutocomplete - filtered:', {
      searchQuery,
      fuseResultsCount: results.length,
      mappedResults: mapped,
      fuseRawResults: results,
    });
    return mapped;
  }, [searchQuery, fuse]);

  // Debounced search handler
  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);

      // Clear previous timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      // Set new debounce (250ms)
      const timeout = setTimeout(() => {
        // Debounce complete, search is ready
      }, 250);

      setSearchTimeout(timeout);
    },
    [searchTimeout]
  );

  // Handle standard selection
  const handleSelect = useCallback(
    (standard: string) => {
      if (selectedStandard === standard) {
        // Deselect if clicking the same one
        onSelect(undefined);
      } else {
        onSelect(standard);
      }
      setIsOpen(false);
      setSearchQuery('');
    },
    [selectedStandard, onSelect]
  );

  // Handle clear selection
  const handleClearSelection = useCallback(() => {
    onSelect(undefined);
    setSearchQuery('');
  }, [onSelect]);

  // Determine display label
  const displayLabel = useMemo(() => {
    if (selectedStandard) {
      const truncated =
        selectedStandard.length > 30
          ? selectedStandard.substring(0, 30) + '...'
          : selectedStandard;
      return `${label}: ${truncated}`;
    }
    return label;
  }, [label, selectedStandard]);

  const shouldShowClearButton = useMemo(
    () => selectedStandard !== undefined,
    [selectedStandard]
  );

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <DropdownBase
        label={displayLabel}
        isOpen={isOpen}
        onToggle={() => {
          setIsOpen(!isOpen);
          if (isOpen) {
            setSearchQuery('');
          }
        }}
        maxHeight={maxHeight}
      >
        {/* Search input */}
        <View
          style={{
            flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
            alignItems: 'center',
            backgroundColor: COLORS.cream[50],
            borderBottomWidth: 1,
            borderBottomColor: COLORS.cream[200],
            paddingHorizontal: 10,
            gap: 6,
          }}
        >
          <Feather
            name="search"
            size={16}
            color={searchQuery ? COLORS.primary[500] : COLORS.neutral[400]}
          />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder={placeholder}
            placeholderTextColor={COLORS.neutral[400]}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 8,
              fontSize: 13,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[800],
              textAlign: 'right',
            }}
          />
          {searchQuery && (
            <Pressable
              onPress={() => {
                setSearchQuery('');
              }}
              hitSlop={8}
            >
              <Feather name="x" size={14} color={COLORS.neutral[400]} />
            </Pressable>
          )}
        </View>

        {/* Results */}
        {searchQuery.trim() ? (
          filteredStandards.length > 0 ? (
            <View>
              {filteredStandards.map((standard, idx) => {
                console.log(`🔍 DEBUG StandardAutocomplete - rendering item ${idx}:`, {
                  standard,
                  type: typeof standard,
                  isString: typeof standard === 'string',
                });
                return (
                  <StandardItem
                    key={standard}
                    standard={standard}
                    isSelected={selectedStandard === standard}
                    onPress={() => handleSelect(standard)}
                  />
                );
              })}
            </View>
          ) : (
            <View
              style={{
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[400],
                }}
              >
                אין תקנים תואמים
              </Text>
            </View>
          )
        ) : (
          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 12,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[400],
                textAlign: 'center',
              }}
            >
              התחל להקליד כדי לחפוש תקנים
            </Text>
          </View>
        )}

        {/* Clear selection button */}
        {shouldShowClearButton && (
          <View
            style={{ borderTopWidth: 1, borderTopColor: COLORS.cream[200] }}
          >
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                handleClearSelection();
              }}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Rubik-Medium',
                  color: COLORS.primary[500],
                }}
              >
                נקה בחירה
              </Text>
            </Pressable>
          </View>
        )}
      </DropdownBase>
    </View>
  );
}
