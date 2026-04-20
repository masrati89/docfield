import { View, Text, Modal, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS, SHADOWS } from '@infield/ui';
import { PressableScale } from '@/components/ui';

interface HeaderDropdownMenuProps {
  visible: boolean;
  onClose: () => void;
  onPreview?: () => void;
  onDownload?: () => void;
  onSettings?: () => void;
  onManageCategories?: () => void;
  onShare?: () => void;
  onSaveDraft?: () => void;
}

interface MenuItem {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  handler?: () => void;
  isGreen?: boolean;
}

export function HeaderDropdownMenu({
  visible,
  onClose,
  onPreview,
  onDownload,
  onSettings,
  onManageCategories,
  onShare,
  onSaveDraft,
}: HeaderDropdownMenuProps) {
  const items: MenuItem[] = [
    {
      icon: 'eye',
      label:
        '\u05EA\u05E6\u05D5\u05D2\u05D4 \u05DE\u05E7\u05D3\u05D9\u05DE\u05D4',
      handler: onPreview,
    },
    {
      icon: 'file-text',
      label: '\u05D4\u05E4\u05E7\u05EA PDF',
      handler: onDownload,
    },
    {
      icon: 'sliders',
      label:
        '\u05D4\u05D2\u05D3\u05E8\u05D5\u05EA \u05EA\u05D1\u05E0\u05D9\u05EA',
      handler: onSettings,
    },
    {
      icon: 'grid',
      label:
        '\u05E0\u05D9\u05D4\u05D5\u05DC \u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D5\u05EA',
      handler: onManageCategories,
    },
    {
      icon: 'share-2',
      label: '\u05E9\u05D9\u05EA\u05D5\u05E3 \u05D3\u05D5\u05D7',
      handler: onShare,
    },
    {
      icon: 'check-circle',
      label: '\u05E9\u05DE\u05D9\u05E8\u05EA \u05D8\u05D9\u05D5\u05D8\u05D4',
      handler: onSaveDraft,
      isGreen: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      >
        {/* Menu card positioned top-left (visual left in RTL) */}
        <Pressable
          onPress={() => {}}
          style={{
            position: 'absolute',
            top: 100,
            left: 16,
            width: 220,
            backgroundColor: COLORS.white,
            borderRadius: 12,
            padding: 4,
            ...SHADOWS.lg,
          }}
        >
          {items.map((item, idx) => (
            <View key={item.icon}>
              <PressableScale
                onPress={() => {
                  onClose();
                  item.handler?.();
                }}
                style={{
                  height: 44,
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  paddingHorizontal: 14,
                  gap: 10,
                  borderRadius: 8,
                  backgroundColor: item.isGreen
                    ? COLORS.primary[50]
                    : 'transparent',
                }}
              >
                <Feather
                  name={item.icon}
                  size={18}
                  color={
                    item.isGreen ? COLORS.primary[500] : COLORS.neutral[600]
                  }
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '500',
                    fontFamily: 'Rubik-Medium',
                    color: item.isGreen
                      ? COLORS.primary[500]
                      : COLORS.neutral[700],
                    textAlign: 'right',
                    flex: 1,
                  }}
                >
                  {item.label}
                </Text>
              </PressableScale>
              {idx < items.length - 1 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: COLORS.cream[200],
                    marginHorizontal: 10,
                  }}
                />
              )}
            </View>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
