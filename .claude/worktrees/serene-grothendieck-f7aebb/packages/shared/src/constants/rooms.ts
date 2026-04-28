// Room types for Israeli apartments
// Icons reference lucide-react-native icon names

export const ROOM_TYPES = [
  { value: 'living_room', label: 'סלון', icon: 'sofa' },
  { value: 'kitchen', label: 'מטבח', icon: 'cooking-pot' },
  { value: 'bedroom_1', label: 'חדר שינה 1', icon: 'bed' },
  { value: 'bedroom_2', label: 'חדר שינה 2', icon: 'bed' },
  { value: 'bedroom_3', label: 'חדר שינה 3', icon: 'bed' },
  { value: 'master_bathroom', label: 'חדר רחצה ראשי', icon: 'bath' },
  { value: 'parent_bathroom', label: 'חדר רחצה הורים', icon: 'bath' },
  { value: 'guest_toilet', label: 'שירותי אורחים', icon: 'door-open' },
  { value: 'service_balcony', label: 'מרפסת שירות', icon: 'fence' },
  { value: 'living_balcony', label: 'מרפסת סלון', icon: 'fence' },
  { value: 'hallway', label: 'מעבר / מסדרון', icon: 'move-horizontal' },
  { value: 'laundry', label: 'חדר כביסה', icon: 'shirt' },
  { value: 'safe_room', label: 'ממ"ד', icon: 'shield' },
  { value: 'storage', label: 'חדר אחסון', icon: 'archive' },
] as const;

export type RoomType = (typeof ROOM_TYPES)[number]['value'];

export const ROOM_LABELS: Record<RoomType, string> = Object.fromEntries(
  ROOM_TYPES.map((room) => [room.value, room.label]),
) as Record<RoomType, string>;
