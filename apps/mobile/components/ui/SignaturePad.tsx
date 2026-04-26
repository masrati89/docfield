import { useCallback, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Canvas, Path, Skia, useCanvasRef } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from '@/lib/haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

import type { SkPath, CanvasRef } from '@shopify/react-native-skia';

// --- Types ---

interface SignaturePadProps {
  onSave: (base64Png: string) => void;
  onClear?: () => void;
  height?: number;
  disabled?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
}

// --- Component ---

export function SignaturePad({
  onSave,
  onClear,
  height = 200,
  disabled = false,
  strokeColor = '#000000',
  strokeWidth = 2.5,
}: SignaturePadProps) {
  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState<SkPath[]>([]);
  const [hasStrokes, setHasStrokes] = useState(false);
  const currentPath = useRef<SkPath | null>(null);
  const pointCount = useRef(0);

  // --- Gesture ---

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .minDistance(0)
    .onBegin((e) => {
      const path = Skia.Path.Make();
      path.moveTo(e.x, e.y);
      currentPath.current = path;
      pointCount.current = 1;
    })
    .onUpdate((e) => {
      if (currentPath.current) {
        currentPath.current.lineTo(e.x, e.y);
        pointCount.current += 1;
        // Force re-render by cloning paths array with current in-progress path
        setPaths((prev) => {
          const updated = [...prev];
          // Replace last if it's the in-progress path, or add it
          if (
            updated.length > 0 &&
            updated[updated.length - 1] === currentPath.current
          ) {
            return [...updated];
          }
          return [...updated, currentPath.current!];
        });
      }
    })
    .onEnd(() => {
      if (currentPath.current && pointCount.current >= 2) {
        setHasStrokes(true);
      }
      currentPath.current = null;
    });

  // --- Actions ---

  const handleClear = useCallback(() => {
    setPaths([]);
    setHasStrokes(false);
    pointCount.current = 0;
    currentPath.current = null;
    onClear?.();
  }, [onClear]);

  const handleSave = useCallback(() => {
    if (!hasStrokes || !canvasRef.current) return;

    const image = canvasRef.current.makeImageSnapshot();
    const base64 = image.encodeToBase64();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSave(base64);
  }, [hasStrokes, canvasRef, onSave]);

  // --- Render ---

  const canSave = hasStrokes && !disabled;

  return (
    <View style={styles.container}>
      {/* Canvas */}
      <View
        style={[
          styles.canvasWrapper,
          { height },
          disabled && styles.canvasDisabled,
        ]}
      >
        <GestureDetector gesture={pan}>
          <View style={styles.canvasTouchArea}>
            <Canvas
              ref={canvasRef as React.RefObject<CanvasRef>}
              style={styles.canvas}
            >
              {paths.map((path, index) => (
                <Path
                  key={index}
                  path={path}
                  color={strokeColor}
                  style="stroke"
                  strokeWidth={strokeWidth}
                  strokeCap="round"
                  strokeJoin="round"
                />
              ))}
            </Canvas>

            {/* Placeholder */}
            {!hasStrokes && (
              <View style={styles.placeholderOverlay} pointerEvents="none">
                <Text style={styles.placeholderText}>חתום כאן</Text>
              </View>
            )}
          </View>
        </GestureDetector>
      </View>

      {/* Action buttons — RTL row-reverse */}
      <View style={styles.actionsRow}>
        {/* Save button */}
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          style={[
            styles.saveButton,
            {
              backgroundColor: canSave
                ? COLORS.primary[500]
                : COLORS.neutral[200],
            },
          ]}
        >
          <Text
            style={[
              styles.saveButtonText,
              { color: canSave ? COLORS.white : COLORS.neutral[400] },
            ]}
          >
            שמור חתימה
          </Text>
        </Pressable>

        {/* Clear button — only visible with strokes */}
        {hasStrokes && !disabled && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>נקה חתימה</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  canvasWrapper: {
    borderWidth: 1,
    borderColor: COLORS.cream[200],
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  canvasDisabled: {
    opacity: 0.5,
  },
  canvasTouchArea: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  placeholderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: COLORS.neutral[400],
  },
  actionsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  saveButtonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 14,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  clearButtonText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: COLORS.neutral[500],
  },
});
