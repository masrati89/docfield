import { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@infield/ui';
import { SkeletonBlock } from '@/components/ui';
import { useProjectApartments } from '@/hooks/useProjectApartments';

import type {
  StepProps,
  ApartmentOption,
  BuildingGroup,
} from './NewInspectionWizard.types';

// --- Status config ---

const APT_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: 'ממתין', color: COLORS.neutral[400] },
  in_progress: { label: 'בבדיקה', color: COLORS.gold[500] },
  completed: { label: 'נבדק', color: COLORS.primary[500] },
  delivered: { label: 'נמסר', color: COLORS.primary[500] },
};

// --- Component ---

export function StepApartment({ state, dispatch, readOnly }: StepProps) {
  const isNewProject = !!(
    state.projectFreetext.trim() && !state.selectedProject
  );

  const {
    buildings: dbBuildings,
    allApartments: dbAllApartments,
    isLoading: dbLoading,
    isSingleBuilding: dbSingleBuilding,
  } = useProjectApartments(
    isNewProject ? null : (state.selectedProject?.id ?? null)
  );

  // Generate local apartment list for new projects
  const localData = useMemo(() => {
    if (!isNewProject) return null;
    const blds: BuildingGroup[] = state.newBuildings.map((b, bi) => {
      const count = state.newApartmentCounts[bi] ?? 1;
      const apts: ApartmentOption[] = Array.from(
        { length: count },
        (_, ai) => ({
          id: `new-${bi}-${ai + 1}`,
          number: String(ai + 1),
          floor: null,
          status: 'pending',
          buildingId: `new-building-${bi}`,
          buildingName: b.name || `בניין ${bi + 1}`,
        })
      );
      return {
        id: `new-building-${bi}`,
        name: b.name || `בניין ${bi + 1}`,
        apartments: apts,
      };
    });
    const all = blds.flatMap((b) => b.apartments);
    return {
      buildings: blds,
      allApartments: all,
      isSingleBuilding: blds.length === 1,
    };
  }, [isNewProject, state.newBuildings, state.newApartmentCounts]);

  const buildings = isNewProject ? (localData?.buildings ?? []) : dbBuildings;
  const allApartments = isNewProject
    ? (localData?.allApartments ?? [])
    : dbAllApartments;
  const isLoading = isNewProject ? false : dbLoading;
  const isSingleBuilding = isNewProject
    ? (localData?.isSingleBuilding ?? true)
    : dbSingleBuilding;

  const handleSelect = useCallback(
    (apt: ApartmentOption) => {
      if (readOnly) return;
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      dispatch({ type: 'SET_APARTMENT', payload: apt });
    },
    [dispatch, readOnly]
  );

  // Read-only display
  if (readOnly && state.selectedApartment) {
    return (
      <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            fontFamily: 'Rubik-Medium',
            color: COLORS.neutral[500],
            textAlign: 'right',
            marginBottom: 12,
          }}
        >
          דירה
        </Text>

        <View
          style={{
            height: 56,
            borderRadius: 14,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            paddingHorizontal: 16,
            borderWidth: 1.5,
            backgroundColor: COLORS.primary[50],
            borderColor: COLORS.primary[500],
          }}
        >
          <Feather
            name="home"
            size={20}
            color={COLORS.primary[500]}
            style={{ marginLeft: 10 }}
          />
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                fontFamily: 'Rubik-SemiBold',
                color: COLORS.primary[700],
              }}
            >
              דירה {state.selectedApartment.number}
            </Text>
            {state.selectedApartment.buildingName ? (
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[400],
                }}
              >
                {state.selectedApartment.buildingName}
              </Text>
            ) : null}
          </View>
          <Feather name="lock" size={14} color={COLORS.neutral[400]} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 8, flex: 1 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '500',
          fontFamily: 'Rubik-Medium',
          color: COLORS.neutral[500],
          textAlign: 'right',
          marginBottom: 12,
        }}
      >
        שייך לדירה (אופציונלי)
      </Text>

      {isLoading ? (
        <View style={{ gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <SkeletonBlock key={i} width="100%" height={48} borderRadius={10} />
          ))}
        </View>
      ) : (
        <FlatList
          data={isSingleBuilding ? allApartments : []}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 240 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            !isSingleBuilding ? (
              <View>
                {buildings.map((building) => (
                  <View key={building.id} style={{ marginBottom: 8 }}>
                    {/* Building header */}
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        fontFamily: 'Rubik-SemiBold',
                        color: COLORS.neutral[600],
                        textAlign: 'right',
                        marginBottom: 6,
                        paddingRight: 4,
                      }}
                    >
                      {building.name}
                    </Text>
                    {building.apartments.map((apt) =>
                      renderApartmentRow(
                        apt,
                        state.selectedApartment?.id === apt.id,
                        handleSelect
                      )
                    )}
                  </View>
                ))}
              </View>
            ) : null
          }
          renderItem={({ item }) =>
            renderApartmentRow(
              item,
              state.selectedApartment?.id === item.id,
              handleSelect
            )
          }
          ListEmptyComponent={
            isSingleBuilding ? (
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[400],
                  textAlign: 'center',
                  paddingVertical: 20,
                }}
              >
                אין דירות בפרויקט
              </Text>
            ) : null
          }
        />
      )}

      {/* Freetext input */}
      <View style={{ marginTop: 12 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '500',
            fontFamily: 'Rubik-Medium',
            color: COLORS.neutral[500],
            textAlign: 'right',
            marginBottom: 6,
          }}
        >
          או הקלד מספר דירה / כתובת ידנית
        </Text>
        <TextInput
          value={state.apartmentFreetext}
          onChangeText={(text) =>
            dispatch({ type: 'SET_APARTMENT_FREETEXT', payload: text })
          }
          placeholder="מספר דירה..."
          placeholderTextColor={COLORS.neutral[400]}
          autoComplete="off"
          spellCheck={false}
          style={{
            height: 44,
            borderRadius: 10,
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: state.apartmentFreetext
              ? COLORS.primary[200]
              : COLORS.cream[200],
            paddingHorizontal: 12,
            fontSize: 16,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[800],
            textAlign: 'right',
          }}
        />
      </View>
    </View>
  );
}

// --- Apartment Row ---

function renderApartmentRow(
  apt: ApartmentOption,
  isSelected: boolean,
  onPress: (apt: ApartmentOption) => void
) {
  const st = APT_STATUS[apt.status] ?? APT_STATUS.pending;

  return (
    <Pressable
      key={apt.id}
      onPress={() => onPress(apt)}
      style={{
        height: 48,
        borderRadius: 10,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingHorizontal: 14,
        marginBottom: 4,
        borderWidth: 1,
        backgroundColor: isSelected ? COLORS.primary[50] : COLORS.cream[50],
        borderColor: isSelected ? COLORS.primary[500] : COLORS.cream[200],
      }}
    >
      {/* Status dot */}
      <View
        style={{
          width: 7,
          height: 7,
          borderRadius: 3.5,
          backgroundColor: st.color,
          marginLeft: 10,
        }}
      />

      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          fontFamily: 'Rubik-SemiBold',
          color: isSelected ? COLORS.primary[700] : COLORS.neutral[800],
        }}
      >
        דירה {apt.number}
      </Text>

      {apt.floor !== null && apt.floor !== undefined && (
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[400],
            marginRight: 6,
          }}
        >
          · קומה {apt.floor}
        </Text>
      )}

      <View style={{ flex: 1 }} />

      <Text
        style={{
          fontSize: 10,
          fontWeight: '500',
          fontFamily: 'Rubik-Medium',
          color: st.color,
        }}
      >
        {st.label}
      </Text>
    </Pressable>
  );
}
