import { useCallback, useMemo, useState } from 'react';
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
import Fuse from 'fuse.js';

import { COLORS } from '@infield/ui';
import { SkeletonBlock } from '@/components/ui';
import { useProjects } from '@/hooks/useProjects';

import type { StepProps, ProjectOption } from './NewInspectionWizard.types';

// --- Component ---

export function StepProject({ state, dispatch, readOnly }: StepProps) {
  const { projects, isLoading } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');

  // Fuse search
  const fuse = useMemo(
    () =>
      new Fuse(projects, {
        keys: ['name', 'address'],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    return fuse.search(searchQuery).map((r) => r.item);
  }, [projects, searchQuery, fuse]);

  const handleSelectProject = useCallback(
    (project: ProjectOption) => {
      if (readOnly) return;
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      dispatch({ type: 'SET_PROJECT', payload: project });
    },
    [dispatch, readOnly]
  );

  // Read-only display
  if (readOnly && state.selectedProject) {
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
          פרויקט
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
            name="folder"
            size={20}
            color={COLORS.primary[500]}
            style={{ marginLeft: 10 }}
          />
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              fontSize: 15,
              fontWeight: '600',
              fontFamily: 'Rubik-SemiBold',
              color: COLORS.primary[700],
            }}
          >
            {state.selectedProject.name}
          </Text>
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
        שייך לפרויקט (אופציונלי)
      </Text>

      {/* Search input */}
      <View
        style={{
          height: 44,
          borderRadius: 10,
          backgroundColor: COLORS.cream[100],
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: 12,
          marginBottom: 12,
        }}
      >
        <Feather
          name="search"
          size={16}
          color={COLORS.neutral[400]}
          style={{ marginLeft: 8 }}
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="חפש פרויקט..."
          placeholderTextColor={COLORS.neutral[400]}
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1,
            fontSize: 16,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[800],
            textAlign: 'right',
          }}
        />
      </View>

      {/* Project list */}
      {isLoading ? (
        <View style={{ gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <SkeletonBlock key={i} width="100%" height={52} borderRadius={10} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredProjects}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 220 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = state.selectedProject?.id === item.id;

            return (
              <Pressable
                onPress={() =>
                  handleSelectProject({
                    id: item.id,
                    name: item.name,
                    address: item.address,
                    reportTypeDefault: (
                      item as unknown as { reportTypeDefault?: string }
                    ).reportTypeDefault as
                      | 'delivery'
                      | 'bedek_bait'
                      | undefined,
                    defaultTemplateId:
                      (item as unknown as { defaultTemplateId?: string })
                        .defaultTemplateId ?? null,
                  })
                }
                style={{
                  height: 52,
                  borderRadius: 10,
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  paddingHorizontal: 14,
                  marginBottom: 6,
                  borderWidth: 1,
                  backgroundColor: isSelected
                    ? COLORS.primary[50]
                    : COLORS.cream[50],
                  borderColor: isSelected
                    ? COLORS.primary[500]
                    : COLORS.cream[200],
                }}
              >
                <Feather
                  name="folder"
                  size={16}
                  color={isSelected ? COLORS.primary[500] : COLORS.neutral[400]}
                  style={{ marginLeft: 10 }}
                />
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      fontFamily: 'Rubik-SemiBold',
                      color: isSelected
                        ? COLORS.primary[700]
                        : COLORS.neutral[800],
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  {item.address ? (
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: 'Rubik-Regular',
                        color: COLORS.neutral[400],
                      }}
                      numberOfLines={1}
                    >
                      {item.address}
                    </Text>
                  ) : null}
                </View>
                <Feather
                  name="chevron-left"
                  size={16}
                  color={COLORS.neutral[300]}
                />
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[400],
                textAlign: 'center',
                paddingVertical: 20,
              }}
            >
              לא נמצאו פרויקטים
            </Text>
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
          או הקלד שם פרויקט ידנית
        </Text>
        <TextInput
          value={state.projectFreetext}
          onChangeText={(text) =>
            dispatch({ type: 'SET_PROJECT_FREETEXT', payload: text })
          }
          placeholder="שם פרויקט..."
          placeholderTextColor={COLORS.neutral[400]}
          autoComplete="off"
          spellCheck={false}
          style={{
            height: 44,
            borderRadius: 10,
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: state.projectFreetext
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
