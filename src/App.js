import React, { useState, useMemo, useRef } from "react";

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

// =====================================================
// GANTI INI DENGAN LINK GOOGLE FORM KAMU
// =====================================================
const REQUEST_FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSdL64My24bSHXa_Eupj4jmW9lZZuEHdDiBTqrpTafZsivXoFQ/viewform?usp=header";
// =====================================================

const DEMO=[
  {id:1,title:"Social Media Post - Promo Lebaran",category:"Social Media Post",status:"todo",pic:"Denny",dueDate:"2025-05-14",requestedBy:"Sales Team",description:"Post IG & TikTok untuk promo lebaran",createdDate:"2025-05-01",comments:[{id:1,author:"Denny",text:"Sudah ada brief visual-nya?",time:"2 Mei, 09:15"}],attachments:[]},
  {id:2,title:"Banner Marketplace - Flash Sale",category:"Banner Marketplace",status:"on_progress",pic:"Arum",dueDate:"2025-05-13",requestedBy:"Sales Team",description:"Banner Tokopedia & Shopee 1200x628",createdDate:"2025-05-05",comments:[],attachments:[{id:1,name:"brief_flash_sale.pdf",type:"pdf",size:"240 KB"}]},
  {id:3,title:"Desain Kemasan - Premium Line",category:"Kemasan Baru",status:"finish",pic:"Denny",dueDate:"2025-04-30",requestedBy:"Bidev Team",description:"Packaging produk premium hidroponik",createdDate:"2025-04-20",comments:[{id:1,author:"Arum",text:"Revisi warna sudah sesuai",time:"28 Apr, 14:00"}],attachments:[]},
  {id:4,title:"Template Loker - Desainer Grafis",category:"Poster",status:"request",pic:null,dueDate:"2025-05-20",requestedBy:"HRD",description:"Template posting lowongan untuk IG Stories",createdDate:"2025-05-10",comments:[],attachments:[]}
];

export default function App() {
  const [tasks,setTasks]=useState(DEMO);
  const [view,setView]=useState("kanban");
  const [showRequestModal,setShowRequestModal]=useState(false);
  const [showManualForm,setShowManualForm]=useState(false);
  const [selected,setSelected]=useState(null);
  const [fPIC,setFPIC]=useState("all");
  const [fStatus,setFStatus]=useState("all");
  const [filterMode,setFilterMode]=useState("all");
  const [customFrom,setCustomFrom]=useState("");
  const [customTo,setCustomTo]=useState("");
  const [newComment,setNewComment]=useState("");
  const [commentBy,setCommentBy]=useState("Denny");
  const [emailLog,setEmailLog]=useState([]);
  const [showLog,setShowLog]=useState(false);
  const [exportMsg,setExportMsg]=useState("");
  const [linkCopied,setLinkCopied]=useState(false);
  const detailFileRef=useRef(null);
  const formFileRef=useRef(null);
  const [form,setForm]=useState({title:"",category:"Social Media Post",requestedBy:"Sales Team",description:"",dueDate:"",pic:"",attachments:[]});

  const today=new Date(); today.setHours(0,0,0,0);
  const fmtDate=d=>d?new Date(d).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}):"-";
  const isOverdue=t=>t.status!=="finish"&&t.dueDate&&new Date(t.dueDate)<today;
  const isSoon=t=>{if(!t.dueDate||t.status==="finish")return false;const d=new Date(t.dueDate);d.setHours(0,0,0,0);const diff=(d-today)/86400000;return diff>=0&&diff<=1;};

  const filtered=useMemo(()=>{
    let r=[...tasks];
    if(fPIC!=="all")r=r.filter(t=>t.pic===fPIC);
    if(fStatus!=="all")r=r.filter(t=>t.status===fStatus);
    if(filterMode==="today")r=r.filter(t=>{if(!t.dueDate)return false;const d=new Date(t.dueDate);d.setHours(0,0,0,0);return d.getTime()===today.getTime();});
    else if(filterMode==="week"){const n=new Date(today);n.setDate(n.getDate()+7);r=r.filter(t=>{if(!t.dueDate)return false;const d=new Date(t.dueDate);return d>=today&&d<=n;});}
    else if(filterMode==="month"){const n=new Date(today);n.setMonth(n.getMonth()+1);r=r.filter(t=>{if(!t.dueDate)return false;const d=new Date(t.dueDate);return d>=today&&d<=n;});}
    else if(filterMode==="overdue")r=r.filter(t=>isOverdue(t));
    else if(filterMode==="custom"&&customFrom&&customTo){const from=new Date(customFrom);const to=new Date(customTo);to.setHours(23,59,59);r=r.filter(t=>{if(!t.dueDate)return false;const d=new Date(t.dueDate);return d>=from&&d<=to;});}
    return r.sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));
  },[tasks,fPIC,fStatus,filterMode,customFrom,customTo]);

  const byS=s=>filtered.filter(t=>t.status===s);
  const allByS=s=>tasks.filter(t=>t.status===s);
  const reminders=useMemo(()=>tasks.filter(t=>isSoon(t)),[tasks]);

  const analytics=useMemo(()=>{
    const total=tasks.length,done=tasks.filter(t=>t.status==="finish").length,over=tasks.filter(t=>isOverdue(t)).length;
    const byPIC={};
    DESIGNERS.forEach(d=>{const dt=tasks.filter(t=>t.pic===d);byPIC[d]={total:dt.length,done:dt.filter(t=>t.status==="finish").length,over:dt.filter(t=>isOverdue(t)).length,prog:dt.filter(t=>t.status==="on_progress").length,rate:dt.length>0?Math.round(dt.filter(t=>t.status==="finish").length/dt.length*100):0};});
    return{total,done,over,rate:total>0?Math.round(done/total*100):0,byPIC};
  },[tasks]);

  const triggerEmail=(type,task)=>{
    const msgs={status:`Status Update: "${task.title}" → ${STATUS[task.status]?.label}`,new_task:`Request Baru: "${task.title}" dari ${task.requestedBy}`};
    setEmailLog(prev=>[{id:Date.now(),type,msg:msgs[type],time:new Date().toLocaleTimeString("id-ID")},...prev]);
  };

  const moveTask=(id,ns)=>{
    setTasks(prev=>prev.map(t=>{if(t.id!==id)return t;const u={...t,status:ns};triggerEmail("status",u);return u;}));
    if(selected?.id===id)setSelected(prev=>({...prev,status:ns}));
  };
  const deleteTask=id=>{setTasks(prev=>prev.filter(t=>t.id!==id));if(selected?.id===id)setSelected(null);};

  const copyLink=()=>{
    navigator.clipboard?.writeText(REQUEST_FORM_LINK).catch(()=>{});
    setLinkCopied(true);setTimeout(()=>setLinkCopied(false),2000);
  };

  // Handle file upload on manual form
  const handleFormFiles=e=>{
    const files=Array.from(e.target.files);
    const atts=files.map(f=>({id:Date.now()+Math.random(),name:f.name,type:f.type.startsWith("image/")?"image":f.name.includes(".pdf")?"pdf":"excel",size:f.size>1048576?(f.size/1048576).toFixed(1)+" MB":Math.round(f.size/1024)+" KB",dataUrl:null,file:f}));
    const proc=idx=>{if(idx>=atts.length){setForm(prev=>({...prev,attachments:[...(prev.attachments||[]),...atts]}));return;}if(atts[idx].type==="image"){const r=new FileReader();r.onload=ev=>{atts[idx].dataUrl=ev.target.result;proc(idx+1);};r.readAsDataURL(atts[idx].file);}else proc(idx+1);};proc(0);
  };
  const removeFormAtt=id=>setForm(prev=>({...prev,attachments:prev.attachments.filter(a=>a.id!==id)}));

  const submitForm=e=>{
    e.preventDefault();
    const nt={id:Math.max(0,...tasks.map(t=>t.id))+1,...form,pic:form.pic||null,status:"request",createdDate:new Date().toISOString().split("T")[0],comments:[],attachments:form.attachments||[]};
    setTasks(prev=>[...prev,nt]);triggerEmail("new_task",nt);
    setForm({title:"",category:"Social Media Post",requestedBy:"Sales Team",description:"",dueDate:"",pic:"",attachments:[]});
    setShowManualForm(false);setShowRequestModal(false);
  };

  const addComment=()=>{
    if(!newComment.trim()||!selected)return;
    const c={id:Date.now(),author:commentBy,text:newComment.trim(),time:new Date().toLocaleString("id-ID")};
    const u={...selected,comments:[...(selected.comments||[]),c]};
    setTasks(prev=>prev.map(t=>t.id===u.id?u:t));setSelected(u);setNewComment("");
  };

  const handleDetailFiles=e=>{
    const files=Array.from(e.target.files);if(!selected||!files.length)return;
    const atts=files.map(f=>({id:Date.now()+Math.random(),name:f.name,type:f.type.startsWith("image/")?"image":f.name.includes(".pdf")?"pdf":"excel",size:f.size>1048576?(f.size/1048576).toFixed(1)+" MB":Math.round(f.size/1024)+" KB",dataUrl:null,file:f}));
    const proc=idx=>{if(idx>=atts.length){const u={...selected,attachments:[...(selected.attachments||[]),...atts]};setTasks(prev=>prev.map(t=>t.id===u.id?u:t));setSelected(u);return;}if(atts[idx].type==="image"){const r=new FileReader();r.onload=ev=>{atts[idx].dataUrl=ev.target.result;proc(idx+1);};r.readAsDataURL(atts[idx].file);}else proc(idx+1);};proc(0);
  };
  const removeAtt=aid=>{const u={...selected,attachments:selected.attachments.filter(a=>a.id!==aid)};setTasks(prev=>prev.map(t=>t.id===u.id?u:t));setSelected(u);};

  const exportCSV=()=>{
    const h=["ID","Judul","Kategori","Status","PIC","Due Date","Requester","Komentar","Attachments"];
    const rows=tasks.map(t=>[t.id,t.title,t.category,STATUS[t.status]?.label,t.pic||"-",fmtDate(t.dueDate),t.requestedBy,(t.comments||[]).length,(t.attachments||[]).length]);
    let csv=h.join(",")+"\n";rows.forEach(r=>{csv+=r.map(v=>`"${v}"`).join(",")+"\n";});
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="infarm_tasks.csv";a.click();
    setExportMsg("Export berhasil!");setTimeout(()=>setExportMsg(""),3000);
  };

  const PICAvatar=({name,size=28})=>{const s=PIC_STYLE[name]||PIC_STYLE.Denny;return <div style={{width:size,height:size,borderRadius:"50%",background:s.bg,color:s.text,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.42,fontWeight:"600",flexShrink:0}}>{name?.[0]}</div>;};
  const FileIcon=({type})=>{const ic={image:"ti-photo",pdf:"ti-file-type-pdf",excel:"ti-file-spreadsheet"};return <i className={`ti ${ic[type]||"ti-file"}`} style={{fontSize:"20px",color:"#6b7280"}}/>;};
  const Badge=({status})=>(<span style={{fontSize:"11px",padding:"3px 10px",borderRadius:"20px",background:STATUS[status]?.bg,color:STATUS[status]?.text,fontWeight:"600",border:`1px solid ${STATUS[status]?.border}`,display:"inline-flex",alignItems:"center",gap:"5px"}}><span style={{width:"6px",height:"6px",borderRadius:"50%",background:STATUS[status]?.dot}}/>{STATUS[status]?.label}</span>);

  const TaskCard=({task})=>(
    <div onClick={()=>setSelected(task)} style={{background:"var(--color-background-primary)",borderRadius:"14px",padding:"13px",marginBottom:"10px",cursor:"pointer",transition:"transform .15s",borderLeft:`4px solid ${isOverdue(task)?"#ef4444":isSoon(task)?"#f59e0b":STATUS[task.status]?.dot}`,border:`1px solid ${isOverdue(task)?"#fecaca":"var(--color-border-tertiary)"}`,borderLeftWidth:"4px"}}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
    >
      <div style={{display:"flex",justifyContent:"space-between",gap:"8px",marginBottom:"8px"}}>
        <p style={{margin:0,fontSize:"13px",fontWeight:"500",flex:1,lineHeight:"1.4",color:"var(--color-text-primary)"}}>{task.title}</p>
        <button onClick={e=>{e.stopPropagation();deleteTask(task.id);}} style={{background:"transparent",border:"none",cursor:"pointer",padding:"2px",color:"var(--color-text-danger)",flexShrink:0}}><i className="ti ti-trash" style={{fontSize:"14px"}}/></button>
      </div>
      <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"8px"}}>
        <span style={{fontSize:"10px",background:G[50],color:G[700],padding:"2px 8px",borderRadius:"20px",border:`1px solid ${G[100]}`}}>{task.category}</span>
        {isOverdue(task)&&<span style={{fontSize:"10px",background:"#fee2e2",color:"#991b1b",padding:"2px 8px",borderRadius:"20px",fontWeight:"600"}}>Overdue</span>}
        {isSoon(task)&&!isOverdue(task)&&<span style={{fontSize:"10px",background:"#fef3c7",color:"#78350f",padding:"2px 8px",borderRadius:"20px",fontWeight:"600"}}>Besok!</span>}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:"11px",color:isOverdue(task)?"#ef4444":isSoon(task)?"#f59e0b":"var(--color-text-secondary)",display:"flex",alignItems:"center",gap:"4px"}}>
          <i className="ti ti-calendar" style={{fontSize:"12px"}}/>{fmtDate(task.dueDate)}
        </span>
        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
          {task.pic&&<PICAvatar name={task.pic} size={20}/>}
          {(task.comments||[]).length>0&&<span style={{fontSize:"10px",color:"var(--color-text-secondary)",display:"flex",alignItems:"center",gap:"2px"}}><i className="ti ti-message" style={{fontSize:"11px"}}/>{task.comments.length}</span>}
          {(task.attachments||[]).length>0&&<span style={{fontSize:"10px",color:"var(--color-text-secondary)",display:"flex",alignItems:"center",gap:"2px"}}><i className="ti ti-paperclip" style={{fontSize:"11px"}}/>{task.attachments.length}</span>}
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

  const cols=[
    {key:"request",label:"Request",dot:"#f59e0b",hbg:"#fffbeb"},
    {key:"todo",label:"Todo",dot:"#7c3aed",hbg:"#faf5ff"},
    {key:"on_progress",label:"On Progress",dot:"#2563eb",hbg:"#eff6ff"},
    {key:"finish",label:"Finish",dot:"#059669",hbg:"#ecfdf5"},
  ];

  const inputStyle={width:"100%",boxSizing:"border-box",borderRadius:"10px",border:"1px solid #e5e7eb",padding:"8px 12px",fontSize:"13px",background:"#fff"};

  return (
    <div style={{fontFamily:"system-ui,sans-serif",background:"#f7f9f7",minHeight:"100vh"}}>

      {/* ── HEADER ── */}
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
                <path d="M27 82 Q50 68 73 82" stroke="#60a5fa" strokeWidth="3.5" fill="none"/>
              </svg>
            </div>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                <h1 style={{margin:0,fontSize:"19px",fontWeight:"600",color:"#fff",letterSpacing:"-0.2px"}}>Design Task Manager</h1>
                <span style={{fontSize:"10px",background:"rgba(255,255,255,0.18)",color:"#fff",padding:"2px 8px",borderRadius:"20px",border:"1px solid rgba(255,255,255,0.25)"}}>INFARM.ID</span>
              </div>
              <p style={{margin:0,fontSize:"12px",color:"rgba(255,255,255,0.65)"}}>Tim Desain Internal · Denny & Arum</p>
            </div>
          </div>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            <button onClick={()=>setShowLog(!showLog)} style={{fontSize:"12px",padding:"6px 12px",background:"rgba(255,255,255,0.12)",color:"#fff",border:"1px solid rgba(255,255,255,0.25)",borderRadius:"20px",cursor:"pointer",display:"flex",alignItems:"center",gap:"5px"}}>
              <i className="ti ti-bell" style={{fontSize:"13px"}}/>
              {emailLog.length>0&&<span style={{background:"#ef4444",color:"#fff",fontSize:"10px",padding:"1px 5px",borderRadius:"10px",fontWeight:"700"}}>{emailLog.length}</span>}
            </button>
            <button onClick={exportCSV} style={{fontSize:"12px",padding:"6px 12px",background:"rgba(255,255,255,0.12)",color:"#fff",border:"1px solid rgba(255,255,255,0.25)",borderRadius:"20px",cursor:"pointer",display:"flex",alignItems:"center",gap:"5px"}}>
              <i className="ti ti-download" style={{fontSize:"13px"}}/>Export
            </button>
            <button onClick={()=>setShowRequestModal(true)} style={{fontSize:"12px",padding:"6px 14px",background:"#fff",color:G[700],border:"none",borderRadius:"20px",cursor:"pointer",fontWeight:"600",display:"flex",alignItems:"center",gap:"5px"}}>
              <i className="ti ti-send" style={{fontSize:"13px"}}/>Request Desain
            </button>
          </div>
        </div>
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

        {/* ── MODAL: REQUEST DESAIN ── */}
        {showRequestModal&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
            <div style={{background:"#fff",borderRadius:"20px",padding:"24px",width:"min(480px,92vw)",maxHeight:"90vh",overflowY:"auto",border:"1px solid #e5e7eb"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}}>
                <h3 style={{margin:0,fontSize:"16px",fontWeight:"600",color:"#111827"}}>Request Desain</h3>
                <button onClick={()=>{setShowRequestModal(false);setShowManualForm(false);}} style={{background:"#f3f4f6",border:"none",cursor:"pointer",width:"30px",height:"30px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#6b7280"}}><i className="ti ti-x" style={{fontSize:"14px"}}/></button>
              </div>

              {!showManualForm ? (
                <>
                  {/* Info card */}
                  <div style={{background:G[50],borderRadius:"12px",padding:"14px",marginBottom:"16px",border:`1px solid ${G[100]}`}}>
                    <p style={{margin:"0 0 6px 0",fontSize:"13px",color:G[700],fontWeight:"600",display:"flex",alignItems:"center",gap:"6px"}}>
                      <i className="ti ti-info-circle" style={{fontSize:"16px"}}/>Cara Request Desain ke Tim Infarm
                    </p>
                    <p style={{margin:0,fontSize:"12px",color:G[600],lineHeight:"1.7"}}>
                      Share link Google Form di bawah ke tim yang butuh desain. Setelah form diisi, tim desain akan otomatis mendapat notifikasi dan task akan masuk ke board.
                    </p>
                  </div>

                  {/* Link Google Form */}
                  <div style={{marginBottom:"16px"}}>
                    <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"6px",color:"#374151"}}>Link Form Request Desain</label>
                    <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                      <div style={{flex:1,background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:"10px",padding:"9px 12px",fontSize:"12px",color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {REQUEST_FORM_LINK}
                      </div>
                      <button onClick={copyLink} style={{padding:"9px 14px",background:linkCopied?G[50]:G[600],color:linkCopied?G[700]:"#fff",border:`1px solid ${linkCopied?G[200]:"transparent"}`,borderRadius:"10px",cursor:"pointer",fontSize:"12px",fontWeight:"600",flexShrink:0,display:"flex",alignItems:"center",gap:"5px",transition:"all .2s"}}>
                        <i className={`ti ${linkCopied?"ti-check":"ti-copy"}`} style={{fontSize:"13px"}}/>
                        {linkCopied?"Copied!":"Copy Link"}
                      </button>
                    </div>
                  </div>

                  {/* Share options */}
                  <div style={{marginBottom:"20px"}}>
                    <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"8px",color:"#374151"}}>Share ke Tim via</label>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px"}}>
                      {[
                        {ic:"ti-brand-whatsapp",label:"WhatsApp",color:"#25d366",bg:"#f0fdf4",border:"#bbf7d0"},
                        {ic:"ti-mail",label:"Email",color:"#2563eb",bg:"#eff6ff",border:"#bfdbfe"},
                        {ic:"ti-external-link",label:"Buka Form",color:G[600],bg:G[50],border:G[200]},
                      ].map(s=>(
                        <button key={s.label} style={{padding:"12px 8px",background:s.bg,border:`1px solid ${s.border}`,borderRadius:"12px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}>
                          <i className={`ti ${s.ic}`} style={{fontSize:"22px",color:s.color}}/>
                          <span style={{fontSize:"11px",color:s.color,fontWeight:"600"}}>{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{borderTop:"1px solid #f3f4f6",paddingTop:"14px"}}>
                    <p style={{margin:"0 0 8px 0",fontSize:"12px",color:"#6b7280"}}>Tim desain bisa juga input task langsung:</p>
                    <button onClick={()=>setShowManualForm(true)} style={{width:"100%",padding:"10px",background:`linear-gradient(135deg,${G[800]},${G[500]})`,color:"#fff",border:"none",borderRadius:"12px",cursor:"pointer",fontSize:"13px",fontWeight:"600",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>
                      <i className="ti ti-plus" style={{fontSize:"14px"}}/>Input Task Manual
                    </button>
                  </div>
                </>
              ) : (
                /* ── MANUAL FORM dengan attachment ── */
                <form onSubmit={submitForm}>
                  <button type="button" onClick={()=>setShowManualForm(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:"12px",color:G[600],marginBottom:"14px",display:"flex",alignItems:"center",gap:"4px",padding:0}}>
                    <i className="ti ti-arrow-left" style={{fontSize:"13px"}}/>Kembali
                  </button>

                  <div style={{display:"grid",gap:"12px",marginBottom:"12px"}}>
                    <div>
                      <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#374151"}}>Judul Request *</label>
                      <input type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Contoh: Banner Flash Sale Tokopedia" required style={inputStyle}/>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                      <div>
                        <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#374151"}}>Kategori *</label>
                        <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={inputStyle}>
                          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#374151"}}>Deadline *</label>
                        <input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} required style={inputStyle}/>
                      </div>
                      <div>
                        <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#374151"}}>Di-request Oleh *</label>
                        <select value={form.requestedBy} onChange={e=>setForm({...form,requestedBy:e.target.value})} style={inputStyle}>
                          {REQUESTER_LIST.map(r=><option key={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#374151"}}>Assign PIC</label>
                        <select value={form.pic} onChange={e=>setForm({...form,pic:e.target.value==="Belum assign"?"":e.target.value})} style={inputStyle}>
                          <option value="">Belum assign</option>
                          {DESIGNERS.map(d=><option key={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#374151"}}>Deskripsi / Brief</label>
                      <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Jelaskan kebutuhan desain, ukuran, tone, referensi, dll..." style={{...inputStyle,minHeight:"75px",resize:"vertical"}}/>
                    </div>

                    {/* Attachment di form */}
                    <div>
                      <label style={{display:"block",fontSize:"12px",fontWeight:"600",marginBottom:"5px",color:"#374151"}}>
                        Attachment Referensi
                        <span style={{fontWeight:"400",color:"#9ca3af",marginLeft:"6px"}}>— gambar, PDF, brief, dll</span>
                      </label>
                      <div style={{border:`2px dashed ${G[200]}`,borderRadius:"12px",padding:"14px",background:G[50],cursor:"pointer"}} onClick={()=>formFileRef.current?.click()}>
                        {(form.attachments||[]).length===0 ? (
                          <div style={{textAlign:"center"}}>
                            <i className="ti ti-upload" style={{fontSize:"22px",color:G[300],display:"block",marginBottom:"4px"}}/>
                            <p style={{margin:0,fontSize:"12px",color:G[500]}}>Klik untuk upload gambar, PDF, atau Excel</p>
                          </div>
                        ) : (
                          <div>
                            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:"7px",marginBottom:"8px"}}>
                              {form.attachments.map(att=>(
                                <div key={att.id} style={{background:"#fff",borderRadius:"10px",padding:"8px",position:"relative",border:"1px solid #e5e7eb"}}>
                                  <button type="button" onClick={e=>{e.stopPropagation();removeFormAtt(att.id);}} style={{position:"absolute",top:"4px",right:"4px",background:"rgba(239,68,68,0.1)",border:"none",cursor:"pointer",width:"17px",height:"17px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#ef4444",padding:0}}><i className="ti ti-x" style={{fontSize:"10px"}}/></button>
                                  {att.type==="image"&&att.dataUrl?<img src={att.dataUrl} alt={att.name} style={{width:"100%",height:"55px",objectFit:"cover",borderRadius:"7px",display:"block",marginBottom:"4px"}}/>:<div style={{width:"100%",height:"42px",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"4px"}}><i className={`ti ${att.type==="pdf"?"ti-file-type-pdf":att.type==="excel"?"ti-file-spreadsheet":"ti-file"}`} style={{fontSize:"22px",color:"#6b7280"}}/></div>}
                                  <p style={{margin:0,fontSize:"10px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"#374151",paddingRight:"12px"}}>{att.name}</p>
                                  <p style={{margin:0,fontSize:"10px",color:"#9ca3af"}}>{att.size}</p>
                                </div>
                              ))}
                            </div>
                            <p style={{margin:0,fontSize:"11px",color:G[600],textAlign:"center"}}>+ Klik untuk tambah file lagi</p>
                          </div>
                        )}
                      </div>
                      <input ref={formFileRef} type="file" multiple accept="image/*,.pdf,.xlsx,.xls,.csv" style={{display:"none"}} onChange={handleFormFiles}/>
                    </div>
                  </div>

                  <div style={{display:"flex",gap:"8px"}}>
                    <button type="submit" style={{flex:1,padding:"10px",background:`linear-gradient(135deg,${G[800]},${G[500]})`,color:"#fff",border:"none",borderRadius:"12px",cursor:"pointer",fontSize:"13px",fontWeight:"600",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>
                      <i className="ti ti-check" style={{fontSize:"14px"}}/>Kirim Request
                    </button>
                    <button type="button" onClick={()=>{setShowManualForm(false);setShowRequestModal(false);}} style={{padding:"10px 16px",background:"#f3f4f6",color:"#374151",border:"none",borderRadius:"12px",cursor:"pointer",fontSize:"13px"}}>Batal</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Email Log */}
        {showLog&&(
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"14px",marginBottom:"14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
              <h3 style={{margin:0,fontSize:"14px",fontWeight:"600",color:"#111827"}}>Log Notifikasi Email</h3>
              <button onClick={()=>setShowLog(false)} style={{background:"#f3f4f6",border:"none",cursor:"pointer",width:"26px",height:"26px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ti ti-x" style={{fontSize:"13px"}}/></button>
            </div>
            {emailLog.length===0?<p style={{margin:0,fontSize:"13px",color:"#9ca3af",textAlign:"center",padding:"16px"}}>Belum ada notifikasi.</p>
            :emailLog.map(e=>(
              <div key={e.id} style={{display:"flex",gap:"8px",alignItems:"start",padding:"8px 0",borderBottom:"1px solid #f9fafb"}}>
                <div style={{width:"28px",height:"28px",borderRadius:"8px",background:G[50],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><i className="ti ti-send" style={{fontSize:"13px",color:G[500]}}/></div>
                <div style={{flex:1}}><p style={{margin:"0 0 2px 0",fontSize:"12px",color:"#374151"}}>{e.msg}</p><span style={{fontSize:"11px",color:"#9ca3af"}}>{e.time}</span></div>
                <span style={{fontSize:"10px",background:G[50],color:G[700],padding:"2px 7px",borderRadius:"20px",border:`1px solid ${G[100]}`}}>Terkirim</span>
              </div>
            ))}
          </div>
        )}

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

        {/* ── FILTER BAR ── */}
        {view!=="analytics"&&(
          <div style={{background:"#f9fafb",borderRadius:"12px",padding:"12px 14px",marginBottom:"14px",border:"1px solid #e5e7eb"}}>
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center",marginBottom:filterMode==="custom"?"10px":"0"}}>
              <span style={{fontSize:"12px",color:"#6b7280",fontWeight:"500"}}>Filter:</span>
              <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={{fontSize:"12px",padding:"5px 10px",borderRadius:"20px",border:`1px solid ${fStatus!=="all"?G[300]:"#e5e7eb"}`,background:fStatus!=="all"?G[50]:"#fff",cursor:"pointer"}}>
                <option value="all">Semua Status</option>
                {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </select>
              <select value={fPIC} onChange={e=>setFPIC(e.target.value)} style={{fontSize:"12px",padding:"5px 10px",borderRadius:"20px",border:`1px solid ${fPIC!=="all"?G[300]:"#e5e7eb"}`,background:fPIC!=="all"?G[50]:"#fff",cursor:"pointer"}}>
                <option value="all">Semua PIC</option>
                {DESIGNERS.map(d=><option key={d}>{d}</option>)}
              </select>
              <select value={filterMode} onChange={e=>setFilterMode(e.target.value)} style={{fontSize:"12px",padding:"5px 10px",borderRadius:"20px",border:`1px solid ${filterMode!=="all"?G[300]:"#e5e7eb"}`,background:filterMode!=="all"?G[50]:"#fff",cursor:"pointer"}}>
                <option value="all">Semua Tanggal</option>
                <option value="today">Hari Ini</option>
                <option value="week">Minggu Ini (7 hari ke depan)</option>
                <option value="month">Bulan Ini (30 hari ke depan)</option>
                <option value="overdue">Overdue</option>
                <option value="custom">Custom Range...</option>
              </select>
              {(fStatus!=="all"||fPIC!=="all"||filterMode!=="all")&&(
                <button onClick={()=>{setFStatus("all");setFPIC("all");setFilterMode("all");setCustomFrom("");setCustomTo("");}} style={{fontSize:"11px",padding:"4px 10px",background:"#fff",border:"1px solid #e5e7eb",borderRadius:"20px",cursor:"pointer",color:"#6b7280",display:"flex",alignItems:"center",gap:"4px"}}>
                  <i className="ti ti-x" style={{fontSize:"11px"}}/>Reset
                </button>
              )}
            </div>
            {filterMode==="custom"&&(
              <div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap",paddingTop:"10px",borderTop:"1px solid #e5e7eb"}}>
                <span style={{fontSize:"12px",color:"#6b7280",fontWeight:"500"}}>Dari:</span>
                <input type="date" value={customFrom} onChange={e=>setCustomFrom(e.target.value)} style={{fontSize:"12px",padding:"5px 10px",borderRadius:"10px",border:"1px solid #e5e7eb",background:"#fff"}}/>
                <span style={{fontSize:"12px",color:"#6b7280",fontWeight:"500"}}>Sampai:</span>
                <input type="date" value={customTo} onChange={e=>setCustomTo(e.target.value)} style={{fontSize:"12px",padding:"5px 10px",borderRadius:"10px",border:"1px solid #e5e7eb",background:"#fff"}}/>
                {customFrom&&customTo&&(
                  <span style={{fontSize:"11px",background:G[50],color:G[700],padding:"3px 9px",borderRadius:"20px",border:`1px solid ${G[100]}`,fontWeight:"600"}}>
                    {filtered.length} task ditemukan
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── KANBAN ── */}
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

        {/* ── LIST ── */}
        {view==="list"&&(
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:"16px",overflow:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:"12px",tableLayout:"fixed"}}>
              <colgroup><col style={{width:"30%"}}/><col style={{width:"15%"}}/><col style={{width:"9%"}}/><col style={{width:"12%"}}/><col style={{width:"13%"}}/><col style={{width:"7%"}}/><col style={{width:"7%"}}/></colgroup>
              <thead>
                <tr style={{background:`linear-gradient(135deg,${G[800]},${G[500]})`}}>
                  {["Judul","Kategori","PIC","Deadline","Status","💬","📎"].map(h=><th key={h} style={{padding:"11px 10px",textAlign:"left",fontWeight:"600",fontSize:"12px",color:"rgba(255,255,255,0.9)"}}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((task,i)=>(
                  <tr key={task.id} onClick={()=>setSelected(task)} style={{borderBottom:"1px solid #f3f4f6",cursor:"pointer",background:i%2===0?"#fff":"#fafafa"}}
                    onMouseEnter={e=>e.currentTarget.style.background=G[50]}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"#fff":"#fafafa"}>
                    <td style={{padding:"10px",fontWeight:"500",color:"#111827",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.title}</td>
                    <td style={{padding:"10px"}}><span style={{fontSize:"10px",background:G[50],color:G[700],padding:"2px 7px",borderRadius:"20px",border:`1px solid ${G[100]}`}}>{task.category}</span></td>
                    <td style={{padding:"10px"}}>{task.pic?<PICAvatar name={task.pic} size={22}/>:<span style={{color:"#9ca3af"}}>—</span>}</td>
                    <td style={{padding:"10px",fontSize:"11px",color:isOverdue(task)?"#ef4444":isSoon(task)?"#f59e0b":"#6b7280",fontWeight:isOverdue(task)||isSoon(task)?"600":"400"}}>{fmtDate(task.dueDate)}</td>
                    <td style={{padding:"10px"}}><Badge status={task.status}/></td>
                    <td style={{padding:"10px",textAlign:"center",color:"#9ca3af"}}>{(task.comments||[]).length}</td>
                    <td style={{padding:"10px",textAlign:"center",color:"#9ca3af"}}>{(task.attachments||[]).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── ANALYTICS ── */}
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
                const p=analytics.byPIC[d];
                const isArum=d==="Arum";
                const accent=isArum?"#db2777":G[500];
                const aLight=isArum?"#fdf2f8":G[50];
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

        {/* ── DETAIL PANEL ── */}
        {selected&&(
          <div style={{marginTop:"18px",background:"#fff",border:`2px solid ${G[100]}`,borderRadius:"20px",padding:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:"14px"}}>
              <div style={{flex:1,marginRight:"10px"}}>
                <h2 style={{margin:"0 0 8px 0",fontSize:"16px",fontWeight:"600",color:"#111827",lineHeight:"1.4"}}>{selected.title}</h2>
                <div style={{display:"flex",gap:"5px",flexWrap:"wrap",alignItems:"center"}}>
                  <Badge status={selected.status}/>
                  <span style={{fontSize:"10px",background:G[50],color:G[700],padding:"2px 8px",borderRadius:"20px",border:`1px solid ${G[100]}`}}>{selected.category}</span>
                  {selected.pic&&<PICAvatar name={selected.pic} size={22}/>}
                  {isOverdue(selected)&&<span style={{fontSize:"10px",background:"#fee2e2",color:"#991b1b",padding:"2px 8px",borderRadius:"20px",fontWeight:"600"}}>Overdue</span>}
                </div>
              </div>
              <button onClick={()=>setSelected(null)} style={{background:"#f3f4f6",border:"none",cursor:"pointer",width:"30px",height:"30px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><i className="ti ti-x" style={{fontSize:"14px"}}/></button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:"7px",marginBottom:"14px"}}>
              {[["Requester",selected.requestedBy],["Deadline",fmtDate(selected.dueDate)],["Dibuat",fmtDate(selected.createdDate)],["PIC",selected.pic||"Belum assign"]].map(([l,v])=>(
                <div key={l} style={{background:G[50],padding:"9px 11px",borderRadius:"10px",border:`1px solid ${G[100]}`}}>
                  <p style={{margin:"0 0 2px 0",fontSize:"10px",color:G[600]}}>{l}</p>
                  <p style={{margin:0,fontSize:"12px",fontWeight:"600",color:G[800]}}>{v}</p>
                </div>
              ))}
            </div>
            {selected.description&&<div style={{marginBottom:"14px",background:"#f9fafb",padding:"11px 13px",borderRadius:"10px",border:"1px solid #e5e7eb"}}><p style={{margin:"0 0 3px 0",fontSize:"10px",color:"#6b7280",fontWeight:"600"}}>DESKRIPSI</p><p style={{margin:0,fontSize:"13px",lineHeight:"1.6",color:"#374151"}}>{selected.description}</p></div>}
            {selected.status!=="request"&&(
              <div style={{marginBottom:"14px"}}>
                <p style={{margin:"0 0 7px 0",fontSize:"11px",color:"#6b7280",fontWeight:"600"}}>PINDAH STATUS</p>
                <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
                  {Object.entries(STATUS).filter(([k])=>k!=="request"&&k!==selected.status).map(([k,m])=>(
                    <button key={k} onClick={()=>moveTask(selected.id,k)} style={{fontSize:"12px",padding:"5px 13px",background:m.bg,color:m.text,border:`1px solid ${m.border}`,borderRadius:"20px",cursor:"pointer",fontWeight:"500"}}>→ {m.label}</button>
                  ))}
                </div>
              </div>
            )}
            {/* Attachments detail */}
            <div style={{marginBottom:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                <p style={{margin:0,fontSize:"13px",fontWeight:"600",color:"#111827",display:"flex",alignItems:"center",gap:"5px"}}>
                  <i className="ti ti-paperclip" style={{fontSize:"14px",color:G[500],verticalAlign:"-2px"}}/>Attachment
                  <span style={{background:G[100],color:G[700],fontSize:"10px",padding:"1px 6px",borderRadius:"20px",marginLeft:"2px"}}>{(selected.attachments||[]).length}</span>
                </p>
                <button onClick={()=>detailFileRef.current?.click()} style={{fontSize:"11px",padding:"4px 11px",background:G[50],color:G[700],border:`1px solid ${G[200]}`,borderRadius:"20px",cursor:"pointer",display:"flex",alignItems:"center",gap:"4px"}}><i className="ti ti-upload" style={{fontSize:"12px"}}/>Upload</button>
                <input ref={detailFileRef} type="file" multiple accept="image/*,.pdf,.xlsx,.xls,.csv" style={{display:"none"}} onChange={handleDetailFiles}/>
              </div>
              {(selected.attachments||[]).length===0
                ?<div onClick={()=>detailFileRef.current?.click()} style={{border:`2px dashed ${G[200]}`,borderRadius:"12px",padding:"20px",textAlign:"center",cursor:"pointer",background:G[50]}}><i className="ti ti-upload" style={{fontSize:"20px",color:G[300],display:"block",marginBottom:"4px"}}/><p style={{margin:0,fontSize:"12px",color:G[500]}}>Klik untuk upload</p></div>
                :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:"7px"}}>
                  {selected.attachments.map(att=>(
                    <div key={att.id} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:"12px",padding:"9px",position:"relative"}}>
                      <button onClick={()=>removeAtt(att.id)} style={{position:"absolute",top:"5px",right:"5px",background:"rgba(239,68,68,0.1)",border:"none",cursor:"pointer",width:"18px",height:"18px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#ef4444",padding:0}}><i className="ti ti-x" style={{fontSize:"11px"}}/></button>
                      {att.type==="image"&&att.dataUrl?<img src={att.dataUrl} alt={att.name} style={{width:"100%",height:"60px",objectFit:"cover",borderRadius:"7px",marginBottom:"5px",display:"block"}}/>:<div style={{width:"100%",height:"50px",background:"#fff",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"5px"}}><FileIcon type={att.type}/></div>}
                      <p style={{margin:"0 0 1px 0",fontSize:"10px",fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:"12px",color:"#374151"}}>{att.name}</p>
                      <p style={{margin:0,fontSize:"10px",color:"#9ca3af"}}>{att.size}</p>
                    </div>
                  ))}
                </div>
              }
            </div>
            {/* Comments */}
            <div>
              <p style={{margin:"0 0 10px 0",fontSize:"13px",fontWeight:"600",color:"#111827",display:"flex",alignItems:"center",gap:"5px"}}>
                <i className="ti ti-message" style={{fontSize:"14px",color:G[500],verticalAlign:"-2px"}}/>Komentar
                <span style={{background:G[100],color:G[700],fontSize:"10px",padding:"1px 6px",borderRadius:"20px",marginLeft:"2px"}}>{(selected.comments||[]).length}</span>
              </p>
              {(selected.comments||[]).map(c=>(
                <div key={c.id} style={{display:"flex",gap:"8px",marginBottom:"10px"}}>
                  <PICAvatar name={c.author} size={30}/>
                  <div style={{flex:1,background:"#f9fafb",borderRadius:"12px",padding:"9px 12px",border:"1px solid #f3f4f6"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}><span style={{fontSize:"12px",fontWeight:"600",color:"#111827"}}>{c.author}</span><span style={{fontSize:"11px",color:"#9ca3af"}}>{c.time}</span></div>
                    <p style={{margin:0,fontSize:"12px",lineHeight:"1.5",color:"#374151"}}>{c.text}</p>
                  </div>
                </div>
              ))}
              <div style={{display:"flex",gap:"7px",marginTop:"10px",alignItems:"end"}}>
                <select value={commentBy} onChange={e=>setCommentBy(e.target.value)} style={{width:"95px",flexShrink:0,fontSize:"12px",borderRadius:"20px",padding:"7px 9px",border:"1px solid #e5e7eb"}}>
                  {DESIGNERS.map(d=><option key={d}>{d}</option>)}
                </select>
                <textarea value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Tulis komentar... (Ctrl+Enter untuk kirim)" style={{flex:1,minHeight:"56px",fontSize:"12px",boxSizing:"border-box",borderRadius:"12px",resize:"vertical",padding:"8px 10px",border:"1px solid #e5e7eb"}} onKeyDown={e=>{if(e.key==="Enter"&&e.ctrlKey)addComment();}}/>
                <button onClick={addComment} style={{padding:"9px 14px",background:`linear-gradient(135deg,${G[800]},${G[500]})`,color:"#fff",border:"none",borderRadius:"12px",cursor:"pointer",flexShrink:0}}>
                  <i className="ti ti-send" style={{fontSize:"15px"}}/>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
