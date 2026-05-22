import { useState, useEffect, useCallback, useMemo, useRef } from "react";

const PRECO_PACOTE = 7;
const TOTAL_OFICIAL = 993; // 48×20 + 19 FWC + 14 CC

const SELECOES = [
  { id:"AFS", nome:"África do Sul",   grupo:"A", cor1:"#007A4D", cor2:"#FFB612", bandeira:"🇿🇦" },
  { id:"KOR", nome:"Coreia do Sul",   grupo:"A", cor1:"#C60C30", cor2:"#FFFFFF", bandeira:"🇰🇷" },
  { id:"MEX", nome:"México",           grupo:"A", cor1:"#006847", cor2:"#CE1126", bandeira:"🇲🇽" },
  { id:"CZE", nome:"Rep. Tcheca",      grupo:"A", cor1:"#D7141A", cor2:"#FFFFFF", bandeira:"🇨🇿" },
  { id:"BIH", nome:"Bósnia e Herz.",  grupo:"B", cor1:"#002395", cor2:"#F7C948", bandeira:"🇧🇦" },
  { id:"CAN", nome:"Canadá",           grupo:"B", cor1:"#FF0000", cor2:"#FFFFFF", bandeira:"🇨🇦" },
  { id:"QAT", nome:"Catar",            grupo:"B", cor1:"#8D1B3D", cor2:"#FFFFFF", bandeira:"🇶🇦" },
  { id:"SUI", nome:"Suíça",            grupo:"B", cor1:"#FF0000", cor2:"#FFFFFF", bandeira:"🇨🇭" },
  { id:"BRA", nome:"Brasil",           grupo:"C", cor1:"#009C3B", cor2:"#FFDF00", bandeira:"🇧🇷" },
  { id:"SCO", nome:"Escócia",          grupo:"C", cor1:"#003DA5", cor2:"#FFFFFF", bandeira:"🏴" },
  { id:"HAI", nome:"Haiti",            grupo:"C", cor1:"#00209F", cor2:"#D21034", bandeira:"🇭🇹" },
  { id:"MAR", nome:"Marrocos",         grupo:"C", cor1:"#C1272D", cor2:"#006233", bandeira:"🇲🇦" },
  { id:"AUS", nome:"Austrália",        grupo:"D", cor1:"#00843D", cor2:"#FFCD00", bandeira:"🇦🇺" },
  { id:"USA", nome:"Estados Unidos",   grupo:"D", cor1:"#002868", cor2:"#BF0A30", bandeira:"🇺🇸" },
  { id:"PAR", nome:"Paraguai",         grupo:"D", cor1:"#D52B1E", cor2:"#0038A8", bandeira:"🇵🇾" },
  { id:"TUR", nome:"Turquia",          grupo:"D", cor1:"#E30A17", cor2:"#FFFFFF", bandeira:"🇹🇷" },
  { id:"GER", nome:"Alemanha",         grupo:"E", cor1:"#222222", cor2:"#DD0000", bandeira:"🇩🇪" },
  { id:"CIV", nome:"Costa do Marfim", grupo:"E", cor1:"#F77F00", cor2:"#009A44", bandeira:"🇨🇮" },
  { id:"CUW", nome:"Curaçao",          grupo:"E", cor1:"#002B7F", cor2:"#F9E814", bandeira:"🇨🇼" },
  { id:"ECU", nome:"Equador",          grupo:"E", cor1:"#FFD100", cor2:"#003DA5", bandeira:"🇪🇨" },
  { id:"NED", nome:"Holanda",          grupo:"F", cor1:"#FF4F00", cor2:"#FFFFFF", bandeira:"🇳🇱" },
  { id:"JPN", nome:"Japão",            grupo:"F", cor1:"#BC002D", cor2:"#FFFFFF", bandeira:"🇯🇵" },
  { id:"SWE", nome:"Suécia",           grupo:"F", cor1:"#006AA7", cor2:"#FECC02", bandeira:"🇸🇪" },
  { id:"TUN", nome:"Tunísia",          grupo:"F", cor1:"#E70013", cor2:"#FFFFFF", bandeira:"🇹🇳" },
  { id:"BEL", nome:"Bélgica",          grupo:"G", cor1:"#1a1a1a", cor2:"#EF3340", bandeira:"🇧🇪" },
  { id:"EGY", nome:"Egito",            grupo:"G", cor1:"#CE1126", cor2:"#000000", bandeira:"🇪🇬" },
  { id:"IRN", nome:"Irã",              grupo:"G", cor1:"#239F40", cor2:"#FFFFFF", bandeira:"🇮🇷" },
  { id:"NZL", nome:"Nova Zelândia",    grupo:"G", cor1:"#00247D", cor2:"#FFFFFF", bandeira:"🇳🇿" },
  { id:"KSA", nome:"Arábia Saudita",   grupo:"H", cor1:"#006C35", cor2:"#FFFFFF", bandeira:"🇸🇦" },
  { id:"CPV", nome:"Cabo Verde",       grupo:"H", cor1:"#003893", cor2:"#CF2027", bandeira:"🇨🇻" },
  { id:"ESP", nome:"Espanha",          grupo:"H", cor1:"#AA151B", cor2:"#F1BF00", bandeira:"🇪🇸" },
  { id:"URU", nome:"Uruguai",          grupo:"H", cor1:"#75AADB", cor2:"#FFFFFF", bandeira:"🇺🇾" },
  { id:"FRA", nome:"França",           grupo:"I", cor1:"#002395", cor2:"#ED2939", bandeira:"🇫🇷" },
  { id:"IRQ", nome:"Iraque",           grupo:"I", cor1:"#CE1126", cor2:"#007A3D", bandeira:"🇮🇶" },
  { id:"NOR", nome:"Noruega",          grupo:"I", cor1:"#EF2B2D", cor2:"#003087", bandeira:"🇳🇴" },
  { id:"SEN", nome:"Senegal",          grupo:"I", cor1:"#00853F", cor2:"#FDEF42", bandeira:"🇸🇳" },
  { id:"ALG", nome:"Argélia",          grupo:"J", cor1:"#006233", cor2:"#FFFFFF", bandeira:"🇩🇿" },
  { id:"ARG", nome:"Argentina",        grupo:"J", cor1:"#74ACDF", cor2:"#FFFFFF", bandeira:"🇦🇷" },
  { id:"AUT", nome:"Áustria",          grupo:"J", cor1:"#ED2939", cor2:"#FFFFFF", bandeira:"🇦🇹" },
  { id:"JOR", nome:"Jordânia",         grupo:"J", cor1:"#007A3D", cor2:"#CE1126", bandeira:"🇯🇴" },
  { id:"COL", nome:"Colômbia",         grupo:"K", cor1:"#FCD116", cor2:"#003087", bandeira:"🇨🇴" },
  { id:"POR", nome:"Portugal",         grupo:"K", cor1:"#006600", cor2:"#FF0000", bandeira:"🇵🇹" },
  { id:"COD", nome:"RD Congo",         grupo:"K", cor1:"#007FFF", cor2:"#CE1126", bandeira:"🇨🇩" },
  { id:"UZB", nome:"Uzbequistão",      grupo:"K", cor1:"#1EB53A", cor2:"#CE1126", bandeira:"🇺🇿" },
  { id:"CRO", nome:"Croácia",          grupo:"L", cor1:"#FF0000", cor2:"#FFFFFF", bandeira:"🇭🇷" },
  { id:"GHA", nome:"Gana",             grupo:"L", cor1:"#006B3F", cor2:"#FCD116", bandeira:"🇬🇭" },
  { id:"ENG", nome:"Inglaterra",       grupo:"L", cor1:"#FFFFFF", cor2:"#CF081F", bandeira:"🏴" },
  { id:"PAN", nome:"Panamá",           grupo:"L", cor1:"#FFFFFF", cor2:"#D21034", bandeira:"🇵🇦" },
];

const FWC_ITEMS = Array.from({length:19},(_,i)=>({
  id:`FWC-${i+1}`,
  nome:["Emblema Oficial","Mascote Maple","Mascote Zayu","Mascote Clutch","Slogan Oficial",
        "Bola Trionda","Emblema Canadá","Emblema México","Emblema EUA",
        "Momento Histórico 1","Momento Histórico 2","Momento Histórico 3","Momento Histórico 4",
        "Momento Histórico 5","Momento Histórico 6","Momento Histórico 7","Momento Histórico 8",
        "Momento Histórico 9","Momento Histórico 10"][i]
}));

const CC_PLAYERS = ["Lamine Yamal","Van Dijk","H. Kane","F. Valverde","Camavinga","G. Magalhães","Mbappé","Haaland","Pedri","Bellingham","R. Dias","M. Salah","A. Putellas","Vinicius Jr"];
const CC_ITEMS = CC_PLAYERS.map((nome,i)=>({ id:`CC-${i+1}`, nome }));

function gerarFigsSel(sel) {
  const f = [];
  f.push({ id:`${sel.id}-1`, nome:"Escudo", tipo:"escudo" });
  for(let i=2;i<=12;i++) f.push({ id:`${sel.id}-${i}`, nome:`Jog. ${i-1}`, tipo:"jogador" });
  f.push({ id:`${sel.id}-13`, nome:"Time", tipo:"time" });
  for(let i=14;i<=20;i++) f.push({ id:`${sel.id}-${i}`, nome:`Jog. ${i-2}`, tipo:"jogador" });
  return f;
}

function sGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function sSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function luminance(hex) {
  try {
    const r=parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255;
    return 0.299*r+0.587*g+0.114*b;
  } catch { return 0; }
}
function textOnBg(hex) { return luminance(hex)>0.55?"#000":"#fff"; }
function R(v) { return `R$ ${Number(v).toFixed(2).replace(".",",")}` }

// ─── HELPERS AGRUPAMENTO ─────────────────────────────────────────────────────
function buildGroups(counts) {
  const faltando = [], repetidas = [], coladas = [];
  const allFigs = [
    ...SELECOES.flatMap(s=>gerarFigsSel(s)),
    ...FWC_ITEMS, ...CC_ITEMS
  ];
  allFigs.forEach(f => {
    const c = counts[f.id]||0;
    if(c===0) faltando.push(f.id);
    else if(c===1) coladas.push(f.id);
    else { coladas.push(f.id); repetidas.push({id:f.id, qtd:c-1}); }
  });
  const nomesSel = {};
  SELECOES.forEach(s=>{ nomesSel[s.id]=`${s.bandeira} ${s.nome}`; });
  nomesSel["FWC"]="⭐ Especiais FWC"; nomesSel["CC"]="🥤 Coca-Cola";

  const agrupar = (ids) => {
    const g = {};
    ids.forEach(id=>{
      const parts=id.split("-"); const prefix=parts.slice(0,-1).join("-");
      if(!g[prefix]) g[prefix]=[];
      g[prefix].push(parts[parts.length-1]);
    });
    return g;
  };
  const agruparRep = (items) => {
    const g = {};
    items.forEach(({id,qtd})=>{
      const parts=id.split("-"); const prefix=parts.slice(0,-1).join("-");
      if(!g[prefix]) g[prefix]=[];
      g[prefix].push({num:parts[parts.length-1], qtd});
    });
    return g;
  };
  return { faltando, coladas, repetidas, nomesSel, grpFalt:agrupar(faltando), grpCol:agrupar(coladas), grpRep:agruparRep(repetidas) };
}

// ─── PDF FUNDO BRANCO, SÓ FIGURINHAS ────────────────────────────────────────
function gerarPDF(counts, nome, stats) {
  const { faltando, repetidas, nomesSel, grpFalt, grpRep } = buildGroups(counts);
  const data = new Date().toLocaleDateString("pt-BR");
  const pct = ((stats.coladas/stats.total)*100).toFixed(1);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>Trocas Copa 2026 — ${nome}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Barlow', sans-serif; background: #ffffff; color: #111; padding: 24px; }
  .header { background: linear-gradient(135deg, #1e3a5f, #0f2744); border-radius: 16px; padding: 22px 24px; margin-bottom: 20px; color: #fff; }
  .title { font-family: 'Barlow Condensed', sans-serif; font-size: 26px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
  .subtitle { color: #93c5fd; font-size: 12px; font-weight: 600; letter-spacing: 1px; margin-top: 2px; }
  .meta { color: #94a3b8; font-size: 12px; margin-top: 8px; }
  .progress-bar { background: #1e3a5f; border-radius: 4px; height: 8px; margin-top: 10px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #3b82f6, #22c55e); }
  .pct-row { display:flex; justify-content:space-between; margin-top:5px; font-size:11px; color:#94a3b8; }
  .stats-row { display: flex; gap: 10px; margin-top: 14px; }
  .stat { background: rgba(255,255,255,0.1); border-radius: 10px; padding: 8px 14px; flex: 1; border-left: 3px solid; }
  .stat-val { font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 900; }
  .stat-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 2px; opacity: 0.7; }
  .section { margin-bottom: 24px; }
  .section-title { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; padding: 8px 14px; border-radius: 8px; margin-bottom: 10px; display:flex; align-items:center; gap:8px; }
  .falt-title { background: #fef2f2; color: #dc2626; border: 1.5px solid #fca5a5; }
  .rep-title { background: #fffbeb; color: #d97706; border: 1.5px solid #fcd34d; }
  .sel-block { background: #f8fafc; border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; border-left: 4px solid #3b82f6; }
  .sel-block.rep { border-left-color: #f59e0b; }
  .sel-name { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 13px; color: #334155; margin-bottom: 6px; }
  .count-badge { background: #e2e8f0; color: #64748b; border-radius: 20px; padding: 1px 8px; font-size: 10px; font-weight: 600; margin-left: 6px; }
  .figs { display: flex; flex-wrap: wrap; gap: 4px; }
  .fig { background: #fee2e2; border: 1.5px solid #fca5a5; color: #dc2626; border-radius: 5px; padding: 3px 8px; font-size: 11px; font-weight: 700; font-family: 'Barlow Condensed', sans-serif; }
  .fig.rep { background: #fef3c7; border-color: #fcd34d; color: #b45309; }
  .badge { background: #f59e0b; color: #fff; border-radius: 10px; padding: 1px 5px; font-size: 9px; font-weight: 900; margin-left: 3px; }
  .rodape { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 10px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  @media print { 
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } 
    .sel-block { break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="header">
  <div class="title">⚽ Copa 2026 — Lista de Trocas</div>
  <div class="subtitle">PANINI · FIFA WORLD CUP 2026™</div>
  <div class="meta">Colecionador: <b style="color:#fff">${nome}</b> &nbsp;·&nbsp; ${data}</div>
  <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
  <div class="pct-row"><span>${stats.coladas} coladas de ${stats.total}</span><span style="color:#22c55e;font-weight:700">${pct}% completo</span></div>
  <div class="stats-row">
    <div class="stat" style="border-color:#ef4444"><div class="stat-lbl">Faltando</div><div class="stat-val" style="color:#fca5a5">${faltando.length}</div></div>
    <div class="stat" style="border-color:#f59e0b"><div class="stat-lbl">Repetidas</div><div class="stat-val" style="color:#fcd34d">${repetidas.length} tipos</div></div>
    <div class="stat" style="border-color:#22c55e"><div class="stat-lbl">Coladas</div><div class="stat-val" style="color:#86efac">${stats.coladas}</div></div>
  </div>
</div>

<div class="section">
  <div class="section-title falt-title">❌ Figurinhas que Faltam <span class="count-badge">${faltando.length}</span></div>
  ${Object.entries(grpFalt).map(([grp, nums])=>{
    const sel = SELECOES.find(s=>s.id===grp);
    const borderColor = sel ? sel.cor1 : "#3b82f6";
    const label = nomesSel[grp]||grp;
    return `<div class="sel-block" style="border-left-color:${borderColor}">
      <div class="sel-name">${label}<span class="count-badge">${nums.length}</span></div>
      <div class="figs">${nums.map(n=>`<span class="fig">${grp}-${n}</span>`).join("")}</div>
    </div>`;
  }).join("")}
</div>

${repetidas.length>0?`<div class="section">
  <div class="section-title rep-title">🔁 Repetidas para Troca <span class="count-badge">${repetidas.length} tipos</span></div>
  ${Object.entries(grpRep).map(([grp, items])=>{
    const sel = SELECOES.find(s=>s.id===grp);
    const borderColor = sel ? sel.cor1 : "#f59e0b";
    const label = nomesSel[grp]||grp;
    return `<div class="sel-block rep" style="border-left-color:${borderColor}">
      <div class="sel-name">${label}<span class="count-badge">${items.length} tipos</span></div>
      <div class="figs">${items.map(({num,qtd})=>`<span class="fig rep">${grp}-${num}<span class="badge">×${qtd}</span></span>`).join("")}</div>
    </div>`;
  }).join("")}
</div>`:""}

<div class="rodape">Gerado pelo Álbum Digital Copa 2026 · ${data} · Para imprimir: Arquivo → Imprimir → Salvar como PDF</div>
</body></html>`;

  const blob = new Blob([html], {type:"text/html;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank");
  if(w) setTimeout(()=>{ try{ w.print(); }catch(e){} }, 800);
  setTimeout(()=>URL.revokeObjectURL(url), 15000);
}

// ─── BAR CHART ───────────────────────────────────────────────────────────────
function BarChart({ slices }) {
  const max = Math.max(...slices.map(s=>Math.max(s.value,0)), 1);
  if(slices.every(s=>s.value===0)) return (
    <div style={{textAlign:"center",color:"#333",fontSize:12,padding:"30px 0"}}>Nenhum dado financeiro ainda</div>
  );
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {slices.map((sl,i)=>{
        const pct = Math.max(sl.value,0)/max*100;
        return (
          <div key={i}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:9,height:9,borderRadius:2,background:sl.cor,flexShrink:0}}/>
                <span style={{fontSize:11,color:"#888"}}>{sl.label}</span>
              </div>
              <span style={{fontSize:13,fontWeight:800,color:sl.cor,fontFamily:"'Barlow Condensed',sans-serif"}}>{sl.display}</span>
            </div>
            <div style={{background:"#1a1d27",borderRadius:4,height:8,overflow:"hidden"}}>
              <div style={{width:`${pct}%`,background:sl.cor,height:"100%",borderRadius:4,transition:"width 0.6s cubic-bezier(0.4,0,0.2,1)",boxShadow:`0 0 8px ${sl.cor}66`}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── FIGCARD ─────────────────────────────────────────────────────────────────
function FigCard({ id, label, count, onTap, cor1, cor2 }) {
  let bg, border, tc, badge;
  if(count===0) { bg="#1a1d27"; border="#2a2d3a"; tc="#3a3d4a"; }
  else if(count===1) { bg=cor1||"#22c55e"; border=cor2||"#16a34a"; tc=textOnBg(cor1||"#22c55e"); }
  else { bg=cor1||"#22c55e"; border="#f59e0b"; tc=textOnBg(cor1||"#22c55e"); }
  badge = count>1 ? count-1 : null;
  const num = id.split("-").pop();
  return (
    <div onClick={onTap} title={label} className="fig-btn" style={{
      width:42,height:42,borderRadius:7,cursor:"pointer",
      background:bg,border:`2px solid ${border}`,
      display:"flex",alignItems:"center",justifyContent:"center",
      position:"relative",flexShrink:0,userSelect:"none",
      boxShadow:count>0?`0 0 10px ${bg}66`:"none",
      transition:"transform 0.1s",
    }}>
      <span style={{fontSize:9,fontWeight:800,color:tc,textAlign:"center"}}>{num}</span>
      {badge!=null && (
        <div style={{position:"absolute",top:-6,right:-6,background:"#f59e0b",borderRadius:"50%",width:15,height:15,fontSize:9,fontWeight:900,color:"#000",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid #0d1020"}}>{badge}</div>
      )}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("selecoes");
  const [subTab, setSubTab] = useState(null);
  const [counts, setCounts] = useState({});
  const [eventos, setEventos] = useState([]);
  const [fin, setFin] = useState({gasto:0, recebido:0, economizado:0});
  const [nomeUser, setNomeUser] = useState("Colecionador");
  const [valorAlbum, setValorAlbum] = useState(null); // null = não perguntou ainda
  const [albumInput, setAlbumInput] = useState("70");
  const [loaded, setLoaded] = useState(false);
  const [modalEvento, setModalEvento] = useState(null);
  const [showPDF, setShowPDF] = useState(false);
  const [statsModal, setStatsModal] = useState(null); // "coladas"|"faltando"|"repetidas"
  const [confirmDelete, setConfirmDelete] = useState(null); // id do evento a apagar
  const [evForm, setEvForm] = useState({});
  const [filterGrupo, setFilterGrupo] = useState("todos");

  useEffect(()=>{
    const c=sGet("copa26:counts");
    const e=sGet("copa26:eventos");
    const f=sGet("copa26:fin");
    const n=sGet("copa26:nome");
    const va=sGet("copa26:valorAlbum");
    if(c) setCounts(c);
    if(e) setEventos(e);
    if(f) setFin(f);
    if(n) setNomeUser(n);
    if(va!==null) setValorAlbum(va);
    setLoaded(true);
  },[]);

  const tapFig = useCallback((id)=>{
    setCounts(prev=>{
      const next={...prev,[id]:((prev[id]||0)+1)%7};
      sSet("copa26:counts",next);
      return next;
    });
  },[]);

  const allFigIds = useMemo(()=>[
    ...SELECOES.flatMap(s=>gerarFigsSel(s).map(f=>f.id)),
    ...FWC_ITEMS.map(f=>f.id),
    ...CC_ITEMS.map(f=>f.id),
  ],[]);

  const stats = useMemo(()=>{
    let coladas=0,repetidas=0,faltando=0;
    allFigIds.forEach(id=>{
      const c=counts[id]||0;
      if(c===0) faltando++;
      else if(c===1) coladas++;
      else { coladas++; repetidas+=c-1; }
    });
    return {coladas,repetidas,faltando,total:allFigIds.length};
  },[counts,allFigIds]);

  const pct = ((stats.coladas/stats.total)*100).toFixed(1);

  const setEv=(k,v)=>setEvForm(p=>({...p,[k]:v}));

  const registrarEvento=(tipo)=>{
    const agora=new Date().toISOString();
    let ev={id:Date.now(),tipo,data:agora,obs:evForm.obs||""};
    let nf={...fin};
    if(tipo==="compra"||tipo==="promocao"){
      const qtd=parseInt(evForm.qtdPacotes)||0, preco=parseFloat(evForm.precoUnit)||PRECO_PACOTE;
      ev={...ev,qtdPacotes:qtd,precoUnit:preco};
      nf.gasto+=qtd*preco;
      if(tipo==="promocao") nf.economizado+=qtd*(PRECO_PACOTE-preco);
    }
    if(tipo==="venda"){
      const qtd=parseInt(evForm.qtdFigs)||0, preco=parseFloat(evForm.precoUnit)||0;
      ev={...ev,qtdFigs:qtd,precoUnit:preco};
      nf.recebido+=qtd*preco;
    }
    if(tipo==="troca") ev={...ev,dadas:parseInt(evForm.dadas)||0,recebidas:parseInt(evForm.recebidas)||0};
    const novos=[ev,...eventos];
    setEventos(novos); setFin(nf);
    sSet("copa26:eventos",novos); sSet("copa26:fin",nf);
    setModalEvento(null); setEvForm({});
  };

  const removerEvento = (id) => {
    const novos = eventos.filter(ev=>ev.id!==id);
    // Reverter financeiro do evento removido
    const ev = eventos.find(e=>e.id===id);
    if(ev) {
      let nf = {...fin};
      if(ev.tipo==="compra"||ev.tipo==="promocao") {
        nf.gasto = Math.max(0, nf.gasto - (ev.qtdPacotes||0)*(ev.precoUnit||0));
        if(ev.tipo==="promocao") nf.economizado = Math.max(0, nf.economizado - (ev.qtdPacotes||0)*(PRECO_PACOTE-(ev.precoUnit||0)));
      }
      if(ev.tipo==="venda") nf.recebido = Math.max(0, nf.recebido - (ev.qtdFigs||0)*(ev.precoUnit||0));
      setFin(nf);
      sSet("copa26:fin", nf);
    }
    setEventos(novos);
    sSet("copa26:eventos", novos);
  };

  const confirmarAlbum = () => {
    const v = parseFloat(albumInput.replace(",",".")) || 70;
    setValorAlbum(v);
    sSet("copa26:valorAlbum", v);
  };

  const tipoEv={
    compra:  {label:"Comprei Pacotes",    cor:"#3b82f6"},
    promocao:{label:"Compra c/ Desconto", cor:"#a855f7"},
    venda:   {label:"Vendi Repetidas",    cor:"#22c55e"},
    troca:   {label:"Fiz uma Troca",      cor:"#f59e0b"},
  };

  const grupos=["todos","A","B","C","D","E","F","G","H","I","J","K","L"];
  const selsFiltradas=filterGrupo==="todos"?SELECOES:SELECOES.filter(s=>s.grupo===filterGrupo);

  // Dados pizza
  const va = valorAlbum||0;
  const custoLiq = va + fin.gasto - fin.recebido;
  // Custo bruto = total de pacotes abertos × R$7 (como se não tivesse promoção nem vendas)
  const totalPacotes = eventos.filter(e=>e.tipo==="compra"||e.tipo==="promocao").reduce((s,e)=>s+(e.qtdPacotes||0),0);
  const custoBruto = va + totalPacotes * PRECO_PACOTE;

  const pizzaSlices = [
    { label:"Custo bruto total (sem estratégia)", value:custoBruto, cor:"#6b7280", display:R(custoBruto) },
    { label:"Gasto real em pacotes", value:fin.gasto, cor:"#ef4444", display:R(fin.gasto) },
    { label:"Recuperado com vendas", value:fin.recebido, cor:"#22c55e", display:R(fin.recebido) },
    { label:"Economizado em promoções", value:fin.economizado, cor:"#a855f7", display:R(fin.economizado) },
    { label:"Custo líquido total", value:custoLiq, cor:"#f59e0b", display:R(custoLiq) },
  ];

  if(!loaded) return (
    <div style={{minHeight:"100vh",background:"#080a10",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{color:"#3b82f6",fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,letterSpacing:2}}>CARREGANDO...</span>
    </div>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800;900&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#080a10;}
        .fig-btn:active{transform:scale(0.88)!important;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-thumb{background:#2a2d3a;border-radius:2px;}
      `}</style>

      <div style={{minHeight:"100vh",background:"#080a10",color:"#fff",fontFamily:"'Barlow',sans-serif",paddingBottom:70}}>

        {/* MODAL BOAS VINDAS — VALOR DO ÁLBUM */}
        {valorAlbum===null && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:20}}>
            <div style={{background:"#0f1117",border:"1px solid #3b82f644",borderRadius:20,padding:28,width:"100%",maxWidth:360,textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>⚽</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#fff",marginBottom:6,letterSpacing:1}}>Álbum Copa 2026</div>
              <div style={{color:"#555",fontSize:13,marginBottom:20,lineHeight:1.5}}>Antes de começar, quanto você pagou pelo álbum físico?</div>
              <div style={{marginBottom:6,color:"#666",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",textAlign:"left"}}>Valor do álbum (R$)</div>
              <input
                type="number"
                value={albumInput}
                onChange={e=>setAlbumInput(e.target.value)}
                style={{width:"100%",padding:"12px",background:"#1a1d27",border:"1px solid #2a2d3a",borderRadius:10,color:"#fff",fontSize:18,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,outline:"none",textAlign:"center",marginBottom:8}}
              />
              <div style={{color:"#333",fontSize:11,marginBottom:16}}>Sugestão: R$ 70,00 (Álbum Prata Capa Dura)</div>
              <button onClick={confirmarAlbum} style={{width:"100%",padding:14,background:"#3b82f6",border:"none",borderRadius:12,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:17,cursor:"pointer",letterSpacing:"0.5px"}}>
                COMEÇAR A COLECIONAR
              </button>
              <button onClick={()=>{setValorAlbum(0);sSet("copa26:valorAlbum",0);}} style={{marginTop:10,background:"none",border:"none",color:"#333",fontSize:12,cursor:"pointer"}}>
                Pular (não incluir valor do álbum)
              </button>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div style={{background:"#0d1020",borderBottom:"1px solid #1a1d2a",padding:"14px 16px 10px",position:"sticky",top:0,zIndex:200}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:21,letterSpacing:1,textTransform:"uppercase"}}>⚽ Copa 2026</span>
            <span style={{marginLeft:"auto",color:"#3b82f6",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16}}>{pct}%</span>
          </div>
          <div style={{background:"#1a1d27",borderRadius:3,height:4,overflow:"hidden"}}>
            <div style={{width:`${pct}%`,background:"linear-gradient(90deg,#3b82f6,#22c55e)",height:"100%",transition:"width 0.5s"}}/>
          </div>
          <div style={{display:"flex",gap:12,marginTop:5,fontSize:11}}>
            <span style={{color:"#3b82f6",fontWeight:700}}>✓ {stats.coladas}</span>
            <span style={{color:"#ef4444",fontWeight:700}}>✗ {stats.faltando}</span>
            <span style={{color:"#f59e0b",fontWeight:700}}>⟳ {stats.repetidas}</span>
            <span style={{color:"#555",marginLeft:"auto"}}>{stats.total} total</span>
          </div>
        </div>

        <div style={{padding:"0 12px"}}>

          {/* ═══ SELEÇÕES ═══ */}
          {tab==="selecoes" && !subTab && (
            <div style={{paddingTop:12}}>
              <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:8,marginBottom:6}}>
                {grupos.map(g=>(
                  <button key={g} onClick={()=>setFilterGrupo(g)} style={{
                    flexShrink:0,padding:"4px 10px",borderRadius:20,border:"1px solid",fontSize:11,fontWeight:700,cursor:"pointer",
                    background:filterGrupo===g?"#3b82f6":"transparent",
                    borderColor:filterGrupo===g?"#3b82f6":"#2a2d3a",
                    color:filterGrupo===g?"#fff":"#555",
                  }}>{g==="todos"?"Todos":g}</button>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {selsFiltradas.map(sel=>{
                  const figs=gerarFigsSel(sel);
                  const col=figs.filter(f=>(counts[f.id]||0)>=1).length;
                  const p=Math.round(col/20*100);
                  return (
                    <div key={sel.id} onClick={()=>setSubTab(sel.id)} style={{background:"#0d1020",border:"1px solid #1a1d2a",borderRadius:10,padding:"12px",cursor:"pointer",borderLeft:`3px solid ${sel.cor1}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                        <span style={{fontSize:18}}>{sel.bandeira}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,lineHeight:1.1,color:"#ddd",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{sel.nome}</div>
                          <div style={{color:"#444",fontSize:10}}>Grp {sel.grupo}</div>
                        </div>
                        <span style={{color:sel.cor1,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,flexShrink:0}}>{p}%</span>
                      </div>
                      <div style={{background:"#1a1d27",borderRadius:2,height:3}}>
                        <div style={{width:`${p}%`,background:sel.cor1,height:"100%",borderRadius:2}}/>
                      </div>
                      <div style={{color:"#444",fontSize:10,marginTop:4}}>{col}/20</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ DETALHE SELEÇÃO ═══ */}
          {tab==="selecoes" && subTab && (()=>{
            const sel=SELECOES.find(s=>s.id===subTab);
            if(!sel) return null;
            const figs=gerarFigsSel(sel);
            const col=figs.filter(f=>(counts[f.id]||0)>=1).length;
            return (
              <div style={{paddingTop:10}}>
                <button onClick={()=>setSubTab(null)} style={{background:"none",border:"none",color:"#3b82f6",cursor:"pointer",fontSize:12,fontWeight:600,marginBottom:10,display:"flex",alignItems:"center",gap:3}}>← Todas as seleções</button>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:"12px",background:"#0d1020",borderRadius:10,border:`1px solid ${sel.cor1}33`}}>
                  <span style={{fontSize:28}}>{sel.bandeira}</span>
                  <div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18}}>{sel.nome}</div>
                    <div style={{color:"#555",fontSize:11}}>Grupo {sel.grupo} · {col}/20 coladas</div>
                  </div>
                  <div style={{marginLeft:"auto"}}>
                    <div style={{color:sel.cor1,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22}}>{Math.round(col/20*100)}%</div>
                  </div>
                </div>
                <div style={{fontSize:10,color:"#444",marginBottom:8}}>1 toque = colada · 2+ = repetida · 7 = limpar</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {figs.map(f=>(
                    <div key={f.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                      <FigCard id={f.id} label={f.nome} count={counts[f.id]||0} onTap={()=>tapFig(f.id)} cor1={sel.cor1} cor2={sel.cor2}/>
                      {(f.tipo==="escudo"||f.tipo==="time") && (
                        <span style={{fontSize:7,color:sel.cor1,fontWeight:700,textTransform:"uppercase"}}>{f.tipo==="escudo"?"ESC":"TIM"}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ═══ ESPECIAIS ═══ */}
          {tab==="especiais" && (
            <div style={{paddingTop:12}}>
              <div style={{background:"#1a140a",border:"1px solid #f59e0b33",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,color:"#f59e0b"}}>🏆 FWC — Cromos Metalizados</div>
                <div style={{color:"#555",fontSize:11}}>{FWC_ITEMS.filter(f=>(counts[f.id]||0)>=1).length}/{FWC_ITEMS.length} coladas</div>
              </div>
              <div style={{fontSize:10,color:"#444",marginBottom:8}}>1 toque = colada · 2+ = repetida · 7 = limpar</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:16}}>
                {FWC_ITEMS.map(f=>(
                  <div key={f.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                    <FigCard id={f.id} label={f.nome} count={counts[f.id]||0} onTap={()=>tapFig(f.id)} cor1="#c8922a" cor2="#FFD700"/>
                    <span style={{fontSize:7,color:"#666",maxWidth:42,textAlign:"center"}}>{f.id}</span>
                  </div>
                ))}
              </div>
              <div style={{background:"#1a0a0a",border:"1px solid #dc262633",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,color:"#ef4444"}}>🥤 Coca-Cola — Página Especial</div>
                <div style={{color:"#555",fontSize:11}}>{CC_ITEMS.filter(f=>(counts[f.id]||0)>=1).length}/{CC_ITEMS.length} coladas</div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {CC_ITEMS.map(f=>(
                  <div key={f.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                    <FigCard id={f.id} label={f.nome} count={counts[f.id]||0} onTap={()=>tapFig(f.id)} cor1="#dc2626" cor2="#FFFFFF"/>
                    <span style={{fontSize:7,color:"#666",maxWidth:42,textAlign:"center"}}>{f.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ DASHBOARD ═══ */}
          {tab==="dashboard" && (
            <div style={{paddingTop:12}}>
              {/* Stats */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                {[
                  {l:"Coladas",v:stats.coladas,c:"#3b82f6",s:`de ${stats.total}`,k:"coladas"},
                  {l:"Faltando",v:stats.faltando,c:"#ef4444",s:"toque para ver",k:"faltando"},
                  {l:"Repetidas",v:stats.repetidas,c:"#f59e0b",s:"toque para ver",k:"repetidas"},
                  {l:"Completo",v:pct+"%",c:"#22c55e",s:`${stats.total} figurinhas`,k:"coladas"},
                ].map(s=>(
                  <div key={s.l} onClick={()=>s.k&&setStatsModal(s.k)} style={{background:"#0d1020",border:"1px solid #1a1d2a",borderRadius:10,padding:"12px 14px",borderLeft:`3px solid ${s.c}`,cursor:"pointer"}}>
                    <div style={{color:"#444",fontSize:10,fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:3}}>{s.l}</div>
                    <div style={{color:s.c,fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900}}>{s.v}</div>
                    <div style={{color:"#333",fontSize:10,marginTop:2}}>{s.s}</div>
                  </div>
                ))}
              </div>

              {/* Gráfico Pizza */}
              <div style={{background:"#0d1020",border:"1px solid #1a1d2a",borderRadius:12,padding:"16px",marginBottom:10}}>
                <div style={{color:"#444",fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:14}}>📊 Resumo Financeiro</div>
                <BarChart slices={pizzaSlices}/>
                {valorAlbum!==null && (
                  <button onClick={()=>{setValorAlbum(null);}} style={{marginTop:12,background:"none",border:"1px solid #1a1d2a",borderRadius:6,color:"#333",fontSize:10,cursor:"pointer",padding:"4px 10px",width:"100%"}}>
                    Alterar valor do álbum ({R(valorAlbum)})
                  </button>
                )}
              </div>

              {/* Eventos */}
              <div style={{marginBottom:10}}>
                <div style={{color:"#444",fontSize:10,fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:8}}>Registrar Evento</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {Object.entries(tipoEv).map(([tipo,cfg])=>(
                    <button key={tipo} onClick={()=>{setModalEvento(tipo);setEvForm({});}} style={{background:"#0d1020",border:`1px solid ${cfg.cor}33`,borderRadius:10,padding:"11px",cursor:"pointer",textAlign:"left"}}>
                      <div style={{color:cfg.cor,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13}}>{cfg.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={()=>setShowPDF(true)} style={{width:"100%",padding:12,background:"#0d1020",border:"1px solid #3b82f633",borderRadius:10,cursor:"pointer",color:"#3b82f6",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,marginBottom:10}}>
                📄 Gerar Lista para Trocas (PDF)
              </button>

              {/* Nome */}
              <div style={{color:"#444",fontSize:10,fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:6}}>Seu nome</div>
              <input value={nomeUser} onChange={e=>{setNomeUser(e.target.value);sSet("copa26:nome",e.target.value);}} style={{width:"100%",padding:"9px 12px",background:"#0d1020",border:"1px solid #1a1d2a",borderRadius:8,color:"#fff",fontSize:14,outline:"none",marginBottom:10}}/>

              {/* Histórico */}
              {eventos.length>0 && (
                <div>
                  <div style={{color:"#444",fontSize:10,fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:6}}>Histórico</div>
                  {eventos.slice(0,20).map(ev=>{
                    const cfg=tipoEv[ev.tipo]||{label:ev.tipo,cor:"#666"};
                    return (
                      <div key={ev.id} style={{background:"#0d1020",border:"1px solid #1a1d2a",borderRadius:8,padding:"9px 12px",marginBottom:5,borderLeft:`3px solid ${cfg.cor}`}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                              <span style={{color:"#ccc",fontSize:12,fontWeight:600}}>{cfg.label}</span>
                              <span style={{color:"#333",fontSize:10}}>{new Date(ev.data).toLocaleDateString("pt-BR")}</span>
                            </div>
                            <div style={{color:"#555",fontSize:10,marginTop:2}}>
                              {ev.qtdPacotes && `${ev.qtdPacotes} pacotes · ${R(ev.qtdPacotes*ev.precoUnit)}`}
                              {ev.qtdFigs && `${ev.qtdFigs} figs · ${R(ev.qtdFigs*ev.precoUnit)}`}
                              {ev.dadas && `Deu ${ev.dadas} · recebeu ${ev.recebidas}`}
                              {ev.obs && ` · ${ev.obs}`}
                            </div>
                          </div>
                          <button
                            onClick={()=>setConfirmDelete(ev.id)}
                            style={{marginLeft:10,background:"none",border:"1px solid #2a2d3a",borderRadius:6,color:"#555",cursor:"pointer",padding:"3px 10px",fontSize:13,flexShrink:0,lineHeight:1}}
                          >✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* TAB BAR */}
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#0d1020",borderTop:"1px solid #1a1d2a",display:"flex",zIndex:300}}>
          {[{id:"selecoes",label:"Seleções",e:"🌍"},{id:"especiais",label:"Especiais",e:"⭐"},{id:"dashboard",label:"Dashboard",e:"📊"}].map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);if(t.id!=="selecoes")setSubTab(null);}} style={{flex:1,background:"none",border:"none",color:tab===t.id?"#3b82f6":"#333",cursor:"pointer",padding:"9px 0 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
              <span style={{fontSize:19}}>{t.e}</span>
              <span style={{fontSize:9,fontWeight:700,letterSpacing:"0.5px",textTransform:"uppercase"}}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* MODAL EVENTO */}
        {modalEvento && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}>
            <div style={{background:"#0f1117",border:`1px solid ${tipoEv[modalEvento]?.cor}33`,borderRadius:16,padding:20,width:"100%",maxWidth:380}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:tipoEv[modalEvento]?.cor}}>{tipoEv[modalEvento]?.label}</div>
                <button onClick={()=>setModalEvento(null)} style={{background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:18}}>✕</button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {(modalEvento==="compra"||modalEvento==="promocao")&&(<>
                  <EInput label="Qtd. de pacotes" type="number" val={evForm.qtdPacotes} set={v=>setEv("qtdPacotes",v)} ph="Ex: 10"/>
                  <EInput label={modalEvento==="promocao"?"Preço/pacote com desconto (R$)":"Preço/pacote (R$)"} type="number" val={evForm.precoUnit} set={v=>setEv("precoUnit",v)} ph="7.00"/>
                </>)}
                {modalEvento==="venda"&&(<>
                  <EInput label="Qtd. figurinhas vendidas" type="number" val={evForm.qtdFigs} set={v=>setEv("qtdFigs",v)} ph="Ex: 20"/>
                  <EInput label="Preço por figurinha (R$)" type="number" val={evForm.precoUnit} set={v=>setEv("precoUnit",v)} ph="Ex: 0.50"/>
                </>)}
                {modalEvento==="troca"&&(<>
                  <EInput label="Figurinhas que você deu" type="number" val={evForm.dadas} set={v=>setEv("dadas",v)} ph="Ex: 15"/>
                  <EInput label="Figurinhas que você recebeu" type="number" val={evForm.recebidas} set={v=>setEv("recebidas",v)} ph="Ex: 15"/>
                </>)}
                <EInput label="Observação (opcional)" val={evForm.obs} set={v=>setEv("obs",v)} ph="Ex: comprei na banca"/>
              </div>
              <button onClick={()=>registrarEvento(modalEvento)} style={{marginTop:14,width:"100%",padding:12,background:tipoEv[modalEvento]?.cor,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,cursor:"pointer"}}>REGISTRAR</button>
            </div>
          </div>
        )}

        {/* MODAL PDF */}
        {showPDF && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}>
            <div style={{background:"#0f1117",border:"1px solid #3b82f633",borderRadius:16,padding:20,width:"100%",maxWidth:360}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:"#3b82f6",marginBottom:10}}>📄 Lista para Trocas</div>
              <div style={{color:"#666",fontSize:12,marginBottom:14,lineHeight:1.6}}>
                Abre uma página bonita com suas figurinhas <b style={{color:"#ef4444"}}>faltando</b> e <b style={{color:"#f59e0b"}}>repetidas</b> — use <b style={{color:"#fff"}}>Imprimir → Salvar como PDF</b> no navegador para guardar ou enviar.
              </div>
              <EInput label="Seu nome (aparece no PDF)" val={nomeUser} set={v=>{setNomeUser(v);sSet("copa26:nome",v);}} ph="Ex: João Victor"/>
              <div style={{display:"flex",gap:8,marginTop:14}}>
                <button onClick={()=>setShowPDF(false)} style={{flex:1,padding:10,background:"transparent",border:"1px solid #1a1d2a",borderRadius:8,color:"#444",cursor:"pointer"}}>Cancelar</button>
                <button onClick={()=>{gerarPDF(counts,nomeUser,stats);setShowPDF(false);}} style={{flex:2,padding:10,background:"#3b82f6",border:"none",borderRadius:8,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,cursor:"pointer"}}>GERAR PDF</button>
              </div>
            </div>
          </div>
        )}
        {/* MODAL CONFIRMAR EXCLUSÃO */}
        {confirmDelete && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:2000,padding:16}}>
            <div style={{background:"#0f1117",border:"1px solid #ef444444",borderRadius:16,padding:20,width:"100%",maxWidth:400}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:17,color:"#ef4444",marginBottom:8}}>Remover evento?</div>
              <div style={{color:"#666",fontSize:13,marginBottom:16,lineHeight:1.5}}>O valor financeiro deste evento será revertido automaticamente.</div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setConfirmDelete(null)} style={{flex:1,padding:"11px",background:"transparent",border:"1px solid #2a2d3a",borderRadius:10,color:"#555",cursor:"pointer",fontSize:14,fontWeight:600}}>Cancelar</button>
                <button onClick={()=>{removerEvento(confirmDelete);setConfirmDelete(null);}} style={{flex:1,padding:"11px",background:"#ef4444",border:"none",borderRadius:10,color:"#fff",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,letterSpacing:"0.5px"}}>REMOVER</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL STATS DETALHE */}
        {statsModal && (()=>{
          const { faltando, coladas, repetidas, nomesSel, grpFalt, grpCol, grpRep } = buildGroups(counts);
          const cfgs = {
            coladas:   { titulo:"✅ Figurinhas Coladas",  cor:"#3b82f6", lista:grpCol,  badge:(nums)=>nums.length },
            faltando:  { titulo:"❌ Figurinhas Faltando", cor:"#ef4444", lista:grpFalt, badge:(nums)=>nums.length },
            repetidas: { titulo:"🔁 Figurinhas Repetidas",cor:"#f59e0b", lista:grpRep,  badge:(items)=>items.length },
          };
          const cfg = cfgs[statsModal];
          const isRep = statsModal==="repetidas";
          return (
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",flexDirection:"column",zIndex:1000}}>
              <div style={{background:"#0d1020",borderBottom:"1px solid #1a1d2a",padding:"14px 16px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                <button onClick={()=>setStatsModal(null)} style={{background:"none",border:"none",color:"#3b82f6",cursor:"pointer",fontSize:13,fontWeight:600}}>← Voltar</button>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:17,color:cfg.cor,flex:1}}>{cfg.titulo}</div>
                <span style={{color:"#444",fontSize:12}}>{isRep ? repetidas.length+" tipos" : statsModal==="coladas" ? coladas.length : faltando.length}</span>
              </div>
              <div style={{overflowY:"auto",flex:1,padding:"12px 16px"}}>
                {Object.entries(cfg.lista).map(([grp, items])=>{
                  const sel = SELECOES.find(s=>s.id===grp);
                  const borderColor = sel ? sel.cor1 : cfg.cor;
                  const label = nomesSel[grp]||grp;
                  return (
                    <div key={grp} style={{background:"#0d1020",border:"1px solid #1a1d2a",borderRadius:10,padding:"10px 12px",marginBottom:8,borderLeft:`3px solid ${borderColor}`}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#ccc",marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                        {label}
                        <span style={{background:"#1a1d2a",color:"#555",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:600}}>{cfg.badge(items)}</span>
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                        {isRep
                          ? items.map(({num,qtd})=>(
                            <span key={num} style={{background:`${cfg.cor}22`,border:`1.5px solid ${cfg.cor}44`,color:cfg.cor,borderRadius:5,padding:"3px 7px",fontSize:11,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",position:"relative"}}>
                              {grp}-{num}
                              <span style={{background:cfg.cor,color:"#000",borderRadius:8,padding:"0 4px",fontSize:9,fontWeight:900,marginLeft:3}}>×{qtd}</span>
                            </span>
                          ))
                          : items.map(n=>(
                            <span key={n} style={{background:`${cfg.cor}22`,border:`1.5px solid ${cfg.cor}44`,color:cfg.cor,borderRadius:5,padding:"3px 7px",fontSize:11,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif"}}>
                              {grp}-{n}
                            </span>
                          ))
                        }
                      </div>
                    </div>
                  );
                })}
                {Object.keys(cfg.lista).length===0 && (
                  <div style={{textAlign:"center",color:"#333",padding:"60px 0"}}>
                    <div style={{fontSize:36,marginBottom:10}}>{statsModal==="coladas"?"📭":"🎉"}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,letterSpacing:1,textTransform:"uppercase"}}>
                      {statsModal==="coladas"?"Nenhuma colada ainda":"Nenhuma figurinha aqui!"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      </div>
    </>
  );
}

function EInput({label,type="text",val,set,ph}) {
  return (
    <div>
      <label style={{display:"block",color:"#555",fontSize:10,fontWeight:700,letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:5}}>{label}</label>
      <input type={type} value={val||""} onChange={e=>set(e.target.value)} placeholder={ph} style={{width:"100%",padding:"10px 12px",background:"#1a1d27",border:"1px solid #2a2d3a",borderRadius:8,color:"#fff",fontSize:14,outline:"none",fontFamily:"'Barlow',sans-serif"}}/>
    </div>
  );
}
