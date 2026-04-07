import { COLORS } from '@infield/ui';

import type { StatusConfig, ChecklistRoom } from './types';

// --- Status Configuration ---

export const STATUS: Record<string, StatusConfig> = {
  ok: {
    label: 'תקין',
    sym: '\u2713',
    color: COLORS.primary[500],
    bg: COLORS.primary[50],
    border: COLORS.primary[200],
  },
  defect: {
    label: 'לא תקין',
    sym: '\u2717',
    color: COLORS.danger[700],
    bg: COLORS.danger[50],
    border: COLORS.danger[200],
  },
  partial: {
    label: 'תקין חלקית',
    sym: '~',
    color: COLORS.gold[600],
    bg: COLORS.warning[50],
    border: COLORS.warning[200],
  },
  skip: {
    label: 'דלג',
    sym: '\u2014',
    color: COLORS.neutral[400],
    bg: COLORS.cream[100],
    border: COLORS.cream[300],
  },
};

// --- Rooms with Checklist Items ---

export const CHECKLIST_ROOMS: ChecklistRoom[] = [
  {
    id: 'entrance',
    name: 'מבואת כניסה',
    items: [
      { id: 'e1', text: 'דלת כניסה מותקנת ותקינה?' },
      { id: 'e2', text: 'אינטרקום/פעמון מותקן ותקין?' },
      { id: 'e3', text: 'טיח וצבע תקינים?' },
      { id: 'e4', text: 'ריצוף תקין?' },
      { id: 'e5', text: 'ארון חשמל ראשי מותקן ומסומן?' },
      { id: 'e6', text: 'תאורה תקינה?' },
    ],
  },
  {
    id: 'hallway',
    name: 'מסדרון',
    items: [
      { id: 'h1', text: 'טיח וצבע תקינים?' },
      { id: 'h2', text: 'ריצוף תקין?' },
      { id: 'h3', text: 'תאורה תקינה?' },
      { id: 'h4', text: 'שקעי חשמל תקינים?' },
    ],
  },
  {
    id: 'living',
    name: 'סלון',
    items: [
      { id: 'l1', text: 'טיח וצבע תקינים?' },
      { id: 'l2', text: 'ריצוף תקין?' },
      { id: 'l3', text: 'שקעי חשמל תקינים?' },
      { id: 'l4', text: 'הכנה לטלוויזיה?' },
      { id: 'l5', text: 'הכנה למזגן כולל ניקוז?' },
      { id: 'l6', text: 'חלון/וטרינה תקין?' },
    ],
  },
  {
    id: 'kitchen',
    name: 'מטבח',
    items: [
      { id: 'k1', text: 'מטבח מותקן?', hasChildren: true },
      { id: 'k1a', text: 'שיש מותקן ותקין?', parentId: 'k1' },
      { id: 'k1b', text: 'חיפוי קירות מותקן?', parentId: 'k1' },
      { id: 'k2', text: 'כיור וברז מותקנים ותקינים?' },
      { id: 'k3', text: 'הכנת גז תקינה?' },
      { id: 'k4', text: 'חלון מטבח תקין?' },
    ],
  },
  {
    id: 'bedroom1',
    name: 'חדר שינה הורים',
    items: [
      { id: 'b1_1', text: 'טיח וצבע תקינים?' },
      { id: 'b1_2', text: 'ריצוף תקין?' },
      { id: 'b1_3', text: 'שקעי חשמל תקינים?' },
      { id: 'b1_4', text: 'הכנה למזגן כולל ניקוז?' },
      { id: 'b1_5', text: 'חלון תקין?' },
    ],
  },
  {
    id: 'bedroom2',
    name: 'חדר שינה ילדים',
    items: [
      { id: 'b2_1', text: 'טיח וצבע תקינים?' },
      { id: 'b2_2', text: 'ריצוף תקין?' },
      { id: 'b2_3', text: 'שקעי חשמל תקינים?' },
      { id: 'b2_4', text: 'הכנה למזגן כולל ניקוז?' },
      { id: 'b2_5', text: 'חלון תקין?' },
    ],
  },
  {
    id: 'mamad',
    name: 'ממ"ד',
    items: [
      { id: 'm1', text: 'דלת ממ"ד מותקנת ותקינה?' },
      { id: 'm2', text: 'חלון ותריס פלדה תקינים?' },
      { id: 'm3', text: 'טיח וצבע תקינים?' },
      { id: 'm4', text: 'ריצוף תקין?' },
      { id: 'm5', text: 'שקעי חשמל תקינים?' },
    ],
  },
  {
    id: 'bath_master',
    name: 'חדר רחצה הורים',
    hasBathType: true,
    items: [
      { id: 'bm1', text: 'אסלה מותקנת ותקינה?' },
      { id: 'bm2', text: 'כיור וברז מותקנים ותקינים?' },
      { id: 'bm3s', text: 'אינטרפוץ מותקן ותקין?', bathType: 'shower' },
      { id: 'bm4s', text: 'מוט מקלחון מותקן?', bathType: 'shower' },
      { id: 'bm5s', text: 'מקלחון/מחיצה תקינה?', bathType: 'shower' },
      { id: 'bm3b', text: 'אמבטיה מותקנת ותקינה?', bathType: 'bath' },
      { id: 'bm4b', text: 'ברז אמבטיה מותקן ותקין?', bathType: 'bath' },
      { id: 'bm5b', text: 'מחיצת אמבטיה תקינה?', bathType: 'bath' },
      { id: 'bm6', text: 'חיפוי קירות תקין?' },
      { id: 'bm7', text: 'ריצוף תקין?' },
      { id: 'bm8', text: 'אוורור/וונטה תקין?' },
    ],
  },
  {
    id: 'guest_wc',
    name: 'שירותי אורחים',
    items: [
      { id: 'gw1', text: 'אסלה מותקנת ותקינה?' },
      { id: 'gw2', text: 'כיור וברז מותקנים ותקינים?' },
      { id: 'gw3', text: 'חיפוי קירות תקין?' },
      { id: 'gw4', text: 'ריצוף תקין?' },
      { id: 'gw5', text: 'אוורור/וונטה תקין?' },
    ],
  },
  {
    id: 'laundry',
    name: 'חדר כביסה/שירות',
    items: [
      { id: 'la1', text: 'הכנה לביוב מכונת כביסה?' },
      { id: 'la2', text: 'נקודות מים למכונת כביסה?' },
      { id: 'la3', text: 'שקע חשמל למכונת כביסה?' },
      { id: 'la4', text: 'וונטה/אוורור תקין?' },
      { id: 'la5', text: 'ריצוף תקין?' },
      { id: 'la6', text: 'ניקוז רצפה תקין?' },
    ],
  },
  {
    id: 'laundry_cover',
    name: 'מסתור כביסה',
    items: [
      { id: 'lc1', text: 'דלת/תריס מותקן ותקין?' },
      { id: 'lc2', text: 'מתקן ייבוש/תליה מותקן?' },
      { id: 'lc3', text: 'ניקוז רצפה תקין?' },
    ],
  },
  {
    id: 'balcony',
    name: 'מרפסת סלון',
    items: [
      { id: 'bl1', text: 'ריצוף תקין?' },
      { id: 'bl2', text: 'מעקה/חיפוי מותקן ותקין?' },
      { id: 'bl3', text: 'ניקוז רצפה תקין?' },
      { id: 'bl4', text: 'שקע חשמל מותקן?' },
      { id: 'bl5', text: 'תאורה תקינה?' },
      { id: 'bl6', text: 'נקודת גז תקינה?' },
    ],
  },
  {
    id: 'parking',
    name: 'חניה',
    items: [
      { id: 'p1', text: 'חניה מסומנת ומזוהה?' },
      { id: 'p2', text: 'שלט חניה/שער תקין?' },
    ],
  },
  {
    id: 'storage',
    name: 'מחסן',
    items: [
      { id: 's1', text: 'מחסן מזוהה ונגיש?' },
      { id: 's2', text: 'דלת מחסן תקינה?' },
      { id: 's3', text: 'תאורה מותקנת?' },
    ],
  },
];
