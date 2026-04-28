import { useState, useMemo, useCallback } from "react";

// ═══════════════════════════════════════════════════
// inField — Reports List v5 — FINAL
// All audit fixes applied
// ═══════════════════════════════════════════════════

const c = {
  g50: "#F0F7F4", g100: "#D1E7DD", g200: "#A3D1B5",
  g500: "#1B7A44", g600: "#14643A", g700: "#0F4F2E",
  cr50: "#FEFDFB", cr100: "#FBF8F3", cr200: "#F5EFE6", cr300: "#EBE1D3",
  go100: "#FDF4E7", go500: "#C8952E", go700: "#8B6514",
  n300: "#D1CEC8", n400: "#A8A49D", n500: "#7A766F", n600: "#5C5852",
  n700: "#3D3A36", n800: "#252420",
  sG: "#10B981", sR: "#EF4444",
};

// ── Icons ──────────────────────────────────────────

const Ic = ({ children, size = 20, color = c.n700, sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const HamburgerIc = () => <Ic size={20}><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="15" y2="18"/></Ic>;
const BellIc = () => <Ic size={19} color={c.n500}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Ic>;
const SearchIcn = () => <Ic size={16} color={c.n400} sw={1.6}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Ic>;
const ChevR = () => <Ic size={14} color={c.n300} sw={2}><polyline points="9 18 15 12 9 6"/></Ic>;
const ClockIc = () => <Ic size={10} color={c.n400} sw={1.5}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Ic>;
const AlertIc = () => <Ic size={11} color={c.go500} sw={2}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></Ic>;
const PlusIc = () => <Ic size={16} color="white" sw={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Ic>;
const XCircleIc = () => <Ic size={16} color={c.n400} sw={1.6}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></Ic>;
const SlidersIc = ({ color = c.n500, size = 18 }) => <Ic size={size} color={color} sw={1.8}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></Ic>;
const XIc = () => <Ic size={20} color={c.n600} sw={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Ic>;
const CheckIc = ({ color = c.g500, size = 16 }) => <Ic size={size} color={color} sw={2.5}><polyline points="20 6 9 17 4 12"/></Ic>;
const RefreshIc = () => <Ic size={20} color={c.g500} sw={2}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></Ic>;

// Tab bar
const HomeTabIc = ({ a }) => <Ic size={22} color={a?c.g500:c.n400} sw={a?2:1.6}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Ic>;
const FileTabIc = ({ a }) => <Ic size={22} color={a?c.g500:c.n400} sw={a?2:1.6}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></Ic>;
const FolderTabIc = ({ a }) => <Ic size={22} color={a?c.g500:c.n400} sw={a?2:1.6}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></Ic>;
const GearTabIc = ({ a }) => <Ic size={22} color={a?c.g500:c.n400} sw={a?2:1.6}><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2m-7.07-3.93l1.41 1.41M17.66 4.93l1.41 1.41M1 12h2m18 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41"/></Ic>;

function BootLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="3" y="1" width="34" height="38" rx="9" fill={c.g50} stroke={c.g200} strokeWidth="1"/>
      <rect x="10" y="7" width="20" height="3" rx="1.5" fill={c.g500}/>
      <rect x="10" y="13" width="20" height="3" rx="1.5" fill={c.g500}/>
      <rect x="10" y="19" width="20" height="3" rx="1.5" fill={c.g500}/>
      <rect x="10" y="27" width="20" height="6" rx="3" fill={c.g500}/>
    </svg>
  );
}

// ── Status config ──────────────────────────────────

const STATUS = {
  draft:       { label: "טיוטה",  color: c.n600, bg: c.cr200, dot: c.n400 },
  in_progress: { label: "בעבודה", color: c.go700, bg: c.go100, dot: c.go500 },
  completed:   { label: "הושלם",  color: c.g700, bg: c.g50, dot: c.g500 },
  sent:        { label: "נשלח",   color: c.g700, bg: c.g100, dot: c.g500 },
};

const TYPE_LABELS = { delivery: "מסירה", bedek_bait: "בדק בית" };

// ── Data ───────────────────────────────────────────

const allReports = [
  { id:1,  project:"פארק תל-אביב",       apt:"דירה 12, בניין A",  type:"delivery",    status:"in_progress", defects:8,  time:"לפני שעתיים", date:"2026-03-31" },
  { id:2,  project:"גבעת שמואל מגדלים",   apt:"דירה 4A, מגדל 3",  type:"bedek_bait",  status:"in_progress", defects:23, time:"אתמול",       date:"2026-03-30" },
  { id:3,  project:"נווה צדק",            apt:"קוטג׳ 7",          type:"delivery",    status:"completed",   defects:5,  time:"25.03",       date:"2026-03-25" },
  { id:4,  project:"פארק תל-אביב",       apt:"דירה 8, בניין B",  type:"delivery",    status:"completed",   defects:12, time:"24.03",       date:"2026-03-24" },
  { id:5,  project:"גבעת שמואל מגדלים",   apt:"דירה 11, מגדל 1",  type:"bedek_bait",  status:"completed",   defects:17, time:"22.03",       date:"2026-03-22" },
  { id:6,  project:"פארק תל-אביב",       apt:"דירה 3, בניין A",  type:"delivery",    status:"sent",        defects:9,  time:"20.03",       date:"2026-03-20" },
  { id:7,  project:"נווה צדק",            apt:"קוטג׳ 2",          type:"bedek_bait",  status:"draft",       defects:14, time:"19.03",       date:"2026-03-19" },
  { id:8,  project:"גבעת שמואל מגדלים",   apt:"דירה 7, מגדל 2",  type:"delivery",    status:"completed",   defects:3,  time:"18.03",       date:"2026-03-18" },
  { id:9,  project:"פארק תל-אביב",       apt:"דירה 15, בניין C", type:"delivery",    status:"draft",       defects:6,  time:"17.03",       date:"2026-03-17" },
  { id:10, project:"נווה צדק",            apt:"קוטג׳ 5",          type:"delivery",    status:"completed",   defects:11, time:"15.03",       date:"2026-03-15" },
];

// ── Header ─────────────────────────────────────────

const btnS = {
  width: 36, height: 36, borderRadius: 10,
  background: c.cr100, border: `1px solid ${c.cr200}`,
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
};

function Header({ count, total }) {
  return (
    <div style={{ padding: "48px 16px 0", background: c.cr50, animation: "fadeDown 0.2s ease both" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button style={btnS}><BellIc/></button>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: c.g700, fontFamily: "Inter, Rubik", letterSpacing: -0.3 }}>
            in<span style={{ fontWeight: 800 }}>Field</span>
          </div>
          <BootLogo size={28}/>
        </div>
        <button style={btnS}><HamburgerIc/></button>
      </div>
      <div style={{ display: "flex", direction: "rtl", alignItems: "baseline", marginTop: 14 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: c.n800, fontFamily: "Rubik" }}>הדוחות שלי</span>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 11, color: c.n400, fontFamily: "Rubik" }}>
          {count === total ? `${total}` : `${count}/${total}`}
        </span>
      </div>
    </div>
  );
}

// ── Search Bar ─────────────────────────────────────

function SearchBar({ value, onChange }) {
  return (
    <div style={{
      margin: "10px 16px 0", display: "flex", alignItems: "center",
      background: c.cr100, borderRadius: 10, border: `1px solid ${c.cr200}`,
      padding: "0 12px", height: 38, animation: "fadeDown 0.2s ease 0.05s both",
    }}>
      {value && (
        <button onClick={() => onChange("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
          <XCircleIc/>
        </button>
      )}
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder="חיפוש..." dir="rtl" autoComplete="off" spellCheck={false}
        style={{
          flex: 1, border: "none", background: "transparent",
          fontSize: 16, color: c.n800, fontFamily: "Rubik",
          outline: "none", textAlign: "right", padding: "0 8px",
        }}
      />
      <SearchIcn/>
    </div>
  );
}

// ── Status Chips + Sort Button ─────────────────────

function FilterBar({ statusFilter, setStatusFilter, hasActiveFilters, onOpenSort }) {
  const chips = [
    { key: "all", label: "הכל" },
    { key: "active", label: "פעילים" },
    { key: "completed", label: "הושלמו" },
  ];

  return (
    <div style={{
      display: "flex", direction: "rtl", alignItems: "center", gap: 8,
      margin: "10px 16px 0",
      animation: "fadeDown 0.2s ease 0.1s both",
    }}>
      {/* Chips first in RTL = right */}
      <div style={{ display: "flex", gap: 6, flex: 1 }}>
        {chips.map(ch => {
          const on = statusFilter === ch.key;
          return (
            <button key={ch.key} onClick={() => setStatusFilter(ch.key)} style={{
              height: 36, borderRadius: 10,
              background: on ? c.g50 : "transparent",
              border: `1px solid ${on ? c.g200 : c.cr200}`,
              color: on ? c.g700 : c.n500,
              fontSize: 12, fontWeight: on ? 600 : 400,
              fontFamily: "Rubik", cursor: "pointer",
              padding: "0 14px", transition: "all 0.15s",
            }}>
              {ch.label}
            </button>
          );
        })}
      </div>

      {/* Sort button last in RTL = left */}
      <button onClick={onOpenSort} style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: hasActiveFilters ? c.g50 : c.cr50,
        border: `1px solid ${hasActiveFilters ? c.g200 : c.cr200}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", position: "relative", transition: "all 0.15s",
      }}>
        <SlidersIc color={hasActiveFilters ? c.g500 : c.n500} size={16}/>
        {hasActiveFilters && (
          <div style={{
            position: "absolute", top: -3, right: -3,
            width: 8, height: 8, borderRadius: "50%",
            background: c.g500, border: `1.5px solid ${c.cr50}`,
          }}/>
        )}
      </button>
    </div>
  );
}

// ── Sort/Filter Bottom Sheet (with exit animation) ─

function SortSheet({ open, closing, onClose, sortBy, setSortBy, typeFilter, setTypeFilter }) {
  if (!open && !closing) return null;

  return (
    <>
      <div onClick={onClose} style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,.4)",
        zIndex: 150,
        animation: closing ? "fadeOut 0.2s ease both" : "fadeIn 0.2s ease both",
      }}/>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: c.cr50,
        borderRadius: "16px 16px 0 0",
        zIndex: 200, padding: "0 0 32px", direction: "rtl",
        boxShadow: "0 -4px 20px rgba(60,54,42,.12)",
        animation: closing
          ? "slideDown 0.25s ease both"
          : "slideUp 0.35s cubic-bezier(.22,1,.36,1) both",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: c.cr300 }}/>
        </div>
        <div style={{
          display: "flex", alignItems: "center",
          padding: "8px 20px 12px", borderBottom: `1px solid ${c.cr200}`,
        }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
            <XIc/>
          </button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: c.n800, fontFamily: "Rubik" }}>מיון וסינון</span>
          </div>
          <button onClick={() => { setSortBy("date"); setTypeFilter("all"); }} style={{
            background: "none", border: "none", cursor: "pointer",
            color: c.n400, fontSize: 12, fontFamily: "Rubik",
          }}>איפוס</button>
        </div>

        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: c.n500, fontFamily: "Rubik", marginBottom: 8, textAlign: "right" }}>מיון לפי</div>
          {[
            { key: "date", label: "תאריך (חדש → ישן)" },
            { key: "project", label: "פרויקט (א-ת)" },
          ].map(o => <SheetOption key={o.key} label={o.label} selected={sortBy === o.key} onClick={() => setSortBy(o.key)}/>)}
        </div>

        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: c.n500, fontFamily: "Rubik", marginBottom: 8, textAlign: "right" }}>סוג דוח</div>
          {[
            { key: "all", label: "הכל" },
            { key: "delivery", label: "פרוטוקול מסירה" },
            { key: "bedek_bait", label: "בדק בית" },
          ].map(o => <SheetOption key={o.key} label={o.label} selected={typeFilter === o.key} onClick={() => setTypeFilter(o.key)}/>)}
        </div>

        <div style={{ padding: "20px 20px 0" }}>
          <button onClick={onClose} style={{
            width: "100%", height: 46, borderRadius: 12,
            background: c.g500, border: "none",
            color: "white", fontSize: 14, fontWeight: 600,
            fontFamily: "Rubik", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(27,122,68,.18)",
          }}>החל</button>
        </div>
      </div>
    </>
  );
}

function SheetOption({ label, selected, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "flex", direction: "rtl", alignItems: "center",
        width: "100%", padding: "12px 4px", minHeight: 44,
        background: h ? c.cr100 : "transparent",
        border: "none", borderBottom: `1px solid ${c.cr200}`,
        cursor: "pointer", transition: "background 0.1s",
      }}
    >
      <span style={{
        fontSize: 14, fontWeight: selected ? 600 : 400,
        color: selected ? c.g700 : c.n700, fontFamily: "Rubik", flex: 1,
      }}>{label}</span>
      {selected ? <CheckIc color={c.g500} size={18}/> : <div style={{ width: 18 }}/>}
    </button>
  );
}

// ── Active Filter Tags (min 36px touch) ────────────

function ActiveTags({ typeFilter, setTypeFilter, sortBy }) {
  const hasType = typeFilter !== "all";
  const hasSort = sortBy !== "date";
  if (!hasType && !hasSort) return null;

  return (
    <div style={{
      display: "flex", direction: "rtl", gap: 6, margin: "8px 16px 0",
      animation: "fadeDown 0.2s ease both",
    }}>
      {hasType && (
        <button onClick={() => setTypeFilter("all")} style={{
          minHeight: 36, borderRadius: 10,
          background: c.go100, border: `1px solid ${c.go100}`,
          color: c.go700, fontSize: 11, fontWeight: 500,
          fontFamily: "Rubik", cursor: "pointer",
          padding: "0 10px 0 12px",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          ✕
          <span>{TYPE_LABELS[typeFilter]}</span>
        </button>
      )}
      {hasSort && (
        <span style={{
          minHeight: 36, borderRadius: 10,
          background: c.cr100, border: `1px solid ${c.cr200}`,
          color: c.n600, fontSize: 11, fontWeight: 500,
          fontFamily: "Rubik", padding: "0 12px",
          display: "flex", alignItems: "center",
        }}>
          {sortBy === "project" ? "לפי פרויקט" : "לפי תאריך"}
        </span>
      )}
    </div>
  );
}

// ── Skeleton Loading ───────────────────────────────

function SkeletonList() {
  return (
    <div style={{
      margin: "12px 16px 0", background: c.cr50,
      borderRadius: 12, border: `1px solid ${c.cr200}`, overflow: "hidden",
    }}>
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{
          padding: "14px 16px",
          borderBottom: i < 4 ? `1px solid ${c.cr200}` : "none",
          display: "flex", alignItems: "center", gap: 12,
          animation: `shimmer 1.2s ease-in-out ${i * 0.1}s infinite`,
        }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: c.cr200, marginLeft: "auto" }}/>
          <div style={{ flex: 1 }}>
            <div style={{ width: "60%", height: 12, borderRadius: 4, background: c.cr200, marginBottom: 6, marginLeft: "auto" }}/>
            <div style={{ width: "40%", height: 9, borderRadius: 3, background: c.cr200, marginLeft: "auto" }}/>
          </div>
          <div>
            <div style={{ width: 44, height: 18, borderRadius: 5, background: c.cr200, marginBottom: 4 }}/>
            <div style={{ width: 28, height: 12, borderRadius: 3, background: c.cr200 }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Error State ────────────────────────────────────

function ErrorState({ onRetry }) {
  return (
    <div style={{
      margin: "12px 16px 0", background: c.cr50,
      borderRadius: 12, border: `1px solid ${c.cr200}`,
      padding: "48px 24px", textAlign: "center",
      animation: "riseIn 0.2s ease both",
    }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>😕</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: c.n700, fontFamily: "Rubik", marginBottom: 4 }}>
        משהו השתבש
      </div>
      <div style={{ fontSize: 12, color: c.n400, fontFamily: "Rubik", marginBottom: 16, lineHeight: 1.5 }}>
        לא הצלחנו לטעון את הדוחות.<br/>בדוק את החיבור ונסה שוב.
      </div>
      <button onClick={onRetry} style={{
        height: 38, borderRadius: 10, background: c.cr50,
        border: `1px solid ${c.g200}`,
        color: c.g700, fontSize: 13, fontWeight: 600, fontFamily: "Rubik",
        cursor: "pointer", padding: "0 20px",
        display: "inline-flex", alignItems: "center", gap: 6,
      }}>
        <RefreshIc/>
        נסה שוב
      </button>
    </div>
  );
}

// ── Empty State ────────────────────────────────────

function EmptyState() {
  return (
    <div style={{
      margin: "12px 16px 0", background: c.cr50,
      borderRadius: 12, border: `1px solid ${c.cr200}`,
      padding: "48px 24px", textAlign: "center",
      animation: "riseIn 0.2s ease both",
    }}>
      <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.7 }}>📋</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: c.n700, fontFamily: "Rubik", marginBottom: 4 }}>אין דוחות</div>
      <div style={{ fontSize: 12, color: c.n400, fontFamily: "Rubik", marginBottom: 16, lineHeight: 1.5 }}>
        לא נמצאו דוחות התואמים לחיפוש.<br/>נסה לשנות את הפילטרים.
      </div>
      <button style={{
        height: 38, borderRadius: 10, background: c.g500, border: "none",
        color: "white", fontSize: 13, fontWeight: 600, fontFamily: "Rubik",
        cursor: "pointer", padding: "0 20px",
        display: "inline-flex", alignItems: "center", gap: 6,
      }}><PlusIc/>בדיקה חדשה</button>
    </div>
  );
}

// ── Report Row ─────────────────────────────────────

function ReportRow({ r, last, idx }) {
  const [h, setH] = useState(false);
  const st = STATUS[r.status];
  const typeLabel = TYPE_LABELS[r.type];

  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "flex", direction: "rtl", alignItems: "center",
        padding: "12px 16px",
        borderBottom: last ? "none" : `1px solid ${c.cr200}`,
        cursor: "pointer", background: h ? c.cr100 : "transparent",
        transition: "background 0.15s",
        animation: `riseIn 0.2s ease ${0.06 * idx}s both`,
      }}
    >
      {/* Status dot — first in RTL = right */}
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: st.dot, flexShrink: 0, marginLeft: 6 }}/>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", direction: "rtl", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: c.n800, fontFamily: "Rubik" }}>{r.project}</span>
        </div>
        <div style={{ display: "flex", direction: "rtl", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 11, color: c.n500, fontFamily: "Rubik" }}>{r.apt}</span>
          <span style={{ fontSize: 9, color: c.n300 }}>·</span>
          <span style={{ fontSize: 10, color: c.n400, fontFamily: "Rubik" }}>{typeLabel}</span>
          <span style={{ fontSize: 9, color: c.n300 }}>·</span>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <ClockIc/><span style={{ fontSize: 10, color: c.n400, fontFamily: "Rubik" }}>{r.time}</span>
          </div>
        </div>
      </div>

      {/* Status + defects */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginRight: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 600, color: st.color, background: st.bg,
          borderRadius: 5, padding: "2px 7px", fontFamily: "Rubik",
        }}>{st.label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AlertIc/><span style={{ fontSize: 10, fontWeight: 500, color: c.n500, fontFamily: "Inter" }}>{r.defects}</span>
        </div>
      </div>

      <ChevR/>
    </div>
  );
}

// ── Project Group ──────────────────────────────────

function GroupHeader({ name, count }) {
  return (
    <div style={{
      display: "flex", direction: "rtl", alignItems: "center",
      gap: 6, padding: "10px 16px 4px",
    }}>
      <div style={{ width: 4, height: 14, borderRadius: 2, background: c.g500 }}/>
      <span style={{ fontSize: 12, fontWeight: 700, color: c.g700, fontFamily: "Rubik" }}>{name}</span>
      <span style={{ fontSize: 10, fontWeight: 500, color: c.n400, fontFamily: "Inter" }}>{count}</span>
    </div>
  );
}

// ── Reports List ───────────────────────────────────

function ReportsList({ reports, sortBy }) {
  if (reports.length === 0) return <EmptyState/>;

  if (sortBy === "project") {
    const groups = {};
    reports.forEach(r => { if (!groups[r.project]) groups[r.project] = []; groups[r.project].push(r); });
    let gi = 0;
    return (
      <div style={{ margin: "8px 16px 0" }}>
        {Object.entries(groups).map(([proj, items]) => (
          <div key={proj}>
            <GroupHeader name={proj} count={items.length}/>
            <div style={{ background: c.cr50, borderRadius: 12, border: `1px solid ${c.cr200}`, overflow: "hidden", marginBottom: 8 }}>
              {items.map((r, i) => <ReportRow key={r.id} r={r} last={i === items.length - 1} idx={gi++}/>)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ margin: "12px 16px 0", background: c.cr50, borderRadius: 12, border: `1px solid ${c.cr200}`, overflow: "hidden" }}>
      {reports.map((r, i) => <ReportRow key={r.id} r={r} last={i === reports.length - 1} idx={i}/>)}
    </div>
  );
}

// ── FAB ────────────────────────────────────────────

function FAB() {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        position: "absolute", bottom: 80, left: 16,
        height: 48, borderRadius: 14, width: h ? 140 : 48,
        background: h ? c.g600 : c.g500, border: "none",
        boxShadow: "0 4px 16px rgba(27,122,68,.3)",
        cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: h ? "flex-end" : "center", gap: 6,
        paddingRight: h ? 14 : 0, paddingLeft: h ? 10 : 0,
        transition: "all 0.3s cubic-bezier(.22,1,.36,1)",
        overflow: "hidden", zIndex: 25,
      }}
    >
      {h && <span style={{ color: "white", fontSize: 12, fontWeight: 600, fontFamily: "Rubik", whiteSpace: "nowrap" }}>בדיקה חדשה</span>}
      <PlusIc/>
    </button>
  );
}

// ── Tab Bar ────────────────────────────────────────

function TabBar() {
  const tabs = [
    { label: "הגדרות", icon: a => <GearTabIc a={a}/>, id: 3 },
    { label: "פרויקטים", icon: a => <FolderTabIc a={a}/>, id: 2 },
    { label: "דוחות", icon: a => <FileTabIc a={a}/>, id: 1 },
    { label: "בית", icon: a => <HomeTabIc a={a}/>, id: 0 },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "rgba(254,253,251,.92)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      borderTop: `1px solid ${c.cr200}`,
      display: "flex", padding: "6px 8px 22px", zIndex: 20,
    }}>
      {tabs.map(t => {
        const isA = t.id === 1;
        return (
          <button key={t.id} style={{
            flex: 1, background: "none", border: "none",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 2, cursor: "pointer", padding: "4px 0",
          }}>
            {t.icon(isA)}
            <span style={{ fontSize: 10, fontWeight: isA ? 600 : 400, color: isA ? c.g500 : c.n400, fontFamily: "Rubik" }}>{t.label}</span>
            {isA && <div style={{ width: 4, height: 4, borderRadius: 2, background: c.g500, marginTop: -1 }}/>}
          </button>
        );
      })}
    </div>
  );
}

// ── Main ───────────────────────────────────────────

export default function ReportsListFinal() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetClosing, setSheetClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const hasActiveFilters = typeFilter !== "all" || sortBy !== "date";

  // Exit-before-unmount pattern for bottom sheet
  const handleCloseSheet = useCallback(() => {
    setSheetClosing(true);
    setTimeout(() => {
      setSheetOpen(false);
      setSheetClosing(false);
    }, 250);
  }, []);

  const handleOpenSheet = useCallback(() => {
    setSheetOpen(true);
    setSheetClosing(false);
  }, []);

  const filtered = useMemo(() => {
    let list = [...allReports];
    if (statusFilter === "active") list = list.filter(r => r.status === "draft" || r.status === "in_progress");
    if (statusFilter === "completed") list = list.filter(r => r.status === "completed" || r.status === "sent");
    if (typeFilter !== "all") list = list.filter(r => r.type === typeFilter);
    if (search.trim()) {
      const q = search.trim();
      list = list.filter(r => r.project.includes(q) || r.apt.includes(q));
    }
    if (sortBy === "date") list.sort((a, b) => b.date.localeCompare(a.date));
    if (sortBy === "project") list.sort((a, b) => a.project.localeCompare(b.project));
    return list;
  }, [statusFilter, typeFilter, sortBy, search]);

  const renderContent = () => {
    if (loading) return <SkeletonList/>;
    if (error) return <ErrorState onRetry={() => setError(false)}/>;
    return <ReportsList reports={filtered} sortBy={sortBy}/>;
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      minHeight: "100vh", background: "#e8e5df", padding: "32px 0",
      fontFamily: "Rubik, -apple-system, sans-serif",
    }}>
      <div style={{
        width: 375, height: 812, background: c.cr100,
        borderRadius: 48, overflow: "hidden",
        boxShadow: "0 16px 48px rgba(60,54,42,.18), 0 2px 6px rgba(60,54,42,.06)",
        border: `6px solid ${c.n800}`, position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
          width: 126, height: 34, borderRadius: 20, background: c.n800, zIndex: 10,
        }}/>

        <div style={{
          direction: "rtl", height: "100%",
          overflowY: "auto", overflowX: "hidden", paddingBottom: 72,
        }}>
          <Header count={filtered.length} total={allReports.length}/>
          <SearchBar value={search} onChange={setSearch}/>
          <FilterBar
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            hasActiveFilters={hasActiveFilters} onOpenSort={handleOpenSheet}
          />
          <ActiveTags typeFilter={typeFilter} setTypeFilter={setTypeFilter} sortBy={sortBy}/>
          {renderContent()}
          <div style={{ height: 60 }}/>
        </div>

        <FAB/>
        <TabBar/>

        <SortSheet
          open={sheetOpen} closing={sheetClosing} onClose={handleCloseSheet}
          sortBy={sortBy} setSortBy={setSortBy}
          typeFilter={typeFilter} setTypeFilter={setTypeFilter}
        />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes fadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes riseIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes fadeOut { from{opacity:1} to{opacity:0} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes slideDown { from{transform:translateY(0)} to{transform:translateY(100%)} }
        @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        * { box-sizing:border-box; margin:0; padding:0; -webkit-font-smoothing:antialiased; }
        ::-webkit-scrollbar { display:none; }
        input::placeholder { color:${c.n400}; }
      `}</style>
    </div>
  );
}
