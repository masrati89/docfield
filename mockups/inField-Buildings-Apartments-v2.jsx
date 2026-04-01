import { useState, useCallback } from "react";

// ═══════════════════════════════════════════════════
// inField — Buildings List + Apartments List
// Sub-navigation screens within a project
// Toggle between both views with the demo switcher
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

const BackIc = () => <Ic size={20} color={c.n700} sw={2}><polyline points="15 18 9 12 15 6"/></Ic>;
const ChevR = () => <Ic size={14} color={c.n300} sw={2}><polyline points="9 18 15 12 9 6"/></Ic>;
const BuildingIc = ({ color = c.g500, size = 18 }) => <Ic size={size} color={color} sw={1.6}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="2"/><line x1="15" y1="22" x2="15" y2="2"/><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="14" x2="20" y2="14"/></Ic>;
const HomeSmIc = ({ color = c.g500, size = 18 }) => <Ic size={size} color={color} sw={1.6}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Ic>;
const AlertIc = () => <Ic size={11} color={c.go500} sw={2}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></Ic>;
const FileIc = ({ color = c.n400, size = 12 }) => <Ic size={size} color={color} sw={1.5}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></Ic>;
const PlusIc = () => <Ic size={16} color="white" sw={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Ic>;
const MapPinIc = () => <Ic size={12} color={c.n400} sw={1.5}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Ic>;
const UserIc = () => <Ic size={11} color={c.n400} sw={1.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Ic>;
const XIc = () => <Ic size={20} color={c.n600} sw={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Ic>;
const RefreshIc = () => <Ic size={20} color={c.g500} sw={2}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></Ic>;
const HashIc = () => <Ic size={16} color={c.n400} sw={1.6}><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></Ic>;

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

// ── Data ───────────────────────────────────────────

const project = {
  name: "פארק תל-אביב",
  address: "רח׳ הארבעה 22, תל אביב",
};

const buildings = [
  { id: "b1", name: "בניין A", floors: 8, totalApts: 16, completedApts: 12, openDefects: 8 },
  { id: "b2", name: "בניין B", floors: 8, totalApts: 16, completedApts: 11, openDefects: 9 },
  { id: "b3", name: "בניין C", floors: 10, totalApts: 16, completedApts: 8, openDefects: 6 },
];

const apartments = [
  { id: "a1", number: "1", floor: 1, rooms: 3, status: "completed", tenant: "משפחת כהן", defects: 3, reports: 1 },
  { id: "a2", number: "2", floor: 1, rooms: 4, status: "in_progress", tenant: "משפחת לוי", defects: 7, reports: 1 },
  { id: "a3", number: "3", floor: 2, rooms: 3, status: "completed", tenant: "משפחת מזרחי", defects: 2, reports: 1 },
  { id: "a4", number: "4", floor: 2, rooms: 3.5, status: "pending", tenant: "", defects: 0, reports: 0 },
  { id: "a5", number: "5", floor: 3, rooms: 4, status: "in_progress", tenant: "משפחת אברהם", defects: 5, reports: 1 },
  { id: "a6", number: "6", floor: 3, rooms: 3, status: "pending", tenant: "", defects: 0, reports: 0 },
  { id: "a7", number: "7", floor: 4, rooms: 5, status: "completed", tenant: "משפחת דוד", defects: 1, reports: 2 },
  { id: "a8", number: "8", floor: 4, rooms: 3, status: "delivered", tenant: "משפחת רון", defects: 0, reports: 1 },
];

const APT_STATUS = {
  pending:     { label: "ממתין", color: c.n500, bg: c.cr200, dot: c.n400 },
  in_progress: { label: "בבדיקה", color: c.go700, bg: c.go100, dot: c.go500 },
  completed:   { label: "נבדק", color: c.g700, bg: c.g50, dot: c.g500 },
  delivered:   { label: "נמסר", color: c.g700, bg: c.g100, dot: c.g500 },
};

// ── Sub-screen Header (with back) ──────────────────

function SubHeader({ title, subtitle, onBack }) {
  return (
    <div style={{ padding: "48px 16px 0", background: c.cr50, animation: "fadeDown 0.2s ease both" }}>
      {/* Top row: back — logo */}
      <div style={{ display: "flex", direction: "rtl", alignItems: "center" }}>
        <BootLogo size={24}/>
        <div style={{ flex: 1 }}/>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 10,
          background: c.cr100, border: `1px solid ${c.cr200}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <BackIc/>
        </button>
      </div>

      {/* Title + subtitle */}
      <div style={{ marginTop: 12 }}>
        <div style={{
          display: "flex", direction: "rtl", alignItems: "baseline", gap: 8,
        }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: c.n800, fontFamily: "Rubik" }}>{title}</span>
        </div>
        {subtitle && (
          <div style={{
            display: "flex", direction: "rtl", alignItems: "center", gap: 4, marginTop: 2,
          }}>
            <MapPinIc/>
            <span style={{ fontSize: 11, color: c.n400, fontFamily: "Rubik" }}>{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Overall Progress Strip ─────────────────────────

function ProgressStrip({ completed, total, label }) {
  const pct = Math.round((completed / total) * 100);
  const full = pct === 100;
  return (
    <div style={{
      margin: "12px 16px 0", padding: "12px 14px",
      background: c.cr50, borderRadius: 12, border: `1px solid ${c.cr200}`,
      animation: "fadeDown 0.2s ease 0.05s both",
    }}>
      <div style={{ display: "flex", direction: "rtl", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, color: c.n500, fontFamily: "Rubik" }}>{label}</span>
        <span style={{
          fontSize: 12, fontWeight: 700,
          color: full ? c.g500 : c.n700,
          fontFamily: "Inter",
        }}>{completed}/{total}</span>
        <div style={{
          flex: 1, height: 6, borderRadius: 3, background: c.cr200,
          overflow: "hidden", direction: "ltr",
        }}>
          <div style={{
            width: `${pct}%`, height: "100%", borderRadius: 3,
            background: full ? c.g500 : c.go500,
            transition: "width 0.8s cubic-bezier(.22,1,.36,1)",
          }}/>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 700,
          color: full ? c.g500 : c.go500,
          fontFamily: "Inter",
        }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── Building Card ──────────────────────────────────

function BuildingCard({ b, idx }) {
  const [h, setH] = useState(false);
  const pct = Math.round((b.completedApts / b.totalApts) * 100);
  const full = pct === 100;

  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "flex", direction: "rtl",
        background: c.cr50,
        border: `1px solid ${h ? c.g200 : c.cr200}`,
        borderRadius: 12, overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.15s",
        boxShadow: h ? "0 2px 12px rgba(60,54,42,.08)" : "0 1px 3px rgba(60,54,42,.04)",
        animation: `riseIn 0.2s ease ${0.06 * idx}s both`,
      }}
    >
      {/* Accent bar */}
      <div style={{
        width: 4, flexShrink: 0,
        background: full ? c.g500 : c.go500,
        borderRadius: "0 4px 4px 0",
      }}/>

      <div style={{ flex: 1, padding: "14px 16px 14px 14px" }}>
        {/* Row 1: Icon + Name + chevron */}
        <div style={{
          display: "flex", direction: "rtl", alignItems: "center",
          marginBottom: 8,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: full ? c.g50 : c.go100,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, marginLeft: 10,
          }}>
            <BuildingIc color={full ? c.g500 : c.go500} size={18}/>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: c.n800, fontFamily: "Rubik" }}>
              {b.name}
            </span>
            <div style={{ display: "flex", direction: "rtl", alignItems: "center", gap: 6, marginTop: 1 }}>
              <span style={{ fontSize: 10, color: c.n400, fontFamily: "Rubik" }}>{b.floors} קומות</span>
              <span style={{ fontSize: 9, color: c.n300 }}>·</span>
              <span style={{ fontSize: 10, color: c.n400, fontFamily: "Rubik" }}>{b.totalApts} דירות</span>
            </div>
          </div>
          {b.openDefects > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 3, marginLeft: 8,
            }}>
              <AlertIc/>
              <span style={{ fontSize: 10, fontWeight: 600, color: c.go700, fontFamily: "Inter" }}>{b.openDefects}</span>
            </div>
          )}
          <ChevR/>
        </div>

        {/* Row 2: Progress */}
        <div style={{ display: "flex", direction: "rtl", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: full ? c.g500 : c.n600, fontFamily: "Inter" }}>
            {b.completedApts}/{b.totalApts}
          </span>
          <div style={{
            flex: 1, height: 4, borderRadius: 2, background: c.cr200,
            overflow: "hidden", direction: "ltr",
          }}>
            <div style={{
              width: `${pct}%`, height: "100%", borderRadius: 2,
              background: full ? c.g500 : c.go500,
              transition: "width 0.8s cubic-bezier(.22,1,.36,1)",
            }}/>
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: full ? c.g500 : c.go500, fontFamily: "Inter" }}>{pct}%</span>
        </div>
      </div>
    </div>
  );
}

// ── Apartment Row ──────────────────────────────────

function ApartmentRow({ a, last, idx }) {
  const [h, setH] = useState(false);
  const st = APT_STATUS[a.status];

  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "flex", direction: "rtl", alignItems: "center",
        padding: "12px 16px",
        borderBottom: last ? "none" : `1px solid ${c.cr200}`,
        cursor: "pointer",
        background: h ? c.cr100 : "transparent",
        transition: "background 0.15s",
        animation: `riseIn 0.2s ease ${0.06 * idx}s both`,
      }}
    >
      {/* Dot */}
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: st.dot, flexShrink: 0, marginLeft: 8 }}/>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {/* Row 1: apartment number + rooms */}
        <div style={{ display: "flex", direction: "rtl", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: c.n800, fontFamily: "Rubik" }}>
            דירה {a.number}
          </span>
          <span style={{ fontSize: 10, color: c.n400, fontFamily: "Rubik" }}>
            · {a.rooms} חד׳ · קומה {a.floor}
          </span>
        </div>

        {/* Row 2: tenant + reports */}
        <div style={{ display: "flex", direction: "rtl", alignItems: "center", gap: 5 }}>
          {a.tenant && (
            <>
              <UserIc/>
              <span style={{ fontSize: 10, color: c.n400, fontFamily: "Rubik" }}>{a.tenant}</span>
            </>
          )}
          {!a.tenant && (
            <span style={{ fontSize: 10, color: c.n300, fontFamily: "Rubik", fontStyle: "italic" }}>ללא דייר</span>
          )}
          {a.reports > 0 && (
            <>
              <span style={{ fontSize: 9, color: c.n300 }}>·</span>
              <FileIc color={c.n400} size={10}/>
              <span style={{ fontSize: 10, color: c.n400, fontFamily: "Inter" }}>{a.reports}</span>
            </>
          )}
        </div>
      </div>

      {/* Status + defects */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginRight: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 600, color: st.color, background: st.bg,
          borderRadius: 5, padding: "2px 7px", fontFamily: "Rubik",
        }}>{st.label}</span>
        {a.defects > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AlertIc/>
            <span style={{ fontSize: 10, fontWeight: 500, color: c.n500, fontFamily: "Inter" }}>{a.defects}</span>
          </div>
        )}
      </div>

      <ChevR/>
    </div>
  );
}

// ── Skeleton Loading ───────────────────────────────

function BldSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 16px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          background: c.cr50, borderRadius: 12, border: `1px solid ${c.cr200}`,
          padding: 16, animation: `shimmer 1.2s ease-in-out ${i * 0.1}s infinite`,
        }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: c.cr200 }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: "40%", height: 13, borderRadius: 4, background: c.cr200, marginBottom: 6 }} />
              <div style={{ width: "55%", height: 9, borderRadius: 3, background: c.cr200 }} />
            </div>
          </div>
          <div style={{ width: "100%", height: 4, borderRadius: 2, background: c.cr200 }} />
        </div>
      ))}
    </div>
  );
}

function AptSkeleton() {
  return (
    <div style={{ margin: "0 16px", background: c.cr50, borderRadius: 12, border: `1px solid ${c.cr200}`, overflow: "hidden" }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          padding: "14px 16px",
          borderBottom: i < 3 ? `1px solid ${c.cr200}` : "none",
          display: "flex", gap: 10,
          animation: `shimmer 1.2s ease-in-out ${i * 0.1}s infinite`,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.cr200, marginTop: 4 }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: "50%", height: 12, borderRadius: 4, background: c.cr200, marginBottom: 6 }} />
            <div style={{ width: "35%", height: 9, borderRadius: 3, background: c.cr200 }} />
          </div>
          <div style={{ width: 40, height: 18, borderRadius: 5, background: c.cr200 }} />
        </div>
      ))}
    </div>
  );
}

// ── Error State ────────────────────────────────────

function ErrorState({ msg, onRetry }) {
  return (
    <div style={{
      margin: "12px 16px 0", background: c.cr50, borderRadius: 12, border: `1px solid ${c.cr200}`,
      padding: "48px 24px", textAlign: "center", animation: "riseIn 0.2s ease both",
    }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>😕</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: c.n700, fontFamily: "Rubik", marginBottom: 4 }}>משהו השתבש</div>
      <div style={{ fontSize: 12, color: c.n400, fontFamily: "Rubik", marginBottom: 16, lineHeight: 1.5 }}>
        {msg}<br />בדוק את החיבור ונסה שוב.
      </div>
      <button onClick={onRetry} style={{
        height: 38, borderRadius: 10, background: c.cr50, border: `1px solid ${c.g200}`,
        color: c.g700, fontSize: 13, fontWeight: 600, fontFamily: "Rubik",
        cursor: "pointer", padding: "0 20px",
        display: "inline-flex", alignItems: "center", gap: 6,
      }}><RefreshIc />נסה שוב</button>
    </div>
  );
}

// ── Empty State ────────────────────────────────────

function EmptyState({ icon, title, desc, cta, onCta }) {
  return (
    <div style={{
      margin: "12px 16px 0", background: c.cr50, borderRadius: 12, border: `1px solid ${c.cr200}`,
      padding: "48px 24px", textAlign: "center", animation: "riseIn 0.2s ease both",
    }}>
      <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.7 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: c.n700, fontFamily: "Rubik", marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: c.n400, fontFamily: "Rubik", marginBottom: 16, lineHeight: 1.5 }}>{desc}</div>
      {cta && (
        <button onClick={onCta} style={{
          height: 38, borderRadius: 10, background: c.g500, border: "none",
          color: "white", fontSize: 13, fontWeight: 600, fontFamily: "Rubik",
          cursor: "pointer", padding: "0 20px",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}><PlusIc />{cta}</button>
      )}
    </div>
  );
}

// ── Add Building Sheet ─────────────────────────────

function AddBldSheet({ open, closing, onClose }) {
  if (!open && !closing) return null;
  return (
    <>
      <div onClick={onClose} style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,.4)", zIndex: 150,
        animation: closing ? "fadeOut 0.2s ease both" : "fadeIn 0.2s ease both",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: c.cr50, borderRadius: "16px 16px 0 0",
        zIndex: 200, padding: "0 0 32px", direction: "rtl",
        boxShadow: "0 -4px 20px rgba(60,54,42,.12)",
        animation: closing ? "slideDown 0.25s ease both" : "slideUp 0.35s cubic-bezier(.22,1,.36,1) both",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: c.cr300 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "8px 20px 12px", borderBottom: `1px solid ${c.cr200}` }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><XIc /></button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: c.n800, fontFamily: "Rubik" }}>בניין חדש</span>
          </div>
          <div style={{ width: 20 }} />
        </div>
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: c.n700, fontFamily: "Rubik", display: "block", marginBottom: 6 }}>
              שם בניין <span style={{ color: c.sR }}>*</span>
            </label>
            <input placeholder="לדוגמה: בניין D, מגדל 4" dir="rtl" autoComplete="off" spellCheck={false}
              style={{
                width: "100%", height: 42, borderRadius: 10, border: `1px solid ${c.cr200}`,
                background: c.cr100, padding: "0 12px", fontSize: 16,
                fontFamily: "Rubik", color: c.n800, outline: "none",
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: c.n700, fontFamily: "Rubik", display: "block", marginBottom: 6 }}>
              מספר קומות
            </label>
            <div style={{ display: "flex", direction: "rtl", alignItems: "center", gap: 8 }}>
              <HashIc />
              <input placeholder="8" dir="ltr" inputMode="numeric" autoComplete="off"
                style={{
                  width: 80, height: 42, borderRadius: 10, border: `1px solid ${c.cr200}`,
                  background: c.cr100, padding: "0 12px", fontSize: 16,
                  fontFamily: "Inter", color: c.n800, outline: "none", textAlign: "center",
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ padding: "8px 20px 0" }}>
          <button style={{
            width: "100%", height: 46, borderRadius: 12,
            background: c.g500, border: "none", color: "white",
            fontSize: 14, fontWeight: 600, fontFamily: "Rubik", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            boxShadow: "0 2px 8px rgba(27,122,68,.18)",
          }}><PlusIc />הוסף בניין</button>
        </div>
      </div>
    </>
  );
}

// ── Add Report Sheet ───────────────────────────────

function AddRptSheet({ open, closing, onClose }) {
  const [rt, setRt] = useState("delivery");
  if (!open && !closing) return null;
  return (
    <>
      <div onClick={onClose} style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,.4)", zIndex: 150,
        animation: closing ? "fadeOut 0.2s ease both" : "fadeIn 0.2s ease both",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: c.cr50, borderRadius: "16px 16px 0 0",
        zIndex: 200, padding: "0 0 32px", direction: "rtl",
        boxShadow: "0 -4px 20px rgba(60,54,42,.12)",
        animation: closing ? "slideDown 0.25s ease both" : "slideUp 0.35s cubic-bezier(.22,1,.36,1) both",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: c.cr300 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "8px 20px 12px", borderBottom: `1px solid ${c.cr200}` }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><XIc /></button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: c.n800, fontFamily: "Rubik" }}>בדיקה חדשה</span>
          </div>
          <div style={{ width: 20 }} />
        </div>
        <div style={{ padding: "20px 20px 0" }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: c.n700, fontFamily: "Rubik", display: "block", marginBottom: 8 }}>סוג דוח</label>
          <div style={{ display: "flex", direction: "rtl", gap: 8, marginBottom: 20 }}>
            {[
              { k: "delivery", l: "פרוטוקול מסירה" },
              { k: "bedek_bait", l: "בדק בית" },
            ].map(t => (
              <button key={t.k} onClick={() => setRt(t.k)} style={{
                flex: 1, height: 44, borderRadius: 10,
                background: rt === t.k ? c.g50 : c.cr100,
                border: `1.5px solid ${rt === t.k ? c.g500 : c.cr200}`,
                color: rt === t.k ? c.g700 : c.n500,
                fontSize: 13, fontWeight: rt === t.k ? 600 : 400,
                fontFamily: "Rubik", cursor: "pointer", transition: "all 0.15s",
              }}>{t.l}</button>
            ))}
          </div>
          <label style={{ fontSize: 12, fontWeight: 600, color: c.n700, fontFamily: "Rubik", display: "block", marginBottom: 6 }}>
            דירה <span style={{ color: c.sR }}>*</span>
          </label>
          <div style={{
            height: 42, borderRadius: 10, border: `1px solid ${c.cr200}`,
            background: c.cr100, padding: "0 12px",
            display: "flex", direction: "rtl", alignItems: "center",
            fontSize: 14, color: c.n400, fontFamily: "Rubik",
          }}>
            בחר דירה...
            <div style={{ flex: 1 }} />
            <ChevR />
          </div>
        </div>
        <div style={{ padding: "20px 20px 0" }}>
          <button style={{
            width: "100%", height: 46, borderRadius: 12,
            background: c.g500, border: "none", color: "white",
            fontSize: 14, fontWeight: 600, fontFamily: "Rubik", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            boxShadow: "0 2px 8px rgba(27,122,68,.18)",
          }}><PlusIc />התחל בדיקה</button>
        </div>
      </div>
    </>
  );
}

// ── Buildings Screen ───────────────────────────────

function BuildingsScreen() {
  const totalApts = buildings.reduce((s, b) => s + b.totalApts, 0);
  const completedApts = buildings.reduce((s, b) => s + b.completedApts, 0);

  return (
    <>
      <SubHeader
        title={project.name}
        subtitle={project.address}
      />
      <ProgressStrip completed={completedApts} total={totalApts} label="דירות הושלמו"/>

      <div style={{
        fontSize: 13, fontWeight: 700, color: c.n800,
        fontFamily: "Rubik", textAlign: "right",
        margin: "16px 16px 8px", paddingRight: 2,
      }}>
        בניינים
        <span style={{ fontSize: 11, fontWeight: 500, color: c.n400, marginRight: 6 }}>{buildings.length}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 16px" }}>
        {buildings.map((b, i) => <BuildingCard key={b.id} b={b} idx={i}/>)}
      </div>
    </>
  );
}

// ── Apartments Screen ──────────────────────────────

function ApartmentsScreen() {
  const building = buildings[0]; // Demo: building A
  const completed = apartments.filter(a => a.status === "completed" || a.status === "delivered").length;

  // Group by floor
  const floors = {};
  apartments.forEach(a => {
    if (!floors[a.floor]) floors[a.floor] = [];
    floors[a.floor].push(a);
  });
  const sortedFloors = Object.entries(floors).sort((a, b) => Number(a[0]) - Number(b[0]));

  let globalIdx = 0;

  return (
    <>
      <SubHeader
        title={`${project.name} — ${building.name}`}
        subtitle={project.address}
      />
      <ProgressStrip completed={completed} total={apartments.length} label="דירות הושלמו"/>

      {sortedFloors.map(([floor, apts]) => (
        <div key={floor}>
          {/* Floor header */}
          <div style={{
            display: "flex", direction: "rtl", alignItems: "center", gap: 6,
            padding: "12px 16px 4px",
          }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: c.g500 }}/>
            <span style={{ fontSize: 12, fontWeight: 700, color: c.g700, fontFamily: "Rubik" }}>
              קומה {floor}
            </span>
            <span style={{ fontSize: 10, fontWeight: 500, color: c.n400, fontFamily: "Inter" }}>
              {apts.length}
            </span>
          </div>

          {/* Apartments */}
          <div style={{
            margin: "0 16px 8px", background: c.cr50,
            borderRadius: 12, border: `1px solid ${c.cr200}`, overflow: "hidden",
          }}>
            {apts.map((a, i) => (
              <ApartmentRow key={a.id} a={a} last={i === apts.length - 1} idx={globalIdx++}/>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

// ── FAB ────────────────────────────────────────────

function FAB({ label, icon, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        position: "absolute", bottom: 28, left: 16,
        height: 48, borderRadius: 14, width: h ? 148 : 48,
        background: h ? c.g600 : c.g500, border: "none",
        boxShadow: "0 4px 16px rgba(27,122,68,.3)",
        cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: h ? "flex-end" : "center", gap: 6,
        paddingRight: h ? 14 : 0, paddingLeft: h ? 10 : 0,
        transition: "all 0.3s cubic-bezier(.22,1,.36,1)",
        overflow: "hidden", zIndex: 25,
      }}
    >
      {h && <span style={{ color: "white", fontSize: 12, fontWeight: 600, fontFamily: "Rubik", whiteSpace: "nowrap" }}>{label}</span>}
      {icon || <PlusIc/>}
    </button>
  );
}

// ── Main with demo switcher ────────────────────────

export default function BuildingsApartments() {
  const [view, setView] = useState("buildings");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetClosing, setSheetClosing] = useState(false);

  const handleCloseSheet = useCallback(() => {
    setSheetClosing(true);
    setTimeout(() => { setSheetOpen(false); setSheetClosing(false); }, 250);
  }, []);

  const handleOpenSheet = useCallback(() => {
    setSheetOpen(true); setSheetClosing(false);
  }, []);

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      minHeight: "100vh", background: "#e8e5df", padding: "32px 0",
      fontFamily: "Rubik, -apple-system, sans-serif",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {/* Demo switcher (not part of actual app) */}
        <div style={{
          display: "flex", gap: 4, padding: 3,
          background: c.cr200, borderRadius: 10,
        }}>
          {[
            { key: "buildings", label: "בניינים" },
            { key: "apartments", label: "דירות" },
          ].map(t => (
            <button key={t.key} onClick={() => { setView(t.key); setSheetOpen(false); }} style={{
              height: 32, padding: "0 16px", borderRadius: 8,
              background: view === t.key ? c.cr50 : "transparent",
              border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: view === t.key ? 600 : 400,
              color: view === t.key ? c.g700 : c.n500,
              fontFamily: "Rubik",
              boxShadow: view === t.key ? "0 1px 3px rgba(60,54,42,.06)" : "none",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Phone */}
        <div style={{
          width: 375, height: 812, background: c.cr100,
          borderRadius: 48, overflow: "hidden",
          boxShadow: "0 16px 48px rgba(60,54,42,.18), 0 2px 6px rgba(60,54,42,.06)",
          border: `6px solid ${c.n800}`, position: "relative",
        }}>
          {/* Dynamic Island */}
          <div style={{
            position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
            width: 126, height: 34, borderRadius: 20, background: c.n800, zIndex: 10,
          }}/>

          {/* Screen */}
          <div style={{
            direction: "rtl", height: "100%",
            overflowY: "auto", overflowX: "hidden",
          }}>
            {view === "buildings" ? <BuildingsScreen/> : <ApartmentsScreen/>}
            <div style={{ height: 80 }}/>
          </div>

          <FAB
            label={view === "buildings" ? "בניין חדש" : "בדיקה חדשה"}
            onClick={handleOpenSheet}
          />

          {view === "buildings"
            ? <AddBldSheet open={sheetOpen} closing={sheetClosing} onClose={handleCloseSheet}/>
            : <AddRptSheet open={sheetOpen} closing={sheetClosing} onClose={handleCloseSheet}/>
          }
        </div>
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
