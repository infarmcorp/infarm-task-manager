import React, { useState, useMemo, useRef, useEffect } from "react";

const G = {
  50:"#f0faf4",100:"#d4f0e0",200:"#a8e0c0",300:"#6cc99d",
  400:"#3db87a",500:"#2a9d63",600:"#1e7a4a",700:"#155c37",800:"#0d3d24"
};
const DESIGNERS=["Denny","Arum"];
const CATEGORIES=["Social Media Post","Banner Marketplace","Promo Material","Kemasan Baru","Revisi Kemasan","Key Visual Marketplace","Email Template","Product Photo","Infografis","Struktur Organisasi","Poster","Lainnya"];
const REQUESTER_LIST=["Sales Team","Bidev Team","HRD","Marketing","Management","Lainnya"];
const STATUS={
  request:{label:"Request",bg:"#fff8e6",text:"#92400e",dot:"#f59e0b",border:"#fde68a"},
  todo:{label:"Todo",bg:"#f3f0ff",text:"#4c1d95",dot:"#7c3aed",border:"#ddd6fe"},
  on_progress:{label:"On Progress",bg:"#e8f4ff",text:"#1e3a8a",dot:"#2563eb",border:"#bfdbfe"},
  finish:{label:"Finish",bg:"#edfaf4",text:"#064e3b",dot:"#059669",border:"#a7f3d0"},
};
const PIC_STYLE={Denny:{bg:G[100],text:G[700]},Arum:{bg:"#fce7f3",text:"#9d174d"}};
const STORAGE_KEY="infarm_tasks_v5";
const loadTasks=()=>{try{const r=localStorage.getItem(STORAGE_KEY);if(r)return JSON.parse(r);}catch(e){}return DEMO;};
const saveTasks=t=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(t));}catch(e){}};

const DEMO=[
  {id:1,title:"Social Media Post - Promo Lebaran",category:"Social Media Post",status:"todo",pic:"Denny",dueDate:"2025-05-14",requestedBy:"Sales Team",requesterName:"Joko Marketing",description:"Post IG & TikTok untuk promo lebaran",createdDate:"2025-05-01",attachments:[],attachmentLinks:[],checklists:[]},
  {id:2,title:"Banner Marketplace - Flash Sale",category:"Banner Marketplace",status:"on_progress",pic:"Arum",dueDate:"2025-05-13",requestedBy:"Sales Team",requesterName:"Sari Sales",description:"Banner Tokopedia & Shopee 1200x628",createdDate:"2025-05-05",attachments:[],attachmentLinks:[],checklists:[{id:1,text:"Design Banner Tokopedia",done:false,assignee:"Denny"},{id:2,text:"Design Banner Shopee",done:true,assignee:"Arum"}]},
  {id:3,title:"Desain Kemasan - Premium Line",category:"Kemasan Baru",status:"finish",pic:"Denny",dueDate:"2025-04-30",requestedBy:"Bidev Team",requesterName:"Rudi Bidev",description:"Packaging produk premium hidroponik",createdDate:"2025-04-20",attachments:[],attachmentLinks:[],checklists:[]},
  {id:4,title:"Template Loker - Desainer Grafis",category:"Poster",status:"request",pic:null,dueDate:"2025-05-20",requestedBy:"HRD",requesterName:"Dewi HRD",description:"Template posting lowongan untuk IG Stories",createdDate:"2025-05-10",attachments:[],attachmentLinks:[],checklists:[]},
];

// ─── REQUEST FORM PAGE ─────────────────────────────────────────
function RequestPage() {
  const [form,setForm]=useState({title:"",requesterName:"",category:"Social Media Post",requestedBy:"Sales Team",description:"",dueDate:"",attachments:[],attachmentLinks:[]});
  const [submitted,setSubmitted]=useState(false);
  const [loading,setLoading]=useState(false);
  const [newLink,setNewLink]=useState("");
  const fileRef=useRef(null);

  // FIX #4: Promise.all + FileReader biar foto bisa muncul
  const handleFiles=e=>{
    const files=Array.from(e.target.files);
    if(!files.length)return;
    Promise.all(files.map(f=>new Promise(resolve=>{
      const att={id:Date.now()+Math.random(),name:f.name,type:f.type.startsWith("image/")?"image":f.name.includes(".pdf")?"pdf":"excel",size:f.size>1048576?(f.size/1048576).toFixed(1)+" MB":Math.round(f.size/1024)+" KB",dataUrl:null};
      if(att.type==="image"){const r=new FileReader();r.onload=ev=>{att.dataUrl=ev.target.result;resolve(att);};r.readAsDataURL(f);}
      else resolve(att);
    }))).then(atts=>setForm(prev=>({...prev,attachments:[...(prev.attachments||[]),...atts]})));
  };

  const removeAtt=id=>setForm(prev=>({...prev,attachments:prev.attachments.filter(a=>a.id!==id)}));

  // FIX #5: Tambah link URL
  const addLink=()=>{
    if(!newLink.trim())return;
    setForm(prev=>({...prev,attachmentLinks:[...(prev.attachmentLinks||[]),{id:Date.now(),url:newLink.trim()}]}));
    setNewLink("");
  };
  const removeLink=id=>setForm(prev=>({...prev,attachmentLinks:prev.attachmentLinks.filter(l=>l.id!==id)}));

  const handleSubmit=e=>{
    e.preventDefault();setLoading(true);
    setTimeout(()=>{
      const tasks=loadTasks();
      const newTask={id:Date.now(),title:form.title,requesterName:form.requesterName,category:form.category,requestedBy:form.requestedBy,description:form.description,dueDate:form.dueDate,attachments:form.attachments||[],attachmentLinks:form.attachmentLinks||[],status:"request",pic:null,checklists:[],createdDate:new Date().toISOString().split("T")[0]};
      saveTasks([...tasks,newTask]);setLoading(false);setSubmitted(true);
    },800);
  };

  if(submitted)return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${G[800]},${G[500]})`,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{background:"#fff",borderRadius:"24px",padding:"40px 32px",maxWidth:"420px",width:"100%",textAlign:"center"}}>
        <div style={{width:"72px",height:"72px",borderRadius:"50%",background:G[50],border:`3px solid ${G[400]}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
          <i className="ti ti-check" style={{fontSize:"36px",color:G[500]}}/>
        </div>
        <h2 style={{margin:"0 0 10px 0",fontSize:"22px",fontWeight:"700",color:"#111827"}}>Request Terkirim! 🎉</h2>
        <p style={{margin:"0 0 24px 0",fontSize:"13px",color:"#9ca3af"}}>Tim desain akan segera memprosesnya.</p>
        <div style={{background:G[50],borderRadius:"12px",padding:"14px",marginBottom:"24px",border:`1px solid ${G[100]}`}}>
          <p style={{margin:0,fontSize:"13px",color:G[700],fontWeight:"600"}}>📋 {form.title}</p>
          <p style={{margin:"4px 0 0 0",fontSize:"12px",color:G[600]}}>{form.category} · {form.requestedBy} · {form.requesterName}</p>
        </div>
        <button onClick={()=>{setSubmitted(false);setForm({title:"",requesterName:"",category:"Social Media Post",requestedBy:"Sales Team",description:"",dueDate:"",attachments:[],attachmentLinks:[]});}} style={{width:"100%",padding:"12px",background:`linear-gradient(135deg,${G[800]},${G[500]})`,color:"#fff",border:"none",borderRadius:"12px",cursor:"pointer",fontSize:"14px",fontWeight:"600"}}>
          + Request Desain Lagi
        </button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${G[800]},${G[500]})`,padding:"20px"}}>
      <div style={{maxWidth:"560px",margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px"}}>
          <div style={{width:"44px",height:"44px",borderRadius:"12px",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,0.25)",flexShrink:0}}>
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
              <ellipse cx="50" cy="30" rx="14" ry="22" fill="#4ade80" transform="rotate(-20 50 30)"/>
              <ellipse cx="50" cy="30" rx="14" ry="22" fill="#22c55e" transform="rotate(20 50 30)"/>
              <ellipse cx="50" cy="22" rx="10" ry="18" fill="#16a34a"/>
              <rect x="47" y="44" width="6" height="8" rx="2" fill="#9ca3af"/>
              <rect x="35" y="52" width="30" height="5" rx="2.5" fill="#9ca3af"/>
              <path d="M50 57 L50 68" stroke="#60a5fa" strokeWidth="3.5"/>
              <path d="M34 68 Q50 57 66 68" stroke="#60a5fa" strokeWidth="3.5" fill="none"/>
              <path d="M30 75 Q50 62 70 75" stroke="#60a5fa" strokeWidth="3.5" fill="none"/>
            </svg>
          </div>
          <div>
            <h1 style={{margin:0,fontSize:"18px",fontWeight:"700",color:"#fff"}}>Request Desain</h1>
            <p style={{margin:0,fontSize:"12px",color:"rgba(255,255,255,0.7)"}}>INFARM.ID — Tim Desain</p>
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:"20px",padding:"24px"}}>
          <form onSubmit={handleSubmit}>
            {/* FIX #6: Nama requester */}
            <div style={{marginBottom:"14px"}}>
              <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#374151"}}>Nama Kamu *</label>
              <input type="text" value={form.requesterName} onChange={e=>setForm({...form,requesterName:e.target.value})} placeholder="Contoh: Joko_Marketing" required style={{width:"100%",boxSizing:"border-box",borderRadius:"10px",border:"1px solid #e5e7eb",padding:"9px 12px",fontSize:"13px"}}/>
            </div>
            <div style={{marginBottom:"14px"}}>
              <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#374151"}}>Judul Request *</label>
              <input type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Contoh: Banner Flash Sale Tokopedia" required style={{width:"100%",boxSizing:"border-box",borderRadius:"10px",border:"1px solid #e5e7eb",padding:"9px 12px",fontSize:"13px"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"14px"}}>
              <div>
                <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#374151"}}>Kategori *</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{width:"100%",boxSizing:"border-box",borderRadius:"10px",border:"1px solid #e5e7eb",padding:"9px 12px",fontSize:"13px"}}>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#374151"}}>Deadline *</label>
                <input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} required style={{width:"100%",boxSizing:"border-box",borderRadius:"10px",border:"1px solid #e5e7eb",padding:"9px 12px",fontSize:"13px"}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#374151"}}>Di-request Oleh *</label>
                <select value={form.requestedBy} onChange={e=>setForm({...form,requestedBy:e.target.value})} style={{width:"100%",boxSizing:"border-box",borderRadius:"10px",border:"1px solid #e5e7eb",padding:"9px 12px",fontSize:"13px"}}>
                  {REQUESTER_LIST.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom:"14px"}}>
              <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#374151"}}>Deskripsi / Brief</label>
              <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Jelaskan kebutuhan desain, ukuran, tone, referensi, dll..." style={{width:"100%",boxSizing:"border-box",minHeight:"80px",borderRadius:"10px",border:"1px solid #e5e7eb",padding:"9px 12px",fontSize:"13px",resize:"vertical"}}/>
            </div>

            {/* FIX #4 & #5: Attachment file + link */}
            <div style={{marginBottom:"20px"}}>
              <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"8px",color:"#374151"}}>Attachment Referensi</label>

              {/* Upload file */}
              <div style={{border:`2px dashed ${G[200]}`,borderRadius:"12px",padding:"12px",background:G[50],cursor:"pointer",marginBottom:"10px"}} onClick={()=>fileRef.current?.click()}>
                {(form.attachments||[]).length===0?(
                  <div style={{textAlign:"center"}}>
                    <i className="ti ti-upload" style={{fontSize:"22px",color:G[300],display:"block",marginBottom:"4px"}}/>
                    <p style={{margin:0,fontSize:"12px",color:G[500]}}>Klik upload foto / PDF / Excel</p>
                  </div>
                ):(
                  <div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:"6px",marginBottom:"6px"}}>
                      {form.attachments.map(att=>(
                        <div key={att.id} style={{background:"#fff",borderRadius:"10px",padding:"7px",position:"relative",border:"1px solid #e5e7eb"}}>
                          <button type="button" onClick={e=>{e.stopPropagation();removeAtt(att.id);}} style={{position:"absolute",top:"3px",right:"3px",background:"rgba(239,68,68,0.1)",border:"none",cursor:"pointer",width:"16px",height:"16px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#ef4444",padding:0}}><i className="ti ti-x" style={{fontSize:"9px"}}/></button>
                          {att.type==="image"&&att.dataUrl?<img src={att.dataUrl} alt={att.name} style={{width:"100%",height:"52px",objectFit:"cover",borderRadius:"6px",display:"block",marginBottom:"4px"}}/>:<div style={{width:"100%",height:"40px",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"4px"}}><i className={`ti ${att.type==="pdf"?"ti-file-type-pdf":"ti-file-spreadsheet"}`} style={{fontSize:"20px",color:"#6b7280"}}/></div>}
                          <p style={{margin:0,fontSize:"9px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"#374151",paddingRight:"10px"}}>{att.name}</p>
                        </div>
                      ))}
                    </div>
                    <p style={{margin:0,fontSize:"11px",color:G[600],textAlign:"center"}}>+ Klik tambah file lagi</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.xlsx,.xls,.csv" style={{display:"none"}} onChange={handleFiles}/>

              {/* FIX #5: Input link URL */}
              <div style={{marginBottom:"6px"}}>
                <div style={{display:"flex",gap:"6px"}}>
                  <input type="url" value={newLink} onChange={e=>setNewLink(e.target.value)} placeholder="Paste link Google Drive / Figma / dll..." style={{flex:1,borderRadius:"10px",border:"1px solid #e5e7eb",padding:"8px 12px",fontSize:"12px"}} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addLink();}}}/>
                  <button type="button" onClick={addLink} style={{padding:"8px 14px",background:G[500],color:"#fff",border:"none",borderRadius:"10px",cursor:"pointer",fontSize:"12px",fontWeight:"600",flexShrink:0}}>+ Link</button>
                </div>
              </div>
              {(form.attachmentLinks||[]).length>0&&(
                <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
                  {form.attachmentLinks.map(l=>(
                    <div key={l.id} style={{display:"flex",alignItems:"center",gap:"6px",background:"#eff6ff",borderRadius:"8px",padding:"6px 10px",border:"1px solid #bfdbfe"}}>
                      <i className="ti ti-link" style={{fontSize:"13px",color:"#2563eb",flexShrink:0}}/>
                      <span style={{flex:1,fontSize:"11px",color:"#1e40af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.url}</span>
                      <button type="button" onClick={()=>removeLink(l.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#ef4444",padding:0,flexShrink:0}}><i className="ti ti-x" style={{fontSize:"12px"}}/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} style={{width:"100%",padding:"12px",background:loading?"#9ca3af":`linear-gradient(135deg,${G[800]},${G[500]})`,color:"#fff",border:"none",borderRadius:"12px",cursor:loading?"not-allowed":"pointer",fontSize:"14px",fontWeight:"600",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
              {loading?<><i className="ti ti-loader-2" style={{fontSize:"16px"}}/>Mengirim...</>:<><i className="ti ti-send" style={{fontSize:"16px"}}/>Kirim Request</>}
            </button>
          </form>
        </div>
        <p style={{textAlign:"center",marginTop:"16px",fontSize:"12px",color:"rgba(255,255,255,0.5)"}}>INFARM.ID © 2025 · Tim Desain Internal</p>
      </div>
    </div>
  );
}

// ─── BOARD APP ─────────────────────────────────────────────────
function BoardApp() {
  const [tasks,setTasks]=useState(loadTasks);
  const [view,setView]=useState("kanban");
  const [selected,setSelected]=useState(null);
  const [fPIC,setFPIC]=useState("all");
  const [fStatus,setFStatus]=useState("all");
  // FIX #1: Filter tanggal gantikan tombol copy link di header
  const [filterMode,setFilterMode]=useState("all");
  const [customFrom,setCustomFrom]=useState("");
  const [customTo,setCustomTo]=useState("");
  // FIX #7: Search bar
  const [search,setSearch]=useState("");
  // FIX #2: Edit mode di detail
  const [editMode,setEditMode]=useState(false);
  const [editForm,setEditForm]=useState({});
  // FIX #9: Konfirmasi hapus
  const [confirmDelete,setConfirmDelete]=useState(null);
  // FIX #3: Checklist
  const [newCheckText,setNewCheckText]=useState("");
  const [newCheckAssignee,setNewCheckAssignee]=useState("Denny");
  const [exportMsg,setExportMsg]=useState("");
  const [linkCopied,setLinkCopied]=useState(false);
  const detailFileRef=useRef(null);

  useEffect(()=>{saveTasks(tasks);},[tasks]);
  useEffect(()=>{
    const interval=setInterval(()=>{const s=loadTasks();if(s.length!==tasks.length)setTasks(s);},5000);
    return()=>clearInterval(interval);
  },[tasks.length]);

  const today=new Date();today.setHours(0,0,0,0);
  const fmtDate=d=>d?new Date(d).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}):"-";
  const isOverdue=t=>t.status!=="finish"&&t.dueDate&&new Date(t.dueDate)<today;
  const isSoon=t=>{if(!t.dueDate||t.status==="finish")return false;const d=new Date(t.dueDate);d.setHours(0,0,0,0);return(d-today)/86400000<=1&&(d-today)/86400000>=0;};

  const filtered=useMemo(()=>{
    let r=[...tasks];
    if(search.trim()){const q=search.toLowerCase();r=r.filter(t=>t.title?.toLowerCase().includes(q)||t.category?.toLowerCase().includes(q)||t.requestedBy?.toLowerCase().includes(q)||t.requesterName?.toLowerCase().includes(q)||t.description?.toLowerCase().includes(q)||t.pic?.toLowerCase().includes(q));}
    if(fPIC!=="all")r=r.filter(t=>t.pic===fPIC);
    if(fStatus!=="all")r=r.filter(t=>t.status===fStatus);
    if(filterMode==="today")r=r.filter(t=>{if(!t.dueDate)return false;const d=new Date(t.dueDate);d.setHours(0,0,0,0);return d.getTime()===today.getTime();});
    else if(filterMode==="week"){const n=new Date(today);n.setDate(n.getDate()+7);r=r.filter(t=>{if(!t.dueDate)return false;const d=new Date(t.dueDate);return d>=today&&d<=n;});}
    else if(filterMode==="month"){const n=new Date(today);n.setMonth(n.getMonth()+1);r=r.filter(t=>{if(!t.dueDate)return false;const d=new Date(t.dueDate);return d>=today&&d<=n;});}
    else if(filterMode==="overdue")r=r.filter(t=>isOverdue(t));
    else if(filterMode==="custom"&&customFrom&&customTo){const from=new Date(customFrom);const to=new Date(customTo);to.setHours(23,59,59);r=r.filter(t=>{if(!t.dueDate)return false;const d=new Date(t.dueDate);return d>=from&&d<=to;});}
    return r.sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));
  },[tasks,search,fPIC,fStatus,filterMode,customFrom,customTo]);

  const byS=s=>filtered.filter(t=>t.status===s);
  const allByS=s=>tasks.filter(t=>t.status===s);
  const reminders=useMemo(()=>tasks.filter(t=>isSoon(t)),[tasks]);
  const analytics=useMemo(()=>{
    const total=tasks.length,done=tasks.filter(t=>t.status==="finish").length,over=tasks.filter(t=>isOverdue(t)).length;
    const byPIC={};
    DESIGNERS.forEach(d=>{const dt=tasks.filter(t=>t.pic===d);byPIC[d]={total:dt.length,done:dt.filter(t=>t.status==="finish").length,over:dt.filter(t=>isOverdue(t)).length,prog:dt.filter(t=>t.status==="on_progress").length,rate:dt.length>0?Math.round(dt.filter(t=>t.status==="finish").length/dt.length*100):0};});
    return{total,done,over,rate:total>0?Math.round(done/total*100):0,byPIC};
  },[tasks]);

  const moveTask=(id,ns)=>{setTasks(prev=>prev.map(t=>t.id!==id?t:{...t,status:ns}));if(selected?.id===id)setSelected(prev=>({...prev,status:ns}));};

  // FIX #9: Delete dengan konfirmasi
  const deleteTask=id=>{setTasks(prev=>prev.filter(t=>t.id!==id));if(selected?.id===id)setSelected(null);setConfirmDelete(null);};

  const copyRequestLink=()=>{navigator.clipboard?.writeText(window.location.origin+"/#/request").catch(()=>{});setLinkCopied(true);setTimeout(()=>setLinkCopied(false),2000);};

  // FIX #2: Edit task
  const startEdit=()=>{setEditForm({title:selected.title,category:selected.category,dueDate:selected.dueDate,pic:selected.pic||"",requestedBy:selected.requestedBy,description:selected.description});setEditMode(true);};
  const saveEdit=()=>{const u={...selected,...editForm,pic:editForm.pic||null};setTasks(prev=>prev.map(t=>t.id===u.id?u:t));setSelected(u);setEditMode(false);};

  // FIX #4: Detail file upload fix
  const handleDetailFiles=e=>{
    const files=Array.from(e.target.files);if(!selected||!files.length)return;
    Promise.all(files.map(f=>new Promise(resolve=>{
      const att={id:Date.now()+Math.random(),name:f.name,type:f.type.startsWith("image/")?"image":f.name.includes(".pdf")?"pdf":"excel",size:f.size>1048576?(f.size/1048576).toFixed(1)+" MB":Math.round(f.size/1024)+" KB",dataUrl:null};
      if(att.type==="image"){const r=new FileReader();r.onload=ev=>{att.dataUrl=ev.target.result;resolve(att);}; r.readAsDataURL(f);}
      else resolve(att);
    }))).then(atts=>{const u={...selected,attachments:[...(selected.attachments||[]),...atts]};setTasks(prev=>prev.map(t=>t.id===u.id?u:t));setSelected(u);});
  };
  const removeAtt=aid=>{const u={...selected,attachments:selected.attachments.filter(a=>a.id!==aid)};setTasks(prev=>prev.map(t=>t.id===u.id?u:t));setSelected(u);};

  // FIX #3: Checklist helpers
  const addChecklist=()=>{
    if(!newCheckText.trim()||!selected)return;
    const item={id:Date.now(),text:newCheckText.trim(),done:false,assignee:newCheckAssignee};
    const u={...selected,checklists:[...(selected.checklists||[]),item]};
    setTasks(prev=>prev.map(t=>t.id===u.id?u:t));setSelected(u);setNewCheckText("");
  };
  const toggleCheck=id=>{const u={...selected,checklists:selected.checklists.map(c=>c.id===id?{...c,done:!c.done}:c)};setTasks(prev=>prev.map(t=>t.id===u.id?u:t));setSelected(u);};
  const removeCheck=id=>{const u={...selected,checklists:selected.checklists.filter(c=>c.id!==id)};setTasks(prev=>prev.map(t=>t.id===u.id?u:t));setSelected(u);};
  const changeCheckAssignee=(id,assignee)=>{const u={...selected,checklists:selected.checklists.map(c=>c.id===id?{...c,assignee}:c)};setTasks(prev=>prev.map(t=>t.id===u.id?u:t));setSelected(u);};

  const exportCSV=()=>{
    const h=["ID","Judul","Kategori","Status","PIC","Due Date","Requester","Nama Requester","Checklist","Attachments"];
    const rows=tasks.map(t=>[t.id,t.title,t.category,STATUS[t.status]?.label,t.pic||"-",fmtDate(t.dueDate),t.requestedBy,t.requesterName||"-",(t.checklists||[]).length,(t.attachments||[]).length]);
    let csv=h.join(",")+"\n";rows.forEach(r=>{csv+=r.map(v=>`"${v}"`).join(",")+"\n";});
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="infarm_tasks.csv";a.click();
    setExportMsg("Export berhasil!");setTimeout(()=>setExportMsg(""),3000);
  };

  const PICAvatar=({name,size=28})=>{const s=PIC_STYLE[name]||PIC_STYLE.Denny;return <div style={{width:size,height:size,borderRadius:"50%",background:s.bg,color:s.text,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.42,fontWeight:"600",flexShrink:0}}>{name?.[0]}</div>;};
  const Badge=({status})=>(<span style={{fontSize:"11px",padding:"3px 10px",borderRadius:"20px",background:STATUS[status]?.bg,color:STATUS[status]?.text,fontWeight:"600",border:`1px solid ${STATUS[status]?.border}`,display:"inline-flex",alignItems:"center",gap:"5px"}}><span style={{width:"6px",height:"6px",borderRadius:"50%",background:STATUS[status]?.dot}}/>{STATUS[status]?.label}</span>);

  const TaskCard=({task})=>{
    const checks=task.checklists||[];
    const doneChecks=checks.filter(c=>c.done).length;
    return(
      <div onClick={()=>{setSelected(task);setEditMode(false);setConfirmDelete(null);}} style={{background:"#fff",borderRadius:"14px",padding:"13px",marginBottom:"10px",cursor:"pointer",transition:"transform .15s",borderLeft:`4px solid ${isOverdue(task)?"#ef4444":isSoon(task)?"#f59e0b":STATUS[task.status]?.dot}`,border:`1px solid ${isOverdue(task)?"#fecaca":"#f0f0f0"}`,borderLeftWidth:"4px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}
        onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
        onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
        <div style={{display:"flex",justifyContent:"space-between",gap:"8px",marginBottom:"8px"}}>
          <p style={{margin:0,fontSize:"13px",fontWeight:"600",flex:1,lineHeight:"1.4",color:"#111827"}}>{task.title}</p>
        </div>
        <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"8px"}}>
          <span style={{fontSize:"10px",background:G[50],color:G[700],padding:"2px 8px",borderRadius:"20px",border:`1px solid ${G[100]}`}}>{task.category}</span>
          {isOverdue(task)&&<span style={{fontSize:"10px",background:"#fee2e2",color:"#991b1b",padding:"2px 8px",borderRadius:"20px",fontWeight:"600"}}>Overdue</span>}
          {isSoon(task)&&!isOverdue(task)&&<span style={{fontSize:"10px",background:"#fef3c7",color:"#78350f",padding:"2px 8px",borderRadius:"20px",fontWeight:"600"}}>Besok!</span>}
        </div>
        {checks.length>0&&(
          <div style={{marginBottom:"8px"}}>
            <div style={{background:"#f3f4f6",borderRadius:"20px",height:"5px",overflow:"hidden",marginBottom:"3px"}}>
              <div style={{width:`${checks.length>0?Math.round(doneChecks/checks.length*100):0}%`,height:"100%",background:G[500],borderRadius:"20px",transition:"width .3s"}}/>
            </div>
            <span style={{fontSize:"10px",color:"#6b7280"}}>{doneChecks}/{checks.length} checklist</span>
          </div>
        )}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:"11px",color:isOverdue(task)?"#ef4444":isSoon(task)?"#f59e0b":"#9ca3af",display:"flex",alignItems:"center",gap:"4px"}}>
            <i className="ti ti-calendar" style={{fontSize:"12px"}}/>{fmtDate(task.dueDate)}
          </span>
          <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
            {task.pic&&<PICAvatar name={task.pic} size={20}/>}
            {(task.attachments||[]).length>0&&<span style={{fontSize:"10px",color:"#9ca3af",display:"flex",alignItems:"center",gap:"2px"}}><i className="ti ti-paperclip" style={{fontSize:"11px"}}/>{task.attachments.length}</span>}
          </div>
        </div>
        <div style={{display:"flex",gap:"5px",marginTop:"8px",flexWrap:"wrap"}} onClick={e=>e.stopPropagation()}>
          {task.status==="request"&&<button onClick={()=>moveTask(task.id,"todo")} style={{fontSize:"11px",padding:"3px 10px",background:G[50],color:G[700],border:`1px solid ${G[200]}`,borderRadius:"20px",cursor:"pointer"}}>Assign → Todo</button>}
          {task.status!=="request"&&task.status!=="on_progress"&&<button onClick={()=>moveTask(task.id,"on_progress")} style={{fontSize:"11px",padding:"3px 10px",background:"#dbeafe",color:"#1e3a8a",border:"1px solid #bfdbfe",borderRadius:"20px",cursor:"pointer"}}>→ Progress</button>}
          {task.status!=="request"&&task.status!=="finish"&&<button onClick={()=>moveTask(task.id,"finish")} style={{fontSize:"11px",padding:"3px 10px",background:"#d1fae5",color:"#064e3b",border:"1px solid #a7f3d0",borderRadius:"20px",cursor:"pointer"}}>✓ Finish</button>}
          {task.status!=="request"&&task.status!=="todo"&&<button onClick={()=>moveTask(task.id,"todo")} style={{fontSize:"11px",padding:"3px 10px",background:"#ede9fe",color:"#4c1d95",border:"1px solid #ddd6fe",borderRadius:"20px",cursor:"pointer"}}>← Todo</button>}
        </div>
      </div>
    );
  };

  const cols=[
    {key:"request",label:"Request",dot:"#f59e0b",hbg:"#fffbeb"},
    {key:"todo",label:"Todo",dot:"#7c3aed",hbg:"#faf5ff"},
    {key:"on_progress",label:"On Progress",dot:"#2563eb",hbg:"#eff6ff"},
    {key:"finish",label:"Finish",dot:"#059669",hbg:"#ecfdf5"},
  ];

  return(
    <div style={{fontFamily:"system-ui,sans-serif",background:"#f7f9f7",minHeight:"100vh"}}>
      {/* HEADER */}
      <div style={{background:`linear-gradient(135deg,${G[800]},${G[600]})`,borderRadius:"0 0 22px 22px",marginBottom:"18px"}}>
        <div style={{padding:"18px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{width:"48px",height:"48px",borderRadius:"12px",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,0.25)",flexShrink:0}}>
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
                <ellipse cx="50" cy="30" rx="14" ry="22" fill="#4ade80" transform="rotate(-20 50 30)"/>
                <ellipse cx="50" cy="30" rx="14" ry="22" fill="#22c55e" transform="rotate(20 50 30)"/>
                <ellipse cx="50" cy="22" rx="10" ry="18" fill="#16a34a"/>
                <rect x="47" y="44" width="6" height="8" rx="2" fill="#9ca3af"/>
                <rect x="35" y="52" width="30" height="5" rx="2.5" fill="#9ca3af"/>
                <path d="M50 57 L50 68" stroke="#60a5fa" strokeWidth="3.5"/>
                <path d="M34 68 Q50 57 66 68" stroke="#60a5fa" strokeWidth="3.5" fill="none"/>
                <path d="M30 75 Q50 62 70 75" stroke="#60a5fa" strokeWidth="3.5" fill="none"/>
              </svg>
            </div>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                <h1 style={{margin:0,fontSize:"19px",fontWeight:"700",color:"#fff"}}>Design Task Manager</h1>
                <span style={{fontSize:"10px",background:"rgba(255,255,255,0.18)",color:"#fff",padding:"2px 8px",borderRadius:"20px",border:"1px solid rgba(255,255,255,0.25)"}}>INFARM.ID</span>
              </div>
              <p style={{margin:0,fontSize:"12px",color:"rgba(255,255,255,0.65)"}}>Tim Desain Internal · Denny & Arum</p>
            </div>
          </div>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center"}}>
            {/* FIX #7: Search bar */}
            <div style={{position:"relative"}}>
              <i className="ti ti-search" style={{position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",fontSize:"13px",color:"rgba(255,255,255,0.6)"}}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari task..." style={{padding:"6px 12px 6px 30px",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:"20px",color:"#fff",fontSize:"12px",width:"150px",outline:"none"}}/>
            </div>
            {/* FIX #1: Filter tanggal di header */}
            <select value={filterMode} onChange={e=>setFilterMode(e.target.value)} style={{fontSize:"12px",padding:"6px 12px",borderRadius:"20px",border:`1px solid ${filterMode!=="all"?"#fff":"rgba(255,255,255,0.25)"}`,background:filterMode!=="all"?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.12)",color:"#fff",cursor:"pointer",fontWeight:filterMode!=="all"?"600":"400"}}>
              <option value="all" style={{color:"#111"}}>Semua Tanggal</option>
              <option value="today" style={{color:"#111"}}>Hari Ini</option>
              <option value="week" style={{color:"#111"}}>Minggu Ini</option>
              <option value="month" style={{color:"#111"}}>Bulan Ini</option>
              <option value="overdue" style={{color:"#111"}}>Overdue</option>
              <option value="custom" style={{color:"#111"}}>Custom...</option>
            </select>
            <button onClick={exportCSV} style={{fontSize:"12px",padding:"6px 12px",background:"rgba(255,255,255,0.12)",color:"#fff",border:"1px solid rgba(255,255,255,0.25)",borderRadius:"20px",cursor:"pointer",display:"flex",alignItems:"center",gap:"5px"}}>
              <i className="ti ti-download" style={{fontSize:"13px"}}/>Export
            </button>
          </div>
        </div>
        {/* Custom range row */}
        {filterMode==="custom"&&(
          <div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap",padding:"8px 20px 0"}}>
            <span style={{fontSize:"12px",color:"rgba(255,255,255,0.8)"}}>Dari:</span>
            <input type="date" value={customFrom} onChange={e=>setCustomFrom(e.target.value)} style={{fontSize:"12px",padding:"5px 10px",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.12)",color:"#fff"}}/>
            <span style={{fontSize:"12px",color:"rgba(255,255,255,0.8)"}}>Sampai:</span>
            <input type="date" value={customTo} onChange={e=>setCustomTo(e.target.value)} style={{fontSize:"12px",padding:"5px 10px",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.12)",color:"#fff"}}/>
            {customFrom&&customTo&&<span style={{fontSize:"11px",background:"rgba(255,255,255,0.2)",color:"#fff",padding:"3px 9px",borderRadius:"20px",fontWeight:"600"}}>{filtered.length} task</span>}
          </div>
        )}
        <div style={{display:"flex",gap:"8px",padding:"14px 20px 18px",flexWrap:"wrap"}}>
          {[{l:"Total",v:tasks.length},{l:"Selesai",v:analytics.done,c:"#a7f3d0",tc:"#064e3b"},{l:"Progress",v:allByS("on_progress").length,c:"#bfdbfe",tc:"#1e3a8a"},{l:"Overdue",v:analytics.over,c:"#fecaca",tc:"#991b1b"},{l:"Rate",v:analytics.rate+"%",c:"#fde68a",tc:"#78350f"}].map(s=>(
            <div key={s.l} style={{background:s.c??"rgba(255,255,255,0.12)",border:`1px solid ${s.c?"rgba(0,0,0,0.05)":"rgba(255,255,255,0.18)"}`,borderRadius:"12px",padding:"8px 14px",minWidth:"66px"}}>
              <p style={{margin:"0 0 2px 0",fontSize:"10px",color:s.tc??"rgba(255,255,255,0.7)",fontWeight:"500"}}>{s.l}</p>
              <p style={{margin:0,fontSize:"21px",fontWeight:"600",color:s.tc??"#fff",lineHeight:"1"}}>{s.v}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"0 14px 24px"}}>
        {exportMsg&&<div style={{background:"#d1fae5",border:"1px solid #a7f3d0",borderRadius:"10px",padding:"10px 14px",marginBottom:"12px",fontSize:"13px",color:"#064e3b",fontWeight:"500"}}>{exportMsg}</div>}

        {/* Share link bar */}
        <div style={{background:`linear-gradient(135deg,${G[50]},#fff)`,border:`1px solid ${G[200]}`,borderRadius:"14px",padding:"12px 16px",marginBottom:"14px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{width:"34px",height:"34px",borderRadius:"10px",background:G[500],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><i className="ti ti-link" style={{fontSize:"16px",color:"#fff"}}/></div>
            <div>
              <p style={{margin:0,fontSize:"13px",fontWeight:"600",color:G[800]}}>Link Request untuk Tim</p>
              <p style={{margin:0,fontSize:"11px",color:G[600]}}>{window.location.origin}/#/request</p>
            </div>
          </div>
          <button onClick={copyRequestLink} style={{fontSize:"12px",padding:"6px 14px",background:linkCopied?G[500]:"#fff",color:linkCopied?"#fff":G[700],border:`1px solid ${G[200]}`,borderRadius:"20px",cursor:"pointer",fontWeight:"600",display:"flex",alignItems:"center",gap:"5px",flexShrink:0}}>
            <i className={`ti ${linkCopied?"ti-check":"ti-copy"}`} style={{fontSize:"13px"}}/>
            {linkCopied?"Copied!":"Copy Link"}
          </button>
        </div>

        {/* Reminders */}
        {reminders.length>0&&(
          <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:"14px",padding:"12px 14px",marginBottom:"14px",display:"flex",gap:"10px",alignItems:"start"}}>
            <div style={{width:"34px",height:"34px",borderRadius:"10px",background:"#f59e0b",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><i className="ti ti-alarm" style={{fontSize:"16px",color:"#fff"}}/></div>
            <div>
              <p style={{margin:"0 0 3px 0",fontSize:"13px",fontWeight:"600",color:"#78350f"}}>{reminders.length} task deadline hari ini / besok!</p>
              {reminders.map(t=><p key={t.id} style={{margin:"1px 0 0 0",fontSize:"12px",color:"#92400e"}}>• {t.title} — {t.pic||"Belum assign"} ({fmtDate(t.dueDate)})</p>)}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{display:"flex",gap:"4px",marginBottom:"14px",background:"#f3f4f6",padding:"4px",borderRadius:"12px",width:"fit-content"}}>
          {[["kanban","ti-layout-kanban","Kanban"],["list","ti-list","List"],["analytics","ti-chart-bar","Analytics"]].map(([v,ic,lb])=>(
            <button key={v} onClick={()=>setView(v)} style={{background:view===v?`linear-gradient(135deg,${G[800]},${G[500]})`:"transparent",color:view===v?"#fff":"#6b7280",border:"none",padding:"6px 13px",cursor:"pointer",fontSize:"12px",fontWeight:view===v?"600":"400",borderRadius:"9px",display:"flex",alignItems:"center",gap:"5px"}}>
              <i className={`ti ${ic}`} style={{fontSize:"13px"}}/>{lb}
            </button>
          ))}
        </div>

        {/* Filter status & PIC */}
        {view!=="analytics"&&(
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center",marginBottom:"14px"}}>
            <span style={{fontSize:"12px",color:"#6b7280",fontWeight:"500"}}>Filter:</span>
            <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={{fontSize:"12px",padding:"5px 10px",borderRadius:"20px",border:`1px solid ${fStatus!=="all"?G[300]:"#e5e7eb"}`,background:fStatus!=="all"?G[50]:"#fff",cursor:"pointer"}}>
              <option value="all">Semua Status</option>
              {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={fPIC} onChange={e=>setFPIC(e.target.value)} style={{fontSize:"12px",padding:"5px 10px",borderRadius:"20px",border:`1px solid ${fPIC!=="all"?G[300]:"#e5e7eb"}`,background:fPIC!=="all"?G[50]:"#fff",cursor:"pointer"}}>
              <option value="all">Semua PIC</option>
              {DESIGNERS.map(d=><option key={d}>{d}</option>)}
            </select>
            {(fStatus!=="all"||fPIC!=="all"||filterMode!=="all"||search)&&(
              <button onClick={()=>{setFStatus("all");setFPIC("all");setFilterMode("all");setCustomFrom("");setCustomTo("");setSearch("");}} style={{fontSize:"11px",padding:"4px 10px",background:"#fff",border:"1px solid #e5e7eb",borderRadius:"20px",cursor:"pointer",color:"#6b7280",display:"flex",alignItems:"center",gap:"4px"}}>
                <i className="ti ti-x" style={{fontSize:"11px"}}/>Reset Filter
              </button>
            )}
            {search&&<span style={{fontSize:"11px",background:G[50],color:G[700],padding:"3px 9px",borderRadius:"20px",border:`1px solid ${G[100]}`,fontWeight:"600"}}>{filtered.length} hasil</span>}
          </div>
        )}

        {/* Kanban */}
        {view==="kanban"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:"12px"}}>
            {cols.map(col=>(
              <div key={col.key} style={{background:"#fff",borderRadius:"16px",border:"1px solid #e5e7eb",overflow:"hidden"}}>
                <div style={{padding:"11px 14px",background:col.hbg,borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
                    <div style={{width:"8px",height:"8px",borderRadius:"50%",background:col.dot}}/>
                    <span style={{fontSize:"13px",fontWeight:"600",color:"#111827"}}>{col.label}</span>
                  </div>
                  <span style={{fontSize:"11px",background:"rgba(0,0,0,0.07)",padding:"2px 8px",borderRadius:"20px",color:"#374151",fontWeight:"600"}}>{byS(col.key).length}</span>
                </div>
                <div style={{padding:"10px",minHeight:"260px"}}>
                  {byS(col.key).map(task=><TaskCard key={task.id} task={task}/>)}
                  {byS(col.key).length===0&&<div style={{textAlign:"center",padding:"32px 12px",color:"#d1d5db"}}><i className="ti ti-inbox" style={{fontSize:"26px",display:"block",marginBottom:"6px"}}/><span style={{fontSize:"12px"}}>Kosong</span></div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List */}
        {view==="list"&&(
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",overflow:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:"12px",tableLayout:"fixed"}}>
              <colgroup><col style={{width:"28%"}}/><col style={{width:"14%"}}/><col style={{width:"9%"}}/><col style={{width:"12%"}}/><col style={{width:"12%"}}/><col style={{width:"9%"}}/><col style={{width:"8%"}}/><col style={{width:"8%"}}/></colgroup>
              <thead>
                <tr style={{background:`linear-gradient(135deg,${G[800]},${G[500]})`}}>
                  {["Judul","Kategori","PIC","Deadline","Status","Requester","✓","📎"].map(h=><th key={h} style={{padding:"11px 10px",textAlign:"left",fontWeight:"600",fontSize:"12px",color:"rgba(255,255,255,0.9)"}}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((task,i)=>(
                  <tr key={task.id} onClick={()=>{setSelected(task);setEditMode(false);setConfirmDelete(null);}} style={{borderBottom:"1px solid #f3f4f6",cursor:"pointer",background:i%2===0?"#fff":"#fafafa"}}
                    onMouseEnter={e=>e.currentTarget.style.background=G[50]}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"#fff":"#fafafa"}>
                    <td style={{padding:"10px",fontWeight:"500",color:"#111827",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.title}</td>
                    <td style={{padding:"10px"}}><span style={{fontSize:"10px",background:G[50],color:G[700],padding:"2px 7px",borderRadius:"20px",border:`1px solid ${G[100]}`}}>{task.category}</span></td>
                    <td style={{padding:"10px"}}>{task.pic?<PICAvatar name={task.pic} size={22}/>:<span style={{color:"#9ca3af"}}>—</span>}</td>
                    <td style={{padding:"10px",fontSize:"11px",color:isOverdue(task)?"#ef4444":isSoon(task)?"#f59e0b":"#6b7280",fontWeight:isOverdue(task)||isSoon(task)?"600":"400"}}>{fmtDate(task.dueDate)}</td>
                    <td style={{padding:"10px"}}><Badge status={task.status}/></td>
                    <td style={{padding:"10px",fontSize:"11px",color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.requesterName||task.requestedBy}</td>
                    <td style={{padding:"10px",textAlign:"center",color:"#9ca3af"}}>{(task.checklists||[]).filter(c=>c.done).length}/{(task.checklists||[]).length||0}</td>
                    <td style={{padding:"10px",textAlign:"center",color:"#9ca3af"}}>{(task.attachments||[]).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Analytics */}
        {view==="analytics"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"10px",marginBottom:"14px"}}>
              {[["Total Task",analytics.total,"ti-clipboard-list",G[500]],["Selesai",analytics.done,"ti-circle-check","#059669"],["Overdue",analytics.over,"ti-alert-circle","#ef4444"],["Completion",analytics.rate+"%","ti-chart-pie","#7c3aed"]].map(([l,v,ic,col])=>(
                <div key={l} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:"14px",padding:"14px",display:"flex",gap:"10px",alignItems:"center"}}>
                  <div style={{width:"40px",height:"40px",borderRadius:"11px",background:col+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><i className={`ti ${ic}`} style={{fontSize:"20px",color:col}}/></div>
                  <div><p style={{margin:"0 0 1px 0",fontSize:"11px",color:"#9ca3af"}}>{l}</p><p style={{margin:0,fontSize:"22px",fontWeight:"600",color:"#111827",lineHeight:"1"}}>{v}</p></div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"12px",marginBottom:"14px"}}>
              {DESIGNERS.map(d=>{
                const p=analytics.byPIC[d];const isArum=d==="Arum";const accent=isArum?"#db2777":G[500];const aLight=isArum?"#fdf2f8":G[50];
                return(
                  <div key={d} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"14px",borderTop:`3px solid ${accent}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px"}}>
                      <PICAvatar name={d} size={40}/>
                      <div>
                        <p style={{margin:0,fontSize:"15px",fontWeight:"600",color:"#111827"}}>{d}</p>
                        <div style={{display:"flex",alignItems:"center",gap:"5px",marginTop:"2px"}}>
                          <div style={{width:"70px",background:"#f3f4f6",borderRadius:"20px",height:"5px",overflow:"hidden"}}><div style={{width:p.rate+"%",height:"100%",background:accent,borderRadius:"20px"}}/></div>
                          <span style={{fontSize:"11px",color:accent,fontWeight:"600"}}>{p.rate}%</span>
                        </div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px"}}>
                      {[["Total",p.total,"#374151"],["Selesai",p.done,"#059669"],["Overdue",p.over,"#ef4444"],["Progress",p.prog,"#2563eb"]].map(([l,v,c])=>(
                        <div key={l} style={{background:aLight,borderRadius:"10px",padding:"8px 10px"}}>
                          <p style={{margin:"0 0 1px 0",fontSize:"10px",color:"#9ca3af"}}>{l}</p>
                          <p style={{margin:0,fontSize:"20px",fontWeight:"600",color:c,lineHeight:"1"}}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"16px"}}>
              <h3 style={{margin:"0 0 14px 0",fontSize:"14px",fontWeight:"600",color:"#111827"}}>Distribusi per status</h3>
              {Object.entries(STATUS).map(([k,m])=>{const count=allByS(k).length,pct=analytics.total>0?Math.round(count/analytics.total*100):0;return(
                <div key={k} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"5px",minWidth:"110px"}}><span style={{width:"8px",height:"8px",borderRadius:"50%",background:m.dot}}/><span style={{fontSize:"12px",color:"#374151",fontWeight:"500"}}>{m.label}</span></div>
                  <div style={{flex:1,background:"#f3f4f6",borderRadius:"20px",height:"8px",overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:m.dot,borderRadius:"20px",transition:"width .4s"}}/></div>
                  <span style={{fontSize:"11px",color:"#9ca3af",minWidth:"55px",textAlign:"right"}}>{count} ({pct}%)</span>
                </div>
              );})}
            </div>
          </div>
        )}

        {/* DETAIL PANEL */}
        {selected&&(
          <div style={{marginTop:"18px",background:"#fff",border:`2px solid ${G[100]}`,borderRadius:"20px",padding:"20px"}}>
            {/* Header detail */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:"14px"}}>
              <div style={{flex:1,marginRight:"10px"}}>
                {editMode
                  ?<input value={editForm.title} onChange={e=>setEditForm({...editForm,title:e.target.value})} style={{width:"100%",boxSizing:"border-box",fontSize:"16px",fontWeight:"600",border:`1px solid ${G[200]}`,borderRadius:"10px",padding:"7px 10px",marginBottom:"8px"}}/>
                  :<h2 style={{margin:"0 0 8px 0",fontSize:"16px",fontWeight:"600",color:"#111827",lineHeight:"1.4"}}>{selected.title}</h2>
                }
                <div style={{display:"flex",gap:"5px",flexWrap:"wrap",alignItems:"center"}}>
                  <Badge status={selected.status}/>
                  <span style={{fontSize:"10px",background:G[50],color:G[700],padding:"2px 8px",borderRadius:"20px",border:`1px solid ${G[100]}`}}>{selected.category}</span>
                  {selected.pic&&<PICAvatar name={selected.pic} size={22}/>}
                  {isOverdue(selected)&&<span style={{fontSize:"10px",background:"#fee2e2",color:"#991b1b",padding:"2px 8px",borderRadius:"20px",fontWeight:"600"}}>Overdue</span>}
                </div>
              </div>
              <div style={{display:"flex",gap:"6px",flexShrink:0}}>
                {/* FIX #2: Tombol Edit */}
                {!editMode&&(
                  <button onClick={startEdit} style={{background:G[50],border:`1px solid ${G[200]}`,cursor:"pointer",width:"32px",height:"32px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",color:G[600]}}><i className="ti ti-edit" style={{fontSize:"14px"}}/></button>
                )}
                {/* FIX #9: Tombol Hapus */}
                {!editMode&&(
                  <button onClick={()=>setConfirmDelete(selected.id)} style={{background:"#fff0f0",border:"1px solid #fecaca",cursor:"pointer",width:"32px",height:"32px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",color:"#ef4444"}}><i className="ti ti-trash" style={{fontSize:"14px"}}/></button>
                )}
                <button onClick={()=>{setSelected(null);setEditMode(false);setConfirmDelete(null);}} style={{background:"#f3f4f6",border:"none",cursor:"pointer",width:"32px",height:"32px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ti ti-x" style={{fontSize:"14px"}}/></button>
              </div>
            </div>

            {/* FIX #9: Konfirmasi hapus */}
            {confirmDelete===selected.id&&(
              <div style={{background:"#fff0f0",border:"1px solid #fecaca",borderRadius:"12px",padding:"12px 14px",marginBottom:"14px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
                <p style={{margin:0,fontSize:"13px",color:"#991b1b",fontWeight:"600"}}>⚠️ Yakin mau hapus task ini? Tidak bisa di-undo!</p>
                <div style={{display:"flex",gap:"6px"}}>
                  <button onClick={()=>deleteTask(selected.id)} style={{padding:"6px 14px",background:"#ef4444",color:"#fff",border:"none",borderRadius:"20px",cursor:"pointer",fontSize:"12px",fontWeight:"600"}}>Ya, Hapus</button>
                  <button onClick={()=>setConfirmDelete(null)} style={{padding:"6px 14px",background:"#f3f4f6",color:"#374151",border:"none",borderRadius:"20px",cursor:"pointer",fontSize:"12px"}}>Batal</button>
                </div>
              </div>
            )}

            {/* FIX #2: Edit form fields */}
            {editMode?(
              <div style={{background:G[50],borderRadius:"12px",padding:"14px",marginBottom:"14px",border:`1px solid ${G[100]}`}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
                  <div>
                    <label style={{display:"block",fontSize:"11px",fontWeight:"600",marginBottom:"4px",color:G[700]}}>Kategori</label>
                    <select value={editForm.category} onChange={e=>setEditForm({...editForm,category:e.target.value})} style={{width:"100%",boxSizing:"border-box",borderRadius:"8px",border:`1px solid ${G[200]}`,padding:"6px 10px",fontSize:"12px",background:"#fff"}}>
                      {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:"11px",fontWeight:"600",marginBottom:"4px",color:G[700]}}>Deadline</label>
                    <input type="date" value={editForm.dueDate} onChange={e=>setEditForm({...editForm,dueDate:e.target.value})} style={{width:"100%",boxSizing:"border-box",borderRadius:"8px",border:`1px solid ${G[200]}`,padding:"6px 10px",fontSize:"12px",background:"#fff"}}/>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:"11px",fontWeight:"600",marginBottom:"4px",color:G[700]}}>PIC</label>
                    <select value={editForm.pic||""} onChange={e=>setEditForm({...editForm,pic:e.target.value})} style={{width:"100%",boxSizing:"border-box",borderRadius:"8px",border:`1px solid ${G[200]}`,padding:"6px 10px",fontSize:"12px",background:"#fff"}}>
                      <option value="">Belum assign</option>
                      {DESIGNERS.map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:"11px",fontWeight:"600",marginBottom:"4px",color:G[700]}}>Di-request Oleh</label>
                    <select value={editForm.requestedBy} onChange={e=>setEditForm({...editForm,requestedBy:e.target.value})} style={{width:"100%",boxSizing:"border-box",borderRadius:"8px",border:`1px solid ${G[200]}`,padding:"6px 10px",fontSize:"12px",background:"#fff"}}>
                      {REQUESTER_LIST.map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{marginBottom:"10px"}}>
                  <label style={{display:"block",fontSize:"11px",fontWeight:"600",marginBottom:"4px",color:G[700]}}>Deskripsi</label>
                  <textarea value={editForm.description} onChange={e=>setEditForm({...editForm,description:e.target.value})} style={{width:"100%",boxSizing:"border-box",minHeight:"70px",borderRadius:"8px",border:`1px solid ${G[200]}`,padding:"6px 10px",fontSize:"12px",resize:"vertical",background:"#fff"}}/>
                </div>
                <div style={{display:"flex",gap:"6px"}}>
                  <button onClick={saveEdit} style={{padding:"7px 18px",background:`linear-gradient(135deg,${G[700]},${G[400]})`,color:"#fff",border:"none",borderRadius:"20px",cursor:"pointer",fontSize:"12px",fontWeight:"600"}}>Simpan</button>
                  <button onClick={()=>setEditMode(false)} style={{padding:"7px 14px",background:"#f3f4f6",color:"#374151",border:"none",borderRadius:"20px",cursor:"pointer",fontSize:"12px"}}>Batal</button>
                </div>
              </div>
            ):(
              <>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:"7px",marginBottom:"14px"}}>
                  {[["Requester",selected.requesterName?`${selected.requesterName} (${selected.requestedBy})`:selected.requestedBy],["Deadline",fmtDate(selected.dueDate)],["Dibuat",fmtDate(selected.createdDate)],["PIC",selected.pic||"Belum assign"]].map(([l,v])=>(
                    <div key={l} style={{background:G[50],padding:"9px 11px",borderRadius:"10px",border:`1px solid ${G[100]}`}}>
                      <p style={{margin:"0 0 2px 0",fontSize:"10px",color:G[600]}}>{l}</p>
                      <p style={{margin:0,fontSize:"12px",fontWeight:"600",color:G[800]}}>{v}</p>
                    </div>
                  ))}
                </div>
                {selected.description&&<div style={{marginBottom:"14px",background:"#f9fafb",padding:"11px 13px",borderRadius:"10px",border:"1px solid #e5e7eb"}}><p style={{margin:"0 0 3px 0",fontSize:"10px",color:"#6b7280",fontWeight:"600"}}>DESKRIPSI</p><p style={{margin:0,fontSize:"13px",lineHeight:"1.6",color:"#374151"}}>{selected.description}</p></div>}
              </>
            )}

            {/* Pindah status */}
            {!editMode&&selected.status!=="request"&&(
              <div style={{marginBottom:"14px"}}>
                <p style={{margin:"0 0 7px 0",fontSize:"11px",color:"#6b7280",fontWeight:"600"}}>PINDAH STATUS</p>
                <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
                  {Object.entries(STATUS).filter(([k])=>k!=="request"&&k!==selected.status).map(([k,m])=>(
                    <button key={k} onClick={()=>moveTask(selected.id,k)} style={{fontSize:"12px",padding:"5px 13px",background:m.bg,color:m.text,border:`1px solid ${m.border}`,borderRadius:"20px",cursor:"pointer",fontWeight:"500"}}>→ {m.label}</button>
                  ))}
                </div>
              </div>
            )}

            {/* FIX #3: Checklist section */}
            <div style={{marginBottom:"14px"}}>
              <p style={{margin:"0 0 10px 0",fontSize:"13px",fontWeight:"600",color:"#111827",display:"flex",alignItems:"center",gap:"6px"}}>
                <i className="ti ti-checklist" style={{fontSize:"15px",color:G[500]}}/>
                Checklist
                {(selected.checklists||[]).length>0&&(
                  <span style={{background:G[100],color:G[700],fontSize:"10px",padding:"1px 7px",borderRadius:"20px",fontWeight:"600"}}>
                    {(selected.checklists||[]).filter(c=>c.done).length}/{(selected.checklists||[]).length}
                  </span>
                )}
              </p>
              {(selected.checklists||[]).length>0&&(
                <div style={{background:"#f3f4f6",borderRadius:"20px",height:"6px",overflow:"hidden",marginBottom:"10px"}}>
                  <div style={{width:`${Math.round((selected.checklists||[]).filter(c=>c.done).length/((selected.checklists||[]).length||1)*100)}%`,height:"100%",background:G[500],borderRadius:"20px",transition:"width .3s"}}/>
                </div>
              )}
              {(selected.checklists||[]).map(c=>(
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 10px",background:c.done?"#f9fafb":"#fff",borderRadius:"10px",marginBottom:"6px",border:"1px solid #f0f0f0"}}>
                  <button onClick={()=>toggleCheck(c.id)} style={{width:"20px",height:"20px",borderRadius:"6px",border:`2px solid ${c.done?G[500]:"#d1d5db"}`,background:c.done?G[500]:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,padding:0}}>
                    {c.done&&<i className="ti ti-check" style={{fontSize:"11px",color:"#fff"}}/>}
                  </button>
                  <span style={{flex:1,fontSize:"13px",color:c.done?"#9ca3af":"#374151",textDecoration:c.done?"line-through":"none"}}>{c.text}</span>
                  <select value={c.assignee} onChange={e=>changeCheckAssignee(c.id,e.target.value)} style={{fontSize:"11px",padding:"2px 6px",borderRadius:"20px",border:`1px solid ${PIC_STYLE[c.assignee]?.bg??"#e5e7eb"}`,background:PIC_STYLE[c.assignee]?.bg??"#f9fafb",color:PIC_STYLE[c.assignee]?.text??"#374151",cursor:"pointer",fontWeight:"600"}}>
                    {DESIGNERS.map(d=><option key={d}>{d}</option>)}
                  </select>
                  <button onClick={()=>removeCheck(c.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#d1d5db",padding:0,flexShrink:0}}><i className="ti ti-x" style={{fontSize:"13px"}}/></button>
                </div>
              ))}
              <div style={{display:"flex",gap:"6px",marginTop:"8px"}}>
                <input value={newCheckText} onChange={e=>setNewCheckText(e.target.value)} placeholder="Tambah item checklist..." style={{flex:1,borderRadius:"10px",border:"1px solid #e5e7eb",padding:"7px 10px",fontSize:"12px"}} onKeyDown={e=>{if(e.key==="Enter")addChecklist();}}/>
                <select value={newCheckAssignee} onChange={e=>setNewCheckAssignee(e.target.value)} style={{fontSize:"12px",padding:"7px 10px",borderRadius:"10px",border:"1px solid #e5e7eb",fontWeight:"600"}}>
                  {DESIGNERS.map(d=><option key={d}>{d}</option>)}
                </select>
                <button onClick={addChecklist} style={{padding:"7px 14px",background:G[500],color:"#fff",border:"none",borderRadius:"10px",cursor:"pointer",fontSize:"12px",fontWeight:"600",flexShrink:0}}>+ Tambah</button>
              </div>
            </div>

            {/* Attachments */}
            <div style={{marginBottom:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                <p style={{margin:0,fontSize:"13px",fontWeight:"600",color:"#111827",display:"flex",alignItems:"center",gap:"5px"}}>
                  <i className="ti ti-paperclip" style={{fontSize:"14px",color:G[500]}}/>Attachment
                  <span style={{background:G[100],color:G[700],fontSize:"10px",padding:"1px 6px",borderRadius:"20px",marginLeft:"2px"}}>{(selected.attachments||[]).length+(selected.attachmentLinks||[]).length}</span>
                </p>
                <button onClick={()=>detailFileRef.current?.click()} style={{fontSize:"11px",padding:"4px 11px",background:G[50],color:G[700],border:`1px solid ${G[200]}`,borderRadius:"20px",cursor:"pointer",display:"flex",alignItems:"center",gap:"4px"}}><i className="ti ti-upload" style={{fontSize:"12px"}}/>Upload</button>
                <input ref={detailFileRef} type="file" multiple accept="image/*,.pdf,.xlsx,.xls,.csv" style={{display:"none"}} onChange={handleDetailFiles}/>
              </div>
              {/* Show links dari form */}
              {(selected.attachmentLinks||[]).length>0&&(
                <div style={{display:"flex",flexDirection:"column",gap:"5px",marginBottom:"8px"}}>
                  {selected.attachmentLinks.map(l=>(
                    <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:"6px",background:"#eff6ff",borderRadius:"8px",padding:"6px 10px",border:"1px solid #bfdbfe",textDecoration:"none"}}>
                      <i className="ti ti-link" style={{fontSize:"13px",color:"#2563eb",flexShrink:0}}/>
                      <span style={{flex:1,fontSize:"11px",color:"#1e40af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.url}</span>
                      <i className="ti ti-external-link" style={{fontSize:"11px",color:"#93c5fd"}}/>
                    </a>
                  ))}
                </div>
              )}
              {(selected.attachments||[]).length===0&&(selected.attachmentLinks||[]).length===0
                ?<div onClick={()=>detailFileRef.current?.click()} style={{border:`2px dashed ${G[200]}`,borderRadius:"12px",padding:"20px",textAlign:"center",cursor:"pointer",background:G[50]}}><i className="ti ti-upload" style={{fontSize:"20px",color:G[300],display:"block",marginBottom:"4px"}}/><p style={{margin:0,fontSize:"12px",color:G[500]}}>Klik untuk upload</p></div>
                :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:"7px"}}>
                  {selected.attachments.map(att=>(
                    <div key={att.id} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:"12px",padding:"9px",position:"relative"}}>
                      <button onClick={()=>removeAtt(att.id)} style={{position:"absolute",top:"5px",right:"5px",background:"rgba(239,68,68,0.1)",border:"none",cursor:"pointer",width:"18px",height:"18px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#ef4444",padding:0}}><i className="ti ti-x" style={{fontSize:"11px"}}/></button>
                      {att.type==="image"&&att.dataUrl?<img src={att.dataUrl} alt={att.name} style={{width:"100%",height:"60px",objectFit:"cover",borderRadius:"7px",marginBottom:"5px",display:"block"}}/>:<div style={{width:"100%",height:"50px",background:"#fff",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"5px"}}><i className={`ti ${att.type==="pdf"?"ti-file-type-pdf":"ti-file-spreadsheet"}`} style={{fontSize:"22px",color:"#6b7280"}}/></div>}
                      <p style={{margin:"0 0 1px 0",fontSize:"10px",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:"12px",color:"#374151"}}>{att.name}</p>
                      <p style={{margin:0,fontSize:"10px",color:"#9ca3af"}}>{att.size}</p>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROUTER ────────────────────────────────────────────────────
export default function App() {
  const [page,setPage]=useState(()=>window.location.hash==="#/request"?"request":"board");
  useEffect(()=>{
    const h=()=>setPage(window.location.hash==="#/request"?"request":"board");
    window.addEventListener("hashchange",h);
    return()=>window.removeEventListener("hashchange",h);
  },[]);
  if(page==="request")return <RequestPage/>;
  return <BoardApp/>;
}
