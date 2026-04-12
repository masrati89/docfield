import { useState } from "react";

// ═══ PDF DESIGN SYSTEM v2 — 12 pages, 3 audiences (tenant/contractor/lawyer), ~100 pages ═══
const dk="#1a1a1a", md="#444", lt="#777", vlt="#aaa", bg="#FEFDFB";
const bdr="#D1CEC8", bdrLt="#F5EFE6", bdrDk="#A8A49D";
const accent="#1B7A44", accentLt="#F0F7F4", accentMd="#D1E7DD";
// Severity palette — calm but distinct
const sevColors = {
  critical: { bg:"#FDECEC", fg:"#B42318", bdr:"#F4C1C1", label:"קריטי" },
  high:     { bg:"#FFF4E5", fg:"#B54708", bdr:"#F5D0A9", label:"גבוה" },
  medium:   { bg:"#FEF7E0", fg:"#8A6D1C", bdr:"#EEE0B0", label:"בינוני" },
  low:      { bg:"#ECF6EF", fg:"#2B6B3F", bdr:"#CDE5D4", label:"נמוך" },
};

function Img({anno}){return <div style={{position:"relative",width:56,height:42,borderRadius:2,background:"#F5EFE6",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+bdrLt,overflow:"hidden"}}>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1CEC8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
  {anno&&<><div style={{position:"absolute",top:8,right:10,width:14,height:14,borderRadius:7,border:"1.5px solid #B42318",background:"transparent"}}/><svg style={{position:"absolute",bottom:6,left:6}} width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="#B42318" strokeWidth="1.5"><path d="M1 6 L18 6 M14 2 L18 6 L14 10"/></svg></>}
</div>}

function Logo({big}){return <div style={{width:big?120:40,height:big?48:16,border:"1px solid "+bdrLt,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:big?14:6,color:big?md:vlt,fontWeight:big?600:400}}>{big?"לוגו מפקח":"LOGO"}</div>}

// Consistent header bar on every content page (brief orientation + page number up top)
function Header({crumb,logo=true}){return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:6,marginBottom:8,borderBottom:"1px solid "+bdrLt}}>
  <div style={{fontSize:7.5,color:lt,display:"flex",gap:3,alignItems:"center"}}>
    <span style={{color:accent,fontWeight:600}}>דוח בדק בית</span>
    <span style={{color:vlt}}>›</span>
    <span>{crumb}</span>
  </div>
  {logo&&<Logo/>}
</div>}

function Sec({children}){return <div style={{fontSize:10,fontWeight:700,color:dk,padding:"4px 0 2px",borderBottom:"1px solid "+bdr,marginTop:8,marginBottom:4}}>{children}</div>}
function Sub({children}){return <div style={{fontSize:10,fontWeight:700,color:accent,padding:"4px 8px 3px",margin:"6px 0 3px",background:accentLt,borderRight:"3px solid "+accent,borderRadius:"0 2px 2px 0"}}>{children}</div>}

function Foot({n,total,title}){return <div style={{marginTop:"auto",paddingTop:6,borderTop:"1px solid "+bdr,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:7,color:vlt}}>
  <Logo/><span>עמוד {n} מתוך {total}</span><span>{title} — BB-2026-0142 — 25.03.2026</span>
</div>}

function SevBadge({level}){const c=sevColors[level];return <span style={{fontSize:6.5,fontWeight:700,color:c.fg,background:c.bg,border:"1px solid "+c.bdr,padding:"1px 5px",borderRadius:8,letterSpacing:-.2}}>{c.label}</span>}

function DefectFull({num,severity,title,location,standard,standardText,recommendation,cost,note,photos=0,annotated=false,annexText}){
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
      <div style={{fontSize:8,fontWeight:700,color:accent,flexShrink:0,background:accentLt,padding:"2px 6px",borderRadius:10}}>{cost}</div>
    </div>
    <div style={{margin:"4px 0 3px",marginRight:26,padding:"3px 6px",background:bg,borderRight:"2px solid "+accent,fontSize:7.5,color:md,lineHeight:1.5}}>
      <span style={{fontWeight:600,color:dk}}>{standard}</span>{" — "}{standardText}
    </div>
    <div style={{margin:"3px 0 0",marginRight:26,fontSize:7.5,color:md}}>
      <span style={{fontWeight:600,color:accent}}>{"המלצה: "}</span>{recommendation}
    </div>
    {note&&<div style={{margin:"2px 0 0",marginRight:26,fontSize:7,color:lt,fontStyle:"italic"}}>
      {"הערה: "}{note}
    </div>}
    {photos>0&&<div style={{display:"flex",gap:3,marginTop:4,marginRight:26,flexWrap:"wrap"}}>
      {Array.from({length:Math.min(photos,6)}).map((_,i)=><Img key={i} anno={annotated&&i===0}/>)}
    </div>}
    {annexText&&<div style={{margin:"4px 0 2px",marginRight:26,padding:"3px 6px",background:bg,borderRadius:2,fontSize:7,color:lt,display:"flex",alignItems:"center",gap:4}}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={lt} strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
      {annexText}
    </div>}
  </div>
}

export default function BedekPDFv2(){
  const [page,setPage]=useState(0);
  const rptTitle = "דוח בדק בית";
  const TOTAL = 12;
  const ps={width:"100%",maxWidth:520,aspectRatio:"210/297",background:"white",borderRadius:2,boxShadow:"0 2px 12px rgba(60,54,42,.10)",padding:"20px 24px",display:"flex",flexDirection:"column",fontFamily:"'Rubik',sans-serif",direction:"rtl",fontSize:8,color:md,lineHeight:1.5,overflow:"hidden"};
  const labels=["שער","תקציר","תוכן","מפתח","פרטים","ממצאים 1","ממצאים 2","כת\"כ","חתימות","נספח","אחורה","מקרא"];

  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"16px 8px",background:"#F5EFE6",minHeight:"100vh"}}>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
    <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center",maxWidth:560}}>
      {labels.map((l,i)=><button key={i} onClick={()=>setPage(i)} style={{padding:"6px 10px",borderRadius:4,border:"1px solid "+(page===i?accent:bdr),background:page===i?accentLt:"#fff",color:page===i?accent:"#666",fontSize:10,cursor:"pointer",fontFamily:"inherit",fontWeight:page===i?600:400}}>{i+1}. {l}</button>)}
    </div>

    {/* ═══ 1. COVER — enhanced with big logo ═══ */}
    {page===0&&<div style={{...ps,justifyContent:"center",alignItems:"center",textAlign:"center"}}>
      <div style={{marginBottom:20}}><Logo big/></div>
      <div style={{width:160,height:1,background:dk,marginBottom:20}}/>
      <div style={{fontSize:24,fontWeight:700,color:dk,letterSpacing:-.5,marginBottom:6}}>{rptTitle}</div>
      <div style={{fontSize:11,color:lt,marginBottom:6}}>בדיקת קבלה לדירה חדשה</div>
      <div style={{fontSize:9,color:accent,fontWeight:600,marginBottom:20,padding:"3px 10px",border:"1px solid "+accentMd,borderRadius:10,background:accentLt}}>סבב בדיקה ראשון</div>
      <div style={{width:160,height:1,background:bdr,marginBottom:16}}/>
      <div style={{fontSize:9,color:md,lineHeight:2,textAlign:"center"}}>
        <div><span style={{color:lt}}>{"פרויקט: "}</span><span style={{fontWeight:600}}>פארק הירקון</span></div>
        <div><span style={{color:lt}}>{"כתובת: "}</span><span style={{fontWeight:600}}>שד' רוטשילד 45, תל אביב</span></div>
        <div><span style={{color:lt}}>{"דירה: "}</span><span style={{fontWeight:600}}>דירה 12, קומה 4</span></div>
        <div><span style={{color:lt}}>{"מזמין: "}</span><span style={{fontWeight:600}}>דוד ושרה לוי</span></div>
        <div><span style={{color:lt}}>{"מפקח: "}</span><span style={{fontWeight:600}}>מהנדס דני לוין, מ.ר. 54321</span></div>
        <div><span style={{color:lt}}>{"תאריך בדיקה: "}</span><span style={{fontWeight:600}}>25.03.2026</span></div>
        <div><span style={{color:lt}}>{"מספר דוח: "}</span><span style={{fontWeight:600}}>BB-2026-0142</span></div>
      </div>
      <div style={{width:160,height:1,background:bdr,marginTop:20,marginBottom:12}}/>
      <div style={{fontSize:7,color:vlt,maxWidth:320,lineHeight:1.6}}>מסמך זה הוא חוות דעת הנדסית מקצועית המהווה מסמך משפטי. כל הזכויות שמורות למהנדס דני לוין © 2026.</div>
    </div>}

    {/* ═══ 2. EXECUTIVE SUMMARY — NEW — for lawyers/contractors to scan in 30 seconds ═══ */}
    {page===1&&<div style={ps}>
      <Header crumb="תקציר מנהלים"/>
      <div style={{fontSize:14,fontWeight:700,color:dk,marginBottom:8}}>תקציר מנהלים</div>
      <div style={{fontSize:8,color:md,lineHeight:1.7,marginBottom:10}}>
        {"דירה 12 בפרויקט פארק הירקון נבדקה ב-25.03.2026. הבדיקה העלתה 5 ליקויים המחייבים תיקון לפני קבלת הדירה. סך העלות המשוערת לתיקון הליקויים עומד על ₪4,036 כולל מע\"מ. הליקויים מפורטים בגוף הדוח, מקוטלגים לפי קטגוריות מקצועיות ומגובים בציטוטי תקנים ישראליים רלוונטיים."}
      </div>
      <Sec>מצב כללי של הנכס</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.6,marginBottom:6}}>
        {"הדירה במצב טוב כללי. לא נמצאו ליקויים מבניים או בטיחותיים חמורים. הליקויים שנמצאו הם ליקויי גמר אופייניים לדירה חדשה הניתנים לתיקון מלא על ידי הקבלן."}
      </div>
      <Sec>התפלגות ממצאים לפי חומרה</Sec>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:5,margin:"4px 0 8px"}}>
        {[
          {level:"critical",count:0},
          {level:"high",count:1},
          {level:"medium",count:3},
          {level:"low",count:1},
        ].map((s,i)=>{const c=sevColors[s.level];return <div key={i} style={{textAlign:"center",padding:"6px 3px",background:c.bg,borderRadius:3,border:"1px solid "+c.bdr}}>
          <div style={{fontSize:16,fontWeight:700,color:c.fg}}>{s.count}</div>
          <div style={{fontSize:6.5,color:c.fg,marginTop:1,fontWeight:600}}>{c.label}</div>
        </div>})}
      </div>
      <Sec>המלצה מקצועית</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+accentMd,borderRadius:2,background:accentLt,fontSize:8,lineHeight:1.6,marginBottom:6}}>
        <span style={{fontWeight:600,color:accent}}>{"מומלץ: "}</span>
        {"לדרוש מהקבלן תיקון מלא של כלל הליקויים המפורטים בדוח זה, לפני חתימה על פרוטוקול מסירה. יש לקיים בדיקת סבב שני לאחר השלמת התיקונים."}
      </div>
      <Sec>אחריות משפטית</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:7.5,lineHeight:1.6,color:lt}}>
        {"דוח זה ניתן להצגה מול הקבלן, ועדת אכלוס, ערכאות משפטיות או חברת ביטוח. הוא מהווה חוות דעת מקצועית של מהנדס רשום בפנקס המהנדסים והאדריכלים."}
      </div>
      <Foot n={2} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 3. TABLE OF CONTENTS — NEW — mandatory for 100-page documents ═══ */}
    {page===2&&<div style={ps}>
      <Header crumb="תוכן עניינים"/>
      <div style={{fontSize:14,fontWeight:700,color:dk,marginBottom:10}}>תוכן עניינים</div>
      <div style={{fontSize:8.5,lineHeight:2}}>
        {[
          {n:"1",t:"שער הדוח",p:"1",bold:true},
          {n:"2",t:"תקציר מנהלים",p:"2",bold:true},
          {n:"3",t:"תוכן עניינים",p:"3",bold:true},
          {n:"4",t:"מפתח ליקויים",p:"4",bold:true},
          {n:"5",t:"פרטי הבדיקה",p:"5",bold:true},
          {n:"5.1",t:"פרטי המפקח",p:"5"},
          {n:"5.2",t:"פרטי הנכס",p:"5"},
          {n:"5.3",t:"פרטי המזמין",p:"5"},
          {n:"5.4",t:"תנאי הבדיקה",p:"5"},
          {n:"5.5",t:"כלים ומתודולוגיה",p:"5"},
          {n:"6",t:"ממצאים מפורטים",p:"6",bold:true},
          {n:"6.1",t:"אינסטלציה",p:"6"},
          {n:"6.2",t:"ריצוף",p:"7"},
          {n:"6.3",t:"אלומיניום",p:"7"},
          {n:"6.4",t:"טיח וצבע",p:"7"},
          {n:"7",t:"כתב כמויות ואומדן עלויות",p:"8",bold:true},
          {n:"8",t:"חתימות ואישורים",p:"9",bold:true},
          {n:"9",t:"נספחי תקנים",p:"10",bold:true},
          {n:"10",t:"פרטי קשר וכתב ויתור",p:"11",bold:true},
        ].map((r,i)=><div key={i} style={{display:"flex",alignItems:"baseline",gap:6,paddingRight:r.bold?0:12}}>
          <span style={{fontWeight:r.bold?700:500,color:r.bold?dk:md,minWidth:24}}>{r.n}</span>
          <span style={{flex:1,fontWeight:r.bold?600:400,color:r.bold?dk:md}}>{r.t}</span>
          <span style={{flex:1,borderBottom:"1px dotted "+bdr,margin:"0 4px",height:1,alignSelf:"center"}}/>
          <span style={{fontWeight:600,color:r.bold?dk:lt,minWidth:16,textAlign:"left"}}>{r.p}</span>
        </div>)}
      </div>
      <Foot n={3} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 4. DEFECT INDEX MATRIX — NEW — scannable by category + severity ═══ */}
    {page===3&&<div style={ps}>
      <Header crumb="מפתח ליקויים"/>
      <div style={{fontSize:14,fontWeight:700,color:dk,marginBottom:4}}>מפתח ליקויים</div>
      <div style={{fontSize:8,color:lt,marginBottom:8}}>טבלה מהירה לניווט. לפירוט מלא, פנה לעמוד הרלוונטי.</div>
      <div style={{border:"1px solid "+bdr,borderRadius:2,overflow:"hidden",fontSize:8}}>
        <div style={{display:"grid",gridTemplateColumns:"28px 1fr 80px 60px 48px",background:dk,color:"#fff",padding:"5px 6px",fontWeight:600,fontSize:7.5}}>
          <span>#</span><span>תיאור</span><span>קטגוריה</span><span>חומרה</span><span style={{textAlign:"left"}}>עמ'</span>
        </div>
        {[
          {n:1,t:"נזילה בצנרת מים קרים — מטבח",cat:"אינסטלציה",sev:"high",p:"6"},
          {n:2,t:"ניקוז איטי — מקלחת ראשית",cat:"אינסטלציה",sev:"medium",p:"6"},
          {n:3,t:"אריח שבור — מבואת כניסה",cat:"ריצוף",sev:"medium",p:"7"},
          {n:4,t:"ידית חלון — חדר שינה 1",cat:"אלומיניום",sev:"low",p:"7"},
          {n:5,t:'סדק אנכי 45 ס"מ — סלון',cat:"טיח וצבע",sev:"medium",p:"7"},
        ].map((r,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"28px 1fr 80px 60px 48px",padding:"5px 6px",borderBottom:"1px solid "+bdrLt,alignItems:"center",fontSize:8}}>
          <span style={{fontWeight:700,color:dk}}>{r.n}</span>
          <span style={{color:md}}>{r.t}</span>
          <span style={{color:accent,fontWeight:500}}>{r.cat}</span>
          <span><SevBadge level={r.sev}/></span>
          <span style={{textAlign:"left",color:lt,fontWeight:500}}>{r.p}</span>
        </div>)}
      </div>
      <Sec>מקרא חומרת ליקוי</Sec>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",fontSize:7.5,color:md,lineHeight:1.6}}>
        <div style={{display:"flex",gap:3,alignItems:"center"}}><SevBadge level="critical"/><span>סכנה מיידית, טיפול דחוף</span></div>
        <div style={{display:"flex",gap:3,alignItems:"center"}}><SevBadge level="high"/><span>דרוש תיקון לפני מסירה</span></div>
        <div style={{display:"flex",gap:3,alignItems:"center"}}><SevBadge level="medium"/><span>ליקוי גמר משמעותי</span></div>
        <div style={{display:"flex",gap:3,alignItems:"center"}}><SevBadge level="low"/><span>ליקוי קוסמטי</span></div>
      </div>
      <Foot n={4} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 5. DETAILS — same as v1, with header added ═══ */}
    {page===4&&<div style={ps}>
      <Header crumb="פרטי הבדיקה"/>
      <Sec>פרטי המפקח</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.8}}>
        {[["שם:","מהנדס דני לוין"],["מ.ר.:","54321"],["השכלה:","B.Sc הנדסה אזרחית — הטכניון"],["ניסיון:","12 שנה בפיקוח ובדק בית"],["טלפון:","050-111-2233"],["אימייל:","dani@inspect.co.il"]].map(([l,v],i)=>
          <div key={i} style={{display:"flex",gap:4}}><span style={{color:lt,fontWeight:500}}>{l}</span><span style={{fontWeight:500,color:dk}}>{v}</span></div>
        )}
      </div>
      <Sec>פרטי הנכס</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.8}}>
        {[["פרויקט:","פארק הירקון"],["כתובת:","שד' רוטשילד 45, תל אביב"],["דירה:","דירה 12, קומה 4"],["שטח:",'120 מ"ר'],["קבלן:","שיכון ובינוי"],["מספר גוש/חלקה:","7104/88"]].map(([l,v],i)=>
          <div key={i} style={{display:"flex",gap:4}}><span style={{color:lt,fontWeight:500}}>{l}</span><span style={{fontWeight:500,color:dk}}>{v}</span></div>
        )}
      </div>
      <Sec>פרטי המזמין</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.8}}>
        {[["שם:","דוד ושרה לוי"],["טלפון:","050-123-4567"],["אימייל:","david@email.com"],["ת\"ז:","023456789 / 034567890"]].map(([l,v],i)=>
          <div key={i} style={{display:"flex",gap:4}}><span style={{color:lt,fontWeight:500}}>{l}</span><span style={{fontWeight:500,color:dk}}>{v}</span></div>
        )}
      </div>
      <Sec>תנאי הבדיקה</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.8}}>
        <div><span style={{color:lt}}>{"מטרה: "}</span>{"בדיקת ליקויי בנייה לפני קבלת דירה חדשה"}</div>
        <div><span style={{color:lt}}>{"משך בדיקה: "}</span>{"3 שעות"}</div>
        <div><span style={{color:lt}}>{"מזג אוויר: "}</span>{"בהיר, 22°C"}</div>
        <div><span style={{color:lt}}>{"מגבלות: "}</span>{"מרפסת שירות לא נגישה בעת הבדיקה"}</div>
      </div>
      <Sec>כלים ומתודולוגיה</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,display:"flex",flexWrap:"wrap",gap:6}}>
        {["מצלמה תרמית (FLIR)","מד רטיבות","מד מפלס","פלס לייזר","מצלמה 48MP","מד גזים","רולטקה דיגיטלית"].map((t,i)=>
          <span key={i} style={{display:"flex",alignItems:"center",gap:3}}><span style={{color:accent}}>✓</span>{t}</span>
        )}
      </div>
      <Foot n={5} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 6. DEFECTS 1 — with severity badges + annotated photo example ═══ */}
    {page===5&&<div style={ps}>
      <Header crumb="ממצאים · אינסטלציה"/>
      <Sub>6.1 אינסטלציה</Sub>
      <DefectFull num={1} severity="high"
        title={"נזילה בצנרת מים קרים מתחת לכיור המטבח"}
        location={"מטבח"}
        standard={'ת"י 1205.1 סעיף 3.2'}
        standardText={'"כל חיבורי צנרת יהיו אטומים ועמידים בלחץ עבודה"'}
        recommendation={"החלפת אטם בחיבור הצנרת, בדיקת לחץ חוזרת"}
        cost={"₪850"}
        note={"נזילה מתמשכת, נדרש טיפול דחוף. ההערה הזו תועדה בעת הבדיקה."}
        photos={3}
        annotated
        annexText={'נספח A.1: צילום סעיף 3.2 מתוך ת"י 1205.1 — ראה עמוד 10'}
      />
      <DefectFull num={2} severity="medium"
        title={"ניקוז איטי במקלחת ראשית — חסימה חלקית"}
        location={"חדר רחצה"}
        standard={'ת"י 1205.1 סעיף 4.1'}
        standardText={'"כל נקודת ניקוז תפעל ללא חסימה"'}
        recommendation={"פירוק וניקוי סיפון, בדיקת שיפוע ניקוז"}
        cost={"₪1,200"}
        photos={2}
      />
      <Foot n={6} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 7. DEFECTS 2 ═══ */}
    {page===6&&<div style={ps}>
      <Header crumb="ממצאים · המשך"/>
      <Sub>6.2 ריצוף</Sub>
      <DefectFull num={3} severity="medium"
        title={"אריח שבור בכניסה לדירה — סדק אלכסוני"}
        location={"מבואת כניסה"}
        standard={'ת"י 1555 סעיף 2.3.1'}
        standardText={'"אריחים יהיו שלמים ללא סדקים או שברים"'}
        recommendation={"החלפת אריח פגום והדבקה מחדש"}
        cost={"₪350"}
        photos={4}
        annexText={'נספח A.2: צילום סעיף 2.3.1 מתוך ת"י 1555 — ראה עמוד 10'}
      />
      <Sub>6.3 אלומיניום</Sub>
      <DefectFull num={4} severity="low"
        title={"חלון חדר שינה — ידית לא נסגרת עד הסוף"}
        location={"חדר שינה 1"}
        standard={'ת"י 23 סעיף 5.4'}
        standardText={'"חלונות ייסגרו באופן מלא ואטום"'}
        recommendation={"החלפת ידית חלון וכיוון מנגנון נעילה"}
        cost={"₪600"}
        note={"ייתכן שהבעיה נובעת מעיוות במסגרת"}
        photos={2}
      />
      <Sub>6.4 טיח וצבע</Sub>
      <DefectFull num={5} severity="medium"
        title={'סדק אנכי בקיר סלון — אורך 45 ס"מ'}
        location={"סלון, קיר מזרחי"}
        standard={'ת"י 1920 סעיף 6.1'}
        standardText={'"טיח יהיה אחיד ללא סדקים"'}
        recommendation={"הרחבת טיח באזור הסדק, מילוי וצביעה מחדש"}
        cost={"₪450"}
        photos={2}
      />
      <Foot n={7} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 8. BOQ — same as v1 ═══ */}
    {page===7&&<div style={ps}>
      <Header crumb="כתב כמויות"/>
      <div style={{fontSize:14,fontWeight:700,color:dk,marginBottom:8}}>כתב כמויות — אומדן עלויות</div>
      <div style={{border:"1px solid "+bdr,borderRadius:2,overflow:"hidden",fontSize:8}}>
        <div style={{display:"grid",gridTemplateColumns:"36px 1fr 80px",background:dk,color:"#fff",padding:"4px 6px",fontWeight:600,fontSize:7.5}}>
          <span>#</span><span>תיאור</span><span style={{textAlign:"left"}}>עלות (₪)</span>
        </div>
        <div style={{padding:"4px 6px",background:accentLt,fontWeight:700,fontSize:7.5,color:accent}}>אינסטלציה</div>
        <div style={{display:"grid",gridTemplateColumns:"36px 1fr 80px",padding:"4px 6px",borderBottom:"1px solid "+bdrLt,fontSize:8}}>
          <span style={{fontWeight:600}}>1</span><span>{"החלפת אטם בצנרת מטבח + בדיקת לחץ"}</span><span style={{textAlign:"left",fontWeight:600}}>850</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"36px 1fr 80px",padding:"4px 6px",borderBottom:"1px solid "+bdrLt,fontSize:8}}>
          <span style={{fontWeight:600}}>2</span><span>{"פירוק וניקוי סיפון מקלחת + שיפוע"}</span><span style={{textAlign:"left",fontWeight:600}}>1,200</span>
        </div>
        <div style={{padding:"4px 6px",background:accentLt,fontWeight:700,fontSize:7.5,color:accent}}>ריצוף</div>
        <div style={{display:"grid",gridTemplateColumns:"36px 1fr 80px",padding:"4px 6px",borderBottom:"1px solid "+bdrLt,fontSize:8}}>
          <span style={{fontWeight:600}}>3</span><span>{"החלפת אריח פגום + הדבקה"}</span><span style={{textAlign:"left",fontWeight:600}}>350</span>
        </div>
        <div style={{padding:"4px 6px",background:accentLt,fontWeight:700,fontSize:7.5,color:accent}}>אלומיניום</div>
        <div style={{display:"grid",gridTemplateColumns:"36px 1fr 80px",padding:"4px 6px",borderBottom:"1px solid "+bdrLt,fontSize:8}}>
          <span style={{fontWeight:600}}>4</span><span>{"החלפת ידית חלון + כיוון מנגנון"}</span><span style={{textAlign:"left",fontWeight:600}}>600</span>
        </div>
        <div style={{padding:"4px 6px",background:accentLt,fontWeight:700,fontSize:7.5,color:accent}}>טיח וצבע</div>
        <div style={{display:"grid",gridTemplateColumns:"36px 1fr 80px",padding:"4px 6px",borderBottom:"1px solid "+bdrLt,fontSize:8}}>
          <span style={{fontWeight:600}}>5</span><span>{"תיקון סדק + מילוי + צביעה"}</span><span style={{textAlign:"left",fontWeight:600}}>450</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"36px 1fr 80px",padding:"5px 6px",background:bg,fontWeight:700,borderTop:"1px solid "+bdr}}>
          <span></span><span style={{color:dk}}>{'סה"כ לפני מע"מ'}</span><span style={{textAlign:"left"}}>3,450</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"36px 1fr 80px",padding:"4px 6px",background:bg}}>
          <span></span><span style={{color:md}}>{'מע"מ (17%)'}</span><span style={{textAlign:"left"}}>586.50</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"36px 1fr 80px",padding:"5px 6px",background:dk,color:"#fff",fontWeight:700}}>
          <span></span><span>{'סה"כ כולל מע"מ'}</span><span style={{textAlign:"left"}}>4,036.50</span>
        </div>
      </div>
      <Sec>סיכום</Sec>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:5,margin:"3px 0 8px"}}>
        {[{l:"ממצאים",v:"5",b:bg},{l:"תמונות",v:"13",b:bg},{l:"קטגוריות",v:"4",b:bg},{l:"עלות כוללת",v:"₪4,036",b:accentLt}].map((s,i)=>
          <div key={i} style={{textAlign:"center",padding:"6px 3px",background:s.b,borderRadius:3,border:"1px solid "+bdrLt}}>
            <div style={{fontSize:14,fontWeight:700,color:dk}}>{s.v}</div>
            <div style={{fontSize:6.5,color:lt,marginTop:1}}>{s.l}</div>
          </div>
        )}
      </div>
      <Sec>הערות לאומדן</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:7.5,lineHeight:1.6,color:md}}>
        {'האומדנים לעיל הם הערכה מקצועית בלבד ואינם מחייבים. המחירים כוללים חומרים ועבודה, אך אינם כוללים עבודות פירוק/שחזור מעבר לנדרש. מומלץ לקבל הצעות מחיר ממקצוענים מוסמכים לפני התחלת ביצוע.'}
      </div>
      <Foot n={8} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 9. SIGNATURES — NEW dedicated page, with tenant + inspector + stamp ═══ */}
    {page===8&&<div style={ps}>
      <Header crumb="חתימות ואישורים"/>
      <div style={{fontSize:14,fontWeight:700,color:dk,marginBottom:8}}>חתימות ואישורים</div>
      <Sec>הצהרת המפקח</Sec>
      <div style={{padding:"6px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.7,color:md}}>
        {"אני הח\"מ, מהנדס דני לוין, מ.ר. 54321, מצהיר בזה כי ביצעתי בדיקת בדק בית בנכס המפורט בדוח זה בתאריך 25.03.2026. הממצאים המפורטים לעיל משקפים את מצב הנכס בעת הבדיקה על פי מיטב ידיעתי המקצועית וניסיוני. הדוח מוגש כחוות דעת הנדסית לצורך פניית המזמין לקבלן."}
      </div>
      <Sec>אישור המזמין</Sec>
      <div style={{padding:"6px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.7,color:md}}>
        {"הריני מאשר/ת שקיבלתי את הדוח, קראתי את תוכנו, והבנתי את תוכנו ואת משמעותו. ידוע לי כי הדוח מהווה חוות דעת מקצועית ואינו מחליף ייעוץ משפטי."}
      </div>

      <div style={{marginTop:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:8,fontWeight:600,color:dk,marginBottom:4}}>חתימת המפקח</div>
          <div style={{height:60,border:"1px solid "+bdr,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:vlt,fontStyle:"italic",background:bg}}>[חתימה דיגיטלית]</div>
          <div style={{fontSize:8,color:dk,marginTop:4,fontWeight:600}}>מהנדס דני לוין</div>
          <div style={{fontSize:7,color:lt}}>מ.ר. 54321</div>
          <div style={{fontSize:7,color:lt}}>25.03.2026</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:8,fontWeight:600,color:dk,marginBottom:4}}>חתימת המזמין</div>
          <div style={{height:60,border:"1px solid "+bdr,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:vlt,fontStyle:"italic",background:bg}}>[חתימה דיגיטלית]</div>
          <div style={{fontSize:8,color:dk,marginTop:4,fontWeight:600}}>דוד לוי</div>
          <div style={{fontSize:7,color:lt}}>ת"ז 023456789</div>
          <div style={{fontSize:7,color:lt}}>25.03.2026</div>
        </div>
      </div>

      <div style={{marginTop:14,padding:"8px 10px",border:"1px dashed "+bdr,borderRadius:2,display:"flex",alignItems:"center",gap:10,background:bg}}>
        <div style={{width:56,height:56,borderRadius:28,border:"2px solid "+accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:accent,fontWeight:700,background:accentLt,textAlign:"center",lineHeight:1.2}}>חותמת<br/>מהנדס</div>
        <div style={{fontSize:7.5,color:lt,lineHeight:1.5,flex:1}}>
          <div style={{fontWeight:600,color:dk,fontSize:8}}>חותמת מקצועית</div>
          <div>מהנדס דני לוין, רשום בפנקס המהנדסים והאדריכלים</div>
          <div>מספר רישיון: 54321 · תקף עד 12/2028</div>
        </div>
      </div>
      <Foot n={9} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 10. APPENDIX — NEW — example of embedded standard ═══ */}
    {page===9&&<div style={ps}>
      <Header crumb="נספחי תקנים"/>
      <div style={{fontSize:14,fontWeight:700,color:dk,marginBottom:4}}>נספחי תקנים</div>
      <div style={{fontSize:8,color:lt,marginBottom:8}}>ציטוטים מהתקנים הישראליים שהוזכרו בגוף הדוח, מצורפים כהוכחה וכאסמכתא.</div>

      <div style={{padding:"8px 10px",border:"1px solid "+bdr,borderRadius:2,background:bg,marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
          <div style={{fontSize:9,fontWeight:700,color:dk}}>נספח A.1 — ת"י 1205.1 סעיף 3.2</div>
          <div style={{fontSize:7,color:lt}}>מתייחס לליקוי #1</div>
        </div>
        <div style={{fontSize:7.5,color:md,lineHeight:1.7,padding:"6px 8px",background:"white",border:"1px dashed "+bdrLt,borderRadius:2}}>
          {'"3.2 אטימות חיבורים: כל חיבורי הצנרת למים קרים וחמים יהיו אטומים לחלוטין בלחץ העבודה המרבי הצפוי במערכת, בתוספת מקדם בטיחות של 25%. הבדיקה תבוצע על ידי בדיקת לחץ הידרוסטטית במשך 15 דקות לפחות, ללא ירידת לחץ משמעותית."'}
        </div>
        <div style={{fontSize:7,color:lt,marginTop:4,fontStyle:"italic"}}>מקור: תקן ישראלי ת"י 1205.1 — מערכות מים קרים וחמים, מכון התקנים הישראלי.</div>
      </div>

      <div style={{padding:"8px 10px",border:"1px solid "+bdr,borderRadius:2,background:bg}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
          <div style={{fontSize:9,fontWeight:700,color:dk}}>נספח A.2 — ת"י 1555 סעיף 2.3.1</div>
          <div style={{fontSize:7,color:lt}}>מתייחס לליקוי #3</div>
        </div>
        <div style={{fontSize:7.5,color:md,lineHeight:1.7,padding:"6px 8px",background:"white",border:"1px dashed "+bdrLt,borderRadius:2}}>
          {'"2.3.1 שלמות אריחים: אריחי קרמיקה ופורצלן המסופקים לפרויקט יהיו שלמים, ללא סדקים, שברים או פגמים ויזואליים. אריח פגום יוחלף לפני מסירה לדייר."'}
        </div>
        <div style={{fontSize:7,color:lt,marginTop:4,fontStyle:"italic"}}>מקור: תקן ישראלי ת"י 1555 — ריצופים וחיפויים קראמיים, מכון התקנים הישראלי.</div>
      </div>

      <Foot n={10} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 11. BACK COVER — NEW — contact + disclaimer ═══ */}
    {page===10&&<div style={{...ps,justifyContent:"space-between"}}>
      <Header crumb="פרטי קשר וכתב ויתור"/>
      <div>
        <div style={{fontSize:14,fontWeight:700,color:dk,marginBottom:8}}>פרטי קשר וכתב ויתור</div>
        <Sec>פרטי המפקח</Sec>
        <div style={{padding:"8px 10px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8.5,lineHeight:1.9}}>
          <div style={{fontSize:10,fontWeight:700,color:dk,marginBottom:4}}>מהנדס דני לוין</div>
          <div style={{color:lt,fontSize:8}}>מהנדס אזרחי מוסמך · מ.ר. 54321</div>
          <div style={{marginTop:6}}><span style={{color:lt}}>{"טלפון: "}</span><span style={{color:dk,fontWeight:500}}>050-111-2233</span></div>
          <div><span style={{color:lt}}>{"אימייל: "}</span><span style={{color:dk,fontWeight:500}}>dani@inspect.co.il</span></div>
          <div><span style={{color:lt}}>{"כתובת: "}</span><span style={{color:dk,fontWeight:500}}>רח' הרצל 10, תל אביב</span></div>
          <div><span style={{color:lt}}>{"אתר: "}</span><span style={{color:accent,fontWeight:500}}>www.dani-inspect.co.il</span></div>
        </div>
        <Sec>אחריות מקצועית</Sec>
        <div style={{padding:"6px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:7.5,lineHeight:1.6,color:md}}>
          {"המפקח מוסמך ומבוטח באחריות מקצועית בחברת ביטוח מוכרת. הביטוח כולל כיסוי לחוות דעת הנדסיות בגבולות האחריות המוגדרים בפוליסה."}
        </div>
        <Sec>כתב ויתור</Sec>
        <div style={{padding:"6px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:7,lineHeight:1.6,color:lt}}>
          {"1. דוח זה מהווה חוות דעת הנדסית מקצועית בלבד ואינו מהווה תחליף לייעוץ משפטי. 2. הממצאים מבוססים על בדיקה חזותית ומכשור שברשות המפקח. לא בוצעו בדיקות הרסניות. 3. האומדנים הכלולים בדוח הם הערכה מקצועית ואינם מחייבים. 4. המפקח אינו אחראי לליקויים נסתרים שלא ניתן היה לגלותם במהלך בדיקה חזותית. 5. הדוח תקף למצב הנכס בתאריך הבדיקה בלבד. 6. כל הזכויות שמורות למהנדס דני לוין © 2026."}
        </div>
      </div>
      <div style={{marginTop:12,textAlign:"center"}}>
        <Logo big/>
        <div style={{fontSize:7,color:vlt,marginTop:6}}>הופק באמצעות inField · www.infield.co.il</div>
      </div>
      <Foot n={11} total={TOTAL} title={rptTitle}/>
    </div>}

    {/* ═══ 12. LEGEND — quick reference for all symbols + severities ═══ */}
    {page===11&&<div style={ps}>
      <Header crumb="מקרא"/>
      <div style={{fontSize:14,fontWeight:700,color:dk,marginBottom:8}}>מקרא לסימנים בדוח</div>
      <Sec>דרגות חומרה</Sec>
      <div style={{display:"flex",flexDirection:"column",gap:5,padding:"6px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.6}}>
        {[
          {lev:"critical",desc:'סכנה מיידית לבטיחות דיירים או למבנה. טיפול דחוף תוך 48 שעות.'},
          {lev:"high",desc:'ליקוי משמעותי המחייב תיקון לפני מסירת הדירה. אי-תיקון יפגע בשימוש תקין.'},
          {lev:"medium",desc:'ליקוי גמר משמעותי הדורש תיקון סביר. אין מניעה למסירה אך התיקון יידרש.'},
          {lev:"low",desc:'ליקוי קוסמטי בלבד. ניתן לתקן בהזדמנות, אין דחיפות.'},
        ].map((r,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:8}}>
          <div style={{minWidth:48}}><SevBadge level={r.lev}/></div>
          <div style={{color:md,flex:1}}>{r.desc}</div>
        </div>)}
      </div>
      <Sec>סמלים</Sec>
      <div style={{padding:"6px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={lt} strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
          <span>מצורף נספח תקן בסוף הדוח</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:14,height:10,border:"1.5px solid #B42318",borderRadius:2}}/>
          <span>סימון ויזואלי על תמונה (חיצים, עיגולים) — מציין את מיקום הליקוי בתמונה</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{fontSize:8,fontWeight:700,color:"white",background:dk,width:14,height:14,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}>1</div>
          <span>מספר ליקוי — רץ ברציפות לאורך כל הדוח</span>
        </div>
      </div>
      <Sec>קטגוריות מקצועיות</Sec>
      <div style={{padding:"6px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.6,display:"flex",flexWrap:"wrap",gap:6}}>
        {["אינסטלציה","חשמל","ריצוף","אלומיניום","טיח וצבע","גבס","נגרות","גינון","איטום","מיזוג"].map((t,i)=>
          <span key={i} style={{padding:"2px 6px",background:accentLt,color:accent,borderRadius:8,fontSize:7.5,fontWeight:500}}>{t}</span>
        )}
      </div>
      <Foot n={12} total={TOTAL} title={rptTitle}/>
    </div>}

    <div style={{fontSize:9,color:"#999",textAlign:"center",padding:"4px 0 12px",direction:"rtl"}}>
      מוקאפ דוח בדק בית — inField v2 (12 עמודים · מותאם ל-3 קהלים · תומך ב-100 עמודים)
    </div>
  </div>
}
