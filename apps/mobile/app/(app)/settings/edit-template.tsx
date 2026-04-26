import { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  Modal,
  FlatList,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from '@/lib/haptics';
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
type RenderItemParams<T> = {
  item: T;
  index: number;
  drag: () => void;
  isActive?: boolean;
  getIndex?: () => number | undefined;
};

let DraggableFlatList: typeof FlatList = FlatList as any; // eslint-disable-line @typescript-eslint/no-explicit-any
let ScaleDecorator = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

if (Platform.OS !== 'web') {
  try {
    const draggable = require('react-native-draggable-flatlist'); // eslint-disable-line @typescript-eslint/no-require-imports
    DraggableFlatList = draggable.default;
    ScaleDecorator = draggable.ScaleDecorator;
  } catch {
    // Swallow error
    // Fallback if library not available
  }
}

import { COLORS, SHADOWS } from '@infield/ui';

import { useChecklistTemplate } from '@/hooks/useChecklistTemplate';
import { SkeletonBlock } from '@/components/ui';

// --- Types ---

interface DBItem {
  id: string;
  description: string;
  sort_order: number;
  metadata: Record<string, unknown>;
}

interface DBCategory {
  id: string;
  name: string;
  sort_order: number;
  checklist_items: DBItem[];
}

// --- ModalShell ---

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

// --- Name Input Modal ---

interface NameInputModalProps {
  visible: boolean;
  title: string;
  placeholder: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

function NameInputModal({
  visible,
  title,
  placeholder,
  onSubmit,
  onCancel,
}: NameInputModalProps) {
  const [value, setValue] = useState('');
  const btnScale = useSharedValue(1);
  const btnAnim = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

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
        <Animated.View style={[{ flex: 1 }, btnAnim]}>
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web')
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              handleSubmit();
            }}
            onPressIn={() => {
              btnScale.value = withSpring(0.96, {
                damping: 15,
                stiffness: 150,
              });
            }}
            onPressOut={() => {
              btnScale.value = withSpring(1, { damping: 15, stiffness: 150 });
            }}
            disabled={!value.trim()}
            style={{
              height: 40,
              borderRadius: 10,
              backgroundColor: value.trim()
                ? COLORS.primary[500]
                : COLORS.neutral[200],
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
              אישור
            </Text>
          </Pressable>
        </Animated.View>
        <Pressable
          onPress={handleCancel}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 10,
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Rubik-Medium',
              color: COLORS.neutral[600],
            }}
          >
            ביטול
          </Text>
        </Pressable>
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
}

function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const btnScale = useSharedValue(1);
  const btnAnim = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

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
        <Animated.View style={[{ flex: 1 }, btnAnim]}>
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web')
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onConfirm();
            }}
            onPressIn={() => {
              btnScale.value = withSpring(0.96, {
                damping: 15,
                stiffness: 150,
              });
            }}
            onPressOut={() => {
              btnScale.value = withSpring(1, { damping: 15, stiffness: 150 });
            }}
            style={{
              height: 40,
              borderRadius: 10,
              backgroundColor: COLORS.danger[500],
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
              {confirmLabel}
            </Text>
          </Pressable>
        </Animated.View>
        <Pressable
          onPress={onCancel}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 10,
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Rubik-Medium',
              color: COLORS.neutral[600],
            }}
          >
            ביטול
          </Text>
        </Pressable>
      </View>
    </ModalShell>
  );
}

// --- Move-to-Category Picker Modal ---

interface MoveItemModalProps {
  visible: boolean;
  categories: DBCategory[];
  currentCategoryId: string;
  onSelect: (categoryId: string) => void;
  onCancel: () => void;
}

function MoveItemModal({
  visible,
  categories,
  currentCategoryId,
  onSelect,
  onCancel,
}: MoveItemModalProps) {
  const targets = categories.filter((c) => c.id !== currentCategoryId);

  return (
    <ModalShell visible={visible} onClose={onCancel}>
      <Text
        style={{
          fontSize: 16,
          fontFamily: 'Rubik-SemiBold',
          color: COLORS.neutral[800],
          textAlign: 'right',
          marginBottom: 12,
        }}
      >
        העבר לחדר
      </Text>

      <FlatList
        data={targets}
        keyExtractor={(c) => c.id}
        style={{ maxHeight: 300 }}
        renderItem={({ item: cat }) => (
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web')
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(cat.id);
            }}
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 8,
              paddingVertical: 12,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.cream[200],
            }}
          >
            <Feather name="folder" size={16} color={COLORS.primary[500]} />
            <Text
              style={{
                flex: 1,
                fontSize: 14,
                fontFamily: 'Rubik-Medium',
                color: COLORS.neutral[700],
                textAlign: 'right',
              }}
            >
              {cat.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[400],
              }}
            >
              {cat.checklist_items?.length ?? 0} פריטים
            </Text>
          </Pressable>
        )}
      />

      <Pressable
        onPress={onCancel}
        style={{
          marginTop: 12,
          height: 40,
          borderRadius: 10,
          backgroundColor: COLORS.cream[100],
          borderWidth: 1,
          borderColor: COLORS.cream[200],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Rubik-Medium',
            color: COLORS.neutral[600],
          }}
        >
          ביטול
        </Text>
      </Pressable>
    </ModalShell>
  );
}

// --- Drag Handle ---

function DragHandle({ drag }: { drag: () => void }) {
  return (
    <Pressable
      onLongPress={drag}
      delayLongPress={100}
      style={{
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ gap: 2 }}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              gap: 3,
            }}
          >
            <View
              style={{
                width: 3,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: COLORS.neutral[300],
              }}
            />
            <View
              style={{
                width: 3,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: COLORS.neutral[300],
              }}
            />
          </View>
        ))}
      </View>
    </Pressable>
  );
}

// --- Item Row ---

interface ItemRowProps {
  item: DBItem;
  categoryId: string;
  index: number;
  readOnly: boolean;
  drag: () => void;
  isActive: boolean;
  onUpdate: (itemId: string, description: string) => void;
  onRemove: (itemId: string) => void;
  onMove: (itemId: string, categoryId: string) => void;
}

function ItemRow({
  item,
  readOnly,
  drag,
  isActive,
  onUpdate,
  onRemove,
  onMove,
  categoryId,
}: ItemRowProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.description);

  const handleSaveEdit = () => {
    setEditing(false);
    if (text.trim() && text.trim() !== item.description) {
      onUpdate(item.id, text.trim());
    } else {
      setText(item.description);
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: isActive ? COLORS.primary[50] : COLORS.cream[50],
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cream[100],
      }}
    >
      {/* Drag handle */}
      {!readOnly && <DragHandle drag={drag} />}

      {/* Green bullet */}
      <View
        style={{
          width: 5,
          height: 5,
          borderRadius: 3,
          backgroundColor: COLORS.primary[300],
        }}
      />

      {/* Description */}
      {editing ? (
        <TextInput
          value={text}
          onChangeText={setText}
          onBlur={handleSaveEdit}
          onSubmitEditing={handleSaveEdit}
          autoFocus
          style={{
            flex: 1,
            fontSize: 13,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[700],
            textAlign: 'right',
            backgroundColor: COLORS.cream[50],
            borderWidth: 1,
            borderColor: COLORS.primary[300],
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        />
      ) : (
        <Pressable
          onPress={() => !readOnly && setEditing(true)}
          style={{ flex: 1 }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[700],
              textAlign: 'right',
            }}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        </Pressable>
      )}

      {/* Actions */}
      {!readOnly && (
        <View style={{ flexDirection: 'row-reverse', gap: 2 }}>
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web')
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onMove(item.id, categoryId);
            }}
            style={{ padding: 4 }}
          >
            <Feather
              name="corner-down-left"
              size={14}
              color={COLORS.neutral[400]}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web')
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onRemove(item.id);
            }}
            style={{ padding: 4 }}
          >
            <Feather name="trash-2" size={14} color={COLORS.danger[700]} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

// --- Category Row ---

interface CategoryRowProps {
  category: DBCategory;
  index: number;
  readOnly: boolean;
  drag: () => void;
  isActive: boolean;
  onRename: (categoryId: string, name: string) => void;
  onRemove: (categoryId: string) => void;
  onAddItem: (categoryId: string, description: string) => void;
  onUpdateItem: (itemId: string, description: string) => void;
  onRemoveItem: (itemId: string) => void;
  onReorderItems: (orderedIds: string[]) => void;
  onMoveItem: (itemId: string, categoryId: string) => void;
}

function CategoryRow({
  category,
  index,
  readOnly,
  drag,
  isActive,
  onRename,
  onRemove,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onReorderItems,
  onMoveItem,
}: CategoryRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [roomName, setRoomName] = useState(category.name);
  const [newItemText, setNewItemText] = useState('');

  const chevronRotation = useSharedValue(0);
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  const toggleOpen = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const next = !isOpen;
    setIsOpen(next);
    chevronRotation.value = withTiming(next ? 90 : 0, { duration: 200 });
  };

  const handleRename = () => {
    setRenaming(false);
    if (roomName.trim() && roomName.trim() !== category.name) {
      onRename(category.id, roomName.trim());
    } else {
      setRoomName(category.name);
    }
  };

  const handleDelete = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onRemove(category.id);
  };

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    onAddItem(category.id, newItemText.trim());
    setNewItemText('');
  };

  const sortedItems = [...(category.checklist_items ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  // @ts-expect-error — DraggableFlatList renderItem params
  const renderItem = useCallback(
    ({
      item,
      drag: itemDrag,
      isActive: itemActive,
    }: RenderItemParams<DBItem>) => (
      <ScaleDecorator>
        <ItemRow
          item={item}
          categoryId={category.id}
          index={0}
          readOnly={readOnly}
          drag={itemDrag}
          isActive={itemActive}
          onUpdate={onUpdateItem}
          onRemove={onRemoveItem}
          onMove={onMoveItem}
        />
      </ScaleDecorator>
    ),
    [category.id, readOnly, onUpdateItem, onRemoveItem, onMoveItem]
  );

  return (
    <Animated.View
      entering={FadeInUp.delay(40 * index).duration(200)}
      style={{
        backgroundColor: isActive ? COLORS.primary[50] : COLORS.cream[100],
        borderWidth: 1,
        borderColor: isActive ? COLORS.primary[200] : COLORS.cream[200],
        borderRadius: 12,
        marginBottom: 10,
        overflow: 'hidden',
        ...SHADOWS.sm,
      }}
    >
      {/* Category header */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 14,
          gap: 8,
        }}
      >
        {/* Drag handle for category */}
        {!readOnly && <DragHandle drag={drag} />}

        {/* Chevron toggle */}
        <Pressable onPress={toggleOpen}>
          <Animated.View style={chevronStyle}>
            <Feather
              name="chevron-left"
              size={16}
              color={COLORS.neutral[500]}
            />
          </Animated.View>
        </Pressable>

        {/* Category name */}
        {renaming ? (
          <TextInput
            value={roomName}
            onChangeText={setRoomName}
            onBlur={handleRename}
            onSubmitEditing={handleRename}
            autoFocus
            style={{
              flex: 1,
              fontSize: 14,
              fontFamily: 'Rubik-Medium',
              color: COLORS.neutral[800],
              textAlign: 'right',
              backgroundColor: COLORS.cream[50],
              borderWidth: 1,
              borderColor: COLORS.primary[300],
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          />
        ) : (
          <Pressable
            onPress={toggleOpen}
            onLongPress={() => !readOnly && setRenaming(true)}
            style={{ flex: 1 }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Rubik-Medium',
                color: COLORS.neutral[800],
                textAlign: 'right',
              }}
              numberOfLines={1}
            >
              {category.name}
            </Text>
          </Pressable>
        )}

        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[400],
          }}
        >
          {sortedItems.length} פריטים
        </Text>

        {!readOnly && (
          <Pressable onPress={handleDelete} style={{ padding: 4 }}>
            <Feather name="trash-2" size={14} color={COLORS.danger[700]} />
          </Pressable>
        )}
      </View>

      {/* Items (expanded) */}
      {isOpen && (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutUp.duration(200)}
        >
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: COLORS.cream[200],
            }}
          >
            {readOnly ? (
              // Read-only: simple list, no drag
              sortedItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  categoryId={category.id}
                  index={0}
                  readOnly
                  drag={() => {}}
                  isActive={false}
                  onUpdate={onUpdateItem}
                  onRemove={onRemoveItem}
                  onMove={onMoveItem}
                />
              ))
            ) : (
              // Editable: draggable items
              // @ts-expect-error — DraggableFlatList

              <DraggableFlatList
                data={sortedItems}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                onDragEnd={({ data }) => {
                  onReorderItems(data.map((d) => d.id));
                }}
                activationDistance={5}
              />
            )}
          </View>

          {/* Add item input */}
          {!readOnly && (
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderTopWidth: 1,
                borderTopColor: COLORS.cream[200],
                backgroundColor: COLORS.cream[50],
                gap: 6,
              }}
            >
              <TextInput
                value={newItemText}
                onChangeText={setNewItemText}
                onSubmitEditing={handleAddItem}
                placeholder="הוסף פריט חדש..."
                placeholderTextColor={COLORS.neutral[400]}
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[700],
                  textAlign: 'right',
                  backgroundColor: COLORS.cream[50],
                  borderWidth: 1,
                  borderColor: COLORS.cream[200],
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                }}
              />
              <Pressable
                onPress={handleAddItem}
                disabled={!newItemText.trim()}
                style={{
                  padding: 6,
                  borderRadius: 8,
                  backgroundColor: newItemText.trim()
                    ? COLORS.primary[50]
                    : COLORS.cream[100],
                }}
              >
                <Feather
                  name="plus"
                  size={16}
                  color={
                    newItemText.trim()
                      ? COLORS.primary[500]
                      : COLORS.neutral[300]
                  }
                />
              </Pressable>
            </View>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
}

// --- Screen ---

export default function EditTemplateScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    template,
    categories,
    isLoading,
    addCategory,
    removeCategory,
    renameCategory,
    batchReorderCategories,
    addItem,
    removeItem,
    updateItem,
    batchReorderItems,
    moveItemToCategory,
    updateShowSeverityDefault,
  } = useChecklistTemplate(id);

  const readOnly = template?.is_global ?? false;
  const [showRoomModal, setShowRoomModal] = useState(false);

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'item' | 'category';
    id: string;
    label: string;
  } | null>(null);

  // Move item state
  const [moveItemState, setMoveItemState] = useState<{
    itemId: string;
    currentCategoryId: string;
  } | null>(null);

  // Back button
  const backScale = useSharedValue(1);
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  const handleBack = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/settings/templates');
    }
  }, [router]);

  // Add room
  const handleAddRoom = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowRoomModal(true);
  }, []);

  const handleAddRoomSubmit = useCallback(
    async (name: string) => {
      setShowRoomModal(false);
      try {
        await addCategory(name);
      } catch (err) {
        console.error('[EditTemplate] addCategory failed:', err);
      }
    },
    [addCategory]
  );

  // Handlers
  const handleRenameCategory = useCallback(
    async (categoryId: string, name: string) => {
      try {
        await renameCategory(categoryId, name);
      } catch (err) {
        console.error('[EditTemplate] renameCategory failed:', err);
      }
    },
    [renameCategory]
  );

  const handleRequestRemoveCategory = useCallback(
    (categoryId: string) => {
      const cat = categories.find((c) => c.id === categoryId);
      setDeleteConfirm({
        type: 'category',
        id: categoryId,
        label: cat?.name ?? 'חדר',
      });
    },
    [categories]
  );

  const handleRequestRemoveItem = useCallback(
    (itemId: string) => {
      let label = 'פריט';
      for (const cat of categories) {
        const found = cat.checklist_items?.find((it) => it.id === itemId);
        if (found) {
          label = found.description;
          break;
        }
      }
      setDeleteConfirm({ type: 'item', id: itemId, label });
    },
    [categories]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm) return;
    const { type, id: targetId } = deleteConfirm;
    setDeleteConfirm(null);
    try {
      if (type === 'category') {
        await removeCategory(targetId);
      } else {
        await removeItem(targetId);
      }
    } catch (err) {
      console.error('[EditTemplate] delete failed:', err);
    }
  }, [deleteConfirm, removeCategory, removeItem]);

  const handleCategoryDragEnd = useCallback(
    async ({ data }: { data: DBCategory[] }) => {
      try {
        await batchReorderCategories(data.map((c) => c.id));
      } catch {
        console.warn(
          '[EditTemplate] reorder failed — will re-sync on next load'
        );
      }
    },
    [batchReorderCategories]
  );

  const handleItemReorder = useCallback(
    async (orderedIds: string[]) => {
      try {
        await batchReorderItems(orderedIds);
      } catch {
        console.warn(
          '[EditTemplate] reorder failed — will re-sync on next load'
        );
      }
    },
    [batchReorderItems]
  );

  const handleAddItem = useCallback(
    async (categoryId: string, description: string) => {
      try {
        await addItem(categoryId, description);
      } catch (err) {
        console.error('[EditTemplate] addItem failed:', err);
      }
    },
    [addItem]
  );

  const handleUpdateItem = useCallback(
    async (itemId: string, description: string) => {
      try {
        await updateItem(itemId, description);
      } catch (err) {
        console.error('[EditTemplate] updateItem failed:', err);
      }
    },
    [updateItem]
  );

  const handleRequestMoveItem = useCallback(
    (itemId: string, currentCategoryId: string) => {
      setMoveItemState({ itemId, currentCategoryId });
    },
    []
  );

  const handleMoveItemConfirm = useCallback(
    async (targetCategoryId: string) => {
      if (!moveItemState) return;
      const { itemId } = moveItemState;
      setMoveItemState(null);
      try {
        await moveItemToCategory(itemId, targetCategoryId);
      } catch (err) {
        console.error('[EditTemplate] moveItem failed:', err);
      }
    },
    [moveItemState, moveItemToCategory]
  );

  const sortedCategories = [...categories].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  // @ts-expect-error — DraggableFlatList renderItem params
  const renderCategory = useCallback(
    ({
      item: cat,
      drag: catDrag,
      isActive: catActive,
      getIndex,
    }: RenderItemParams<DBCategory>) => (
      <ScaleDecorator>
        <CategoryRow
          category={cat}
          index={typeof getIndex === 'function' ? getIndex() : 0}
          readOnly={readOnly}
          drag={catDrag}
          isActive={catActive}
          onRename={handleRenameCategory}
          onRemove={handleRequestRemoveCategory}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRequestRemoveItem}
          onReorderItems={handleItemReorder}
          onMoveItem={handleRequestMoveItem}
        />
      </ScaleDecorator>
    ),
    [
      readOnly,
      handleRenameCategory,
      handleRequestRemoveCategory,
      handleAddItem,
      handleUpdateItem,
      handleRequestRemoveItem,
      handleItemReorder,
      handleRequestMoveItem,
    ]
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.cream[50] }}
      edges={['top']}
    >
      <StatusBar style="dark" />

      {/* Room name input modal */}
      <NameInputModal
        visible={showRoomModal}
        title="חדר חדש"
        placeholder="הזן שם לחדר..."
        onSubmit={handleAddRoomSubmit}
        onCancel={() => setShowRoomModal(false)}
      />

      {/* Delete confirmation modal */}
      <ConfirmModal
        visible={!!deleteConfirm}
        title={deleteConfirm?.type === 'category' ? 'מחיקת חדר' : 'מחיקת פריט'}
        message={
          deleteConfirm?.type === 'category'
            ? `למחוק "${deleteConfirm?.label}" וכל הפריטים שלו?`
            : `למחוק "${deleteConfirm?.label}"?`
        }
        confirmLabel="מחק"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
      />

      {/* Move item modal */}
      <MoveItemModal
        visible={!!moveItemState}
        categories={categories}
        currentCategoryId={moveItemState?.currentCategoryId ?? ''}
        onSelect={handleMoveItemConfirm}
        onCancel={() => setMoveItemState(null)}
      />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.cream[200],
          gap: 12,
        }}
      >
        <Animated.View style={backStyle}>
          <Pressable
            onPress={handleBack}
            onPressIn={() => {
              backScale.value = withSpring(0.92, {
                damping: 15,
                stiffness: 150,
              });
            }}
            onPressOut={() => {
              backScale.value = withSpring(1, {
                damping: 15,
                stiffness: 150,
              });
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: COLORS.cream[100],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather
              name="chevron-right"
              size={20}
              color={COLORS.neutral[600]}
            />
          </Pressable>
        </Animated.View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Rubik-SemiBold',
              color: COLORS.neutral[800],
              textAlign: 'right',
            }}
            numberOfLines={1}
          >
            {template?.name ?? 'טוען...'}
          </Text>
          {readOnly && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Rubik-Regular',
                color: COLORS.neutral[400],
                textAlign: 'right',
              }}
            >
              תבנית מערכת — קריאה בלבד
            </Text>
          )}
        </View>

        {!readOnly && (
          <Pressable
            onPress={handleAddRoom}
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
            }}
          >
            <Feather name="plus" size={14} color={COLORS.primary[500]} />
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Rubik-Medium',
                color: COLORS.primary[500],
              }}
            >
              הוסף חדר
            </Text>
          </Pressable>
        )}
      </View>

      {/* Read-only banner */}
      {readOnly && !isLoading && (
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 12,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: 8,
            padding: 12,
            backgroundColor: COLORS.warning[50],
            borderWidth: 1,
            borderColor: COLORS.warning[200],
            borderRadius: 10,
          }}
        >
          <Feather name="info" size={16} color={COLORS.gold[600]} />
          <Text
            style={{
              flex: 1,
              fontSize: 13,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[600],
              textAlign: 'right',
            }}
          >
            תבנית מערכת — לא ניתן לערוך. שכפל כדי להתאים אישית.
          </Text>
        </View>
      )}

      {/* Severity toggle */}
      {!isLoading && !readOnly && (
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 12,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
            paddingHorizontal: 14,
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            borderRadius: 10,
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
            <Feather
              name="alert-triangle"
              size={18}
              color={
                template?.showSeverityDefault
                  ? COLORS.warning[500]
                  : COLORS.neutral[400]
              }
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik-Medium',
                  color: COLORS.neutral[700],
                  textAlign: 'right',
                }}
              >
                רמת דחיפות
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.neutral[400],
                  textAlign: 'right',
                }}
              >
                ברירת מחדל לדוחות חדשים
              </Text>
            </View>
          </View>
          <Switch
            value={template?.showSeverityDefault ?? true}
            onValueChange={(val) => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              updateShowSeverityDefault(val);
            }}
            trackColor={{
              false: COLORS.cream[200],
              true: COLORS.warning[200],
            }}
            thumbColor={
              template?.showSeverityDefault
                ? COLORS.warning[500]
                : COLORS.neutral[300]
            }
          />
        </View>
      )}

      {/* Content */}
      <View style={{ flex: 1, padding: 16 }}>
        {/* Loading */}
        {isLoading && (
          <View style={{ gap: 10 }}>
            {[...Array(5)].map((_, i) => (
              <SkeletonBlock
                key={i}
                width="100%"
                height={56}
                borderRadius={12}
              />
            ))}
          </View>
        )}

        {/* Categories — Draggable or Read-only */}
        {!isLoading &&
          sortedCategories.length > 0 &&
          (readOnly ? (
            // Read-only: simple FlatList, no drag
            <FlatList
              data={sortedCategories}
              keyExtractor={(c) => c.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
              renderItem={({ item: cat, index: idx }) => (
                <CategoryRow
                  category={cat}
                  index={idx}
                  readOnly
                  drag={() => {}}
                  isActive={false}
                  onRename={handleRenameCategory}
                  onRemove={handleRequestRemoveCategory}
                  onAddItem={handleAddItem}
                  onUpdateItem={handleUpdateItem}
                  onRemoveItem={handleRequestRemoveItem}
                  onReorderItems={handleItemReorder}
                  onMoveItem={handleRequestMoveItem}
                />
              )}
            />
          ) : (
            // Editable: draggable categories
            // @ts-expect-error — DraggableFlatList

            <DraggableFlatList
              data={sortedCategories}
              keyExtractor={(c) => c.id}
              renderItem={renderCategory}
              onDragEnd={handleCategoryDragEnd}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
              activationDistance={10}
            />
          ))}

        {/* Empty state */}
        {!isLoading && categories.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
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
              אין חדרים בתבנית
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
              הוסף חדרים ופריטים לתבנית שלך
            </Text>
            {!readOnly && (
              <Pressable
                onPress={handleAddRoom}
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
                  הוסף חדר ראשון
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
