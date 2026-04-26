import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

import type { AnnotationTool } from '@/lib/annotations';

interface AnnotationToolbarProps {
  activeTool: AnnotationTool;
  onToolChange: (tool: AnnotationTool) => void;
  canUndo: boolean;
  onUndo: () => void;
}

const TOOLS: { key: AnnotationTool; icon: string; label: string }[] = [
  { key: 'arrow', icon: 'arrow-up-right', label: 'חץ' },
  { key: 'circle', icon: 'circle', label: 'עיגול' },
  { key: 'underline', icon: 'minus', label: 'קו' },
  { key: 'text', icon: 'type', label: 'טקסט' },
];

export function AnnotationToolbar({
  activeTool,
  onToolChange,
  canUndo,
  onUndo,
}: AnnotationToolbarProps) {
  const handleToolPress = (tool: AnnotationTool) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToolChange(tool);
  };

  const handleUndo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onUndo();
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolsRow}>
        {TOOLS.map((tool) => {
          const isActive = activeTool === tool.key;
          return (
            <Pressable
              key={tool.key}
              onPress={() => handleToolPress(tool.key)}
              style={[styles.toolButton, isActive && styles.toolButtonActive]}
            >
              <Feather
                name={tool.icon as keyof typeof Feather.glyphMap}
                size={20}
                color={isActive ? COLORS.white : COLORS.neutral[600]}
              />
              <Text
                style={[styles.toolLabel, isActive && styles.toolLabelActive]}
              >
                {tool.label}
              </Text>
            </Pressable>
          );
        })}

        {/* Separator */}
        <View style={styles.separator} />

        {/* Undo button */}
        <Pressable
          onPress={handleUndo}
          disabled={!canUndo}
          style={[styles.undoButton, !canUndo && styles.undoButtonDisabled]}
        >
          <Feather
            name="rotate-ccw"
            size={20}
            color={canUndo ? COLORS.neutral[600] : COLORS.neutral[300]}
          />
          <Text
            style={[
              styles.toolLabel,
              !canUndo && { color: COLORS.neutral[300] },
            ]}
          >
            בטל
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.cream[50],
    borderTopWidth: 1,
    borderTopColor: COLORS.cream[200],
  },
  toolsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  toolButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.cream[100],
    gap: 2,
  },
  toolButtonActive: {
    backgroundColor: COLORS.primary[500],
  },
  toolLabel: {
    fontSize: 10,
    fontFamily: 'Rubik-Medium',
    color: COLORS.neutral[600],
  },
  toolLabelActive: {
    color: COLORS.white,
  },
  separator: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.cream[200],
    marginHorizontal: 4,
  },
  undoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    gap: 2,
  },
  undoButtonDisabled: {
    opacity: 0.5,
  },
});
