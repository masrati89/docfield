import { useCallback, useState } from 'react';

interface UseMultiDropdownReturn<T> {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleOpen: () => void;
  selected: T[];
  setSelected: (items: T[]) => void;
  toggleOption: (option: T) => void;
  clearAll: () => void;
  isSelected: (option: T) => boolean;
  selectedCount: number;
}

/**
 * Generic hook for managing multi-select dropdown state
 * @template T Type of options being selected
 * @param _options Array of available options (unused, kept for API consistency)
 * @param initialSelected Initial selected items
 * @param onSelectionChange Optional callback when selection changes
 */
export function useMultiDropdown<T>(
  _options: T[] = [],
  initialSelected: T[] = [],
  onSelectionChange?: (selected: T[]) => void
): UseMultiDropdownReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<T[]>(initialSelected);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const toggleOption = useCallback(
    (option: T) => {
      setSelected((prev) => {
        const isAlreadySelected = prev.some((s) => s === option);
        const updated = isAlreadySelected
          ? prev.filter((s) => s !== option)
          : [...prev, option];

        if (onSelectionChange) {
          onSelectionChange(updated);
        }
        return updated;
      });
    },
    [onSelectionChange]
  );

  const clearAll = useCallback(() => {
    setSelected([]);
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  }, [onSelectionChange]);

  const isSelected = useCallback(
    (option: T) => selected.some((s) => s === option),
    [selected]
  );

  return {
    isOpen,
    setIsOpen,
    toggleOpen,
    selected,
    setSelected,
    toggleOption,
    clearAll,
    isSelected,
    selectedCount: selected.length,
  };
}
