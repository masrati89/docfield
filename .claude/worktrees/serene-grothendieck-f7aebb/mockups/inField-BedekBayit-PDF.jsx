import { useState } from "react";

// ═══ PDF DESIGN SYSTEM — Aligned with app Design System ═══
const dk="#1a1a1a", md="#444", lt="#777", vlt="#aaa", bg="#FEFDFB";
const bdr="#D1CEC8", bdrLt="#F5EFE6", bdrDk="#A8A49D";
const accent="#1B7A44", accentLt="#F0F7F4", accentMd="#D1E7DD";

function Img(){return <div style={{width:56,height:42,borderRadius:2,background:"#F5EFE6",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+bdrLt}}>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1CEC8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
</div>}

function Logo(){return <div style={{width:40,height:16,border:"1px solid "+bdrLt,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:6,color:vlt}}>LOGO</div>}

function Sec({children}){return <div style={{fontSize:10,fontWeight:700,color:dk,padding:"4px 0 2px",borderBottom:"1px solid "+bdr,marginTop:8,marginBottom:4}}>{children}</div>}

function Sub({children}){return <div style={{fontSize:10,fontWeight:700,color:accent,padding:"4px 8px 3px",margin:"6px 0 3px",background:accentLt,borderRight:"3px solid "+accent,borderRadius:"0 2px 2px 0"}}>{children}</div>}

function Foot({n,title}){return <div style={{marginTop:"auto",paddingTop:6,borderTop:"1px solid "+bdr,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:7,color:vlt}}>
  <Logo/><span>עמוד {n}</span><span>{title} — 25.03.2026</span>
</div>}

function Mini({t}){return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
  <div style={{fontSize:8,fontWeight:600,color:dk}}>{t}</div><Logo/>
</div>}

function DefectFull({num,title,location,standard,standardText,recommendation,cost,note,photos=0,annexText}){
  return <div style={{padding:"6px 0",borderBottom:"1px solid "+bdrLt,marginBottom:2}}>
    <div style={{display:"flex",alignItems:"flex-start",gap:6}}>
      <div style={{fontSize:8,fontWeight:700,color:"white",background:dk,width:20,height:20,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{num}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:9,fontWeight:600,color:dk,lineHeight:1.4}}>{title}</div>
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
      {Array.from({length:Math.min(photos,6)}).map((_,i)=><Img key={i}/>)}
    </div>}
    {annexText&&<div style={{margin:"4px 0 2px",marginRight:26,padding:"3px 6px",background:bg,borderRadius:2,fontSize:7,color:lt,display:"flex",alignItems:"center",gap:4}}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={lt} strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
      {annexText}
    </div>}
  </div>
}

export default function BedekPDF(){
  const [page,setPage]=useState(0);
  const rptTitle = "דוח בדק בית";
  const ps={width:"100%",maxWidth:520,aspectRatio:"210/297",background:"white",borderRadius:2,boxShadow:"0 2px 12px rgba(60,54,42,.10)",padding:"20px 24px",display:"flex",flexDirection:"column",fontFamily:"'Rubik',sans-serif",direction:"rtl",fontSize:8,color:md,lineHeight:1.5,overflow:"hidden"};
  const labels=["שער","פרטים","ממצאים 1","ממצאים 2","כת\"כ + סיכום"];

  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"16px 8px",background:"#F5EFE6",minHeight:"100vh"}}>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
    <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center"}}>
      {labels.map((l,i)=><button key={i} onClick={()=>setPage(i)} style={{padding:"6px 12px",borderRadius:4,border:"1px solid "+(page===i?accent:bdr),background:page===i?accentLt:"#fff",color:page===i?accent:"#666",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:page===i?600:400}}>{l}</button>)}
    </div>

    {/* ═══ COVER ═══ */}
    {page===0&&<div style={{...ps,justifyContent:"center",alignItems:"center",textAlign:"center"}}>
      <div style={{alignSelf:"flex-end",marginBottom:16}}><div style={{width:60,height:24,border:"1px solid "+bdrLt,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:vlt}}>לוגו מפקח</div></div>
      <div style={{width:160,height:1,background:dk,marginBottom:24}}/>
      <div style={{fontSize:22,fontWeight:700,color:dk,letterSpacing:-.5,marginBottom:6}}>{rptTitle}</div>
      <div style={{fontSize:11,color:lt,marginBottom:24}}>בדיקת קבלה לדירה חדשה</div>
      <div style={{width:160,height:1,background:bdr,marginBottom:20}}/>
      <div style={{fontSize:9,color:md,lineHeight:2,textAlign:"center"}}>
        <div><span style={{color:lt}}>{"פרויקט: "}</span><span style={{fontWeight:600}}>פארק הירקון</span></div>
        <div><span style={{color:lt}}>{"דירה: "}</span><span style={{fontWeight:600}}>דירה 12, קומה 4</span></div>
        <div><span style={{color:lt}}>{"מזמין: "}</span><span style={{fontWeight:600}}>דוד ושרה לוי</span></div>
        <div><span style={{color:lt}}>{"מפקח: "}</span><span style={{fontWeight:600}}>מהנדס דני לוין</span></div>
        <div><span style={{color:lt}}>{"תאריך: "}</span><span style={{fontWeight:600}}>25.03.2026</span></div>
        <div><span style={{color:lt}}>{"מספר דוח: "}</span><span style={{fontWeight:600}}>BB-2026-0142</span></div>
      </div>
      <div style={{width:160,height:1,background:bdr,marginTop:24,marginBottom:12}}/>
      <div style={{fontSize:7,color:vlt}}>מסמך זה הוא חוות דעת הנדסית מקצועית. כל הזכויות שמורות.</div>
    </div>}

    {/* ═══ DETAILS ═══ */}
    {page===1&&<div style={ps}>
      <Mini t={"דוח בדק בית — פארק הירקון"}/>
      <Sec>פרטי המפקח</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.8}}>
        {[["שם:","מהנדס דני לוין"],["מ.ר.:","54321"],["השכלה:","B.Sc הנדסה אזרחית — הטכניון"],["ניסיון:","12 שנה בפיקוח ובדק בית"]].map(([l,v],i)=>
          <div key={i} style={{display:"flex",gap:4}}><span style={{color:lt,fontWeight:500}}>{l}</span><span style={{fontWeight:500,color:dk}}>{v}</span></div>
        )}
      </div>
      <Sec>פרטי הנכס</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.8}}>
        {[["פרויקט:","פארק הירקון"],["כתובת:","שד' רוטשילד 45, תל אביב"],["דירה:","דירה 12, קומה 4"],["שטח:",'120 מ"ר'],["קבלן:","שיכון ובינוי"]].map(([l,v],i)=>
          <div key={i} style={{display:"flex",gap:4}}><span style={{color:lt,fontWeight:500}}>{l}</span><span style={{fontWeight:500,color:dk}}>{v}</span></div>
        )}
      </div>
      <Sec>פרטי המזמין</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.8}}>
        {[["שם:","דוד ושרה לוי"],["טלפון:","050-123-4567"],["אימייל:","david@email.com"]].map(([l,v],i)=>
          <div key={i} style={{display:"flex",gap:4}}><span style={{color:lt,fontWeight:500}}>{l}</span><span style={{fontWeight:500,color:dk}}>{v}</span></div>
        )}
      </div>
      <Sec>תנאי הבדיקה</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.8}}>
        <div><span style={{color:lt}}>{"מטרה: "}</span>{"בדיקת ליקויי בנייה לפני קבלת דירה חדשה"}</div>
        <div><span style={{color:lt}}>{"מזג אוויר: "}</span>{"בהיר, 22°C"}</div>
        <div><span style={{color:lt}}>{"מגבלות: "}</span>{"מרפסת שירות לא נגישה בעת הבדיקה"}</div>
      </div>
      <Sec>כלים בשימוש</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,display:"flex",flexWrap:"wrap",gap:4}}>
        {["מצלמה תרמית (FLIR)","מד רטיבות","מד מפלס","פלס לייזר","מצלמה 48MP"].map((t,i)=>
          <span key={i} style={{display:"flex",alignItems:"center",gap:3}}><span style={{color:accent}}>✓</span>{t}</span>
        )}
      </div>
      <Foot n={2} title={rptTitle}/>
    </div>}

    {/* ═══ DEFECTS 1 ═══ */}
    {page===2&&<div style={ps}>
      <Mini t={"דוח בדק בית — ממצאים"}/>
      <Sub>אינסטלציה</Sub>
      <DefectFull num={1}
        title={"נזילה בצנרת מים קרים מתחת לכיור המטבח"}
        location={"מטבח"}
        standard={'ת"י 1205.1 סעיף 3.2'}
        standardText={'"כל חיבורי צנרת יהיו אטומים ועמידים בלחץ עבודה"'}
        recommendation={"החלפת אטם בחיבור הצנרת, בדיקת לחץ חוזרת"}
        cost={"₪850"}
        note={"נזילה מתמשכת, נדרש טיפול דחוף"}
        photos={3}
        annexText={'נספח: צילום סעיף 3.2 מתוך ת"י 1205.1'}
      />
      <DefectFull num={2}
        title={"ניקוז איטי במקלחת ראשית — חסימה חלקית"}
        location={"חדר רחצה"}
        standard={'ת"י 1205.1 סעיף 4.1'}
        standardText={'"כל נקודת ניקוז תפעל ללא חסימה"'}
        recommendation={"פירוק וניקוי סיפון, בדיקת שיפוע ניקוז"}
        cost={"₪1,200"}
        photos={2}
      />
      <Foot n={3} title={rptTitle}/>
    </div>}

    {/* ═══ DEFECTS 2 ═══ */}
    {page===3&&<div style={ps}>
      <Mini t={"דוח בדק בית — ממצאים (המשך)"}/>
      <Sub>ריצוף</Sub>
      <DefectFull num={3}
        title={"אריח שבור בכניסה לדירה — סדק אלכסוני"}
        location={"מבואת כניסה"}
        standard={'ת"י 1555 סעיף 2.3.1'}
        standardText={'"אריחים יהיו שלמים ללא סדקים או שברים"'}
        recommendation={"החלפת אריח פגום והדבקה מחדש"}
        cost={"₪350"}
        photos={4}
        annexText={'נספח: צילום סעיף 2.3.1 מתוך ת"י 1555'}
      />
      <Sub>אלומיניום</Sub>
      <DefectFull num={4}
        title={"חלון חדר שינה — ידית לא נסגרת עד הסוף"}
        location={"חדר שינה 1"}
        standard={'ת"י 23 סעיף 5.4'}
        standardText={'"חלונות ייסגרו באופן מלא ואטום"'}
        recommendation={"החלפת ידית חלון וכיוון מנגנון נעילה"}
        cost={"₪600"}
        note={"ייתכן שהבעיה נובעת מעיוות במסגרת"}
        photos={2}
      />
      <Sub>טיח וצבע</Sub>
      <DefectFull num={5}
        title={'סדק אנכי בקיר סלון — אורך 45 ס"מ'}
        location={"סלון, קיר מזרחי"}
        standard={'ת"י 1920 סעיף 6.1'}
        standardText={'"טיח יהיה אחיד ללא סדקים"'}
        recommendation={"הרחבת טיח באזור הסדק, מילוי וצביעה מחדש"}
        cost={"₪450"}
        photos={2}
      />
      <Foot n={4} title={rptTitle}/>
    </div>}

    {/* ═══ COSTS + SUMMARY ═══ */}
    {page===4&&<div style={ps}>
      <Mini t={"דוח בדק בית — כתב כמויות + סיכום"}/>
      <Sec>כתב כמויות — אומדן עלויות</Sec>
      <div style={{border:"1px solid "+bdr,borderRadius:2,overflow:"hidden",fontSize:8}}>
        <div style={{display:"grid",gridTemplateColumns:"36px 1fr 80px",background:dk,color:"#fff",padding:"4px 6px",fontWeight:600,fontSize:7.5}}>
          <span>#</span><span>תיאור</span><span style={{textAlign:"left"}}>עלות (₪)</span>
        </div>
        <div style={{padding:"4px 6px",background:accentLt,fontWeight:700,fontSize:7.5,color:accent}}>אינסטלציה</div>
        {[
          {n:"1",t:"החלפת אטם בצנרת מטבח + בדיקת לחץ",c:"850"},
          {n:"2",t:"פירוק וניקוי סיפון מקלחת + שיפוע",c:"1,200"},
        ].map((r,i)=>
          <div key={"a"+i} style={{display:"grid",gridTemplateColumns:"36px 1fr 80px",padding:"4px 6px",borderBottom:"1px solid "+bdrLt,fontSize:8}}>
            <span style={{fontWeight:600}}>{r.n}</span><span>{r.t}</span><span style={{textAlign:"left",fontWeight:600}}>{r.c}</span>
          </div>
        )}
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
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,margin:"3px 0 8px"}}>
        {[{l:"ממצאים",v:"5",b:bg},{l:"תמונות",v:"13",b:bg},{l:"עלות כוללת",v:"₪4,036",b:accentLt}].map((s,i)=>
          <div key={i} style={{textAlign:"center",padding:"6px 3px",background:s.b,borderRadius:3,border:"1px solid "+bdrLt}}>
            <div style={{fontSize:14,fontWeight:700,color:dk}}>{s.v}</div>
            <div style={{fontSize:6.5,color:lt,marginTop:1}}>{s.l}</div>
          </div>
        )}
      </div>

      <Sec>הערות כלליות</Sec>
      <div style={{padding:"5px 8px",border:"1px solid "+bdr,borderRadius:2,background:bg,fontSize:8,lineHeight:1.6}}>
        {"הדירה נבדקה במצב טוב כללי. הליקויים שנמצאו הם ליקויי גמר אופייניים לדירה חדשה. מומלץ לדרוש תיקון מלא מהקבלן לפני חתימה על פרוטוקול מסירה."}
      </div>

      <Sec>חתימה</Sec>
      <div style={{display:"flex",gap:20,marginTop:4}}>
        <div style={{flex:1,textAlign:"center"}}>
          <div style={{height:34,border:"1px solid "+bdr,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:vlt,fontStyle:"italic"}}>חתימת מפקח</div>
          <div style={{fontSize:8,color:dk,marginTop:3,fontWeight:600}}>{"מהנדס דני לוין"}</div>
          <div style={{fontSize:7,color:lt}}>{"מ.ר. 54321 | 25.03.2026"}</div>
        </div>
        <div style={{width:60,textAlign:"center"}}>
          <div style={{height:34,border:"1px solid "+bdr,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:vlt}}>חותמת</div>
        </div>
      </div>

      <div style={{marginTop:8,padding:"4px 0",borderTop:"0.5px solid "+bdrLt,fontSize:6.5,color:vlt,lineHeight:1.6,textAlign:"center"}}>
        {"דוח זה מהווה חוות דעת הנדסית מקצועית. האומדנים הם הערכה בלבד ואינם מחייבים. יש לקבל הצעות מחיר ממקצוענים מוסמכים."}
      </div>
      <Foot n={5} title={rptTitle}/>
    </div>}

    <div style={{fontSize:9,color:"#999",textAlign:"center",padding:"4px 0 12px",direction:"rtl"}}>
      מוקאפ דוח בדק בית — inField v5 (מיושר)
    </div>
  </div>
}
