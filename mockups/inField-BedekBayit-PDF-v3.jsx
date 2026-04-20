import { useState } from "react";

// ═══ PDF DESIGN SYSTEM v3 — Final mockup: 14 pages, legal-grade, 3 audiences ═══
// Changes from v2: legal declaration on cover, standards page, tenant rights page,
// general notes page, enhanced BOQ (contingency+supervision+VAT 18%), price×qty on defects,
// 3 photos per row, merged TOC+legend, merged executive summary+defect index

const dk="#1a1a1a", md="#444", lt="#777", vlt="#aaa", bg="#FEFDFB";
const bdr="#D1CEC8", bdrLt="#F5EFE6", bdrDk="#A8A49D";
const accent="#1B7A44", accentLt="#F0F7F4", accentMd="#D1E7DD";
const sevColors = {
  critical: { bg:"#FDECEC", fg:"#B42318", bdr:"#F4C1C1", label:"קריטי" },
  high:     { bg:"#FFF4E5", fg:"#B54708", bdr:"#F5D0A9", label:"גבוה" },
  medium:   { bg:"#FEF7E0", fg:"#8A6D1C", bdr:"#EEE0B0", label:"בינוני" },
  low:      { bg:"#ECF6EF", fg:"#2B6B3F", bdr:"#CDE5D4", label:"נמוך" },
};

function Img({anno}){return <div style={{position:"relative",width:100,height:75,borderRadius:2,background:"#F5EFE6",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+bdrLt,overflow:"hidden"}}>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D1CEC8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
  {anno&&<><div style={{position:"absolute",top:10,right:14,width:18,height:18,borderRadius:9,border:"2px solid #B42318"}}/><svg style={{position:"absolute",bottom:8,left:8}} width="24" height="14" viewBox="0 0 20 12" fill="none" stroke="#B42318" strokeWidth="1.5"><path d="M1 6 L18 6 M14 2 L18 6 L14 10"/></svg></>}
</div>}

function Logo({big}){return <div style={{width:big?120:40,height:big?48:16,border:"1px solid "+bdrLt,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:big?14:6,color:big?md:vlt,fontWeight:big?600:400}}>{big?"לוגו מפקח":"LOGO"}</div>}

function Header({crumb}){return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:6,marginBottom:8,borderBottom:"1px solid "+bdrLt}}>
  <div style={{fontSize:7.5,color:lt,display:"flex",gap:3,alignItems:"center"}}>
    <span style={{color:accent,fontWeight:600}}>דוח בדק בית</span>
    <span style={{color:vlt}}>›</span>
    <span>{crumb}</span>
  </div>
  <Logo/>
</div>}

function Sec({children}){return <div style={{fontSize:10,fontWeight:700,color:dk,padding:"4px 0 2px",borderBottom:"1px solid "+bdr,marginTop:8,marginBottom:4}}>{children}</div>}
function Sub({children}){return <div style={{fontSize:10,fontWeight:700,color:accent,padding:"4px 8px 3px",margin:"6px 0 3px",background:accentLt,borderRight:"3px solid "+accent,borderRadius:"0 2px 2px 0"}}>{children}</div>}

function Foot({n,total,title}){return <div style={{marginTop:"auto",paddingTop:6,borderTop:"1px solid "+bdr,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:7,color:vlt}}>
  <Logo/><span>עמוד {n} מתוך {total}</span><span>{title} — BB-2026-0142 — 25.03.2026</span>
</div>}

function SevBadge({level}){const c=sevColors[level];return <span style={{fontSize:6.5,fontWeight:700,color:c.fg,background:c.bg,border:"1px solid "+c.bdr,padding:"1px 5px",borderRadius:8}}>{c.label}</span>}

function DefectFull({num,severity,title,location,standard,standardText,recommendation,unitPrice,qty,unit,note,photos=0,annotated=false,annexRef}){
  const total = unitPrice && qty ? unitPrice * qty : null;
  return <div style={{padding:"6px 0",borderBottom:"1px solid "+bdrLt,marginBottom:2}}>
    <div style={{display:"flex",alignItems:"flex-start",gap:6}}>
      <div style={{fontSize:8,fontWeight:700,color:"white",background:dk,width:20,height:20,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{num}</div>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
          <div style={{fontSize:9,fontWeight:600,color:dk,lineHeight:1.4}}>{title}</div>
          <SevBadge level={severity}/>
        </div>
        <div style={{fontSize:7.5,color:lt,marginTop:1}}>{"מיקום: "}{location}</div>
      </div>
      {total&&<div style={{fontSize:8,fontWeight:700,color:accent,flexShrink:0,background:accentLt,padding:"2px 6px",borderRadius:10}}>₪{total.toLocaleString()}</div>}
    </div>
    {standard&&<div style={{margin:"4px 0 3px",marginRight:26,padding:"3px 6px",background:bg,borderRight:"2px solid "+accent,fontSize:7.5,color:md,lineHeight:1.5}}>
      <span style={{fontWeight:600,color:dk}}>{standard}</span>{standardText&&<>{" — "}{standardText}</>}
    </div>}
    <div style={{margin:"3px 0 0",marginRight:26,fontSize:7.5,color:md}}>
      <span style={{fontWeight:600,color:accent}}>{"המלצה: "}</span>{recommendation}
    </div>
    {total&&<div style={{margin:"2px 0 0",marginRight:26,fontSize:7,color:lt}}>
      {"מחיר: ₪"}{unitPrice.toLocaleString()}{" × "}{qty}{" "}{unit}{" = ₪"}{total.toLocaleString()}
    </div>}
    {note&&<div style={{margin:"2px 0 0",marginRight:26,fontSize:7,color:lt,fontStyle:"italic"}}>
      {"הערה: "}{note}
    </div>}
    {photos>0&&<div style={{display:"flex",gap:4,marginTop:4,marginRight:26,flexWrap:"wrap"}}>
      {Array.from({length:Math.min(photos,6)}).map((_,i)=><Img key={i} anno={annotated&&i===0}/>)}
    </div>}
    {annexRef&&<div style={{margin:"4px 0 2px",marginRight:26,padding:"3px 6px",background:bg,borderRadius:2,fontSize:7,color:lt,display:"flex",alignItems:"center",gap:4}}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={lt} strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
      {annexRef}
    </div>}
  </div>
}

export default function BedekPDFv3(){
  const [page,setPage]=useState(0);
  const rptTitle = "דוח בדק בית";
  const TOTAL = 14;
  const ps={width:"100%",maxWidth:520,aspectRatio:"210/297",background:"white",borderRadius:2,boxShadow:"0 2px 12px rgba(60,54,42,.10)",padding:"20px 24px",display:"flex",flexDirection:"column",fontFamily:"'Rubik',sans-serif",direction:"rtl",fontSize:8,color:md,lineHeight:1.5,overflow:"hidden"};
  const labels=["שער","תוכן+מקרא","תקציר+מפתח","תקנים","ידע לדייר","הערות","פרטים","ממצאים 1","ממצאים 2","כת\"כ","הערות כספיות","חתימות","נספח","אחורה"];

  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"16px 8px",background:"#F5EFE6",minHeight:"100vh"}}>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
    <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"center",maxWidth:600}}>
      {labels.map((l,i)=><button key={i} onClick={()=>setPage(i)} style={{padding:"5px 8px",borderRadius:4,border:"1px solid "+(page===i?accent:bdr),background:page===i?accentLt:"#fff",color:page===i?accent:"#666",fontSize:9,cursor:"pointer",fontFamily:"inherit",fontWeight:page===i?600:400}}>{i+1}. {l}</button>)}
    </div>

    {/* ═══ 1. COVER — with legal declaration ═══ */}
    {page===0&&<div style={{...ps,justifyContent:"center",alignItems:"center",textAlign:"center"}}>
      <div style={{marginBottom:16}}><Logo big/></div>
      <div style={{width:160,height:1,background:dk,marginBottom:16}}/>
      <div style={{fontSize:24,fontWeight:700,color:dk,letterSpacing:-.5,marginBottom:6}}>{rptTitle}</div>
      <div style={{fontSize:11,color:lt,marginBottom:6}}>בדיקת קבלה לדירה חדשה</div>
      <div style={{fontSize:9,color:accent,fontWeight:600,marginBottom:14,padding:"3px 10px",border:"1px solid "+accentMd,borderRadius:10,background:accentLt}}>סבב בדיקה ראשון</div>
      <div style={{width:160,height:1,background:bdr,marginBottom:14}}/>
      <div style={{fontSize:9,color:md,lineHeight:2,textAlign:"center",marginBottom:14}}>
        <div><span style={{color:lt}}>{"פרויקט: "}</span><span style={{fontWeight:600}}>פארק הירקון</span></div>
        <div><span style={{color:lt}}>{"כתובת: "}</span><span style={{fontWeight:600}}>שד' רוטשילד 45, תל אביב</span></div>
        <div><span style={{color:lt}}>{"דירה: "}</span><span style={{fontWeight:600}}>דירה 12, קומה 4</span></div>
        <div><span style={{color:lt}}>{"מזמין: "}</span><span style={{fontWeight:600}}>דוד ושרה לוי</span></div>
        <div><span style={{color:lt}}>{"מפקח: "}</span><span style={{fontWeight:600}}>מהנדס דני לוין, מ.ר. 54321</span></div>
        <div><span style={{color:lt}}>{"תאריך בדיקה: "}</span><span style={{fontWeight:600}}>25.03.2026</span></div>
        <div><span style={{color:lt}}>{"מספר דוח: "}</span><span style={{fontWeight:600}}>BB-2026-0142</span></div>
      </div>
      <div style={{width:160,height:1,background:bdr,marginBottom:10}}/>
      <div style={{padding:"6px 12px",border:"1px solid "+bdr,borderRadius:2,background:bg,maxWidth:380,fontSize:7,color:md,lineHeight:1.7,textAlign:"center"}}>
        <span style={{fontWeight:600,color:dk}}>{"הצהרה: "}</span>
        {"אני נותן חוות דעתי זו במקום עדות בבית משפט. אני מצהיר בזאת, כי ידוע לי היטב שלעניין הוראות החוק הפלילי בדבר עדות שקר בבית משפט, דין חוות דעת זו, כשהיא חתומה על ידי, כדין עדות בשבועה שנתתי בבית משפט."}
      </div>
      <div style={{marginTop:8,fontSize:6.5,color:vlt}}>© 2026 מהנדס דני לוין. כל הזכויות שמורות.</div>
    </div>}

    {/* ═══ 2. TOC + LEGEND (merged) ═══ */}
    {page===1&&<div style={ps}>
      <Header crumb="תוכן עניינים"/>
      <div style={{fontSize:13,fontWeight:700,color:dk,marginBottom:8}}>תוכן עניינים</div>
      <div style={{fontSize:8.5,lineHeight:1.9,marginBottom:8}}>
        {[
          {n:"1",t:"שער הדוח",p:"1",bold:true},
          {n:"2",t:"תוכן עניינים ומקרא",p:"2",bold:true},
          {n:"3",t:"תקציר מנהלים ומפתח ליקויים",p:"3",bold:true},
          {n:"4",t:"תקנים ומסמכי ייחוס",p:"4",bold:true},
          {n:"5",t:"ידע כללי לדייר",p:"5",bold:true},
          {n:"6",t:"הערות כלליות",p:"6",bold:true},
          {n:"7",t:"פרטי הבדיקה",p:"7",bold:true},
          {n:"7.1",t:"פרטי המפקח",p:"7"},
          {n:"7.2",t:"פרטי הנכס",p:"7"},
          {n:"7.3",t:"פרטי המזמין",p:"7"},
          {n:"7.4",t:"תנאי הבדיקה",p:"7"},
          {n:"8",t:"ממצאים מפורטים",p:"8",bold:true},
          {n:"9",t:"כתב כמויות ואומדן עלויות",p:"10",bold:true},
          {n:"10",t:"הערות להערכה כספית",p:"11",bold:true},
          {n:"11",t:"חתימות ואישורים",p:"12",bold:true},
          {n:"12",t:"נספחי תקנים",p:"13",bold:true},
          {n:"13",t:"פרטי קשר וכתב ויתור",p:"14",bold:true},
        ].map((r,i)=><div key={i} style={{display:"flex",alignItems:"baseline",gap:6,paddingRight:r.bold?0:12}}>
          <span style={{fontWeight:r.bold?700:500,color:r.bold?dk:md,minWidth:22}}>{r.n}</span>
          <span style={{flex:0,fontWeight:r.bold?600:400,color:r.bold?dk:md,whiteSpace:"nowrap"}}>{r.t}</span>
          <span style={{flex:1,borderBottom:"1px dotted "+bdr,margin:"0 4px",height:1,alignSelf:"center"}}/>
          <span style={{fontWeight:600,color:r.bold?dk:lt,minWidth:14,textAlign:"left"}}>{r.p}</span>
        </div>)}
      </div>
      <Sec>מקרא</Sec>
      <div style={{display:"flex",flexDirection:"column",gap:4,fontSize:7.5,color:md,lineHeight:1.5}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {["critical","high","medium","low"].map(lev=><div key={lev} style={{display:"flex",gap:3,alignItems:"center"}}><SevBadge level={lev}/><span style={{fontSize:7,color:lt}}>{lev==="critical"?"דחוף":lev==="high"?"לפני מסירה":lev==="medium"?"ליקוי גמר":"קוסמטי"}</span></div>)}
        </div>
        <div style={{display:"flex",gap:8,fontSize:7,color:lt}}>
          <span style={{display:"flex",alignItems:"center",gap:3}}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={lt} strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
            נספח תקן מצורף
          </span>
          <span style={{display:"flex",alignItems:"center",gap:3}}>
            <div style={{width:10,height:8,border:"1.5px solid #B42318",borderRadius:1}}/>
            סימון על תמונה
          </span>
        </div>
      </div>
      <Foot n={2} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 3. EXECUTIVE SUMMARY + DEFECT INDEX (merged) ═══ */}
    {page===2&&<div style={ps}>
      <Header crumb="תקציר מנהלים"/>
      <div style={{fontSize:13,fontWeight:700,color:dk,marginBottom:6}}>תקציר מנהלים</div>
      <div style={{fontSize:8,color:md,lineHeight:1.7,marginBottom:6}}>
        {"דירה 12 בפרויקט פארק הירקון נבדקה ב-25.03.2026. נמצאו 5 ליקויים המחייבים תיקון. סך העלות המשוערת: ₪100,446 כולל בצ\"מ, פיקוח הנדסי ומע\"מ. מומלץ לדרוש תיקון מלא לפני חתימה על פרוטוקול מסירה."}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:4,margin:"0 0 6px"}}>
        {[
          {level:"critical",count:0},
          {level:"high",count:1},
          {level:"medium",count:3},
          {level:"low",count:1},
        ].map((s,i)=>{const c=sevColors[s.level];return <div key={i} style={{textAlign:"center",padding:"5px 3px",background:c.bg,borderRadius:3,border:"1px solid "+c.bdr}}>
          <div style={{fontSize:14,fontWeight:700,color:c.fg}}>{s.count}</div>
          <div style={{fontSize:6.5,color:c.fg,fontWeight:600}}>{c.label}</div>
        </div>})}
      </div>
      <Sec>מפתח ליקויים</Sec>
      <div style={{border:"1px solid "+bdr,borderRadius:2,overflow:"hidden",fontSize:7.5}}>
        <div style={{display:"grid",gridTemplateColumns:"24px 1fr 70px 50px 50px 32px",background:dk,color:"#fff",padding:"4px 6px",fontWeight:600,fontSize:7}}>
          <span>#</span><span>תיאור</span><span>קטגוריה</span><span>חומרה</span><span style={{textAlign:"left"}}>עלות</span><span style={{textAlign:"left"}}>עמ'</span>
        </div>
        {[
          {n:1,t:"נזילה בצנרת — מטבח",cat:"אינסטלציה",sev:"high",cost:"₪850",p:"8"},
          {n:2,t:"ניקוז איטי — מקלחת",cat:"אינסטלציה",sev:"medium",cost:"₪1,200",p:"8"},
          {n:3,t:"אריח שבור — כניסה",cat:"ריצוף",sev:"medium",cost:"₪350",p:"9"},
          {n:4,t:"ידית חלון — חד' שינה",cat:"אלומיניום",sev:"low",cost:"₪600",p:"9"},
          {n:5,t:'סדק אנכי 45 ס"מ — סלון',cat:"טיח וצבע",sev:"medium",cost:"₪450",p:"9"},
        ].map((r,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"24px 1fr 70px 50px 50px 32px",padding:"4px 6px",borderBottom:"1px solid "+bdrLt,alignItems:"center"}}>
          <span style={{fontWeight:700,color:dk}}>{r.n}</span>
          <span style={{color:md}}>{r.t}</span>
          <span style={{color:accent,fontWeight:500,fontSize:7}}>{r.cat}</span>
          <span><SevBadge level={r.sev}/></span>
          <span style={{textAlign:"left",fontWeight:600,fontSize:7}}>{r.cost}</span>
          <span style={{textAlign:"left",color:lt}}>{r.p}</span>
        </div>)}
      </div>
      <Foot n={3} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 4. STANDARDS & REFERENCES — NEW boilerplate ═══ */}
    {page===3&&<div style={ps}>
      <Header crumb="תקנים ומסמכי ייחוס"/>
      <div style={{fontSize:13,fontWeight:700,color:dk,marginBottom:6}}>תקנים ומסמכי ייחוס</div>
      <div style={{fontSize:8,color:md,lineHeight:1.6,marginBottom:6}}>חוות הדעת מסתמכת על המסמכים והתקנים הבאים:</div>
      <div style={{padding:"6px 10px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:2}}>
        {[
          "התקנים הישראליים (ת\"י) הרלוונטיים לבנייה ולגמר",
          "תקנות התכנון והבנייה, תש\"ל 1970",
          "תקנות הג\"א — התגוננות אזרחית",
          "הל\"ת — הוראות למתקני תברואה",
          "המפרט הכללי הבין-משרדי לעבודות בנייה",
          "חוק החשמל ותקנותיו",
          "תכניות הדירה המאושרות",
          "מפרט המכר (ככל שהוצג)",
        ].map((t,i)=><div key={i} style={{display:"flex",gap:4,alignItems:"baseline"}}>
          <span style={{color:accent,fontWeight:700,fontSize:10}}>•</span>
          <span>{t}</span>
        </div>)}
      </div>
      <Sec>תקנים ספציפיים שצוטטו בדוח זה</Sec>
      <div style={{padding:"6px 10px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.9}}>
        {[
          ['ת"י 1205.1',"מערכות מים קרים וחמים — חיבורים ואטימות"],
          ['ת"י 1555',"ריצופים וחיפויים קראמיים — שלמות אריחים"],
          ['ת"י 23',"חלונות — סגירה ואטימות"],
          ['ת"י 1920',"טיח — מראה, אחידות, סדקים"],
        ].map(([code,desc],i)=><div key={i} style={{display:"flex",gap:6}}>
          <span style={{fontWeight:600,color:dk,minWidth:70}}>{code}</span>
          <span style={{color:md}}>{desc}</span>
        </div>)}
      </div>
      <Foot n={4} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 5. TENANT RIGHTS — NEW boilerplate ═══ */}
    {page===4&&<div style={ps}>
      <Header crumb="ידע כללי לדייר"/>
      <div style={{fontSize:13,fontWeight:700,color:dk,marginBottom:6}}>ידע כללי לדייר</div>
      <Sec>אחריות קבלן — חוק המכר (דירות)</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.7}}>
        <div style={{marginBottom:4}}>{"קבלן המוכר דירה נושא באחריות לתיקון ליקויים שנתגלו בדירה בתקופה שלאחר מסירתה לקונה. האחריות מתחלקת לשתי תקופות:"}</div>
        <div style={{fontWeight:600,color:dk,marginTop:4}}>{"1. תקופת הבדק"}</div>
        <div>{"חובה על המוכר לתקן את הליקוי אלא אם הוכיח שנגרם באשמת בעל הדירה. התקופה נמשכת בין שנה ל-7 שנים לפי מהות הליקוי."}</div>
        <div style={{fontWeight:600,color:dk,marginTop:4}}>{"2. תקופת האחריות"}</div>
        <div>{"חובת ההוכחה על הרוכש — עליו להוכיח שהליקוי נובע מתכנון, עבודה או חומרים. מתחילה עם סיום תקופת הבדק, נמשכת 3 שנים."}</div>
      </div>
      <Sec>תקופות בדק לפי חוק מכר</Sec>
      <div style={{border:"1px solid "+bdr,borderRadius:2,overflow:"hidden",fontSize:7.5}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 80px",background:dk,color:"#fff",padding:"4px 6px",fontWeight:600}}>
          <span>סוג הליקוי</span><span style={{textAlign:"left"}}>תקופה</span>
        </div>
        {[
          ["מסגרות ונגרות לרבות אלומיניום ופלסטיק","שנתיים"],
          ["ריצוף וחיפוי פנים לרבות שקיעות ושחיקה","שנתיים"],
          ["מכונות ודודים — תפקוד ועמידות","3 שנים"],
          ["מרכיבי בידוד תרמי","3 שנים"],
          ["אינסטלציה, מים, הסקה, מרזבים, ביוב","4 שנים"],
          ["איטום: חללים תת-קרקעיים, קירות, גגות","4 שנים"],
          ["סדקים > 1.5 מ\"מ ברכיבים לא נושאים","5 שנים"],
          ["התנתקות/התקלפות חיפוי חוץ","7 שנים"],
          ["אי-התאמה אחרת שאינה יסודית","שנה"],
        ].map(([t,p],i)=><div key={i} style={{display:"grid",gridTemplateColumns:"1fr 80px",padding:"3px 6px",borderBottom:"1px solid "+bdrLt}}>
          <span>{t}</span><span style={{textAlign:"left",fontWeight:600,color:dk}}>{p}</span>
        </div>)}
      </div>
      <Sec>מסמכים נדרשים ביום מסירה</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:7.5,lineHeight:1.7}}>
        {["חוברת הוראות שימוש ותחזוקה","טופס 5 (תעודת גמר) — תוך שנה","בדיקת תקינות חשמל בנוכחות חשמלאי מוסמך","אחריות לדלת כניסה, דלתות פנים, אלומיניום","אחריות למתקן חימום מים","אריחים רזרביים (2%-5% משטח החיפוי)","אישור תקינות זכוכית באזור סכנה (ת\"י 1099)","אחריות מערכת סינון ממ\"ד","הוראות ואחריות אינטרקום"].map((t,i)=>
          <div key={i} style={{display:"flex",gap:4}}><span style={{color:accent,fontWeight:700}}>{i+1}.</span><span>{t}</span></div>
        )}
      </div>
      <Foot n={5} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 6. GENERAL NOTES — NEW ═══ */}
    {page===5&&<div style={ps}>
      <Header crumb="הערות כלליות"/>
      <div style={{fontSize:13,fontWeight:700,color:dk,marginBottom:6}}>הערות כלליות</div>
      <Sec>שיטת עבודה</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.7}}>
        {"הבדיקה בוצעה בשיטה חזותית בשילוב מכשור מתאים. לא בוצעו בדיקות הרסניות. הבדיקה מתייחסת למצב הנכס ביום הבדיקה בלבד."}
      </div>
      <Sec>הערות לתמחור</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.7}}>
        <div>{"• המחירים מבוססים על עבודות תיקון המתבצעות ע\"י קבלן ראשי המחזיק צוות וציוד באזור."}</div>
        <div>{"• באם העבודות יבוצעו ע\"י קבלנים מזדמנים, יש לצפות למחירים גבוהים בשיעור של עד 20%-30%."}</div>
        <div>{"• המחירים צמודים למדד הבנייה הידוע בזמן עריכת הביקורת."}</div>
        <div>{"• במידה ולא יימצא ריצוף באותו גוון וטקסטורה — נדרש להחליף משטחים שלמים."}</div>
        <div>{"• האומדנים כוללים בצ\"מ (בלתי צפוי מכל מין) בשיעור 10% ופיקוח הנדסי בשיעור 10%."}</div>
      </div>
      <Sec>מגבלות הבדיקה</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.7}}>
        <div>{"• מרפסת שירות לא נגישה בעת הבדיקה."}</div>
        <div>{"• גג המבנה לא נבדק ישירות (גישה לא אפשרית)."}</div>
        <div>{"• הבדיקה אינה כוללת מערכות מוסתרות (צנרת בתוך קירות, חיווט מוסתר)."}</div>
      </div>
      <Sec>תיאור הנכס</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.8}}>
        {[
          ["סוג הנכס:","דירת מגורים, 4 חדרים"],
          ["הנכס כולל:","חדר דיור (סלון), מטבח, מסדרון, 2 חדרי שינה, חדר רחצה, ממ\"ד, מרפסת"],
          ["הנכס מאוכלס:","לא"],
          ["חיבור לחשמל:","יש"],
          ["חיבור למים:","יש"],
        ].map(([l,v],i)=><div key={i} style={{display:"flex",gap:4}}>
          <span style={{color:lt,fontWeight:500}}>{l}</span><span style={{fontWeight:500,color:dk}}>{v}</span>
        </div>)}
      </div>
      <Foot n={6} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 7. DETAILS ═══ */}
    {page===6&&<div style={ps}>
      <Header crumb="פרטי הבדיקה"/>
      <Sec>פרטי המפקח</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.8}}>
        {[["שם:","מהנדס דני לוין"],["מ.ר.:","54321"],["השכלה:","B.Sc הנדסה אזרחית — הטכניון"],["ניסיון:","12 שנה בפיקוח ובדק בית"],["טלפון:","050-111-2233"],["אימייל:","dani@inspect.co.il"]].map(([l,v],i)=>
          <div key={i} style={{display:"flex",gap:4}}><span style={{color:lt,fontWeight:500,minWidth:50}}>{l}</span><span style={{fontWeight:500,color:dk}}>{v}</span></div>
        )}
      </div>
      <Sec>פרטי הנכס</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.8}}>
        {[["פרויקט:","פארק הירקון"],["כתובת:","שד' רוטשילד 45, תל אביב"],["דירה:","דירה 12, קומה 4"],["שטח:",'120 מ"ר'],["קבלן:","שיכון ובינוי"]].map(([l,v],i)=>
          <div key={i} style={{display:"flex",gap:4}}><span style={{color:lt,fontWeight:500,minWidth:50}}>{l}</span><span style={{fontWeight:500,color:dk}}>{v}</span></div>
        )}
      </div>
      <Sec>פרטי המזמין</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.8}}>
        {[["שם:","דוד ושרה לוי"],["טלפון:","050-123-4567"],["אימייל:","david@email.com"]].map(([l,v],i)=>
          <div key={i} style={{display:"flex",gap:4}}><span style={{color:lt,fontWeight:500,minWidth:50}}>{l}</span><span style={{fontWeight:500,color:dk}}>{v}</span></div>
        )}
      </div>
      <Sec>כלים בשימוש</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,display:"flex",flexWrap:"wrap",gap:6}}>
        {["מצלמה תרמית (FLIR)","מד רטיבות","מד מפלס","פלס לייזר","מצלמה 48MP"].map((t,i)=>
          <span key={i} style={{display:"flex",alignItems:"center",gap:3}}><span style={{color:accent}}>✓</span>{t}</span>
        )}
      </div>
      <Foot n={7} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 8. DEFECTS 1 — with price×qty, 3 photos per row ═══ */}
    {page===7&&<div style={ps}>
      <Header crumb="ממצאים · אינסטלציה"/>
      <Sub>8.1 אינסטלציה</Sub>
      <DefectFull num={1} severity="high"
        title={"נזילה בצנרת מים קרים מתחת לכיור המטבח"}
        location={"מטבח"}
        standard={'ת"י 1205.1 סעיף 3.2'}
        standardText={'"כל חיבורי צנרת יהיו אטומים ועמידים בלחץ עבודה"'}
        recommendation={"החלפת אטם בחיבור הצנרת, בדיקת לחץ חוזרת"}
        unitPrice={850} qty={1} unit={"קומפ'"}
        note={"נזילה מתמשכת, נדרש טיפול דחוף"}
        photos={3} annotated
        annexRef={'נספח A.1: ת"י 1205.1 סעיף 3.2 — ראה עמוד 13'}
      />
      <DefectFull num={2} severity="medium"
        title={"ניקוז איטי במקלחת ראשית — חסימה חלקית"}
        location={"חדר רחצה"}
        standard={'ת"י 1205.1 סעיף 4.1'}
        standardText={'"כל נקודת ניקוז תפעל ללא חסימה"'}
        recommendation={"פירוק וניקוי סיפון, בדיקת שיפוע ניקוז"}
        unitPrice={1200} qty={1} unit={"קומפ'"}
        photos={2}
      />
      <Foot n={8} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 9. DEFECTS 2 ═══ */}
    {page===8&&<div style={ps}>
      <Header crumb="ממצאים · המשך"/>
      <Sub>8.2 ריצוף</Sub>
      <DefectFull num={3} severity="medium"
        title={"אריח שבור בכניסה לדירה — סדק אלכסוני"}
        location={"מבואת כניסה"}
        standard={'ת"י 1555 סעיף 2.3.1'}
        standardText={'"אריחים יהיו שלמים ללא סדקים או שברים"'}
        recommendation={"החלפת אריח פגום והדבקה מחדש"}
        unitPrice={350} qty={1} unit={"קומפ'"}
        photos={3}
        annexRef={'נספח A.2: ת"י 1555 סעיף 2.3.1 — ראה עמוד 13'}
      />
      <Sub>8.3 אלומיניום</Sub>
      <DefectFull num={4} severity="low"
        title={"חלון חדר שינה — ידית לא נסגרת עד הסוף"}
        location={"חדר שינה 1"}
        standard={'ת"י 23 סעיף 5.4'}
        standardText={'"חלונות ייסגרו באופן מלא ואטום"'}
        recommendation={"החלפת ידית חלון וכיוון מנגנון נעילה"}
        unitPrice={600} qty={1} unit={"קומפ'"}
        note={"ייתכן שהבעיה נובעת מעיוות במסגרת"}
        photos={2}
      />
      <Sub>8.4 טיח וצבע</Sub>
      <DefectFull num={5} severity="medium"
        title={'סדק אנכי בקיר סלון — אורך 45 ס"מ'}
        location={"סלון, קיר מזרחי"}
        standard={'ת"י 1920 סעיף 6.1'}
        standardText={'"טיח יהיה אחיד ללא סדקים"'}
        recommendation={"הרחבת טיח באזור הסדק, מילוי וצביעה מחדש"}
        unitPrice={450} qty={1} unit={"קומפ'"}
        photos={2}
      />
      <Foot n={9} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 10. BOQ — enhanced with contingency + supervision + VAT 18% ═══ */}
    {page===9&&<div style={ps}>
      <Header crumb="כתב כמויות"/>
      <div style={{fontSize:13,fontWeight:700,color:dk,marginBottom:6}}>כתב כמויות — אומדן עלויות</div>
      <div style={{border:"1px solid "+bdr,borderRadius:2,overflow:"hidden",fontSize:8}}>
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 56px 36px 60px",background:dk,color:"#fff",padding:"4px 6px",fontWeight:600,fontSize:7}}>
          <span>#</span><span>תיאור</span><span style={{textAlign:"left"}}>מחיר/יח'</span><span style={{textAlign:"left"}}>כמות</span><span style={{textAlign:"left"}}>סה"כ (₪)</span>
        </div>
        {/* Category: אינסטלציה */}
        <div style={{padding:"3px 6px",background:accentLt,fontWeight:700,fontSize:7.5,color:accent}}>אינסטלציה</div>
        {[
          {n:"1",t:"החלפת אטם בצנרת מטבח + בדיקת לחץ",u:"850",q:"1",s:"850"},
          {n:"2",t:"פירוק וניקוי סיפון מקלחת + שיפוע",u:"1,200",q:"1",s:"1,200"},
        ].map((r,i)=>
          <div key={"a"+i} style={{display:"grid",gridTemplateColumns:"28px 1fr 56px 36px 60px",padding:"3px 6px",borderBottom:"1px solid "+bdrLt}}>
            <span style={{fontWeight:600}}>{r.n}</span><span>{r.t}</span><span style={{textAlign:"left"}}>{r.u}</span><span style={{textAlign:"left"}}>{r.q}</span><span style={{textAlign:"left",fontWeight:600}}>{r.s}</span>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 60px",padding:"3px 6px",background:bg,borderBottom:"1px solid "+bdr,fontWeight:600,fontSize:7.5}}>
          <span></span><span style={{color:lt}}>סה"כ אינסטלציה</span><span style={{textAlign:"left"}}>2,050</span>
        </div>
        {/* Category: ריצוף */}
        <div style={{padding:"3px 6px",background:accentLt,fontWeight:700,fontSize:7.5,color:accent}}>ריצוף</div>
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 56px 36px 60px",padding:"3px 6px",borderBottom:"1px solid "+bdrLt}}>
          <span style={{fontWeight:600}}>3</span><span>החלפת אריח פגום + הדבקה</span><span style={{textAlign:"left"}}>350</span><span style={{textAlign:"left"}}>1</span><span style={{textAlign:"left",fontWeight:600}}>350</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 60px",padding:"3px 6px",background:bg,borderBottom:"1px solid "+bdr,fontWeight:600,fontSize:7.5}}>
          <span></span><span style={{color:lt}}>סה"כ ריצוף</span><span style={{textAlign:"left"}}>350</span>
        </div>
        {/* Category: אלומיניום */}
        <div style={{padding:"3px 6px",background:accentLt,fontWeight:700,fontSize:7.5,color:accent}}>אלומיניום</div>
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 56px 36px 60px",padding:"3px 6px",borderBottom:"1px solid "+bdrLt}}>
          <span style={{fontWeight:600}}>4</span><span>החלפת ידית חלון + כיוון מנגנון</span><span style={{textAlign:"left"}}>600</span><span style={{textAlign:"left"}}>1</span><span style={{textAlign:"left",fontWeight:600}}>600</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 60px",padding:"3px 6px",background:bg,borderBottom:"1px solid "+bdr,fontWeight:600,fontSize:7.5}}>
          <span></span><span style={{color:lt}}>סה"כ אלומיניום</span><span style={{textAlign:"left"}}>600</span>
        </div>
        {/* Category: טיח וצבע */}
        <div style={{padding:"3px 6px",background:accentLt,fontWeight:700,fontSize:7.5,color:accent}}>טיח וצבע</div>
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 56px 36px 60px",padding:"3px 6px",borderBottom:"1px solid "+bdrLt}}>
          <span style={{fontWeight:600}}>5</span><span>תיקון סדק + מילוי + צביעה</span><span style={{textAlign:"left"}}>450</span><span style={{textAlign:"left"}}>1</span><span style={{textAlign:"left",fontWeight:600}}>450</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 60px",padding:"3px 6px",background:bg,borderBottom:"1px solid "+bdr,fontWeight:600,fontSize:7.5}}>
          <span></span><span style={{color:lt}}>סה"כ טיח וצבע</span><span style={{textAlign:"left"}}>450</span>
        </div>
        {/* Totals */}
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 60px",padding:"4px 6px",background:bg,fontWeight:700,borderTop:"2px solid "+bdr}}>
          <span></span><span style={{color:dk}}>סה"כ ביניים</span><span style={{textAlign:"left"}}>3,450</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 60px",padding:"3px 6px",background:bg}}>
          <span></span><span style={{color:md}}>בצ"מ (10%)</span><span style={{textAlign:"left"}}>345</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 60px",padding:"3px 6px",background:bg}}>
          <span></span><span style={{color:md}}>פיקוח הנדסי (10%)</span><span style={{textAlign:"left"}}>380</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 60px",padding:"4px 6px",background:bg,fontWeight:700,borderTop:"1px solid "+bdr}}>
          <span></span><span style={{color:dk}}>סה"כ לפני מע"מ</span><span style={{textAlign:"left"}}>4,175</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 60px",padding:"3px 6px",background:bg}}>
          <span></span><span style={{color:md}}>מע"מ (18%)</span><span style={{textAlign:"left"}}>751</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 60px",padding:"5px 6px",background:dk,color:"#fff",fontWeight:700}}>
          <span></span><span>סה"כ כולל מע"מ</span><span style={{textAlign:"left"}}>4,926</span>
        </div>
      </div>
      <Foot n={10} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 11. BOQ NOTES — NEW ═══ */}
    {page===10&&<div style={ps}>
      <Header crumb="הערות להערכה כספית"/>
      <div style={{fontSize:13,fontWeight:700,color:dk,marginBottom:6}}>הערות להערכה כספית</div>
      <div style={{padding:"6px 10px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.8}}>
        <div>{"• המחירים מתבססים על עבודות תיקון המתבצעות ע\"י קבלן ראשי המחזיק צוות וציוד באזור."}</div>
        <div>{"• באם העבודות יבוצעו ע\"י קבלנים מזדמנים — יש לצפות למחירים גבוהים מהנקובים, בשיעור של עד 20%-30%."}</div>
        <div>{"• המחירים צמודים למדד הבנייה הידוע בזמן עריכת הביקורת."}</div>
        <div>{"• במידה ולא יימצא ריצוף באותו גוון וטקסטורה כך שלא ניתן יהיה להבחין בין אריח \"חדש\" ל\"ישן\" — נדרש להחליף משטחים שלמים."}</div>
        <div>{"• לצורך ביצוע התיקונים יידרש זמן סביר של כשבועיים בהם לא יוכלו הדיירים לקיים אורח חיים סביר בדירה."}</div>
        <div>{"• מומלץ לבדוק ע\"י מעבדה מוסמכת אטימות חלל הממ\"ד נגד גזים."}</div>
        <div>{"• מומלץ לבדוק ע\"י מעבדה מוסמכת תכונות פיזיקליות של אבן חיפוי/מערכת חיפוי/הידבקות האבן לתשתית."}</div>
      </div>
      <Sec>סיכום כמותי</Sec>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:5,margin:"4px 0"}}>
        {[{l:"ממצאים",v:"5",b:bg},{l:"תמונות",v:"13",b:bg},{l:"קטגוריות",v:"4",b:bg},{l:"עלות כוללת",v:"₪4,926",b:accentLt}].map((s,i)=>
          <div key={i} style={{textAlign:"center",padding:"6px 3px",background:s.b,borderRadius:3,border:"1px solid "+bdrLt}}>
            <div style={{fontSize:14,fontWeight:700,color:dk}}>{s.v}</div>
            <div style={{fontSize:6.5,color:lt,marginTop:1}}>{s.l}</div>
          </div>
        )}
      </div>
      <Foot n={11} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 12. SIGNATURES ═══ */}
    {page===11&&<div style={ps}>
      <Header crumb="חתימות ואישורים"/>
      <div style={{fontSize:13,fontWeight:700,color:dk,marginBottom:6}}>חתימות ואישורים</div>
      <Sec>הצהרת המפקח</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.7,color:md}}>
        {"אני הח\"מ, מהנדס דני לוין, מ.ר. 54321, מצהיר בזה כי ביצעתי בדיקת בדק בית בנכס המפורט בדוח זה בתאריך 25.03.2026. הממצאים משקפים את מצב הנכס בעת הבדיקה על פי מיטב ידיעתי המקצועית."}
      </div>
      <Sec>אישור המזמין</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.7,color:md}}>
        {"הריני מאשר/ת שקיבלתי את הדוח, קראתי והבנתי את תוכנו ומשמעותו. ידוע לי כי הדוח מהווה חוות דעת מקצועית ואינו מחליף ייעוץ משפטי."}
      </div>
      <div style={{marginTop:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:8,fontWeight:600,color:dk,marginBottom:4}}>חתימת המפקח</div>
          <div style={{height:50,border:"1px solid "+bdr,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:vlt,fontStyle:"italic",background:bg}}>[חתימה דיגיטלית]</div>
          <div style={{fontSize:8,color:dk,marginTop:3,fontWeight:600}}>מהנדס דני לוין</div>
          <div style={{fontSize:7,color:lt}}>מ.ר. 54321 · 25.03.2026</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:8,fontWeight:600,color:dk,marginBottom:4}}>חתימת המזמין</div>
          <div style={{height:50,border:"1px solid "+bdr,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:vlt,fontStyle:"italic",background:bg}}>[חתימה דיגיטלית]</div>
          <div style={{fontSize:8,color:dk,marginTop:3,fontWeight:600}}>דוד לוי</div>
          <div style={{fontSize:7,color:lt}}>25.03.2026</div>
        </div>
      </div>
      <div style={{marginTop:10,padding:"6px 10px",border:"1px dashed "+bdr,borderRadius:2,display:"flex",alignItems:"center",gap:10,background:bg}}>
        <div style={{width:50,height:50,borderRadius:25,border:"2px solid "+accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:accent,fontWeight:700,background:accentLt,textAlign:"center",lineHeight:1.2}}>חותמת<br/>מהנדס</div>
        <div style={{fontSize:7.5,color:lt,lineHeight:1.5,flex:1}}>
          <div style={{fontWeight:600,color:dk,fontSize:8}}>חותמת מקצועית</div>
          <div>מהנדס דני לוין · מ.ר. 54321 · תקף עד 12/2028</div>
        </div>
      </div>
      <Foot n={12} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 13. APPENDIX ═══ */}
    {page===12&&<div style={ps}>
      <Header crumb="נספחי תקנים"/>
      <div style={{fontSize:13,fontWeight:700,color:dk,marginBottom:4}}>נספחי תקנים</div>
      <div style={{fontSize:8,color:lt,marginBottom:8}}>ציטוטים מהתקנים שצוטטו בגוף הדוח.</div>
      <div style={{padding:"8px 10px",border:"1px solid "+bdr,borderRadius:2,background:bg,marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
          <div style={{fontSize:9,fontWeight:700,color:dk}}>נספח A.1 — ת"י 1205.1 סעיף 3.2</div>
          <div style={{fontSize:7,color:lt}}>ליקוי #1</div>
        </div>
        <div style={{fontSize:7.5,color:md,lineHeight:1.7,padding:"5px 8px",background:"white",border:"1px dashed "+bdrLt,borderRadius:2}}>
          {'"3.2 אטימות חיבורים: כל חיבורי הצנרת למים קרים וחמים יהיו אטומים לחלוטין בלחץ העבודה המרבי הצפוי במערכת, בתוספת מקדם בטיחות של 25%."'}
        </div>
        <div style={{fontSize:7,color:lt,marginTop:3,fontStyle:"italic"}}>מקור: ת"י 1205.1 — מערכות מים קרים וחמים, מכון התקנים הישראלי.</div>
      </div>
      <div style={{padding:"8px 10px",border:"1px solid "+bdr,borderRadius:2,background:bg}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
          <div style={{fontSize:9,fontWeight:700,color:dk}}>נספח A.2 — ת"י 1555 סעיף 2.3.1</div>
          <div style={{fontSize:7,color:lt}}>ליקוי #3</div>
        </div>
        <div style={{fontSize:7.5,color:md,lineHeight:1.7,padding:"5px 8px",background:"white",border:"1px dashed "+bdrLt,borderRadius:2}}>
          {'"2.3.1 שלמות אריחים: אריחי קרמיקה ופורצלן יהיו שלמים, ללא סדקים, שברים או פגמים ויזואליים. אריח פגום יוחלף לפני מסירה לדייר."'}
        </div>
        <div style={{fontSize:7,color:lt,marginTop:3,fontStyle:"italic"}}>מקור: ת"י 1555 — ריצופים וחיפויים קראמיים, מכון התקנים הישראלי.</div>
      </div>
      <Foot n={13} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 14. BACK COVER ═══ */}
    {page===13&&<div style={{...ps,justifyContent:"space-between"}}>
      <Header crumb="פרטי קשר וכתב ויתור"/>
      <div>
        <div style={{fontSize:13,fontWeight:700,color:dk,marginBottom:6}}>פרטי קשר וכתב ויתור</div>
        <Sec>פרטי המפקח</Sec>
        <div style={{padding:"6px 10px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8.5,lineHeight:1.9}}>
          <div style={{fontSize:10,fontWeight:700,color:dk,marginBottom:2}}>מהנדס דני לוין</div>
          <div style={{color:lt,fontSize:8}}>מהנדס אזרחי מוסמך · מ.ר. 54321</div>
          <div style={{marginTop:4}}><span style={{color:lt}}>{"טלפון: "}</span><span style={{color:dk,fontWeight:500}}>050-111-2233</span></div>
          <div><span style={{color:lt}}>{"אימייל: "}</span><span style={{color:dk,fontWeight:500}}>dani@inspect.co.il</span></div>
          <div><span style={{color:lt}}>{"כתובת: "}</span><span style={{color:dk,fontWeight:500}}>רח' הרצל 10, תל אביב</span></div>
        </div>
        <Sec>כתב ויתור</Sec>
        <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:7,lineHeight:1.6,color:lt}}>
          {"1. דוח זה מהווה חוות דעת הנדסית מקצועית ואינו תחליף לייעוץ משפטי. 2. הממצאים מבוססים על בדיקה חזותית ומכשור. לא בוצעו בדיקות הרסניות. 3. האומדנים הם הערכה מקצועית ואינם מחייבים. 4. המפקח אינו אחראי לליקויים נסתרים. 5. הדוח תקף למצב הנכס בתאריך הבדיקה בלבד. 6. כל הזכויות שמורות © 2026."}
        </div>
      </div>
      <div style={{marginTop:10,textAlign:"center"}}>
        <Logo big/>
        <div style={{fontSize:7,color:vlt,marginTop:6}}>הופק באמצעות inField · www.infield.co.il</div>
      </div>
      <Foot n={14} total={TOTAL} title={rptTitle}/>
    </div>}

    <div style={{fontSize:9,color:"#999",textAlign:"center",padding:"4px 0 12px",direction:"rtl"}}>
      מוקאפ דוח בדק בית — inField v3 Final (14 עמודים · 3 קהלים · מבוסס דוח אמיתי)
    </div>
  </div>
}
