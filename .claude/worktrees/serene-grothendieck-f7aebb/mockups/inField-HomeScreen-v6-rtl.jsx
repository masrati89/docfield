import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════
// inField — Home Screen v6 — Apple Clean (Final)
// All audit fixes: no duplicate nav, merged greeting+CTA,
// staggered animations, proper density, fixed tab bar
// ═══════════════════════════════════════════════════

const c = {
  g50: "#F0F7F4", g100: "#D1E7DD", g200: "#A3D1B5", g300: "#6DB88C",
  g500: "#1B7A44", g600: "#14643A", g700: "#0F4F2E",
  cr50: "#FEFDFB", cr100: "#FBF8F3", cr200: "#F5EFE6", cr300: "#EBE1D3",
  go100: "#FDF4E7", go300: "#F0C66B", go500: "#C8952E", go700: "#8B6514",
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
const ChevR = () => <Ic size={14} color={c.n300} sw={2}><polyline points="9 18 15 12 9 6"/></Ic>;
const PlusIc = () => <Ic size={16} color="white" sw={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Ic>;
const ClockIc = () => <Ic size={10} color={c.n400} sw={1.5}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Ic>;
const AlertIc = () => <Ic size={11} color={c.go500} sw={2}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></Ic>;
const MapPinIc = () => <Ic size={11} color={c.n400} sw={1.5}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Ic>;
const SearchIc = () => <Ic size={20} color={c.g500} sw={1.6}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Ic>;

// Tool icons
const DatabaseIc = () => <Ic size={20} color={c.g500} sw={1.6}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></Ic>;
const ClipboardIc = () => <Ic size={20} color={c.g600} sw={1.6}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></Ic>;
const SettingsIc = () => <Ic size={20} color={c.n500} sw={1.6}><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2m-7.07-3.93l1.41 1.41M17.66 4.93l1.41 1.41M1 12h2m18 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41"/></Ic>;
const HelpIc = () => <Ic size={20} color={c.n500} sw={1.6}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></Ic>;

// Tab bar icons
const HomeTabIc = ({ active }) => <Ic size={22} color={active ? c.g500 : c.n400} sw={active ? 2 : 1.6}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Ic>;
const FileTabIc = ({ active }) => <Ic size={22} color={active ? c.g500 : c.n400} sw={active ? 2 : 1.6}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></Ic>;
const FolderTabIc = ({ active }) => <Ic size={22} color={active ? c.g500 : c.n400} sw={active ? 2 : 1.6}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></Ic>;
const GearTabIc = ({ active }) => <Ic size={22} color={active ? c.g500 : c.n400} sw={active ? 2 : 1.6}><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2m-7.07-3.93l1.41 1.41M17.66 4.93l1.41 1.41M1 12h2m18 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41"/></Ic>;

// Boot Logo
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

const reports = [
  { id: 1, project: "פארק תל-אביב", apt: "דירה 12, בניין A", type: "מסירה", status: "draft", defects: 8, time: "לפני שעתיים" },
  { id: 2, project: "גבעת שמואל מגדלים", apt: "דירה 4A, מגדל 3", type: "בדק בית", status: "draft", defects: 23, time: "אתמול" },
  { id: 3, project: "נווה צדק", apt: "קוטג׳ 7", type: "מסירה", status: "done", defects: 5, time: "25.03" },
  { id: 4, project: "פארק תל-אביב", apt: "דירה 8, בניין B", type: "מסירה", status: "done", defects: 12, time: "24.03" },
  { id: 5, project: "גבעת שמואל", apt: "דירה 11, מגדל 1", type: "בדק בית", status: "done", defects: 17, time: "22.03" },
];

const projectsData = [
  { id: 1, name: "פארק תל-אביב", addr: "רח׳ הארבעה 22, תל אביב", done: 31, total: 48 },
  { id: 2, name: "גבעת שמואל מגדלים", addr: "שד׳ האלון 5, גבעת שמואל", done: 87, total: 120 },
  { id: 3, name: "נווה צדק", addr: "רח׳ שבזי 14, תל אביב", done: 12, total: 12 },
];

// ── Animated value ─────────────────────────────────

function AnimVal({ value, color }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let n = 0;
    const step = Math.max(1, Math.floor(value / 15));
    const t = setInterval(() => {
      n += step;
      if (n >= value) { setV(value); clearInterval(t); }
      else setV(n);
    }, 35);
    return () => clearInterval(t);
  }, [value]);
  return <span style={{ color, fontFamily: "Inter, sans-serif" }}>{v}</span>;
}

// ── Header ─────────────────────────────────────────

function Header() {
  return (
    <div style={{
      padding: "48px 16px 0",
      background: c.cr50,
    }}>
      {/* Top bar: hamburger — logo — bell */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        animation: "fadeDown 0.4s ease both",
      }}>
        <button style={{
          width: 36, height: 36, borderRadius: 10,
          background: c.cr100, border: `1px solid ${c.cr200}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative",
        }}>
          <BellIc />
          <div style={{
            position: "absolute", top: 6, right: 7,
            width: 6, height: 6, borderRadius: "50%",
            background: c.sR, border: `1.5px solid ${c.cr50}`,
          }} />
        </button>

        {/* Logo center */}
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{
            fontSize: 14, fontWeight: 700, color: c.g700,
            fontFamily: "Inter, Rubik, sans-serif", letterSpacing: -0.3,
          }}>
            in<span style={{ fontWeight: 800 }}>Field</span>
          </div>
          <BootLogo size={28} />
        </div>

        <button style={{
          width: 36, height: 36, borderRadius: 10,
          background: c.cr100, border: `1px solid ${c.cr200}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <HamburgerIc />
        </button>
      </div>

      {/* Greeting + CTA row — RTL */}
      <div style={{
        display: "flex", direction: "rtl", alignItems: "center",
        marginTop: 14,
        animation: "fadeDown 0.4s ease 0.1s both",
      }}>
        {/* Greeting — first in RTL = right */}
        <div>
          <div style={{
            fontSize: 18, fontWeight: 700, color: c.n800,
            fontFamily: "Rubik", lineHeight: 1.2,
          }}>
            שלום, חיים
          </div>
          <div style={{
            display: "flex", direction: "rtl", alignItems: "center", gap: 4,
            marginTop: 1,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: c.sG }} />
            <span style={{ fontSize: 10, color: c.n400, fontFamily: "Rubik" }}>מסונכרן</span>
          </div>
        </div>

        <div style={{ flex: 1 }}/>

        {/* CTA button — last in RTL = left */}
        <button style={{
          height: 34, borderRadius: 10,
          background: c.g500, border: "none",
          color: "white", fontSize: 12, fontWeight: 600,
          fontFamily: "Rubik", cursor: "pointer",
          display: "flex", direction: "rtl", alignItems: "center", gap: 5,
          padding: "0 12px 0 14px",
          boxShadow: "0 2px 8px rgba(27,122,68,.18)",
          transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = c.g600}
          onMouseLeave={e => e.currentTarget.style.background = c.g500}
        >
          <PlusIc />
          בדיקה חדשה
        </button>
      </div>
    </div>
  );
}

// ── Stats Strip ────────────────────────────────────

function Stats() {
  const items = [
    { v: 4, l: "טיוטות", cl: c.go500 },
    { v: 12, l: "הושלמו", cl: c.g500 },
  ];
  return (
    <div style={{
      display: "flex", margin: "12px 16px 0", gap: 8,
      animation: "fadeDown 0.4s ease 0.15s both",
    }}>
      {items.map((s, i) => (
        <div key={i} style={{
          flex: 1, textAlign: "center", padding: "12px 4px 10px",
          borderRadius: 12, border: `1px solid ${c.cr200}`, background: c.cr50,
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 2 }}>
            <AnimVal value={s.v} color={s.cl} />
          </div>
          <div style={{ fontSize: 10, fontWeight: 500, color: c.n400, fontFamily: "Rubik" }}>{s.l}</div>
        </div>
      ))}
    </div>
  );
}

// ── Separator ──────────────────────────────────────

function Sep() {
  return <div style={{ height: 1, background: c.cr200, margin: "12px 16px 0" }} />;
}

// ── Report Row ─────────────────────────────────────

function ReportRow({ r, last, idx }) {
  const [h, setH] = useState(false);
  const draft = r.status === "draft";
  const typeLabel = r.type === "מסירה" ? "מסירה" : "בדק בית";

  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "flex", direction: "rtl", alignItems: "center",
        padding: "11px 16px",
        borderBottom: last ? "none" : `1px solid ${c.cr200}`,
        cursor: "pointer",
        background: h ? c.cr100 : "transparent",
        transition: "background 0.1s",
        animation: `riseIn 0.35s ease ${0.05 * idx}s both`,
      }}
    >
      {/* Status dot — first in RTL = right */}
      <div style={{
        width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
        background: draft ? c.go500 : c.g500,
        marginLeft: 6,
      }} />

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          display: "flex", direction: "rtl", alignItems: "center",
          gap: 6, marginBottom: 2,
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: c.n800, fontFamily: "Rubik" }}>
            {r.project}
          </span>
        </div>
        <div style={{
          display: "flex", direction: "rtl", alignItems: "center",
          gap: 5,
        }}>
          <span style={{ fontSize: 11, color: c.n500, fontFamily: "Rubik" }}>{r.apt}</span>
          <span style={{ fontSize: 9, color: c.n300 }}>·</span>
          <span style={{ fontSize: 10, color: c.n400, fontFamily: "Rubik" }}>{typeLabel}</span>
          <span style={{ fontSize: 9, color: c.n300 }}>·</span>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <ClockIc />
            <span style={{ fontSize: 10, color: c.n400, fontFamily: "Rubik" }}>{r.time}</span>
          </div>
        </div>
      </div>

      {/* Status + defects — last in RTL = left */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginRight: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 600,
          color: draft ? c.go700 : c.g700,
          background: draft ? c.go100 : c.g50,
          borderRadius: 5, padding: "2px 7px", fontFamily: "Rubik",
        }}>
          {draft ? "טיוטה" : "הושלם"}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AlertIc />
          <span style={{ fontSize: 10, fontWeight: 500, color: c.n500, fontFamily: "Inter" }}>{r.defects}</span>
        </div>
      </div>

      <ChevR />
    </div>
  );
}

function ReportsSection() {
  return (
    <div style={{
      margin: "12px 16px 0", background: c.cr50,
      borderRadius: 12, border: `1px solid ${c.cr200}`, overflow: "hidden",
    }}>
      <div style={{
        display: "flex", direction: "rtl", alignItems: "center",
        padding: "10px 16px", borderBottom: `1px solid ${c.cr200}`,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: c.n800, fontFamily: "Rubik" }}>
          דוחות אחרונים
        </span>
        <div style={{ flex: 1 }}/>
        <button style={{
          background: "none", border: "none", padding: 0,
          color: c.g500, fontSize: 12, fontWeight: 500,
          fontFamily: "Rubik", cursor: "pointer",
          display: "flex", direction: "rtl", alignItems: "center", gap: 2,
        }}>
          עוד
          <ChevR />
        </button>
      </div>
      {reports.map((r, i) => <ReportRow key={r.id} r={r} last={i === reports.length - 1} idx={i} />)}
    </div>
  );
}

// ── Projects Section ───────────────────────────────

function ProjectRow({ p, last, idx }) {
  const [h, setH] = useState(false);
  const pct = Math.round((p.done / p.total) * 100);
  const full = pct === 100;

  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        padding: "11px 16px",
        borderBottom: last ? "none" : `1px solid ${c.cr200}`,
        cursor: "pointer", background: h ? c.cr100 : "transparent",
        transition: "background 0.1s",
        animation: `riseIn 0.35s ease ${0.05 * idx}s both`,
      }}
    >
      {/* Row 1: dot + name + chevron */}
      <div style={{
        display: "flex", direction: "rtl", alignItems: "center",
        marginBottom: 3,
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%",
          background: full ? c.g500 : c.go500, flexShrink: 0, marginLeft: 6,
        }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: c.n800, fontFamily: "Rubik", flex: 1 }}>
          {p.name}
        </span>
        <ChevR />
      </div>
      {/* Row 2: address */}
      <div style={{
        display: "flex", direction: "rtl", alignItems: "center", gap: 3,
        marginBottom: 7,
      }}>
        <MapPinIc />
        <span style={{ fontSize: 11, color: c.n400, fontFamily: "Rubik" }}>{p.addr}</span>
      </div>
      {/* Row 3: progress */}
      <div style={{ display: "flex", direction: "rtl", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, color: c.n400, fontFamily: "Rubik" }}>דירות</span>
        <span style={{
          fontSize: 10, fontWeight: 600, color: full ? c.g500 : c.n600,
          fontFamily: "Inter",
        }}>{p.done}/{p.total}</span>
        <div style={{
          flex: 1, height: 4, borderRadius: 2, background: c.cr200,
          overflow: "hidden", direction: "ltr",
        }}>
          <div style={{
            width: `${pct}%`, height: "100%", borderRadius: 2,
            background: full ? c.g500 : c.go500,
            transition: "width 0.8s cubic-bezier(.22,1,.36,1)",
          }} />
        </div>
      </div>
    </div>
  );
}

function ProjectsSection() {
  return (
    <div style={{
      margin: "12px 16px 0", background: c.cr50,
      borderRadius: 12, border: `1px solid ${c.cr200}`, overflow: "hidden",
    }}>
      <div style={{
        display: "flex", direction: "rtl", alignItems: "center",
        padding: "10px 16px", borderBottom: `1px solid ${c.cr200}`,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: c.n800, fontFamily: "Rubik" }}>
          הפרויקטים שלי
        </span>
        <div style={{ flex: 1 }}/>
        <button style={{
          background: "none", border: "none", padding: 0,
          color: c.g500, fontSize: 12, fontWeight: 500,
          fontFamily: "Rubik", cursor: "pointer",
          display: "flex", direction: "rtl", alignItems: "center", gap: 2,
        }}>
          עוד
          <ChevR />
        </button>
      </div>
      {projectsData.map((p, i) => <ProjectRow key={p.id} p={p} last={i === projectsData.length - 1} idx={i} />)}
    </div>
  );
}

// ── Tool Grid (2×2 — cleaned) ──────────────────────

function ToolGrid() {
  const tools = [
    { label: "מאגר ממצאים", icon: <DatabaseIc />, bg: c.g50 },
    { label: "חיפוש", icon: <SearchIc />, bg: c.g50 },
    { label: "תבניות", icon: <ClipboardIc />, bg: c.g50 },
    { label: "עזרה", icon: <HelpIc />, bg: c.cr100 },
  ];

  return (
    <div style={{
      margin: "12px 16px 0",
      animation: "riseIn 0.4s ease 0.3s both",
    }}>
      <div style={{
        fontSize: 13, fontWeight: 700, color: c.n800,
        fontFamily: "Rubik", textAlign: "right",
        marginBottom: 8, paddingRight: 2,
      }}>כלים</div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 8, direction: "rtl",
      }}>
        {tools.map((t, i) => <ToolCell key={i} tool={t} />)}
      </div>
    </div>
  );
}

function ToolCell({ tool }) {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: h ? c.cr100 : c.cr50,
        border: `1px solid ${c.cr200}`,
        borderRadius: 12, padding: "12px 12px",
        cursor: "pointer",
        display: "flex", direction: "rtl", alignItems: "center",
        gap: 10,
        transition: "all 0.12s ease",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: tool.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {tool.icon}
      </div>
      <span style={{
        fontSize: 12, fontWeight: 500, color: c.n700,
        fontFamily: "Rubik", flex: 1,
      }}>
        {tool.label}
      </span>
    </button>
  );
}

// ── Bottom Tab Bar ─────────────────────────────────

function TabBar({ active, onChange }) {
  const tabs = [
    { label: "הגדרות", icon: (a) => <GearTabIc active={a} />, id: 3 },
    { label: "פרויקטים", icon: (a) => <FolderTabIc active={a} />, id: 2 },
    { label: "דוחות", icon: (a) => <FileTabIc active={a} />, id: 1, badge: 4 },
    { label: "בית", icon: (a) => <HomeTabIc active={a} />, id: 0 },
  ];

  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "rgba(254,253,251,.92)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      borderTop: `1px solid ${c.cr200}`,
      display: "flex",
      padding: "6px 8px 22px",
      zIndex: 20,
    }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            flex: 1, background: "none", border: "none",
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 2,
            cursor: "pointer", padding: "4px 0",
            position: "relative",
          }}>
            <div style={{ position: "relative" }}>
              {t.icon(isActive)}
              {/* Badge */}
              {t.badge && (
                <div style={{
                  position: "absolute", top: -3, right: -6,
                  minWidth: 14, height: 14, borderRadius: 7,
                  background: c.sR, border: `1.5px solid ${c.cr50}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: "white", fontFamily: "Inter" }}>
                    {t.badge}
                  </span>
                </div>
              )}
            </div>
            <span style={{
              fontSize: 10, fontWeight: isActive ? 600 : 400,
              color: isActive ? c.g500 : c.n400,
              fontFamily: "Rubik",
            }}>{t.label}</span>
            {/* Active indicator */}
            {isActive && (
              <div style={{
                width: 4, height: 4, borderRadius: 2,
                background: c.g500, marginTop: -1,
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Main ───────────────────────────────────────────

export default function InFieldV6() {
  const [tab, setTab] = useState(0);

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      minHeight: "100vh", background: "#e8e5df",
      padding: "32px 0",
      fontFamily: "Rubik, -apple-system, sans-serif",
    }}>
      <div style={{
        width: 375, height: 812,
        background: c.cr100,
        borderRadius: 48, overflow: "hidden",
        boxShadow: "0 16px 48px rgba(60,54,42,.18), 0 2px 6px rgba(60,54,42,.06)",
        border: `6px solid ${c.n800}`,
        position: "relative",
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
          width: 126, height: 34, borderRadius: 20,
          background: c.n800, zIndex: 10,
        }} />

        {/* Screen */}
        <div style={{
          direction: "rtl", height: "100%",
          overflowY: "auto", overflowX: "hidden",
          paddingBottom: 72,
        }}>
          <Header />
          <Sep />
          <Stats />
          <ReportsSection />
          <ProjectsSection />
          <ToolGrid />
          <div style={{ height: 20 }} />
        </div>

        {/* Tab Bar */}
        <TabBar active={tab} onChange={setTab} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
