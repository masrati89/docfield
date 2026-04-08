# Digital Signatures + Pre-PDF Summary — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add signature capture (Skia drawing pad), inspector signature/stamp in Settings, tenant signature per-report (delivery only), pre-PDF summary screen, and status badge toggle — so PDF generation includes real signatures.

**Architecture:** SignaturePad is a reusable Skia canvas component. Inspector saves signature once in Settings (stored in `users.signature_url`/`stamp_url`). When generating PDF, a summary modal shows defect counts, then (for delivery reports) a tenant signature screen collects the tenant's signature. PDF generation fetches both signatures. Status management moves from large buttons to a small toggleable badge.

**Tech Stack:** @shopify/react-native-skia, expo-image-picker, Supabase Storage (signatures bucket), React Native Modal, Reanimated

**Spec:** `docs/superpowers/specs/2026-04-05-digital-signatures-design.md`

---

## File Structure

### New Files

| File                                                        | Responsibility                                                          |
| ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| `supabase/migrations/016_add_stamp_url.sql`                 | Add `stamp_url` column to users table                                   |
| `apps/mobile/components/ui/SignaturePad.tsx`                | Reusable Skia drawing canvas for signature capture                      |
| `apps/mobile/hooks/useSignature.ts`                         | Upload/fetch/delete inspector signatures+stamps, save tenant signatures |
| `apps/mobile/components/settings/SignatureStampSection.tsx` | Settings section for managing inspector signature + stamp               |
| `apps/mobile/components/reports/PrePdfSummary.tsx`          | Summary modal showing defect counts before PDF generation               |
| `apps/mobile/components/reports/TenantSignatureScreen.tsx`  | Tenant name + signature capture for delivery reports                    |
| `apps/mobile/components/reports/StatusBadge.tsx`            | Small tappable status badge with dropdown                               |

### Modified Files

| File                                                  | Change                                                     |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| `packages/shared/src/types/auth.types.ts`             | Add `signatureUrl`, `stampUrl` optional fields to User     |
| `packages/shared/src/i18n/he.json`                    | Add new signature/summary i18n keys                        |
| `packages/shared/src/i18n/en.json`                    | Add new signature/summary i18n keys                        |
| `apps/mobile/contexts/AuthContext.tsx`                | Map `signature_url`, `stamp_url` from DB to profile        |
| `apps/mobile/components/ui/index.ts`                  | Export SignaturePad                                        |
| `apps/mobile/components/settings/index.ts`            | Export SignatureStampSection                               |
| `apps/mobile/components/reports/index.ts`             | Export PrePdfSummary, TenantSignatureScreen, StatusBadge   |
| `apps/mobile/app/(app)/settings/index.tsx`            | Add SignatureStampSection between Preferences and Info     |
| `apps/mobile/components/reports/ReportActionsBar.tsx` | Remove status buttons, wire PDF/share to open summary flow |
| `apps/mobile/components/reports/ReportHeaderBar.tsx`  | Add StatusBadge next to title                              |
| `apps/mobile/hooks/usePdfGeneration.ts`               | Fetch inspector signature/stamp from user profile          |
| `apps/mobile/app/(app)/reports/[id]/index.tsx`        | Add summary/signature modal state, wire new flow           |

---

## Task 1: Install @shopify/react-native-skia + DB Migration

**Files:**

- Modify: `package.json` (mobile app)
- Create: `supabase/migrations/016_add_stamp_url.sql`
- Modify: `packages/shared/src/types/auth.types.ts`
- Modify: `packages/shared/src/i18n/he.json`
- Modify: `packages/shared/src/i18n/en.json`

- [ ] **Step 1: Install @shopify/react-native-skia**

```bash
cd apps/mobile && npx expo install @shopify/react-native-skia
```

- [ ] **Step 2: Create migration for stamp_url**

Create `supabase/migrations/016_add_stamp_url.sql`:

```sql
-- Add stamp_url column to users table for inspector stamp image
ALTER TABLE users ADD COLUMN IF NOT EXISTS stamp_url TEXT;

-- Allow inspector to update their own signature_url and stamp_url
-- (existing RLS policies on users table already scope by org_id)
COMMENT ON COLUMN users.signature_url IS 'URL to inspector signature PNG in storage';
COMMENT ON COLUMN users.stamp_url IS 'URL to inspector stamp/logo PNG in storage';
```

- [ ] **Step 3: Add signatureUrl and stampUrl to User type**

In `packages/shared/src/types/auth.types.ts`, add to the `User` interface:

```typescript
export interface User extends TenantEntity {
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  signatureUrl?: string;
  stampUrl?: string;
  isActive: boolean;
}
```

- [ ] **Step 4: Add i18n keys**

Add to `packages/shared/src/i18n/he.json` — extend the existing `"signatures"` section and add `"summary"`:

```json
{
  "signatures": {
    "inspectorSignature": "חתימת בודק",
    "tenantSignature": "חתימת דייר",
    "signHere": "חתום כאן",
    "clear": "נקה חתימה",
    "signed": "נחתם",
    "signatureRequired": "נדרשת חתימה",
    "title": "חתימה וחותמת",
    "save": "שמור חתימה",
    "replace": "החלף",
    "stamp": "חותמת (אופציונלי)",
    "uploadStamp": "העלה חותמת",
    "tenantName": "שם הדייר",
    "signAndGenerate": "חתום והפק PDF",
    "noSignature": "לא הוגדרה חתימה — הגדר בהגדרות",
    "existingSignature": "חתימת דייר קיימת",
    "deleteConfirm": "למחוק את החתימה?",
    "unsavedSignature": "יש חתימה שלא נשמרה. לצאת?",
    "nameRequired": "שם הדייר הוא שדה חובה"
  },
  "summary": {
    "title": "סיכום דוח",
    "totalDefects": "סה\"כ ליקויים",
    "noDefects": "אין ליקויים",
    "generatePdf": "הפק PDF",
    "continueToSignature": "המשך לחתימה",
    "back": "חזרה"
  }
}
```

Add matching keys to `packages/shared/src/i18n/en.json`:

```json
{
  "signatures": {
    "inspectorSignature": "Inspector Signature",
    "tenantSignature": "Tenant Signature",
    "signHere": "Sign here",
    "clear": "Clear signature",
    "signed": "Signed",
    "signatureRequired": "Signature required",
    "title": "Signature & Stamp",
    "save": "Save signature",
    "replace": "Replace",
    "stamp": "Stamp (optional)",
    "uploadStamp": "Upload stamp",
    "tenantName": "Tenant name",
    "signAndGenerate": "Sign & generate PDF",
    "noSignature": "No signature set — set in Settings",
    "existingSignature": "Existing tenant signature",
    "deleteConfirm": "Delete signature?",
    "unsavedSignature": "Unsaved signature. Leave?",
    "nameRequired": "Tenant name is required"
  },
  "summary": {
    "title": "Report Summary",
    "totalDefects": "Total defects",
    "noDefects": "No defects",
    "generatePdf": "Generate PDF",
    "continueToSignature": "Continue to signature",
    "back": "Back"
  }
}
```

- [ ] **Step 5: Update AuthContext to map new fields**

In `apps/mobile/contexts/AuthContext.tsx`, update the `fetchProfile` function's `userProfile` mapping (around line 78):

```typescript
const userProfile: User = {
  id: data.id,
  organizationId: data.organization_id,
  email: data.email,
  fullName: data.full_name,
  role: data.role,
  phone: data.phone ?? undefined,
  signatureUrl: data.signature_url ?? undefined,
  stampUrl: data.stamp_url ?? undefined,
  isActive: data.is_active,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
};
```

- [ ] **Step 6: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS (0 errors). The new optional fields won't break existing code.

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/016_add_stamp_url.sql packages/shared/src/types/auth.types.ts packages/shared/src/i18n/he.json packages/shared/src/i18n/en.json apps/mobile/contexts/AuthContext.tsx apps/mobile/package.json
git commit -m "feat: add stamp_url migration, User type fields, i18n keys, install skia"
```

---

## Task 2: SignaturePad Component (Skia Drawing Canvas)

**Files:**

- Create: `apps/mobile/components/ui/SignaturePad.tsx`
- Modify: `apps/mobile/components/ui/index.ts`

- [ ] **Step 1: Create SignaturePad component**

Create `apps/mobile/components/ui/SignaturePad.tsx`:

```typescript
import { useCallback, useRef, useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import {
  Canvas,
  Path,
  Skia,
  useCanvasRef,
  useTouchHandler,
  SkPath,
} from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

interface SignaturePadProps {
  onSave: (base64Png: string) => void;
  onClear?: () => void;
  height?: number;
  disabled?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
}

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
  const currentPath = useRef<SkPath | null>(null);
  const pointCount = useRef(0);

  const touchHandler = useTouchHandler(
    {
      onStart: ({ x, y }) => {
        if (disabled) return;
        const path = Skia.Path.Make();
        path.moveTo(x, y);
        currentPath.current = path;
        pointCount.current = 1;
      },
      onActive: ({ x, y }) => {
        if (disabled || !currentPath.current) return;
        currentPath.current.lineTo(x, y);
        pointCount.current += 1;
        // Force re-render by updating paths
        setPaths((prev) => [...prev.slice(0, -1), currentPath.current!.copy()]);
      },
      onEnd: () => {
        if (disabled || !currentPath.current) return;
        setPaths((prev) => [...prev, currentPath.current!.copy()]);
        currentPath.current = null;
      },
    },
    [disabled]
  );

  const handleClear = useCallback(() => {
    setPaths([]);
    currentPath.current = null;
    pointCount.current = 0;
    onClear?.();
  }, [onClear]);

  const handleSave = useCallback(() => {
    if (!canvasRef.current || pointCount.current < 2) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const image = canvasRef.current.makeImageSnapshot();
    if (!image) return;
    const base64 = image.encodeToBase64();
    onSave(base64);
  }, [canvasRef, onSave]);

  const hasStrokes = paths.length > 0;

  const paint = Skia.Paint();
  paint.setColor(Skia.Color(strokeColor));
  paint.setStrokeWidth(strokeWidth);
  paint.setStyle(1); // Stroke
  paint.setStrokeCap(1); // Round
  paint.setStrokeJoin(1); // Round
  paint.setAntiAlias(true);

  return (
    <View>
      {/* Canvas container */}
      <View
        style={{
          height,
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          borderRadius: BORDER_RADIUS.lg,
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Canvas
          ref={canvasRef}
          style={{ flex: 1 }}
          onTouch={touchHandler}
        >
          {paths.map((path, idx) => (
            <Path key={idx} path={path} paint={paint} />
          ))}
        </Canvas>

        {/* Placeholder text when empty */}
        {!hasStrokes && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: COLORS.neutral[400],
                fontFamily: 'Rubik-Regular',
              }}
            >
              חתום כאן
            </Text>
          </View>
        )}
      </View>

      {/* Action buttons */}
      <View
        style={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          marginTop: 8,
        }}
      >
        <Pressable
          onPress={handleSave}
          disabled={!hasStrokes || disabled}
          style={{
            height: 36,
            paddingHorizontal: 20,
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: hasStrokes ? COLORS.primary[500] : COLORS.neutral[200],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: hasStrokes ? COLORS.white : COLORS.neutral[400],
              fontFamily: 'Rubik-SemiBold',
            }}
          >
            שמור חתימה
          </Text>
        </Pressable>

        {hasStrokes && (
          <Pressable
            onPress={handleClear}
            style={{
              height: 36,
              paddingHorizontal: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: COLORS.neutral[500],
                fontFamily: 'Rubik-Regular',
              }}
            >
              נקה חתימה
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Export from barrel**

Add to `apps/mobile/components/ui/index.ts`:

```typescript
export { SignaturePad } from './SignaturePad';
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS. Note: Skia types may need adjustment after install — if touch handler API differs, adapt accordingly.

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/components/ui/SignaturePad.tsx apps/mobile/components/ui/index.ts
git commit -m "feat: add SignaturePad component with Skia drawing canvas"
```

---

## Task 3: useSignature Hook

**Files:**

- Create: `apps/mobile/hooks/useSignature.ts`

- [ ] **Step 1: Create useSignature hook**

Create `apps/mobile/hooks/useSignature.ts`:

```typescript
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { decode } from 'base64-arraybuffer';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { PdfSignature } from '@/lib/pdf';

// --- Types ---

interface UseSignatureReturn {
  // Inspector (from user profile)
  inspectorSignatureUrl: string | null;
  inspectorStampUrl: string | null;
  saveInspectorSignature: (base64Png: string) => Promise<void>;
  deleteInspectorSignature: () => Promise<void>;
  saveInspectorStamp: (imageUri: string) => Promise<void>;
  deleteInspectorStamp: () => Promise<void>;

  // Tenant (per report)
  saveTenantSignature: (
    reportId: string,
    name: string,
    base64Png: string
  ) => Promise<void>;
  getTenantSignature: (reportId: string) => Promise<PdfSignature | null>;

  // State
  isUploading: boolean;
  error: string | null;
}

// --- Hook ---

export function useSignature(): UseSignatureReturn {
  const { profile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orgId = profile?.organizationId;
  const userId = profile?.id;

  // --- Inspector Signature ---

  const saveInspectorSignature = useCallback(
    async (base64Png: string) => {
      if (!orgId || !userId) return;
      setIsUploading(true);
      setError(null);
      try {
        const path = `${orgId}/inspector_${userId}.png`;
        const { error: uploadError } = await supabase.storage
          .from('signatures')
          .upload(path, decode(base64Png), {
            contentType: 'image/png',
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('signatures').getPublicUrl(path);

        const { error: updateError } = await supabase
          .from('users')
          .update({ signature_url: publicUrl })
          .eq('id', userId);

        if (updateError) throw updateError;
      } catch {
        setError('שגיאה בשמירת החתימה');
      } finally {
        setIsUploading(false);
      }
    },
    [orgId, userId]
  );

  const deleteInspectorSignature = useCallback(async () => {
    if (!orgId || !userId) return;
    setIsUploading(true);
    setError(null);
    try {
      await supabase.storage
        .from('signatures')
        .remove([`${orgId}/inspector_${userId}.png`]);

      await supabase
        .from('users')
        .update({ signature_url: null })
        .eq('id', userId);
    } catch {
      setError('שגיאה במחיקת החתימה');
    } finally {
      setIsUploading(false);
    }
  }, [orgId, userId]);

  // --- Inspector Stamp ---

  const saveInspectorStamp = useCallback(
    async (imageUri: string) => {
      if (!orgId || !userId) return;
      setIsUploading(true);
      setError(null);
      try {
        // Resize stamp to max 300x150
        const manipulated = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: 300 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.PNG }
        );

        const response = await fetch(manipulated.uri);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        const path = `${orgId}/stamp_${userId}.png`;
        const { error: uploadError } = await supabase.storage
          .from('signatures')
          .upload(path, arrayBuffer, {
            contentType: 'image/png',
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('signatures').getPublicUrl(path);

        const { error: updateError } = await supabase
          .from('users')
          .update({ stamp_url: publicUrl })
          .eq('id', userId);

        if (updateError) throw updateError;
      } catch {
        setError('שגיאה בשמירת החותמת');
      } finally {
        setIsUploading(false);
      }
    },
    [orgId, userId]
  );

  const deleteInspectorStamp = useCallback(async () => {
    if (!orgId || !userId) return;
    setIsUploading(true);
    setError(null);
    try {
      await supabase.storage
        .from('signatures')
        .remove([`${orgId}/stamp_${userId}.png`]);

      await supabase.from('users').update({ stamp_url: null }).eq('id', userId);
    } catch {
      setError('שגיאה במחיקת החותמת');
    } finally {
      setIsUploading(false);
    }
  }, [orgId, userId]);

  // --- Tenant Signature ---

  const saveTenantSignature = useCallback(
    async (reportId: string, name: string, base64Png: string) => {
      if (!orgId) return;
      setIsUploading(true);
      setError(null);
      try {
        const uuid = Math.random().toString(36).slice(2, 10);
        const path = `${orgId}/${reportId}/tenant_${uuid}.png`;

        const { error: uploadError } = await supabase.storage
          .from('signatures')
          .upload(path, decode(base64Png), {
            contentType: 'image/png',
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('signatures').getPublicUrl(path);

        const { error: insertError } = await supabase
          .from('signatures')
          .insert({
            delivery_report_id: reportId,
            organization_id: orgId,
            signer_type: 'tenant',
            signer_name: name,
            image_url: publicUrl,
          });

        if (insertError) throw insertError;
      } catch {
        setError('שגיאה בשמירת חתימת הדייר');
      } finally {
        setIsUploading(false);
      }
    },
    [orgId]
  );

  const getTenantSignature = useCallback(
    async (reportId: string): Promise<PdfSignature | null> => {
      const { data } = await supabase
        .from('signatures')
        .select('signer_type, signer_name, image_url, signed_at')
        .eq('delivery_report_id', reportId)
        .eq('signer_type', 'tenant')
        .maybeSingle();

      if (!data) return null;

      return {
        signerType: 'tenant',
        signerName: data.signer_name as string,
        imageUrl: data.image_url as string,
        signedAt: data.signed_at as string,
      };
    },
    []
  );

  return {
    inspectorSignatureUrl: profile?.signatureUrl ?? null,
    inspectorStampUrl: profile?.stampUrl ?? null,
    saveInspectorSignature,
    deleteInspectorSignature,
    saveInspectorStamp,
    deleteInspectorStamp,
    saveTenantSignature,
    getTenantSignature,
    isUploading,
    error,
  };
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/hooks/useSignature.ts
git commit -m "feat: add useSignature hook for inspector/tenant signature management"
```

---

## Task 4: SignatureStampSection in Settings

**Files:**

- Create: `apps/mobile/components/settings/SignatureStampSection.tsx`
- Modify: `apps/mobile/components/settings/index.ts`
- Modify: `apps/mobile/app/(app)/settings/index.tsx`

- [ ] **Step 1: Create SignatureStampSection component**

Create `apps/mobile/components/settings/SignatureStampSection.tsx`:

```typescript
import { useCallback, useState } from 'react';
import { View, Text, Pressable, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { SignaturePad } from '@/components/ui/SignaturePad';
import { useSignature } from '@/hooks/useSignature';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';

interface SignatureStampSectionProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export function SignatureStampSection({
  onSuccess,
  onError,
}: SignatureStampSectionProps) {
  const {
    inspectorSignatureUrl,
    inspectorStampUrl,
    saveInspectorSignature,
    deleteInspectorSignature,
    saveInspectorStamp,
    deleteInspectorStamp,
    isUploading,
  } = useSignature();

  const [showSignaturePad, setShowSignaturePad] = useState(false);

  // --- Signature ---

  const handleSaveSignature = useCallback(
    async (base64Png: string) => {
      try {
        await saveInspectorSignature(base64Png);
        setShowSignaturePad(false);
        onSuccess?.('החתימה נשמרה בהצלחה');
      } catch {
        onError?.('שגיאה בשמירת החתימה');
      }
    },
    [saveInspectorSignature, onSuccess, onError]
  );

  const handleDeleteSignature = useCallback(() => {
    Alert.alert('מחיקת חתימה', 'למחוק את החתימה?', [
      { text: 'ביטול', style: 'cancel' },
      {
        text: 'מחק',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteInspectorSignature();
            onSuccess?.('החתימה נמחקה');
          } catch {
            onError?.('שגיאה במחיקת החתימה');
          }
        },
      },
    ]);
  }, [deleteInspectorSignature, onSuccess, onError]);

  // --- Stamp ---

  const handleUploadStamp = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 0.8,
        allowsEditing: true,
        aspect: [2, 1],
      });

      if (result.canceled || !result.assets[0]) return;

      await saveInspectorStamp(result.assets[0].uri);
      onSuccess?.('החותמת נשמרה בהצלחה');
    } catch {
      onError?.('שגיאה בשמירת החותמת');
    }
  }, [saveInspectorStamp, onSuccess, onError]);

  const handleDeleteStamp = useCallback(() => {
    Alert.alert('מחיקת חותמת', 'למחוק את החותמת?', [
      { text: 'ביטול', style: 'cancel' },
      {
        text: 'מחק',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteInspectorStamp();
            onSuccess?.('החותמת נמחקה');
          } catch {
            onError?.('שגיאה במחיקת החותמת');
          }
        },
      },
    ]);
  }, [deleteInspectorStamp, onSuccess, onError]);

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
      {/* Section title */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.neutral[800],
          fontFamily: 'Rubik-SemiBold',
          textAlign: 'right',
          marginBottom: 16,
        }}
      >
        חתימה וחותמת
      </Text>

      {/* Signature area */}
      <Text
        style={{
          fontSize: 13,
          color: COLORS.neutral[600],
          fontFamily: 'Rubik-Regular',
          textAlign: 'right',
          marginBottom: 8,
        }}
      >
        חתימת בודק
      </Text>

      {isUploading && (
        <SkeletonBlock width="100%" height={120} borderRadius={12} />
      )}

      {!isUploading && inspectorSignatureUrl && !showSignaturePad ? (
        <View>
          <View
            style={{
              height: 120,
              borderWidth: 1,
              borderColor: COLORS.cream[200],
              borderRadius: BORDER_RADIUS.lg,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Image
              source={{ uri: inspectorSignatureUrl }}
              style={{ width: '80%', height: 80 }}
              resizeMode="contain"
            />
          </View>
          <View
            style={{
              flexDirection: 'row-reverse',
              gap: 12,
              marginTop: 8,
            }}
          >
            <Pressable
              onPress={() => setShowSignaturePad(true)}
              style={{
                height: 36,
                paddingHorizontal: 16,
                borderRadius: BORDER_RADIUS.md,
                borderWidth: 1,
                borderColor: COLORS.cream[200],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.neutral[600],
                  fontFamily: 'Rubik-Regular',
                }}
              >
                החלף
              </Text>
            </Pressable>
            <Pressable
              onPress={handleDeleteSignature}
              style={{
                height: 36,
                paddingHorizontal: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.danger[500],
                  fontFamily: 'Rubik-Regular',
                }}
              >
                מחק
              </Text>
            </Pressable>
          </View>
        </View>
      ) : !isUploading ? (
        <SignaturePad onSave={handleSaveSignature} height={180} />
      ) : null}

      {/* Stamp area */}
      <View style={{ marginTop: 24 }}>
        <Text
          style={{
            fontSize: 13,
            color: COLORS.neutral[600],
            fontFamily: 'Rubik-Regular',
            textAlign: 'right',
            marginBottom: 8,
          }}
        >
          חותמת (אופציונלי)
        </Text>

        {inspectorStampUrl ? (
          <View>
            <View
              style={{
                height: 100,
                borderWidth: 1,
                borderColor: COLORS.cream[200],
                borderRadius: BORDER_RADIUS.lg,
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <Image
                source={{ uri: inspectorStampUrl }}
                style={{ width: '60%', height: 70 }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                flexDirection: 'row-reverse',
                gap: 12,
                marginTop: 8,
              }}
            >
              <Pressable
                onPress={handleUploadStamp}
                style={{
                  height: 36,
                  paddingHorizontal: 16,
                  borderRadius: BORDER_RADIUS.md,
                  borderWidth: 1,
                  borderColor: COLORS.cream[200],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.neutral[600],
                    fontFamily: 'Rubik-Regular',
                  }}
                >
                  החלף
                </Text>
              </Pressable>
              <Pressable
                onPress={handleDeleteStamp}
                style={{
                  height: 36,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.danger[500],
                    fontFamily: 'Rubik-Regular',
                  }}
                >
                  מחק
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={handleUploadStamp}
            disabled={isUploading}
            style={{
              height: 80,
              borderWidth: 1,
              borderColor: COLORS.primary[200],
              borderStyle: 'dashed',
              borderRadius: BORDER_RADIUS.lg,
              backgroundColor: COLORS.primary[50],
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              opacity: isUploading ? 0.5 : 1,
            }}
          >
            <Feather name="upload" size={20} color={COLORS.primary[500]} />
            <Text
              style={{
                fontSize: 13,
                color: COLORS.primary[500],
                fontFamily: 'Rubik-Regular',
              }}
            >
              העלה חותמת
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Export from barrel**

Add to `apps/mobile/components/settings/index.ts`:

```typescript
export { SignatureStampSection } from './SignatureStampSection';
```

- [ ] **Step 3: Add to Settings screen**

In `apps/mobile/app/(app)/settings/index.tsx`, add import and insert between PreferencesSection and InfoSection:

Import:

```typescript
import {
  ProfileSection,
  ChangePasswordSection,
  PreferencesSection,
  SignatureStampSection,
  InfoSection,
  SignOutButton,
} from '@/components/settings';
```

Insert after the PreferencesSection divider (after line 103), before InfoSection:

```tsx
{
  /* 3.5 Signature & Stamp */
}
<SignatureStampSection
  onSuccess={(msg) => showToast(msg, 'success')}
  onError={(msg) => showToast(msg, 'error')}
/>;

{
  /* Divider */
}
<View className="mx-[20px] h-[1px] bg-cream-200 mb-[24px]" />;
```

- [ ] **Step 4: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/components/settings/SignatureStampSection.tsx apps/mobile/components/settings/index.ts apps/mobile/app/\(app\)/settings/index.tsx
git commit -m "feat: add signature & stamp section in Settings"
```

---

## Task 5: PrePdfSummary Component

**Files:**

- Create: `apps/mobile/components/reports/PrePdfSummary.tsx`

- [ ] **Step 1: Create PrePdfSummary component**

Create `apps/mobile/components/reports/PrePdfSummary.tsx`:

```typescript
import { View, Text, Modal, Pressable, ScrollView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';
import { DEFECT_CATEGORIES } from '@infield/shared';

import type { ReportInfo } from '@/hooks/useReport';

interface DefectInfo {
  id: string;
  category: string | null;
  severity?: string;
}

interface PrePdfSummaryProps {
  visible: boolean;
  report: ReportInfo;
  defects: DefectInfo[];
  onGeneratePdf: () => void;
  onContinueToSignature: () => void;
  onClose: () => void;
}

// Map category keys to Hebrew labels + icons
const CATEGORY_ICONS: Record<string, string> = {
  plaster: 'layers',
  painting: 'edit-2',
  tiling: 'grid',
  wall_cladding: 'sidebar',
  plumbing: 'droplet',
  electrical: 'zap',
  carpentry: 'tool',
  aluminum: 'square',
  waterproofing: 'umbrella',
  cleaning: 'wind',
  hvac: 'thermometer',
  gas: 'alert-triangle',
  elevators: 'arrow-up',
  general: 'file-text',
};

const CATEGORY_LABELS: Record<string, string> = {
  plaster: 'טיח',
  painting: 'צביעה',
  tiling: 'ריצוף',
  wall_cladding: 'חיפוי קירות',
  plumbing: 'אינסטלציה',
  electrical: 'חשמל',
  carpentry: 'נגרות',
  aluminum: 'אלומיניום',
  waterproofing: 'איטום',
  cleaning: 'ניקיון',
  hvac: 'מיזוג אוויר',
  gas: 'גז',
  elevators: 'מעליות',
  general: 'כללי',
};

export function PrePdfSummary({
  visible,
  report,
  defects,
  onGeneratePdf,
  onContinueToSignature,
  onClose,
}: PrePdfSummaryProps) {
  const isDelivery = report.reportType === 'delivery';

  // Group defects by category and count
  const categoryMap = new Map<string, number>();
  defects.forEach((d) => {
    const cat = d.category ?? 'general';
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
  });

  // Sort by count descending
  const categories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1]);

  const totalDefects = defects.length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'flex-end',
        }}
      >
        <Pressable onPress={() => {}}>
          <Animated.View
            entering={SlideInDown.duration(350).springify()}
            exiting={SlideOutDown.duration(250)}
            style={{
              backgroundColor: COLORS.cream[50],
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '85%',
              minHeight: 300,
              ...SHADOWS.up,
            }}
          >
            {/* Handle */}
            <View style={{ alignItems: 'center', paddingTop: 8 }}>
              <View
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: COLORS.cream[300],
                }}
              />
            </View>

            {/* Header */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 16,
                paddingBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: COLORS.neutral[800],
                  fontFamily: 'Rubik-Bold',
                  textAlign: 'right',
                }}
              >
                סיכום דוח
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.neutral[500],
                  fontFamily: 'Rubik-Regular',
                  textAlign: 'right',
                  marginTop: 4,
                }}
              >
                {report.projectName}
                {report.apartmentNumber ? ` — דירה ${report.apartmentNumber}` : ''}
              </Text>
            </View>

            {/* Content */}
            <ScrollView
              style={{ flex: 1, paddingHorizontal: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Total defects */}
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.cream[200],
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: COLORS.neutral[700],
                    fontFamily: 'Rubik-SemiBold',
                  }}
                >
                  סה"כ ליקויים
                </Text>
                <View
                  style={{
                    backgroundColor:
                      totalDefects > 0
                        ? COLORS.danger[50]
                        : COLORS.success[50],
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: BORDER_RADIUS.full,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color:
                        totalDefects > 0
                          ? COLORS.danger[500]
                          : COLORS.success[500],
                      fontFamily: 'Rubik-Bold',
                    }}
                  >
                    {totalDefects}
                  </Text>
                </View>
              </View>

              {/* Category breakdown */}
              {totalDefects === 0 ? (
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 32,
                    gap: 8,
                  }}
                >
                  <Feather
                    name="check-circle"
                    size={32}
                    color={COLORS.success[500]}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.success[600],
                      fontFamily: 'Rubik-Regular',
                    }}
                  >
                    אין ליקויים
                  </Text>
                </View>
              ) : (
                <View style={{ paddingTop: 8, gap: 4 }}>
                  {categories.map(([cat, count]) => (
                    <View
                      key={cat}
                      style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                        paddingHorizontal: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.cream[100],
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row-reverse',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <Feather
                          name={(CATEGORY_ICONS[cat] ?? 'file-text') as any}
                          size={16}
                          color={COLORS.neutral[500]}
                        />
                        <Text
                          style={{
                            fontSize: 13,
                            color: COLORS.neutral[700],
                            fontFamily: 'Rubik-Regular',
                          }}
                        >
                          {CATEGORY_LABELS[cat] ?? cat}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: COLORS.neutral[600],
                          fontFamily: 'Rubik-SemiBold',
                        }}
                      >
                        {count}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* Footer */}
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderTopWidth: 1,
                borderTopColor: COLORS.cream[200],
              }}
            >
              <Pressable
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  if (isDelivery) {
                    onContinueToSignature();
                  } else {
                    onGeneratePdf();
                  }
                }}
                style={{
                  height: 48,
                  flex: 1,
                  marginStart: 12,
                  borderRadius: BORDER_RADIUS.md,
                  backgroundColor: COLORS.primary[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: COLORS.white,
                    fontFamily: 'Rubik-SemiBold',
                  }}
                >
                  {isDelivery ? 'המשך לחתימה' : 'הפק PDF'}
                </Text>
              </Pressable>

              <Pressable
                onPress={onClose}
                style={{
                  height: 48,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.neutral[500],
                    fontFamily: 'Rubik-Regular',
                  }}
                >
                  חזרה
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/components/reports/PrePdfSummary.tsx
git commit -m "feat: add PrePdfSummary modal component"
```

---

## Task 6: TenantSignatureScreen Component

**Files:**

- Create: `apps/mobile/components/reports/TenantSignatureScreen.tsx`

- [ ] **Step 1: Create TenantSignatureScreen component**

Create `apps/mobile/components/reports/TenantSignatureScreen.tsx`:

```typescript
import { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';
import { SignaturePad } from '@/components/ui/SignaturePad';

interface TenantSignatureScreenProps {
  visible: boolean;
  initialName?: string;
  isUploading: boolean;
  onSign: (name: string, base64Png: string) => void;
  onClose: () => void;
}

export function TenantSignatureScreen({
  visible,
  initialName = '',
  isUploading,
  onSign,
  onClose,
}: TenantSignatureScreenProps) {
  const [name, setName] = useState(initialName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null);
  const hasDrawn = useRef(false);

  const handleSaveSignature = useCallback((base64: string) => {
    setSignatureBase64(base64);
    hasDrawn.current = true;
  }, []);

  const handleClearSignature = useCallback(() => {
    setSignatureBase64(null);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('שם הדייר הוא שדה חובה');
      return;
    }
    if (!signatureBase64) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSign(trimmedName, signatureBase64);
  }, [name, signatureBase64, onSign]);

  const handleClose = useCallback(() => {
    if (hasDrawn.current && signatureBase64) {
      Alert.alert('חתימה לא נשמרה', 'יש חתימה שלא נשמרה. לצאת?', [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'כן, צא',
          style: 'destructive',
          onPress: onClose,
        },
      ]);
    } else {
      onClose();
    }
  }, [signatureBase64, onClose]);

  const canSubmit = name.trim().length > 0 && !!signatureBase64 && !isUploading;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Pressable
        onPress={handleClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'flex-end',
        }}
      >
        <Pressable onPress={() => {}}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Animated.View
              entering={SlideInDown.duration(350).springify()}
              exiting={SlideOutDown.duration(250)}
              style={{
                backgroundColor: COLORS.cream[50],
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                maxHeight: '92%',
                minHeight: 400,
                ...SHADOWS.up,
              }}
            >
              {/* Handle */}
              <View style={{ alignItems: 'center', paddingTop: 8 }}>
                <View
                  style={{
                    width: 36,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: COLORS.cream[300],
                  }}
                />
              </View>

              {/* Header */}
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  paddingTop: 16,
                  paddingBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: COLORS.neutral[800],
                    fontFamily: 'Rubik-Bold',
                  }}
                >
                  חתימת דייר
                </Text>
                <Pressable onPress={handleClose} style={{ padding: 4 }}>
                  <Feather name="x" size={20} color={COLORS.neutral[500]} />
                </Pressable>
              </View>

              {/* Name field */}
              <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.neutral[600],
                    fontFamily: 'Rubik-Regular',
                    textAlign: 'right',
                    marginBottom: 6,
                  }}
                >
                  שם הדייר
                </Text>
                <TextInput
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (nameError) setNameError(null);
                  }}
                  placeholder="שם מלא"
                  placeholderTextColor={COLORS.neutral[400]}
                  style={{
                    height: 44,
                    borderWidth: 1,
                    borderColor: nameError
                      ? COLORS.danger[500]
                      : COLORS.cream[200],
                    borderRadius: BORDER_RADIUS.md,
                    paddingHorizontal: 14,
                    fontSize: 14,
                    color: COLORS.neutral[800],
                    fontFamily: 'Rubik-Regular',
                    textAlign: 'right',
                    backgroundColor: '#FFFFFF',
                  }}
                />
                {nameError && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.danger[500],
                      fontFamily: 'Rubik-Regular',
                      textAlign: 'right',
                      marginTop: 4,
                    }}
                  >
                    {nameError}
                  </Text>
                )}
              </View>

              {/* Signature pad */}
              <View style={{ paddingHorizontal: 20, flex: 1, minHeight: 200 }}>
                <SignaturePad
                  onSave={handleSaveSignature}
                  onClear={handleClearSignature}
                  height={200}
                />
              </View>

              {/* Footer */}
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  borderTopWidth: 1,
                  borderTopColor: COLORS.cream[200],
                }}
              >
                <Pressable
                  onPress={handleSubmit}
                  disabled={!canSubmit}
                  style={{
                    height: 48,
                    flex: 1,
                    marginStart: 12,
                    borderRadius: BORDER_RADIUS.md,
                    backgroundColor: canSubmit
                      ? COLORS.primary[500]
                      : COLORS.neutral[200],
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isUploading ? 0.6 : 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: canSubmit ? COLORS.white : COLORS.neutral[400],
                      fontFamily: 'Rubik-SemiBold',
                    }}
                  >
                    {isUploading ? 'שומר...' : 'חתום והפק PDF'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleClose}
                  style={{
                    height: 48,
                    paddingHorizontal: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.neutral[500],
                      fontFamily: 'Rubik-Regular',
                    }}
                  >
                    חזרה
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/components/reports/TenantSignatureScreen.tsx
git commit -m "feat: add TenantSignatureScreen modal for delivery reports"
```

---

## Task 7: StatusBadge Component

**Files:**

- Create: `apps/mobile/components/reports/StatusBadge.tsx`

- [ ] **Step 1: Create StatusBadge component**

Create `apps/mobile/components/reports/StatusBadge.tsx`:

```typescript
import { useCallback, useState } from 'react';
import { View, Text, Pressable, Modal, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';

type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'sent';

const STATUS_OPTIONS: { key: ReportStatus; label: string; color: string; bg: string }[] = [
  { key: 'draft', label: 'טיוטה', color: COLORS.neutral[500], bg: COLORS.neutral[100] },
  { key: 'in_progress', label: 'בביצוע', color: COLORS.warning[600], bg: COLORS.warning[50] },
  { key: 'completed', label: 'הושלם', color: COLORS.success[600], bg: COLORS.success[50] },
  { key: 'sent', label: 'נשלח', color: COLORS.primary[600], bg: COLORS.primary[50] },
];

interface StatusBadgeProps {
  status: ReportStatus;
  isUpdating: boolean;
  onStatusChange: (newStatus: ReportStatus) => void;
}

export function StatusBadge({
  status,
  isUpdating,
  onStatusChange,
}: StatusBadgeProps) {
  const [showPicker, setShowPicker] = useState(false);
  const current = STATUS_OPTIONS.find((s) => s.key === status) ?? STATUS_OPTIONS[0];

  const handleSelect = useCallback(
    (newStatus: ReportStatus) => {
      setShowPicker(false);
      if (newStatus !== status) {
        onStatusChange(newStatus);
      }
    },
    [status, onStatusChange]
  );

  return (
    <>
      <Pressable
        onPress={() => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          setShowPicker(true);
        }}
        disabled={isUpdating}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: BORDER_RADIUS.full,
          backgroundColor: current.bg,
          opacity: isUpdating ? 0.5 : 1,
        }}
      >
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: current.color,
          }}
        />
        <Text
          style={{
            fontSize: 11,
            fontWeight: '500',
            color: current.color,
            fontFamily: 'Rubik-Medium',
          }}
        >
          {current.label}
        </Text>
        <Feather name="chevron-down" size={12} color={current.color} />
      </Pressable>

      {/* Status picker modal */}
      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <Pressable
          onPress={() => setShowPicker(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.cream[50],
              borderRadius: 12,
              padding: 8,
              minWidth: 180,
              elevation: 8,
              shadowColor: 'rgba(20,19,17,0.2)',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 12,
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <Pressable
                key={option.key}
                onPress={() => handleSelect(option.key)}
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor:
                    option.key === status ? COLORS.cream[100] : 'transparent',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: option.color,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.neutral[700],
                      fontFamily: 'Rubik-Regular',
                    }}
                  >
                    {option.label}
                  </Text>
                </View>
                {option.key === status && (
                  <Feather
                    name="check"
                    size={16}
                    color={COLORS.primary[500]}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/components/reports/StatusBadge.tsx
git commit -m "feat: add StatusBadge component with dropdown picker"
```

---

## Task 8: Update Barrel Exports

**Files:**

- Modify: `apps/mobile/components/reports/index.ts`

- [ ] **Step 1: Add new exports**

Add to `apps/mobile/components/reports/index.ts`:

```typescript
export { PrePdfSummary } from './PrePdfSummary';
export { TenantSignatureScreen } from './TenantSignatureScreen';
export { StatusBadge } from './StatusBadge';
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/components/reports/index.ts
git commit -m "feat: export new report components from barrel"
```

---

## Task 9: Update ReportHeaderBar with StatusBadge

**Files:**

- Modify: `apps/mobile/components/reports/ReportHeaderBar.tsx`

- [ ] **Step 1: Add StatusBadge to header**

Replace the full content of `apps/mobile/components/reports/ReportHeaderBar.tsx`:

```typescript
import { View, Text, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { COLORS } from '@infield/ui';
import { StatusBadge } from './StatusBadge';

type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'sent';

interface ReportHeaderBarProps {
  subtitle: string;
  topInset: number;
  status: ReportStatus;
  isStatusUpdating: boolean;
  onBack: () => void;
  onStatusChange: (newStatus: ReportStatus) => void;
}

export function ReportHeaderBar({
  subtitle,
  topInset,
  status,
  isStatusUpdating,
  onBack,
  onStatusChange,
}: ReportHeaderBarProps) {
  return (
    <View
      style={{
        backgroundColor: COLORS.primary[700],
        paddingTop: topInset + 8,
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
    >
      <Animated.View
        entering={FadeInDown.duration(200)}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Back button */}
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onBack();
            }}
            style={{
              padding: 4,
            }}
          >
            <Feather name="chevron-right" size={24} color={COLORS.white} />
          </Pressable>
          <View>
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: COLORS.white,
                  fontFamily: 'Rubik-Bold',
                  letterSpacing: -0.3,
                }}
              >
                inField
              </Text>
              <StatusBadge
                status={status}
                isUpdating={isStatusUpdating}
                onStatusChange={onStatusChange}
              />
            </View>
            {subtitle ? (
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.white,
                  opacity: 0.7,
                  fontWeight: '300',
                  fontFamily: 'Rubik-Regular',
                  marginTop: 4,
                }}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: May show errors in `reports/[id]/index.tsx` because the `ReportHeaderBar` props changed — that's expected and will be fixed in Task 11.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/components/reports/ReportHeaderBar.tsx
git commit -m "feat: add StatusBadge to ReportHeaderBar"
```

---

## Task 10: Update ReportActionsBar (Remove Status Buttons)

**Files:**

- Modify: `apps/mobile/components/reports/ReportActionsBar.tsx`

- [ ] **Step 1: Simplify ReportActionsBar**

Replace the full content of `apps/mobile/components/reports/ReportActionsBar.tsx`:

```typescript
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { COLORS, BORDER_RADIUS, SHADOWS } from '@infield/ui';

interface ReportActionsBarProps {
  bottomInset: number;
  defectsCount: number;
  isGenerating: boolean;
  isSharing: boolean;
  onGeneratePdf: () => void;
  onSharePdf: () => void;
  onChecklist: () => void;
  onAddDefect: () => void;
  onCamera: () => void;
  onLibrary: () => void;
}

export function ReportActionsBar({
  bottomInset,
  defectsCount,
  isGenerating,
  isSharing,
  onGeneratePdf,
  onSharePdf,
  onChecklist,
  onAddDefect,
  onCamera,
  onLibrary,
}: ReportActionsBarProps) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.cream[50],
        borderTopWidth: 1,
        borderTopColor: COLORS.cream[200],
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: Math.max(bottomInset, 24),
        gap: 8,
        ...SHADOWS.md,
      }}
    >
      {/* PDF & Share row */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* PDF download */}
        <Pressable
          onPress={onGeneratePdf}
          disabled={isGenerating}
          style={{
            flex: 1,
            height: 38,
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: COLORS.primary[500],
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            opacity: isGenerating ? 0.5 : 1,
          }}
        >
          <Feather name="download" size={16} color={COLORS.white} />
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: COLORS.white,
              fontFamily: 'Rubik-SemiBold',
            }}
          >
            {isGenerating ? 'מפיק...' : 'הפק PDF'}
          </Text>
        </Pressable>

        {/* Share */}
        <Pressable
          onPress={onSharePdf}
          disabled={isSharing}
          style={{
            width: 38,
            height: 38,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            backgroundColor: COLORS.cream[50],
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isSharing ? 0.5 : 1,
          }}
        >
          <Feather name="share-2" size={20} color={COLORS.primary[500]} />
        </Pressable>
      </View>

      {/* Checklist button */}
      <Pressable
        onPress={onChecklist}
        style={{
          height: 40,
          borderRadius: BORDER_RADIUS.md,
          backgroundColor: COLORS.gold[100],
          borderWidth: 1,
          borderColor: COLORS.gold[300],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <Feather name="check-square" size={16} color={COLORS.gold[700]} />
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: COLORS.gold[700],
            fontFamily: 'Rubik-SemiBold',
          }}
        >
          {defectsCount > 0 ? 'המשך בדיקה' : 'התחל בדיקה'}
        </Text>
      </Pressable>

      {/* Add defect row */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Pressable
          onPress={onAddDefect}
          style={{
            flex: 1,
            height: 44,
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: COLORS.primary[500],
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Feather name="plus" size={20} color={COLORS.white} />
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: COLORS.white,
              fontFamily: 'Rubik-SemiBold',
            }}
          >
            הוסף ממצא
          </Text>
        </Pressable>

        <Pressable
          onPress={onCamera}
          style={{
            width: 44,
            height: 44,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            backgroundColor: COLORS.cream[50],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="camera" size={20} color={COLORS.neutral[500]} />
        </Pressable>

        <Pressable
          onPress={onLibrary}
          style={{
            width: 44,
            height: 44,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            backgroundColor: COLORS.cream[50],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="search" size={20} color={COLORS.neutral[500]} />
        </Pressable>
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: Errors in `reports/[id]/index.tsx` — removed props. Fixed in Task 11.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/components/reports/ReportActionsBar.tsx
git commit -m "refactor: remove status buttons from ReportActionsBar, add PDF CTA"
```

---

## Task 11: Update usePdfGeneration + Wire Everything in Report Detail

**Files:**

- Modify: `apps/mobile/hooks/usePdfGeneration.ts`
- Modify: `apps/mobile/app/(app)/reports/[id]/index.tsx`

- [ ] **Step 1: Update usePdfGeneration to include inspector signature from profile**

In `apps/mobile/hooks/usePdfGeneration.ts`, update the `fetchFullReportData` function to accept inspector info and add it to the return data. Modify the hook to accept the inspector's profile data.

Replace the full content:

```typescript
import { useCallback, useState } from 'react';
import * as Print from 'expo-print';
import { Platform, Share } from 'react-native';

import { supabase } from '@/lib/supabase';
import { generateBedekBayitHtml, generateProtocolHtml } from '@/lib/pdf';
import type { PdfReportData, PdfDefect, PdfSignature } from '@/lib/pdf';

// --- Types ---

interface InspectorProfile {
  name: string;
  signatureUrl?: string;
  stampUrl?: string;
}

interface UsePdfGenerationResult {
  isGenerating: boolean;
  isSharing: boolean;
  generatePdf: (
    reportId: string,
    inspector?: InspectorProfile
  ) => Promise<string | null>;
  sharePdf: (
    reportId: string,
    inspector?: InspectorProfile,
    existingPdfUri?: string
  ) => Promise<void>;
}

// --- Fetcher ---

async function fetchFullReportData(
  reportId: string,
  inspector?: InspectorProfile
): Promise<PdfReportData> {
  // Fetch report with relations
  const { data: report, error: reportError } = await supabase
    .from('delivery_reports')
    .select(
      `id, report_type, status, tenant_name, tenant_phone, report_date, notes,
       apartments!inner(
         number, floor,
         buildings!inner(
           name,
           projects!inner(name, address)
         )
       )`
    )
    .eq('id', reportId)
    .single();

  if (reportError || !report) throw new Error('שגיאה בטעינת נתוני הדוח');

  const apt = report.apartments as unknown as {
    number: string;
    floor: number | null;
    buildings: {
      name: string;
      projects: { name: string; address: string | null };
    };
  };

  // Fetch defects with photos
  const { data: defectsData, error: defectsError } = await supabase
    .from('defects')
    .select(
      `id, description, room, category, severity, status, sort_order,
       standard_ref, recommendation, cost, cost_unit, notes,
       defect_photos(image_url, sort_order)`
    )
    .eq('delivery_report_id', reportId)
    .order('sort_order')
    .order('created_at');

  if (defectsError) throw new Error('שגיאה בטעינת ממצאים');

  const defects: PdfDefect[] = (defectsData ?? []).map(
    (d: Record<string, unknown>, idx: number) => {
      const photos =
        (d.defect_photos as Array<{ image_url: string; sort_order: number }>) ??
        [];
      return {
        number: idx + 1,
        title: d.description as string,
        location: (d.room as string) ?? '',
        category: (d.category as string) ?? 'כללי',
        standardRef: d.standard_ref as string | undefined,
        recommendation: d.recommendation as string | undefined,
        cost: d.cost as number | undefined,
        costLabel: d.cost_unit as string | undefined,
        note: d.notes as string | undefined,
        photoUrls: photos
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((p) => p.image_url),
      };
    }
  );

  // Fetch signatures from signatures table (tenant + any inspector entries)
  const { data: sigData } = await supabase
    .from('signatures')
    .select('signer_type, signer_name, image_url, signed_at')
    .eq('delivery_report_id', reportId);

  const signatures: PdfSignature[] = (sigData ?? []).map(
    (s: Record<string, unknown>) => ({
      signerType: s.signer_type as 'inspector' | 'tenant',
      signerName: s.signer_name as string,
      imageUrl: s.image_url as string | undefined,
      signedAt: s.signed_at as string,
    })
  );

  // Add inspector signature from user profile if not already in signatures table
  if (inspector?.signatureUrl) {
    const hasInspectorSig = signatures.some(
      (s) => s.signerType === 'inspector'
    );
    if (!hasInspectorSig) {
      signatures.push({
        signerType: 'inspector',
        signerName: inspector.name,
        imageUrl: inspector.signatureUrl,
        signedAt: new Date().toISOString(),
      });
    }
  }

  const reportRecord = report as Record<string, unknown>;

  return {
    reportType: report.report_type as 'bedek_bait' | 'delivery',
    reportNumber: reportId.slice(0, 8).toUpperCase(),
    reportDate: report.report_date,
    status: report.status as PdfReportData['status'],
    inspector: { name: inspector?.name ?? '' },
    property: {
      projectName: apt.buildings.projects.name,
      address: apt.buildings.projects.address ?? undefined,
      apartmentNumber: apt.number,
      floor: apt.floor ?? undefined,
    },
    client: {
      name: (reportRecord.tenant_name as string) ?? '',
      phone: reportRecord.tenant_phone as string | undefined,
    },
    defects,
    signatures,
    notes: report.notes ?? undefined,
    stampUrl: inspector?.stampUrl,
  };
}

// --- Hook ---

export function usePdfGeneration(
  onSuccess?: (message: string) => void,
  onError?: (message: string) => void
): UsePdfGenerationResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const generatePdf = useCallback(
    async (
      reportId: string,
      inspector?: InspectorProfile
    ): Promise<string | null> => {
      setIsGenerating(true);
      try {
        const data = await fetchFullReportData(reportId, inspector);

        const html =
          data.reportType === 'bedek_bait'
            ? generateBedekBayitHtml(data)
            : generateProtocolHtml(data);

        const { uri } = await Print.printToFileAsync({
          html,
          base64: false,
        });

        await supabase
          .from('delivery_reports')
          .update({ pdf_url: uri })
          .eq('id', reportId);

        onSuccess?.('הדוח הופק בהצלחה');
        return uri;
      } catch {
        onError?.('שגיאה בהפקת הדוח');
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [onSuccess, onError]
  );

  const sharePdf = useCallback(
    async (
      reportId: string,
      inspector?: InspectorProfile,
      existingPdfUri?: string
    ) => {
      setIsSharing(true);
      try {
        let uri = existingPdfUri;

        if (!uri) {
          uri = (await generatePdf(reportId, inspector)) ?? undefined;
        }

        if (!uri) {
          onError?.('שגיאה בהפקת הדוח לשיתוף');
          return;
        }

        if (Platform.OS === 'web') {
          onError?.('שיתוף אינו נתמך בדפדפן');
          return;
        }

        await Share.share({
          url: uri,
          title: 'דוח inField',
        });
      } catch {
        // User cancelled share — not an error
      } finally {
        setIsSharing(false);
      }
    },
    [generatePdf, onError]
  );

  return { isGenerating, isSharing, generatePdf, sharePdf };
}
```

- [ ] **Step 2: Update Report Detail screen**

Replace the full content of `apps/mobile/app/(app)/reports/[id]/index.tsx`:

```typescript
import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { usePdfGeneration } from '@/hooks/usePdfGeneration';
import { useReportStatus } from '@/hooks/useReportStatus';
import { useReport } from '@/hooks/useReport';
import { useSignature } from '@/hooks/useSignature';
import { STATUS_CONFIG } from '@/components/reports/reportDetailConstants';
import { CategoryAccordion } from '@/components/reports/CategoryAccordion';
import { ReportTabBar } from '@/components/reports/ReportTabBar';
import { ReportSkeleton } from '@/components/reports/ReportSkeleton';
import { ReportDetailsSection } from '@/components/reports/ReportDetailsSection';
import { ReportHeaderBar } from '@/components/reports/ReportHeaderBar';
import { ReportActionsBar } from '@/components/reports/ReportActionsBar';
import { ReportInfoCard } from '@/components/reports/ReportInfoCard';
import { PrePdfSummary } from '@/components/reports/PrePdfSummary';
import { TenantSignatureScreen } from '@/components/reports/TenantSignatureScreen';
import type {
  CategoryGroup,
  TabKey,
} from '@/components/reports/reportDetailConstants';

type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'sent';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const { profile } = useAuth();

  const {
    report,
    defects,
    isLoading,
    error: hasError,
    refetch,
  } = useReport(id);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const [activeTab, setActiveTab] = useState<TabKey>('findings');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  // Summary + signature flow state
  const [showSummary, setShowSummary] = useState(false);
  const [showTenantSignature, setShowTenantSignature] = useState(false);
  const [pdfAction, setPdfAction] = useState<'generate' | 'share'>('generate');

  const { isGenerating, isSharing, generatePdf, sharePdf } = usePdfGeneration(
    (msg) => showToast(msg, 'success'),
    (msg) => showToast(msg, 'error')
  );

  const {
    saveTenantSignature,
    getTenantSignature,
    isUploading: isSignatureUploading,
  } = useSignature();

  const {
    isUpdating: isStatusUpdating,
    markCompleted,
    reopenForEditing,
    transitionToDraft,
  } = useReportStatus(
    (msg) => {
      showToast(msg, 'success');
      refetch();
    },
    (msg) => showToast(msg, 'error'),
    () => refetch()
  );

  // Inspector profile for PDF
  const inspectorProfile = useMemo(
    () => ({
      name: profile?.fullName ?? '',
      signatureUrl: profile?.signatureUrl,
      stampUrl: profile?.stampUrl,
    }),
    [profile]
  );

  // Group defects by category
  const categoryGroups = useMemo<CategoryGroup[]>(() => {
    const map = new Map<string, typeof defects>();
    defects.forEach((d) => {
      const cat = d.category ?? 'כללי';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(d);
    });
    return Array.from(map.entries()).map(([name, items]) => ({
      name,
      defects: items,
      photoCount: items.reduce((sum, d) => sum + d.photoCount, 0),
    }));
  }, [defects]);

  const totalPhotos = defects.reduce((sum, d) => sum + d.photoCount, 0);

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleDeleteDefect = useCallback(
    (defectId: string) => {
      Alert.alert('מחיקת ממצא', 'למחוק את הממצא? פעולה זו אינה הפיכה.', [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'מחק',
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: photoData } = await supabase
                .from('defect_photos')
                .select('id, image_url')
                .eq('defect_id', defectId);

              if (photoData && photoData.length > 0) {
                const storagePaths = photoData
                  .map((p) => {
                    const url = p.image_url as string;
                    const match = url.match(/defect-photos\/(.+)$/);
                    return match ? match[1] : null;
                  })
                  .filter((p): p is string => !!p);

                if (storagePaths.length > 0) {
                  await supabase.storage
                    .from('defect-photos')
                    .remove(storagePaths);
                }
              }

              await supabase
                .from('defect_photos')
                .delete()
                .eq('defect_id', defectId);

              const { error: deleteError } = await supabase
                .from('defects')
                .delete()
                .eq('id', defectId);

              if (deleteError) throw deleteError;
              refetch();
            } catch {
              Alert.alert('שגיאה', 'לא הצלחנו למחוק את הממצא. נסה שוב.');
            }
          },
        },
      ]);
    },
    [refetch]
  );

  const navigateToAddDefect = useCallback(
    (category?: string) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      const path = `/(app)/reports/${id}/add-defect` as const;
      if (category) {
        router.push({ pathname: path, params: { category } });
      } else {
        router.push(path);
      }
    },
    [id, router]
  );

  const navigateToChecklist = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/(app)/reports/${id}/checklist`);
  }, [id, router]);

  // --- PDF Flow: open summary instead of generating directly ---

  const handleGeneratePdf = useCallback(() => {
    if (!id) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPdfAction('generate');
    setShowSummary(true);
  }, [id]);

  const handleSharePdf = useCallback(() => {
    if (!id) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPdfAction('share');
    setShowSummary(true);
  }, [id]);

  // Summary → generate PDF (bedek bayit) or continue to signature (delivery)
  const handleSummaryGenerate = useCallback(async () => {
    if (!id) return;
    setShowSummary(false);

    // Check if no inspector signature — warn but proceed
    if (!profile?.signatureUrl) {
      showToast('לא הוגדרה חתימה — הגדר בהגדרות', 'info');
    }

    if (pdfAction === 'share') {
      await sharePdf(id, inspectorProfile);
    } else {
      const uri = await generatePdf(id, inspectorProfile);
      if (uri) setPdfUri(uri);
    }
  }, [id, pdfAction, profile, inspectorProfile, generatePdf, sharePdf, showToast]);

  const handleContinueToSignature = useCallback(async () => {
    if (!id) return;

    // Check if tenant already signed
    const existing = await getTenantSignature(id);
    if (existing) {
      showToast('חתימת דייר קיימת', 'info');
      setShowSummary(false);
      // Proceed to generate with existing signature
      if (pdfAction === 'share') {
        await sharePdf(id, inspectorProfile);
      } else {
        const uri = await generatePdf(id, inspectorProfile);
        if (uri) setPdfUri(uri);
      }
      return;
    }

    setShowSummary(false);
    setShowTenantSignature(true);
  }, [id, pdfAction, inspectorProfile, getTenantSignature, generatePdf, sharePdf, showToast]);

  const handleTenantSign = useCallback(
    async (name: string, base64Png: string) => {
      if (!id) return;
      await saveTenantSignature(id, name, base64Png);
      setShowTenantSignature(false);

      // Now generate PDF with all signatures
      if (pdfAction === 'share') {
        await sharePdf(id, inspectorProfile);
      } else {
        const uri = await generatePdf(id, inspectorProfile);
        if (uri) setPdfUri(uri);
      }
    },
    [id, pdfAction, inspectorProfile, saveTenantSignature, generatePdf, sharePdf]
  );

  // --- Status ---

  const handleStatusChange = useCallback(
    (newStatus: ReportStatus) => {
      if (!id || !report) return;
      if (newStatus === 'completed') {
        markCompleted(id);
      } else if (
        report.status === 'completed' &&
        newStatus === 'in_progress'
      ) {
        reopenForEditing(id);
      } else if (newStatus === 'in_progress') {
        transitionToDraft(id);
      } else {
        // For 'sent' and other transitions, update directly
        supabase
          .from('delivery_reports')
          .update({ status: newStatus })
          .eq('id', id)
          .then(() => refetch());
      }
    },
    [id, report, markCompleted, reopenForEditing, transitionToDraft, refetch]
  );

  const handleCamera = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const handleLibrary = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/(app)/library');
  }, [router]);

  const statusConfig =
    STATUS_CONFIG[report?.status ?? 'draft'] ?? STATUS_CONFIG.draft;
  const subtitle = report
    ? `${report.address ?? report.projectName}, דירה ${report.apartmentNumber}`
    : '';

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream[50] }}>
      <StatusBar style="light" />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={!!toast}
          onDismiss={hideToast}
        />
      )}

      <ReportHeaderBar
        subtitle={subtitle}
        topInset={insets.top}
        status={(report?.status as ReportStatus) ?? 'draft'}
        isStatusUpdating={isStatusUpdating}
        onBack={() => router.back()}
        onStatusChange={handleStatusChange}
      />

      {isLoading ? (
        <ReportSkeleton />
      ) : hasError || (!isLoading && !report) ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
          }}
        >
          <EmptyState
            icon="alert-circle"
            title="לא ניתן לטעון את הדוח"
            subtitle="ייתכן שהדוח נמחק או שאין הרשאת צפייה. נסה שוב."
            ctaLabel="נסה שוב"
            onCta={() => refetch()}
          />
          <Pressable
            onPress={() => router.back()}
            style={{
              marginTop: 12,
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: COLORS.primary[500],
                fontFamily: 'Rubik-SemiBold',
              }}
            >
              חזרה
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {report && (
              <ReportInfoCard
                report={report}
                statusConfig={statusConfig}
                defectsCount={defects.length}
                totalPhotos={totalPhotos}
                categoryCount={categoryGroups.length}
              />
            )}

            <ReportTabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              shortagesCount={0}
            />

            <View style={{ padding: 12, paddingTop: 8 }}>
              {activeTab === 'findings' && (
                <>
                  {categoryGroups.length === 0 ? (
                    <EmptyState
                      icon="file-text"
                      title="אין ממצאים עדיין"
                      subtitle="הוסף ממצא ראשון מהכפתור למטה, מהמאגר, או צלם תמונה"
                      ctaLabel="הוסף ממצא"
                      onCta={() => navigateToAddDefect()}
                    />
                  ) : (
                    categoryGroups.map((group, idx) => (
                      <CategoryAccordion
                        key={group.name}
                        group={group}
                        isOpen={openCategories[group.name] ?? false}
                        onToggle={() => toggleCategory(group.name)}
                        index={idx}
                        onAddDefect={navigateToAddDefect}
                        onDeleteDefect={handleDeleteDefect}
                      />
                    ))
                  )}
                </>
              )}

              {activeTab === 'details' && report && (
                <ReportDetailsSection report={report} />
              )}

              {activeTab === 'content' && (
                <EmptyState
                  icon="list"
                  title="תוכן הדוח"
                  subtitle="תוכן עניינים יתעדכן אוטומטית"
                />
              )}

              {activeTab === 'shortages' && (
                <EmptyState
                  icon="alert-circle"
                  title="חוסרים"
                  subtitle="אין חוסרים מתועדים עדיין"
                />
              )}
            </View>
          </ScrollView>

          {report && (
            <ReportActionsBar
              bottomInset={insets.bottom}
              defectsCount={defects.length}
              isGenerating={isGenerating}
              isSharing={isSharing}
              onGeneratePdf={handleGeneratePdf}
              onSharePdf={handleSharePdf}
              onChecklist={navigateToChecklist}
              onAddDefect={() => navigateToAddDefect()}
              onCamera={handleCamera}
              onLibrary={handleLibrary}
            />
          )}

          {/* Summary modal */}
          {report && (
            <PrePdfSummary
              visible={showSummary}
              report={report}
              defects={defects}
              onGeneratePdf={handleSummaryGenerate}
              onContinueToSignature={handleContinueToSignature}
              onClose={() => setShowSummary(false)}
            />
          )}

          {/* Tenant signature modal (delivery only) */}
          {report && (
            <TenantSignatureScreen
              visible={showTenantSignature}
              initialName={report.tenantName ?? ''}
              isUploading={isSignatureUploading}
              onSign={handleTenantSign}
              onClose={() => setShowTenantSignature(false)}
            />
          )}
        </>
      )}
    </View>
  );
}
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS. If there are type errors related to `ReportInfo` missing `tenantName` or `reportType`, check the `useReport` hook and add those fields if needed.

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/hooks/usePdfGeneration.ts apps/mobile/app/\(app\)/reports/\[id\]/index.tsx
git commit -m "feat: wire summary + signature flow into report detail screen"
```

---

## Task 12: Final Typecheck + Build Verification

**Files:** None (verification only)

- [ ] **Step 1: Full typecheck**

```bash
npm run typecheck
```

Expected: PASS across all 4 packages.

- [ ] **Step 2: Turbo build**

```bash
npx turbo build
```

Expected: PASS. Web build should succeed (mobile build requires native compilation).

- [ ] **Step 3: Fix any remaining errors**

If typecheck or build fails, fix the specific errors. Common issues:

- `ReportInfo` type may need `tenantName` and `reportType` fields — check `hooks/useReport.ts`
- Import paths may need adjustment
- Skia types may differ from expected — check `@shopify/react-native-skia` installed version

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "fix: resolve typecheck and build errors for signatures feature"
```
