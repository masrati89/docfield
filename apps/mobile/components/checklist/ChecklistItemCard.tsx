import { useCallback, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { COLORS } from '@docfield/ui';
import type { ChecklistResultValue } from '@docfield/shared';
import type { ChecklistItemWithResult } from '@docfield/shared';

import { StatusPills } from './StatusPills';

// --- Types ---

interface ChecklistItemCardProps {
  item: ChecklistItemWithResult;
  onStatusChange: (itemId: string, result: ChecklistResultValue) => void;
  onNoteChange: (
    itemId: string,
    result: ChecklistResultValue,
    note: string
  ) => void;
}

// --- Component ---

export function ChecklistItemCard({
  item,
  onStatusChange,
  onNoteChange,
}: ChecklistItemCardProps) {
  const [localNote, setLocalNote] = useState(item.note ?? '');
  const showNoteInput = item.result !== undefined;

  const handleStatusChange = useCallback(
    (value: ChecklistResultValue) => {
      onStatusChange(item.id, value);
    },
    [item.id, onStatusChange]
  );

  const handleNoteChange = useCallback(
    (text: string) => {
      setLocalNote(text);
      if (item.result) {
        onNoteChange(item.id, item.result, text);
      }
    },
    [item.id, item.result, onNoteChange]
  );

  return (
    <View
      className="bg-white rounded-[14px] p-[16px] mb-[8px]"
      style={{
        borderWidth: 1,
        borderColor:
          item.result === 'fail' ? COLORS.danger[500] : COLORS.cream[200],
      }}
    >
      {/* Item description */}
      <Text
        className="text-[15px] font-rubik mb-[12px]"
        style={{
          color:
            item.result === 'na' ? COLORS.neutral[400] : COLORS.neutral[700],
        }}
      >
        {item.description}
      </Text>

      {/* Status pills */}
      <StatusPills value={item.result} onChange={handleStatusChange} />

      {/* Note input — shows after status is selected */}
      {showNoteInput ? (
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOut.duration(150)}
          className="mt-[12px]"
        >
          <TextInput
            value={localNote}
            onChangeText={handleNoteChange}
            placeholder="הוסף הערה..."
            placeholderTextColor={COLORS.neutral[400]}
            multiline
            numberOfLines={2}
            className="rounded-[10px] px-[14px] py-[10px] text-[15px] font-rubik text-neutral-700 bg-cream-50"
            style={{
              borderWidth: 1.5,
              borderColor: COLORS.cream[300],
              minHeight: 44,
              maxHeight: 88,
              textAlign: 'right',
              textAlignVertical: 'top',
            }}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}
