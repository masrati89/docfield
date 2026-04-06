// Israeli construction standards reference data
// Used in the add-defect screen for standard selection

export interface StandardSection {
  code: string;
  title: string;
  desc: string;
}

export interface IsraeliStandard {
  id: string;
  name: string;
  sections: StandardSection[];
}

export const ISRAELI_STANDARDS: IsraeliStandard[] = [
  {
    id: '1205.1',
    name: 'ת"י 1205.1 — צנרת מים',
    sections: [
      {
        code: '3.1',
        title: 'חיבורי צנרת — עמידות בלחץ',
        desc: 'כל חיבורי הצנרת יעמדו בלחץ עבודה של 6 אטמוספרות לפחות',
      },
      {
        code: '3.2',
        title: 'אטימות חיבורים',
        desc: 'כל חיבורי צנרת יהיו אטומים ועמידים בלחץ עבודה ללא דליפה',
      },
      {
        code: '4.1',
        title: 'ניקוז — מניעת חסימות',
        desc: 'כל נקודת ניקוז תפעל ללא חסימה, שיפוע מינימלי 1%',
      },
    ],
  },
  {
    id: '1555',
    name: 'ת"י 1555 — ריצוף וחיפוי',
    sections: [
      {
        code: '2.3.1',
        title: 'שלמות אריחים',
        desc: 'אריחים יהיו שלמים ללא סדקים, שברים או פגמים נראים לעין',
      },
      {
        code: '2.4',
        title: 'אחידות מפלסים',
        desc: 'הפרש גובה בין אריחים סמוכים לא יעלה על 1 מ"מ',
      },
    ],
  },
  {
    id: '23',
    name: 'ת"י 23 — חלונות ודלתות',
    sections: [
      {
        code: '5.4',
        title: 'נעילת חלונות',
        desc: 'חלונות ייסגרו עד הסוף ומנגנון הנעילה יפעל בצורה תקינה',
      },
      {
        code: '6.2',
        title: 'תריסים — תפעול',
        desc: 'תריסים חשמליים ו/או ידניים יפעלו בצורה חלקה ללא תקיעה',
      },
    ],
  },
  {
    id: '1920',
    name: 'ת"י 1920 — טיח',
    sections: [
      {
        code: '6.1',
        title: 'ללא סדקים',
        desc: 'טיח יהיה אחיד ללא סדקים',
      },
    ],
  },
  {
    id: '158',
    name: 'ת"י 158 — איטום',
    sections: [
      {
        code: '4.2',
        title: 'שיפועי ניקוז',
        desc: 'שיפוע ניקוז מינימלי 1.5% לכיוון נקודת הניקוז',
      },
    ],
  },
  {
    id: '61',
    name: 'ת"י 61 — חשמל',
    sections: [
      {
        code: '2.1',
        title: 'שקעים ומפסקים',
        desc: 'כל שקע ומפסק יותקנו באופן תקין, במפלס ישר ובחיבור מאובטח',
      },
      {
        code: '3.1',
        title: 'הארקה',
        desc: 'כל מערכת החשמל תהיה מוארקת בהתאם לתקן',
      },
    ],
  },
];
