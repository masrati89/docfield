import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { COLORS, SHADOWS } from '@infield/ui';
import { PressableScale } from '@/components/ui';

// --- FAQ Data ---

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  items: FaqItem[];
}

const FAQ_DATA: FaqCategory[] = [
  {
    title: 'התחלת עבודה',
    icon: 'play-circle',
    items: [
      {
        question: 'איך יוצרים דוח חדש?',
        answer:
          'לחצו על כפתור "בדיקה חדשה" בדף הבית. האשף ידריך אותכם שלב אחר שלב: בחירת סוג דוח, בחירת/יצירת פרויקט, בניינים, דירות ופרטי הלקוח.',
      },
      {
        question: 'מה ההבדל בין בדק בית לפרוטוקול מסירה?',
        answer:
          'בדק בית הוא דוח מקצועי מטעם הקונה הכולל כתב כמויות, תקנים וסיכום מנהלים. פרוטוקול מסירה הוא מסמך רשמי מטעם הקבלן המתעד את מצב הדירה בזמן המסירה, כולל צ׳קליסט.',
      },
      {
        question: 'איך מוסיפים פרויקט חדש?',
        answer:
          'בעמוד הפרויקטים לחצו על כפתור ה-+ (פלוס). מלאו שם פרויקט, כתובת ועיר. אפשר גם ליצור פרויקט חדש ישירות מתוך אשף הבדיקה החדשה.',
      },
    ],
  },
  {
    title: 'ממצאים ותמונות',
    icon: 'camera',
    items: [
      {
        question: 'איך מוסיפים ממצא?',
        answer:
          'מתוך דף הדוח, לחצו על "הוסף ממצא". תוכלו לבחור קטגוריה, לתאר את הממצא, לצלם תמונות ולהוסיף הערות. ניתן גם לבחור ממצא מהמאגר.',
      },
      {
        question: 'איך משתמשים במאגר הממצאים?',
        answer:
          'מאגר הממצאים מכיל 338 ממצאים מובנים + ממצאים שהוספתם בעצמכם. בעת הוספת ממצא, הציעות אוטומטיות מופיעות. ניתן גם לגלוש במאגר מדף הבית > מאגר ממצאים.',
      },
      {
        question: 'איך מוסיפים תמונה עם סימונים?',
        answer:
          'לאחר צילום או בחירת תמונה, נפתח עורך הסימונים. תוכלו להוסיף חיצים, עיגולים וטקסט לסמן את הליקוי בדיוק.',
      },
      {
        question: 'איך שומרים ממצא למאגר האישי?',
        answer:
          'בעת הוספת ממצא, אם הטקסט לא קיים במאגר, יופיע כפתור "הוסף למאגר". לחצו עליו כדי לשמור את הממצא לשימוש עתידי.',
      },
    ],
  },
  {
    title: 'דוחות ו-PDF',
    icon: 'file-text',
    items: [
      {
        question: 'איך מפיקים PDF?',
        answer:
          'מדף הדוח, לחצו על כפתור "הפקת PDF" בסרגל הפעולות. המערכת תיצור PDF מקצועי הכולל את כל הממצאים, תמונות, חתימות וצ׳קליסט.',
      },
      {
        question: 'איך שולחים דוח ללקוח?',
        answer:
          'לאחר הפקת ה-PDF, תוכלו לשתף אותו ישירות דרך WhatsApp, אימייל או כל אפליקציה אחרת בטלפון.',
      },
      {
        question: 'מה קורה עם דוח שסטטוס שלו "הושלם"?',
        answer:
          'דוח שהושלם הוא מסמך משפטי. כדי לערוך אותו מחדש נדרש אישור כפול. מומלץ להשלים דוח רק כשסיימתם את כל הממצאים.',
      },
    ],
  },
  {
    title: 'תבניות וצ׳קליסט',
    icon: 'clipboard',
    items: [
      {
        question: 'מה זה תבנית צ׳קליסט?',
        answer:
          'תבנית צ׳קליסט מגדירה את רשימת הבדיקות לכל חדר/אזור בדירה. יש תבניות מובנות למסירה ולבדק בית, ואפשר ליצור תבניות מותאמות אישית.',
      },
      {
        question: 'איך יוצרים תבנית מותאמת אישית?',
        answer:
          'מדף הבית > תבניות, או מהגדרות > דוח > ניהול תבניות. שם תוכלו ליצור תבנית חדשה, לשכפל תבנית קיימת, ולערוך קטגוריות ופריטים.',
      },
      {
        question: 'איך קובעים תבנית ברירת מחדל?',
        answer:
          'בניהול התבניות, לחצו על "ברירת מחדל" בכרטיס התבנית הרצויה. התבנית תיבחר אוטומטית בפתיחת דוח חדש מאותו סוג.',
      },
    ],
  },
  {
    title: 'הגדרות וחשבון',
    icon: 'settings',
    items: [
      {
        question: 'איך מעדכנים חתימה דיגיטלית?',
        answer:
          'בהגדרות > מפקח, תמצאו את אזור החתימה והחותמת. לחצו על החתימה כדי לצייר חתימה חדשה. החתימה תופיע אוטומטית בכל הדוחות שלכם.',
      },
      {
        question: 'איך מוסיפים לוגו?',
        answer:
          'בהגדרות > מפקח, תוכלו להעלות לוגו של החברה שיופיע בכל הדוחות המופקים.',
      },
      {
        question: 'איך משנים סיסמה?',
        answer:
          'בהגדרות > כללי > לחצו על "שנה סיסמה". תצטרכו להזין את הסיסמה הנוכחית ואת הסיסמה החדשה.',
      },
    ],
  },
  {
    title: 'מסירה סבב 2',
    icon: 'refresh-cw',
    items: [
      {
        question: 'מה זה מסירה סבב 2?',
        answer:
          'כשדוח מסירה הושלם עם ממצאים פתוחים, ניתן ליצור דוח מסירה נוסף לאותה דירה. המערכת מזהה אוטומטית שזה סבב 2 ומעתיקה את הממצאים הקודמים.',
      },
      {
        question: 'איך מסמנים ממצא כתוקן?',
        answer:
          'בדוח סבב 2, ליד כל ממצא שהועתק מופיע תגית סטטוס. לחצו עליה כדי לסמן "תוקן" או "נותר פתוח". ממצאים חדשים מסומנים אוטומטית.',
      },
    ],
  },
];

// --- Onboarding Slides ---

interface OnboardingSlide {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
  color: string;
  bg: string;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    icon: 'home',
    title: 'ברוכים הבאים ל-inField',
    description:
      'אפליקציה מקצועית לניהול בדיקות בנייה — בדק בית ופרוטוקולי מסירה. הכל במקום אחד, ישירות מהשטח.',
    color: COLORS.primary[600],
    bg: COLORS.primary[50],
  },
  {
    icon: 'plus-circle',
    title: 'יצירת בדיקה חדשה',
    description:
      'לחצו על "בדיקה חדשה" בדף הבית. האשף ידריך אותכם: בחרו סוג דוח, פרויקט, בניין, דירה ופרטי לקוח. תוך דקה אתם בפנים.',
    color: COLORS.primary[600],
    bg: COLORS.primary[50],
  },
  {
    icon: 'edit-3',
    title: 'ממצאים ותמונות',
    description:
      'הוסיפו ממצאים מהמאגר המובנה או כתבו חדשים. צלמו, סמנו על התמונה ותעדו הכל. הכל נשמר אוטומטית.',
    color: COLORS.gold[600],
    bg: COLORS.gold[100],
  },
  {
    icon: 'send',
    title: 'הפקה ושליחה',
    description:
      'סיימתם? הפיקו PDF מקצועי בלחיצה ושלחו ישירות ללקוח. הדוח כולל חתימות, תמונות, צ׳קליסט וסיכום מלא.',
    color: COLORS.primary[600],
    bg: COLORS.primary[50],
  },
];

// --- FAQ Accordion Item ---

function FaqAccordion({ item }: { item: FaqItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const rotation = useSharedValue(0);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const toggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = !isOpen;
    setIsOpen(next);
    rotation.value = withTiming(next ? 180 : 0, { duration: 250 });
  };

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cream[100],
      }}
    >
      <PressableScale
        onPress={toggle}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingVertical: 14,
          gap: 10,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 14,
            fontFamily: 'Rubik-Medium',
            color: COLORS.neutral[700],
            textAlign: 'right',
            lineHeight: 20,
          }}
        >
          {item.question}
        </Text>
        <Animated.View style={chevronStyle}>
          <Feather name="chevron-down" size={18} color={COLORS.neutral[400]} />
        </Animated.View>
      </PressableScale>
      {isOpen && (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutUp.duration(200)}
          style={{ paddingBottom: 14 }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[600],
              textAlign: 'right',
              lineHeight: 20,
            }}
          >
            {item.answer}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

// --- FAQ Category Section ---

function FaqCategorySection({
  category,
  delay,
}: {
  category: FaqCategory;
  delay: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rotation = useSharedValue(0);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const toggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = !isOpen;
    setIsOpen(next);
    rotation.value = withTiming(next ? 180 : 0, { duration: 250 });
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(300)}
      style={{
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: COLORS.cream[200],
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <PressableScale
        onPress={toggle}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          padding: 14,
          gap: 10,
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
          <Feather name={category.icon} size={16} color={COLORS.primary[600]} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Rubik-SemiBold',
              color: COLORS.neutral[700],
              textAlign: 'right',
            }}
          >
            {category.title}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[400],
              textAlign: 'right',
            }}
          >
            {category.items.length} שאלות
          </Text>
        </View>
        <Animated.View style={chevronStyle}>
          <Feather name="chevron-down" size={20} color={COLORS.neutral[400]} />
        </Animated.View>
      </PressableScale>

      {isOpen && (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutUp.duration(200)}
          style={{ paddingHorizontal: 14, paddingBottom: 4 }}
        >
          {category.items.map((item) => (
            <FaqAccordion key={item.question} item={item} />
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
}

// --- Onboarding Modal ---

function OnboardingModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = ONBOARDING_SLIDES[currentSlide];
  const isLast = currentSlide === ONBOARDING_SLIDES.length - 1;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isLast) {
      onClose();
      setCurrentSlide(0);
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 360,
            backgroundColor: COLORS.cream[50],
            borderRadius: 20,
            padding: 28,
            alignItems: 'center',
            ...SHADOWS.lg,
          }}
        >
          {/* Skip button */}
          <Pressable
            onPress={() => {
              onClose();
              setCurrentSlide(0);
            }}
            style={{ position: 'absolute', top: 14, left: 14 }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Rubik-Medium',
                color: COLORS.neutral[400],
              }}
            >
              דלג
            </Text>
          </Pressable>

          {/* Icon */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              backgroundColor: slide.bg,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 8,
            }}
          >
            <Feather name={slide.icon} size={36} color={slide.color} />
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Rubik-Bold',
              color: COLORS.neutral[800],
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            {slide.title}
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[600],
              textAlign: 'center',
              lineHeight: 22,
              marginTop: 10,
              paddingHorizontal: 4,
            }}
          >
            {slide.description}
          </Text>

          {/* Dots */}
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              marginTop: 24,
            }}
          >
            {ONBOARDING_SLIDES.map((_, index) => (
              <View
                key={index}
                style={{
                  width: index === currentSlide ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    index === currentSlide
                      ? COLORS.primary[500]
                      : COLORS.cream[300],
                }}
              />
            ))}
          </View>

          {/* Navigation buttons */}
          <View
            style={{
              flexDirection: 'row-reverse',
              gap: 10,
              marginTop: 24,
              width: '100%',
            }}
          >
            <Pressable
              onPress={handleNext}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 12,
                backgroundColor: COLORS.primary[500],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Rubik-SemiBold',
                  color: COLORS.white,
                }}
              >
                {isLast ? 'סיום' : 'הבא'}
              </Text>
            </Pressable>
            {currentSlide > 0 && (
              <Pressable
                onPress={handleBack}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: COLORS.cream[300],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather
                  name="arrow-right"
                  size={18}
                  color={COLORS.neutral[600]}
                />
              </Pressable>
            )}
          </View>

          {/* Step counter */}
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[400],
              marginTop: 10,
            }}
          >
            {currentSlide + 1} מתוך {ONBOARDING_SLIDES.length}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

// --- Screen ---

export default function HelpScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const filteredCategories = FAQ_DATA.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        !searchQuery.trim() ||
        item.question.includes(searchQuery) ||
        item.answer.includes(searchQuery)
    ),
  })).filter((category) => category.items.length > 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream[50] }}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8,
          gap: 12,
        }}
      >
        <PressableScale onPress={() => router.back()}>
          <Feather name="arrow-right" size={22} color={COLORS.neutral[700]} />
        </PressableScale>
        <Text
          style={{
            fontSize: 22,
            fontFamily: 'Rubik-Bold',
            color: COLORS.neutral[800],
            flex: 1,
            textAlign: 'right',
          }}
        >
          עזרה
        </Text>
        <Feather name="help-circle" size={22} color={COLORS.neutral[500]} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 88, gap: 12 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Onboarding replay card */}
        <Animated.View entering={FadeInUp.delay(0).duration(300)}>
          <PressableScale
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowOnboarding(true);
            }}
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              backgroundColor: COLORS.primary[50],
              borderWidth: 1,
              borderColor: COLORS.primary[200],
              borderRadius: 12,
              padding: 16,
              gap: 12,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: COLORS.primary[100],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather
                name="play-circle"
                size={22}
                color={COLORS.primary[600]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Rubik-SemiBold',
                  color: COLORS.primary[700],
                  textAlign: 'right',
                }}
              >
                הוראות הפעלה
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Rubik-Regular',
                  color: COLORS.primary[600],
                  textAlign: 'right',
                  marginTop: 2,
                }}
              >
                הדרכה מהירה לשימוש באפליקציה
              </Text>
            </View>
            <Feather
              name="chevron-left"
              size={20}
              color={COLORS.primary[400]}
            />
          </PressableScale>
        </Animated.View>

        {/* Search */}
        <Animated.View
          entering={FadeInUp.delay(60).duration(300)}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            borderRadius: 12,
            paddingHorizontal: 12,
            gap: 8,
          }}
        >
          <Feather name="search" size={18} color={COLORS.neutral[400]} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="חיפוש בשאלות נפוצות..."
            placeholderTextColor={COLORS.neutral[400]}
            style={{
              flex: 1,
              height: 44,
              fontSize: 14,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[700],
              textAlign: 'right',
            }}
          />
          {searchQuery.length > 0 && (
            <PressableScale onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color={COLORS.neutral[400]} />
            </PressableScale>
          )}
        </Animated.View>

        {/* Section title */}
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'Rubik-Bold',
            color: COLORS.neutral[700],
            textAlign: 'right',
            marginTop: 4,
          }}
        >
          שאלות נפוצות
        </Text>

        {/* FAQ Categories */}
        {filteredCategories.map((category, index) => (
          <FaqCategorySection
            key={category.title}
            category={category}
            delay={120 + index * 60}
          />
        ))}

        {/* No results */}
        {filteredCategories.length === 0 && searchQuery.trim() && (
          <Animated.View
            entering={FadeInUp.duration(300)}
            style={{
              alignItems: 'center',
              paddingVertical: 40,
            }}
          >
            <Feather name="search" size={48} color={COLORS.neutral[300]} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Rubik-Medium',
                color: COLORS.neutral[500],
                textAlign: 'center',
                marginTop: 12,
              }}
            >
              לא נמצאו תוצאות
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
              נסו לחפש במילים אחרות
            </Text>
          </Animated.View>
        )}

        {/* Contact/support */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(300)}
          style={{
            backgroundColor: COLORS.cream[100],
            borderWidth: 1,
            borderColor: COLORS.cream[200],
            borderRadius: 12,
            padding: 20,
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <Feather
            name="message-circle"
            size={32}
            color={COLORS.neutral[400]}
          />
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Rubik-Medium',
              color: COLORS.neutral[600],
              textAlign: 'center',
              marginTop: 10,
            }}
          >
            לא מצאתם תשובה?
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[500],
              textAlign: 'center',
              marginTop: 4,
              lineHeight: 20,
            }}
          >
            צרו קשר עם התמיכה בכתובת{'\n'}support@infield.co.il
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Onboarding modal */}
      <OnboardingModal
        visible={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </SafeAreaView>
  );
}
