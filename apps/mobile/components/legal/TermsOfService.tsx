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
        בתוקף מאפריל 2026
      </Text>

      <Section title="1. קבלת התנאים">
        <Paragraph>
          על ידי הורדת, התקנה או שימוש באפליקציית inField, אתה מצהיר שאתה בן/בת
          18 לפחות ומסכים לתנאים אלה באופן מלא וללא הסתייגויות. אם אינך מסכים,
          אנא הפסק להשתמש מיד.
        </Paragraph>
      </Section>

      <Section title="2. זיהוי בעל השירות">
        <Paragraph>
          <Text style={{ fontFamily: 'Rubik-Medium' }}>שם:</Text> inField בע״מ
        </Paragraph>
        <Paragraph>
          <Text style={{ fontFamily: 'Rubik-Medium' }}>כתובת:</Text> [בעדכון כדי
          להגיש למשרדי עיר; for now: support@infield.app]
        </Paragraph>
        <Paragraph>
          <Text style={{ fontFamily: 'Rubik-Medium' }}>דוא״ל:</Text>{' '}
          support@infield.app
        </Paragraph>
        <Paragraph>בעדותך בשירות זה הנך חוזה ישירות עם inField בע״מ.</Paragraph>
      </Section>

      <Section title="3. תיאור השירות">
        <Paragraph>
          inField היא אפליקציה ניידת המאפשרת ליזמים, בודקי בנייה ומפקחים ליצור
          דוחות בדיקה וביקורת של נכסים. המטרה היא תיעוד מנומק וחתום של
          תיעודים/ליקויים לצרכי בדק בית ודוחות מסירה.
        </Paragraph>
      </Section>

      <Section title="4. תנאי השימוש — התחייבויות משתמש">
        <Paragraph>
          הנך מתחייב להשתמש ב- inField בצורה חוקית, אתית ומקצועית בלבד:
        </Paragraph>
        <BulletList
          items={[
            'רק למטרות משפטיות ותיעוד בנייה — לא לשימוש בלתי חוקי',
            'לא לשתף סיסמה, כניסה או גישה עם אחרים',
            'לא לנסות להיכנס למידע או מערכות לא מורשות',
            'לא לפרסם מידע שקרי, מסולף או מטעה',
            'לא לעקוף או להשתמש בדוחות למטרות זדוניות',
          ]}
        />
      </Section>

      <Section title="5. אחריות המשתמש המקצועית — CRITICAL">
        <Paragraph>
          <Text style={{ fontFamily: 'Rubik-Medium' }}>
            inField היא כלי עזר בלבד
          </Text>
          . דוחות שאתה יוצר עשויים להשמש כמסמכים משפטיים או הנדסיים.{' '}
          <Text style={{ fontFamily: 'Rubik-Medium' }}>
            אתה לבדך אחראי לחלוטין
          </Text>
          :
        </Paragraph>
        <BulletList
          items={[
            'לדיוק, שלמות וחוקיות של כל המידע בדוח',
            'לעמידה בדינים וקודים בנייה חלים (בנייה, בטיחות וכו׳)',
            'שחתימה דיגיטלית בדוח = הצהרה מלאה שכל המידע נכון וצופי',
            'שתמונות מציגות מצב אמיתי — לא מתוך ערכונים או הטייה',
            'לשימור במחוזות מתאימים לעמדת החוק',
          ]}
        />
        <Paragraph>
          inField אינה משפטית, הנדסית או ייעוץ מקצועי. אם יש ספק, עיין בנציג
          משפטי או מקצועי מוסמך.
        </Paragraph>
      </Section>

      <Section title="6. רישום חשבון ואחריות">
        <Paragraph>אתה אחראי לשמירה על כל פרטי החשבון שלך בסודיות:</Paragraph>
        <BulletList
          items={[
            'לספק מידע נכון, דוק ומלא בעת הרישום',
            'לעדכן מידע אם הוא משתנה (כתובת, מקצוע וכו׳)',
            'לשמור על סיסמה חזקה וסודית',
            'להודיע לנו מייד על כל גישה לא מורשית',
          ]}
        />
      </Section>

      <Section title="7. מנויים ותשלומים">
        <Paragraph>
          <Text style={{ fontFamily: 'Rubik-Medium' }}>תכניות זמינות:</Text>
        </Paragraph>
        <BulletList
          items={[
            'חינמית: 3 דוחות לחודש',
            'מקצועית: ₪99 לשנה (דוחות בלתי מוגבלים)',
            'ממתיני עסקי: ₪199 לשנה (+ תכניות בהתאמה אישית)',
            'ארגון: ₪349 לשנה (+ ניהול צוות)',
          ]}
        />
        <Paragraph>
          <Text style={{ fontFamily: 'Rubik-Medium' }}>חידוש אוטומטי:</Text> דמי
          המנוי מחודשים אוטומטית בתחילת כל תקופה (שנה). תקבל הודעה בדוא״ל לפחות
          7 ימים לפני החיוב.
        </Paragraph>
        <Paragraph>
          <Text style={{ fontFamily: 'Rubik-Medium' }}>ביטול:</Text> ניתן לבטל
          בכל עת דרך הגדרות החשבון. הביטול יבוא לתוקף בסוף התקופה הנוכחית.
        </Paragraph>
      </Section>

      <Section title="8. זכות ביטול — 14 יום (חוק הגנת הצרכן)">
        <Paragraph>
          בהתאם לחוק הגנת הצרכן, תשמ״א-1981, יש לך
          <Text style={{ fontFamily: 'Rubik-Medium' }}>
            {' '}
            זכות ביטול של 14 ימים
          </Text>{' '}
          מיום הרכישה:
        </Paragraph>
        <BulletList
          items={[
            'חק ביטול מלא אם לא השתמשת במנוי (עד 14 יום)',
            'דמי ביטול: עד 5% ממחיר או 100 ₪ — הנמוך מביניהם',
            'החזר כספי תוך 7 ימי עסקים לאמצעי התשלום המקורי',
            'משתמשים מוגנים (קשישים 65+, בעלי מוגבלות, עולים): 30 יום',
          ]}
        />
        <Paragraph>
          הודעה על ביטול: דוא״ל ל- support@infield.app עם דרישה לביטול.
        </Paragraph>
      </Section>

      <Section title="9. מדיניות החזרים">
        <Paragraph>החזרים עבור מנויים שלמים:</Paragraph>
        <BulletList
          items={[
            'עד 14 יום ללא שימוש משמעותי: החזר מלא',
            'יותר מ-5 דוחות יצורים בתקופה: אין החזר',
            'בקשת החזר: דוא״ל ל- support@infield.app עם סיבה',
            'תשובה בתוך 5 ימי עסקים; החזר כספי בתוך 7 ימים',
          ]}
        />
      </Section>

      <Section title="10. קניין רוחני">
        <BulletList
          items={[
            'האפליקציה, הקוד, העיצוב — שיכות להם inField; לא ניתן להנדס-לאחור',
            'הדוחות שאתה יוצר — שיכים לך לחלוטין',
            'inField לא תשתמש בתוכן הדוחות שלך למטרה אחרת מאשר מתן השירות',
          ]}
        />
      </Section>

      <Section title="11. הגבלת אחריות">
        <Paragraph>
          inField מסופקת בתנאי "AS IS" ללא התחייבות או אחריות. אנחנו לא אחראים:
        </Paragraph>
        <BulletList
          items={[
            'על נזקים כלכליים, הפסדי רווח, או אובדן נתונים (מגבלה: עד 3 חודשי מנוי)',
            'על נזקים עקיפים או תוצאתיים (צפי, חקרות משפטיות)',
            'על שגיאות בתוכן משתמש או דוחות שיצרת',
            'על אי-זמינות זמנית או בעיות טכניות',
          ]}
        />
        <Paragraph>
          <Text style={{ fontFamily: 'Rubik-Medium' }}>חריג חשוב:</Text> הגבלה
          זו לא תחול אם הנזק נגרם מ: רשלנות חמורה, התעללות מכוונת, או הפרה של
          חוק.
        </Paragraph>
      </Section>

      <Section title="12. כוח עליון">
        <Paragraph>
          inField לא תישא באחריות לכשלים שנגרמו מ: כוח עליון, אסון טבע, מלחמה,
          הוראות ממשלה, מתקפות סייבר, כשל ספק (Supabase, Apple, Google, Expo),
          הפסקת חשמל, או כל מצב שאינו בשליטה שלנו.
        </Paragraph>
      </Section>

      <Section title="13. הפסקת שירות והשעיה">
        <Paragraph>
          אנחנו שומרים לנו את הזכות להשעות או להפסיק חשבון אם:
        </Paragraph>
        <BulletList
          items={[
            'הנך מפר תנאים אלה',
            'אתה משתמש באפליקציה בדרך מסוכנת, בלתי חוקית או בלתי אתית',
            'אתה מנסה להתקוף או להשחית את המערכת',
            'אתה משתמש בדוחות לחומר או הונאה',
          ]}
        />
        <Paragraph>
          בעת הפסקה: תקבל הודעה בדוא״ל עם סיבה. יוכל לבקש ערעור בתוך 7 ימים.
        </Paragraph>
      </Section>

      <Section title="14. מחיקת חשבון">
        <Paragraph>
          אתה יכול למחוק את חשבונך בכל עת דרך הגדרות האפליקציה או בדוא״ל ל-
          support@infield.app. עם מחיקה:
        </Paragraph>
        <BulletList
          items={[
            'כל הנתונים האישיים מחוקים מיד',
            'דוחות חתומים נשמרים 7 שנים (תיעוד משפטי)',
            'גיבויים מחוקים עד 90 יום',
            'לא ניתן להחזיר מידע שנמחק',
          ]}
        />
      </Section>

      <Section title="15. שינויים בתנאים">
        <Paragraph>
          אנחנו עשויות לעדכן תנאים אלה מעת לעת. שינויים משמעותיים יוכרזו דרך
          דוא״ל או הודעה באפליקציה לפחות 30 יום לפני כניסתם לתוקף. המשך שימוש
          לאחר ההודעה מהווה הסכמה.
        </Paragraph>
      </Section>

      <Section title="16. דין וסמכות שיפוט">
        <Paragraph>
          הסכם זה כפוף לדיני מדינת ישראל. סמכות שיפוט ייחודית לבתי משפט במחוז תל
          אביב. שניכם מוותרים על זכות לערעור לבדיל מזה.
        </Paragraph>
      </Section>

      <Section title="17. צור קשר">
        <Paragraph>שאלות או בעיות? אנחנו כאן בשבילך:</Paragraph>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Rubik-Medium',
            color: COLORS.primary[500],
            textAlign: 'right',
            marginTop: 12,
            marginBottom: 8,
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
