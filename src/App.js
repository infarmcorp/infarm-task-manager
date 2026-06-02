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
const LOGO_INFARM = "data:image/png;base64,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";

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
  const [form,setForm]=useState({title:"",requesterName:"",category:"Social Media Post",requestedBy:"Sales Team",description:"",dueDate:"",attachments:[]});
  const [submitted,setSubmitted]=useState(false);
  const [loading,setLoading]=useState(false);
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

  const handleSubmit=e=>{
    e.preventDefault();setLoading(true);
    setTimeout(()=>{
      const tasks=loadTasks();
      const newTask={id:Date.now(),title:form.title,requesterName:form.requesterName,category:form.category,requestedBy:form.requestedBy,description:form.description,dueDate:form.dueDate,attachments:form.attachments||[],attachmentLinks:[],resultLinks:[],status:"request",pic:null,checklists:[],createdDate:new Date().toISOString().split("T")[0]};
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
        <button onClick={()=>{setSubmitted(false);setForm({title:"",requesterName:"",category:"Social Media Post",requestedBy:"Sales Team",description:"",dueDate:"",attachments:[]});}} style={{width:"100%",padding:"12px",background:`linear-gradient(135deg,${G[800]},${G[500]})`,color:"#fff",border:"none",borderRadius:"12px",cursor:"pointer",fontSize:"14px",fontWeight:"600"}}>
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
            <img src={LOGO_INFARM} alt="Infarm" style={{width:"32px",height:"32px",objectFit:"contain"}}/>
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

// ─── RESULT LINK INPUT COMPONENT ──────────────────────────────
function ResultLinkInput({selected,setSelected,tasks,setTasks}){
  const [newLink,setNewLink]=useState("");
  const addResultLink=()=>{
    if(!newLink.trim())return;
    const link={id:Date.now(),url:newLink.trim()};
    const u={...selected,resultLinks:[...(selected.resultLinks||[]),link]};
    const updated=tasks.map(t=>t.id===u.id?u:t);
    setTasks(updated);saveTasks(updated);setSelected(u);setNewLink("");
  };
  const removeResultLink=id=>{
    const u={...selected,resultLinks:(selected.resultLinks||[]).filter(l=>l.id!==id)};
    const updated=tasks.map(t=>t.id===u.id?u:t);
    setTasks(updated);saveTasks(updated);setSelected(u);
  };
  return(
    <div>
      {(selected.resultLinks||[]).length===0?(
        <div style={{border:`2px dashed ${G[200]}`,borderRadius:"12px",padding:"12px",textAlign:"center",background:G[50],marginBottom:"8px"}}>
          <i className="ti ti-cloud-upload" style={{fontSize:"18px",color:G[300],display:"block",marginBottom:"4px"}}/>
          <p style={{margin:0,fontSize:"12px",color:G[500]}}>Belum ada link hasil desain</p>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:"6px",marginBottom:"8px"}}>
          {selected.resultLinks.map((l,i)=>(
            <div key={l.id||i} style={{display:"flex",alignItems:"center",gap:"8px",background:G[50],borderRadius:"10px",padding:"10px 12px",border:`1px solid ${G[200]}`}}>
              <div style={{width:"28px",height:"28px",borderRadius:"8px",background:G[500],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <i className="ti ti-cloud" style={{fontSize:"13px",color:"#fff"}}/>
              </div>
              <a href={l.url} target="_blank" rel="noopener noreferrer" style={{flex:1,fontSize:"12px",color:G[700],overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:"500",textDecoration:"none"}}>
                {l.url}
              </a>
              <a href={l.url} target="_blank" rel="noopener noreferrer" style={{color:G[500],flexShrink:0}}>
                <i className="ti ti-external-link" style={{fontSize:"14px"}}/>
              </a>
              <button onClick={()=>removeResultLink(l.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#d1d5db",padding:0,flexShrink:0}}>
                <i className="ti ti-x" style={{fontSize:"13px"}}/>
              </button>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",gap:"6px"}}>
        <input
          value={newLink} onChange={e=>setNewLink(e.target.value)}
          placeholder="Paste link Google Drive hasil desain..."
          style={{flex:1,borderRadius:"10px",border:`1px solid ${G[200]}`,padding:"8px 12px",fontSize:"12px",background:"#fff"}}
          onKeyDown={e=>{if(e.key==="Enter")addResultLink();}}
        />
        <button onClick={addResultLink} style={{padding:"8px 14px",background:G[500],color:"#fff",border:"none",borderRadius:"10px",cursor:"pointer",fontSize:"12px",fontWeight:"600",flexShrink:0,display:"flex",alignItems:"center",gap:"4px"}}>
          <i className="ti ti-plus" style={{fontSize:"13px"}}/>Tambah
        </button>
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
  const [deletePopup,setDeletePopup]=useState(null); // task pending hapus dari kanban
  // FIX #3: Checklist
  const [newCheckText,setNewCheckText]=useState("");
  const [newCheckAssignee,setNewCheckAssignee]=useState("Denny");
  const [exportMsg,setExportMsg]=useState("");
  const [linkCopied,setLinkCopied]=useState(false);
  const [lightbox,setLightbox]=useState(null); // FIX #6: image preview
  // Filter tanggal khusus Analytics (berdasarkan deadline)
  const [anMode,setAnMode]=useState("all");
  const [anFrom,setAnFrom]=useState("");
  const [anTo,setAnTo]=useState("");
  // Popup selamat saat task selesai
  const [celebrate,setCelebrate]=useState(null);
  const detailFileRef=useRef(null);

  // Simpan ke localStorage hanya kalau tasks berubah (bukan saat mount)
  const isFirstRender=useRef(true);
  useEffect(()=>{
    if(isFirstRender.current){isFirstRender.current=false;return;}
    saveTasks(tasks);
  },[tasks]);

  // Patch tasks lama + auto-refresh dari localStorage setiap 3 detik
  useEffect(()=>{
    // Patch data lama yang belum punya field baru
    setTasks(prev=>prev.map(t=>({
      ...t,
      attachmentLinks: Array.isArray(t.attachmentLinks)?t.attachmentLinks:[],
      resultLinks: Array.isArray(t.resultLinks)?t.resultLinks:[],
      checklists: Array.isArray(t.checklists)?t.checklists:[],
    })));
    // Auto-refresh: cek localStorage setiap 3 detik, sync kalau ada perubahan
    const interval=setInterval(()=>{
      try{
        const stored=loadTasks();
        const storedStr=JSON.stringify(stored);
        setTasks(prev=>{
          if(JSON.stringify(prev)===storedStr)return prev;
          return stored.map(t=>({...t,attachmentLinks:Array.isArray(t.attachmentLinks)?t.attachmentLinks:[],resultLinks:Array.isArray(t.resultLinks)?t.resultLinks:[],checklists:Array.isArray(t.checklists)?t.checklists:[]}));
        });
      }catch(e){}
    },3000);
    return()=>clearInterval(interval);
  },[]);

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
    // Filter tasks berdasarkan anMode (deadline)
    let at=[...tasks];
    const t0=new Date();t0.setHours(0,0,0,0);
    if(anMode==="week"){const n=new Date(t0);n.setDate(n.getDate()+7);at=at.filter(t=>{if(!t.dueDate)return false;const d=new Date(t.dueDate);return d>=t0&&d<=n;});}
    else if(anMode==="month"){const n=new Date(t0);n.setMonth(n.getMonth()+1);at=at.filter(t=>{if(!t.dueDate)return false;const d=new Date(t.dueDate);return d>=t0&&d<=n;});}
    else if(anMode==="custom"&&anFrom&&anTo){const from=new Date(anFrom);const to=new Date(anTo);to.setHours(23,59,59);at=at.filter(t=>{if(!t.dueDate)return false;const d=new Date(t.dueDate);return d>=from&&d<=to;});}
    const total=at.length,done=at.filter(t=>t.status==="finish").length,over=at.filter(t=>isOverdue(t)).length;
    const byPIC={};
    DESIGNERS.forEach(d=>{const dt=at.filter(t=>t.pic===d);byPIC[d]={total:dt.length,done:dt.filter(t=>t.status==="finish").length,over:dt.filter(t=>isOverdue(t)).length,prog:dt.filter(t=>t.status==="on_progress").length,rate:dt.length>0?Math.round(dt.filter(t=>t.status==="finish").length/dt.length*100):0};});
    // Distribusi per status (pakai filtered tasks juga)
    const statusDist={};
    Object.keys(STATUS).forEach(k=>{statusDist[k]=at.filter(t=>t.status===k).length;});
    return{total,done,over,rate:total>0?Math.round(done/total*100):0,byPIC,statusDist};
  },[tasks,anMode,anFrom,anTo]);

  const moveTask=(id,ns)=>{
    let movedTask=null;
    setTasks(prev=>{const u=prev.map(t=>{if(t.id!==id)return t;movedTask={...t,status:ns};return movedTask;});saveTasks(u);return u;});
    if(selected?.id===id)setSelected(prev=>({...prev,status:ns}));
    // Trigger popup selamat kalau dipindah ke finish
    if(ns==="finish"&&movedTask){
      setCelebrate({name:movedTask.pic||"Tim Desain",title:movedTask.title});
    }
  };

  // FIX #9: Delete dengan konfirmasi
  const deleteTask=id=>{
    setTasks(prev=>{const u=prev.filter(t=>t.id!==id);saveTasks(u);return u;});
    if(selected?.id===id)setSelected(null);
    setConfirmDelete(null);
  };

  const copyRequestLink=()=>{navigator.clipboard?.writeText(window.location.origin+"/#/request").catch(()=>{});setLinkCopied(true);setTimeout(()=>setLinkCopied(false),2000);};

  // FIX #2: Edit task
  const startEdit=()=>{
    setEditForm({
      title:selected.title||"",
      category:selected.category||"Social Media Post",
      dueDate:selected.dueDate||"",
      pic:selected.pic||"",
      requestedBy:selected.requestedBy||"Sales Team",
      description:selected.description||""
    });
    setEditMode(true);
  };
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
            {((task.attachments||[]).length+(task.attachmentLinks||[]).length)>0&&(
              <span style={{fontSize:"10px",color:"#9ca3af",display:"flex",alignItems:"center",gap:"2px"}}>
                <i className="ti ti-paperclip" style={{fontSize:"11px"}}/>
                {(task.attachments||[]).length+(task.attachmentLinks||[]).length}
              </span>
            )}
          </div>
        </div>
        <div style={{display:"flex",gap:"5px",marginTop:"8px",flexWrap:"wrap",justifyContent:"space-between"}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
            {task.status==="request"&&<button onClick={()=>moveTask(task.id,"todo")} style={{fontSize:"11px",padding:"3px 10px",background:G[50],color:G[700],border:`1px solid ${G[200]}`,borderRadius:"20px",cursor:"pointer"}}>Assign → Todo</button>}
            {task.status!=="request"&&task.status!=="on_progress"&&<button onClick={()=>moveTask(task.id,"on_progress")} style={{fontSize:"11px",padding:"3px 10px",background:"#dbeafe",color:"#1e3a8a",border:"1px solid #bfdbfe",borderRadius:"20px",cursor:"pointer"}}>→ Progress</button>}
            {task.status!=="request"&&task.status!=="finish"&&<button onClick={()=>moveTask(task.id,"finish")} style={{fontSize:"11px",padding:"3px 10px",background:"#d1fae5",color:"#064e3b",border:"1px solid #a7f3d0",borderRadius:"20px",cursor:"pointer"}}>✓ Finish</button>}
            {task.status!=="request"&&task.status!=="todo"&&<button onClick={()=>moveTask(task.id,"todo")} style={{fontSize:"11px",padding:"3px 10px",background:"#ede9fe",color:"#4c1d95",border:"1px solid #ddd6fe",borderRadius:"20px",cursor:"pointer"}}>← Todo</button>}
          </div>
          {/* FIX #7: Tombol hapus di kanban card - buka popup konfirmasi */}
          <button onClick={e=>{e.stopPropagation();setDeletePopup(task);}} style={{fontSize:"11px",padding:"3px 8px",background:"#fff0f0",color:"#ef4444",border:"1px solid #fecaca",borderRadius:"20px",cursor:"pointer",display:"flex",alignItems:"center",gap:"3px"}}>
            <i className="ti ti-trash" style={{fontSize:"11px"}}/>Hapus
          </button>
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

      {/* FIX #6: Lightbox modal untuk preview gambar */}
      {lightbox&&(
        <div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"20px"}}>
          <div onClick={e=>e.stopPropagation()} style={{position:"relative",maxWidth:"90vw",maxHeight:"90vh"}}>
            <img src={lightbox.dataUrl} alt={lightbox.name} style={{maxWidth:"100%",maxHeight:"85vh",borderRadius:"12px",display:"block",objectFit:"contain"}}/>
            <button onClick={()=>setLightbox(null)} style={{position:"absolute",top:"-14px",right:"-14px",background:"#fff",border:"none",cursor:"pointer",width:"32px",height:"32px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#374151",boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>
              <i className="ti ti-x" style={{fontSize:"16px"}}/>
            </button>
            <p style={{margin:"8px 0 0 0",textAlign:"center",fontSize:"12px",color:"rgba(255,255,255,0.7)"}}>{lightbox.name}</p>
          </div>
        </div>
      )}
      {/* Popup konfirmasi hapus dari kanban */}
      {deletePopup&&(
        <div onClick={()=>setDeletePopup(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"20px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"18px",padding:"24px",width:"min(360px,92vw)",textAlign:"center"}}>
            <div style={{width:"56px",height:"56px",borderRadius:"50%",background:"#fee2e2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
              <i className="ti ti-trash" style={{fontSize:"26px",color:"#ef4444"}}/>
            </div>
            <h3 style={{margin:"0 0 8px 0",fontSize:"16px",fontWeight:"700",color:"#111827"}}>Yakin mau hapus task ini?</h3>
            <p style={{margin:"0 0 6px 0",fontSize:"13px",color:"#6b7280",lineHeight:"1.5"}}>"{deletePopup.title}"</p>
            <p style={{margin:"0 0 20px 0",fontSize:"12px",color:"#9ca3af"}}>Task yang dihapus tidak bisa dikembalikan.</p>
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={()=>setDeletePopup(null)} style={{flex:1,padding:"10px",background:"#f3f4f6",color:"#374151",border:"none",borderRadius:"12px",cursor:"pointer",fontSize:"13px",fontWeight:"600"}}>Tidak</button>
              <button onClick={()=>{deleteTask(deletePopup.id);setDeletePopup(null);}} style={{flex:1,padding:"10px",background:"#ef4444",color:"#fff",border:"none",borderRadius:"12px",cursor:"pointer",fontSize:"13px",fontWeight:"600"}}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup SELAMAT saat task selesai - dengan animasi kembang api */}
      {celebrate&&(
        <div onClick={()=>setCelebrate(null)} style={{position:"fixed",inset:0,background:"rgba(13,61,36,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10000,padding:"20px",overflow:"hidden"}}>
          <style>{`
            @keyframes fireworkBurst {
              0% { transform: scale(0); opacity: 1; }
              50% { opacity: 1; }
              100% { transform: scale(1.6); opacity: 0; }
            }
            @keyframes popIn {
              0% { transform: scale(0.6) translateY(20px); opacity: 0; }
              60% { transform: scale(1.05) translateY(-5px); }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            @keyframes confettiFall {
              0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
              100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
            }
            @keyframes bounce {
              0%,100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            @keyframes shine {
              0%,100% { opacity: 0.4; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.2); }
            }
          `}</style>

          {/* Confetti jatuh */}
          {Array.from({length:30}).map((_,i)=>{
            const colors=["#22c55e","#3db87a","#fde68a","#60a5fa","#f472b6","#fb923c","#a78bfa"];
            const left=Math.random()*100;
            const delay=Math.random()*2;
            const dur=2.5+Math.random()*2;
            const size=6+Math.random()*8;
            return <div key={i} style={{position:"absolute",top:0,left:`${left}%`,width:`${size}px`,height:`${size}px`,background:colors[i%colors.length],borderRadius:i%2===0?"50%":"2px",animation:`confettiFall ${dur}s linear ${delay}s infinite`}}/>;
          })}

          {/* Kembang api burst */}
          {[{top:"15%",left:"18%",color:"#fde68a",delay:"0s"},{top:"22%",left:"80%",color:"#60a5fa",delay:"0.4s"},{top:"60%",left:"12%",color:"#f472b6",delay:"0.8s"},{top:"68%",left:"85%",color:"#22c55e",delay:"0.6s"},{top:"10%",left:"50%",color:"#fb923c",delay:"1s"}].map((fw,i)=>(
            <div key={i} style={{position:"absolute",top:fw.top,left:fw.left,width:"60px",height:"60px",pointerEvents:"none"}}>
              {Array.from({length:12}).map((_,j)=>(
                <div key={j} style={{position:"absolute",top:"50%",left:"50%",width:"4px",height:"4px",borderRadius:"50%",background:fw.color,transform:`rotate(${j*30}deg) translateX(0)`,transformOrigin:"center",boxShadow:`0 -22px 0 ${fw.color}`,animation:`fireworkBurst 1.8s ease-out ${fw.delay} infinite`}}/>
              ))}
            </div>
          ))}

          {/* Card utama */}
          <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#fff",borderRadius:"28px",padding:"40px 32px 32px",width:"min(420px,92vw)",textAlign:"center",animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",boxShadow:"0 20px 60px rgba(0,0,0,0.3)",zIndex:2}}>
            {/* Trophy / emoji */}
            <div style={{fontSize:"64px",marginBottom:"8px",animation:"bounce 1.5s ease-in-out infinite",lineHeight:"1"}}>🎉</div>

            {/* Bintang shine */}
            <div style={{display:"flex",justifyContent:"center",gap:"12px",marginBottom:"16px"}}>
              {["⭐","🎊","⭐"].map((s,i)=>(
                <span key={i} style={{fontSize:"24px",display:"inline-block",animation:`shine 1.2s ease-in-out ${i*0.2}s infinite`}}>{s}</span>
              ))}
            </div>

            <h2 style={{margin:"0 0 12px 0",fontSize:"24px",fontWeight:"800",background:`linear-gradient(135deg,${G[600]},${G[400]})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",lineHeight:"1.3"}}>
              Selamat {celebrate.name}! 🥳
            </h2>

            <p style={{margin:"0 0 8px 0",fontSize:"15px",color:"#374151",fontWeight:"600",lineHeight:"1.5"}}>
              Kamu telah menyelesaikan tugas
            </p>

            <div style={{background:G[50],borderRadius:"14px",padding:"12px 16px",marginBottom:"18px",border:`1px solid ${G[100]}`}}>
              <p style={{margin:0,fontSize:"13px",color:G[700],fontWeight:"600"}}>✓ {celebrate.title}</p>
            </div>

            <p style={{margin:"0 0 24px 0",fontSize:"14px",color:"#6b7280",lineHeight:"1.6",fontStyle:"italic"}}>
              "Terus semangat untuk hari ini, kerja kerasmu luar biasa! 💪✨"
            </p>

            <button onClick={()=>setCelebrate(null)} style={{width:"100%",padding:"14px",background:`linear-gradient(135deg,${G[700]},${G[400]})`,color:"#fff",border:"none",borderRadius:"14px",cursor:"pointer",fontSize:"15px",fontWeight:"700",boxShadow:`0 4px 14px ${G[300]}`}}>
              Lanjut Semangat! 🚀
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{background:`linear-gradient(135deg,${G[800]},${G[600]})`,borderRadius:"0 0 22px 22px",marginBottom:"18px"}}>
        <div style={{padding:"18px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{width:"48px",height:"48px",borderRadius:"12px",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,0.25)",flexShrink:0}}>
              <img src={LOGO_INFARM} alt="Infarm" style={{width:"38px",height:"38px",objectFit:"contain"}}/>
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
        {/* Custom range row - muncul di kanan bawah dropdown */}
        {filterMode==="custom"&&(
          <div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap",padding:"10px 20px 0",justifyContent:"flex-end"}}>
            <span style={{fontSize:"12px",color:"rgba(255,255,255,0.8)"}}>Dari:</span>
            <input type="date" value={customFrom} onChange={e=>setCustomFrom(e.target.value)} style={{fontSize:"12px",padding:"5px 10px",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.15)",color:"#fff"}}/>
            <span style={{fontSize:"12px",color:"rgba(255,255,255,0.8)"}}>Sampai:</span>
            <input type="date" value={customTo} onChange={e=>setCustomTo(e.target.value)} style={{fontSize:"12px",padding:"5px 10px",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.15)",color:"#fff"}}/>
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
                  <tr key={task.id} onClick={()=>{setSelected(task);setEditMode(false);setConfirmDelete(null);setView("kanban");}} style={{borderBottom:"1px solid #f3f4f6",cursor:"pointer",background:i%2===0?"#fff":"#fafafa"}}
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
            {/* Filter tanggal Analytics */}
            <div style={{background:"#fff",borderRadius:"14px",padding:"12px 16px",marginBottom:"14px",border:"1px solid #e5e7eb",display:"flex",gap:"10px",alignItems:"center",flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
                <i className="ti ti-calendar-stats" style={{fontSize:"16px",color:G[500]}}/>
                <span style={{fontSize:"13px",fontWeight:"600",color:"#111827"}}>Periode Kinerja:</span>
              </div>
              {[["all","Semua"],["week","Minggu Ini"],["month","Bulan Ini"],["custom","Custom"]].map(([k,l])=>(
                <button key={k} onClick={()=>setAnMode(k)} style={{fontSize:"12px",padding:"6px 14px",borderRadius:"20px",border:`1px solid ${anMode===k?G[500]:"#e5e7eb"}`,background:anMode===k?G[500]:"#fff",color:anMode===k?"#fff":"#6b7280",cursor:"pointer",fontWeight:anMode===k?"600":"400"}}>{l}</button>
              ))}
              {anMode==="custom"&&(
                <div style={{display:"flex",gap:"6px",alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:"12px",color:"#6b7280"}}>Dari:</span>
                  <input type="date" value={anFrom} onChange={e=>setAnFrom(e.target.value)} style={{fontSize:"12px",padding:"5px 10px",borderRadius:"10px",border:"1px solid #e5e7eb"}}/>
                  <span style={{fontSize:"12px",color:"#6b7280"}}>Sampai:</span>
                  <input type="date" value={anTo} onChange={e=>setAnTo(e.target.value)} style={{fontSize:"12px",padding:"5px 10px",borderRadius:"10px",border:"1px solid #e5e7eb"}}/>
                </div>
              )}
              {anMode!=="all"&&(
                <span style={{fontSize:"11px",background:G[50],color:G[700],padding:"4px 10px",borderRadius:"20px",border:`1px solid ${G[100]}`,fontWeight:"600",marginLeft:"auto"}}>
                  {analytics.total} task dalam periode ini
                </span>
              )}
            </div>
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
              {Object.entries(STATUS).map(([k,m])=>{const count=analytics.statusDist[k]||0,pct=analytics.total>0?Math.round(count/analytics.total*100):0;return(
                <div key={k} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"5px",minWidth:"110px"}}><span style={{width:"8px",height:"8px",borderRadius:"50%",background:m.dot}}/><span style={{fontSize:"12px",color:"#374151",fontWeight:"500"}}>{m.label}</span></div>
                  <div style={{flex:1,background:"#f3f4f6",borderRadius:"20px",height:"8px",overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:m.dot,borderRadius:"20px",transition:"width .4s"}}/></div>
                  <span style={{fontSize:"11px",color:"#9ca3af",minWidth:"55px",textAlign:"right"}}>{count} ({pct}%)</span>
                </div>
              );})}
            </div>
          </div>
        )}

        {/* DETAIL PANEL - hanya di kanban view */}
        {selected&&view==="kanban"&&(
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
                {/* Tombol Edit - hijau */}
                {!editMode&&(
                  <button onClick={startEdit} title="Edit task" style={{background:G[500],border:"none",cursor:"pointer",width:"32px",height:"32px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",boxShadow:`0 2px 6px ${G[300]}`}}>
                    <i className="ti ti-pencil" style={{fontSize:"15px"}}/>
                  </button>
                )}
                {/* Tombol Hapus - merah */}
                {!editMode&&(
                  <button onClick={()=>setConfirmDelete(selected.id)} title="Hapus task" style={{background:"#ef4444",border:"none",cursor:"pointer",width:"32px",height:"32px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",boxShadow:"0 2px 6px #fca5a5"}}>
                    <i className="ti ti-trash" style={{fontSize:"15px"}}/>
                  </button>
                )}
                {/* Tombol Close - abu-abu */}
                <button onClick={()=>{setSelected(null);setEditMode(false);setConfirmDelete(null);}} title="Tutup" style={{background:"#9ca3af",border:"none",cursor:"pointer",width:"32px",height:"32px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
                  <i className="ti ti-x" style={{fontSize:"15px"}}/>
                </button>
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
                    <label style={{display:"block",fontSize:"11px",fontWeight:"600",marginBottom:"4px",color:G[700]}}>PIC (Designer)</label>
                    <select value={editForm.pic||""} onChange={e=>setEditForm({...editForm,pic:e.target.value})} style={{width:"100%",boxSizing:"border-box",borderRadius:"8px",border:`1px solid ${G[200]}`,padding:"6px 10px",fontSize:"12px",background:"#fff"}}>
                      <option value="">— Belum assign —</option>
                      <option value="Denny">👤 Denny</option>
                      <option value="Arum">👤 Arum</option>
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

            {/* ── FILE ATTACHMENT ── */}
            <div style={{marginBottom:"12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                <p style={{margin:0,fontSize:"13px",fontWeight:"600",color:"#111827",display:"flex",alignItems:"center",gap:"5px"}}>
                  <i className="ti ti-photo" style={{fontSize:"14px",color:G[500]}}/>File Attachment
                  <span style={{background:G[100],color:G[700],fontSize:"10px",padding:"1px 6px",borderRadius:"20px",marginLeft:"2px"}}>{(selected.attachments||[]).length}</span>
                </p>
                <button onClick={()=>detailFileRef.current?.click()} style={{fontSize:"11px",padding:"4px 11px",background:G[50],color:G[700],border:`1px solid ${G[200]}`,borderRadius:"20px",cursor:"pointer",display:"flex",alignItems:"center",gap:"4px"}}>
                  <i className="ti ti-upload" style={{fontSize:"12px"}}/>Upload
                </button>
                <input ref={detailFileRef} type="file" multiple accept="image/*,.pdf,.xlsx,.xls,.csv" style={{display:"none"}} onChange={handleDetailFiles}/>
              </div>
              {(selected.attachments||[]).length===0
                ?<div onClick={()=>detailFileRef.current?.click()} style={{border:`2px dashed ${G[200]}`,borderRadius:"12px",padding:"16px",textAlign:"center",cursor:"pointer",background:G[50]}}>
                  <i className="ti ti-upload" style={{fontSize:"18px",color:G[300],display:"block",marginBottom:"4px"}}/>
                  <p style={{margin:0,fontSize:"12px",color:G[500]}}>Klik untuk upload foto / PDF / Excel</p>
                </div>
                :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:"7px"}}>
                  {selected.attachments.map(att=>(
                    <div key={att.id} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:"12px",padding:"9px",position:"relative"}}>
                      <button onClick={()=>removeAtt(att.id)} style={{position:"absolute",top:"5px",right:"5px",background:"rgba(239,68,68,0.1)",border:"none",cursor:"pointer",width:"18px",height:"18px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#ef4444",padding:0,zIndex:1}}><i className="ti ti-x" style={{fontSize:"11px"}}/></button>
                      {att.type==="image"&&att.dataUrl
                        ?<img src={att.dataUrl} alt={att.name} onClick={()=>setLightbox(att)} style={{width:"100%",height:"60px",objectFit:"cover",borderRadius:"7px",marginBottom:"5px",display:"block",cursor:"zoom-in"}}/>
                        :<div style={{width:"100%",height:"50px",background:"#fff",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"5px"}}><i className={`ti ${att.type==="pdf"?"ti-file-type-pdf":"ti-file-spreadsheet"}`} style={{fontSize:"22px",color:"#6b7280"}}/></div>
                      }
                      <p style={{margin:"0 0 1px 0",fontSize:"10px",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:"12px",color:"#374151"}}>{att.name}</p>
                      <p style={{margin:0,fontSize:"10px",color:"#9ca3af"}}>{att.size}</p>
                    </div>
                  ))}
                </div>
              }
            </div>

            {/* ── LINK HASIL DESAIN (khusus tim desain input setelah selesai) ── */}
            <div style={{marginBottom:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                <p style={{margin:0,fontSize:"13px",fontWeight:"600",color:"#111827",display:"flex",alignItems:"center",gap:"5px"}}>
                  <i className="ti ti-cloud-upload" style={{fontSize:"14px",color:G[500]}}/>Link Hasil Desain
                  <span style={{background:G[100],color:G[700],fontSize:"10px",padding:"1px 6px",borderRadius:"20px",marginLeft:"2px"}}>{(selected.resultLinks||[]).length}</span>
                </p>
              </div>
              {/* Input tambah link hasil */}
              <ResultLinkInput selected={selected} setSelected={setSelected} tasks={tasks} setTasks={setTasks}/>
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
