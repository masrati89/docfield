import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Platform,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from '@/lib/haptics';
import Fuse from 'fuse.js';

import { COLORS } from '@infield/ui';
import { SkeletonBlock } from '@/components/ui';
import { useProjects } from '@/hooks/useProjects';
import { useChecklistTemplates } from '@/hooks/useChecklistTemplates';

import type {
  StepProps,
  ReportType,
  ProjectOption,
} from './NewInspectionWizard.types';

// --- Config ---

const REPORT_TYPES: {
  key: ReportType;
  label: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  {
    key: 'bedek_bait',
    label: 'בדק בית',
    subtitle: 'ליקויים חופשיים',
    icon: 'search',
  },
  {
    key: 'delivery',
    label: 'פרוטוקול מסירה',
    subtitle: 'צ׳קליסט מובנה',
    icon: 'clipboard',
  },
];

// --- Component ---

export function StepReportType({ state, dispatch, readOnly }: StepProps) {
  const { projects, isLoading: projectsLoading } = useProjects();
  const { templates, isLoading: templatesLoading } = useChecklistTemplates();
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter templates by selected report type
  const filteredTemplates = useMemo(() => {
    if (!state.reportType) return [];
    return templates.filter((t) => t.report_type === state.reportType);
  }, [templates, state.reportType]);

  const handleSelect = useCallback(
    (type: ReportType) => {
      if (readOnly) return;
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      dispatch({ type: 'SET_REPORT_TYPE', payload: type });
      // Reset noChecklist when switching type
      if (type !== 'delivery') {
        dispatch({ type: 'TOGGLE_NO_CHECKLIST', payload: false });
      }
    },
    [dispatch, readOnly]
  );

  const handleToggleChecklist = useCallback(
    (value: boolean) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      // value=true means checklist is ON, so noChecklist=false
      dispatch({ type: 'TOGGLE_NO_CHECKLIST', payload: !value });
    },
    [dispatch]
  );

  const handleToggleProject = useCallback(
    (value: boolean) => {
      dispatch({ type: 'TOGGLE_PROJECT_PICKER', payload: value });
    },
    [dispatch]
  );

  const handleSelectProject = useCallback(
    (project: ProjectOption) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      dispatch({ type: 'SET_PROJECT', payload: project });
    },
    [dispatch]
  );

  // Read-only project display (from prefill)
  const projectReadOnly = readOnly || !!state.selectedProject?.id;

  // Whether checklist is active (delivery + not noChecklist)
  const checklistEnabled =
    state.reportType === 'delivery' && !state.noChecklist;

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 8, flex: 1 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '500',
          fontFamily: 'Rubik-Medium',
          color: COLORS.neutral[500],
          textAlign: 'right',
          marginBottom: 16,
        }}
      >
        בחר את סוג הבדיקה
      </Text>

      <View style={{ gap: 8 }}>
        {REPORT_TYPES.map((type) => {
          const isSelected = state.reportType === type.key;

          return (
            <View key={type.key}>
              <Pressable
                onPress={() => handleSelect(type.key)}
                disabled={readOnly}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                style={{
                  height: 56,
                  borderRadius: 14,
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  borderWidth: 1.5,
                  backgroundColor: isSelected
                    ? COLORS.primary[50]
                    : COLORS.cream[100],
                  borderColor: isSelected
                    ? COLORS.primary[500]
                    : COLORS.cream[200],
                  opacity: readOnly && !isSelected ? 0.4 : 1,
                }}
              >
                {/* Radio dot */}
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: isSelected
                      ? COLORS.primary[500]
                      : COLORS.neutral[300],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 12,
                  }}
                >
                  {isSelected && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: COLORS.primary[500],
                      }}
                    />
                  )}
                </View>

                {/* Icon */}
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 12,
                    backgroundColor: isSelected
                      ? COLORS.primary[100]
                      : COLORS.cream[200],
                  }}
                >
                  <Feather
                    name={type.icon}
                    size={20}
                    color={
                      isSelected ? COLORS.primary[500] : COLORS.neutral[500]
                    }
                  />
                </View>

                {/* Text */}
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: isSelected ? '600' : '500',
                      fontFamily: isSelected
                        ? 'Rubik-SemiBold'
                        : 'Rubik-Medium',
                      color: isSelected
                        ? COLORS.primary[700]
                        : COLORS.neutral[700],
                    }}
                  >
                    {type.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'Rubik-Regular',
                      color: COLORS.neutral[400],
                      marginTop: 1,
                    }}
                  >
                    {type.subtitle}
                  </Text>
                </View>
              </Pressable>

              {/* Checklist checkbox — shown only when delivery is selected */}
              {type.key === 'delivery' && isSelected && (
                <Pressable
                  onPress={() => handleToggleChecklist(state.noChecklist)}
                  style={{
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    gap: 10,
                    marginTop: 8,
                    marginStart: 16,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    backgroundColor: checklistEnabled
                      ? COLORS.primary[50]
                      : COLORS.cream[100],
                    borderWidth: 1,
                    borderColor: checklistEnabled
                      ? COLORS.primary[200]
                      : COLORS.cream[200],
                  }}
                >
                  {/* Checkbox */}
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      borderWidth: 2,
                      borderColor: checklistEnabled
                        ? COLORS.primary[500]
                        : COLORS.neutral[300],
                      backgroundColor: checklistEnabled
                        ? COLORS.primary[500]
                        : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {checklistEnabled && (
                      <Feather name="check" size={14} color={COLORS.white} />
                    )}
                  </View>

                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: checklistEnabled
                        ? 'Rubik-SemiBold'
                        : 'Rubik-Regular',
                      color: checklistEnabled
                        ? COLORS.primary[700]
                        : COLORS.neutral[500],
                    }}
                  >
                    צ׳קליסט
                  </Text>

                  <Feather
                    name="check-square"
                    size={14}
                    color={
                      checklistEnabled
                        ? COLORS.primary[500]
                        : COLORS.neutral[400]
                    }
                  />
                </Pressable>
              )}
            </View>
          );
        })}
      </View>

      {/* Draft mode checkbox */}
      {state.reportType && !readOnly && (
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            dispatch({ type: 'TOGGLE_DRAFT', payload: !state.isDraft });
          }}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 10,
            marginTop: 12,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 10,
            backgroundColor: state.isDraft
              ? COLORS.gold[100]
              : COLORS.cream[100],
            borderWidth: 1,
            borderColor: state.isDraft ? COLORS.gold[300] : COLORS.cream[200],
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: state.isDraft
                ? COLORS.gold[500]
                : COLORS.neutral[300],
              backgroundColor: state.isDraft ? COLORS.gold[500] : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {state.isDraft && (
              <Feather name="check" size={14} color={COLORS.white} />
            )}
          </View>
          <Text
            style={{
              fontSize: 14,
              fontFamily: state.isDraft ? 'Rubik-SemiBold' : 'Rubik-Regular',
              color: state.isDraft ? COLORS.gold[700] : COLORS.neutral[500],
            }}
          >
            הפק כטיוטה
          </Text>
          <Feather
            name="file"
            size={14}
            color={state.isDraft ? COLORS.gold[500] : COLORS.neutral[400]}
          />
        </Pressable>
      )}

      {readOnly && (
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 4,
            marginTop: 12,
          }}
        >
          <Feather name="lock" size={12} color={COLORS.neutral[400]} />
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[400],
            }}
          >
            נקבע מהקשר הפרויקט
          </Text>
        </View>
      )}

      {/* --- Template picker (for any selected report type with templates) --- */}
      {state.reportType && filteredTemplates.length > 0 && (
        <View
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: COLORS.cream[200],
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Rubik-Medium',
              color: COLORS.neutral[700],
              textAlign: 'right',
              marginBottom: 8,
            }}
          >
            תבנית
          </Text>

          {templatesLoading ? (
            <SkeletonBlock width="100%" height={40} borderRadius={10} />
          ) : (
            <View style={{ gap: 4 }}>
              {filteredTemplates.map((t) => {
                const isSelected =
                  state.checklistTemplateId === t.id ||
                  (!state.checklistTemplateId && t.is_global);

                return (
                  <Pressable
                    key={t.id}
                    onPress={() => {
                      if (Platform.OS !== 'web') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                      dispatch({
                        type: 'SET_CHECKLIST_TEMPLATE',
                        payload: t.is_global ? null : t.id,
                      });
                    }}
                    style={{
                      height: 40,
                      borderRadius: 10,
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      borderWidth: 1,
                      backgroundColor: isSelected
                        ? COLORS.primary[50]
                        : COLORS.cream[50],
                      borderColor: isSelected
                        ? COLORS.primary[500]
                        : COLORS.cream[200],
                    }}
                  >
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        borderWidth: 1.5,
                        borderColor: isSelected
                          ? COLORS.primary[500]
                          : COLORS.neutral[300],
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 8,
                      }}
                    >
                      {isSelected && (
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: COLORS.primary[500],
                          }}
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontFamily: isSelected
                          ? 'Rubik-SemiBold'
                          : 'Rubik-Regular',
                        color: isSelected
                          ? COLORS.primary[700]
                          : COLORS.neutral[700],
                        textAlign: 'right',
                      }}
                      numberOfLines={1}
                    >
                      {t.name}
                    </Text>
                    {t.is_global && (
                      <Feather
                        name="lock"
                        size={12}
                        color={COLORS.neutral[400]}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      )}

      {/* --- Project toggle --- */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 20,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: COLORS.cream[200],
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Rubik-Medium',
            color: COLORS.neutral[700],
          }}
        >
          שייך לפרויקט
        </Text>
        {projectReadOnly && state.selectedProject ? (
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Feather name="folder" size={14} color={COLORS.primary[500]} />
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Rubik-SemiBold',
                color: COLORS.primary[700],
              }}
              numberOfLines={1}
            >
              {state.selectedProject.name}
            </Text>
            <Feather name="lock" size={12} color={COLORS.neutral[400]} />
          </View>
        ) : (
          <Switch
            value={state.showProjectPicker}
            onValueChange={handleToggleProject}
            trackColor={{
              false: COLORS.cream[300],
              true: COLORS.primary[200],
            }}
            thumbColor={
              state.showProjectPicker
                ? COLORS.primary[500]
                : COLORS.neutral[300]
            }
          />
        )}
      </View>

      {/* --- Inline project picker (when toggle is ON) --- */}
      {state.showProjectPicker && !projectReadOnly && (
        <View style={{ marginTop: 12 }}>
          {/* Search input */}
          <View
            style={{
              height: 40,
              borderRadius: 10,
              backgroundColor: COLORS.cream[100],
              borderWidth: 1,
              borderColor: COLORS.cream[200],
              flexDirection: 'row-reverse',
              alignItems: 'center',
              paddingHorizontal: 10,
              marginBottom: 8,
            }}
          >
            <Feather
              name="search"
              size={14}
              color={COLORS.neutral[400]}
              style={{ marginLeft: 6 }}
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
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[800],
                textAlign: 'right',
              }}
            />
          </View>

          {/* Selected project indicator */}
          {state.selectedProject && (
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: 6,
                paddingVertical: 6,
                paddingHorizontal: 10,
                backgroundColor: COLORS.primary[50],
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <Feather name="check" size={14} color={COLORS.primary[500]} />
              <Text
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontFamily: 'Rubik-SemiBold',
                  color: COLORS.primary[700],
                  textAlign: 'right',
                }}
                numberOfLines={1}
              >
                {state.selectedProject.name}
              </Text>
              <Pressable
                onPress={() => dispatch({ type: 'CLEAR_PROJECT' })}
                hitSlop={8}
              >
                <Feather name="x" size={14} color={COLORS.neutral[400]} />
              </Pressable>
            </View>
          )}

          {/* Project list */}
          {projectsLoading ? (
            <View style={{ gap: 6 }}>
              {[1, 2].map((i) => (
                <SkeletonBlock
                  key={i}
                  width="100%"
                  height={44}
                  borderRadius={10}
                />
              ))}
            </View>
          ) : (
            <FlatList
              data={filteredProjects}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 140 }}
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
                      })
                    }
                    style={{
                      height: 44,
                      borderRadius: 10,
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      marginBottom: 4,
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
                      size={14}
                      color={
                        isSelected ? COLORS.primary[500] : COLORS.neutral[400]
                      }
                      style={{ marginLeft: 8 }}
                    />
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Text
                        style={{
                          fontSize: 13,
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
                            fontSize: 10,
                            fontFamily: 'Rubik-Regular',
                            color: COLORS.neutral[400],
                          }}
                          numberOfLines={1}
                        >
                          {item.address}
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Rubik-Regular',
                    color: COLORS.neutral[400],
                    textAlign: 'center',
                    paddingVertical: 12,
                  }}
                >
                  לא נמצאו פרויקטים
                </Text>
              }
            />
          )}
        </View>
      )}
    </View>
  );
}
