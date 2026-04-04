import { useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { COLORS, BORDER_RADIUS } from '@infield/ui';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';
import { useDefectLibrary } from '@/hooks/useDefectLibrary';
import { useToast } from '@/hooks/useToast';
import { DefectLibraryCard } from '@/components/defect/DefectLibraryCard';

import type { DefectLibraryItem } from '@/hooks/useDefectLibrary';

// --- Section Header ---

function SectionHeader({ title, emoji }: { title: string; emoji: string }) {
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 4,
        paddingVertical: 8,
      }}
    >
      <Text style={{ fontSize: 14 }}>{emoji}</Text>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: COLORS.neutral[600],
          fontFamily: 'Rubik-SemiBold',
        }}
      >
        {title}
      </Text>
    </View>
  );
}

// --- Screen ---

export default function DefectLibraryScreen() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();

  const {
    items,
    categories,
    isLoading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    deleteItem,
  } = useDefectLibrary();

  const userItems = items.filter((i) => i.source === 'user');
  const systemItems = items.filter((i) => i.source === 'system');

  // Build sections for FlashList
  const listData: Array<
    DefectLibraryItem | { type: 'header'; title: string; emoji: string }
  > = [];

  if (userItems.length > 0) {
    listData.push({ type: 'header', title: 'מהמאגר שלי', emoji: '✏️' });
    listData.push(...userItems);
  }
  if (systemItems.length > 0) {
    listData.push({ type: 'header', title: 'מאגר inField', emoji: '🔒' });
    listData.push(...systemItems);
  }

  const handleItemPress = useCallback(
    (_item: DefectLibraryItem) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      // Navigate back with pre-filled data
      router.back();
      // Pass data via router params won't work well for complex objects,
      // so we use a simpler approach — navigate to add-defect with params
      // The calling screen should handle this
    },
    [router]
  );

  const handleDeleteItem = useCallback(
    (item: DefectLibraryItem) => {
      Alert.alert('מחיקת פריט', 'הפריט יימחק מהמאגר. דוחות קיימים לא יושפעו.', [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'מחק',
          style: 'destructive',
          onPress: () => {
            deleteItem(item.id);
            showToast('הפריט נמחק מהמאגר', 'success');
          },
        },
      ]);
    },
    [deleteItem, showToast]
  );

  const renderItem = useCallback(
    ({ item }: { item: (typeof listData)[number] }) => {
      if ('type' in item && item.type === 'header') {
        return <SectionHeader title={item.title} emoji={item.emoji} />;
      }

      const libraryItem = item as DefectLibraryItem;
      return (
        <DefectLibraryCard
          item={libraryItem}
          onPress={() => handleItemPress(libraryItem)}
          onLongPress={
            libraryItem.source === 'user'
              ? () => handleDeleteItem(libraryItem)
              : undefined
          }
        />
      );
    },
    [handleItemPress, handleDeleteItem]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream[50] }}>
      <StatusBar style="dark" />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={!!toast}
          onDismiss={hideToast}
        />
      )}

      {/* Header */}
      <Animated.View
        entering={FadeInUp.duration(300)}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 12,
          gap: 12,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Feather name="chevron-right" size={24} color={COLORS.neutral[700]} />
        </Pressable>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: COLORS.neutral[800],
            fontFamily: 'Rubik-Bold',
            flex: 1,
            textAlign: 'right',
          }}
        >
          מאגר ממצאים
        </Text>
      </Animated.View>

      {/* Search bar */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(300)}
        style={{
          marginHorizontal: 16,
          marginBottom: 8,
        }}
      >
        <View
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            borderRadius: BORDER_RADIUS.md,
            paddingHorizontal: 12,
            gap: 8,
          }}
        >
          <Feather name="search" size={20} color={COLORS.neutral[400]} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="חיפוש ממצא..."
            placeholderTextColor={COLORS.neutral[400]}
            style={{
              flex: 1,
              height: 42,
              fontSize: 14,
              color: COLORS.neutral[700],
              fontFamily: 'Rubik-Regular',
              textAlign: 'right',
            }}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color={COLORS.neutral[400]} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      {/* Category filter chips */}
      <Animated.View entering={FadeInDown.delay(150).duration(300)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 6,
            paddingBottom: 8,
            flexDirection: 'row-reverse',
          }}
        >
          <Pressable
            onPress={() => setCategoryFilter(null)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              backgroundColor: !categoryFilter
                ? COLORS.primary[500]
                : COLORS.cream[100],
              borderWidth: 1,
              borderColor: !categoryFilter
                ? COLORS.primary[500]
                : COLORS.cream[200],
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: !categoryFilter ? COLORS.white : COLORS.neutral[600],
                fontFamily: 'Rubik-Medium',
              }}
            >
              הכל
            </Text>
          </Pressable>
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() =>
                setCategoryFilter(categoryFilter === cat ? null : cat)
              }
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor:
                  categoryFilter === cat
                    ? COLORS.primary[500]
                    : COLORS.cream[100],
                borderWidth: 1,
                borderColor:
                  categoryFilter === cat
                    ? COLORS.primary[500]
                    : COLORS.cream[200],
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color:
                    categoryFilter === cat ? COLORS.white : COLORS.neutral[600],
                  fontFamily: 'Rubik-Medium',
                }}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {/* List */}
      {isLoading ? (
        <View style={{ padding: 16, gap: 8 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonBlock
              key={i}
              width="100%"
              height={64}
              borderRadius={BORDER_RADIUS.md}
            />
          ))}
        </View>
      ) : listData.length === 0 ? (
        <EmptyState
          icon="database"
          title="אין ממצאים במאגר"
          subtitle={searchQuery ? 'נסה חיפוש אחר' : 'ממצאים שתשמור יופיעו כאן'}
        />
      ) : (
        <FlashList
          data={listData}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          keyExtractor={(item) =>
            'type' in item ? `header-${item.title}` : item.id
          }
        />
      )}
    </SafeAreaView>
  );
}
