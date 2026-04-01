import { useState, useRef, useEffect } from "react";

const C = {
  g50:"#F0F7F4", g100:"#D1E7DD", g200:"#A3D1B5", g300:"#6DB88C",
  g500:"#1B7A44", g600:"#14643A", g700:"#0F4F2E",
  cr50:"#FEFDFB", cr100:"#FBF8F3", cr200:"#F5EFE6", cr300:"#EBE1D3",
  go100:"#FDF4E7", go300:"#F0C66B", go500:"#C8952E", go700:"#8B6514",
  n300:"#D1CEC8", n400:"#A8A49D", n500:"#7A766F", n600:"#5C5852", n700:"#3D3A36", n800:"#252420",
  sR:"#EF4444", sG:"#10B981",
};
const shadow = {
  sm: "0 1px 3px rgba(60,54,42,.06)",
  md: "0 2px 8px rgba(60,54,42,.08)",
  up: "0 -2px 8px rgba(60,54,42,.06)",
};

const cats = [
  {id:1,name:"אינסטלציה",count:6,photos:9,defs:[
    {id:1,t:"נזילה בצנרת מתחת לכיור",ph:3,loc:"מטבח",std:'ת"י 1205.1'},
    {id:2,t:"לחץ מים נמוך בברז אמבטיה",ph:0,loc:"חדר רחצה"},
    {id:3,t:"ניקוז איטי במקלחת הראשית",ph:2,loc:"חדר רחצה"},
    {id:4,t:"חוסר אוורור בצנרת ביוב",ph:0,loc:"חדר שירות"},
    {id:5,t:"רטיבות סביב חיבור צנרת",ph:1,loc:"מרפסת שירות"},
    {id:6,t:"חוסר בידוד צנרת מים חמים",ph:0,loc:"מטבח"},
  ]},
  {id:2,name:"חשמל",count:2,photos:3,defs:[
    {id:7,t:"שקע לא מותקן בגובה תקני",ph:2,loc:"סלון"},
    {id:8,t:"חוסר הארקה בלוח חשמל משני",ph:1,loc:"מרתף"},
  ]},
  {id:3,name:"אלומיניום",count:9,photos:15,defs:[
    {id:9,t:"חלון לא נסגר בצורה תקינה",ph:4,loc:"חדר שינה 1"},
    {id:10,t:"תריס חשמלי תקוע במצב פתוח",ph:0,loc:"סלון"},
    {id:11,t:'אטימה לקויה בחלון דרומי',ph:2,loc:"חדר שינה 2"},
  ]},
  {id:4,name:"ריצוף",count:14,photos:22,defs:[]},
  {id:5,name:"טיח וצבע",count:3,photos:4,defs:[]},
  {id:6,name:"איטום",count:4,photos:6,defs:[]},
  {id:7,name:"נגרות",count:2,photos:2,defs:[]},
];

const tabs=[
  {name:"ממצאים",badge:null},
  {name:"פרטי דוח",badge:null},
  {name:"תוכן",badge:null},
  {name:"חוסרים",badge:"3"},
];

const catNames = ["הכל","אינסטלציה","חשמל","אלומיניום","ריצוף","טיח וצבע","איטום","נגרות"];

const Ic={
  Menu:()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
  Eye:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Plus:({s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Chev:({o})=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.n400} strokeWidth="2" style={{transform:o?"rotate(180deg)":"rotate(0)",transition:"transform .2s ease"}}><path d="M6 9l6 6 6-6"/></svg>,
  Search:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  Cam:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Lib:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  Sync:({ok})=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ok?"#10B981":"#EF4444"} strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  X:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Empty:()=><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.n300} strokeWidth="1"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  User:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};

function Accordion({open,children}){
  const ref=useRef(null);
  const [h,setH]=useState(0);
  useEffect(()=>{if(ref.current)setH(ref.current.scrollHeight)},[children,open]);
  return <div style={{maxHeight:open?h:0,overflow:"hidden",transition:"max-height .3s ease"}}>
    <div ref={ref}>{children}</div>
  </div>
}

function SwipeRow({children,onDelete,showHint}){
  const [swiped,setSwiped]=useState(false);
  const startX=useRef(0),curX=useRef(0);
  return <div style={{position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",left:0,top:0,bottom:0,width:80,display:"flex",height:"100%"}}>
      <button onClick={onDelete} style={{flex:1,background:C.sR,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
      </button>
    </div>
    <div onClick={()=>swiped&&setSwiped(false)}
      onTouchStart={e=>{startX.current=e.touches[0].clientX;curX.current=0}}
      onTouchMove={e=>{curX.current=e.touches[0].clientX-startX.current}}
      onTouchEnd={()=>{if(curX.current<-50)setSwiped(true);else if(curX.current>30)setSwiped(false)}}
      style={{transform:swiped?"translateX(-80px)":"translateX(0)",transition:"transform .25s ease",position:"relative",zIndex:2,background:C.cr50}}
    >
      {children}
      {/* First-time swipe hint */}
      {showHint&&!swiped&&<div style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",fontSize:10,color:C.n400,display:"flex",alignItems:"center",gap:4,animation:"fadeIn .5s ease .8s both,nudgeLeft 1.5s ease 1.5s both",pointerEvents:"none"}}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.n400} strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        החלק
      </div>}
    </div>
  </div>
}

// Skeleton loader component
function Skeleton({w,h,r=6,mb=0}){
  return <div style={{width:w||"100%",height:h||16,borderRadius:r,background:`linear-gradient(90deg,${C.cr200} 25%,${C.cr100} 50%,${C.cr200} 75%)`,backgroundSize:"200% 100%",animation:"shimmer 1.5s ease infinite",marginBottom:mb}}/>
}

export default function inFieldApp(){
  const [tab,setTab]=useState(0);
  const [open,setOpen]=useState({});
  const [menu,setMenu]=useState(false);
  const [menuClosing,setMenuClosing]=useState(false);
  const [synced,setSynced]=useState(true);
  const [showSearch,setShowSearch]=useState(false);
  const [searchClosing,setSearchClosing]=useState(false);
  const [deleted,setDeleted]=useState({});
  const [isEmpty]=useState(false);
  const [isLoading,setIsLoading]=useState(true);
  const [mounted,setMounted]=useState(false);
  const [searchCat,setSearchCat]=useState("הכל");
  // Camera flow
  const [showCamera,setShowCamera]=useState(false);
  const [cameraPhotos,setCameraPhotos]=useState([]);
  const [cameraReview,setCameraReview]=useState(false);

  const tog=(id)=>setOpen(p=>({...p,[id]:!p[id]}));
  const totD=cats.reduce((s,c)=>s+c.count,0);
  const totP=cats.reduce((s,c)=>s+c.photos,0);

  // Simulate loading
  useEffect(()=>{
    const t=setTimeout(()=>setIsLoading(false),1500);
    return ()=>clearTimeout(t);
  },[]);

  // Staggered mount
  useEffect(()=>{
    if(!isLoading)setTimeout(()=>setMounted(true),50);
  },[isLoading]);

  // Close menu with animation
  const closeMenu=()=>{setMenuClosing(true);setTimeout(()=>{setMenu(false);setMenuClosing(false)},250)};
  const closeSearch=()=>{setSearchClosing(true);setTimeout(()=>{setShowSearch(false);setSearchClosing(false)},250)};

  // Camera flow
  const openCamera=()=>{setShowCamera(true);setCameraPhotos([]);setCameraReview(false)};
  const takePhoto=()=>{setCameraPhotos(p=>[...p,{id:Date.now()}]);setCameraReview(true)};
  const closeCamera=()=>{setShowCamera(false);setCameraPhotos([]);setCameraReview(false)};
  const removeCameraPhoto=(id)=>setCameraPhotos(p=>p.filter(ph=>ph.id!==id));

  return(
    <div style={{maxWidth:430,margin:"0 auto",height:"100vh",display:"flex",flexDirection:"column",background:C.cr50,fontFamily:"'Rubik',sans-serif",direction:"rtl",position:"relative",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <div style={{flex:1,overflow:"auto",paddingBottom:90,WebkitOverflowScrolling:"touch"}}>

        {/* ═══ HEADER — no back button, clean ═══ */}
        <div style={{background:`linear-gradient(135deg,${C.g700},${C.g600})`,padding:"16px 16px 16px",color:"#fff"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button onClick={()=>setMenu(true)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",padding:4}}><Ic.Menu/></button>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:18,fontWeight:700,letterSpacing:-.3}}>inField</span>
                  <button onClick={()=>setSynced(!synced)} style={{background:synced?"rgba(16,185,129,.2)":"rgba(239,68,68,.2)",border:"none",borderRadius:20,padding:"2px 8px",display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}>
                    <Ic.Sync ok={synced}/>
                    <span style={{fontSize:10,color:synced?"#6ee7b7":C.go300,fontWeight:500}}>{synced?"מסונכרן":"לא מסונכרן"}</span>
                  </button>
                </div>
                <div style={{fontSize:12,opacity:.7,fontWeight:300,marginTop:4}}>הרצליה פיתוח 32, דירה 5</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ REPORT CARD — refined counter ═══ */}
        <div style={{margin:"8px 12px 0",padding:"14px",borderRadius:12,background:C.cr50,border:`1px solid ${C.cr200}`,boxShadow:shadow.sm}}>
          {isLoading ? (
            <div style={{display:"grid",gap:8}}>
              <Skeleton h={18} w="70%"/>
              <Skeleton h={12} w="50%"/>
              <Skeleton h={12} w="40%"/>
              <div style={{borderTop:`1px solid ${C.cr200}`,paddingTop:8,marginTop:4}}><Skeleton h={14} w="60%"/></div>
            </div>
          ) : (
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:C.n800,marginBottom:4,display:"flex",alignItems:"center",gap:8}}>
                    בדק בית — דירה חדשה
                    <span style={{fontSize:10,color:"#fff",background:C.g500,padding:"2px 8px",borderRadius:4,fontWeight:500}}>טיוטה</span>
                  </div>
                  {[["מזמין:","ישראל כהן"],["תאריך:","25.03.2026"]].map(([l,v],i)=>
                    <div key={i} style={{fontSize:12,display:"flex",gap:4}}><span style={{color:C.n400}}>{l}</span><span style={{color:C.n600,fontWeight:500}}>{v}</span></div>
                  )}
                </div>
                {/* Single search/preview button */}
                <button onClick={()=>setShowSearch(true)} style={{width:36,height:36,borderRadius:8,border:`1px solid ${C.cr200}`,background:C.cr50,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.n500,transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=C.g50;e.currentTarget.style.color=C.g500}}
                  onMouseLeave={e=>{e.currentTarget.style.background=C.cr50;e.currentTarget.style.color=C.n500}}
                ><Ic.Search/></button>
              </div>
              {/* Counter — smaller, decorative */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,paddingTop:8,borderTop:`1px solid ${C.cr200}`}}>
                <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                  <span style={{fontSize:18,fontWeight:700,color:C.g700}}>{totD}</span>
                  <span style={{fontSize:11,color:C.n500,fontWeight:500}}>ממצאים</span>
                </div>
                <div style={{width:1,height:14,background:C.cr300,margin:"0 4px"}}/>
                <span style={{fontSize:10,color:C.n400,display:"flex",alignItems:"center",gap:3}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  {totP}
                </span>
                <span style={{fontSize:10,color:C.n400}}>{cats.length} קטגוריות</span>
              </div>
            </>
          )}
        </div>

        {/* ═══ TABS — always-red badge ═══ */}
        <div style={{display:"flex",margin:"8px 12px 0",borderRadius:8,overflow:"hidden",border:`1px solid ${C.cr200}`,background:C.cr100}}>
          {tabs.map((t,i)=>
            <button key={i} onClick={()=>setTab(i)} style={{flex:1,padding:"8px 4px",fontSize:12,fontWeight:tab===i?600:400,color:tab===i?C.g700:C.n400,background:tab===i?C.cr50:"transparent",border:"none",cursor:"pointer",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",gap:4,transition:"all .2s"}}>
              {t.name}
              {t.badge&&<span style={{minWidth:14,height:14,borderRadius:7,background:C.sR,color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px"}}>{t.badge}</span>}
            </button>
          )}
        </div>

        {/* ═══ CONTENT ═══ */}
        <div style={{padding:"8px 12px 0"}}>
          {isLoading ? (
            <div style={{display:"grid",gap:8}}>
              {[1,2,3,4,5].map(i=><Skeleton key={i} h={52} r={10}/>)}
            </div>
          ) : isEmpty ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",textAlign:"center"}}>
              <Ic.Empty/>
              <div style={{fontSize:14,fontWeight:600,color:C.n700,marginTop:16}}>אין ממצאים עדיין</div>
              <div style={{fontSize:12,color:C.n400,marginTop:4,lineHeight:1.5}}>הוסף ממצא ראשון מהכפתור למטה,<br/>מהמאגר, או צלם תמונה</div>
              <button style={{marginTop:16,display:"flex",alignItems:"center",gap:6,background:C.g500,color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:600,cursor:"pointer"}}><Ic.Plus s={16}/> הוסף ממצא</button>
            </div>
          ) : (
            <>
              {cats.map((cat,idx)=>{
                const isO=open[cat.id];
                const visibleDefs=cat.defs.filter(d=>!deleted[d.id]);
                return(
                  <div key={cat.id} style={{
                    marginBottom:8,borderRadius:10,overflow:"hidden",background:C.cr50,
                    border:`1px solid ${C.cr200}`,boxShadow:shadow.sm,
                    opacity:mounted?1:0,transform:mounted?"translateY(0)":"translateY(12px)",
                    transition:`opacity .3s ease ${idx*60}ms, transform .3s ease ${idx*60}ms`,
                  }}>
                    <button onClick={()=>tog(cat.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"12px",background:"none",border:"none",cursor:"pointer",textAlign:"right"}}>
                      <div style={{color:C.n300,cursor:"grab",flexShrink:0,touchAction:"none"}}>
                        <svg width="10" height="18" viewBox="0 0 10 22" fill={C.n300}><circle cx="3" cy="3" r="1.5"/><circle cx="7" cy="3" r="1.5"/><circle cx="3" cy="8" r="1.5"/><circle cx="7" cy="8" r="1.5"/><circle cx="3" cy="13" r="1.5"/><circle cx="7" cy="13" r="1.5"/></svg>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:C.n800}}>{cat.name}</div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                          {/* No more badge circle — just text count */}
                          <span style={{fontSize:12,color:C.n500}}>{cat.count} ממצאים</span>
                          <span style={{fontSize:10,color:C.n400,display:"flex",alignItems:"center",gap:2}}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                            {cat.photos}
                          </span>
                        </div>
                      </div>
                      {/* "+" and chevron — more spacing between them */}
                      <div onClick={e=>e.stopPropagation()} style={{width:36,height:36,borderRadius:10,border:`1px solid ${C.g100}`,background:C.g50,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.g500,transition:"all .15s"}}
                        onMouseEnter={e=>{e.currentTarget.style.background=C.g500;e.currentTarget.style.color="#fff"}}
                        onMouseLeave={e=>{e.currentTarget.style.background=C.g50;e.currentTarget.style.color=C.g500}}
                      ><Ic.Plus s={14}/></div>
                      <div style={{width:8}}/>
                      <Ic.Chev o={isO}/>
                    </button>
                    <Accordion open={isO&&visibleDefs.length>0}>
                      <div style={{borderTop:`1px solid ${C.cr200}`}}>
                        {visibleDefs.map((d,di)=>(
                          <SwipeRow key={d.id} onDelete={()=>setDeleted(p=>({...p,[d.id]:true}))} showHint={di===0&&cat.id===1}>
                            <div style={{padding:"12px 16px",borderBottom:di<visibleDefs.length-1?`1px solid ${C.cr200}`:"none",display:"flex",alignItems:"center",gap:8,cursor:"pointer",background:C.cr50,transition:"background .15s"}}
                              onMouseEnter={e=>e.currentTarget.style.background=C.cr100}
                              onMouseLeave={e=>e.currentTarget.style.background=C.cr50}
                            >
                              {/* Smaller grip for defect items */}
                              <div style={{color:C.n300,cursor:"grab",flexShrink:0,marginTop:1}}>
                                <svg width="6" height="10" viewBox="0 0 6 14" fill={C.cr300}><circle cx="1.5" cy="2" r="1"/><circle cx="4.5" cy="2" r="1"/><circle cx="1.5" cy="6" r="1"/><circle cx="4.5" cy="6" r="1"/><circle cx="1.5" cy="10" r="1"/><circle cx="4.5" cy="10" r="1"/></svg>
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:13,fontWeight:500,color:C.n700,lineHeight:1.4}}>{d.t}</div>
                                <div style={{display:"flex",gap:8,marginTop:4}}>
                                  <span style={{fontSize:10,color:C.n400,display:"flex",alignItems:"center",gap:3}}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                    {d.loc}
                                  </span>
                                  {d.std&&<span style={{fontSize:10,color:C.n400,display:"flex",alignItems:"center",gap:3}}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                                    {d.std}
                                  </span>}
                                </div>
                              </div>
                              {/* Photo count icon instead of tiny thumbnail */}
                              {d.ph>0&&<div style={{display:"flex",alignItems:"center",gap:3,color:C.n400,fontSize:10,flexShrink:0}}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.n400} strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                <span style={{fontWeight:500}}>{d.ph}</span>
                              </div>}
                            </div>
                          </SwipeRow>
                        ))}
                      </div>
                    </Accordion>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* ═══ FOOTER — safe area padding ═══ */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:C.cr50,borderTop:`1px solid ${C.cr200}`,padding:"12px 12px max(24px, env(safe-area-inset-bottom, 24px))",display:"flex",alignItems:"center",gap:8,boxShadow:shadow.up,zIndex:100}}>
        <button style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:C.g500,color:"#fff",border:"none",borderRadius:10,height:44,fontSize:14,fontWeight:600,cursor:"pointer",transition:"transform .1s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
        ><Ic.Plus s={20}/> הוסף ממצא</button>
        <button onClick={openCamera} style={{width:44,height:44,borderRadius:10,border:`1px solid ${C.cr200}`,background:C.cr50,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.n500,transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=C.go100;e.currentTarget.style.color=C.go500;e.currentTarget.style.borderColor=C.go300}}
          onMouseLeave={e=>{e.currentTarget.style.background=C.cr50;e.currentTarget.style.color=C.n500;e.currentTarget.style.borderColor=C.cr200}}
        ><Ic.Cam/></button>
        <button onClick={()=>setShowSearch(true)} style={{width:44,height:44,borderRadius:10,border:`1px solid ${C.cr200}`,background:C.cr50,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.n500,transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=C.g50;e.currentTarget.style.color=C.g500}}
          onMouseLeave={e=>{e.currentTarget.style.background=C.cr50;e.currentTarget.style.color=C.n500}}
        ><Ic.Search/></button>
      </div>

      {/* ═══ SEARCH OVERLAY — with category chips + exit animation ═══ */}
      {showSearch&&<>
        <div onClick={closeSearch} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",zIndex:150,animation:searchClosing?"fadeOut .2s ease forwards":"fadeIn .2s ease"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:C.cr50,zIndex:200,borderTopLeftRadius:16,borderTopRightRadius:16,padding:"16px",maxHeight:"75vh",overflow:"auto",animation:searchClosing?"slideDown .25s ease forwards":"slideUp .3s cubic-bezier(.22,1,.36,1)"}}>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <div style={{flex:1,display:"flex",alignItems:"center",background:C.cr100,borderRadius:10,padding:"8px 12px",gap:8}}>
              <Ic.Search/>
              <input placeholder="חפש במאגר ממצאים..." style={{border:"none",background:"none",flex:1,fontSize:14,outline:"none",fontFamily:"inherit",direction:"rtl"}}/>
            </div>
            <button onClick={closeSearch} style={{background:"none",border:"none",color:C.n500,cursor:"pointer",fontSize:13}}>ביטול</button>
          </div>
          {/* Category filter chips */}
          <div style={{display:"flex",gap:6,marginBottom:12,overflow:"auto",paddingBottom:4}}>
            {catNames.map(c=>
              <button key={c} onClick={()=>setSearchCat(c)} style={{padding:"4px 12px",borderRadius:16,fontSize:11,fontWeight:searchCat===c?600:400,background:searchCat===c?C.g500:"transparent",color:searchCat===c?"#fff":C.n600,border:`1px solid ${searchCat===c?C.g500:C.cr300}`,cursor:"pointer",fontFamily:"inherit",flexShrink:0,whiteSpace:"nowrap"}}>{c}</button>
            )}
          </div>
          <div style={{fontSize:12,color:C.n400,marginBottom:8,fontWeight:500}}>חיפושים אחרונים</div>
          {["נזילה בצנרת","סדק אנכי בקיר","חלון לא נסגר","רטיבות תקרה"].map((s,i)=>
            <div key={i} style={{padding:"10px 12px",borderRadius:8,cursor:"pointer",fontSize:13,color:C.n600,display:"flex",alignItems:"center",gap:8,transition:"background .15s"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.cr100}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.n400} strokeWidth="1.5"><polyline points="12 5 12 12 16 14"/><circle cx="12" cy="12" r="10"/></svg>
              {s}
            </div>
          )}
        </div>
      </>}

      {/* ═══ MENU — with user context + exit animation ═══ */}
      {menu&&<>
        <div onClick={closeMenu} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",zIndex:150,animation:menuClosing?"fadeOut .2s ease forwards":"fadeIn .2s ease"}}/>
        <div style={{position:"absolute",top:0,right:0,width:"75%",height:"100%",background:C.cr50,zIndex:200,padding:"24px 20px",animation:menuClosing?"slideOutRight .25s ease forwards":"slideInRight .3s ease",overflowY:"auto"}}>
          {/* User context */}
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
            <div key={i} style={{padding:"14px 0",borderBottom:`1px solid ${C.cr200}`,fontSize:14,color:C.n700,cursor:"pointer",fontWeight:500}}>
              {item}
            </div>
          )}
        </div>
      </>}

      {/* ═══ CAMERA OVERLAY ═══ */}
      {showCamera&&<div style={{position:"absolute",inset:0,zIndex:300,display:"flex",flexDirection:"column",animation:"fadeIn .2s ease"}}>

        {/* Camera viewfinder (simulated) */}
        {!cameraReview&&<div style={{flex:1,background:"#111",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative"}}>
          {/* Close */}
          <button onClick={closeCamera} style={{position:"absolute",top:16,right:16,width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.15)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",zIndex:10}}>
            <Ic.X/>
          </button>
          {/* Photo count badge */}
          {cameraPhotos.length>0&&<div style={{position:"absolute",top:20,left:16,background:C.g500,color:"#fff",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            {cameraPhotos.length}
          </div>}
          {/* Viewfinder UI */}
          <div style={{width:260,height:260,border:"2px solid rgba(255,255,255,.3)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{color:"rgba(255,255,255,.4)",fontSize:14,fontWeight:500,textAlign:"center"}}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <div style={{marginTop:8}}>כוון את המצלמה</div>
            </div>
          </div>
          {/* Shutter + gallery */}
          <div style={{position:"absolute",bottom:40,display:"flex",alignItems:"center",gap:24}}>
            {cameraPhotos.length>0&&<button onClick={()=>setCameraReview(true)} style={{width:44,height:44,borderRadius:10,background:"rgba(255,255,255,.15)",border:"none",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600}}>
              {cameraPhotos.length}
            </button>}
            <button onClick={takePhoto} style={{width:68,height:68,borderRadius:34,border:"4px solid #fff",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .1s"}}
              onMouseDown={e=>e.currentTarget.style.transform="scale(0.9)"}
              onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
            >
              <div style={{width:54,height:54,borderRadius:27,background:"#fff"}}/>
            </button>
            <div style={{width:44}}/>
          </div>
        </div>}

        {/* Review mode — see all photos */}
        {cameraReview&&<div style={{flex:1,background:C.cr50,display:"flex",flexDirection:"column"}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px",borderBottom:`1px solid ${C.cr200}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Ic.Cam/>
              <span style={{fontSize:16,fontWeight:700,color:C.n800}}>{cameraPhotos.length} תמונות צולמו</span>
            </div>
            <button onClick={closeCamera} style={{width:30,height:30,borderRadius:8,background:C.cr100,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.n500}}><Ic.X/></button>
          </div>
          {/* Photo grid */}
          <div style={{flex:1,padding:16,overflow:"auto"}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {cameraPhotos.map(ph=>
                <div key={ph.id} style={{width:96,height:96,borderRadius:10,background:C.cr200,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",border:`1px solid ${C.cr300}`}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.n400} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  <button onClick={()=>removeCameraPhoto(ph.id)} style={{position:"absolute",top:-6,right:-6,width:22,height:22,borderRadius:11,background:C.sR,border:"2px solid "+C.cr50,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Actions */}
          <div style={{padding:"12px 16px max(24px, env(safe-area-inset-bottom, 24px))",borderTop:`1px solid ${C.cr200}`,display:"flex",gap:8}}>
            <button onClick={()=>setCameraReview(false)} style={{flex:1,height:46,borderRadius:12,border:`1px solid ${C.cr300}`,background:C.cr50,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:C.n700,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <Ic.Cam/> צלם עוד
            </button>
            <button onClick={()=>{setShowCamera(false);setCameraReview(false)}} style={{flex:1.5,height:46,borderRadius:12,border:"none",background:C.g500,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <Ic.Plus s={16}/> הוסף ממצא ({cameraPhotos.length})
            </button>
          </div>
        </div>}

      </div>}

      <style>{`
        *{-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:${C.cr300};border-radius:4px}
        input::placeholder{color:${C.n400}}
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
