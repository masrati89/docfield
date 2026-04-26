import { View, Text, ScrollView } from 'react-native';
import { COLORS } from '@infield/ui';

export function PrivacyPolicy() {
  return (
    <ScrollView
      style={{ backgroundColor: COLORS.cream[50], flex: 1 }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          fontFamily: 'Rubik-Bold',
          color: COLORS.neutral[900],
          textAlign: 'right',
          marginBottom: 4,
        }}
      >
        מדיניות הפרטיות
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'Rubik-Regular',
          color: COLORS.neutral[500],
          textAlign: 'right',
          marginBottom: 24,
        }}
      >
        עדכון אחרון: דצמבר 2025
      </Text>

      <Section title="1. מידע שאנחנו אוספים">
        <Paragraph>inField אוספת את המידע הבא כדי לתמוך בשירות:</Paragraph>
        <BulletList
          items={[
            'פרטי חשבון: שם מלא, דוא״ל, מספר טלפון, פרופסיה',
            'תמונות וביאורים של ליקויים בנכסים',
            'מידע על פרויקטים, בניינים ודירות',
            'דוחות בדיקה וחתימות דיגיטליות',
            'נתוני שימוש: יומני גישה, סוג מכשיר, גרסת אפליקציה',
          ]}
        />
      </Section>

      <Section title="2. כיצד אנחנו משתמשים במידע">
        <BulletList
          items={[
            'הכנת דוחות בדיקה מקצועיים',
            'ניהול חשבון המשתמש וממשק המשתמש',
            'שיפור השירות והתאמתו לצרכיך',
            'שיתוף תכנים עם בעלי זכויות (בידיעתך המלאה)',
            'ציות לדרישות משפטיות וקומפליאנס',
          ]}
        />
      </Section>

      <Section title="3. אחסון ובטיחות נתונים">
        <Paragraph>
          המידע שלך מאוחסן בשרתי Supabase בתשתית ענן מאובטחת (PostgreSQL). אנחנו
          משתמשים בהצפנה TLS/SSL עבור כל העברות נתונים, וחתימות דיגיטליות נשמרות
          כנתונים עצמיים בלתי ניתנים לשינוי.
        </Paragraph>
        <Paragraph>
          חתיכות קוד ואחסון תמונות נשמרות בחנויות Cloud Storage מאובטחות.
        </Paragraph>
      </Section>

      <Section title="4. שיתוף נתונים עם צדדים שלישיים">
        <Paragraph>
          inField אינה מוכרת או משתפת את הנתונים שלך עם צדדים שלישיים למטרות
          שיווק. אנחנו עשויות לשתף נתונים כדי לעמוד בדרישות משפטיות בהוראת בית
          משפט או רשויות ממשלתיות.
        </Paragraph>
        <Paragraph>
          שירותים גם מעורבים: Supabase (ניהול נתונים), Expo (מחזוגי אפליקציה).
        </Paragraph>
      </Section>

      <Section title="5. זכויות ובקרה">
        <Paragraph>יש לך זכות:</Paragraph>
        <BulletList
          items={[
            'לגשת לכל הנתונים האישיים שלך המאוחסנים אצלנו',
            'לתקן or עדכן נתונים שגויים',
            'למחוק את חשבונך וכל הנתונים הקשורים אליו',
            'לשלוח בקשה בכתב ל: privacy@infield.app',
          ]}
        />
      </Section>

      <Section title="6. עוגיות וטכנולוגיות מעקב">
        <Paragraph>
          אפליקציית inField אינה משתמשת בעוגיות מסורתיות. עם זאת, אנחנו עשויות
          להשתמש בתכנולוגיות מעקב מינימליות למטרות אנליטיקה (דוחות שימוש, קריסות
          אפליקציה).
        </Paragraph>
      </Section>

      <Section title="7. שינויים למדיניות זו">
        <Paragraph>
          אנחנו עשויות לעדכן מדיניות זו מעת לעת. נודיע לך על שינויים משמעותיים
          באמצעות דוא״ל או דרך האפליקציה.
        </Paragraph>
      </Section>

      <Section title="8. צור קשר">
        <Paragraph>
          אם יש לך שאלות בנוגע למדיניות זו, אנא צור קשר בכתב:
        </Paragraph>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Rubik-Regular',
            color: COLORS.primary[500],
            textAlign: 'right',
            marginTop: 12,
          }}
        >
          privacy@infield.app
        </Text>
      </Section>
    </ScrollView>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          fontFamily: 'Rubik-Medium',
          color: COLORS.neutral[800],
          textAlign: 'right',
          marginBottom: 10,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

interface ParagraphProps {
  children: string;
}

function Paragraph({ children }: ParagraphProps) {
  return (
    <Text
      style={{
        fontSize: 14,
        fontFamily: 'Rubik-Regular',
        color: COLORS.neutral[700],
        lineHeight: 22,
        textAlign: 'right',
        marginBottom: 12,
      }}
    >
      {children}
    </Text>
  );
}

interface BulletListProps {
  items: string[];
}

function BulletList({ items }: BulletListProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      {items.map((item, i) => (
        <View
          key={i}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'flex-start',
            gap: 10,
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Rubik-Regular',
              color: COLORS.primary[500],
              marginTop: 3,
            }}
          >
            •
          </Text>
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              fontFamily: 'Rubik-Regular',
              color: COLORS.neutral[700],
              lineHeight: 22,
              textAlign: 'right',
            }}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}
