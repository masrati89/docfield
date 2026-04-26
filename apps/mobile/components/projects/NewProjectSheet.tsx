import { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { createProjectSchema } from '@infield/shared/src/validation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';

// --- Types ---

interface NewProjectSheetProps {
  onClose: () => void;
  onCreated: () => void;
}

interface BuildingEntry {
  name: string;
}

type Step = 'details' | 'buildings' | 'apartments';

// --- Component ---

export function NewProjectSheet({ onClose, onCreated }: NewProjectSheetProps) {
  const { profile } = useAuth();

  // Step management
  const [step, setStep] = useState<Step>('details');

  // Step 1: Project details
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  // Step 2: Buildings
  const [buildings, setBuildings] = useState<BuildingEntry[]>([
    { name: 'בניין 1' },
  ]);

  // Step 3: Apartment counts
  const [aptCounts, setAptCounts] = useState<Record<number, number>>({ 0: 1 });

  const [isSaving, setIsSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    title: string;
    message: string;
  } | null>(null);

  // --- Navigation ---

  const canProceed = (() => {
    switch (step) {
      case 'details':
        return name.trim().length > 0;
      case 'buildings':
        return buildings.every((b) => b.name.trim().length > 0);
      case 'apartments':
        return buildings.every((_, i) => (aptCounts[i] ?? 0) >= 1);
    }
  })();

  const handleNext = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (step === 'details') setStep('buildings');
    else if (step === 'buildings') setStep('apartments');
  }, [step]);

  const handleBack = useCallback(() => {
    if (step === 'buildings') setStep('details');
    else if (step === 'apartments') setStep('buildings');
  }, [step]);

  // --- Buildings ---

  const handleBuildingsCount = useCallback(
    (delta: number) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      const newCount = Math.max(1, Math.min(20, buildings.length + delta));
      const newBuildings = Array.from(
        { length: newCount },
        (_, i) => buildings[i] ?? { name: `בניין ${i + 1}` }
      );
      const newCounts: Record<number, number> = {};
      for (let i = 0; i < newCount; i++) {
        newCounts[i] = aptCounts[i] ?? 1;
      }
      setBuildings(newBuildings);
      setAptCounts(newCounts);
    },
    [buildings, aptCounts]
  );

  const handleBuildingName = useCallback(
    (index: number, text: string) => {
      const updated = [...buildings];
      updated[index] = { name: text };
      setBuildings(updated);
    },
    [buildings]
  );

  // --- Apartment counts ---

  const handleAptCountChange = useCallback(
    (index: number, delta: number) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      const current = aptCounts[index] ?? 1;
      const clamped = Math.max(1, Math.min(200, current + delta));
      setAptCounts((prev) => ({ ...prev, [index]: clamped }));
    },
    [aptCounts]
  );

  const handleAptCountInput = useCallback((index: number, text: string) => {
    const num = parseInt(text, 10);
    if (!isNaN(num)) {
      const clamped = Math.max(1, Math.min(200, num));
      setAptCounts((prev) => ({ ...prev, [index]: clamped }));
    } else if (text === '') {
      setAptCounts((prev) => ({ ...prev, [index]: 1 }));
    }
  }, []);

  // --- Submit ---

  const handleSave = useCallback(async () => {
    if (!canProceed || !profile?.organizationId) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setIsSaving(true);
    let projectId: string | null = null;
    try {
      // Zod validation before Supabase insert (security M1)
      const validation = createProjectSchema.safeParse({
        name: name.trim(),
        address: address.trim() || undefined,
        city: city.trim() || undefined,
      });

      if (!validation.success) {
        const firstError =
          validation.error.errors[0]?.message ?? 'שגיאה בנתונים';
        setAlertMessage({ title: 'שגיאה', message: firstError });
        setIsSaving(false);
        return;
      }

      // 1. Create project
      const { data: newProject, error: projErr } = await supabase
        .from('projects')
        .insert({
          organization_id: profile.organizationId,
          name: name.trim(),
          address: address.trim() || null,
          city: city.trim() || null,
        })
        .select('id')
        .single();

      if (projErr || !newProject)
        throw projErr ?? new Error('שגיאה ביצירת פרויקט');
      projectId = newProject.id as string;

      // 2. Create buildings
      const buildingInserts = buildings.map((b) => ({
        project_id: projectId!,
        organization_id: profile.organizationId,
        name: b.name.trim(),
      }));

      const { data: newBuildings, error: buildErr } = await supabase
        .from('buildings')
        .insert(buildingInserts)
        .select('id');

      if (buildErr || !newBuildings)
        throw buildErr ?? new Error('שגיאה ביצירת בניינים');

      // 3. Create apartments
      const apartmentInserts: Array<{
        building_id: string;
        organization_id: string;
        number: string;
        floor: number;
        status: string;
      }> = [];

      for (let bi = 0; bi < newBuildings.length; bi++) {
        const count = aptCounts[bi] ?? 1;
        const buildingId = newBuildings[bi].id as string;
        for (let ai = 1; ai <= count; ai++) {
          apartmentInserts.push({
            building_id: buildingId,
            organization_id: profile.organizationId,
            number: String(ai),
            floor: 0,
            status: 'pending',
          });
        }
      }

      if (apartmentInserts.length > 0) {
        const { error: aptErr } = await supabase
          .from('apartments')
          .insert(apartmentInserts);
        if (aptErr) throw aptErr;
      }

      onCreated();
      onClose();
    } catch (err) {
      // Rollback: delete orphan project if buildings/apartments failed
      if (projectId) {
        await supabase.from('projects').delete().eq('id', projectId);
      }
      const message = err instanceof Error ? err.message : 'שגיאה לא ידועה';
      setAlertMessage({ title: 'שגיאה ביצירת פרויקט', message });
    } finally {
      setIsSaving(false);
    }
  }, [
    canProceed,
    profile,
    name,
    address,
    city,
    buildings,
    aptCounts,
    onCreated,
    onClose,
  ]);

  // --- Step indicator ---

  const steps: Step[] = ['details', 'buildings', 'apartments'];
  const stepIndex = steps.indexOf(step);
  const isLastStep = step === 'apartments';

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            fontFamily: 'Rubik-Bold',
            color: COLORS.neutral[800],
            textAlign: 'right',
          }}
        >
          פרויקט חדש
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {step !== 'details' && (
            <Pressable
              onPress={handleBack}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.cream[100],
                borderWidth: 1,
                borderColor: COLORS.cream[200],
              }}
            >
              <Feather
                name="arrow-right"
                size={18}
                color={COLORS.neutral[600]}
              />
            </Pressable>
          )}
          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.cream[100],
              borderWidth: 1,
              borderColor: COLORS.cream[200],
            }}
          >
            <Feather name="x" size={18} color={COLORS.neutral[600]} />
          </Pressable>
        </View>
      </View>

      {/* Progress dots */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 6,
          marginBottom: 16,
        }}
      >
        {steps.map((_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                i <= stepIndex ? COLORS.primary[500] : COLORS.cream[300],
            }}
          />
        ))}
      </View>

      {/* Step content */}
      {step === 'details' && (
        <StepDetails
          name={name}
          setName={setName}
          address={address}
          setAddress={setAddress}
          city={city}
          setCity={setCity}
        />
      )}

      {step === 'buildings' && (
        <StepBuildingsContent
          buildings={buildings}
          onCountChange={handleBuildingsCount}
          onNameChange={handleBuildingName}
        />
      )}

      {step === 'apartments' && (
        <StepApartmentsContent
          buildings={buildings}
          aptCounts={aptCounts}
          onCountChange={handleAptCountChange}
          onCountInput={handleAptCountInput}
        />
      )}

      {/* CTA */}
      <View style={{ marginTop: 16 }}>
        <Button
          label={
            isSaving ? 'יוצר פרויקט...' : isLastStep ? 'צור פרויקט' : 'המשך'
          }
          onPress={isLastStep ? handleSave : handleNext}
          disabled={!canProceed || isSaving}
          loading={isSaving}
          size="lg"
        />
      </View>

      {/* Info/error alert modal (replaces Alert.alert for cross-platform) */}
      <Modal
        visible={!!alertMessage}
        transparent
        animationType="fade"
        onRequestClose={() => setAlertMessage(null)}
      >
        <Pressable
          onPress={() => setAlertMessage(null)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              width: '100%',
              maxWidth: 320,
              backgroundColor: COLORS.cream[50],
              borderRadius: 14,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Rubik-SemiBold',
                color: COLORS.neutral[800],
                textAlign: 'right',
                marginBottom: 8,
              }}
            >
              {alertMessage?.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[600],
                textAlign: 'right',
                marginBottom: 20,
              }}
            >
              {alertMessage?.message}
            </Text>
            <Pressable
              onPress={() => setAlertMessage(null)}
              style={{
                height: 40,
                borderRadius: 10,
                backgroundColor: COLORS.primary[500],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik-SemiBold',
                  color: COLORS.white,
                }}
              >
                הבנתי
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

// --- Step 1: Details ---

function StepDetails({
  name,
  setName,
  address,
  setAddress,
  city,
  setCity,
}: {
  name: string;
  setName: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
}) {
  return (
    <View>
      <Text style={labelStyle}>שם הפרויקט *</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="לדוגמה: מגדלי הים"
        placeholderTextColor={COLORS.neutral[400]}
        style={[
          inputStyle,
          {
            borderColor: name ? COLORS.primary[200] : COLORS.cream[300],
            backgroundColor: name ? COLORS.primary[50] : COLORS.cream[50],
          },
        ]}
      />

      <Text style={[labelStyle, { marginTop: 14 }]}>כתובת</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="רחוב ומספר"
        placeholderTextColor={COLORS.neutral[400]}
        style={[
          inputStyle,
          {
            borderColor: address ? COLORS.primary[200] : COLORS.cream[300],
            backgroundColor: address ? COLORS.primary[50] : COLORS.cream[50],
          },
        ]}
      />

      <Text style={[labelStyle, { marginTop: 14 }]}>עיר</Text>
      <TextInput
        value={city}
        onChangeText={setCity}
        placeholder="שם העיר"
        placeholderTextColor={COLORS.neutral[400]}
        style={[
          inputStyle,
          {
            borderColor: city ? COLORS.primary[200] : COLORS.cream[300],
            backgroundColor: city ? COLORS.primary[50] : COLORS.cream[50],
          },
        ]}
      />
    </View>
  );
}

// --- Step 2: Buildings ---

function StepBuildingsContent({
  buildings,
  onCountChange,
  onNameChange,
}: {
  buildings: BuildingEntry[];
  onCountChange: (delta: number) => void;
  onNameChange: (index: number, name: string) => void;
}) {
  return (
    <View>
      <Text style={labelStyle}>כמה בניינים יש בפרויקט?</Text>

      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 20,
          marginTop: 8,
        }}
      >
        <Pressable
          onPress={() => onCountChange(1)}
          style={counterBtnStyle(true)}
        >
          <Feather name="plus" size={20} color={COLORS.primary[600]} />
        </Pressable>
        <Text style={counterTextStyle}>{buildings.length}</Text>
        <Pressable
          onPress={() => onCountChange(-1)}
          disabled={buildings.length <= 1}
          style={counterBtnStyle(buildings.length > 1)}
        >
          <Feather
            name="minus"
            size={20}
            color={
              buildings.length > 1 ? COLORS.neutral[600] : COLORS.neutral[300]
            }
          />
        </Pressable>
      </View>

      <Text style={[labelStyle, { marginBottom: 8 }]}>שמות הבניינים</Text>

      <View>
        {buildings.map((b, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 10,
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: COLORS.primary[50],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="home" size={14} color={COLORS.primary[500]} />
            </View>
            <TextInput
              value={b.name}
              onChangeText={(text) => onNameChange(i, text)}
              placeholder={`בניין ${i + 1}`}
              placeholderTextColor={COLORS.neutral[400]}
              style={[
                inputStyle,
                {
                  flex: 1,
                  borderColor: b.name.trim()
                    ? COLORS.primary[200]
                    : COLORS.cream[200],
                },
              ]}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

// --- Step 3: Apartment Counts ---

function StepApartmentsContent({
  buildings,
  aptCounts,
  onCountChange,
  onCountInput,
}: {
  buildings: BuildingEntry[];
  aptCounts: Record<number, number>;
  onCountChange: (index: number, delta: number) => void;
  onCountInput: (index: number, text: string) => void;
}) {
  const total = Object.values(aptCounts).reduce((a, b) => a + b, 0);

  return (
    <View>
      <Text style={labelStyle}>כמה דירות בכל בניין?</Text>

      <View style={{ marginTop: 8 }}>
        {buildings.map((b, i) => {
          const count = aptCounts[i] ?? 1;
          return (
            <View
              key={i}
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 12,
                paddingHorizontal: 14,
                marginBottom: 8,
                borderRadius: 10,
                backgroundColor: COLORS.cream[50],
                borderWidth: 1,
                borderColor: COLORS.cream[200],
              }}
            >
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 8,
                  flex: 1,
                }}
              >
                <Feather name="home" size={16} color={COLORS.primary[500]} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    fontFamily: 'Rubik-SemiBold',
                    color: COLORS.neutral[700],
                  }}
                  numberOfLines={1}
                >
                  {b.name || `בניין ${i + 1}`}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Pressable
                  onPress={() => onCountChange(i, 1)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: COLORS.primary[50],
                    borderWidth: 1,
                    borderColor: COLORS.primary[200],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="plus" size={16} color={COLORS.primary[600]} />
                </Pressable>

                <TextInput
                  value={String(count)}
                  onChangeText={(text) => onCountInput(i, text)}
                  keyboardType="number-pad"
                  style={{
                    width: 48,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: COLORS.white,
                    borderWidth: 1,
                    borderColor: COLORS.cream[200],
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: '700',
                    fontFamily: 'Rubik-Bold',
                    color: COLORS.neutral[800],
                  }}
                />

                <Pressable
                  onPress={() => onCountChange(i, -1)}
                  disabled={count <= 1}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor:
                      count > 1 ? COLORS.cream[100] : COLORS.neutral[100],
                    borderWidth: 1,
                    borderColor:
                      count > 1 ? COLORS.cream[200] : COLORS.neutral[200],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather
                    name="minus"
                    size={16}
                    color={
                      count > 1 ? COLORS.neutral[600] : COLORS.neutral[300]
                    }
                  />
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      {/* Summary */}
      <View
        style={{
          marginTop: 12,
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 10,
          backgroundColor: COLORS.primary[50],
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Feather name="info" size={14} color={COLORS.primary[600]} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Rubik-Regular',
            color: COLORS.primary[700],
          }}
        >
          סה״כ {total} דירות ב-{buildings.length} בניינים
        </Text>
      </View>
    </View>
  );
}

// --- Styles ---

const labelStyle = {
  fontSize: 13,
  fontFamily: 'Rubik-Medium',
  color: COLORS.neutral[600],
  textAlign: 'right' as const,
  marginBottom: 6,
};

const inputStyle = {
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: BORDER_RADIUS.md,
  borderWidth: 1,
  borderColor: COLORS.cream[300],
  backgroundColor: COLORS.cream[50],
  fontSize: 14,
  fontFamily: 'Rubik-Regular',
  color: COLORS.neutral[800],
  textAlign: 'right' as const,
};

const counterTextStyle = {
  fontSize: 28,
  fontWeight: '700' as const,
  fontFamily: 'Rubik-Bold',
  color: COLORS.neutral[800],
  minWidth: 40,
  textAlign: 'center' as const,
};

function counterBtnStyle(enabled: boolean) {
  return {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: enabled ? COLORS.primary[50] : COLORS.neutral[100],
    borderWidth: 1,
    borderColor: enabled ? COLORS.primary[200] : COLORS.neutral[200],
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
}
