import { useState, useRef, useEffect } from "react";

const C = {
  g50:"#F0F7F4",g100:"#D1E7DD",g200:"#A3D1B5",g300:"#6DB88C",
  g500:"#1B7A44",g600:"#14643A",g700:"#0F4F2E",
  cr50:"#FEFDFB",cr100:"#FBF8F3",cr200:"#F5EFE6",cr300:"#EBE1D3",
  go100:"#FDF4E7",go300:"#F0C66B",go500:"#C8952E",go700:"#8B6514",
  n300:"#D1CEC8",n400:"#A8A49D",n500:"#7A766F",n600:"#5C5852",n700:"#3D3A36",n800:"#252420",
  sR:"#EF4444",clRed:"#b91c1c",clAmber:"#92600a",
};
const shadow={sm:"0 1px 3px rgba(60,54,42,.06)",md:"0 2px 8px rgba(60,54,42,.08)",up:"0 -4px 20px rgba(60,54,42,.12)"};

const Ic={
  Menu:()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
  Eye:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Share:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,
  Gear:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Dl:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Plus:({s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Chev:({o})=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.n400} strokeWidth="2" style={{transform:o?"rotate(180deg)":"rotate(0)",transition:"transform .2s ease"}}><path d="M6 9l6 6 6-6"/></svg>,
  Search:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  Cam:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Sync:({ok})=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ok?"#10B981":"#EF4444"} strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  X:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  User:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};

function Accordion({open,children}){
  const ref=useRef(null);const [h,setH]=useState(0);
  useEffect(()=>{if(ref.current)setH(ref.current.scrollHeight)},[children,open]);
  return <div style={{maxHeight:open?h+500:0,overflow:"hidden",transition:"max-height .3s ease"}}><div ref={ref}>{children}</div></div>
}

function Skeleton({w,h:height,r=6,mb=0}){
  return <div style={{width:w||"100%",height:height||16,borderRadius:r,background:`linear-gradient(90deg,${C.cr200} 25%,${C.cr100} 50%,${C.cr200} 75%)`,backgroundSize:"200% 100%",animation:"shimmer 1.5s ease infinite",marginBottom:mb}}/>
}

const STATUS={
  ok:     {label:"תקין",      sym:"✓",color:C.g500,  bg:"#ecfdf5",border:C.g200},
  defect: {label:"לא תקין",   sym:"✗",color:C.clRed, bg:"#fef2f2",border:"#f5c6c6"},
  partial:{label:"תקין חלקית",sym:"~",color:C.clAmber,bg:"#fefaed",border:"#f0dca0"},
  skip:   {label:"דלג",       sym:"—",color:C.n400,  bg:C.cr100, border:C.cr300},
};

const ROOMS=[
  {id:"entrance",name:"מבואת כניסה",items:[{id:"e1",text:"דלת כניסה מותקנת ותקינה?"},{id:"e2",text:"אינטרקום/פעמון מותקן ותקין?"},{id:"e3",text:"טיח וצבע תקינים?"},{id:"e4",text:"ריצוף תקין?"},{id:"e5",text:"ארון חשמל ראשי מותקן ומסומן?"},{id:"e6",text:"תאורה תקינה?"}]},
  {id:"hallway",name:"מסדרון",items:[{id:"h1",text:"טיח וצבע תקינים?"},{id:"h2",text:"ריצוף תקין?"},{id:"h3",text:"תאורה תקינה?"},{id:"h4",text:"שקעי חשמל תקינים?"}]},
  {id:"living",name:"סלון",items:[{id:"l1",text:"טיח וצבע תקינים?"},{id:"l2",text:"ריצוף תקין?"},{id:"l3",text:"שקעי חשמל תקינים?"},{id:"l4",text:"הכנה לטלוויזיה?"},{id:"l5",text:"הכנה למזגן כולל ניקוז?"},{id:"l6",text:"חלון/וטרינה תקין?"}]},
  {id:"kitchen",name:"מטבח",items:[{id:"k1",text:"מטבח מותקן?",hasChildren:true},{id:"k1a",text:"שיש מותקן ותקין?",parentId:"k1"},{id:"k1b",text:"חיפוי קירות מותקן?",parentId:"k1"},{id:"k2",text:"כיור וברז מותקנים ותקינים?"},{id:"k3",text:"הכנת גז תקינה?"},{id:"k4",text:"חלון מטבח תקין?"}]},
  {id:"bedroom1",name:"חדר שינה הורים",items:[{id:"b1_1",text:"טיח וצבע תקינים?"},{id:"b1_2",text:"ריצוף תקין?"},{id:"b1_3",text:"שקעי חשמל תקינים?"},{id:"b1_4",text:"הכנה למזגן כולל ניקוז?"},{id:"b1_5",text:"חלון תקין?"}]},
  {id:"bedroom2",name:"חדר שינה ילדים",items:[{id:"b2_1",text:"טיח וצבע תקינים?"},{id:"b2_2",text:"ריצוף תקין?"},{id:"b2_3",text:"שקעי חשמל תקינים?"},{id:"b2_4",text:"הכנה למזגן כולל ניקוז?"},{id:"b2_5",text:"חלון תקין?"}]},
  {id:"mamad",name:'ממ"ד',items:[{id:"m1",text:'דלת ממ"ד מותקנת ותקינה?'},{id:"m2",text:"חלון ותריס פלדה תקינים?"},{id:"m3",text:"טיח וצבע תקינים?"},{id:"m4",text:"ריצוף תקין?"},{id:"m5",text:"שקעי חשמל תקינים?"}]},
  {id:"bath_master",name:"חדר רחצה הורים",hasBathType:true,items:[{id:"bm1",text:"אסלה מותקנת ותקינה?"},{id:"bm2",text:"כיור וברז מותקנים ותקינים?"},{id:"bm3s",text:"אינטרפוץ מותקן ותקין?",bathType:"shower"},{id:"bm4s",text:"מוט מקלחון מותקן?",bathType:"shower"},{id:"bm5s",text:"מקלחון/מחיצה תקינה?",bathType:"shower"},{id:"bm3b",text:"אמבטיה מותקנת ותקינה?",bathType:"bath"},{id:"bm4b",text:"ברז אמבטיה מותקן ותקין?",bathType:"bath"},{id:"bm5b",text:"מחיצת אמבטיה תקינה?",bathType:"bath"},{id:"bm6",text:"חיפוי קירות תקין?"},{id:"bm7",text:"ריצוף תקין?"},{id:"bm8",text:"אוורור/וונטה תקין?"}]},
  {id:"guest_wc",name:"שירותי אורחים",items:[{id:"gw1",text:"אסלה מותקנת ותקינה?"},{id:"gw2",text:"כיור וברז מותקנים ותקינים?"},{id:"gw3",text:"חיפוי קירות תקין?"},{id:"gw4",text:"ריצוף תקין?"},{id:"gw5",text:"אוורור/וונטה תקין?"}]},
  {id:"laundry",name:"חדר כביסה/שירות",items:[{id:"la1",text:"הכנה לביוב מכונת כביסה?"},{id:"la2",text:"נקודות מים למכונת כביסה?"},{id:"la3",text:"שקע חשמל למכונת כביסה?"},{id:"la4",text:"וונטה/אוורור תקין?"},{id:"la5",text:"ריצוף תקין?"},{id:"la6",text:"ניקוז רצפה תקין?"}]},
  {id:"laundry_cover",name:"מסתור כביסה",items:[{id:"lc1",text:"דלת/תריס מותקן ותקין?"},{id:"lc2",text:"מתקן ייבוש/תליה מותקן?"},{id:"lc3",text:"ניקוז רצפה תקין?"}]},
  {id:"balcony",name:"מרפסת סלון",items:[{id:"bl1",text:"ריצוף תקין?"},{id:"bl2",text:"מעקה/חיפוי מותקן ותקין?"},{id:"bl3",text:"ניקוז רצפה תקין?"},{id:"bl4",text:"שקע חשמל מותקן?"},{id:"bl5",text:"תאורה תקינה?"},{id:"bl6",text:"נקודת גז תקינה?"}]},
  {id:"parking",name:"חניה",items:[{id:"p1",text:"חניה מסומנת ומזוהה?"},{id:"p2",text:"שלט חניה/שער תקין?"}]},
  {id:"storage",name:"מחסן",items:[{id:"s1",text:"מחסן מזוהה ונגיש?"},{id:"s2",text:"דלת מחסן תקינה?"},{id:"s3",text:"תאורה מותקנת?"}]},
];

function CheckItem({item,status,defectText,onStatus,onDefectText,isChild,isHidden,isActiveDefect,onActivate,isFirst}){
  const [expanded,setExpanded]=useState(false);
  const [hintShown,setHintShown]=useState(false);
  if(isHidden)return null;
  const st=status||"unchecked";const cfg=STATUS[st];
  const hasText=defectText&&defectText.trim().length>0;

  useEffect(()=>{if(isFirst&&st==="unchecked"&&!hintShown){const t=setTimeout(()=>setHintShown(true),800);return()=>clearTimeout(t)}},[]);

  const badge=cfg?(
    <span style={{width:24,height:24,borderRadius:5,background:cfg.bg,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:cfg.color,flexShrink:0,border:`1px solid ${cfg.border}`}}>{cfg.sym}</span>
  ):(
    <span style={{width:24,height:24,borderRadius:5,border:`2px solid ${C.cr300}`,background:C.cr50,flexShrink:0}}/>
  );

  const handleTap=()=>{
    if(st==="defect"||st==="partial"){onActivate(isActiveDefect?null:item.id)}
    else{setExpanded(!expanded);setHintShown(false)}
  };

  return <>
    <div onClick={handleTap} style={{padding:"12px 16px",paddingRight:isChild?32:16,borderBottom:`1px solid ${C.cr200}`,display:"flex",alignItems:"center",gap:12,cursor:"pointer",background:C.cr50,transition:"background .15s",position:"relative",minHeight:48}}
      onMouseEnter={e=>e.currentTarget.style.background=C.cr100} onMouseLeave={e=>e.currentTarget.style.background=C.cr50}>
      {/* Child indent line */}
      {isChild&&<div style={{position:"absolute",right:20,top:0,bottom:0,width:2,background:C.g200,borderRadius:1,opacity:.3}}/>}
      {badge}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:500,color:st==="skip"?C.n400:C.n700,lineHeight:1.5}}>{item.text}</div>
        {(st==="defect"||st==="partial")&&hasText&&!isActiveDefect&&(
          <div style={{fontSize:11,color:st==="defect"?C.clRed:C.clAmber,marginTop:2,lineHeight:1.3,opacity:.8}}>{defectText}</div>
        )}
      </div>
      {cfg&&<button onClick={e=>{e.stopPropagation();setExpanded(!expanded);if(st==="defect"||st==="partial")onActivate(null)}} style={{fontSize:10,color:C.n400,padding:"6px 10px",borderRadius:6,border:`1px solid ${C.cr200}`,background:C.cr50,flexShrink:0,cursor:"pointer",fontFamily:"'Rubik',sans-serif",minHeight:28}}>שנה</button>}
      {/* First-time hint */}
      {isFirst&&hintShown&&st==="unchecked"&&<div style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",fontSize:10,color:C.n400,display:"flex",alignItems:"center",gap:4,animation:"fadeIn .5s ease,nudgeLeft 1.5s ease 0.5s both",pointerEvents:"none"}}>
        <span>לחץ לסימון</span>
      </div>}
    </div>
    {expanded&&<div style={{display:"flex",gap:4,padding:"8px 16px",background:C.cr100,borderBottom:`1px solid ${C.cr200}`}}>
      {Object.entries(STATUS).map(([key,s])=>
        <button key={key} onClick={e=>{e.stopPropagation();onStatus(key);if(key==="defect"||key==="partial"){onActivate(item.id);setExpanded(false)}else{setExpanded(false);onActivate(null)}}}
          style={{flex:key==="skip"?.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4,
            padding:"8px 2px",borderRadius:10,cursor:"pointer",fontFamily:"'Rubik',sans-serif",
            fontSize:11,fontWeight:st===key?600:500,
            border:`1.5px solid ${st===key?s.color:C.cr200}`,
            background:st===key?s.bg:C.cr50,color:st===key?s.color:C.n500,
            transition:"all .15s",whiteSpace:"nowrap",minHeight:36,
          }}><span style={{fontWeight:700,fontSize:13}}>{s.sym}</span> {s.label}</button>
      )}
    </div>}
    {(st==="defect"||st==="partial")&&isActiveDefect&&<div style={{padding:"8px 16px",background:st==="defect"?"#fef2f2":"#fefaed",borderBottom:`1px solid ${st==="defect"?"#f5c6c6":"#f0dca0"}`}}>
      <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
        <textarea value={defectText||""} onChange={e=>onDefectText(e.target.value)} placeholder="תאר את הליקוי..." dir="rtl" rows={2} autoComplete="off" spellCheck={false}
          style={{flex:1,minHeight:40,padding:"8px 12px",borderRadius:10,border:`1px solid ${st==="defect"?"#f5c6c6":"#f0dca0"}`,background:C.cr50,fontSize:16,fontFamily:"'Rubik',sans-serif",resize:"vertical",outline:"none",lineHeight:1.5,color:C.n800,boxSizing:"border-box"}}
          onFocus={e=>e.target.style.borderColor=st==="defect"?C.clRed:C.clAmber}
          onBlur={e=>e.target.style.borderColor=st==="defect"?"#f5c6c6":"#f0dca0"}
          onClick={e=>e.stopPropagation()}/>
        <button onClick={e=>e.stopPropagation()} style={{width:40,height:40,borderRadius:10,border:`1px solid ${st==="defect"?"#f5c6c6":"#f0dca0"}`,background:C.cr50,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,color:st==="defect"?C.clRed:C.clAmber}}><Ic.Cam/></button>
      </div>
      <button onClick={e=>{e.stopPropagation();onActivate(null)}}
        style={{marginTop:8,width:"100%",height:36,borderRadius:8,border:"none",
          background:st==="defect"?C.clRed:C.clAmber,color:"#fff",
          fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Rubik',sans-serif",
          display:"flex",alignItems:"center",justifyContent:"center",gap:6,
          opacity:defectText&&defectText.trim()?1:.5,
          transition:"opacity .15s"}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        שמור
      </button>
    </div>}
  </>;
}

function BathTypeSelect({value,onChange}){
  return <div style={{display:"flex",gap:8,padding:"8px 16px",background:C.cr100,borderBottom:`1px solid ${C.cr200}`}}>
    {[{k:"shower",l:"מקלחון"},{k:"bath",l:"אמבטיה"}].map(o=>
      <button key={o.k} onClick={()=>onChange(o.k)} style={{flex:1,padding:"8px",borderRadius:20,cursor:"pointer",fontFamily:"'Rubik',sans-serif",fontSize:12,fontWeight:o.k===value?600:400,border:`1.5px solid ${o.k===value?C.g500:C.cr300}`,background:o.k===value?C.g500:"transparent",color:o.k===value?"#fff":C.n600,transition:"all .15s"}}>{o.l}</button>
    )}
  </div>;
}

const CATEGORIES = ["אינסטלציה","חשמל","אלומיניום","ריצוף","טיח וצבע","איטום","נגרות","כללי"];

function FabSheet({open,onClose,rooms,closing}){
  const defaultLocs=rooms.map(r=>r.name);
  const [cats,setCats]=useState(CATEGORIES);
  const [locs,setLocs]=useState(defaultLocs);
  const [cat,setCat]=useState("");const [catOpen,setCatOpen]=useState(false);
  const [loc,setLoc]=useState("");const [locOpen,setLocOpen]=useState(false);
  const [desc,setDesc]=useState("");
  useEffect(()=>{if(open){setCat("");setLoc("");setDesc("");setCatOpen(false);setLocOpen(false)}},[open]);
  if(!open)return null;

  const q=cat.toLowerCase();
  const filtered=q?cats.filter(c=>c.includes(q)):cats;
  const showAdd=q&&!cats.some(c=>c===cat);

  const lq=loc.toLowerCase();
  const filteredLocs=lq?locs.filter(l=>l.includes(lq)):locs;
  const locShowAdd=lq&&!locs.some(l=>l===loc);

  const canSave=cat&&cats.includes(cat)&&desc.trim();

  return <>
    <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",zIndex:150,animation:closing?"fadeOut .2s ease forwards":"fadeIn .2s ease"}}/>
    <div onClick={()=>{setCatOpen(false);setLocOpen(false)}} style={{position:"absolute",bottom:0,left:0,right:0,background:C.cr50,zIndex:200,borderTopLeftRadius:16,borderTopRightRadius:16,display:"flex",flexDirection:"column",height:"85vh",animation:closing?"slideDown .25s ease forwards":"slideUp .35s cubic-bezier(.22,1,.36,1)",boxShadow:shadow.up}}>
      <div style={{display:"flex",justifyContent:"center",padding:"8px 0 0"}}><div style={{width:36,height:4,borderRadius:2,background:C.cr300}}/></div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 16px 12px"}}>
        <div style={{fontSize:17,fontWeight:700,color:C.n800}}>הוספת ליקוי</div>
        <button onClick={onClose} style={{background:C.cr100,border:"none",borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.n600}}><Ic.X/></button>
      </div>

      <div style={{flex:1,overflow:"auto",padding:"0 16px 16px"}} onClick={()=>setCatOpen(false)}>
        {/* Category — ComboField style */}
        <div style={{marginBottom:12,position:"relative"}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
            <label style={{fontSize:11,fontWeight:500,color:C.n700,display:"flex",alignItems:"center",gap:4}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.n400} strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              קטגוריה <span style={{color:C.sR}}>*</span>
            </label>
            {cat&&cats.includes(cat)&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.g500} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",
            borderRadius:catOpen?"10px 10px 0 0":"10px",
            border:`1px solid ${catOpen?C.g500:cat&&cats.includes(cat)?C.g200:C.cr300}`,
            borderBottom:catOpen?`1px solid ${C.cr200}`:undefined,
            background:cat&&cats.includes(cat)?C.g50:C.cr50,transition:"border-color .15s"}}>
            <input value={cat} onChange={e=>setCat(e.target.value)} onFocus={()=>{setCatOpen(true);setLocOpen(false)}}
              placeholder="בחר או הקלד קטגוריה..." autoComplete="off" spellCheck={false}
              style={{flex:1,border:"none",background:"none",fontSize:16,fontFamily:"'Rubik',sans-serif",outline:"none",direction:"rtl",color:C.n800}}/>
            {cat&&<button onClick={()=>{setCat("");setCatOpen(true)}} style={{background:"none",border:"none",cursor:"pointer",color:C.n400,padding:0}}><Ic.X/></button>}
          </div>
          {catOpen&&<div style={{position:"absolute",top:"100%",left:0,right:0,marginTop:-1,
            background:C.cr50,border:`1px solid ${C.g500}`,borderTop:"none",
            borderRadius:"0 0 10px 10px",boxShadow:shadow.md,zIndex:20,maxHeight:180,overflow:"auto"}}>
            {showAdd&&<div onClick={()=>{setCats(p=>[...p,cat]);setCatOpen(false)}}
              style={{padding:"9px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:C.g500,fontWeight:500,fontSize:13,borderBottom:`1px solid ${C.cr200}`}}
              onMouseEnter={e=>e.currentTarget.style.background=C.g50} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.g500} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              הוסף קטגוריה "{cat}"
            </div>}
            {filtered.map((c,i)=>
              <div key={i} onClick={()=>{setCat(c);setCatOpen(false)}}
                style={{padding:"9px 12px",fontSize:13,color:C.n700,cursor:"pointer",borderBottom:`1px solid ${C.cr200}`,transition:"background .1s"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.cr100} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                {c}
              </div>
            )}
          </div>}
        </div>

        {/* Location — ComboField style, same as category */}
        <div style={{marginBottom:12,position:"relative"}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
            <label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:500,color:C.n500}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.n400} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              מיקום (חדר)
            </label>
            {loc&&locs.includes(loc)&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.g500} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",
            borderRadius:locOpen?"10px 10px 0 0":"10px",
            border:`1px solid ${locOpen?C.g500:loc&&locs.includes(loc)?C.g200:C.cr300}`,
            borderBottom:locOpen?`1px solid ${C.cr200}`:undefined,
            background:loc&&locs.includes(loc)?C.g50:C.cr50,transition:"border-color .15s"}}>
            <input value={loc} onChange={e=>{setLoc(e.target.value);setLocOpen(true)}} onFocus={()=>{setLocOpen(true);setCatOpen(false)}}
              placeholder="בחר או הקלד מיקום..." autoComplete="off" spellCheck={false}
              style={{flex:1,border:"none",background:"none",fontSize:16,fontFamily:"'Rubik',sans-serif",outline:"none",direction:"rtl",color:C.n800}}/>
            {loc&&<button onClick={()=>{setLoc("");setLocOpen(true)}} style={{background:"none",border:"none",cursor:"pointer",color:C.n400,padding:0}}><Ic.X/></button>}
          </div>
          {locOpen&&<div style={{position:"absolute",top:"100%",left:0,right:0,marginTop:-1,
            background:C.cr50,border:`1px solid ${C.g500}`,borderTop:"none",
            borderRadius:"0 0 10px 10px",boxShadow:shadow.md,zIndex:19,maxHeight:180,overflow:"auto"}}>
            {locShowAdd&&<div onClick={()=>{setLocs(p=>[...p,loc]);setLocOpen(false)}}
              style={{padding:"9px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:C.g500,fontWeight:500,fontSize:13,borderBottom:`1px solid ${C.cr200}`}}
              onMouseEnter={e=>e.currentTarget.style.background=C.g50} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.g500} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              הוסף מיקום "{loc}"
            </div>}
            {filteredLocs.map((l,i)=>
              <div key={i} onClick={()=>{setLoc(l);setLocOpen(false)}}
                style={{padding:"9px 12px",fontSize:13,color:C.n700,cursor:"pointer",borderBottom:`1px solid ${C.cr200}`,transition:"background .1s"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.cr100} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                {l}
              </div>
            )}
          </div>}
        </div>

        {/* Description */}
        <div style={{marginBottom:12}}>
          <label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:500,color:C.n700,marginBottom:4}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.n400} strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            תיאור הליקוי <span style={{color:C.sR}}>*</span>
          </label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="תאר את הליקוי שמצאת..." dir="rtl" rows={3} autoComplete="off" spellCheck={false}
            style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${desc?C.g200:C.cr300}`,background:desc?C.g50:C.cr50,fontSize:16,fontFamily:"'Rubik',sans-serif",resize:"vertical",outline:"none",lineHeight:1.5,color:C.n800,boxSizing:"border-box"}}/>
        </div>

        {/* Camera */}
        <button style={{width:"100%",padding:"10px",borderRadius:10,border:`2px dashed ${C.g200}`,background:C.g50,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'Rubik',sans-serif",fontSize:13,color:C.g500,marginBottom:16}}><Ic.Cam/> צלם תמונה</button>
      </div>

      {/* Save */}
      <div style={{padding:"10px 16px max(20px, env(safe-area-inset-bottom, 20px))",borderTop:`1px solid ${C.cr200}`}}>
        <button disabled={!canSave} onClick={()=>{if(canSave)onClose()}}
          style={{width:"100%",height:46,borderRadius:12,border:"none",background:canSave?C.g500:C.cr300,color:canSave?"#fff":C.n400,fontSize:15,fontWeight:600,cursor:canSave?"pointer":"not-allowed",fontFamily:"'Rubik',sans-serif",transition:"background .15s"}}>הוסף ליקוי</button>
      </div>
    </div>
  </>;
}

export default function DocFieldChecklist(){
  const [open,setOpen]=useState({entrance:true});
  const [menu,setMenu]=useState(false);const [menuClosing,setMenuClosing]=useState(false);
  const [synced,setSynced]=useState(true);
  const [showSearch,setShowSearch]=useState(false);const [searchClosing,setSearchClosing]=useState(false);
  const [showFab,setShowFab]=useState(false);const [fabClosing,setFabClosing]=useState(false);
  const [statuses,setStatuses]=useState({});
  const [defectTexts,setDefectTexts]=useState({});
  const [bathTypes,setBathTypes]=useState({bath_master:"shower"});
  const [activeDefect,setActiveDefect]=useState(null);
  const [isLoading,setIsLoading]=useState(true);
  const [mounted,setMounted]=useState(false);

  useEffect(()=>{const t=setTimeout(()=>setIsLoading(false),1200);return()=>clearTimeout(t)},[]);
  useEffect(()=>{if(!isLoading)setTimeout(()=>setMounted(true),50)},[isLoading]);

  const tog=(id)=>setOpen(p=>{const n={};Object.keys(p).forEach(k=>n[k]=false);n[id]=!p[id];return n});
  const onStatus=(id,s)=>{setStatuses(p=>({...p,[id]:s}));if(s!=="defect"&&s!=="partial")setDefectTexts(p=>{const n={...p};delete n[id];return n})};
  const onDefectText=(id,t)=>setDefectTexts(p=>({...p,[id]:t}));
  const closeMenu=()=>{setMenuClosing(true);setTimeout(()=>{setMenu(false);setMenuClosing(false)},250)};
  const closeSearch=()=>{setSearchClosing(true);setTimeout(()=>{setShowSearch(false);setSearchClosing(false)},250)};
  const closeFab=()=>{setFabClosing(true);setTimeout(()=>{setShowFab(false);setFabClosing(false)},250)};

  const allVis=ROOMS.flatMap(r=>r.items.filter(i=>{
    if(i.bathType&&i.bathType!==(bathTypes[r.id]||"shower"))return false;
    if(i.parentId&&statuses[i.parentId]!=="ok")return false;return true;
  }));
  const checked=allVis.filter(i=>statuses[i.id]).length;
  const total=allVis.length;
  const defTotal=allVis.filter(i=>statuses[i.id]==="defect"||statuses[i.id]==="partial").length;
  const tb=[{i:<Ic.Eye/>},{i:<Ic.Share/>},{i:<Ic.Gear/>},{i:<Ic.Dl/>}];
  let globalItemIdx=0;

  return(
    <div style={{maxWidth:430,margin:"0 auto",height:"100vh",display:"flex",flexDirection:"column",background:C.cr50,fontFamily:"'Rubik',sans-serif",direction:"rtl",position:"relative",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <div style={{flex:1,overflow:"auto",paddingBottom:90,WebkitOverflowScrolling:"touch"}}>

        {/* HEADER */}
        <div style={{background:`linear-gradient(135deg,${C.g700},${C.g600})`,padding:"16px",color:"#fff"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setMenu(true)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",padding:4}}><Ic.Menu/></button>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18,fontWeight:700,letterSpacing:-.3}}>DocField</span>
                <button onClick={()=>setSynced(!synced)} style={{background:synced?"rgba(16,185,129,.2)":"rgba(239,68,68,.2)",border:"none",borderRadius:20,padding:"2px 8px",display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}>
                  <Ic.Sync ok={synced}/><span style={{fontSize:10,color:synced?"#6ee7b7":C.go300,fontWeight:500}}>{synced?"מסונכרן":"לא מסונכרן"}</span>
                </button>
              </div>
              <div style={{fontSize:12,opacity:.7,fontWeight:300,marginTop:4}}>גני השרון, בניין A, דירה 12</div>
            </div>
          </div>
        </div>

        {/* REPORT CARD */}
        <div style={{margin:"8px 12px 0",padding:"14px",borderRadius:12,background:C.cr50,border:`1px solid ${C.cr200}`,boxShadow:shadow.sm}}>
          {isLoading?(<div style={{display:"grid",gap:8}}><Skeleton h={18} w="70%"/><Skeleton h={12} w="50%"/><Skeleton h={12} w="40%"/><div style={{borderTop:`1px solid ${C.cr200}`,paddingTop:8,marginTop:4}}><Skeleton h={14} w="60%"/></div></div>):(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:C.n800,marginBottom:4,display:"flex",alignItems:"center",gap:8}}>
                  <span>פרוטוקול מסירה — דירה 12</span>
                  <span style={{fontSize:10,color:"#fff",background:C.g500,padding:"2px 8px",borderRadius:4,fontWeight:500}}>טיוטה</span>
                </div>
                {[["פרויקט:","גני השרון"],["דייר:","ישראל ישראלי"],["תאריך:","29.03.2026"]].map(([l,v],i)=>
                  <div key={i} style={{fontSize:12,display:"flex",gap:4}}><span style={{color:C.n400}}>{l}</span><span style={{color:C.n600,fontWeight:500}}>{v}</span></div>
                )}
              </div>
              <div style={{display:"flex",gap:4}}>
                {tb.map((b,i)=><button key={i} style={{width:36,height:36,borderRadius:8,border:`1px solid ${C.cr200}`,background:C.cr50,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.n500,transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=C.g50;e.currentTarget.style.color=C.g500}}
                  onMouseLeave={e=>{e.currentTarget.style.background=C.cr50;e.currentTarget.style.color=C.n500}}
                >{b.i}</button>)}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,paddingTop:8,borderTop:`1px solid ${C.cr200}`}}>
              <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                <span style={{fontSize:18,fontWeight:700,color:C.g700}}>{checked}</span>
                <span style={{fontSize:11,color:C.n500}}>/ {total} נבדקו</span>
              </div>
              <div style={{width:1,height:14,background:C.cr300,margin:"0 4px"}}/>
              <span style={{fontSize:10,color:C.n400,display:"flex",alignItems:"center",gap:3}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                {defTotal} ליקויים
              </span>
              <span style={{fontSize:10,color:C.n400}}>{ROOMS.length} חדרים</span>
            </div>
          </>)}
        </div>

        {/* ROOMS */}
        <div style={{padding:"8px 12px 0"}}>
          {isLoading?(<div style={{display:"grid",gap:8}}>{[1,2,3,4,5].map(i=><Skeleton key={i} h={52} r={10}/>)}</div>):(
          ROOMS.map((room,idx)=>{
            const isO=!!open[room.id];
            const vis=room.items.filter(i=>{if(i.bathType&&i.bathType!==(bathTypes[room.id]||"shower"))return false;if(i.parentId&&statuses[i.parentId]!=="ok")return false;return true});
            const okC=vis.filter(i=>statuses[i.id]==="ok").length;const dC=vis.filter(i=>statuses[i.id]==="defect").length;
            const pC=vis.filter(i=>statuses[i.id]==="partial").length;const sC=vis.filter(i=>statuses[i.id]==="skip").length;
            const done=okC+dC+pC+sC;const t=vis.length;const pct=t>0?Math.round((done/t)*100):0;

            return(
              <div key={room.id} style={{marginBottom:8,borderRadius:10,overflow:"hidden",background:C.cr50,border:`1px solid ${isO?C.g200:C.cr200}`,boxShadow:shadow.sm,
                opacity:mounted?1:0,transform:mounted?"translateY(0)":"translateY(12px)",
                transition:`opacity .3s ease ${idx*60}ms, transform .3s ease ${idx*60}ms`}}>
                <button onClick={()=>tog(room.id)} style={{
                  width:"100%",display:"flex",alignItems:"center",gap:8,padding:"14px 12px",
                  border:"none",cursor:"pointer",textAlign:"right",
                  background:C.g50,
                  borderRight:`4px solid ${C.g500}`,
                }}>
                  {/* Grip dots */}
                  <div style={{color:C.n300,cursor:"grab",flexShrink:0,touchAction:"none"}}>
                    <svg width="10" height="18" viewBox="0 0 10 22" fill={C.n300}><circle cx="3" cy="3" r="1.5"/><circle cx="7" cy="3" r="1.5"/><circle cx="3" cy="8" r="1.5"/><circle cx="7" cy="8" r="1.5"/><circle cx="3" cy="13" r="1.5"/><circle cx="7" cy="13" r="1.5"/></svg>
                  </div>
                  {/* Count badge — like v5-mockup category badge, dynamic */}
                  <div style={{width:22,height:22,borderRadius:5,
                    background:done>0?(dC>0||pC>0?C.clRed:C.g500):C.cr200,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:10,fontWeight:700,color:done>0?"#fff":C.n500,
                    transition:"all .25s ease"}}>
                    {done>0?done:t}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.g700}}>{room.name}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                      {done>0?<>
                        {okC>0&&<span style={{fontSize:10,color:C.g500,fontWeight:500}}>{okC} ✓</span>}
                        {dC>0&&<span style={{fontSize:10,color:C.clRed,fontWeight:500}}>{dC} ✗</span>}
                        {pC>0&&<span style={{fontSize:10,color:C.clAmber,fontWeight:500}}>{pC} ~</span>}
                        {sC>0&&<span style={{fontSize:10,color:C.n400}}>{sC} דלג</span>}
                        {done<t&&<span style={{fontSize:10,color:C.n400}}>{t-done} נותרו</span>}
                      </>:<span style={{fontSize:12,color:C.n500}}>{t} פריטים</span>}
                    </div>
                  </div>
                  <Ic.Chev o={isO}/>
                </button>
                {isO&&t>0&&<div style={{padding:"0 12px 8px",display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1,height:3,background:C.cr200,borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:pct===100?C.g500:C.go500,borderRadius:2,transition:"width .4s cubic-bezier(.22,1,.36,1)"}}/>
                  </div>
                  <span style={{fontSize:10,color:pct===100?C.g500:C.n400,fontWeight:500}}>{done}/{t}</span>
                </div>}
                <Accordion open={isO}>
                  <div style={{borderTop:`1px solid ${C.cr200}`}}>
                    {room.hasBathType&&<BathTypeSelect value={bathTypes[room.id]||"shower"} onChange={v=>setBathTypes(p=>({...p,[room.id]:v}))}/>}
                    {room.items.map((item,ii)=>{
                      const hidden=(item.bathType&&item.bathType!==(bathTypes[room.id]||"shower"))||(item.parentId&&statuses[item.parentId]!=="ok");
                      const isFirstGlobal=globalItemIdx===0&&!hidden;
                      if(!hidden)globalItemIdx++;
                      return <CheckItem key={item.id} item={item} status={statuses[item.id]} defectText={defectTexts[item.id]}
                        onStatus={s=>onStatus(item.id,s)} onDefectText={t=>onDefectText(item.id,t)}
                        isChild={!!item.parentId} isHidden={hidden}
                        isActiveDefect={activeDefect===item.id} onActivate={setActiveDefect}
                        isFirst={isFirstGlobal}/>;
                    })}
                  </div>
                </Accordion>
              </div>
            );
          }))}
        </div>
      </div>

      {/* FOOTER — v6: 3 buttons */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:C.cr50,borderTop:`1px solid ${C.cr200}`,padding:"12px 12px max(24px, env(safe-area-inset-bottom, 24px))",display:"flex",alignItems:"center",gap:8,boxShadow:shadow.up,zIndex:100}}>
        <button onClick={()=>setShowFab(true)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:C.g500,color:"#fff",border:"none",borderRadius:10,height:44,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'Rubik',sans-serif",transition:"transform .1s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
        ><Ic.Plus s={20}/> הוסף ליקוי</button>
        <button style={{width:44,height:44,borderRadius:10,border:`1px solid ${C.cr200}`,background:C.cr50,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.n500,transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=C.go100;e.currentTarget.style.color=C.go500;e.currentTarget.style.borderColor=C.go300}}
          onMouseLeave={e=>{e.currentTarget.style.background=C.cr50;e.currentTarget.style.color=C.n500;e.currentTarget.style.borderColor=C.cr200}}
        ><Ic.Cam/></button>
        <button onClick={()=>setShowSearch(true)} style={{width:44,height:44,borderRadius:10,border:`1px solid ${C.cr200}`,background:C.cr50,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.n500,transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=C.g50;e.currentTarget.style.color=C.g500}}
          onMouseLeave={e=>{e.currentTarget.style.background=C.cr50;e.currentTarget.style.color=C.n500}}
        ><Ic.Search/></button>
      </div>

      {/* SEARCH — with exit animation */}
      {showSearch&&<>
        <div onClick={closeSearch} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",zIndex:150,animation:searchClosing?"fadeOut .2s ease forwards":"fadeIn .2s ease"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:C.cr50,zIndex:200,borderTopLeftRadius:16,borderTopRightRadius:16,padding:"16px",maxHeight:"75vh",overflow:"auto",animation:searchClosing?"slideDown .25s ease forwards":"slideUp .35s cubic-bezier(.22,1,.36,1)"}}>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <div style={{flex:1,display:"flex",alignItems:"center",background:C.cr100,borderRadius:10,padding:"8px 12px",gap:8}}>
              <Ic.Search/><input placeholder="חפש במאגר ממצאים..." autoComplete="off" spellCheck={false} style={{border:"none",background:"none",flex:1,fontSize:16,outline:"none",fontFamily:"inherit",direction:"rtl"}}/>
            </div>
            <button onClick={closeSearch} style={{background:"none",border:"none",color:C.n500,cursor:"pointer",fontSize:13}}>ביטול</button>
          </div>
          <div style={{fontSize:12,color:C.n400,marginBottom:8,fontWeight:500}}>חיפושים אחרונים</div>
          {["נזילה בצנרת","סדק אנכי בקיר","חלון לא נסגר","רטיבות תקרה"].map((s,i)=>
            <div key={i} style={{padding:"10px 12px",borderRadius:8,cursor:"pointer",fontSize:13,color:C.n600,display:"flex",alignItems:"center",gap:8,transition:"background .15s"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.cr100} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.n400} strokeWidth="1.5"><polyline points="12 5 12 12 16 14"/><circle cx="12" cy="12" r="10"/></svg>{s}
            </div>
          )}
        </div>
      </>}

      {/* MENU — with user context + exit animation */}
      {menu&&<>
        <div onClick={closeMenu} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",zIndex:150,animation:menuClosing?"fadeOut .2s ease forwards":"fadeIn .2s ease"}}/>
        <div style={{position:"absolute",top:0,right:0,width:"75%",height:"100%",background:C.cr50,zIndex:200,padding:"24px 20px",animation:menuClosing?"slideOutRight .25s ease forwards":"slideInRight .3s ease",overflowY:"auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.cr200}`}}>
            <div style={{width:40,height:40,borderRadius:10,background:C.g50,display:"flex",alignItems:"center",justifyContent:"center",color:C.g500}}><Ic.User/></div>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:C.n800}}>דני לוין</div>
              <div style={{fontSize:11,color:C.n400}}>לוין הנדסה בע"מ</div>
              <div style={{fontSize:10,color:C.go500,fontWeight:500,marginTop:2}}>Pro Plan</div>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:18,fontWeight:700,color:C.g700}}>תפריט</div>
            <button onClick={closeMenu} style={{background:C.cr100,border:"none",borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.n600}}><Ic.X/></button>
          </div>
          {["דאשבורד","הדוחות שלי","מאגר ממצאים","הגדרות","עזרה"].map((item,i)=>
            <div key={i} style={{padding:"14px 0",borderBottom:`1px solid ${C.cr200}`,fontSize:14,color:C.n700,cursor:"pointer",fontWeight:500}}>{item}</div>
          )}
        </div>
      </>}

      <FabSheet open={showFab} onClose={closeFab} rooms={ROOMS} closing={fabClosing}/>

      <style>{`
        *{-webkit-tap-highlight-color:transparent;box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:${C.cr300};border-radius:4px}
        input::placeholder,textarea::placeholder{color:${C.n400}}
        button:focus-visible{outline:2px solid ${C.g500};outline-offset:2px}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeOut{from{opacity:1}to{opacity:0}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes slideDown{from{transform:translateY(0)}to{transform:translateY(100%)}}
        @keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes slideOutRight{from{transform:translateX(0)}to{transform:translateX(100%)}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes nudgeLeft{0%,100%{transform:translateY(-50%) translateX(0)}50%{transform:translateY(-50%) translateX(-8px)}}
      `}</style>
    </div>
  );
}
