# Camera Overlay & Photo Annotation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade camera to continuous capture with badge counter, post-capture preview, review grid, and Skia-based photo annotation (arrows, circles, underlines, text) with non-destructive annotation layers stored as JSON.

**Architecture:** Three modular components (CameraCapture v2 + AnnotationEditor + PhotoReviewGrid) sharing a common `AnnotationLayer` type. Annotations stored as normalized JSON in `defect_photos.annotations_json`, composited onto images only at PDF generation time. Skia Canvas for rendering/drawing, gesture handler for interaction.

**Tech Stack:** @shopify/react-native-skia 2.4.18 (installed), react-native-gesture-handler, expo-camera, expo-image-manipulator, Supabase Storage + PostgreSQL

**Design spec:** `docs/superpowers/specs/2026-04-05-camera-overlay-design.md`

---

## File Structure

| Action | Path                                                  | Responsibility                                                                |
| ------ | ----------------------------------------------------- | ----------------------------------------------------------------------------- |
| Create | `apps/mobile/lib/annotations/types.ts`                | Annotation types (AnnotationTool, Annotation, AnnotationLayer, CapturedPhoto) |
| Create | `apps/mobile/lib/annotations/renderAnnotations.ts`    | Offscreen Skia compositing: image + annotations → base64 PNG                  |
| Create | `apps/mobile/lib/annotations/index.ts`                | Barrel exports                                                                |
| Create | `apps/mobile/hooks/useAnnotationEditor.ts`            | Annotation state: active tool, annotations array, undo, toLayer/loadLayer     |
| Create | `apps/mobile/components/camera/AnnotationEditor.tsx`  | Full-screen Skia annotation editor modal                                      |
| Create | `apps/mobile/components/camera/AnnotationToolbar.tsx` | Bottom toolbar: arrow, circle, underline, text, undo                          |
| Create | `apps/mobile/components/camera/CameraPreview.tsx`     | Post-capture preview with confirm/edit buttons                                |
| Create | `apps/mobile/components/camera/PhotoReviewGrid.tsx`   | Grid review modal before final save                                           |
| Create | `apps/mobile/components/camera/index.ts`              | Barrel exports for camera module                                              |
| Create | `supabase/migrations/018_add_annotations_json.sql`    | Add annotations_json JSONB column                                             |
| Modify | `apps/mobile/components/camera/CameraCapture.tsx`     | Continuous capture, badge, preview flow                                       |
| Modify | `apps/mobile/components/defect/PhotoGrid.tsx`         | Tap photo → open AnnotationEditor                                             |
| Modify | `apps/mobile/app/(app)/reports/[id]/add-defect.tsx`   | New CameraCapture v2 integration                                              |
| Modify | `apps/mobile/lib/pdf/types.ts`                        | Add annotationsJson to PdfDefect                                              |
| Modify | `apps/mobile/lib/pdf/shared.ts`                       | Render annotations onto photos for PDF                                        |
| Modify | `packages/shared/src/i18n/he.json`                    | Hebrew strings for camera/annotation UI                                       |
| Modify | `packages/shared/src/i18n/en.json`                    | English strings for camera/annotation UI                                      |

---

### Task 1: DB Migration + Annotation Types

**Files:**

- Create: `supabase/migrations/018_add_annotations_json.sql`
- Create: `apps/mobile/lib/annotations/types.ts`
- Create: `apps/mobile/lib/annotations/index.ts`

- [ ] **Step 1: Create the migration file**

Create `supabase/migrations/018_add_annotations_json.sql`:

```sql
-- Add non-destructive annotation layer to defect photos
ALTER TABLE defect_photos
ADD COLUMN annotations_json JSONB DEFAULT NULL;

COMMENT ON COLUMN defect_photos.annotations_json IS
  'Non-destructive annotation layer (arrows, circles, underlines, text) as JSON. Original photo unchanged.';
```

- [ ] **Step 2: Create annotation types**

Create `apps/mobile/lib/annotations/types.ts`:

```typescript
// --- Annotation Data Types ---
// All coordinates normalized to 0-1 range relative to image dimensions.

export type AnnotationTool = 'arrow' | 'circle' | 'underline' | 'text';

export interface AnnotationPoint {
  x: number; // 0-1 normalized
  y: number; // 0-1 normalized
}

export interface Annotation {
  id: string;
  tool: AnnotationTool;
  points: AnnotationPoint[];
  text?: string; // only for 'text' tool
  color: string; // default: '#FF0000'
  strokeWidth: number; // default: 3
}

export interface AnnotationLayer {
  version: 1;
  width: number; // original image pixel width
  height: number; // original image pixel height
  annotations: Annotation[];
}

export interface CapturedPhoto {
  id: string;
  uri: string;
  width: number;
  height: number;
  annotations?: AnnotationLayer;
}
```

- [ ] **Step 3: Create barrel export**

Create `apps/mobile/lib/annotations/index.ts`:

```typescript
export type {
  AnnotationTool,
  AnnotationPoint,
  Annotation,
  AnnotationLayer,
  CapturedPhoto,
} from './types';
```

- [ ] **Step 4: Run typecheck**

Run: `cd /home/masrati/infield && npm run typecheck`
Expected: PASS — no errors from new files

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/018_add_annotations_json.sql apps/mobile/lib/annotations/
git commit -m "feat(camera): add annotation types and DB migration"
```

---

### Task 2: i18n Strings

**Files:**

- Modify: `packages/shared/src/i18n/he.json`
- Modify: `packages/shared/src/i18n/en.json`

- [ ] **Step 1: Add Hebrew camera/annotation strings**

Add a new `"camera"` section to `packages/shared/src/i18n/he.json` after the `"summary"` section (before the closing `}`):

```json
"camera": {
  "badge": "תמונות",
  "confirm": "אשר",
  "editPhoto": "ערוך",
  "retake": "צלם שוב",
  "done": "סיום",
  "reviewTitle": "סקירת תמונות",
  "confirmAll": "אשר הכל",
  "deleteConfirm": "למחוק את התמונה?",
  "deleteConfirmBody": "פעולה זו אינה הפיכה",
  "maxPhotos": "ניתן להוסיף עד 10 תמונות",
  "annotationTitle": "עריכת תמונה",
  "toolArrow": "חץ",
  "toolCircle": "עיגול",
  "toolUnderline": "קו",
  "toolText": "טקסט",
  "undo": "בטל",
  "saveAnnotation": "שמור",
  "cancelAnnotation": "ביטול",
  "textPlaceholder": "הקלד טקסט...",
  "noAnnotations": "אין סימונים"
}
```

- [ ] **Step 2: Add English camera/annotation strings**

Add matching `"camera"` section to `packages/shared/src/i18n/en.json`:

```json
"camera": {
  "badge": "Photos",
  "confirm": "Confirm",
  "editPhoto": "Edit",
  "retake": "Retake",
  "done": "Done",
  "reviewTitle": "Review Photos",
  "confirmAll": "Confirm All",
  "deleteConfirm": "Delete photo?",
  "deleteConfirmBody": "This action cannot be undone",
  "maxPhotos": "Maximum 10 photos allowed",
  "annotationTitle": "Edit Photo",
  "toolArrow": "Arrow",
  "toolCircle": "Circle",
  "toolUnderline": "Line",
  "toolText": "Text",
  "undo": "Undo",
  "saveAnnotation": "Save",
  "cancelAnnotation": "Cancel",
  "textPlaceholder": "Enter text...",
  "noAnnotations": "No annotations"
}
```

- [ ] **Step 3: Run typecheck**

Run: `cd /home/masrati/infield && npm run typecheck`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add packages/shared/src/i18n/he.json packages/shared/src/i18n/en.json
git commit -m "feat(camera): add i18n strings for camera and annotation UI"
```

---

### Task 3: useAnnotationEditor Hook

**Files:**

- Create: `apps/mobile/hooks/useAnnotationEditor.ts`

- [ ] **Step 1: Create the hook**

Create `apps/mobile/hooks/useAnnotationEditor.ts`:

```typescript
import { useCallback, useState } from 'react';
import * as Crypto from 'expo-crypto';

import type {
  AnnotationTool,
  Annotation,
  AnnotationLayer,
} from '@/lib/annotations';

interface UseAnnotationEditorReturn {
  activeTool: AnnotationTool;
  setActiveTool: (tool: AnnotationTool) => void;
  annotations: Annotation[];
  addAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  undo: () => void;
  canUndo: boolean;
  clear: () => void;
  toLayer: (width: number, height: number) => AnnotationLayer;
  loadLayer: (layer: AnnotationLayer) => void;
}

const DEFAULT_COLOR = '#FF0000';
const DEFAULT_STROKE_WIDTH = 3;

export function useAnnotationEditor(): UseAnnotationEditorReturn {
  const [activeTool, setActiveTool] = useState<AnnotationTool>('arrow');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const addAnnotation = useCallback((annotation: Omit<Annotation, 'id'>) => {
    const full: Annotation = {
      ...annotation,
      id: Crypto.randomUUID(),
      color: annotation.color || DEFAULT_COLOR,
      strokeWidth: annotation.strokeWidth || DEFAULT_STROKE_WIDTH,
    };
    setAnnotations((prev) => [...prev, full]);
  }, []);

  const undo = useCallback(() => {
    setAnnotations((prev) => prev.slice(0, -1));
  }, []);

  const clear = useCallback(() => {
    setAnnotations([]);
  }, []);

  const toLayer = useCallback(
    (width: number, height: number): AnnotationLayer => ({
      version: 1,
      width,
      height,
      annotations,
    }),
    [annotations]
  );

  const loadLayer = useCallback((layer: AnnotationLayer) => {
    setAnnotations(layer.annotations);
  }, []);

  return {
    activeTool,
    setActiveTool,
    annotations,
    addAnnotation,
    undo,
    canUndo: annotations.length > 0,
    clear,
    toLayer,
    loadLayer,
  };
}
```

- [ ] **Step 2: Run typecheck**

Run: `cd /home/masrati/infield && npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/hooks/useAnnotationEditor.ts
git commit -m "feat(camera): add useAnnotationEditor hook"
```

---

### Task 4: AnnotationToolbar Component

**Files:**

- Create: `apps/mobile/components/camera/AnnotationToolbar.tsx`

- [ ] **Step 1: Create the toolbar component**

Create `apps/mobile/components/camera/AnnotationToolbar.tsx`:

```typescript
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

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
              style={[
                styles.toolButton,
                isActive && styles.toolButtonActive,
              ]}
            >
              <Feather
                name={tool.icon as keyof typeof Feather.glyphMap}
                size={20}
                color={isActive ? COLORS.white : COLORS.neutral[600]}
              />
              <Text
                style={[
                  styles.toolLabel,
                  isActive && styles.toolLabelActive,
                ]}
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
```

- [ ] **Step 2: Run typecheck**

Run: `cd /home/masrati/infield && npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/components/camera/AnnotationToolbar.tsx
git commit -m "feat(camera): add AnnotationToolbar component"
```

---

### Task 5: AnnotationEditor Component

**Files:**

- Create: `apps/mobile/components/camera/AnnotationEditor.tsx`

**Context:** This is the core annotation component. It renders the photo as a Skia Image background, overlays annotations as Skia Paths/Shapes, and uses gesture handler for drawing. Reference `apps/mobile/components/ui/SignaturePad.tsx` for Skia + gesture patterns already used in this codebase.

- [ ] **Step 1: Create the AnnotationEditor**

Create `apps/mobile/components/camera/AnnotationEditor.tsx`:

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import {
  Canvas,
  Path,
  Skia,
  useImage,
  Image as SkiaImage,
  Oval,
  Line as SkiaLine,
  vec,
  useFont,
  SkText,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { useAnnotationEditor } from '@/hooks/useAnnotationEditor';
import { AnnotationToolbar } from './AnnotationToolbar';

import type { AnnotationLayer, AnnotationPoint, Annotation } from '@/lib/annotations';

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

// --- Constants ---

const SCREEN = Dimensions.get('window');
const ANNOTATION_COLOR = '#FF0000';
const STROKE_WIDTH = 3;
const ARROWHEAD_SIZE = 12;

// --- Helpers ---

function normalizePoint(
  x: number,
  y: number,
  canvasW: number,
  canvasH: number
): AnnotationPoint {
  return { x: x / canvasW, y: y / canvasH };
}

function denormX(nx: number, canvasW: number): number {
  return nx * canvasW;
}

function denormY(ny: number, canvasH: number): number {
  return ny * canvasH;
}

// --- Component ---

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

  // Canvas dimensions — fit image aspect ratio within screen
  const canvasLayout = useMemo(() => {
    const availW = SCREEN.width;
    const availH = SCREEN.height - insets.top - insets.bottom - 140; // header + toolbar
    const aspectRatio = imageWidth / imageHeight;
    let w = availW;
    let h = w / aspectRatio;
    if (h > availH) {
      h = availH;
      w = h * aspectRatio;
    }
    return { width: Math.round(w), height: Math.round(h) };
  }, [imageWidth, imageHeight, insets]);

  // Load initial annotations
  useEffect(() => {
    if (initialAnnotations) {
      editor.loadLayer(initialAnnotations);
    }
  }, []); // only on mount

  // Drawing state
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const [liveEnd, setLiveEnd] = useState<{ x: number; y: number } | null>(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);

  // --- Gesture for drawing ---
  const drawGesture = Gesture.Pan()
    .minDistance(0)
    .onBegin((e) => {
      if (editor.activeTool === 'text') {
        // Text tool: tap to place
        setTextPosition({ x: e.x, y: e.y });
        setTextInputValue('');
        setShowTextInput(true);
        return;
      }
      startPoint.current = { x: e.x, y: e.y };
      setLiveEnd(null);
    })
    .onUpdate((e) => {
      if (editor.activeTool === 'text') return;
      setLiveEnd({ x: e.x, y: e.y });
    })
    .onEnd((e) => {
      if (editor.activeTool === 'text') return;
      if (!startPoint.current) return;

      const start = normalizePoint(
        startPoint.current.x,
        startPoint.current.y,
        canvasLayout.width,
        canvasLayout.height
      );
      const end = normalizePoint(e.x, e.y, canvasLayout.width, canvasLayout.height);

      editor.addAnnotation({
        tool: editor.activeTool,
        points: [start, end],
        color: ANNOTATION_COLOR,
        strokeWidth: STROKE_WIDTH,
      });

      startPoint.current = null;
      setLiveEnd(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    });

  // --- Text confirm ---
  const handleTextConfirm = useCallback(() => {
    if (!textPosition || !textInputValue.trim()) {
      setShowTextInput(false);
      return;
    }

    const pos = normalizePoint(
      textPosition.x,
      textPosition.y,
      canvasLayout.width,
      canvasLayout.height
    );

    editor.addAnnotation({
      tool: 'text',
      points: [pos],
      text: textInputValue.trim(),
      color: ANNOTATION_COLOR,
      strokeWidth: STROKE_WIDTH,
    });

    setShowTextInput(false);
    setTextInputValue('');
    setTextPosition(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [textPosition, textInputValue, canvasLayout, editor]);

  // --- Save ---
  const handleSave = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const layer = editor.toLayer(imageWidth, imageHeight);
    onSave(layer);
  }, [editor, imageWidth, imageHeight, onSave]);

  // --- Render annotations as Skia elements ---
  const renderAnnotation = useCallback(
    (annotation: Annotation, cw: number, ch: number) => {
      const p0 = annotation.points[0];
      const p1 = annotation.points[1];
      const color = annotation.color;
      const sw = annotation.strokeWidth;

      switch (annotation.tool) {
        case 'arrow': {
          if (!p0 || !p1) return null;
          const x0 = denormX(p0.x, cw);
          const y0 = denormY(p0.y, ch);
          const x1 = denormX(p1.x, cw);
          const y1 = denormY(p1.y, ch);

          // Line
          const linePath = Skia.Path.Make();
          linePath.moveTo(x0, y0);
          linePath.lineTo(x1, y1);

          // Arrowhead
          const angle = Math.atan2(y1 - y0, x1 - x0);
          const headPath = Skia.Path.Make();
          headPath.moveTo(x1, y1);
          headPath.lineTo(
            x1 - ARROWHEAD_SIZE * Math.cos(angle - Math.PI / 6),
            y1 - ARROWHEAD_SIZE * Math.sin(angle - Math.PI / 6)
          );
          headPath.moveTo(x1, y1);
          headPath.lineTo(
            x1 - ARROWHEAD_SIZE * Math.cos(angle + Math.PI / 6),
            y1 - ARROWHEAD_SIZE * Math.sin(angle + Math.PI / 6)
          );

          return (
            <View key={annotation.id}>
              <Path path={linePath} color={color} style="stroke" strokeWidth={sw} strokeCap="round" />
              <Path path={headPath} color={color} style="stroke" strokeWidth={sw} strokeCap="round" />
            </View>
          );
        }

        case 'circle': {
          if (!p0 || !p1) return null;
          const cx = denormX(p0.x, cw);
          const cy = denormY(p0.y, ch);
          const ex = denormX(p1.x, cw);
          const ey = denormY(p1.y, ch);
          const rx = Math.abs(ex - cx);
          const ry = Math.abs(ey - cy);

          return (
            <Oval
              key={annotation.id}
              x={cx - rx}
              y={cy - ry}
              width={rx * 2}
              height={ry * 2}
              color={color}
              style="stroke"
              strokeWidth={sw}
            />
          );
        }

        case 'underline': {
          if (!p0 || !p1) return null;
          return (
            <SkiaLine
              key={annotation.id}
              p1={vec(denormX(p0.x, cw), denormY(p0.y, ch))}
              p2={vec(denormX(p1.x, cw), denormY(p1.y, ch))}
              color={color}
              style="stroke"
              strokeWidth={sw}
              strokeCap="round"
            />
          );
        }

        case 'text': {
          // Text annotations rendered as simple Skia text
          // Note: Skia <Text> requires a font. We render a colored rectangle as background
          // and overlay RN Text positioned absolutely for simplicity and font support.
          return null; // Rendered as RN overlay below
        }

        default:
          return null;
      }
    },
    []
  );

  // --- Render live preview (in-progress drag) ---
  const renderLivePreview = useCallback(() => {
    if (!startPoint.current || !liveEnd || editor.activeTool === 'text') return null;

    const x0 = startPoint.current.x;
    const y0 = startPoint.current.y;
    const x1 = liveEnd.x;
    const y1 = liveEnd.y;

    switch (editor.activeTool) {
      case 'arrow': {
        const path = Skia.Path.Make();
        path.moveTo(x0, y0);
        path.lineTo(x1, y1);
        const angle = Math.atan2(y1 - y0, x1 - x0);
        const headPath = Skia.Path.Make();
        headPath.moveTo(x1, y1);
        headPath.lineTo(
          x1 - ARROWHEAD_SIZE * Math.cos(angle - Math.PI / 6),
          y1 - ARROWHEAD_SIZE * Math.sin(angle - Math.PI / 6)
        );
        headPath.moveTo(x1, y1);
        headPath.lineTo(
          x1 - ARROWHEAD_SIZE * Math.cos(angle + Math.PI / 6),
          y1 - ARROWHEAD_SIZE * Math.sin(angle + Math.PI / 6)
        );
        return (
          <>
            <Path path={path} color={ANNOTATION_COLOR} style="stroke" strokeWidth={STROKE_WIDTH} strokeCap="round" />
            <Path path={headPath} color={ANNOTATION_COLOR} style="stroke" strokeWidth={STROKE_WIDTH} strokeCap="round" />
          </>
        );
      }
      case 'circle': {
        const rx = Math.abs(x1 - x0);
        const ry = Math.abs(y1 - y0);
        return (
          <Oval
            x={x0 - rx}
            y={y0 - ry}
            width={rx * 2}
            height={ry * 2}
            color={ANNOTATION_COLOR}
            style="stroke"
            strokeWidth={STROKE_WIDTH}
          />
        );
      }
      case 'underline': {
        return (
          <SkiaLine
            p1={vec(x0, y0)}
            p2={vec(x1, y1)}
            color={ANNOTATION_COLOR}
            style="stroke"
            strokeWidth={STROKE_WIDTH}
            strokeCap="round"
          />
        );
      }
      default:
        return null;
    }
  }, [liveEnd, editor.activeTool]);

  // Text annotation overlays (rendered as RN Text for proper Hebrew font support)
  const textOverlays = useMemo(
    () =>
      editor.annotations
        .filter((a) => a.tool === 'text' && a.text)
        .map((a) => ({
          id: a.id,
          x: denormX(a.points[0].x, canvasLayout.width),
          y: denormY(a.points[0].y, canvasLayout.height),
          text: a.text!,
          color: a.color,
        })),
    [editor.annotations, canvasLayout]
  );

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.headerButton}>
            <Text style={styles.cancelText}>ביטול</Text>
          </Pressable>
          <Text style={styles.headerTitle}>עריכת תמונה</Text>
          <Pressable onPress={handleSave} style={styles.headerButton}>
            <Text style={styles.saveText}>שמור</Text>
          </Pressable>
        </View>

        {/* Canvas area */}
        <View style={styles.canvasContainer}>
          <GestureDetector gesture={drawGesture}>
            <View
              style={{
                width: canvasLayout.width,
                height: canvasLayout.height,
                alignSelf: 'center',
              }}
            >
              <Canvas style={{ width: canvasLayout.width, height: canvasLayout.height }}>
                {/* Background image */}
                {image && (
                  <SkiaImage
                    image={image}
                    x={0}
                    y={0}
                    width={canvasLayout.width}
                    height={canvasLayout.height}
                    fit="contain"
                  />
                )}

                {/* Saved annotations (non-text) */}
                {editor.annotations
                  .filter((a) => a.tool !== 'text')
                  .map((a) => renderAnnotation(a, canvasLayout.width, canvasLayout.height))}

                {/* Live preview */}
                {renderLivePreview()}
              </Canvas>

              {/* Text overlays */}
              {textOverlays.map((t) => (
                <Text
                  key={t.id}
                  style={{
                    position: 'absolute',
                    left: t.x,
                    top: t.y,
                    fontSize: 16,
                    fontFamily: 'Rubik-Bold',
                    fontWeight: '700',
                    color: t.color,
                    textShadowColor: 'rgba(0,0,0,0.5)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  {t.text}
                </Text>
              ))}
            </View>
          </GestureDetector>
        </View>

        {/* Toolbar */}
        <AnnotationToolbar
          activeTool={editor.activeTool}
          onToolChange={editor.setActiveTool}
          canUndo={editor.canUndo}
          onUndo={editor.undo}
        />

        {/* Safe area bottom */}
        <View style={{ height: insets.bottom, backgroundColor: COLORS.cream[50] }} />

        {/* Text input modal */}
        {showTextInput && (
          <Modal visible transparent animationType="fade">
            <Pressable
              style={styles.textInputOverlay}
              onPress={() => setShowTextInput(false)}
            >
              <Pressable
                style={styles.textInputBox}
                onPress={(e) => e.stopPropagation()}
              >
                <TextInput
                  value={textInputValue}
                  onChangeText={setTextInputValue}
                  placeholder="הקלד טקסט..."
                  placeholderTextColor={COLORS.neutral[400]}
                  autoFocus
                  style={styles.textInput}
                  textAlign="right"
                />
                <Pressable onPress={handleTextConfirm} style={styles.textConfirmButton}>
                  <Text style={styles.textConfirmText}>הוסף</Text>
                </Pressable>
              </Pressable>
            </Pressable>
          </Modal>
        )}
      </View>
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
    paddingVertical: 10,
    backgroundColor: COLORS.neutral[900],
  },
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.white,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    color: COLORS.white,
  },
  saveText: {
    fontSize: 14,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.primary[400],
  },
  canvasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[900],
  },
  textInputOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  textInputBox: {
    backgroundColor: COLORS.cream[50],
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    width: '100%',
    gap: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.cream[200],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Rubik-Regular',
    color: COLORS.neutral[800],
  },
  textConfirmButton: {
    backgroundColor: COLORS.primary[500],
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  textConfirmText: {
    fontSize: 14,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.white,
  },
});
```

**Important notes for the implementer:**

- The Skia imports may need adjustment based on exact v2.4.18 API. Check `@shopify/react-native-skia` exports. In particular:
  - `useImage` loads an image from URI
  - `Image` from Skia is used as `SkiaImage` (aliased to avoid conflict with RN Image)
  - `Line` from Skia aliased as `SkiaLine`
  - `Oval` for ellipses
  - `vec()` creates a Skia vector point
- If `useImage` doesn't exist in v2.4.18, use `Skia.Image.MakeImageFromEncoded()` with a fetch call instead.
- Text annotations are rendered as RN `<Text>` overlays (not Skia Text) because Skia Text requires loading a `.ttf` font file explicitly and we want Hebrew Rubik support.
- The `renderAnnotation` function returns React elements to be placed inside `<Canvas>`. The `<View>` wrappers for arrow (line + head) won't work inside Canvas — use Fragment (`<>`) instead. Fix during implementation.

- [ ] **Step 2: Run typecheck**

Run: `cd /home/masrati/infield && npm run typecheck`
Expected: May have Skia import issues — fix any type errors from Skia API differences.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/components/camera/AnnotationEditor.tsx
git commit -m "feat(camera): add AnnotationEditor component with Skia drawing"
```

---

### Task 6: CameraPreview Component

**Files:**

- Create: `apps/mobile/components/camera/CameraPreview.tsx`

- [ ] **Step 1: Create the preview component**

Create `apps/mobile/components/camera/CameraPreview.tsx`:

```typescript
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

interface CameraPreviewProps {
  uri: string;
  onConfirm: () => void;
  onEdit: () => void;
  onRetake: () => void;
}

export function CameraPreview({
  uri,
  onConfirm,
  onEdit,
  onRetake,
}: CameraPreviewProps) {
  const insets = useSafeAreaInsets();

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onConfirm();
  };

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit();
  };

  const handleRetake = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRetake();
  };

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={StyleSheet.absoluteFill}
    >
      {/* Full-screen preview */}
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
        transition={200}
      />

      {/* Dark overlay at bottom for buttons */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom + 16, 32) },
        ]}
      >
        {/* Retake — top of bar */}
        <Pressable onPress={handleRetake} style={styles.retakeButton}>
          <Feather name="refresh-cw" size={16} color={COLORS.white} />
          <Text style={styles.retakeText}>צלם שוב</Text>
        </Pressable>

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          {/* Confirm (primary) */}
          <Pressable
            onPress={handleConfirm}
            style={styles.confirmButton}
          >
            <Feather name="check" size={22} color={COLORS.white} />
            <Text style={styles.confirmText}>אשר</Text>
          </Pressable>

          {/* Edit (secondary) */}
          <Pressable
            onPress={handleEdit}
            style={styles.editButton}
          >
            <Feather name="edit-2" size={20} color={COLORS.white} />
            <Text style={styles.editText}>ערוך</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20, 19, 17, 0.85)',
    paddingTop: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  retakeButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  retakeText: {
    fontSize: 13,
    fontFamily: 'Rubik-Regular',
    color: COLORS.white,
    opacity: 0.8,
  },
  actionsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary[500],
  },
  confirmText: {
    fontSize: 16,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.white,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  editText: {
    fontSize: 16,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.white,
  },
});
```

- [ ] **Step 2: Run typecheck**

Run: `cd /home/masrati/infield && npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/components/camera/CameraPreview.tsx
git commit -m "feat(camera): add CameraPreview component"
```

---

### Task 7: CameraCapture v2 — Upgrade to Continuous Capture

**Files:**

- Modify: `apps/mobile/components/camera/CameraCapture.tsx`

**Context:** The current CameraCapture (`apps/mobile/components/camera/CameraCapture.tsx`, 362 lines) takes a single photo, uploads it, and immediately closes. We need to change it to:

1. Keep camera open after capture (continuous mode)
2. Show badge with photo count
3. Show CameraPreview after each capture (confirm/edit/retake)
4. "Done" button to finish and return all photos
5. No longer upload during capture — just return local URIs. Upload happens at save time.

- [ ] **Step 1: Rewrite CameraCapture**

Replace the entire content of `apps/mobile/components/camera/CameraCapture.tsx` with:

```typescript
import { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as Linking from 'expo-linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { useToast } from '@/hooks/useToast';
import { CameraPreview } from './CameraPreview';
import { AnnotationEditor } from './AnnotationEditor';

import type { CapturedPhoto, AnnotationLayer } from '@/lib/annotations';

// --- Types ---

interface CameraCaptureProps {
  visible: boolean;
  onClose: () => void;
  onPhotosConfirmed: (photos: CapturedPhoto[]) => void;
  initialPhotoCount?: number;
  maxPhotos?: number;
}

// --- Constants ---

const MAX_IMAGE_DIMENSION = 1200;
const JPEG_QUALITY = 0.7;
const DEFAULT_MAX_PHOTOS = 10;

// --- Component ---

export function CameraCapture({
  visible,
  onClose,
  onPhotosConfirmed,
  initialPhotoCount = 0,
  maxPhotos = DEFAULT_MAX_PHOTOS,
}: CameraCaptureProps) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  // Continuous capture state
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<{
    uri: string;
    width: number;
    height: number;
  } | null>(null);
  const [showAnnotationEditor, setShowAnnotationEditor] = useState(false);
  const [pendingAnnotations, setPendingAnnotations] = useState<AnnotationLayer | undefined>();

  const totalCount = initialPhotoCount + capturedPhotos.length;
  const canTakeMore = totalCount < maxPhotos;

  // Reset state when modal closes
  const handleClose = useCallback(() => {
    setCapturedPhotos([]);
    setPreviewPhoto(null);
    setShowAnnotationEditor(false);
    setPendingAnnotations(undefined);
    onClose();
  }, [onClose]);

  const handleRequestPermission = useCallback(async () => {
    try {
      await requestPermission();
    } catch {
      showToast('אירעה שגיאה בבקשת הרשאת מצלמה', 'error');
    }
  }, [requestPermission, showToast]);

  const handleOpenSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const resizePhoto = useCallback(async (localUri: string) => {
    const context = ImageManipulator.manipulate(localUri);
    const imageRef = await context
      .resize({ width: MAX_IMAGE_DIMENSION })
      .renderAsync();

    const result = await imageRef.saveAsync({
      compress: JPEG_QUALITY,
      format: SaveFormat.JPEG,
    });

    return result;
  }, []);

  // Take photo → show preview
  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isProcessing || !canTakeMore) return;

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo?.uri) throw new Error('No photo captured');

      const resized = await resizePhoto(photo.uri);
      setPreviewPhoto({
        uri: resized.uri,
        width: resized.width,
        height: resized.height,
      });
    } catch {
      showToast('לא הצלחנו לצלם. נסה שוב', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, canTakeMore, resizePhoto, showToast]);

  // Preview → Confirm (add to list, back to camera)
  const handlePreviewConfirm = useCallback(() => {
    if (!previewPhoto) return;
    const newPhoto: CapturedPhoto = {
      id: String(Date.now()),
      uri: previewPhoto.uri,
      width: previewPhoto.width,
      height: previewPhoto.height,
      annotations: pendingAnnotations,
    };
    setCapturedPhotos((prev) => [...prev, newPhoto]);
    setPreviewPhoto(null);
    setPendingAnnotations(undefined);
  }, [previewPhoto, pendingAnnotations]);

  // Preview → Edit (open annotation editor)
  const handlePreviewEdit = useCallback(() => {
    setShowAnnotationEditor(true);
  }, []);

  // Preview → Retake (discard preview, back to camera)
  const handlePreviewRetake = useCallback(() => {
    setPreviewPhoto(null);
    setPendingAnnotations(undefined);
  }, []);

  // Annotation saved → store and go back to preview
  const handleAnnotationSave = useCallback((annotations: AnnotationLayer) => {
    setPendingAnnotations(annotations);
    setShowAnnotationEditor(false);
  }, []);

  // Done → return all captured photos
  const handleDone = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const photos = [...capturedPhotos];
    setCapturedPhotos([]);
    setPreviewPhoto(null);
    setPendingAnnotations(undefined);
    onPhotosConfirmed(photos);
  }, [capturedPhotos, onPhotosConfirmed]);

  // Permission not yet determined
  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <ActivityIndicator size="large" color={COLORS.primary[500]} />
        </View>
      </Modal>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <Pressable
            onPress={handleClose}
            style={[styles.closeButton, { top: insets.top + 16, start: 16 }]}
          >
            <Feather name="x" size={24} color={COLORS.neutral[800]} />
          </Pressable>
          <View style={styles.permissionContainer}>
            <View style={styles.permissionIconCircle}>
              <Feather name="camera-off" size={48} color={COLORS.neutral[400]} />
            </View>
            <Text style={styles.permissionTitle}>נדרשת הרשאת מצלמה</Text>
            <Text style={styles.permissionDescription}>
              כדי לצלם תמונות של ממצאים, יש לאפשר גישה למצלמה.
              {'\n'}
              ניתן לשנות זאת בהגדרות המכשיר.
            </Text>
            {permission.canAskAgain ? (
              <Pressable onPress={handleRequestPermission} style={styles.permissionButton}>
                <Text style={styles.permissionButtonText}>אפשר גישה למצלמה</Text>
              </Pressable>
            ) : (
              <Pressable onPress={handleOpenSettings} style={styles.permissionButton}>
                <Feather name="settings" size={16} color={COLORS.white} />
                <Text style={styles.permissionButtonText}>פתח הגדרות</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  // Camera view
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          mode="picture"
        />

        {/* Close button */}
        <Pressable
          onPress={handleClose}
          style={[styles.cameraCloseButton, { top: insets.top + 16, start: 16 }]}
          disabled={isProcessing}
        >
          <Feather name="x" size={24} color={COLORS.white} />
        </Pressable>

        {/* Badge — photo count */}
        {totalCount > 0 && !previewPhoto && (
          <Animated.View
            entering={FadeIn.duration(200)}
            style={[styles.badge, { top: insets.top + 16, end: 16 }]}
          >
            <Feather name="image" size={14} color={COLORS.white} />
            <Text style={styles.badgeText}>{totalCount}</Text>
          </Animated.View>
        )}

        {/* Done button — top right area, below badge */}
        {capturedPhotos.length > 0 && !previewPhoto && (
          <Pressable
            onPress={handleDone}
            style={[styles.doneButton, { top: insets.top + 56, end: 16 }]}
          >
            <Text style={styles.doneText}>סיום</Text>
            <Feather name="check" size={16} color={COLORS.white} />
          </Pressable>
        )}

        {/* Capture button — bottom center */}
        {!previewPhoto && (
          <View
            style={[
              styles.captureArea,
              { paddingBottom: Math.max(insets.bottom + 16, 32) },
            ]}
          >
            {!canTakeMore ? (
              <View style={styles.maxReachedContainer}>
                <Text style={styles.maxReachedText}>
                  הגעת למקסימום {maxPhotos} תמונות
                </Text>
                <Pressable onPress={handleDone} style={styles.maxReachedDoneButton}>
                  <Text style={styles.maxReachedDoneText}>סיום</Text>
                </Pressable>
              </View>
            ) : isProcessing ? (
              <View style={styles.captureButtonOuter}>
                <View style={styles.captureButtonProcessing}>
                  <ActivityIndicator size="small" color={COLORS.white} />
                </View>
              </View>
            ) : (
              <Pressable
                onPress={handleCapture}
                style={({ pressed }) => [
                  styles.captureButtonOuter,
                  pressed && styles.captureButtonPressed,
                ]}
              >
                <View style={styles.captureButtonInner} />
              </Pressable>
            )}
          </View>
        )}

        {/* Preview overlay */}
        {previewPhoto && !showAnnotationEditor && (
          <CameraPreview
            uri={previewPhoto.uri}
            onConfirm={handlePreviewConfirm}
            onEdit={handlePreviewEdit}
            onRetake={handlePreviewRetake}
          />
        )}

        {/* Annotation editor */}
        {previewPhoto && showAnnotationEditor && (
          <AnnotationEditor
            visible={showAnnotationEditor}
            imageUri={previewPhoto.uri}
            imageWidth={previewPhoto.width}
            imageHeight={previewPhoto.height}
            initialAnnotations={pendingAnnotations}
            onSave={handleAnnotationSave}
            onClose={() => setShowAnnotationEditor(false)}
          />
        )}
      </View>
    </Modal>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.cream[200],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  permissionContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionIconCircle: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.cream[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontFamily: 'Rubik-Bold',
    fontWeight: '700',
    color: COLORS.neutral[800],
    textAlign: 'center',
    marginBottom: 12,
  },
  permissionDescription: {
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    fontWeight: '400',
    color: COLORS.neutral[500],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  permissionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary[500],
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.white,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  cameraCloseButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(20, 19, 17, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  badge: {
    position: 'absolute',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary[500],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    zIndex: 10,
  },
  badgeText: {
    fontSize: 14,
    fontFamily: 'Rubik-Bold',
    fontWeight: '700',
    color: COLORS.white,
  },
  doneButton: {
    position: 'absolute',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(20, 19, 17, 0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    zIndex: 10,
  },
  doneText: {
    fontSize: 13,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.white,
  },
  captureArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  captureButtonOuter: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 4,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.white,
  },
  captureButtonProcessing: {
    width: 58,
    height: 58,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  maxReachedContainer: {
    alignItems: 'center',
    gap: 8,
  },
  maxReachedText: {
    fontSize: 13,
    fontFamily: 'Rubik-Regular',
    color: COLORS.white,
    opacity: 0.8,
  },
  maxReachedDoneButton: {
    backgroundColor: COLORS.primary[500],
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.lg,
  },
  maxReachedDoneText: {
    fontSize: 14,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.white,
  },
});
```

**Important notes:**

- The old `CameraCaptureProps` had `onCapture` (single photo + publicUrl) and `organizationId` / `reportId` for immediate upload. The new version has `onPhotosConfirmed` (array of local photos). Upload is deferred to save time in `add-defect.tsx`.
- The old `processAndUpload` function is replaced by `resizePhoto` (resize only, no upload).
- Consumers of the old API (`add-defect.tsx`) must be updated in Task 9.

- [ ] **Step 2: Run typecheck**

Run: `cd /home/masrati/infield && npm run typecheck`
Expected: Errors in `add-defect.tsx` due to changed CameraCapture props — these will be fixed in Task 9.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/components/camera/CameraCapture.tsx
git commit -m "feat(camera): upgrade CameraCapture to continuous capture with badge and preview"
```

---

### Task 8: PhotoReviewGrid Component

**Files:**

- Create: `apps/mobile/components/camera/PhotoReviewGrid.tsx`

- [ ] **Step 1: Create the review grid component**

Create `apps/mobile/components/camera/PhotoReviewGrid.tsx`:

```typescript
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { AnnotationEditor } from './AnnotationEditor';

import type { CapturedPhoto, AnnotationLayer } from '@/lib/annotations';

// --- Types ---

interface PhotoReviewGridProps {
  visible: boolean;
  photos: CapturedPhoto[];
  onPhotosConfirmed: (photos: CapturedPhoto[]) => void;
  onClose: () => void;
}

// --- Constants ---

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_GAP = 4;
const GRID_COLUMNS = 3;
const THUMB_SIZE = Math.floor(
  (SCREEN_WIDTH - 24 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS
);

// --- Component ---

export function PhotoReviewGrid({
  visible,
  photos: initialPhotos,
  onPhotosConfirmed,
  onClose,
}: PhotoReviewGridProps) {
  const insets = useSafeAreaInsets();
  const [photos, setPhotos] = useState<CapturedPhoto[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<CapturedPhoto | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<CapturedPhoto | null>(null);

  // Sync when props change (modal re-opens)
  // We keep local state for delete operations
  const handleConfirmAll = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPhotosConfirmed(photos);
  }, [photos, onPhotosConfirmed]);

  const handleDelete = useCallback(
    (photoId: string) => {
      Alert.alert('למחוק את התמונה?', 'פעולה זו אינה הפיכה', [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'מחק',
          style: 'destructive',
          onPress: () => {
            setPhotos((prev) => prev.filter((p) => p.id !== photoId));
            setSelectedPhoto(null);
          },
        },
      ]);
    },
    []
  );

  const handleEditPress = useCallback((photo: CapturedPhoto) => {
    setSelectedPhoto(null);
    setEditingPhoto(photo);
  }, []);

  const handleAnnotationSave = useCallback(
    (annotations: AnnotationLayer) => {
      if (!editingPhoto) return;
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === editingPhoto.id ? { ...p, annotations } : p
        )
      );
      setEditingPhoto(null);
    },
    [editingPhoto]
  );

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.headerBackButton}>
            <Feather name="chevron-right" size={24} color={COLORS.neutral[800]} />
          </Pressable>
          <Text style={styles.headerTitle}>סקירת תמונות</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{photos.length}</Text>
          </View>
        </View>

        {/* Grid */}
        <ScrollView
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        >
          {photos.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="camera-off" size={40} color={COLORS.neutral[300]} />
              <Text style={styles.emptyText}>אין תמונות</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {photos.map((photo) => (
                <Pressable
                  key={photo.id}
                  onPress={() => setSelectedPhoto(photo)}
                  style={styles.thumbnail}
                >
                  <Image
                    source={{ uri: photo.uri }}
                    style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
                    contentFit="cover"
                    transition={200}
                  />
                  {/* Annotation indicator */}
                  {photo.annotations && photo.annotations.annotations.length > 0 && (
                    <View style={styles.annotationIndicator}>
                      <Feather name="edit-2" size={10} color={COLORS.white} />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Confirm button */}
        {photos.length > 0 && (
          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, 24) },
            ]}
          >
            <Pressable onPress={handleConfirmAll} style={styles.confirmAllButton}>
              <Feather name="check" size={20} color={COLORS.white} />
              <Text style={styles.confirmAllText}>אשר הכל</Text>
            </Pressable>
          </View>
        )}

        {/* Enlarged photo modal */}
        {selectedPhoto && (
          <Modal visible transparent animationType="fade" onRequestClose={() => setSelectedPhoto(null)}>
            <Pressable
              style={styles.enlargedOverlay}
              onPress={() => setSelectedPhoto(null)}
            >
              <Pressable
                style={styles.enlargedContainer}
                onPress={(e) => e.stopPropagation()}
              >
                <Image
                  source={{ uri: selectedPhoto.uri }}
                  style={styles.enlargedImage}
                  contentFit="contain"
                  transition={200}
                />
                <View style={styles.enlargedActions}>
                  <Pressable
                    onPress={() => handleEditPress(selectedPhoto)}
                    style={styles.enlargedEditButton}
                  >
                    <Feather name="edit-2" size={18} color={COLORS.primary[500]} />
                    <Text style={styles.enlargedEditText}>ערוך</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(selectedPhoto.id)}
                    style={styles.enlargedDeleteButton}
                  >
                    <Feather name="trash-2" size={18} color={COLORS.danger[500]} />
                    <Text style={styles.enlargedDeleteText}>מחק</Text>
                  </Pressable>
                </View>
              </Pressable>
            </Pressable>
          </Modal>
        )}

        {/* Annotation editor for existing photo */}
        {editingPhoto && (
          <AnnotationEditor
            visible={!!editingPhoto}
            imageUri={editingPhoto.uri}
            imageWidth={editingPhoto.width}
            imageHeight={editingPhoto.height}
            initialAnnotations={editingPhoto.annotations}
            onSave={handleAnnotationSave}
            onClose={() => setEditingPhoto(null)}
          />
        )}
      </View>
    </Modal>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream[50],
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cream[200],
    gap: 8,
  },
  headerBackButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Rubik-Bold',
    fontWeight: '700',
    color: COLORS.neutral[800],
    textAlign: 'right',
  },
  headerBadge: {
    backgroundColor: COLORS.primary[500],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  headerBadgeText: {
    fontSize: 12,
    fontFamily: 'Rubik-Bold',
    fontWeight: '700',
    color: COLORS.white,
  },
  gridContainer: {
    padding: 12,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  thumbnail: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.cream[200],
  },
  annotationIndicator: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    color: COLORS.neutral[400],
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: COLORS.cream[50],
    borderTopWidth: 1,
    borderTopColor: COLORS.cream[200],
  },
  confirmAllButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary[500],
  },
  confirmAllText: {
    fontSize: 16,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.white,
  },
  enlargedOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  enlargedContainer: {
    width: '100%',
    maxHeight: '80%',
    gap: 16,
  },
  enlargedImage: {
    width: '100%',
    height: 300,
    borderRadius: BORDER_RADIUS.lg,
  },
  enlargedActions: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 24,
  },
  enlargedEditButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.cream[50],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.lg,
  },
  enlargedEditText: {
    fontSize: 14,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.primary[500],
  },
  enlargedDeleteButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.cream[50],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.lg,
  },
  enlargedDeleteText: {
    fontSize: 14,
    fontFamily: 'Rubik-SemiBold',
    fontWeight: '600',
    color: COLORS.danger[500],
  },
});
```

- [ ] **Step 2: Run typecheck**

Run: `cd /home/masrati/infield && npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/components/camera/PhotoReviewGrid.tsx
git commit -m "feat(camera): add PhotoReviewGrid component"
```

---

### Task 9: Camera Barrel Export

**Files:**

- Create: `apps/mobile/components/camera/index.ts`

- [ ] **Step 1: Create barrel export**

Create `apps/mobile/components/camera/index.ts`:

```typescript
export { CameraCapture } from './CameraCapture';
export { CameraPreview } from './CameraPreview';
export { AnnotationEditor } from './AnnotationEditor';
export { AnnotationToolbar } from './AnnotationToolbar';
export { PhotoReviewGrid } from './PhotoReviewGrid';
```

- [ ] **Step 2: Run typecheck**

Run: `cd /home/masrati/infield && npm run typecheck`
Expected: PASS (or errors in add-defect.tsx from changed CameraCapture API — fixed next task)

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/components/camera/index.ts
git commit -m "feat(camera): add barrel export for camera components"
```

---

### Task 10: Update add-defect.tsx — New Camera Integration

**Files:**

- Modify: `apps/mobile/app/(app)/reports/[id]/add-defect.tsx`

**Context:** The current `add-defect.tsx` uses the old CameraCapture API:

- `onCapture: (result: { localUri: string; publicUrl: string }) => void` — single photo with publicUrl
- `organizationId` and `reportId` props for immediate upload

The new CameraCapture v2:

- `onPhotosConfirmed: (photos: CapturedPhoto[]) => void` — array of local photos
- No `organizationId` or `reportId` props (upload deferred)
- Photos include annotations

Upload now happens at save time in `handleSave`.

- [ ] **Step 1: Update imports**

In `apps/mobile/app/(app)/reports/[id]/add-defect.tsx`, update the CameraCapture import and add annotations type:

Replace:

```typescript
import { CameraCapture } from '@/components/camera/CameraCapture';
```

With:

```typescript
import { CameraCapture } from '@/components/camera';
import type { CapturedPhoto } from '@/lib/annotations';
```

- [ ] **Step 2: Replace handleCameraCapture with handlePhotosConfirmed**

Replace the `handleCameraCapture` callback (lines ~188-207 of current file):

```typescript
const handleCameraCapture = useCallback(
  (result: { localUri: string; publicUrl: string }) => {
    if (photos.length >= MAX_PHOTOS) {
      showToast('ניתן להוסיף עד 10 תמונות', 'error');
      setCameraVisible(false);
      return;
    }

    const newPhoto: PhotoItem = {
      id: String(Date.now()),
      localUri: result.localUri,
      publicUrl: result.publicUrl,
      isUploading: false,
    };

    setPhotos((prev) => [...prev, newPhoto]);
    setCameraVisible(false);
  },
  [photos.length, showToast]
);
```

With:

```typescript
const handlePhotosConfirmed = useCallback((captured: CapturedPhoto[]) => {
  const newPhotos: PhotoItem[] = captured.map((photo, i) => ({
    id: String(Date.now() + i),
    localUri: photo.uri,
    isUploading: false,
    annotations: photo.annotations,
  }));

  setPhotos((prev) => [...prev, ...newPhotos].slice(0, MAX_PHOTOS));
  setCameraVisible(false);
}, []);
```

- [ ] **Step 3: Update PhotoItem type to include annotations**

In `apps/mobile/components/defect/PhotoGrid.tsx`, add to the `PhotoItem` interface:

```typescript
import type { AnnotationLayer } from '@/lib/annotations';

export interface PhotoItem {
  id: string;
  localUri?: string;
  publicUrl?: string;
  isUploading?: boolean;
  dbId?: string;
  storagePath?: string;
  annotations?: AnnotationLayer; // NEW
}
```

- [ ] **Step 4: Update CameraCapture JSX in add-defect.tsx**

Replace the CameraCapture JSX (around line 331-337):

```typescript
<CameraCapture
  visible={cameraVisible}
  onCapture={handleCameraCapture}
  onClose={() => setCameraVisible(false)}
  organizationId={organizationId}
  reportId={reportId ?? ''}
/>
```

With:

```typescript
<CameraCapture
  visible={cameraVisible}
  onClose={() => setCameraVisible(false)}
  onPhotosConfirmed={handlePhotosConfirmed}
  initialPhotoCount={photos.length}
  maxPhotos={MAX_PHOTOS}
/>
```

- [ ] **Step 5: Update handleSave to upload photos and save annotations**

In the `handleSave` function, update the photo insertion block. Replace the current photo insert block (around lines 271-286):

```typescript
// Insert photo records into defect_photos
if (photos.length > 0) {
  const photoRows = photos.map((photo, index) => ({
    defect_id: defectId,
    organization_id: organizationId,
    image_url: photo.publicUrl ?? '',
    sort_order: index,
  }));

  const { error: photosError } = await supabase
    .from('defect_photos')
    .insert(photoRows);

  if (photosError) {
    showToast('הממצא נשמר, אך חלק מהתמונות לא נשמרו', 'error');
  }
}
```

With:

```typescript
// Upload photos and insert records into defect_photos
if (photos.length > 0) {
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    let imageUrl = photo.publicUrl ?? '';

    // Upload local photos that don't have a publicUrl yet
    if (photo.localUri && !photo.publicUrl) {
      try {
        const uuid = String(Date.now()) + '_' + i;
        const filePath = `${organizationId}/${reportId}/${uuid}.jpg`;
        const response = await fetch(photo.localUri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('defect-photos')
          .upload(filePath, blob, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('defect-photos').getPublicUrl(filePath);

        imageUrl = publicUrl;
      } catch {
        showToast('חלק מהתמונות לא הועלו', 'error');
        continue;
      }
    }

    const { error: insertError } = await supabase.from('defect_photos').insert({
      defect_id: defectId,
      organization_id: organizationId,
      image_url: imageUrl,
      sort_order: i,
      annotations_json: photo.annotations ?? null,
    });

    if (insertError) {
      showToast('הממצא נשמר, אך חלק מהתמונות לא נשמרו', 'error');
    }
  }
}
```

- [ ] **Step 6: Run typecheck**

Run: `cd /home/masrati/infield && npm run typecheck`
Expected: PASS — all CameraCapture API consumers updated

- [ ] **Step 7: Commit**

```bash
git add apps/mobile/app/\(app\)/reports/\[id\]/add-defect.tsx apps/mobile/components/defect/PhotoGrid.tsx
git commit -m "feat(camera): integrate CameraCapture v2 with add-defect screen"
```

---

### Task 11: PhotoGrid — Tap to Edit Annotations on Existing Photos

**Files:**

- Modify: `apps/mobile/components/defect/PhotoGrid.tsx`

**Context:** Currently, `PhotoGrid.tsx` shows thumbnails with a delete button. We need to add: tap on a photo thumbnail → open AnnotationEditor to add/edit annotations.

- [ ] **Step 1: Add annotation editor integration to PhotoGrid**

Update `apps/mobile/components/defect/PhotoGrid.tsx`. Add new props and AnnotationEditor:

Update imports at top:

```typescript
import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Modal } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@infield/ui';
import { AnnotationEditor } from '@/components/camera';

import type { AnnotationLayer } from '@/lib/annotations';
```

Add a new optional callback to `PhotoGridProps`:

```typescript
interface PhotoGridProps {
  photos: PhotoItem[];
  onAddPhoto: () => void;
  onPickFromGallery?: () => void;
  onDeletePhoto: (id: string) => void;
  onUpdateAnnotations?: (id: string, annotations: AnnotationLayer) => void; // NEW
  maxReached?: boolean;
}
```

In the component, add state for the editor and handler:

```typescript
export function PhotoGrid({
  photos,
  onAddPhoto,
  onPickFromGallery,
  onDeletePhoto,
  onUpdateAnnotations,
  maxReached,
}: PhotoGridProps) {
  const isMaxReached = maxReached ?? photos.length >= MAX_PHOTOS;
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);

  const handleAnnotationSave = (annotations: AnnotationLayer) => {
    if (editingPhoto && onUpdateAnnotations) {
      onUpdateAnnotations(editingPhoto.id, annotations);
    }
    setEditingPhoto(null);
  };
```

Make the photo thumbnail a `Pressable` that opens the editor (wrap the existing thumbnail `View` with a `Pressable`):

For each photo in the `photos.map`, wrap with tap handler:

```typescript
<Pressable
  key={ph.id}
  onPress={() => {
    if (onUpdateAnnotations && imageUri) {
      setEditingPhoto(ph);
    }
  }}
  style={{
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: COLORS.cream[200],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cream[300],
    overflow: 'hidden',
  }}
>
```

Add annotation indicator (small pen icon) after the remove button inside each thumbnail:

```typescript
{/* Annotation indicator */}
{ph.annotations && ph.annotations.annotations.length > 0 && (
  <View
    style={{
      position: 'absolute',
      bottom: 2,
      left: 2,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: COLORS.primary[500],
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Feather name="edit-2" size={8} color="#FFFFFF" />
  </View>
)}
```

Add the AnnotationEditor modal at the end of the component return, before the closing `</View>`:

```typescript
{/* Annotation editor for tapped photo */}
{editingPhoto && (
  <AnnotationEditor
    visible={!!editingPhoto}
    imageUri={editingPhoto.localUri ?? editingPhoto.publicUrl ?? ''}
    imageWidth={1200}
    imageHeight={900}
    initialAnnotations={editingPhoto.annotations}
    onSave={handleAnnotationSave}
    onClose={() => setEditingPhoto(null)}
  />
)}
```

Note: We use default 1200x900 for existing photos since we don't store original dimensions. The normalized coordinates still work correctly.

- [ ] **Step 2: Add onUpdateAnnotations handler in add-defect.tsx**

In `apps/mobile/app/(app)/reports/[id]/add-defect.tsx`, add the callback and pass it to PhotoGrid:

After `handleDeletePhoto`, add:

```typescript
const handleUpdateAnnotations = useCallback(
  (photoId: string, annotations: AnnotationLayer) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, annotations } : p))
    );
  },
  []
);
```

Add import at top:

```typescript
import type { AnnotationLayer } from '@/lib/annotations';
```

Update the PhotoGrid JSX to include the new prop:

```typescript
<PhotoGrid
  photos={photos}
  onAddPhoto={handleAddPhoto}
  onPickFromGallery={handlePickFromGallery}
  onDeletePhoto={handleDeletePhoto}
  onUpdateAnnotations={handleUpdateAnnotations}
/>
```

- [ ] **Step 3: Run typecheck**

Run: `cd /home/masrati/infield && npm run typecheck`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/components/defect/PhotoGrid.tsx apps/mobile/app/\(app\)/reports/\[id\]/add-defect.tsx
git commit -m "feat(camera): add annotation editing from PhotoGrid thumbnails"
```

---

### Task 12: Render Annotations to Image for PDF

**Files:**

- Create: `apps/mobile/lib/annotations/renderAnnotations.ts`
- Modify: `apps/mobile/lib/annotations/index.ts`
- Modify: `apps/mobile/lib/pdf/types.ts`
- Modify: `apps/mobile/lib/pdf/shared.ts`

**Context:** When generating a PDF, photos with annotations need to be composited into a single image. We use Skia offscreen rendering to draw annotations on top of the original image and export as base64 PNG.

- [ ] **Step 1: Create renderAnnotations utility**

Create `apps/mobile/lib/annotations/renderAnnotations.ts`:

```typescript
import { Skia } from '@shopify/react-native-skia';

import type { AnnotationLayer } from './types';

const ARROWHEAD_SIZE = 12;

/**
 * Render annotations onto an image using Skia offscreen canvas.
 * Returns base64-encoded PNG of the composited result.
 */
export async function renderAnnotationsToImage(
  imageUri: string,
  layer: AnnotationLayer
): Promise<string> {
  // Fetch the image
  const response = await fetch(imageUri);
  const arrayBuffer = await response.arrayBuffer();
  const data = Skia.Data.fromBytes(new Uint8Array(arrayBuffer));
  const image = Skia.Image.MakeImageFromEncoded(data);

  if (!image) {
    throw new Error('Failed to decode image for annotation rendering');
  }

  const w = image.width();
  const h = image.height();

  // Create offscreen surface
  const surface = Skia.Surface.Make(w, h);
  if (!surface) {
    throw new Error('Failed to create Skia surface');
  }

  const canvas = surface.getCanvas();

  // Draw original image
  canvas.drawImage(image, 0, 0);

  // Draw each annotation
  for (const annotation of layer.annotations) {
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(annotation.color));
    paint.setStrokeWidth(annotation.strokeWidth);
    paint.setStyle(1); // Stroke
    paint.setStrokeCap(1); // Round
    paint.setStrokeJoin(1); // Round
    paint.setAntiAlias(true);

    const p0 = annotation.points[0];
    const p1 = annotation.points[1];

    switch (annotation.tool) {
      case 'arrow': {
        if (!p0 || !p1) break;
        const x0 = p0.x * w;
        const y0 = p0.y * h;
        const x1 = p1.x * w;
        const y1 = p1.y * h;

        // Line
        canvas.drawLine(x0, y0, x1, y1, paint);

        // Arrowhead
        const angle = Math.atan2(y1 - y0, x1 - x0);
        canvas.drawLine(
          x1,
          y1,
          x1 - ARROWHEAD_SIZE * Math.cos(angle - Math.PI / 6),
          y1 - ARROWHEAD_SIZE * Math.sin(angle - Math.PI / 6),
          paint
        );
        canvas.drawLine(
          x1,
          y1,
          x1 - ARROWHEAD_SIZE * Math.cos(angle + Math.PI / 6),
          y1 - ARROWHEAD_SIZE * Math.sin(angle + Math.PI / 6),
          paint
        );
        break;
      }

      case 'circle': {
        if (!p0 || !p1) break;
        const cx = p0.x * w;
        const cy = p0.y * h;
        const rx = Math.abs(p1.x * w - cx);
        const ry = Math.abs(p1.y * h - cy);
        const oval = Skia.XYWHRect(cx - rx, cy - ry, rx * 2, ry * 2);
        canvas.drawOval(oval, paint);
        break;
      }

      case 'underline': {
        if (!p0 || !p1) break;
        canvas.drawLine(p0.x * w, p0.y * h, p1.x * w, p1.y * h, paint);
        break;
      }

      case 'text': {
        if (!p0 || !annotation.text) break;
        const fillPaint = Skia.Paint();
        fillPaint.setColor(Skia.Color(annotation.color));
        fillPaint.setStyle(0); // Fill
        fillPaint.setAntiAlias(true);

        const font = Skia.Font(null, 24); // System font, size 24
        canvas.drawText(annotation.text, p0.x * w, p0.y * h, fillPaint, font);
        break;
      }
    }
  }

  // Export as PNG base64
  surface.flush();
  const snapshot = surface.makeImageSnapshot();
  const encoded = snapshot.encodeToBase64();

  return `data:image/png;base64,${encoded}`;
}
```

- [ ] **Step 2: Update barrel export**

Update `apps/mobile/lib/annotations/index.ts`:

```typescript
export type {
  AnnotationTool,
  AnnotationPoint,
  Annotation,
  AnnotationLayer,
  CapturedPhoto,
} from './types';

export { renderAnnotationsToImage } from './renderAnnotations';
```

- [ ] **Step 3: Add annotationsJson to PdfDefect type**

In `apps/mobile/lib/pdf/types.ts`, add to the `PdfDefect` interface:

```typescript
export interface PdfDefect {
  number: number;
  title: string;
  location: string;
  category: string;
  description?: string;
  standardRef?: string;
  standardText?: string;
  recommendation?: string;
  cost?: number;
  costLabel?: string;
  note?: string;
  photoUrls?: string[];
  annotationsJson?: Record<string, unknown>[]; // annotation layers per photo (JSON from DB)
  annexText?: string;
}
```

- [ ] **Step 4: Update photoHtml in shared.ts to support annotated images**

In `apps/mobile/lib/pdf/shared.ts`, the existing `photoHtml()` function already accepts a URL string. No change needed to the function itself — the caller (in `bedekBayit.ts` / `protocol.ts`) will pass the composited image URL instead of the original.

The compositing happens in `usePdfGeneration.ts` at fetch time. Add a note comment at the top of `photoHtml`:

```typescript
/**
 * Render a photo thumbnail for PDF.
 * If the photo has annotations, the caller should pass the composited image URL
 * (from renderAnnotationsToImage) instead of the original URL.
 */
export function photoHtml(url?: string): string {
```

- [ ] **Step 5: Run typecheck**

Run: `cd /home/masrati/infield && npm run typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/mobile/lib/annotations/ apps/mobile/lib/pdf/types.ts apps/mobile/lib/pdf/shared.ts
git commit -m "feat(camera): add annotation rendering for PDF and update PDF types"
```

---

### Task 13: Integration — usePdfGeneration Compositing

**Files:**

- Modify: `apps/mobile/hooks/usePdfGeneration.ts`

**Context:** `usePdfGeneration.ts` fetches report data and builds a `PdfReportData` object. We need to check each photo for `annotations_json`, and if present, composite the annotations onto the image before passing the URL to the PDF template.

- [ ] **Step 1: Read the current usePdfGeneration.ts**

Read `apps/mobile/hooks/usePdfGeneration.ts` to understand the `fetchFullReportData` function structure.

- [ ] **Step 2: Add annotation compositing to photo URL resolution**

In `usePdfGeneration.ts`, add import:

```typescript
import { renderAnnotationsToImage } from '@/lib/annotations';
import type { AnnotationLayer } from '@/lib/annotations';
```

In the section where defect photos are fetched and mapped to `PdfDefect.photoUrls`, add annotation compositing. Find the code that queries `defect_photos` and builds `photoUrls`. For each photo, check if `annotations_json` exists and is non-null. If it does, call `renderAnnotationsToImage()` to composite and use the resulting base64 data URI instead.

The exact integration depends on the current structure of `fetchFullReportData`. The pattern is:

```typescript
// For each defect's photos:
const photoUrls: string[] = [];
for (const photo of defectPhotos) {
  if (photo.annotations_json) {
    try {
      const layer = photo.annotations_json as unknown as AnnotationLayer;
      const composited = await renderAnnotationsToImage(photo.image_url, layer);
      photoUrls.push(composited);
    } catch {
      // Fallback to original image if compositing fails
      photoUrls.push(photo.image_url);
    }
  } else {
    photoUrls.push(photo.image_url);
  }
}
```

- [ ] **Step 3: Run typecheck**

Run: `cd /home/masrati/infield && npm run typecheck`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/hooks/usePdfGeneration.ts
git commit -m "feat(camera): composite annotations onto photos during PDF generation"
```

---

### Task 14: Final Typecheck and Build

- [ ] **Step 1: Run full typecheck**

Run: `cd /home/masrati/infield && npm run typecheck`
Expected: PASS — zero errors

- [ ] **Step 2: Run full build**

Run: `cd /home/masrati/infield && npx turbo build`
Expected: PASS

- [ ] **Step 3: Fix any errors**

If there are type errors, fix them. Common issues:

- Skia API differences between what's documented and v2.4.18 actual exports
- Missing `AnnotationLayer` type imports
- `View` wrapper inside Canvas (replace with `<>` Fragment)

- [ ] **Step 4: Final commit if fixes were needed**

```bash
git add -A
git commit -m "fix(camera): resolve type errors from camera overlay implementation"
```
