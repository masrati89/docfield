import { useState } from "react";

// ═══ PDF DESIGN SYSTEM — Aligned with app Design System ═══
const dk="#1a1a1a", md="#444", lt="#777", vlt="#aaa", bg="#FEFDFB";
const bdr="#D1CEC8", bdrLt="#F5EFE6", bdrDk="#A8A49D";
const grn="#1B7A44", red2="#b91c1c", amber="#92600a", accent="#1B7A44";
const accentLt="#F0F7F4";

function Img(){return <div style={{width:56,height:42,borderRadius:2,background:"#F5EFE6",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+bdrLt,flexShrink:0}}>
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#D1CEC8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
</div>}

function Defect({num,text,location,photos}){
  return <div style={{padding:"4px 0 5px",borderBottom:"0.5px solid "+bdrLt}}>
    <div style={{display:"flex",alignItems:"flex-start",gap:6}}>
      <div style={{fontSize:8,fontWeight:600,color:md,width:16,textAlign:"center",flexShrink:0,marginTop:1}}>{num}.</div>
      <div style={{flex:1}}>
        <div style={{fontSize:8.5,fontWeight:500,color:dk,lineHeight:1.4}}>{text}</div>
        <div style={{fontSize:7,color:lt,marginTop:1}}>{location}</div>
      </div>
    </div>
    {photos>0&&<div style={{display:"flex",gap:3,marginTop:4,marginRight:22,paddingTop:4,borderTop:"0.5px solid "+bdrLt}}>
      {Array.from({length:Math.min(photos,4)}).map((_,i)=><Img key={i}/>)}
    </div>}
  </div>
}

function CI({text,status,ref_num}){
  const sym = status==="ok" ? "✓" : status==="partial" ? "~" : "✗";
  const col = status==="ok" ? grn : status==="partial" ? amber : red2;
  const bgCol = status==="ok" ? "#ecfdf5" : status==="partial" ? "#fefaed" : "#fef2f2";
  return <div style={{display:"flex",alignItems:"center",gap:4,padding:"1.5px 0",fontSize:7.5,color:md,lineHeight:1.3}}>
    <span style={{color:col,fontWeight:700,fontSize:9,width:14,height:14,borderRadius:2,background:bgCol,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sym}</span>
    <span style={{flex:1}}>{text}</span>
    {status!=="ok"&&ref_num&&<span style={{color:red2,fontSize:6.5,flexShrink:0}}>{"ראה סעיף #"}{ref_num}</span>}
  </div>
}

function Logo(){return <div style={{width:40,height:16,border:"1px solid "+bdrLt,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:6,color:vlt,flexShrink:0}}>לוגו</div>}

function Foot({n,title}){return <div style={{marginTop:"auto",paddingTop:6,borderTop:"1px solid "+bdr,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:6.5,color:lt}}>
  <Logo/><span>עמוד {n}</span><span>{title} — 25.03.2026</span>
</div>}

export default function PDFPreview(){
  const [page,setPage]=useState(0);
  const rptTitle = "פרוטוקול מסירה";
  const ps={width:"100%",maxWidth:520,aspectRatio:"210/297",background:"white",borderRadius:2,boxShadow:"0 2px 16px rgba(60,54,42,.10),0 0 0 1px rgba(60,54,42,.06)",fontFamily:"'Rubik','Heebo',sans-serif",direction:"rtl",padding:"20px 24px",fontSize:9,color:md,overflow:"hidden",display:"flex",flexDirection:"column"};

  const secTitle=(t)=><div style={{fontSize:10,fontWeight:700,color:dk,padding:"4px 0 3px",borderBottom:"2px solid "+dk,marginBottom:4,marginTop:8}}>{t}</div>;
  const subTitle=(t)=><div style={{fontSize:10,fontWeight:700,color:accent,padding:"4px 8px 3px",marginTop:8,marginBottom:3,background:accentLt,borderRadius:2,borderRight:"3px solid "+accent}}>{t}</div>;

  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"16px 12px",background:"#F5EFE6",minHeight:"100vh",fontFamily:"'Rubik','Heebo',sans-serif"}}>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
    <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center"}}>
      {["עמוד 1","עמוד 2","עמוד 3"].map((l,i)=>
        <button key={i} onClick={()=>setPage(i)} style={{padding:"6px 16px",borderRadius:4,fontSize:11,fontWeight:page===i?600:400,background:page===i?dk:"white",color:page===i?"white":"#555",border:"1px solid "+(page===i?dk:bdr),cursor:"pointer",fontFamily:"inherit",direction:"rtl"}}>{l}</button>
      )}
    </div>

    {/* ═══ PAGE 1 ═══ */}
    {page===0&&<div style={ps}>
      {/* Header */}
      <div style={{borderBottom:"2px solid "+dk,paddingBottom:6,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:dk,letterSpacing:-.3}}>{rptTitle}</div>
          <div style={{fontSize:7.5,color:lt,marginTop:2,fontWeight:400}}>{"מסירה ראשונית | תאריך: 25.03.2026 | מספר דוח: DF-2026-0412"}</div>
        </div>
        <div style={{width:52,height:20,border:"1px solid "+bdrLt,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:6.5,color:vlt}}>{"לוגו"}</div>
      </div>

      {/* Details */}
      <div style={{marginTop:4,padding:"4px 8px",border:"1px solid "+bdr,borderRadius:2,fontSize:7.5,display:"flex",flexWrap:"wrap",gap:"2px 14px",background:bg}}>
        {[["פרויקט:",'פארק ת"א - בניין 3'],["דירה:","דירה 12, קומה 4"],["דייר:","ישראל כהן | ת.ז. 012345678"],["מפקח:","דני לוי, מהנדס בניין"]].map(([k,v],i)=>
          <div key={i} style={{display:"flex",gap:3}}><span style={{color:lt}}>{k}</span><span style={{color:dk,fontWeight:500}}>{v}</span></div>
        )}
      </div>

      {/* Checklist */}
      {secTitle("צ׳קליסט מסירה")}
      <div style={{border:"1px solid "+bdr,borderRadius:2,padding:"6px 8px",background:bg}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>
          {/* Column 1 */}
          <div>
            <div style={{fontSize:7,fontWeight:700,color:dk,borderBottom:"0.5px solid "+bdr,paddingBottom:2,marginBottom:2}}>{"אינסטלציה"}</div>
            <CI text={"ברזים תקינים"} status="bad" ref_num={2}/>
            <CI text={"כיורים מותקנים"} status="ok"/>
            <CI text={"ניקוז תקין"} status="bad" ref_num={5}/>
            <CI text={"אסלות תקינות"} status="ok"/>

            <div style={{fontSize:7,fontWeight:700,color:dk,borderBottom:"0.5px solid "+bdr,paddingBottom:2,marginBottom:2,marginTop:4}}>{"חשמל"}</div>
            <CI text={"נקודות חשמל תקינות"} status="ok"/>
            <CI text={"לוח חשמל תקין"} status="ok"/>
            <CI text={"אינטרקום מותקן"} status="bad" ref_num={1}/>

            <div style={{fontSize:7,fontWeight:700,color:dk,borderBottom:"0.5px solid "+bdr,paddingBottom:2,marginBottom:2,marginTop:4}}>{"ריצוף"}</div>
            <CI text={"ריצוף שלם ואחיד"} status="bad" ref_num={3}/>
            <CI text={"ריצוף ספייר קיים"} status="ok"/>
          </div>

          {/* Column 2 */}
          <div>
            <div style={{fontSize:7,fontWeight:700,color:dk,borderBottom:"0.5px solid "+bdr,paddingBottom:2,marginBottom:2}}>{"אלומיניום"}</div>
            <CI text={"חלונות נסגרים"} status="ok"/>
            <CI text={"תריסים חשמליים"} status="bad" ref_num={4}/>
            <CI text={"אטימה תקינה"} status="partial" ref_num={7}/>

            <div style={{fontSize:7,fontWeight:700,color:dk,borderBottom:"0.5px solid "+bdr,paddingBottom:2,marginBottom:2,marginTop:4}}>{"נגרות"}</div>
            <CI text={"דלתות פנים מותקנות"} status="ok"/>
            <CI text={"ארונות מטבח"} status="ok"/>
            <CI text={"משקופים שלמים"} status="ok"/>

            <div style={{fontSize:7,fontWeight:700,color:dk,borderBottom:"0.5px solid "+bdr,paddingBottom:2,marginBottom:2,marginTop:4}}>{"שיש ומשטחים"}</div>
            <CI text={"שיש מטבח מותקן"} status="ok"/>
            <CI text={"משטחי עבודה"} status="ok"/>

            <div style={{fontSize:7,fontWeight:700,color:dk,borderBottom:"0.5px solid "+bdr,paddingBottom:2,marginBottom:2,marginTop:4}}>{"איטום"}</div>
            <CI text={"איטום חדרים רטובים"} status="ok"/>
            <CI text={"שיפועים תקינים"} status="bad" ref_num={6}/>
          </div>
        </div>
        {/* Legend */}
        <div style={{marginTop:4,paddingTop:3,borderTop:"0.5px solid "+bdr,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:6.5,color:lt}}>
          <div style={{display:"flex",gap:8}}>
            <span><span style={{color:grn,fontWeight:700}}>{"✓"}</span> {"תקין"}</span>
            <span><span style={{color:red2,fontWeight:700}}>{"✗"}</span> {"לא תקין"}</span>
            <span><span style={{color:amber,fontWeight:700}}>~</span> {"תקין חלקית"}</span>
          </div>
          <span style={{fontWeight:600,color:md}}>22 {"פריטים"} | 15 {"תקין"} | 6 {"לא תקין"} | 1 {"חלקי"}</span>
        </div>
      </div>

      {/* Defects start */}
      {secTitle("ממצאים")}
      {subTitle("חשמל")}
      <Defect num={1} text={"אינטרקום לא מותקן במבואת הכניסה"} location={"מבואת כניסה"} photos={1}/>
      {subTitle("אינסטלציה")}
      <Defect num={2} text={"נזילה בברז כיור מטבח — ברז חם לא נסגר עד הסוף"} location={"מטבח"} photos={2}/>

      <Foot n={1} title={rptTitle}/>
    </div>}

    {/* ═══ PAGE 2 ═══ */}
    {page===1&&<div style={ps}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:4,borderBottom:"1px solid "+bdr,marginBottom:4}}>
        <div style={{fontSize:9,fontWeight:600,color:dk}}>{"פרוטוקול מסירה | פארק ת\"א | דירה 12"}</div>
        <Logo/>
      </div>

      {secTitle("ממצאים (המשך)")}
      {subTitle("ריצוף")}
      <Defect num={3} text={"מרצפת שבורה בכניסה לדירה — פינה ימנית"} location={"מבואת כניסה"} photos={4}/>
      {subTitle("אלומיניום")}
      <Defect num={4} text={"תריס חשמלי בסלון לא יורד עד הסוף — נתקע באמצע"} location={"סלון"} photos={2}/>
      {subTitle("אינסטלציה")}
      <Defect num={5} text={"ניקוז איטי במקלחת — מים מצטברים לאחר שימוש"} location={"חדר רחצה"} photos={1}/>
      {subTitle("איטום")}
      <Defect num={6} text={"שיפועים לא תקינים במרפסת שירות — הצטברות מים"} location={"מרפסת שירות"} photos={3}/>
      {subTitle("אלומיניום")}
      <Defect num={7} text={"אטימה חלקית בחלון חדר שינה 1 — פינה תחתונה"} location={"חדר שינה 1"} photos={2}/>

      <Foot n={2} title={rptTitle}/>
    </div>}

    {/* ═══ PAGE 3 ═══ */}
    {page===2&&<div style={ps}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:4,borderBottom:"1px solid "+bdr,marginBottom:4}}>
        <div style={{fontSize:9,fontWeight:600,color:dk}}>{"פרוטוקול מסירה | פארק ת\"א | דירה 12"}</div>
        <Logo/>
      </div>

      {secTitle("סיכום")}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:5,margin:"3px 0 6px"}}>
        {[{l:"פריטים",v:"22",b:bg},{l:"תקין",v:"15",b:"#ecfdf5"},{l:"לא תקין",v:"6",b:"#fef2f2"},{l:"חלקי",v:"1",b:"#fefaed"}].map((s,i)=>
          <div key={i} style={{textAlign:"center",padding:"5px 3px",background:s.b,borderRadius:3,border:"1px solid "+bdrLt}}>
            <div style={{fontSize:14,fontWeight:700,color:dk}}>{s.v}</div>
            <div style={{fontSize:6.5,color:lt,marginTop:1}}>{s.l}</div>
          </div>
        )}
      </div>

      {secTitle("קבלת מפתחות")}
      <div style={{padding:"4px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"1px 10px"}}>
          {[["מפתחות דירה:","3"],["ת.דואר:","2"],["שלט חניה:","1"],["שלט כניסה:","2"],["קוד כניסה:","1234#"],["מחסן:","1"]].map(([k,v],i)=>
            <div key={i} style={{display:"flex",gap:3}}><span style={{color:lt}}>{k}</span><span style={{color:dk,fontWeight:600}}>{v}</span></div>
          )}
        </div>
      </div>

      {secTitle("הערות הדייר")}
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,minHeight:24,fontSize:8,color:md,lineHeight:1.5}}>
        {"הדייר מבקש תיקון דחוף של האינטרקום והתריס בסלון. שאר הממצאים ניתנים לתיקון בתוך 30 יום."}
      </div>

      {secTitle("תנאים ואחריות")}
      <div style={{fontSize:6.5,color:lt,lineHeight:1.5,padding:"2px 0"}}>
        {'פרוטוקול זה נערך בהתאם לחוק המכר (דירות), תשל"ג-1973. תקופת הבדק בהתאם לסוג הליקוי (בין שנה ל-7 שנים). תקופת אחריות 3 שנים מתום תקופת הבדק. הדייר מתבקש לשמור מסמך זה כאסמכתא.'}
      </div>

      {secTitle("חתימות")}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:3}}>
        {[{r:"מפקח",n:"דני לוי"},{r:"דייר",n:"ישראל כהן"}].map((s,i)=>
          <div key={i} style={{textAlign:"center"}}>
            <div style={{fontSize:7.5,color:lt,marginBottom:3}}>{s.r}</div>
            <div style={{height:32,border:"1px solid "+bdr,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",color:vlt,fontSize:7}}>{"חתימה"}</div>
            <div style={{fontSize:7.5,color:dk,marginTop:2,fontWeight:500}}>{s.n}</div>
            <div style={{fontSize:6,color:lt}}>{"תאריך: 25.03.2026"}</div>
          </div>
        )}
      </div>

      <div style={{marginTop:10,textAlign:"center"}}>
        <div style={{display:"inline-block",padding:"5px 18px",border:"1px solid "+bdr,borderRadius:3}}>
          <div style={{fontSize:7,color:vlt}}>{"חותמת חברה"}</div>
        </div>
      </div>

      <Foot n={3} title={rptTitle}/>
    </div>}

    <div style={{fontSize:9,color:"#999",textAlign:"center",padding:"4px 0 12px",direction:"rtl"}}>מוקאפ פרוטוקול מסירה — inField v5 (מיושר)</div>
  </div>
}
