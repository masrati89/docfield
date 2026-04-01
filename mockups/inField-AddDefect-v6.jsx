import { useState, useRef, useEffect } from "react";

const C = {
  g50:"#F0F7F4", g100:"#D1E7DD", g200:"#A3D1B5",
  g500:"#1B7A44", g600:"#14643A", g700:"#0F4F2E",
  cr50:"#FEFDFB", cr100:"#FBF8F3", cr200:"#F5EFE6", cr300:"#EBE1D3",
  go100:"#FDF4E7", go500:"#C8952E", go700:"#8B6514",
  n300:"#D1CEC8", n400:"#A8A49D", n500:"#7A766F", n600:"#5C5852", n700:"#3D3A36", n800:"#252420",
  sR:"#EF4444",
};
const shadow = { sm:"0 1px 3px rgba(60,54,42,.06)", md:"0 2px 8px rgba(60,54,42,.08)", up:"0 -4px 20px rgba(60,54,42,.12)" };

const defaultCategories = ["אינסטלציה","חשמל","אלומיניום","ריצוף","טיח וצבע","איטום","נגרות"];
const defaultLocations = ["מטבח","סלון","חדר שינה 1","חדר שינה 2","חדר רחצה","חדר שירות","מרפסת שירות","מבואת כניסה","מרתף"];

const standardsDB = [
  { id:"1205.1", name:'ת"י 1205.1 — צנרת מים', sections: [
    { code:'3.1', title:'חיבורי צנרת — עמידות בלחץ', desc:'כל חיבורי הצנרת יעמדו בלחץ עבודה של 6 אטמוספרות לפחות' },
    { code:'3.2', title:'אטימות חיבורים', desc:'כל חיבורי צנרת יהיו אטומים ועמידים בלחץ עבודה ללא דליפה' },
    { code:'4.1', title:'ניקוז — מניעת חסימות', desc:'כל נקודת ניקוז תפעל ללא חסימה, שיפוע מינימלי 1%' },
  ]},
  { id:"1555", name:'ת"י 1555 — ריצוף וחיפוי', sections: [
    { code:'2.3.1', title:'שלמות אריחים', desc:'אריחים יהיו שלמים ללא סדקים, שברים או פגמים נראים לעין' },
    { code:'2.4', title:'אחידות מפלסים', desc:'הפרש גובה בין אריחים סמוכים לא יעלה על 1 מ"מ' },
  ]},
  { id:"23", name:'ת"י 23 — חלונות ודלתות', sections: [
    { code:'5.4', title:'נעילת חלונות', desc:'חלונות ייסגרו עד הסוף ומנגנון הנעילה יפעל בצורה תקינה' },
    { code:'6.2', title:'תריסים — תפעול', desc:'תריסים חשמליים ו/או ידניים יפעלו בצורה חלקה ללא תקיעה' },
  ]},
  { id:"1920", name:'ת"י 1920 — טיח', sections: [
    { code:'6.1', title:'ללא סדקים', desc:'טיח יהיה אחיד ללא סדקים' },
  ]},
  { id:"158", name:'ת"י 158 — איטום', sections: [
    { code:'4.2', title:'שיפועי ניקוז', desc:'שיפוע ניקוז מינימלי 1.5% לכיוון נקודת הניקוז' },
  ]},
];

const libraryItems = [
  { id:1, cat:"אינסטלציה", title:"נזילה בצנרת מים קרים מתחת לכיור", loc:"מטבח", std:'ת"י 1205.1 סעיף 3.2', stdDesc:"אטימות חיבורים", rec:"החלפת אטם בחיבור הצנרת, בדיקת לחץ חוזרת", cost:"850" },
  { id:2, cat:"אינסטלציה", title:"לחץ מים נמוך בברז אמבטיה", loc:"חדר רחצה", std:'ת"י 1205.1 סעיף 3.1', stdDesc:"חיבורי צנרת", rec:"בדיקת לחץ מים ותיקון מסנן ברז", cost:"350" },
  { id:3, cat:"ריצוף", title:"אריח שבור בכניסה — סדק אלכסוני", loc:"מבואת כניסה", std:'ת"י 1555 סעיף 2.3.1', stdDesc:"שלמות אריחים", rec:"החלפת אריח פגום והדבקה מחדש", cost:"350" },
  { id:4, cat:"אלומיניום", title:"חלון לא נסגר עד הסוף — ידית תקועה", loc:"חדר שינה 1", std:'ת"י 23 סעיף 5.4', stdDesc:"נעילת חלונות", rec:"החלפת ידית חלון וכיוון מנגנון נעילה", cost:"600" },
  { id:5, cat:"טיח וצבע", title:'סדק אנכי בקיר — אורך 45 ס"מ', loc:"סלון", std:'ת"י 1920 סעיף 6.1', stdDesc:"ללא סדקים", rec:"הרחבת טיח, מילוי וצביעה מחדש", cost:"450" },
];

const recSuggestions = [
  "החלפת אטם בחיבור הצנרת, בדיקת לחץ חוזרת","פירוק וניקוי סיפון, בדיקת שיפוע ניקוז",
  "החלפת אריח פגום והדבקה מחדש","החלפת ידית חלון וכיוון מנגנון נעילה",
  "הרחבת טיח באזור הסדק, מילוי וצביעה מחדש","תיקון שיפוע ניקוז והחלפת איטום",
];

const costUnits = [
  { id:'fixed', label:'סכום', icon:'₪' },
  { id:'sqm', label:'מ"ר', icon:'מ"ר' },
  { id:'lm', label:'מ"א', icon:'מ"א' },
  { id:'unit', label:'יח\'', icon:'יח\'' },
  { id:'day', label:'ימים', icon:'ימים' },
];

const Ic = {
  X:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Cam:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Clip:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>,
  Chev:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.n400} strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>,
  Check:()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1B7A44" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Lib:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  Plus:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  ChevR:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.n300} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>,
};

function FormField({label, required, children, icon, filled}) {
  return <div style={{marginBottom:12,position:"relative"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
      <label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:500,color:required?C.n700:C.n500}}>
        {icon&&<span style={{color:C.n400}}>{icon}</span>}{label}{required&&<span style={{color:C.sR,fontSize:10}}>*</span>}
      </label>
      {filled&&<span style={{color:C.g500}}><Ic.Check/></span>}
    </div>
    {children}
  </div>
}

// ComboField — NO search icon, clean textarea input
function ComboField({value, onChange, placeholder, suggestions, onSelect, active, onFocus, grouped, addNew, addNewLabel, richItems, onSelectRich, saveToLibrary, fieldRef}) {
  const q = value.toLowerCase();
  let filtered;
  if (grouped) {
    filtered = suggestions.map(g=>{
      if(!value)return g;
      const ms=g.sections.filter(s=>s.code.includes(q)||s.title.includes(q)||s.desc.includes(q));
      if(g.name.includes(q)||g.id.includes(q))return g;
      if(ms.length>0)return{...g,sections:ms};
      return null;
    }).filter(Boolean);
  } else if (richItems) {
    filtered = value ? richItems.filter(item=>item.title.toLowerCase().includes(q)) : richItems;
  } else {
    filtered = value ? suggestions.filter(s=>s.toLowerCase().includes(q)) : suggestions;
  }
  const showAdd = addNew && value && !(suggestions||[]).some(s=>s===value);
  const noResults = (richItems ? filtered.length===0 : (!grouped && filtered.length===0));
  const showSaveBtn = noResults && value && saveToLibrary;

  return <div style={{position:"relative"}} ref={fieldRef}>
    <div style={{
      display:"flex",alignItems:"flex-start",gap:8,
      padding:"9px 12px",borderRadius:active?"10px 10px 0 0":10,
      border:`1px solid ${active?C.g500:value?C.g200:C.cr300}`,
      borderBottom:active?`1px solid ${C.cr200}`:undefined,
      background:value?C.g50:C.cr50,transition:"border-color .15s",
    }}>
      <textarea value={value} onChange={e=>{onChange(e.target.value);e.target.style.height='auto';e.target.style.height=e.target.scrollHeight+'px'}} onFocus={onFocus} placeholder={placeholder} rows={1}
        style={{flex:1,border:"none",background:"none",fontSize:14,fontFamily:"inherit",outline:"none",direction:"rtl",resize:"none",lineHeight:1.5,minHeight:21,maxHeight:80,overflow:"auto"}}/>
      {value&&<button onClick={()=>onChange('')} style={{background:"none",border:"none",cursor:"pointer",color:C.n400,padding:0,marginTop:2,flexShrink:0}}><Ic.X/></button>}
    </div>
    {active&&<div style={{
      position:"absolute",top:"100%",left:0,right:0,marginTop:-1,
      background:C.cr50,border:`1px solid ${C.g500}`,borderTop:"none",
      borderRadius:"0 0 10px 10px",boxShadow:"0 4px 12px rgba(60,54,42,.1)",
      zIndex:20,maxHeight:200,overflow:"auto",
    }}>
      {grouped ? (
        filtered.length===0?(
          saveToLibrary&&value?
            <div onClick={saveToLibrary} style={{padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:C.g500,fontWeight:500,fontSize:12}}
              onMouseEnter={e=>e.currentTarget.style.background=C.g50} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <Ic.Plus/> הוסף למאגר
            </div>:null
        ):filtered.map(g=>
          <div key={g.id}>
            <div style={{padding:"4px 10px",background:C.g50,fontSize:11,fontWeight:600,color:C.g700,borderBottom:`1px solid ${C.cr200}`,display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:3,height:12,borderRadius:1,background:C.g500,flexShrink:0}}/>{g.name}
            </div>
            {g.sections.map(sec=>
              <div key={sec.code} onClick={()=>onSelect(g,sec)}
                style={{padding:"7px 10px 7px 18px",cursor:"pointer",borderBottom:`1px solid ${C.cr200}`,transition:"background .1s"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.cr100} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{fontSize:12,fontWeight:600,color:C.n700}}>סעיף {sec.code} — {sec.title}</div>
                <div style={{fontSize:11,color:C.n400,marginTop:2,lineHeight:1.4}}>{sec.desc}</div>
              </div>
            )}
          </div>
        )
      ) : richItems ? (
        <>
          {showSaveBtn&&<div onClick={saveToLibrary} style={{padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:C.g500,fontWeight:500,fontSize:12,borderBottom:`1px solid ${C.cr200}`}}
            onMouseEnter={e=>e.currentTarget.style.background=C.g50} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <Ic.Plus/> הוסף למאגר
          </div>}
          {filtered.map(item=>
            <div key={item.id} onClick={()=>onSelectRich(item)}
              style={{padding:"8px 12px",cursor:"pointer",borderBottom:`1px solid ${C.cr200}`,transition:"background .1s",display:"flex",alignItems:"center",gap:8}}
              onMouseEnter={e=>e.currentTarget.style.background=C.cr100} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500,color:C.n800}}>{item.title}</div>
                <div style={{display:"flex",gap:8,marginTop:3}}>
                  <span style={{fontSize:10,color:C.g700,background:C.g50,padding:"1px 5px",borderRadius:3,fontWeight:500}}>{item.cat}</span>
                  {item.loc&&<span style={{fontSize:10,color:C.n400}}>{item.loc}</span>}
                  {item.cost&&<span style={{fontSize:10,color:C.go700}}>₪{item.cost}</span>}
                </div>
              </div>
              <Ic.ChevR/>
            </div>
          )}
        </>
      ) : (
        <>
          {showSaveBtn&&<div onClick={saveToLibrary} style={{padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:C.g500,fontWeight:500,fontSize:12,borderBottom:`1px solid ${C.cr200}`}}
            onMouseEnter={e=>e.currentTarget.style.background=C.g50} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <Ic.Plus/> הוסף למאגר
          </div>}
          {showAdd&&<div onClick={()=>onSelect(value)}
            style={{padding:"9px 12px",cursor:"pointer",borderBottom:`1px solid ${C.cr200}`,display:"flex",alignItems:"center",gap:6,color:C.g500,fontWeight:500,fontSize:13}}
            onMouseEnter={e=>e.currentTarget.style.background=C.g50} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <Ic.Plus/> {addNewLabel||'הוסף'} "{value}"
          </div>}
          {filtered.map((s,i)=>
            <div key={i} onClick={()=>onSelect(s)}
              style={{padding:"9px 12px",fontSize:13,color:C.n700,cursor:"pointer",borderBottom:`1px solid ${C.cr200}`,transition:"background .1s"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.cr100} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              {s}
            </div>
          )}
        </>
      )}
    </div>}
  </div>
}

export default function AddDefectForm() {
  const [screen, setScreen] = useState('form');
  const [screenAnim, setScreenAnim] = useState('');
  const [entrySource, setEntrySource] = useState('direct');
  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCat, setSelectedCat] = useState('');
  const [defectText, setDefectText] = useState('');
  const [location, setLocation] = useState('');
  const [standard, setStandard] = useState('');
  const [standardDisplay, setStandardDisplay] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [costUnit, setCostUnit] = useState('fixed');
  const [costAmount, setCostAmount] = useState('');
  const [costQty, setCostQty] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [note, setNote] = useState('');
  const [photos, setPhotos] = useState([]);
  const [activeDD, setActiveDD] = useState(null);
  const [libSearch, setLibSearch] = useState('');
  const [libCat, setLibCat] = useState(null);

  const totalCost = costUnit==='fixed'?(parseFloat(costAmount.replace(/,/g,''))||0):(parseFloat(costQty.replace(/,/g,''))||0)*(parseFloat(costPerUnit.replace(/,/g,''))||0);
  const openDD = (name) => setActiveDD(name);
  const closeAll = () => setActiveDD(null);

  // Count filled fields for progress
  const filledCount = [selectedCat,defectText,location,standard,recommendation,(costAmount||costQty),note,photos.length>0].filter(Boolean).length;
  const totalFields = 8;

  const closeSheet = () => {setIsClosing(true);setTimeout(()=>{setIsOpen(false);setIsClosing(false)},250)};

  const selectFromLibrary=(item)=>{
    setScreenAnim('crossfade');
    setSelectedCat(item.cat);setDefectText(item.title);setLocation(item.loc);
    setStandard(item.std);setStandardDisplay(item.stdDesc);setRecommendation(item.rec);
    setCostUnit('fixed');setCostAmount(item.cost);setCostQty('');setCostPerUnit('');
    setEntrySource('library');
    setTimeout(()=>{setScreen('form');setScreenAnim('')},150);
  };
  const resetForm=()=>{
    setSelectedCat('');setDefectText('');setLocation('');setStandard('');setStandardDisplay('');
    setRecommendation('');setCostUnit('fixed');setCostAmount('');setCostQty('');setCostPerUnit('');
    setNote('');setPhotos([]);closeAll();
  };
  const goBackToLib=()=>{
    setScreenAnim('crossfade');
    resetForm();
    setTimeout(()=>{setScreen('library');setScreenAnim('')},150);
  };

  const addPhoto=()=>{if(photos.length<20)setPhotos(p=>[...p,{id:Date.now()}])};
  const removePhoto=(id)=>setPhotos(p=>p.filter(ph=>ph.id!==id));
  const canSave = selectedCat && defectText.trim().length>0;

  const filteredLib = libraryItems.filter(item=>{
    if(libCat&&item.cat!==libCat)return false;
    if(libSearch){const q=libSearch.toLowerCase();return item.title.includes(q)||item.cat.includes(q)}
    return true;
  });

  return (
    <div style={{maxWidth:430,margin:"0 auto",height:"100vh",display:"flex",flexDirection:"column",background:C.cr100,fontFamily:"'Rubik',sans-serif",direction:"rtl",position:"relative",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>

      {/* Background */}
      <div style={{flex:1,padding:16,opacity:isOpen?0.3:1,transition:"opacity .3s"}}>
        <div style={{background:`linear-gradient(135deg,${C.g700},${C.g600})`,padding:16,borderRadius:12,color:"#fff"}}>
          <div style={{fontSize:18,fontWeight:700}}>inField</div>
          <div style={{fontSize:12,opacity:.7,marginTop:4}}>הרצליה פיתוח 32, דירה 5</div>
        </div>
      </div>

      {/* Demo buttons - compact top-left */}
      <div style={{position:"absolute",top:8,left:8,zIndex:50,display:"flex",gap:4}}>
        {[
          {label:'ריק',fn:()=>{resetForm();setEntrySource('direct');setScreen('form');setIsOpen(true)}},
          {label:'+קטג\'',fn:()=>{resetForm();setSelectedCat('אלומיניום');setEntrySource('direct');setScreen('form');setIsOpen(true)}},
          {label:'מאגר',fn:()=>{setScreen('library');setEntrySource('library');setLibSearch('');setLibCat(null);setIsOpen(true)}},
        ].map((b,i)=>
          <button key={i} onClick={b.fn} style={{padding:"3px 8px",borderRadius:4,fontSize:9,fontWeight:500,background:"rgba(0,0,0,.6)",color:"#fff",border:"none",cursor:"pointer",fontFamily:"inherit"}}>{b.label}</button>
        )}
      </div>

      {isOpen&&<div onClick={closeSheet} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,animation:isClosing?"fadeOut .2s ease forwards":"fadeIn .2s ease"}}/>}

      {/* ═══ LIBRARY ═══ */}
      {isOpen&&screen==='library'&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"92vh",background:C.cr50,zIndex:200,borderTopLeftRadius:16,borderTopRightRadius:16,display:"flex",flexDirection:"column",animation:isClosing?"slideDown .25s ease forwards":screenAnim==='crossfade'?"fadeIn .2s ease":"slideUp .35s cubic-bezier(.22,1,.36,1)",boxShadow:shadow.up}}>
        <div style={{display:"flex",justifyContent:"center",padding:"8px 0 0"}}><div style={{width:36,height:4,borderRadius:2,background:C.cr300}}/></div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 16px 8px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><Ic.Lib/><div style={{fontSize:17,fontWeight:700,color:C.n800}}>מאגר ממצאים</div></div>
          <button onClick={closeSheet} style={{width:30,height:30,borderRadius:8,background:C.cr100,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.n500}}><Ic.X/></button>
        </div>
        <div style={{padding:"0 16px 8px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:10,border:`1px solid ${C.cr300}`,background:C.cr100}}>
            <input value={libSearch} onChange={e=>setLibSearch(e.target.value)} placeholder="חפש ממצא..." style={{flex:1,border:"none",background:"none",fontSize:14,fontFamily:"inherit",outline:"none",direction:"rtl"}}/>
            {libSearch&&<button onClick={()=>setLibSearch('')} style={{background:"none",border:"none",cursor:"pointer",color:C.n400,padding:0}}><Ic.X/></button>}
          </div>
        </div>
        <div style={{padding:"0 16px 8px",display:"flex",gap:6,overflow:"auto",flexShrink:0}}>
          <button onClick={()=>setLibCat(null)} style={{padding:"4px 12px",borderRadius:16,fontSize:11,fontWeight:!libCat?600:400,background:!libCat?C.g500:"transparent",color:!libCat?"#fff":C.n600,border:`1px solid ${!libCat?C.g500:C.cr300}`,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>הכל</button>
          {defaultCategories.map(cat=><button key={cat} onClick={()=>setLibCat(libCat===cat?null:cat)} style={{padding:"4px 12px",borderRadius:16,fontSize:11,fontWeight:libCat===cat?600:400,background:libCat===cat?C.g500:"transparent",color:libCat===cat?"#fff":C.n600,border:`1px solid ${libCat===cat?C.g500:C.cr300}`,cursor:"pointer",fontFamily:"inherit",flexShrink:0,whiteSpace:"nowrap"}}>{cat}</button>)}
        </div>
        <div style={{flex:1,overflow:"auto",padding:"0 16px 16px"}}>
          {filteredLib.length===0?(<div style={{textAlign:"center",padding:"40px 20px",color:C.n400,fontSize:14,fontWeight:500}}>לא נמצאו ממצאים</div>
          ):filteredLib.map(item=>
            <div key={item.id} onClick={()=>selectFromLibrary(item)} style={{padding:"10px 12px",borderRadius:10,border:`1px solid ${C.cr200}`,background:C.cr50,marginBottom:8,cursor:"pointer",transition:"all .15s",boxShadow:shadow.sm,display:"flex",alignItems:"center",gap:8}}
              onMouseEnter={e=>{e.currentTarget.style.background=C.cr100;e.currentTarget.style.borderColor=C.g200}} onMouseLeave={e=>{e.currentTarget.style.background=C.cr50;e.currentTarget.style.borderColor=C.cr200}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500,color:C.n800,lineHeight:1.4}}>{item.title}</div>
                <div style={{display:"flex",gap:8,marginTop:4,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,color:C.g700,background:C.g50,padding:"1px 6px",borderRadius:4,fontWeight:500}}>{item.cat}</span>
                  <span style={{fontSize:10,color:C.n400}}>{item.loc}</span>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                {item.cost&&<span style={{fontSize:11,fontWeight:600,color:C.go700,background:C.go100,padding:"2px 8px",borderRadius:8}}>₪{item.cost}</span>}
                <Ic.ChevR/>
              </div>
            </div>
          )}
        </div>
      </div>}

      {/* ═══ FORM ═══ */}
      {isOpen&&screen==='form'&&<div onClick={closeAll} style={{position:"absolute",bottom:0,left:0,right:0,height:"92vh",background:C.cr50,zIndex:200,borderTopLeftRadius:16,borderTopRightRadius:16,display:"flex",flexDirection:"column",animation:isClosing?"slideDown .25s ease forwards":screenAnim==='crossfade'?"fadeIn .2s ease":"slideUp .35s cubic-bezier(.22,1,.36,1)",boxShadow:shadow.up}}>
        {/* Handle */}
        <div style={{display:"flex",justifyContent:"center",padding:"8px 0 0"}}><div style={{width:36,height:4,borderRadius:2,background:C.cr300}}/></div>

        {/* Progress bar */}
        <div style={{margin:"0 16px",height:3,borderRadius:2,background:C.cr200,overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:2,background:C.g500,width:`${(filledCount/totalFields)*100}%`,transition:"width .3s ease"}}/>
        </div>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 16px 8px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{fontSize:17,fontWeight:700,color:C.n800}}>הוספת ממצא</div>
            {entrySource==='library'&&defectText&&<span style={{fontSize:10,background:C.go100,color:C.go700,padding:"2px 8px",borderRadius:4,fontWeight:500}}>מהמאגר</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:10,color:C.n400}}>{filledCount}/{totalFields}</span>
            <button onClick={e=>{e.stopPropagation();if(entrySource==='library')goBackToLib();else closeSheet()}} style={{width:30,height:30,borderRadius:8,background:C.cr100,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.n500}}><Ic.X/></button>
          </div>
        </div>

        {/* Form */}
        <div style={{flex:1,overflow:"auto",padding:"0 16px 16px",WebkitOverflowScrolling:"touch"}} onClick={closeAll}>

          {/* 1. קטגוריה */}
          <FormField label="קטגוריה" required filled={!!selectedCat} icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>}>
            <div onClick={e=>e.stopPropagation()}>
              <ComboField value={selectedCat} onChange={v=>setSelectedCat(v)} placeholder="בחר או הקלד קטגוריה..."
                suggestions={categories} active={activeDD==='cat'} onFocus={()=>openDD('cat')} addNew addNewLabel="הוסף קטגוריה"
                onSelect={v=>{setSelectedCat(v);if(!categories.includes(v))setCategories(p=>[...p,v]);closeAll()}}/>
            </div>
          </FormField>

          {/* 2. ממצא — rich library items */}
          <FormField label="תיאור הממצא" required filled={!!defectText} icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}>
            <div onClick={e=>e.stopPropagation()}>
              <ComboField value={defectText} onChange={v=>setDefectText(v)} placeholder="תאר את הממצא..."
                richItems={libraryItems} active={activeDD==='defect'} onFocus={()=>openDD('defect')}
                saveToLibrary={()=>closeAll()}
                onSelectRich={item=>{
                  setDefectText(item.title);
                  if(item.cat)setSelectedCat(item.cat);
                  if(item.loc)setLocation(item.loc);
                  if(item.std){setStandard(item.std);setStandardDisplay(item.stdDesc||'')}
                  if(item.rec)setRecommendation(item.rec);
                  if(item.cost){setCostUnit('fixed');setCostAmount(item.cost)}
                  closeAll();
                }}/>
            </div>
          </FormField>

          {/* 3. מיקום */}
          <FormField label="מיקום" filled={!!location} icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}>
            <div onClick={e=>e.stopPropagation()}>
              <ComboField value={location} onChange={v=>setLocation(v)} placeholder="בחר או הקלד מיקום..."
                suggestions={defaultLocations} active={activeDD==='loc'} onFocus={()=>openDD('loc')}
                onSelect={v=>{setLocation(v);closeAll()}}/>
            </div>
          </FormField>

          {/* 4. תקן */}
          <FormField label="תקן ישראלי" filled={!!standard} icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>}>
            <div onClick={e=>e.stopPropagation()}>
              <ComboField value={standard} onChange={v=>{setStandard(v);setStandardDisplay('')}} placeholder="הקלד או בחר תקן..."
                suggestions={standardsDB} grouped active={activeDD==='std'} onFocus={()=>openDD('std')}
                saveToLibrary={()=>closeAll()}
                onSelect={(g,sec)=>{setStandard(`ת"י ${g.id} סעיף ${sec.code}`);setStandardDisplay(sec.title);closeAll()}}/>
              {/* Standard description — styled container like PDF citation */}
              {standardDisplay&&activeDD!=='std'&&(
                <div style={{marginTop:4,padding:"5px 10px",background:C.g50,borderRadius:6,borderRight:`2px solid ${C.g500}`,fontSize:11,color:C.n600,lineHeight:1.4}}>
                  {standardDisplay}
                </div>
              )}
            </div>
          </FormField>

          {/* Separator — optional fields below */}
          <div style={{height:1,background:C.cr200,margin:"4px 0 12px"}}/>

          {/* 5. המלצה */}
          <FormField label="המלצה לתיקון" filled={!!recommendation} icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>}>
            <div onClick={e=>e.stopPropagation()}>
              <ComboField value={recommendation} onChange={v=>setRecommendation(v)} placeholder="המלצת תיקון..."
                suggestions={recSuggestions} active={activeDD==='rec'} onFocus={()=>openDD('rec')}
                saveToLibrary={()=>closeAll()}
                onSelect={v=>{setRecommendation(v);closeAll()}}/>
            </div>
          </FormField>

          {/* 6. עלות */}
          <FormField label="עלות תיקון" filled={!!(costAmount||costQty)} icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="14" x2="16" y2="14"/></svg>}>
            <div onClick={e=>e.stopPropagation()}>
              <div style={{fontSize:10,color:C.n400,marginBottom:4}}>אופן חישוב:</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
                {costUnits.map(u=>
                  <button key={u.id} onClick={()=>{setCostUnit(u.id);if(u.id==='fixed'){setCostQty('');setCostPerUnit('')}else{setCostAmount('')};closeAll()}}
                    style={{padding:"4px 10px",borderRadius:16,fontSize:11,fontWeight:costUnit===u.id?600:400,background:costUnit===u.id?C.g500:"transparent",color:costUnit===u.id?"#fff":C.n600,border:`1px solid ${costUnit===u.id?C.g500:C.cr300}`,cursor:"pointer",fontFamily:"inherit"}}
                  >{u.label}</button>
                )}
              </div>
              {costUnit==='fixed'?(
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"9px 12px",borderRadius:10,border:`1px solid ${costAmount?C.g200:C.cr300}`,background:costAmount?C.g50:C.cr50}}>
                  <span style={{color:C.n400,fontSize:14,fontWeight:500}}>₪</span>
                  <input type="text" inputMode="numeric" value={costAmount} onChange={e=>setCostAmount(e.target.value.replace(/[^0-9,]/g,''))} placeholder="הזן סכום" onFocus={closeAll}
                    style={{flex:1,border:"none",background:"none",fontSize:14,fontFamily:"inherit",outline:"none",direction:"ltr",textAlign:"right"}}/>
                </div>
              ):(
                <>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,color:C.n400,marginBottom:3}}>כמות</div>
                      <div style={{display:"flex",alignItems:"center",gap:4,padding:"9px 10px",borderRadius:10,border:`1px solid ${costQty?C.g200:C.cr300}`,background:costQty?C.g50:C.cr50}}>
                        <input type="text" inputMode="numeric" value={costQty} onChange={e=>setCostQty(e.target.value.replace(/[^0-9.,]/g,''))} placeholder="0" onFocus={closeAll}
                          style={{flex:1,border:"none",background:"none",fontSize:14,fontFamily:"inherit",outline:"none",direction:"ltr",textAlign:"right",width:"100%"}}/>
                        <span style={{fontSize:10,color:C.n400,flexShrink:0}}>{costUnits.find(u=>u.id===costUnit)?.icon}</span>
                      </div>
                    </div>
                    <div style={{fontSize:15,color:C.n400,fontWeight:500,marginTop:16}}>×</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,color:C.n400,marginBottom:3}}>מחיר ל{costUnits.find(u=>u.id===costUnit)?.icon}</div>
                      <div style={{display:"flex",alignItems:"center",gap:4,padding:"9px 10px",borderRadius:10,border:`1px solid ${costPerUnit?C.g200:C.cr300}`,background:costPerUnit?C.g50:C.cr50}}>
                        <span style={{color:C.n400,fontSize:12}}>₪</span>
                        <input type="text" inputMode="numeric" value={costPerUnit} onChange={e=>setCostPerUnit(e.target.value.replace(/[^0-9,]/g,''))} placeholder="0" onFocus={closeAll}
                          style={{flex:1,border:"none",background:"none",fontSize:14,fontFamily:"inherit",outline:"none",direction:"ltr",textAlign:"right",width:"100%"}}/>
                      </div>
                    </div>
                  </div>
                  {totalCost>0&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 10px",background:C.go100,borderRadius:6,marginTop:6}}>
                    <span style={{fontSize:11,color:C.go700,fontWeight:500}}>סה"כ</span>
                    <span style={{fontSize:15,fontWeight:700,color:C.go700}}>₪{totalCost.toLocaleString()}</span>
                  </div>}
                </>
              )}
            </div>
          </FormField>

          {/* 7. הערות */}
          <FormField label="הערות" filled={!!note} icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>}>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="הערות נוספות (אופציונלי)..." rows={2}
              onClick={e=>e.stopPropagation()} onFocus={closeAll}
              style={{width:"100%",padding:"9px 12px",borderRadius:10,border:`1px solid ${note?C.g200:C.cr300}`,background:note?C.g50:C.cr50,fontSize:14,fontFamily:"inherit",direction:"rtl",outline:"none",lineHeight:1.5,boxSizing:"border-box",resize:"vertical"}}/>
          </FormField>

          {/* 8. תמונות — single "add" button */}
          <FormField label={`תמונות${photos.length>0?' ('+photos.length+')':''}`} filled={photos.length>0} icon={<Ic.Cam/>}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}} onClick={e=>e.stopPropagation()}>
              {photos.map(ph=>
                <div key={ph.id} style={{width:64,height:64,borderRadius:8,background:C.cr200,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",border:`1px solid ${C.cr300}`}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.n400} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  <button onClick={()=>removePhoto(ph.id)} style={{position:"absolute",top:-5,right:-5,width:18,height:18,borderRadius:9,background:C.sR,border:"2px solid "+C.cr50,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              )}
              <button onClick={()=>{closeAll();addPhoto()}} style={{width:64,height:64,borderRadius:8,border:`2px dashed ${C.g200}`,background:C.g50,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,color:C.g500}}
                onMouseEnter={e=>{e.currentTarget.style.background=C.g100}} onMouseLeave={e=>{e.currentTarget.style.background=C.g50}}>
                <Ic.Cam/><span style={{fontSize:9,fontWeight:500}}>הוסף תמונה</span>
              </button>
            </div>
          </FormField>

          {/* 9. נספח — green styled like photo button */}
          <FormField label="נספח (צילום מהתקן)" icon={<Ic.Clip/>}>
            <button onClick={e=>{e.stopPropagation();closeAll()}} style={{width:"100%",padding:"10px",borderRadius:10,border:`2px dashed ${C.g200}`,background:C.g50,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:C.g500,fontSize:12,fontFamily:"inherit",fontWeight:500}}
              onMouseEnter={e=>{e.currentTarget.style.background=C.g100;e.currentTarget.style.borderColor=C.g500}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.g50;e.currentTarget.style.borderColor=C.g200}}>
              <Ic.Clip/> הוסף נספח
            </button>
          </FormField>
          <div style={{height:8}}/>
        </div>

        {/* Save */}
        <div style={{padding:"10px 16px max(20px, env(safe-area-inset-bottom, 20px))",borderTop:`1px solid ${C.cr200}`,background:C.cr50}}>
          <button disabled={!canSave} onClick={e=>e.stopPropagation()} style={{width:"100%",height:46,borderRadius:12,border:"none",background:canSave?C.g500:C.cr300,color:canSave?"#fff":C.n400,fontSize:15,fontWeight:600,cursor:canSave?"pointer":"not-allowed",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
            onMouseEnter={e=>{if(canSave)e.currentTarget.style.background=C.g600}} onMouseLeave={e=>{if(canSave)e.currentTarget.style.background=C.g500}}>
            שמור ממצא
          </button>
        </div>
      </div>}

      <style>{`
        *{-webkit-tap-highlight-color:transparent;box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:${C.cr300};border-radius:4px}
        input::placeholder,textarea::placeholder{color:${C.n400}}
        button:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid ${C.g500};outline-offset:2px}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeOut{from{opacity:1}to{opacity:0}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes slideDown{from{transform:translateY(0)}to{transform:translateY(100%)}}
      `}</style>
    </div>
  );
}
