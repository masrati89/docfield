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
        בתוקף מאפריל 2026
      </Text>

      <Section title="1. מבוא">
        <Paragraph>
          מדיניות פרטיות זו מתארת כיצד inField בע״מ (להלן:{' '}
          <Text style={{ fontFamily: 'Rubik-Medium' }}>inField</Text>) אוספת,
          משתמשת, שומרת ומגנה על נתונים אישיים של משתמשים. מדיניות זו תחייבת
          בחוקי מדינת ישראל, בפרט חוק הגנת הפרטיות, תשנ״א-1981 ותיקונו ה-13
          (בתוקף אוגוסט 2025).
        </Paragraph>
      </Section>

      <Section title="2. מידע שאנחנו אוספים">
        <Paragraph>
          inField אוספת את המידע הבא לאחד משני סוגים:{' '}
          <Text style={{ fontFamily: 'Rubik-Medium' }}>חובה לשירות</Text> (ללא
          זה לא תוכל להשתמש באפליקציה) או{' '}
          <Text style={{ fontFamily: 'Rubik-Medium' }}>רשות</Text> (אתה יכול
          לסרב):
        </Paragraph>
        <SubSection title="פרטי חשבון (חובה):">
          <BulletList
            items={[
              'שם מלא ודוא״ל — נדרשים לאימות חשבון ותקשורת',
              'סיסמה — מוצפנת בצד שלנו, לעולם לא נושמרת בטקסט פשוט',
            ]}
          />
        </SubSection>
        <SubSection title="פרטי פרופיל מקצועי (רשות):">
          <BulletList
            items={[
              'מספר טלפון, מקצוע, שם חברה — משמשים ללימוד פרופיל המפקח וחתימה דיגיטלית',
            ]}
          />
        </SubSection>
        <SubSection title="מידע על נכסים (חובה לפונקציה):">
          <BulletList
            items={[
              'כתובת, שם בניין, מספר דירה — נשמרים כ-snapshot כדי שדוח חתום יתאים לנכס שנבדק',
            ]}
          />
        </SubSection>
        <SubSection title="תוכן דוחות (חובה):">
          <BulletList
            items={[
              'תמונות ליקויים — יכולות להכיל מידע אישי של דיירים; לעולם לא נשתפן עם צדדים שלישיים',
              'ביאורים טקסטיים וערכונים — נשמרים בתוך הדוח',
              'חתימה דיגיטלית — בלתי ניתנת לשינוי; יצירת דוח משפטי מחייב',
            ]}
          />
        </SubSection>
        <SubSection title="נתוני שימוש (רשות, ללא זיהוי אישי):">
          <BulletList
            items={[
              'מדד ביצועים — מספר דוחות, מדי לדוח, מהלך גדול',
              'נתוני מכשיר — סוג הטלפון (iOS/Android), גרסת אפליקציה',
              'טרנדים כלליים — שימוש (מתוך כזה התנהגות כללית, לא עקוב אישי)',
            ]}
          />
        </SubSection>
      </Section>

      <Section title="3. מטרת העיבוד ובסיס משפטי">
        <Paragraph>
          אנחנו עובדים נתונים להשלמת ההסכם (עיבוד חובה כדי לתת שירות): הכנת
          דוחות בדיקה, ניהול חשבון, אחסון דוחות חתומים.
        </Paragraph>
        <Paragraph>
          בסיס המשפטי שלנו הוא{' '}
          <Text style={{ fontFamily: 'Rubik-Medium' }}>הסכמת המשתמש</Text> ו
          <Text style={{ fontFamily: 'Rubik-Medium' }}>ביצוע חוזה</Text> (חוק
          הגנת הפרטיות, סעיף 5). אתה יכול לשלול עיבוד למטרות שיווק בכל עת.
        </Paragraph>
      </Section>

      <Section title="4. שיתוף מידע עם ספקים וצדדים שלישיים">
        <Paragraph>
          inField אינה מוכרת את הנתונים שלך ולא משתפת אותם למטרות שיווק. עם זאת,
          אנחנו משתפים נתונים עם הספקים הבאים (תת-מעבדים בחוק הגנת הפרטיות):
        </Paragraph>
        <BulletList
          items={[
            'Supabase — אחסון נתונים (PostgreSQL) בשרתים בארה״ב ובאיחוד האירופי',
            'Apple ו-Google — אימות OAuth (אם בחרת בחיבור חברתי), תשלום דרך App Store/Play Store',
            'Sentry — דיווח שגיאות (אם מופעל) — קבלת מידע אודות קריסות ללא שמות משתמשים',
            'Expo — בנייה והפצת עדכוני אפליקציה',
          ]}
        />
        <Paragraph>
          לבקשת רשות: אנחנו עשויות להגיש נתונים לרשויות משפטיות, בית משפט או
          מחלקה ממשלתית כנדרש בחוק.
        </Paragraph>
      </Section>

      <Section title="5. העברה בין-לאומית של נתונים">
        <Paragraph>
          Supabase מחזיק שרתים בארה״ב ובאיחוד האירופי. הנתונים שלך עשויים לחצות
          גבולות מדינה. אנחנו שומרים על הגנה שקולה לסטנדרט הישראלי דרך:
        </Paragraph>
        <BulletList
          items={[
            'הצפנה TLS/AES בעת העברה',
            'הצפנה במנוחה בשרתים',
            'הסכמים בין-לאומיים (Standard Contractual Clauses)',
          ]}
        />
      </Section>

      <Section title="6. שמירת נתונים — כמה זמן אנחנו שומרים אותם">
        <BulletList
          items={[
            'חשבון פעיל — כל הנתונים שמורים בזמן שאתה רשום',
            'לאחר מחיקת חשבון — 30 יום, אחר כך מחקו לצמיתות',
            'דוחות משפטיים (תיעודי בדיקה) — 7 שנים (חוק המסמכים העסקיים)',
            'גיבויים — מחוקים עד 90 יום לאחר בקשת מחיקה',
            'יומני שגיאות (Sentry) — 90 יום, לאחר זה: מחיקה אוטומטית',
          ]}
        />
      </Section>

      <Section title="7. זכויות המשתמש (חוק הגנת הפרטיות, תיקון 13)">
        <Paragraph>
          יש לך את הזכויות הבאות. לבקשה, שלח אימייל לכתובת privacy@infield.app
          עם בקשתך, ונענה עד 30 יום:
        </Paragraph>
        <BulletList
          items={[
            'גישה — תיקבל עותק של כל הנתונים האישיים שלך שיש לנו',
            'תיקון — תוכל לבקש לתקן נתונים שגויים',
            'מחיקה — תוכל למחוק את חשבונך וכל הנתונים הקשורים (דרך ההגדרות באפליקציה)',
            'התנגדות — תוכל להתנגד לעיבוד למטרות שיווק או אנליטיקה',
            'הגבלת עיבוד — תוכל לבקש להגביל את השימוש בנתונים שלך',
            'ניידות נתונים — תוכל לקבל עותק של הנתונים שלך בפורמט מיוחד',
            'שלילת הסכמה — תוכל לשלול הסכמה שנתת מכל עת (לא יעפיל לעבר שקדם)',
            'ערעור — אם אתה חושב שנפגעו זכויותיך, תוכל להגיש תלונה לרשות להגנת הפרטיות (ppa.gov.il)',
          ]}
        />
      </Section>

      <Section title="8. אבטחת נתונים">
        <Paragraph>
          אנחנו משתמשים בצעדים טכניים וארגוניים כדי להגן על הנתונים שלך מפני
          גישה בלתי מורשית, הצפנה או איבוד:
        </Paragraph>
        <BulletList
          items={[
            'הצפנה TLS/SSL — כל התקשורת עם השרתים מוצפנת',
            'הצפנה בשרתים — הנתונים מוצפנים במנוחה',
            'RLS (Row-Level Security) — רק אתה רואה את הנתונים שלך',
            'דיווח תקלות — אם יש הפרת נתונים, נדווח לרשות להגנת הפרטיות תוך הזמן הקבוע בחוק',
          ]}
        />
        <Paragraph>
          למרות זאת,{' '}
          <Text style={{ fontFamily: 'Rubik-Medium' }}>אין אבטחה מושלמת</Text>.
          אם אתה חושב שהנתונים שלך נפגעו, צור קשר בדחיפות ל-
          privacy@infield.app.
        </Paragraph>
      </Section>

      <Section title="9. משתמשים קטינים">
        <Paragraph>
          שירות זה לא מיועד לאנשים מתחת לגיל 18. אם אתה מתחת לגיל זה, אנא בקש
          מהורים או אפוטרופוס משפטי להשתמש.
        </Paragraph>
      </Section>

      <Section title="10. עוגיות ומעקב">
        <Paragraph>
          אפליקציית inField{' '}
          <Text style={{ fontFamily: 'Rubik-Medium' }}>
            אינה משתמשת בעוגיות
          </Text>{' '}
          מסורתיות (אלה קובצים שמאוחסנים בדפדפן). עם זאת:
        </Paragraph>
        <BulletList
          items={[
            'Sentry (דיווח שגיאות) — אם מופעל, קולט מידע על קריסות ללא זיהוי אישי',
            'טוקן ההתחברות שלך — מאוחסן בחנות מאובטחת (expo-secure-store), לא בעוגיה',
          ]}
        />
        <Paragraph>
          אנחנו לא משתמשים בעקוב פרסומי (ad tracking) או שיווק חוזר
          (retargeting).
        </Paragraph>
      </Section>

      <Section title="11. עדכונים למדיניות">
        <Paragraph>
          אנחנו עשויות לעדכן מדיניות זו מעת לעת. שינויים משמעותיים יוכרזו דרך
          האפליקציה או דוא״ל לפחות 30 יום לפני כניסתם לתוקף. השימוש ההמשך
          באפליקציה לאחר ההודעה משמעותו הסכמתך לתנאים החדשים.
        </Paragraph>
      </Section>

      <Section title="12. צור קשר">
        <Paragraph>שאלות, בקשות, או דוחות בנוגע למדיניות הפרטיות?</Paragraph>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Rubik-Medium',
            color: COLORS.primary[500],
            textAlign: 'right',
            marginTop: 12,
            marginBottom: 12,
          }}
        >
          privacy@infield.app
        </Text>
        <Paragraph>או רשות להגנת הפרטיות:</Paragraph>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Rubik-Regular',
            color: COLORS.neutral[700],
            textAlign: 'right',
            marginTop: 12,
          }}
        >
          ppa.gov.il
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

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
}

function SubSection({ title, children }: SubSectionProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '500',
          fontFamily: 'Rubik-Medium',
          color: COLORS.neutral[800],
          textAlign: 'right',
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

interface ParagraphProps {
  children: React.ReactNode;
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
