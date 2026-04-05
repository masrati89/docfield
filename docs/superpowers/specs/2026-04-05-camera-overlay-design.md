# Camera Overlay & Photo Annotation — Design Spec

**Date:** 2026-04-05
**Status:** Approved
**Branch:** feature/infrastructure-fixes

---

## Goal

Upgrade the camera system from single-shot capture to a professional photography + annotation workflow: continuous capture with badge counter, post-capture preview with edit option, review grid before saving, and a Skia-based annotation editor (arrows, circles, underlines, text) with non-destructive annotation layers stored as JSON.

## Architecture

Modular approach — 3 independent components + 1 hook + 1 migration:

1. **CameraCapture v2** — upgraded existing camera with badge, continuous capture, preview
2. **AnnotationEditor** — standalone Skia annotation editor (reused from camera and photo grid)
3. **PhotoReviewGrid** — grid review screen before final save
4. **useAnnotationEditor** — hook managing annotation state, tools, undo
5. **DB migration** — `annotations_json JSONB` column on `defect_photos`

Library: `@shopify/react-native-skia` v2.4.18 (already installed).

## Data Model

### Annotation Layer (JSON stored in `defect_photos.annotations_json`)

```typescript
type AnnotationTool = 'arrow' | 'circle' | 'underline' | 'text';

interface Annotation {
  id: string; // uuid
  tool: AnnotationTool;
  points: { x: number; y: number }[]; // normalized 0-1 coordinates
  text?: string; // only for 'text' tool
  color: string; // default: '#FF0000' (red)
  strokeWidth: number; // default: 3
}

interface AnnotationLayer {
  version: 1;
  width: number; // original image pixel width
  height: number; // original image pixel height
  annotations: Annotation[];
}
```

**Coordinate system:** All points normalized to 0-1 range relative to image dimensions. This ensures annotations render correctly at any display size.

**Tool-specific point usage:**

- `arrow`: points[0] = start, points[1] = end (arrowhead at end)
- `circle`: points[0] = center, points[1] = edge point (radius derived from distance)
- `underline`: points[0] = start, points[1] = end (straight horizontal-ish line)
- `text`: points[0] = position, `text` field = content

### Migration

```sql
-- 018_add_annotations_json.sql
ALTER TABLE defect_photos
ADD COLUMN annotations_json JSONB DEFAULT NULL;

COMMENT ON COLUMN defect_photos.annotations_json IS
  'Non-destructive annotation layer (arrows, circles, text) as JSON. Original photo unchanged.';
```

## Component Design

### 1. CameraCapture v2

**File:** `components/camera/CameraCapture.tsx` (modify existing)
**New file:** `components/camera/CameraPreview.tsx` (~80 lines)

**Flow:**

1. Camera opens → badge in corner shows photo count (e.g., "3")
2. User taps shutter → photo captured → immediate preview appears
3. Preview has two buttons: **"Confirm"** (save & stay in camera) | **"Edit"** (open AnnotationEditor)
4. After edit/confirm → back to camera for next shot
5. **"Done"** button → navigates to PhotoReviewGrid
6. If only 1 photo and user presses confirm → skip review grid, return directly

**Props (updated):**

```typescript
interface CameraCaptureProps {
  visible: boolean;
  onClose: () => void;
  onPhotosConfirmed: (photos: CapturedPhoto[]) => void;
  initialPhotoCount?: number; // badge starts from existing count
  maxPhotos?: number; // default: 10 (existing MAX_PHOTOS)
}

interface CapturedPhoto {
  uri: string;
  width: number;
  height: number;
  annotations?: AnnotationLayer;
}
```

**Badge:** Animated green circle with white number, top-right corner. Uses Reanimated FadeIn.

**CameraPreview sub-component:**

- Full-screen image preview
- Bottom bar: "Confirm" (green) | "Edit" (outline) buttons
- Swipe down to discard (retake)
- RTL layout

### 2. AnnotationEditor

**File:** `components/camera/AnnotationEditor.tsx` (~200 lines)
**Hook:** `hooks/useAnnotationEditor.ts` (~120 lines)

**Layout:**

- Full-screen Modal
- Image fills screen (aspect-fit) with Skia Canvas overlay
- Bottom toolbar: arrow | circle | underline | text | undo
- Active tool highlighted in primary green
- Top bar: "Cancel" (right, RTL) | "Save" (left)

**Interaction:**

- Select tool → draw on image with gesture
- Arrow: drag from start to end, arrowhead rendered at endpoint
- Circle: drag from center outward, ellipse follows finger
- Underline: drag horizontal line
- Text: tap location → text input modal appears → place text
- Undo: removes last annotation from array
- All drawing in red (#FF0000), strokeWidth 3

**Props:**

```typescript
interface AnnotationEditorProps {
  visible: boolean;
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  initialAnnotations?: AnnotationLayer;
  onSave: (annotations: AnnotationLayer) => void;
  onClose: () => void;
}
```

**Rendering with Skia:**

- `<Canvas>` wrapping `<Image>` (background photo) + annotation paths
- Each annotation → Skia `<Path>` or `<Text>` node
- Arrow: line path + triangle head (3-point polygon)
- Circle: `<Oval>` with stroke style
- Underline: simple `<Line>`
- Text: Skia `<Text>` with Rubik font

**Export for PDF:**

- Utility function `renderAnnotationsToImage(imageUri, annotationLayer): Promise<string>`
- Uses Skia offscreen canvas to composite image + annotations → returns base64 PNG
- Called during PDF generation, NOT during save

### 3. PhotoReviewGrid

**File:** `components/camera/PhotoReviewGrid.tsx` (~150 lines)

**Layout:**

- Full-screen Modal
- Header: "Review photos" (Hebrew) + photo count badge
- Grid: 3 columns, square thumbnails with annotation indicator (small pen icon if has annotations)
- Tap thumbnail → enlarged view with "Edit" | "Delete" buttons
- Bottom: "Confirm All" green CTA button

**Props:**

```typescript
interface PhotoReviewGridProps {
  visible: boolean;
  photos: CapturedPhoto[];
  onPhotosConfirmed: (photos: CapturedPhoto[]) => void;
  onClose: () => void;
}
```

**Delete:** Alert.alert confirmation (Hebrew) → removes from array.
**Edit:** Opens AnnotationEditor with photo + existing annotations.

### 4. useAnnotationEditor Hook

**File:** `hooks/useAnnotationEditor.ts`

```typescript
interface UseAnnotationEditorReturn {
  activeTool: AnnotationTool;
  setActiveTool: (tool: AnnotationTool) => void;
  annotations: Annotation[];
  addAnnotation: (annotation: Annotation) => void;
  undo: () => void;
  canUndo: boolean;
  clear: () => void;
  toLayer: (width: number, height: number) => AnnotationLayer;
  loadLayer: (layer: AnnotationLayer) => void;
}
```

## Integration Points

### PhotoGrid (existing, in defect form)

**File:** `components/defect/PhotoGrid.tsx` (modify)

- Tap on existing photo thumbnail → opens AnnotationEditor (not just preview)
- Loads `annotations_json` from DB for that photo
- On save → updates `annotations_json` in `defect_photos` table

### add-defect.tsx (existing)

**File:** `app/(app)/reports/[id]/add-defect.tsx` (modify)

- Replace current `handleCapture` with new `onPhotosConfirmed` from CameraCapture v2
- Handle array of CapturedPhoto instead of single URI
- Save annotations_json alongside photo record

### PDF Generation

**Files:** `lib/pdf/bedekBayit.ts`, `lib/pdf/protocol.ts`, `lib/pdf/shared.ts`

- When building PDF HTML, check if photo has `annotations_json`
- If yes, call `renderAnnotationsToImage()` to get composited image
- Use composited image in PDF instead of raw photo
- Original photo in storage remains unchanged

## File Summary

| Action | File                                               |
| ------ | -------------------------------------------------- |
| Create | `components/camera/CameraPreview.tsx`              |
| Create | `components/camera/AnnotationEditor.tsx`           |
| Create | `components/camera/PhotoReviewGrid.tsx`            |
| Create | `hooks/useAnnotationEditor.ts`                     |
| Create | `supabase/migrations/018_add_annotations_json.sql` |
| Create | `lib/annotations/renderAnnotations.ts`             |
| Modify | `components/camera/CameraCapture.tsx`              |
| Modify | `components/camera/index.ts`                       |
| Modify | `components/defect/PhotoGrid.tsx`                  |
| Modify | `app/(app)/reports/[id]/add-defect.tsx`            |
| Modify | `lib/pdf/shared.ts`                                |
| Modify | `lib/pdf/types.ts`                                 |
| Modify | `packages/shared/src/i18n/he.json`                 |
| Modify | `packages/shared/src/i18n/en.json`                 |

## Design System Compliance

- Background: cream[50] (#FEFDFB)
- Primary buttons: primary[500] green
- Borders: cream[200]
- Font: Rubik (Hebrew), Feather icons
- RTL: row-reverse, textAlign right
- Border radius: min 10px on interactive elements
- Haptics on all press actions
- Annotation color: #FF0000 (red) — high contrast on any photo
