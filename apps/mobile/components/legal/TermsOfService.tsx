import { View, Text, ScrollView } from 'react-native';
import { COLORS } from '@infield/ui';

export function TermsOfService() {
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
        תנאי השימוש
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

      <Section title="1. קבלת התנאים">
        <Paragraph>
          על ידי הורדת, התקנה או שימוש באפליקציית inField, אתה מסכים לתנאים אלה.
          אם אינך מסכים לתנאים אלה, אנא הפסק להשתמש באפליקציה.
        </Paragraph>
      </Section>

      <Section title="2. תיאור השירות">
        <Paragraph>
          inField היא אפליקציה לניהול דוחות בדיקה וביקורת של נכסים. השירות
          מאפשר:
        </Paragraph>
        <BulletList
          items={[
            'יצירה וניהול דוחות בדיקה (בדק בית)',
            'יצירה וניהול דוחות מסירה של דירות',
            'צילום וביאור ליקויים',
            'יצירת חתימות דיגיטליות',
            'ייצוא דוחות כקבצי PDF',
          ]}
        />
      </Section>

      <Section title="3. תנאי השימוש">
        <Paragraph>
          הנך מסכים להשתמש ב- inField רק במטרות חוקיות ובכיוון אתני. הנך לא
          רשאי:
        </Paragraph>
        <BulletList
          items={[
            'להשתמש באפליקציה לכל מטרה בלתי חוקית או לא חוקית',
            'לשתף כניסה או סיסמה עם אחרים',
            'לנסות להעביר מידע שאינך זכאי לגישה אליו',
            'להוציא דוחות שאתה לא בנק או בהשגחת משגח',
            'להשתמש בתוכן לשיתוף זדוני או הונאה',
          ]}
        />
      </Section>

      <Section title="4. רישום חשבון ואחריות">
        <Paragraph>
          אתה אחראי לשמירה על כל פרטי החשבון שלך בסודיות. אתה מסכים:
        </Paragraph>
        <BulletList
          items={[
            'לספק מידע דוק וחוקי בעת הרישום',
            'לעדכן את המידע אם הוא משתנה',
            'לשמור על סיסמה חזקה וסודית',
            'להודיע אלינו מיד על כל שימוש לא מורשה בחשבונך',
          ]}
        />
      </Section>

      <Section title="5. דוחות וחתימות">
        <Paragraph>
          דוחות ב- inField נחשבים למסמכים עתידים. אתה הנך האחראי:
        </Paragraph>
        <BulletList
          items={[
            'לדיוק ושלמות של המידע בדוחות',
            'לעמידה בדינים וקודים בנייה חלים',
            'לשמירה על העתקות של דוחות בהם אתה משמש',
            'לאימות שחתימות ותמונות מציגות מצב אמיתי',
          ]}
        />
      </Section>

      <Section title="6. חידוש מנויים ודמי שימוש">
        <Paragraph>inField מוצעת בחבילות מנוי שונות:</Paragraph>
        <BulletList
          items={[
            'חינם: 3 דוחות לכל משתמש',
            'מנוי שנתי: ₪99 / ₪199 / ₪349 (בהתאם לתכנית)',
            'דמי המנוי מחודשים אוטומטית בתחילת כל תקופת תיקייה',
            'ניתן לבטל את המנוי בכל עת דרך הגדרות החשבון',
          ]}
        />
      </Section>

      <Section title="7. הגבלת אחריות">
        <Paragraph>
          inField מסופקת בתנאי "AS IS" ללא כל אחריות או התחייבות. אנחנו לא
          אחראים על:
        </Paragraph>
        <BulletList
          items={[
            'הפסדים כספיים כתוצאה משימוש באפליקציה',
            'אובדן נתונים או קבצים (אם כי אנחנו משמרים גיבויים)',
            'שגיאות או פגמים בתוכן שנוצר על ידי המשתמש',
            'אי-זמינות זמנית של השירות או תקלות טכניות',
          ]}
        />
      </Section>

      <Section title="8. זכויות יוצרים וקניין רוחני">
        <Paragraph>
          כל התוכן של inField (קוד, עיצוב, נושא, תרבות) הוא בעלות inField. אתה
          מעניק לנו זכויות להשתמש בדוחות שנוצרו על ידיך בתוך השירות.
        </Paragraph>
      </Section>

      <Section title="9. ביטול או הרעם">
        <Paragraph>
          אנחנו שומרים לנו את הזכות לסיום זכותך להשתמש ב- inField אם הנך מפר
          תנאים אלה או מנהל עצמך בדרך שהינה מסוכנת או בלתי אתית.
        </Paragraph>
      </Section>

      <Section title="10. שינויים בתנאים">
        <Paragraph>
          אנחנו עשויות לעדכן תנאים אלה מעת לעת. עדכונים משמעותיים יודעו לך דרך
          דוא״ל או הודעה באפליקציה. השימוש המתמשך מהווה קבלה של התנאים
          המעודכנים.
        </Paragraph>
      </Section>

      <Section title="11. עד כדי כדי">
        <Paragraph>
          אתה מסכים שכל הסכומים או תביעות הקשורות לשימוש ב- inField יהיו כפופים
          לדיני מדינת ישראל ולתחוקה הבלעדית של בתי משפט בתל אביב.
        </Paragraph>
      </Section>

      <Section title="12. צור קשר">
        <Paragraph>אם יש לך שאלות בנוגע לתנאים אלה, אנא צור קשר:</Paragraph>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Rubik-Regular',
            color: COLORS.primary[500],
            textAlign: 'right',
            marginTop: 12,
          }}
        >
          support@infield.app
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
