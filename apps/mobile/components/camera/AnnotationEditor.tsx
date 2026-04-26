import { useCallback, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Canvas,
  Image,
  Line as SkiaLine,
  Oval,
  Path,
  Skia,
  useImage,
  vec,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from '@/lib/haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { useAnnotationEditor } from '@/hooks/useAnnotationEditor';
import { AnnotationToolbar } from './AnnotationToolbar';

import type { AnnotationLayer, Annotation } from '@/lib/annotations';

// --- Types ---

interface AnnotationEditorProps {
  visible: boolean;
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  initialAnnotations?: AnnotationLayer;
  onSave: (annotations: AnnotationLayer) => void;
  onClose: () => void;
}

interface LivePreview {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const STROKE_COLOR = '#FF0000';
const STROKE_WIDTH = 3;

// --- Helpers ---

function denorm(v: number, dim: number) {
  return v * dim;
}

// --- Sub-components ---

function RenderedAnnotation({
  annotation,
  cw,
  ch,
}: {
  annotation: Annotation;
  cw: number;
  ch: number;
}) {
  const [p0, p1] = annotation.points;
  if (!p0) return null;

  const x1 = denorm(p0.x, cw);
  const y1 = denorm(p0.y, ch);

  if (annotation.tool === 'arrow' && p1) {
    const x2 = denorm(p1.x, cw);
    const y2 = denorm(p1.y, ch);
    const path = buildArrowPath(x1, y1, x2, y2);
    return (
      <Path
        path={path}
        color={annotation.color}
        style="stroke"
        strokeWidth={annotation.strokeWidth}
        strokeCap="round"
        strokeJoin="round"
      />
    );
  }

  if (annotation.tool === 'circle' && p1) {
    const x2 = denorm(p1.x, cw);
    const y2 = denorm(p1.y, ch);
    const rx = Math.abs(x2 - x1);
    const ry = Math.abs(y2 - y1);
    return (
      <Oval
        x={x1 - rx}
        y={y1 - ry}
        width={rx * 2}
        height={ry * 2}
        color={annotation.color}
        style="stroke"
        strokeWidth={annotation.strokeWidth}
      />
    );
  }

  if (annotation.tool === 'underline' && p1) {
    const x2 = denorm(p1.x, cw);
    const y2 = denorm(p1.y, ch);
    return (
      <SkiaLine
        p1={vec(x1, y1)}
        p2={vec(x2, y2)}
        color={annotation.color}
        strokeWidth={annotation.strokeWidth}
      />
    );
  }

  return null;
}

function buildArrowPath(x1: number, y1: number, x2: number, y2: number) {
  const path = Skia.Path.Make();
  path.moveTo(x1, y1);
  path.lineTo(x2, y2);
  // Arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 14;
  const a1 = angle - Math.PI * 0.75;
  const a2 = angle + Math.PI * 0.75;
  path.moveTo(x2, y2);
  path.lineTo(x2 + size * Math.cos(a1), y2 + size * Math.sin(a1));
  path.moveTo(x2, y2);
  path.lineTo(x2 + size * Math.cos(a2), y2 + size * Math.sin(a2));
  return path;
}

function LivePreviewShape({
  tool,
  preview,
}: {
  tool: string;
  preview: LivePreview;
}) {
  const { x1, y1, x2, y2 } = preview;

  if (tool === 'arrow') {
    const path = buildArrowPath(x1, y1, x2, y2);
    return (
      <Path
        path={path}
        color={STROKE_COLOR}
        style="stroke"
        strokeWidth={STROKE_WIDTH}
        strokeCap="round"
        strokeJoin="round"
      />
    );
  }
  if (tool === 'circle') {
    const rx = Math.abs(x2 - x1);
    const ry = Math.abs(y2 - y1);
    return (
      <Oval
        x={x1 - rx}
        y={y1 - ry}
        width={rx * 2}
        height={ry * 2}
        color={STROKE_COLOR}
        style="stroke"
        strokeWidth={STROKE_WIDTH}
      />
    );
  }
  if (tool === 'underline') {
    return (
      <SkiaLine
        p1={vec(x1, y1)}
        p2={vec(x2, y2)}
        color={STROKE_COLOR}
        strokeWidth={STROKE_WIDTH}
      />
    );
  }
  return null;
}

// --- Main Component ---

export function AnnotationEditor({
  visible,
  imageUri,
  imageWidth,
  imageHeight,
  initialAnnotations,
  onSave,
  onClose,
}: AnnotationEditorProps) {
  const insets = useSafeAreaInsets();
  const image = useImage(imageUri);
  const editor = useAnnotationEditor();

  const [canvasLayout, setCanvasLayout] = useState({ width: 0, height: 0 });
  const [livePreview, setLivePreview] = useState<LivePreview | null>(null);
  const [textModalVisible, setTextModalVisible] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textTapPos, setTextTapPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [textAnnotations, setTextAnnotations] = useState<
    Array<{ id: string; text: string; x: number; y: number }>
  >([]);

  const gestureStart = useRef<{ x: number; y: number } | null>(null);

  // Load initial annotations on first open
  const hasLoaded = useRef(false);
  if (visible && !hasLoaded.current && initialAnnotations) {
    editor.loadLayer(initialAnnotations);
    hasLoaded.current = true;
  }
  if (!visible && hasLoaded.current) {
    hasLoaded.current = false;
  }

  const cw = canvasLayout.width;
  const ch = canvasLayout.height;

  const pan = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .onBegin((e) => {
      if (editor.activeTool === 'text') return;
      gestureStart.current = { x: e.x, y: e.y };
    })
    .onUpdate((e) => {
      if (editor.activeTool === 'text' || !gestureStart.current) return;
      setLivePreview({
        x1: gestureStart.current.x,
        y1: gestureStart.current.y,
        x2: e.x,
        y2: e.y,
      });
    })
    .onEnd((e) => {
      if (editor.activeTool === 'text' || !gestureStart.current || !cw || !ch)
        return;
      const sx = gestureStart.current.x;
      const sy = gestureStart.current.y;
      const ex = e.x;
      const ey = e.y;

      if (Math.abs(ex - sx) < 5 && Math.abs(ey - sy) < 5) {
        gestureStart.current = null;
        setLivePreview(null);
        return;
      }

      editor.addAnnotation({
        tool: editor.activeTool,
        points: [
          { x: sx / cw, y: sy / ch },
          { x: ex / cw, y: ey / ch },
        ],
        color: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
      });

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      gestureStart.current = null;
      setLivePreview(null);
    });

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd((e) => {
      if (editor.activeTool !== 'text' || !cw || !ch) return;
      setTextTapPos({ x: e.x / cw, y: e.y / ch });
      setTextModalVisible(true);
    });

  const gesture = Gesture.Simultaneous(pan, tap);

  const handleAddText = useCallback(() => {
    if (!textTapPos || !textInput.trim()) return;
    const id = String(Date.now());
    setTextAnnotations((prev) => [
      ...prev,
      { id, text: textInput.trim(), x: textTapPos.x, y: textTapPos.y },
    ]);
    setTextInput('');
    setTextTapPos(null);
    setTextModalVisible(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [textInput, textTapPos]);

  const handleSave = useCallback(() => {
    const layer = editor.toLayer(imageWidth, imageHeight);
    onSave(layer);
  }, [editor, imageWidth, imageHeight, onSave]);

  // Compute aspect-fit canvas size
  const aspectRatio = imageWidth / imageHeight;

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleSave} style={styles.headerBtn}>
            <Text style={styles.saveText}>שמור</Text>
          </Pressable>
          <Text style={styles.headerTitle}>עריכת תמונה</Text>
          <Pressable onPress={onClose} style={styles.headerBtn}>
            <Text style={styles.cancelText}>ביטול</Text>
          </Pressable>
        </View>

        {/* Canvas area */}
        <View style={styles.canvasContainer}>
          <GestureDetector gesture={gesture}>
            <View
              style={[styles.canvasWrapper, { aspectRatio }]}
              onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setCanvasLayout({ width, height });
              }}
            >
              <Canvas style={StyleSheet.absoluteFill}>
                {image && (
                  <Image
                    image={image}
                    x={0}
                    y={0}
                    width={cw}
                    height={ch}
                    fit="fill"
                  />
                )}
                {editor.annotations.map((ann) => (
                  <RenderedAnnotation
                    key={ann.id}
                    annotation={ann}
                    cw={cw}
                    ch={ch}
                  />
                ))}
                {livePreview && (
                  <LivePreviewShape
                    tool={editor.activeTool}
                    preview={livePreview}
                  />
                )}
              </Canvas>

              {/* Text overlays */}
              {textAnnotations.map((t) => (
                <View
                  key={t.id}
                  style={[
                    styles.textOverlayWrapper,
                    { left: t.x * cw, top: t.y * ch },
                  ]}
                  pointerEvents="none"
                >
                  <Text style={styles.textOverlay}>{t.text}</Text>
                </View>
              ))}
            </View>
          </GestureDetector>
        </View>

        {/* Toolbar */}
        <View style={{ paddingBottom: insets.bottom }}>
          <AnnotationToolbar
            activeTool={editor.activeTool}
            onToolChange={editor.setActiveTool}
            canUndo={editor.canUndo}
            onUndo={editor.undo}
          />
        </View>
      </View>

      {/* Text input modal */}
      <Modal
        visible={textModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTextModalVisible(false)}
      >
        <View style={styles.textModalOverlay}>
          <View style={styles.textModalBox}>
            <Text style={styles.textModalTitle}>הוסף טקסט</Text>
            <TextInput
              style={styles.textModalInput}
              value={textInput}
              onChangeText={setTextInput}
              placeholder="הזן טקסט..."
              autoFocus
              textAlign="right"
            />
            <View style={styles.textModalActions}>
              <Pressable
                onPress={() => setTextModalVisible(false)}
                style={styles.textModalCancel}
              >
                <Text style={styles.textModalCancelText}>ביטול</Text>
              </Pressable>
              <Pressable
                onPress={handleAddText}
                style={styles.textModalConfirm}
              >
                <Text style={styles.textModalConfirmText}>הוסף</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[900],
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    minWidth: 60,
  },
  headerTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
  },
  saveText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    color: COLORS.primary[400],
    textAlign: 'right',
  },
  cancelText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'left',
  },
  canvasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasWrapper: {
    width: '100%',
    maxHeight: '100%',
  },
  textOverlayWrapper: {
    position: 'absolute',
  },
  textOverlay: {
    fontFamily: 'Rubik-Bold',
    fontSize: 16,
    color: STROKE_COLOR,
  },
  textModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(60,54,42,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  textModalBox: {
    backgroundColor: COLORS.cream[50],
    borderRadius: BORDER_RADIUS.lg,
    padding: 20,
    width: '100%',
    gap: 16,
  },
  textModalTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    color: COLORS.neutral[900],
    textAlign: 'center',
  },
  textModalInput: {
    borderWidth: 1,
    borderColor: COLORS.cream[200],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: COLORS.neutral[900],
    minHeight: 44,
  },
  textModalActions: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    gap: 12,
  },
  textModalConfirm: {
    backgroundColor: COLORS.primary[500],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textModalConfirmText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
  textModalCancel: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textModalCancelText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: COLORS.neutral[500],
  },
});
