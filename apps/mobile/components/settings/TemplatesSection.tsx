import { useCallback, useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from '@/lib/haptics';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, SHADOWS } from '@infield/ui';

import { useChecklistTemplates } from '@/hooks/useChecklistTemplates';
import type { ChecklistTemplateSummary } from '@/hooks/useChecklistTemplates';
import { useAuth } from '@/contexts/AuthContext';
import { SkeletonBlock } from '@/components/ui';

// --- Report type labels ---

const REPORT_TYPE_LABELS: Record<string, string> = {
  delivery: 'תבניות מסירה',
  bedek_bait: 'תבניות בדק בית',
};

// --- Shared Modal Shell ---

function ModalShell({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
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
            ...SHADOWS.lg,
          }}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// --- Modal Button (with press feedback) ---

function ModalButton({
  label,
  onPress,
  disabled,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'destructive';
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bgColor =
    variant === 'destructive'
      ? COLORS.danger[500]
      : variant === 'primary'
        ? COLORS.primary[500]
        : COLORS.cream[100];

  return (
    <Animated.View style={[{ flex: 1 }, animStyle]}>
      <Pressable
        onPress={() => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          onPress();
        }}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 15, stiffness: 150 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 150 });
        }}
        disabled={disabled}
        style={{
          height: 40,
          borderRadius: 10,
          backgroundColor: disabled ? COLORS.neutral[200] : bgColor,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: COLORS.cream[200],
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily:
              variant === 'secondary' ? 'Rubik-Medium' : 'Rubik-SemiBold',
            color: variant === 'secondary' ? COLORS.neutral[600] : COLORS.white,
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// --- Name Input Modal ---

interface NameInputModalProps {
  visible: boolean;
  title: string;
  placeholder: string;
  initialValue?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

function NameInputModal({
  visible,
  title,
  placeholder,
  initialValue,
  onSubmit,
  onCancel,
}: NameInputModalProps) {
  const [value, setValue] = useState('');

  // Sync initialValue when modal opens
  useEffect(() => {
    if (visible) {
      setValue(initialValue ?? '');
    }
  }, [visible, initialValue]);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue('');
  };

  const handleCancel = () => {
    setValue('');
    onCancel();
  };

  return (
    <ModalShell visible={visible} onClose={handleCancel}>
      <Text
        style={{
          fontSize: 16,
          fontFamily: 'Rubik-SemiBold',
          color: COLORS.neutral[800],
          textAlign: 'right',
          marginBottom: 12,
        }}
      >
        {title}
      </Text>

      <TextInput
        value={value}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        placeholder={placeholder}
        placeholderTextColor={COLORS.neutral[400]}
        autoFocus
        style={{
          backgroundColor: COLORS.cream[50],
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          borderRadius: 10,
          padding: 12,
          fontSize: 14,
          fontFamily: 'Rubik-Regular',
          color: COLORS.neutral[700],
          textAlign: 'right',
          marginBottom: 16,
        }}
      />

      <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
        <ModalButton
          label="אישור"
          onPress={handleSubmit}
          disabled={!value.trim()}
        />
        <ModalButton label="ביטול" onPress={handleCancel} variant="secondary" />
      </View>
    </ModalShell>
  );
}

// --- Confirm Modal ---

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  destructive,
}: ConfirmModalProps) {
  return (
    <ModalShell visible={visible} onClose={onCancel}>
      <Text
        style={{
          fontSize: 16,
          fontFamily: 'Rubik-SemiBold',
          color: COLORS.neutral[800],
          textAlign: 'right',
          marginBottom: 8,
        }}
      >
        {title}
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
        {message}
      </Text>

      <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
        <ModalButton
          label={confirmLabel}
          onPress={onConfirm}
          variant={destructive ? 'destructive' : 'primary'}
        />
        <ModalButton label="ביטול" onPress={onCancel} variant="secondary" />
      </View>
    </ModalShell>
  );
}

// --- Template Card ---

interface TemplateCardProps {
  template: ChecklistTemplateSummary;
  index: number;
  isDefault: boolean;
  onEdit: (id: string) => void;
  onDuplicate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onToggleDefault: (id: string, reportType: string) => void;
}

function TemplateCard({
  template,
  index,
  isDefault,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleDefault,
}: TemplateCardProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(60 * index).duration(200)}>
      <Animated.View style={animStyle}>
        <View
          style={{
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            borderRadius: 12,
            padding: 14,
            marginBottom: 10,
            ...SHADOWS.sm,
          }}
        >
          {/* Header row — tappable to edit */}
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onEdit(template.id);
            }}
            onPressIn={() => {
              scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
            }}
            onPressOut={() => {
              scale.value = withSpring(1, { damping: 15, stiffness: 150 });
            }}
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
            }}
          >
            {template.is_global ? (
              <Feather name="lock" size={14} color={COLORS.neutral[400]} />
            ) : (
              <Feather name="layout" size={14} color={COLORS.primary[500]} />
            )}
            <Text
              style={{
                flex: 1,
                fontSize: 14,
                fontFamily: 'Rubik-Medium',
                color: COLORS.neutral[800],
                textAlign: 'right',
              }}
              numberOfLines={1}
            >
              {template.name}
            </Text>
            {isDefault && (
              <Feather name="star" size={14} color={COLORS.gold[500]} />
            )}
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[400],
              }}
            >
              {template.category_count} חדרים
            </Text>
          </Pressable>

          {/* Action buttons */}
          <View
            style={{ flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap' }}
          >
            {!template.is_global && (
              <ActionChip
                label="ערוך"
                icon="edit-2"
                onPress={() => onEdit(template.id)}
              />
            )}
            <ActionChip
              label="שכפל"
              icon="copy"
              onPress={() => onDuplicate(template.id, template.name)}
            />
            <ActionChip
              label={isDefault ? 'ברירת מחדל ✓' : 'ברירת מחדל'}
              icon="star"
              onPress={() => onToggleDefault(template.id, template.report_type)}
            />
            {!template.is_global && (
              <ActionChip
                label="מחק"
                icon="trash-2"
                onPress={() => onDelete(template.id)}
                destructive
              />
            )}
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// --- Action Chip (with press feedback) ---

interface ActionChipProps {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  onPress: () => void;
  destructive?: boolean;
}

function ActionChip({ label, icon, onPress, destructive }: ActionChipProps) {
  const color = destructive ? COLORS.danger[700] : COLORS.neutral[600];
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={() => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          onPress();
        }}
        onPressIn={() => {
          scale.value = withSpring(0.94, { damping: 15, stiffness: 150 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 150 });
        }}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 8,
          backgroundColor: destructive ? COLORS.danger[50] : COLORS.cream[50],
          borderWidth: 1,
          borderColor: destructive ? COLORS.danger[200] : COLORS.cream[200],
        }}
      >
        <Feather name={icon} size={12} color={color} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Rubik-Medium',
            color,
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// --- Type Accordion ---

interface TypeAccordionProps {
  reportType: string;
  templates: ChecklistTemplateSummary[];
  isOpen: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onToggleDefault: (id: string, reportType: string) => void;
  defaultTemplateId: string | undefined;
  isCreating: boolean;
  busy: boolean;
}

function TypeAccordion({
  reportType,
  templates,
  isOpen,
  onToggle,
  onAdd,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleDefault,
  defaultTemplateId,
  isCreating,
  busy,
}: TypeAccordionProps) {
  const chevronRotation = useSharedValue(isOpen ? 90 : 0);
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  const headerScale = useSharedValue(1);
  const headerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    chevronRotation.value = withTiming(isOpen ? 0 : 90, { duration: 200 });
    onToggle();
  };

  const label = REPORT_TYPE_LABELS[reportType] ?? reportType;

  return (
    <View
      style={{
        marginBottom: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        backgroundColor: COLORS.cream[50],
        overflow: 'hidden',
      }}
    >
      {/* Accordion header */}
      <Animated.View style={headerAnimStyle}>
        <Pressable
          onPress={handleToggle}
          onPressIn={() => {
            headerScale.value = withSpring(0.98, {
              damping: 15,
              stiffness: 150,
            });
          }}
          onPressOut={() => {
            headerScale.value = withSpring(1, { damping: 15, stiffness: 150 });
          }}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 14,
            gap: 8,
          }}
        >
          <Animated.View style={chevronStyle}>
            <Feather
              name="chevron-left"
              size={16}
              color={COLORS.neutral[500]}
            />
          </Animated.View>
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              fontFamily: 'Rubik-SemiBold',
              color: COLORS.neutral[700],
              textAlign: 'right',
            }}
          >
            {label}
          </Text>
          <View
            style={{
              backgroundColor: COLORS.primary[50],
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Rubik-Medium',
                color: COLORS.primary[600],
              }}
            >
              {templates.length}
            </Text>
          </View>
        </Pressable>
      </Animated.View>

      {/* Accordion body */}
      {isOpen && (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutUp.duration(200)}
        >
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: COLORS.cream[200],
              paddingHorizontal: 12,
              paddingTop: 10,
              paddingBottom: 4,
            }}
          >
            {/* Add button for this type */}
            <View
              style={{
                flexDirection: 'row-reverse',
                justifyContent: 'flex-end',
                marginBottom: 10,
              }}
            >
              <Pressable
                onPress={onAdd}
                disabled={isCreating || busy}
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 10,
                  backgroundColor: COLORS.primary[50],
                  borderWidth: 1,
                  borderColor: COLORS.primary[200],
                  opacity: isCreating || busy ? 0.5 : 1,
                }}
              >
                {isCreating ? (
                  <ActivityIndicator size={12} color={COLORS.primary[500]} />
                ) : (
                  <Feather name="plus" size={14} color={COLORS.primary[500]} />
                )}
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Rubik-Medium',
                    color: COLORS.primary[500],
                  }}
                >
                  הוסף תבנית
                </Text>
              </Pressable>
            </View>

            {/* Template cards */}
            {templates.map((t, i) => (
              <TemplateCard
                key={t.id}
                template={t}
                index={i}
                isDefault={t.id === defaultTemplateId}
                onEdit={onEdit}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
                onToggleDefault={onToggleDefault}
              />
            ))}

            {/* Empty section */}
            {templates.length === 0 && (
              <View
                style={{
                  paddingVertical: 16,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Rubik-Regular',
                    color: COLORS.neutral[400],
                    textAlign: 'center',
                  }}
                >
                  אין תבניות עדיין
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

// --- Section ---

interface TemplatesSectionProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export function TemplatesSection({
  onSuccess,
  onError,
}: TemplatesSectionProps) {
  const router = useRouter();
  const { profile } = useAuth();
  const {
    templates,
    isLoading,
    isCreating,
    isDuplicating,
    createTemplate,
    duplicateTemplate,
    deleteTemplate,
    setDefaultTemplate,
  } = useChecklistTemplates();

  const preferences = profile?.preferences;

  const [busy, setBusy] = useState(false);

  // Create modal state — includes reportType for the section
  const [createModal, setCreateModal] = useState<{
    visible: boolean;
    reportType: string;
  }>({ visible: false, reportType: 'delivery' });

  // Duplicate confirm state
  const [duplicateTarget, setDuplicateTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Delete confirm state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Accordion open state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    delivery: true,
    bedek_bait: true,
  });

  // Group templates by report_type
  const grouped = useMemo(() => {
    const groups: Record<string, ChecklistTemplateSummary[]> = {
      delivery: [],
      bedek_bait: [],
    };
    for (const t of templates) {
      const key = t.report_type;
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    }
    return groups;
  }, [templates]);

  // Ordered section keys (delivery first)
  const sectionKeys = useMemo(() => {
    const keys = Object.keys(grouped);
    keys.sort((a, b) => {
      if (a === 'delivery') return -1;
      if (b === 'delivery') return 1;
      return a.localeCompare(b);
    });
    return keys;
  }, [grouped]);

  const toggleSection = useCallback((key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleCreate = useCallback((reportType: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCreateModal({ visible: true, reportType });
  }, []);

  const handleCreateSubmit = useCallback(
    async (name: string) => {
      const { reportType } = createModal;
      setCreateModal({ visible: false, reportType: 'delivery' });
      try {
        setBusy(true);
        const id = await createTemplate(name, reportType);
        onSuccess?.('התבנית נוצרה בהצלחה');
        router.push(`/(app)/settings/edit-template?id=${id}`);
      } catch (err) {
        console.error('[TemplatesSection] create failed:', err);
        onError?.('שגיאה ביצירת תבנית');
      } finally {
        setBusy(false);
      }
    },
    [createModal, createTemplate, onSuccess, onError, router]
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/settings/edit-template?id=${id}`);
    },
    [router]
  );

  const handleDuplicate = useCallback(
    (sourceId: string, sourceName: string) => {
      setDuplicateTarget({ id: sourceId, name: sourceName });
    },
    []
  );

  const handleDuplicateConfirm = useCallback(
    async (newName: string) => {
      if (!duplicateTarget) return;
      const { id: sourceId } = duplicateTarget;
      setDuplicateTarget(null);
      try {
        setBusy(true);
        await duplicateTemplate(sourceId, newName);
        onSuccess?.('התבנית שוכפלה בהצלחה');
      } catch (err) {
        console.error('[TemplatesSection] duplicate failed:', err);
        onError?.('שגיאה בשכפול תבנית');
      } finally {
        setBusy(false);
      }
    },
    [duplicateTarget, duplicateTemplate, onSuccess, onError]
  );

  const handleDelete = useCallback((id: string) => {
    setDeleteTargetId(id);
  }, []);

  const getDefaultTemplateId = useCallback(
    (reportType: string): string | undefined => {
      if (reportType === 'bedek_bait')
        return preferences?.defaultTemplateBedekBait;
      return preferences?.defaultTemplateDelivery;
    },
    [preferences]
  );

  const handleToggleDefault = useCallback(
    async (templateId: string, reportType: string) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      try {
        const currentDefault = getDefaultTemplateId(reportType);
        const newDefault = currentDefault === templateId ? null : templateId;
        await setDefaultTemplate(reportType, newDefault);
        onSuccess?.(
          newDefault ? 'תבנית ברירת מחדל הוגדרה' : 'ברירת מחדל הוסרה'
        );
      } catch (err) {
        console.error('[TemplatesSection] setDefault failed:', err);
        onError?.('שגיאה בהגדרת ברירת מחדל');
      }
    },
    [getDefaultTemplateId, setDefaultTemplate, onSuccess, onError]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    try {
      setBusy(true);
      await deleteTemplate(id);
      onSuccess?.('התבנית נמחקה');
    } catch (err) {
      console.error('[TemplatesSection] delete failed:', err);
      onError?.('שגיאה במחיקת תבנית');
    } finally {
      setBusy(false);
    }
  }, [deleteTargetId, deleteTemplate, onSuccess, onError]);

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Create modal (cross-platform) */}
      <NameInputModal
        visible={createModal.visible}
        title="תבנית חדשה"
        placeholder="הזן שם לתבנית..."
        onSubmit={handleCreateSubmit}
        onCancel={() =>
          setCreateModal({ visible: false, reportType: 'delivery' })
        }
      />

      {/* Duplicate name modal */}
      <NameInputModal
        visible={!!duplicateTarget}
        title="שכפול תבנית"
        placeholder="הזן שם לתבנית המשוכפלת..."
        initialValue={duplicateTarget ? `${duplicateTarget.name} (עותק)` : ''}
        onSubmit={handleDuplicateConfirm}
        onCancel={() => setDuplicateTarget(null)}
      />

      {/* Delete confirmation modal */}
      <ConfirmModal
        visible={!!deleteTargetId}
        title="מחיקת תבנית"
        message="האם למחוק את התבנית? פעולה זו בלתי הפיכה."
        confirmLabel="מחק"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
        destructive
      />

      {/* Section header */}
      <View
        style={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'Rubik-SemiBold',
            color: COLORS.neutral[700],
            textAlign: 'right',
          }}
        >
          עריכת תבניות
        </Text>
      </View>

      {/* Loading skeleton */}
      {isLoading && (
        <View style={{ gap: 10 }}>
          <SkeletonBlock width="100%" height={80} borderRadius={12} />
          <SkeletonBlock width="100%" height={80} borderRadius={12} />
        </View>
      )}

      {/* Busy overlay indicator */}
      {(isDuplicating || busy) && !isLoading && (
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <ActivityIndicator size="small" color={COLORS.primary[500]} />
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[500],
            }}
          >
            מעבד...
          </Text>
        </View>
      )}

      {/* Accordion sections by report_type */}
      {!isLoading &&
        sectionKeys.map((key) => (
          <TypeAccordion
            key={key}
            reportType={key}
            templates={grouped[key]}
            isOpen={!!openSections[key]}
            onToggle={() => toggleSection(key)}
            onAdd={() => handleCreate(key)}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onToggleDefault={handleToggleDefault}
            defaultTemplateId={getDefaultTemplateId(key)}
            isCreating={isCreating}
            busy={busy}
          />
        ))}

      {/* Empty state — only if no templates at all */}
      {!isLoading && templates.length === 0 && (
        <View
          style={{
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            borderRadius: 12,
            padding: 32,
            alignItems: 'center',
          }}
        >
          <Feather name="layout" size={48} color={COLORS.neutral[300]} />
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Rubik-Medium',
              color: COLORS.neutral[500],
              textAlign: 'center',
              marginTop: 12,
            }}
          >
            אין תבניות עדיין
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[400],
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            צור תבנית חדשה או שכפל תבנית קיימת
          </Text>
          <Pressable
            onPress={() => handleCreate('delivery')}
            style={{
              marginTop: 16,
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: COLORS.primary[500],
              ...SHADOWS.sm,
            }}
          >
            <Feather name="plus" size={16} color={COLORS.white} />
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Medium',
                color: COLORS.white,
              }}
            >
              הוסף תבנית
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
