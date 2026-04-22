import { useState } from "react";

// ═══ PDF DESIGN SYSTEM — Aligned with app Design System ═══
const dk = "#1a1a1a", md = "#444", lt = "#777", vlt = "#aaa", bg = "#FEFDFB";
const bdr = "#D1CEC8", bdrLt = "#F5EFE6";
const grn = "#1B7A44", red2 = "#b91c1c", amber = "#92600a", accent = "#1B7A44";
const accentLt = "#F0F7F4";

// ═══ Category colors for no-checklist summary ═══
const catColors = [
  { bg: "#FFF4E5", bdr: "#F5D0A9" },
  { bg: "#E8F4FD", bdr: "#B8D9F0" },
  { bg: "#FEF7E0", bdr: "#EEE0B0" },
  { bg: "#F3E8F9", bdr: "#D9C4E8" },
  { bg: "#FEF2F2", bdr: "#F4C1C1" },
];

// ═══ Shared Components ═══

function Img() {
  return (
    <div style={{ width: 80, height: 60, borderRadius: 2, background: "#F5EFE6", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid " + bdrLt, flexShrink: 0 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1CEC8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
    </div>
  );
}

function Defect({ num, text, location, recommendation, photos }) {
  return (
    <div style={{ padding: "4px 0 5px", borderBottom: "0.5px solid " + bdrLt }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: md, width: 16, textAlign: "center", flexShrink: 0, marginTop: 1 }}>{num}.</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: dk, lineHeight: 1.4 }}>{text}</div>
          <div style={{ fontSize: 9, color: lt, marginTop: 1 }}>{location}</div>
          {recommendation && (
            <div style={{ fontSize: 9, color: accent, marginTop: 2 }}>{"המלצה: "}{recommendation}</div>
          )}
        </div>
      </div>
      {photos > 0 && (
        <div style={{ display: "flex", gap: 3, marginTop: 4, marginRight: 22, paddingTop: 4, borderTop: "0.5px solid " + bdrLt }}>
          {Array.from({ length: Math.min(photos, 4) }).map((_, i) => <Img key={i} />)}
        </div>
      )}
    </div>
  );
}

function CI({ text, status, ref_num }) {
  const sym = status === "ok" ? "✓" : status === "partial" ? "~" : "✗";
  const col = status === "ok" ? grn : status === "partial" ? amber : red2;
  const bgCol = status === "ok" ? "#ecfdf5" : status === "partial" ? "#fefaed" : "#fef2f2";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "1.5px 0", fontSize: 10, color: md, lineHeight: 1.3 }}>
      <span style={{ color: col, fontWeight: 700, fontSize: 12, width: 16, height: 16, borderRadius: 2, background: bgCol, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{sym}</span>
      <span style={{ flex: 1 }}>{text}</span>
      {status !== "ok" && ref_num && <span style={{ color: red2, fontSize: 8, flexShrink: 0 }}>{"ראה סעיף #"}{ref_num}</span>}
    </div>
  );
}

function Logo() {
  return <div style={{ width: 52, height: 20, border: "1px solid " + bdrLt, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 6.5, color: vlt, flexShrink: 0 }}>לוגו</div>;
}

function RoundBadge({ round }) {
  return (
    <span style={{ fontSize: 7, fontWeight: 700, color: "white", background: accent, borderRadius: 8, padding: "2px 8px", marginRight: 6 }}>
      {"סיבוב "}{round}
    </span>
  );
}

function Foot({ n, title }) {
  return (
    <div style={{ marginTop: "auto", paddingTop: 6, borderTop: "1px solid " + bdr, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 6.5, color: lt }}>
      <Logo /><span>{"עמוד "}{n}</span><span>{title}{" — 25.03.2026"}</span>
    </div>
  );
}

function MiniHeader({ title }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 4, borderBottom: "1px solid " + bdr, marginBottom: 4 }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: dk }}>{title}</div>
      <Logo />
    </div>
  );
}

function SecTitle({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 700, color: dk, padding: "4px 0 3px", borderBottom: "2px solid " + dk, marginBottom: 4, marginTop: 8 }}>{children}</div>;
}

function SubTitle({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 700, color: accent, padding: "4px 8px 3px", marginTop: 8, marginBottom: 3, background: accentLt, borderRadius: 2, borderRight: "3px solid " + accent }}>{children}</div>;
}

// ═══ Page styles ═══
const ps = {
  width: "100%",
  maxWidth: 520,
  aspectRatio: "210/297",
  background: "white",
  borderRadius: 2,
  boxShadow: "0 2px 16px rgba(60,54,42,.10),0 0 0 1px rgba(60,54,42,.06)",
  fontFamily: "'Rubik','Heebo',sans-serif",
  direction: "rtl",
  padding: "20px 24px",
  fontSize: 9,
  color: md,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

// ═══ Data ═══
const defects = [
  { num: 1, cat: "חשמל", text: "אינטרקום לא מותקן במבואת הכניסה", loc: "מבואת כניסה", rec: "להתקין אינטרקום תקני בהתאם לתוכנית החשמל", photos: 1 },
  { num: 2, cat: "אינסטלציה", text: "נזילה בברז כיור מטבח — ברז חם לא נסגר עד הסוף", loc: "מטבח", rec: "להחליף ברז או אטם פנימי", photos: 2 },
  { num: 3, cat: "ריצוף", text: "מרצפת שבורה בכניסה לדירה — פינה ימנית", loc: "מבואת כניסה", rec: "להחליף מרצפת שבורה ולהתאים גוון", photos: 4 },
  { num: 4, cat: "אלומיניום", text: "תריס חשמלי בסלון לא יורד עד הסוף — נתקע באמצע", loc: "סלון", rec: "לכוון מנוע תריס ולבדוק פסי הסטה", photos: 2 },
  { num: 5, cat: "אינסטלציה", text: "ניקוז איטי במקלחת — מים מצטברים לאחר שימוש", loc: "חדר רחצה", rec: "לנקות נקז ולבדוק שיפוע ריצפה", photos: 1 },
  { num: 6, cat: "איטום", text: "שיפועים לא תקינים במרפסת שירות — הצטברות מים", loc: "מרפסת שירות", rec: "לתקן שיפועים בהתאם לתקן", photos: 3 },
  { num: 7, cat: "אלומיניום", text: "אטימה חלקית בחלון חדר שינה 1 — פינה תחתונה", loc: "חדר שינה 1", rec: "להחליף גומיית אטימה בפינה התחתונה", photos: 2 },
];

const catSummary = [
  { label: "חשמל", count: 1 },
  { label: "אינסטלציה", count: 2 },
  { label: "ריצוף", count: 1 },
  { label: "אלומיניום", count: 2 },
  { label: "איטום", count: 1 },
];

// ═══ HEADER — shared between both variants ═══
function Header({ round }) {
  const roundLabel = round === 1 ? "מסירה ראשונית" : round === 2 ? "מסירה שנייה" : `מסירה ${round}`;
  return (
    <>
      <div style={{ borderBottom: "2px solid " + dk, paddingBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: dk, letterSpacing: -0.3 }}>{"פרוטוקול מסירה"}</div>
            <RoundBadge round={round} />
          </div>
          <div style={{ fontSize: 7.5, color: lt, marginTop: 2, fontWeight: 400 }}>
            {roundLabel}{" | תאריך: 25.03.2026 | מספר דוח: DF-2026-0412"}
          </div>
        </div>
        <Logo />
      </div>

      {/* Details */}
      <div style={{ marginTop: 4, padding: "4px 8px", border: "1px solid " + bdr, borderRadius: 2, fontSize: 9, display: "flex", flexWrap: "wrap", gap: "2px 14px", background: bg }}>
        {[
          ["פרויקט:", 'פארק ת"א - בניין 3'],
          ["דירה:", "דירה 12, קומה 4"],
          ["דייר:", "ישראל כהן | ת.ז. 012345678 | 050-1234567"],
          ["מפקח:", "דני לוי, מהנדס בניין"],
        ].map(([k, v], i) => (
          <div key={i} style={{ display: "flex", gap: 3 }}>
            <span style={{ color: lt }}>{k}</span>
            <span style={{ color: dk, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ═══ CHECKLIST SECTION ═══
function ChecklistSection() {
  return (
    <>
      <SecTitle>{"צ׳קליסט מסירה"}</SecTitle>
      <div style={{ border: "1px solid " + bdr, borderRadius: 2, padding: "6px 8px", background: bg }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          {/* Column 1 */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: dk, borderBottom: "0.5px solid " + bdr, paddingBottom: 2, marginBottom: 2 }}>{"אינסטלציה"}</div>
            <CI text={"ברזים תקינים"} status="bad" ref_num={2} />
            <CI text={"כיורים מותקנים"} status="ok" />
            <CI text={"ניקוז תקין"} status="bad" ref_num={5} />
            <CI text={"אסלות תקינות"} status="ok" />

            <div style={{ fontSize: 9, fontWeight: 700, color: dk, borderBottom: "0.5px solid " + bdr, paddingBottom: 2, marginBottom: 2, marginTop: 4 }}>{"חשמל"}</div>
            <CI text={"נקודות חשמל תקינות"} status="ok" />
            <CI text={"לוח חשמל תקין"} status="ok" />
            <CI text={"אינטרקום מותקן"} status="bad" ref_num={1} />

            <div style={{ fontSize: 9, fontWeight: 700, color: dk, borderBottom: "0.5px solid " + bdr, paddingBottom: 2, marginBottom: 2, marginTop: 4 }}>{"ריצוף"}</div>
            <CI text={"ריצוף שלם ואחיד"} status="bad" ref_num={3} />
            <CI text={"ריצוף ספייר קיים"} status="ok" />
          </div>

          {/* Column 2 */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: dk, borderBottom: "0.5px solid " + bdr, paddingBottom: 2, marginBottom: 2 }}>{"אלומיניום"}</div>
            <CI text={"חלונות נסגרים"} status="ok" />
            <CI text={"תריסים חשמליים"} status="bad" ref_num={4} />
            <CI text={"אטימה תקינה"} status="partial" ref_num={7} />

            <div style={{ fontSize: 9, fontWeight: 700, color: dk, borderBottom: "0.5px solid " + bdr, paddingBottom: 2, marginBottom: 2, marginTop: 4 }}>{"נגרות"}</div>
            <CI text={"דלתות פנים מותקנות"} status="ok" />
            <CI text={"ארונות מטבח"} status="ok" />
            <CI text={"משקופים שלמים"} status="ok" />

            <div style={{ fontSize: 9, fontWeight: 700, color: dk, borderBottom: "0.5px solid " + bdr, paddingBottom: 2, marginBottom: 2, marginTop: 4 }}>{"שיש ומשטחים"}</div>
            <CI text={"שיש מטבח מותקן"} status="ok" />
            <CI text={"משטחי עבודה"} status="ok" />

            <div style={{ fontSize: 9, fontWeight: 700, color: dk, borderBottom: "0.5px solid " + bdr, paddingBottom: 2, marginBottom: 2, marginTop: 4 }}>{"איטום"}</div>
            <CI text={"איטום חדרים רטובים"} status="ok" />
            <CI text={"שיפועים תקינים"} status="bad" ref_num={6} />
          </div>
        </div>

        {/* Legend */}
        <div style={{ marginTop: 4, paddingTop: 3, borderTop: "0.5px solid " + bdr, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 8, color: lt }}>
          <div style={{ display: "flex", gap: 8 }}>
            <span><span style={{ color: grn, fontWeight: 700 }}>{"✓"}</span>{" תקין"}</span>
            <span><span style={{ color: red2, fontWeight: 700 }}>{"✗"}</span>{" לא תקין"}</span>
            <span><span style={{ color: amber, fontWeight: 700 }}>{"~"}</span>{" תקין חלקית"}</span>
          </div>
          <span style={{ fontWeight: 600, color: md }}>{"22 פריטים | 15 תקין | 6 לא תקין | 1 חלקי"}</span>
        </div>
      </div>
    </>
  );
}

// ═══ SUMMARY SECTIONS ═══

function ChecklistSummary() {
  return (
    <>
      <SecTitle>{"סיכום"}</SecTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 5, margin: "3px 0 6px" }}>
        {[
          { l: "פריטים", v: "22", b: bg },
          { l: "תקין", v: "15", b: "#ecfdf5" },
          { l: "לא תקין", v: "6", b: "#fef2f2" },
          { l: "חלקי", v: "1", b: "#fefaed" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center", padding: "5px 3px", background: s.b, borderRadius: 3, border: "1px solid " + bdrLt }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: dk }}>{s.v}</div>
            <div style={{ fontSize: 6.5, color: lt, marginTop: 1 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function CategorySummary() {
  return (
    <>
      <SecTitle>{"סיכום ממצאים"}</SecTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))", gap: 5, margin: "3px 0 6px" }}>
        {catSummary.map((s, i) => (
          <div key={i} style={{ textAlign: "center", padding: "5px 3px", background: catColors[i % catColors.length].bg, borderRadius: 3, border: "1px solid " + catColors[i % catColors.length].bdr }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: dk }}>{s.count}</div>
            <div style={{ fontSize: 6.5, color: lt, marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
        <div style={{ textAlign: "center", padding: "5px 3px", background: bg, borderRadius: 3, border: "1px solid " + bdr }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: dk }}>{"7"}</div>
          <div style={{ fontSize: 6.5, color: lt, marginTop: 1 }}>{"סה\"כ"}</div>
        </div>
      </div>
    </>
  );
}

// ═══ KEY DELIVERY + NOTES + TERMS + SIGNATURES ═══

function KeyDeliverySection({ round }) {
  if (round < 2) {
    return (
      <div style={{ fontSize: 8, color: lt, fontStyle: "italic", margin: "6px 0 2px" }}>
        {"* מפתחות יימסרו במסירה הסופית"}
      </div>
    );
  }
  return (
    <>
      <SecTitle>{"קבלת מפתחות"}</SecTitle>
      <div style={{ padding: "4px 8px", border: "1px solid " + bdr, borderRadius: 2, background: bg, fontSize: 9 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px 10px" }}>
          {[["מפתחות דירה:", "3"], ["ת.דואר:", "2"], ["שלט חניה:", "1"], ["שלט כניסה:", "2"], ["קוד כניסה:", "1234#"], ["מחסן:", "1"]].map(([k, v], i) => (
            <div key={i} style={{ display: "flex", gap: 3 }}>
              <span style={{ color: lt }}>{k}</span>
              <span style={{ color: dk, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function TenantNotesSection() {
  return (
    <>
      <SecTitle>{"הערות הדייר"}</SecTitle>
      <div style={{ padding: "5px 8px", border: "1px solid " + bdr, borderRadius: 2, background: bg, minHeight: 24, fontSize: 9, color: md, lineHeight: 1.5 }}>
        {"הדייר מבקש תיקון דחוף של האינטרקום והתריס בסלון. שאר הממצאים ניתנים לתיקון בתוך 30 יום."}
      </div>
    </>
  );
}

function TermsSection() {
  return (
    <>
      <SecTitle>{"תנאים ואחריות"}</SecTitle>
      <div style={{ fontSize: 8, color: lt, lineHeight: 1.5, padding: "2px 0" }}>
        {'פרוטוקול זה נערך בהתאם לחוק המכר (דירות), תשל"ג-1973. תקופת הבדק בהתאם לסוג הליקוי (בין שנה ל-7 שנים). תקופת אחריות 3 שנים מתום תקופת הבדק. הדייר מתבקש לשמור מסמך זה כאסמכתא.'}
      </div>
    </>
  );
}

function SignaturesSection() {
  return (
    <>
      <SecTitle>{"חתימות"}</SecTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 3 }}>
        {[{ r: "מפקח", n: "דני לוי" }, { r: "דייר", n: "ישראל כהן" }].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 7.5, color: lt, marginBottom: 3 }}>{s.r}</div>
            <div style={{ height: 32, border: "1px solid " + bdr, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", color: vlt, fontSize: 7 }}>{"חתימה"}</div>
            <div style={{ fontSize: 7.5, color: dk, marginTop: 2, fontWeight: 500 }}>{s.n}</div>
            <div style={{ fontSize: 6, color: lt }}>{"תאריך: 25.03.2026"}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "5px 18px", border: "1px solid " + bdr, borderRadius: 3 }}>
          <div style={{ fontSize: 7, color: vlt }}>{"חותמת חברה"}</div>
        </div>
      </div>
    </>
  );
}

// ═══ DEFECT LIST with category sub-headers ═══

function DefectList({ items }) {
  let lastCat = "";
  return items.map((d) => {
    const showCat = d.cat !== lastCat;
    lastCat = d.cat;
    return (
      <div key={d.num}>
        {showCat && <SubTitle>{d.cat}</SubTitle>}
        <Defect num={d.num} text={d.text} location={d.loc} recommendation={d.rec} photos={d.photos} />
      </div>
    );
  });
}

// ═══ MAIN COMPONENT ═══

export default function ProtocolPDFPreview() {
  const [variant, setVariant] = useState("checklist"); // "checklist" | "noChecklist"
  const [page, setPage] = useState(0);
  const [round, setRound] = useState(1);

  const hasChecklist = variant === "checklist";
  const rptTitle = "פרוטוקול מסירה";
  const miniTitle = 'פרוטוקול מסירה | פארק ת"א | דירה 12';

  const page1DefectsCount = hasChecklist ? 2 : 6;
  const page1Defects = defects.slice(0, page1DefectsCount);
  const page2Defects = defects.slice(page1DefectsCount);
  const hasPage2Defects = page2Defects.length > 0;

  const totalPages = hasPage2Defects ? 3 : 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "16px 12px", background: "#F5EFE6", minHeight: "100vh", fontFamily: "'Rubik','Heebo',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ═══ Controls ═══ */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
        {/* Variant toggle */}
        <div style={{ display: "flex", gap: 5 }}>
          {[
            { key: "checklist", label: "עם צ׳קליסט" },
            { key: "noChecklist", label: "ללא צ׳קליסט" },
          ].map((v) => (
            <button key={v.key} onClick={() => { setVariant(v.key); setPage(0); }} style={{
              padding: "6px 16px", borderRadius: 4, fontSize: 11,
              fontWeight: variant === v.key ? 600 : 400,
              background: variant === v.key ? accent : "white",
              color: variant === v.key ? "white" : "#555",
              border: "1px solid " + (variant === v.key ? accent : bdr),
              cursor: "pointer", fontFamily: "inherit", direction: "rtl",
            }}>{v.label}</button>
          ))}
        </div>

        {/* Round toggle */}
        <div style={{ display: "flex", gap: 5 }}>
          {[1, 2, 3].map((r) => (
            <button key={r} onClick={() => setRound(r)} style={{
              padding: "4px 12px", borderRadius: 4, fontSize: 10,
              fontWeight: round === r ? 600 : 400,
              background: round === r ? "#555" : "white",
              color: round === r ? "white" : "#555",
              border: "1px solid " + (round === r ? "#555" : bdr),
              cursor: "pointer", fontFamily: "inherit", direction: "rtl",
            }}>{"סיבוב "}{r}</button>
          ))}
        </div>

        {/* Page selector */}
        <div style={{ display: "flex", gap: 5 }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)} style={{
              padding: "6px 16px", borderRadius: 4, fontSize: 11,
              fontWeight: page === i ? 600 : 400,
              background: page === i ? dk : "white",
              color: page === i ? "white" : "#555",
              border: "1px solid " + (page === i ? dk : bdr),
              cursor: "pointer", fontFamily: "inherit", direction: "rtl",
            }}>{"עמוד "}{i + 1}</button>
          ))}
        </div>
      </div>

      {/* ═══ PAGE 1 ═══ */}
      {page === 0 && (
        <div style={ps}>
          <Header round={round} />

          {hasChecklist && <ChecklistSection />}

          <SecTitle>{"ממצאים"}</SecTitle>
          <DefectList items={page1Defects} />

          <Foot n={1} title={rptTitle} />
        </div>
      )}

      {/* ═══ PAGE 2 — Defects continuation (if needed) ═══ */}
      {page === 1 && hasPage2Defects && (
        <div style={ps}>
          <MiniHeader title={miniTitle} />

          <SecTitle>{"ממצאים (המשך)"}</SecTitle>
          <DefectList items={page2Defects} />

          <Foot n={2} title={rptTitle} />
        </div>
      )}

      {/* ═══ LAST PAGE — Summary + Signatures ═══ */}
      {page === (totalPages - 1) && (
        <div style={ps}>
          <MiniHeader title={miniTitle} />

          {hasChecklist ? <ChecklistSummary /> : <CategorySummary />}

          <KeyDeliverySection round={round} />
          <TenantNotesSection />
          <TermsSection />
          <SignaturesSection />

          <Foot n={totalPages} title={rptTitle} />
        </div>
      )}

      {/* ═══ Label ═══ */}
      <div style={{ fontSize: 9, color: "#999", textAlign: "center", padding: "4px 0 12px", direction: "rtl" }}>
        {"מוקאפ פרוטוקול מסירה — inField v6 | "}
        {hasChecklist ? "עם צ׳קליסט" : "ללא צ׳קליסט"}
        {" | סיבוב "}{round}
      </div>
    </div>
  );
}
