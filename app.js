/* =========================================================
   PREMIER ESTATES — App logic
   ========================================================= */
const PROPS = [
  {id:1,  title:"Casa moderna con vista panorámica",     zone:"Cumbayá",            type:"Casa",         op:"Venta",   price:285000, beds:4, baths:3, area:280, year:2021, featured:true,  feats:["Piscina","Seguridad 24h","Garaje","Jardín"], pin:{x:72,y:55}},
  {id:2,  title:"Departamento de lujo torre González",    zone:"González Suárez",   type:"Departamento", op:"Venta",   price:320000, beds:3, baths:3, area:175, year:2022, featured:true,  feats:["Gimnasio","Seguridad 24h","Garaje"],          pin:{x:48,y:48}},
  {id:3,  title:"Penthouse con terraza privada",          zone:"La Carolina",       type:"Departamento", op:"Venta",   price:450000, beds:3, baths:3, area:220, year:2023, featured:true,  feats:["Piscina","Gimnasio","Seguridad 24h","Terraza"],pin:{x:42,y:38}},
  {id:4,  title:"Casa familiar con jardín",               zone:"Valle de los Chillos",type:"Casa",        op:"Venta",   price:185000, beds:4, baths:3, area:260, year:2018, featured:true,  feats:["Jardín","Garaje"],                            pin:{x:65,y:78}},
  {id:5,  title:"Oficina prime piso 14",                   zone:"La Carolina",       type:"Oficina",      op:"Venta",   price:165000, beds:0, baths:2, area:120, year:2020, featured:true,  feats:["Seguridad 24h","Garaje"],                     pin:{x:38,y:42}},
  {id:6,  title:"Loft contemporáneo en Tumbaco",          zone:"Tumbaco",           type:"Departamento", op:"Arriendo",price:1200,   beds:1, baths:1, area:75,  year:2022, featured:true,  feats:["Gimnasio","Seguridad 24h"],                   pin:{x:80,y:48}},
  {id:7,  title:"Suite ejecutiva amoblada",                zone:"Quito Norte",       type:"Departamento", op:"Arriendo",price:850,    beds:1, baths:1, area:55,  year:2021, featured:false, feats:["Gimnasio"],                                   pin:{x:32,y:30}},
  {id:8,  title:"Casa colonial restaurada",                zone:"Quito Norte",       type:"Casa",         op:"Venta",   price:215000, beds:5, baths:4, area:340, year:1995, featured:false, feats:["Jardín","Garaje","Chimenea"],                 pin:{x:30,y:35}},
  {id:9,  title:"Local comercial en zona rosa",            zone:"La Carolina",       type:"Local",        op:"Arriendo",price:2400,   beds:0, baths:1, area:140, year:2010, featured:false, feats:["Seguridad 24h"],                              pin:{x:45,y:45}},
  {id:10, title:"Departamento amplio con vista",           zone:"Cumbayá",           type:"Departamento", op:"Venta",   price:225000, beds:3, baths:2, area:140, year:2019, featured:false, feats:["Piscina","Gimnasio","Seguridad 24h"],         pin:{x:75,y:58}},
  {id:11, title:"Casa de campo con terreno",               zone:"Tumbaco",           type:"Casa",         op:"Venta",   price:295000, beds:5, baths:4, area:380, year:2017, featured:false, feats:["Jardín","Piscina","Garaje"],                  pin:{x:82,y:52}},
  {id:12, title:"Studio minimalista céntrico",             zone:"Quito Norte",       type:"Departamento", op:"Arriendo",price:680,    beds:1, baths:1, area:45,  year:2023, featured:false, feats:["Seguridad 24h"],                              pin:{x:34,y:28}},
  {id:13, title:"Casa premium en conjunto cerrado",        zone:"Cumbayá",           type:"Casa",         op:"Venta",   price:395000, beds:4, baths:4, area:320, year:2022, featured:false, feats:["Piscina","Seguridad 24h","Garaje","Jardín"],  pin:{x:74,y:60}},
  {id:14, title:"Departamento estrenar con balcón",        zone:"Valle de los Chillos",type:"Departamento",op:"Venta",   price:135000, beds:2, baths:2, area:95,  year:2024, featured:false, feats:["Garaje","Seguridad 24h"],                     pin:{x:62,y:75}},
  {id:15, title:"Oficina coworking-friendly",              zone:"Quito Norte",       type:"Oficina",      op:"Arriendo",price:1450,   beds:0, baths:2, area:90,  year:2021, featured:false, feats:["Seguridad 24h"],                              pin:{x:36,y:32}},
  {id:16, title:"Casa familiar 3 plantas",                 zone:"Valle de los Chillos",type:"Casa",        op:"Venta",   price:155000, beds:4, baths:3, area:240, year:2015, featured:false, feats:["Jardín","Garaje"],                            pin:{x:64,y:80}},
  {id:17, title:"Suite González Suárez vista al valle",    zone:"González Suárez",   type:"Departamento", op:"Arriendo",price:1100,   beds:2, baths:2, area:110, year:2020, featured:false, feats:["Gimnasio","Seguridad 24h"],                   pin:{x:50,y:50}},
  {id:18, title:"Local esquinero alta circulación",        zone:"Quito Norte",       type:"Local",        op:"Venta",   price:118000, beds:0, baths:1, area:80,  year:2008, featured:false, feats:[]                                         ,    pin:{x:30,y:32}},
];

/* ============================================================ */
const App = (() => {
  const $  = (s,el=document)=>el.querySelector(s);
  const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
  const fmt = n => "$ "+(n>=1000?n.toLocaleString("es-EC"):n);
  const fmtPrice = p => p.op==="Arriendo" ? `$ ${p.price.toLocaleString("es-EC")} <small>/ mes</small>` : `$ ${p.price.toLocaleString("es-EC")}`;
  const photo = (id,w=600,h=400)=>`https://picsum.photos/seed/pe-${id}/${w}/${h}`;
  const gallery = id => [1,2,3,4,5].map(i=>`https://picsum.photos/seed/pe-${id}-${i}/1200/750`);

  let state = {
    favorites: new Set(JSON.parse(localStorage.getItem("pe-favs")||"[]")),
    currentDetail: 1,
    galIdx: 0,
    visitSlot: null,
    notifs: [
      {id:1, icn:"calendar", title:"Nueva visita confirmada", body:"María L. agendó para Casa Cumbayá Hills · Vie 10 Mayo, 11:00", time:"hace 12 min", read:false},
      {id:2, icn:"comment", title:"Consulta nueva", body:"Andrés P. preguntó por la alícuota mensual del Depto González Suárez Tower", time:"hace 38 min", read:false},
      {id:3, icn:"dollar-sign", title:"Pago confirmado", body:"Listado destacado · $ 1.200 acreditados a tu cuenta", time:"hace 1 h", read:false},
      {id:4, icn:"signature", title:"Contrato firmado", body:"Lucía R. firmó digitalmente el contrato de arriendo PE-CTR-2026-1041", time:"hace 3 h", read:true},
      {id:5, icn:"house-chimney", title:"Propiedad publicada", body:"Oficina La Carolina ya está visible en el sitio público", time:"hoy 09:14", read:true},
      {id:6, icn:"chart-line", title:"Resumen semanal", body:"Esta semana: 38 visitas, 17 leads, +22% vs anterior", time:"ayer 18:00", read:true},
    ],
    listMode:"grid", listType:"", listZone:"", listBeds:"", listBaths:"", listMinArea:0, listFeats:new Set(),
    listMin:50000, listMax:500000, listSort:"recent",
  };

  /* ---------- favorites ---------- */
  function persistFavs(){ localStorage.setItem("pe-favs", JSON.stringify([...state.favorites])); refreshAllFavMarks(); refreshFavCount(); }
  function refreshFavCount(){ const el=$("#profFavCount"); if(el) el.textContent=state.favorites.size; }
  function toggleFav(id){
    id=Number(id);
    state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);
    persistFavs();
    if(currentView()==="profile") renderFavorites();
    toast(state.favorites.has(id)?"Añadido a favoritos":"Eliminado de favoritos");
  }
  function refreshAllFavMarks(){
    $$("[data-fav]").forEach(b=>{ const id=Number(b.dataset.fav); const on=state.favorites.has(id); b.classList.toggle("on",on); const i=b.querySelector("i"); if(i){ i.classList.toggle("fa-solid",on); i.classList.toggle("fa-regular",!on); } });
  }

  /* ---------- card markup ---------- */
  function card(p, badge=true){
    const beds = p.beds>0?`<span><i class="fa-solid fa-bed"></i> ${p.beds}</span>`:"";
    const baths= p.baths>0?`<span><i class="fa-solid fa-bath"></i> ${p.baths}</span>`:"";
    const fav  = state.favorites.has(p.id);
    return `<article class="prop-card" data-prop="${p.id}">
      <div class="pc-photo">
        <img src="${photo(p.id)}" alt="${p.title}" loading="lazy">
        <div class="pc-badges">
          ${badge && p.featured ? `<span class="pc-badge">Destacado</span>`:""}
          <span class="pc-tag">${p.type}</span>
          ${p.op==="Arriendo"?`<span class="pc-tag">Arriendo</span>`:""}
        </div>
        <button class="pc-fav ${fav?"on":""}" data-fav="${p.id}" onclick="event.stopPropagation();App.toggleFav(${p.id})"><i class="fa-${fav?"solid":"regular"} fa-heart"></i></button>
      </div>
      <div class="pc-body">
        <div class="pc-zone"><i class="fa-solid fa-location-dot"></i> ${p.zone}</div>
        <h3 class="pc-title">${p.title}</h3>
        <div class="pc-specs">
          ${beds}${baths}
          <span><i class="fa-solid fa-vector-square"></i> ${p.area} m²</span>
        </div>
        <div class="pc-price">${fmtPrice(p)}</div>
      </div>
      <div class="pc-cta">Ver detalles <i class="fa-solid fa-arrow-right"></i></div>
    </article>`;
  }
  function bindCards(scope=document){
    $$(".prop-card",scope).forEach(c=>{
      c.addEventListener("click",()=>openDetail(Number(c.dataset.prop)));
    });
  }

  /* ---------- view nav ---------- */
  function currentView(){ return $(".view.active")?.dataset.view; }
  function showView(name){
    $$(".view").forEach(v=>v.classList.toggle("active", v.dataset.view===name));
    $$(".nav-link").forEach(l=>l.classList.toggle("active", l.dataset.nav===name || (name==="listings" && l.dataset.nav==="listings")));
    window.scrollTo({top:0,behavior:"instant"});
    if(name==="listings") renderListings();
    if(name==="profile") { renderFavorites(); renderMyVisits(); }
    if(name==="admin") renderAdmin();
  }
  document.addEventListener("click", e=>{
    const t = e.target.closest("[data-nav]");
    if(!t) return;
    e.preventDefault();
    showView(t.dataset.nav);
  });

  /* ---------- HOME ---------- */
  function renderHome(){
    const featured = PROPS.filter(p=>p.featured).slice(0,6);
    $("#featuredGrid").innerHTML = featured.map(p=>card(p)).join("");
    bindCards($("#featuredGrid"));
    // AI strip
    const ai = PROPS.slice(8,11);
    $("#aiStrip").innerHTML = ai.map(p=>card(p,false)).join("");
    bindCards($("#aiStrip"));
    // Map pins
    const zones = ["Quito Norte","La Carolina","González Suárez","Cumbayá","Tumbaco","Valle de los Chillos"];
    const pinPos = {"Quito Norte":{x:30,y:30},"La Carolina":{x:42,y:42},"González Suárez":{x:48,y:48},"Cumbayá":{x:74,y:55},"Tumbaco":{x:82,y:50},"Valle de los Chillos":{x:62,y:78}};
    $("#mapCanvas").innerHTML = zones.map(z=>{
      const count = PROPS.filter(p=>p.zone===z).length;
      const p = pinPos[z];
      return `<div class="map-pin" style="left:${p.x}%;top:${p.y}%" title="${z}"><span class="mp-dot"><i class="fa-solid fa-house-chimney"></i></span><span class="mp-count">${z} · ${count}</span></div>`;
    }).join("");
    // counter animation
    $$("[data-count]").forEach(el=>{
      const target=Number(el.dataset.count); let cur=0;
      const step=Math.max(1,Math.round(target/40));
      const tick=()=>{ cur=Math.min(target,cur+step); el.textContent=cur.toLocaleString("es-EC"); if(cur<target) requestAnimationFrame(tick); };
      tick();
    });
  }
  function runSearch(){
    state.listType = $("#sb-type").value;
    state.listZone = $("#sb-zone").value;
    const max = Number($("#sb-price").value)||500000;
    state.listMax = Math.min(500000, max);
    state.listOp = $("#sb-op").value;
    showView("listings");
  }

  /* ---------- LISTINGS ---------- */
  function applyFilters(){
    let arr = PROPS.slice();
    if(state.listType) arr = arr.filter(p=>p.type===state.listType);
    if(state.listZone) arr = arr.filter(p=>p.zone===state.listZone);
    if(state.listOp)   arr = arr.filter(p=>p.op===state.listOp);
    arr = arr.filter(p=>{
      if(p.op==="Arriendo") return p.price<=Math.max(5000,state.listMax/100);
      return p.price>=state.listMin && p.price<=state.listMax;
    });
    if(state.listBeds)  arr = arr.filter(p=>p.beds>=Number(state.listBeds));
    if(state.listBaths) arr = arr.filter(p=>p.baths>=Number(state.listBaths));
    if(state.listMinArea) arr = arr.filter(p=>p.area>=state.listMinArea);
    if(state.listFeats.size) arr = arr.filter(p=>[...state.listFeats].every(f=>p.feats.includes(f)));
    if(state.listSort==="asc")  arr.sort((a,b)=>a.price-b.price);
    if(state.listSort==="desc") arr.sort((a,b)=>b.price-a.price);
    return arr;
  }
  function renderListings(){
    const arr = applyFilters();
    $("#resultCount").textContent = arr.length;
    const grid = $("#listingsGrid");
    grid.classList.toggle("list-view", state.listMode==="list");
    grid.innerHTML = arr.length ? arr.map(p=>card(p)).join("") : `<div class="empty-state" style="grid-column:1/-1"><i class="fa-regular fa-face-frown"></i><h3>Sin resultados</h3><p class="muted">Prueba ajustar tus filtros para ver más opciones.</p></div>`;
    bindCards(grid);
  }
  function bindListingsControls(){
    // chip groups
    $$(".chip-group").forEach(g=>{
      g.addEventListener("click",e=>{
        const b = e.target.closest(".chip"); if(!b) return;
        $$(".chip",g).forEach(x=>x.classList.remove("active"));
        b.classList.add("active");
        const key = g.dataset.filter;
        state[key==="type"?"listType":(key==="beds"?"listBeds":"listBaths")] = b.dataset.val;
        renderListings();
      });
    });
    $("#f-zone").addEventListener("change",e=>{ state.listZone=e.target.value; renderListings(); });
    $("#f-area").addEventListener("input",e=>{ state.listMinArea=Number(e.target.value)||0; renderListings(); });
    $$('input[type="checkbox"][data-feat]').forEach(c=>{
      c.addEventListener("change",e=>{
        const f=e.target.dataset.feat;
        e.target.checked?state.listFeats.add(f):state.listFeats.delete(f);
        renderListings();
      });
    });
    const rmin=$("#rangeMin"), rmax=$("#rangeMax");
    function syncRange(){
      let mn=Number(rmin.value), mx=Number(rmax.value);
      if(mn>mx-10000){ if(this===rmin) mn=mx-10000, rmin.value=mn; else mx=mn+10000, rmax.value=mx; }
      state.listMin=mn; state.listMax=mx;
      $("#rmin").textContent="$ "+mn.toLocaleString("es-EC");
      $("#rmax").textContent="$ "+mx.toLocaleString("es-EC");
      renderListings();
    }
    rmin.addEventListener("input",syncRange); rmax.addEventListener("input",syncRange);
    $("#sortSel").addEventListener("change",e=>{ state.listSort=e.target.value; renderListings(); });
    $$(".vt").forEach(b=>b.addEventListener("click",()=>{
      $$(".vt").forEach(x=>x.classList.remove("active")); b.classList.add("active");
      state.listMode = b.dataset.viewMode; renderListings();
    }));
    $("#resetFilters").addEventListener("click",()=>{
      state.listType=state.listZone=state.listBeds=state.listBaths=state.listOp="";
      state.listMinArea=0; state.listFeats.clear(); state.listMin=50000; state.listMax=500000;
      $$(".chip-group").forEach(g=>{ $$(".chip",g).forEach((c,i)=>c.classList.toggle("active", i===0)); });
      $("#f-zone").value=""; $("#f-area").value=""; rmin.value=50000; rmax.value=500000;
      $$('input[type="checkbox"][data-feat]').forEach(c=>c.checked=false);
      $("#rmin").textContent="$ 50.000"; $("#rmax").textContent="$ 500.000";
      renderListings();
    });
    // map zone pills
    $$(".zone-pills .pill").forEach(p=>p.addEventListener("click",()=>{ $$(".zone-pills .pill").forEach(x=>x.classList.remove("active")); p.classList.add("active"); }));
  }

  /* ---------- DETAIL ---------- */
  function openDetail(id){
    state.currentDetail=id; state.galIdx=0;
    const p = PROPS.find(x=>x.id===id) || PROPS[0];
    const imgs = gallery(id);
    $("#galMain").style.backgroundImage=`url(${imgs[0]})`;
    $("#galCounter").textContent=`1 / ${imgs.length}`;
    $("#thumbStrip").innerHTML = imgs.map((u,i)=>`<div class="thumb ${i===0?"active":""}" style="background-image:url(${u})" data-i="${i}"></div>`).join("");
    $$("#thumbStrip .thumb").forEach(t=>t.addEventListener("click",()=>{ const i=Number(t.dataset.i); state.galIdx=i; updateGallery(imgs); }));
    $("#galPrev").onclick=()=>{ state.galIdx=(state.galIdx-1+imgs.length)%imgs.length; updateGallery(imgs); };
    $("#galNext").onclick=()=>{ state.galIdx=(state.galIdx+1)%imgs.length; updateGallery(imgs); };
    $("#d-title").textContent=p.title;
    $("#d-zone").textContent=p.zone;
    $("#d-price").innerHTML=fmtPrice(p);
    $("#d-op").textContent=p.op==="Arriendo"?"Arriendo / mes":"Venta";
    $("#d-beds").textContent=p.beds; $("#d-baths").textContent=p.baths; $("#d-area").textContent=p.area;
    $("#d-floor").textContent= p.type==="Casa"?2:1; $("#d-garage").textContent= p.feats.includes("Garaje")?2:0;
    $("#d-year").textContent=p.year; $("#d-loclabel").textContent=`${p.zone}, Quito`;
    $("#d-code").textContent=`PE-${1000+p.id}`;
    // amenities from feats + defaults
    const amap = {Piscina:"water-ladder","Seguridad 24h":"shield-halved",Gimnasio:"dumbbell",Jardín:"tree",Terraza:"mountain-sun",Garaje:"car",Chimenea:"fire"};
    const set = new Set([...p.feats, "Terraza"]);
    $("#d-amenities").innerHTML = [...set].map(f=>`<span class="amen"><i class="fa-solid fa-${amap[f]||"check"}"></i> ${f}</span>`).join("");
    // fav top
    const favOn = state.favorites.has(p.id);
    const favBtn = $("#favTopBtn"); favBtn.classList.toggle("on",favOn);
    favBtn.querySelector("i").className = favOn?"fa-solid fa-heart":"fa-regular fa-heart";
    favBtn.onclick = ()=>{ toggleFav(p.id); openDetail(p.id); };
    // similar
    const sim = PROPS.filter(x=>x.zone===p.zone && x.id!==p.id).slice(0,3);
    const fallback = PROPS.filter(x=>x.id!==p.id).slice(0,3);
    const arr = sim.length>=3?sim:fallback;
    $("#similarGrid").innerHTML = arr.map(x=>card(x,false)).join("");
    bindCards($("#similarGrid"));
    showView("detail");
  }
  function updateGallery(imgs){
    $("#galMain").style.backgroundImage=`url(${imgs[state.galIdx]})`;
    $("#galCounter").textContent=`${state.galIdx+1} / ${imgs.length}`;
    $$("#thumbStrip .thumb").forEach((t,i)=>t.classList.toggle("active",i===state.galIdx));
  }

  /* ---------- VISIT MODAL ---------- */
  function openModal(id){ $(`#${id}`).classList.add("on"); }
  function closeModal(el){ el.classList.remove("on"); }
  function bindModals(){
    $$(".modal").forEach(m=>{
      m.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(m)));
    });
    $("#slotGrid").addEventListener("click",e=>{
      const b=e.target.closest(".slot"); if(!b) return;
      $$("#slotGrid .slot").forEach(s=>s.classList.remove("active"));
      b.classList.add("active"); state.visitSlot=b.dataset.slot;
    });
    // default date = +2 days
    const d=new Date(Date.now()+2*86400000);
    $("#visitDate").value=d.toISOString().slice(0,10);
  }
  function openVisitModal(){ openModal("visitModal"); }
  function confirmVisit(){
    const date=$("#visitDate").value, name=$("#visitName").value.trim(), phone=$("#visitPhone").value.trim();
    if(!date || !state.visitSlot || !name || !phone){ toast("Completa todos los campos"); return; }
    closeModal($("#visitModal"));
    toast("Visita agendada · Carlos te contactará en breve");
    // add to my visits
    const p = PROPS.find(x=>x.id===state.currentDetail);
    state.myVisits = state.myVisits || [];
    state.myVisits.unshift({prop:p,date,time:state.visitSlot,status:"Pendiente"});
  }

  /* ---------- ADMIN ---------- */
  function renderAdmin(){
    renderPropsTable();
    renderVisitasTable();
    renderClients();
    renderNotifList();
  }
  function renderPropsTable(filter=""){
    const arr = PROPS.filter(p=>!filter || p.title.toLowerCase().includes(filter.toLowerCase()) || p.zone.toLowerCase().includes(filter.toLowerCase()));
    $("#propsCount").textContent = arr.length;
    $("#propsBody").innerHTML = arr.map(p=>`
      <tr data-row="${p.id}">
        <td><img class="row-thumb" src="${photo(p.id,120,80)}"></td>
        <td><strong>${p.title}</strong></td>
        <td>${p.zone}</td>
        <td>$ ${p.price.toLocaleString("es-EC")}</td>
        <td>${p.type}</td>
        <td><span class="switch ${p.active===false?"":"on"}" onclick="this.classList.toggle('on')"></span></td>
        <td class="ta-r"><div class="row-actions"><button title="Ver" onclick="App.openDetailFromAdmin(${p.id})"><i class="fa-regular fa-eye"></i></button><button title="Editar"><i class="fa-solid fa-pen"></i></button><button class="del" title="Eliminar" onclick="App.delProp(${p.id})"><i class="fa-regular fa-trash-can"></i></button></div></td>
      </tr>`).join("");
  }
  function delProp(id){
    const i = PROPS.findIndex(p=>p.id===id);
    if(i<0) return;
    if(!confirm("¿Eliminar esta propiedad?")) return;
    PROPS.splice(i,1); renderPropsTable(); toast("Propiedad eliminada");
  }
  function openDetailFromAdmin(id){ showView("detail"); openDetail(id); }
  function addPropertyRow(){ openModal("propModal"); }
  function saveNewProp(){
    const t=$("#np-title").value.trim();
    if(!t){ toast("Falta el título"); return; }
    const newP = {
      id: Math.max(...PROPS.map(p=>p.id))+1,
      title:t, type:$("#np-type").value, zone:$("#np-zone").value, op:$("#np-op").value,
      price: Number($("#np-price").value)||100000,
      beds:Number($("#np-beds").value)||0, baths:Number($("#np-baths").value)||0,
      area:Number($("#np-area").value)||100, year:2024, featured:false, feats:[], pin:{x:50,y:50}
    };
    PROPS.unshift(newP); closeModal($("#propModal")); renderPropsTable();
    toast("Propiedad agregada"); $("#np-title").value="";
  }
  function renderVisitasTable(){
    const data = [
      {c:"María González",p:"Casa Cumbayá Hills",         d:"Vie 10 May", t:"11:00", s:"Confirmada"},
      {c:"Andrés Paredes", p:"Depto González Suárez",     d:"Sáb 11 May", t:"15:00", s:"Pendiente"},
      {c:"Lucía Romero",   p:"Penthouse La Carolina",     d:"Dom 12 May", t:"09:00", s:"Confirmada"},
      {c:"Pedro Salinas",  p:"Loft Tumbaco",              d:"Lun 13 May", t:"17:00", s:"Cancelada"},
      {c:"Carla Vinueza",  p:"Casa Valle de los Chillos", d:"Mar 14 May", t:"11:00", s:"Confirmada"},
      {c:"Diego Erazo",    p:"Oficina La Carolina",       d:"Mié 15 May", t:"15:00", s:"Pendiente"},
    ];
    const cls = s=>s==="Confirmada"?"ok":(s==="Pendiente"?"warn":"err");
    $("#visitasBody").innerHTML = data.map(v=>`<tr>
      <td><strong>${v.c}</strong></td><td>${v.p}</td><td>${v.d}</td><td>${v.t}</td>
      <td><span class="badge ${cls(v.s)}">${v.s}</span></td>
      <td class="ta-r"><div class="row-actions"><button title="Ver"><i class="fa-regular fa-eye"></i></button><button title="Reagendar"><i class="fa-regular fa-calendar"></i></button><button class="del" title="Cancelar"><i class="fa-solid fa-xmark"></i></button></div></td>
    </tr>`).join("");
  }
  function renderClients(){
    const data = [
      ["María González","Cliente activo · 4 visitas","maria"],
      ["Andrés Paredes","Lead caliente · 2 consultas","andres"],
      ["Lucía Romero","Contrato firmado · arriendo","lucia"],
      ["Pedro Salinas","Lead nuevo","pedro"],
      ["Carla Vinueza","Cliente recurrente","carla"],
      ["Diego Erazo","Lead frío","diego"],
      ["Sofía Mantilla","Cliente activo · 1 visita","sofia"],
      ["Juan Carlos T.","Inversionista","juancarlos"],
    ];
    $("#clientGrid").innerHTML = data.map(([n,m,s])=>`<div class="client-card">
      <img src="https://picsum.photos/seed/${s}/120/120">
      <div><div class="cl-name">${n}</div><div class="cl-meta">${m}</div></div>
    </div>`).join("");
  }
  function renderNotifList(){
    const icnMap={calendar:"calendar",comment:"comments","dollar-sign":"dollar-sign",signature:"signature","house-chimney":"house-chimney","chart-line":"chart-line"};
    $("#notifList").innerHTML = state.notifs.map(n=>`<li class="${n.read?"read":""}" data-nid="${n.id}">
      <span class="nf-dot"></span>
      <span class="nf-icn"><i class="fa-solid fa-${icnMap[n.icn]||"bell"}"></i></span>
      <div class="nf-body"><strong>${n.title}</strong><div class="muted sm">${n.body}</div></div>
      <span class="nf-time">${n.time}</span>
    </li>`).join("");
    $("#notifUnread").textContent = state.notifs.filter(n=>!n.read).length;
    $$("#notifList li").forEach(li=>li.addEventListener("click",()=>{
      const n=state.notifs.find(x=>x.id===Number(li.dataset.nid)); if(!n) return; n.read=true; renderNotifList();
    }));
  }
  function markAllRead(){ state.notifs.forEach(n=>n.read=true); renderNotifList(); toast("Notificaciones leídas"); }
  function bindAdminNav(){
    $$(".anav").forEach(a=>a.addEventListener("click",()=>{
      $$(".anav").forEach(x=>x.classList.remove("active")); a.classList.add("active");
      const key=a.dataset.admin;
      $$(".apanel").forEach(p=>p.classList.toggle("active", p.dataset.apanel===key));
    }));
    $("#adminPropSearch").addEventListener("input",e=>renderPropsTable(e.target.value));
  }

  /* ---------- PROFILE ---------- */
  function renderFavorites(){
    const arr = [...state.favorites].map(id=>PROPS.find(p=>p.id===id)).filter(Boolean);
    refreshFavCount();
    $("#favEmpty").style.display = arr.length?"none":"block";
    $("#favGrid").innerHTML = arr.map(p=>card(p,false)).join("");
    bindCards($("#favGrid"));
  }
  function renderMyVisits(){
    const visits = state.myVisits || [
      {prop:PROPS[0], date:"2026-05-12", time:"11:00", status:"Confirmada"},
      {prop:PROPS[2], date:"2026-05-15", time:"15:00", status:"Pendiente"},
      {prop:PROPS[4], date:"2026-05-18", time:"09:00", status:"Confirmada"},
    ];
    const cls = s=>s==="Confirmada"?"ok":(s==="Pendiente"?"warn":"err");
    $("#myVisits").innerHTML = visits.map((v,i)=>`<li class="card">
      <div class="vl-info">
        <strong>${v.prop.title}</strong>
        <div class="vl-meta"><i class="fa-solid fa-location-dot"></i>${v.prop.zone} <i class="fa-regular fa-calendar" style="margin-left:14px"></i>${new Date(v.date).toLocaleDateString("es-EC",{weekday:"long",day:"numeric",month:"long"})} · ${v.time}</div>
      </div>
      <div style="display:flex;gap:10px;align-items:center"><span class="badge ${cls(v.status)}">${v.status}</span><button class="btn btn-ghost" onclick="this.closest('li').remove()"><i class="fa-solid fa-xmark"></i> Cancelar</button></div>
    </li>`).join("");
  }
  function bindTabs(){
    $$(".tab").forEach(t=>t.addEventListener("click",()=>{
      $$(".tab").forEach(x=>x.classList.remove("active")); t.classList.add("active");
      const k=t.dataset.tab;
      $$(".tab-panel").forEach(p=>p.classList.toggle("active", p.dataset.tabpanel===k));
    }));
  }

  /* ---------- PAYMENT ---------- */
  function bindPayment(){
    const num=$("#payCard"), exp=$("#payExp"), cvv=$("#payCvv"), name=$("#payName");
    num.addEventListener("input",()=>{
      let v=num.value.replace(/\D/g,"").slice(0,16);
      num.value = v.match(/.{1,4}/g)?.join(" ")||"";
      $("#ccNum").textContent = (num.value||"•••• •••• •••• ••••").padEnd(19,"•");
    });
    exp.addEventListener("input",()=>{
      let v=exp.value.replace(/\D/g,"").slice(0,4);
      if(v.length>=3) v=v.slice(0,2)+"/"+v.slice(2);
      exp.value=v; $("#ccExp").textContent=v||"MM/AA";
    });
    cvv.addEventListener("input",()=>{ cvv.value=cvv.value.replace(/\D/g,"").slice(0,4); });
    name.addEventListener("input",()=>{ $("#ccName").textContent=(name.value||"NOMBRE APELLIDO").toUpperCase(); });
  }
  function completePayment(){
    if(!$("#payCard").value || !$("#payExp").value || !$("#payCvv").value || !$("#payName").value){
      toast("Completa los datos de la tarjeta"); return;
    }
    toast("Pago procesado · redirigiendo a firma…");
    setTimeout(()=>showView("signature"),900);
  }

  /* ---------- SIGNATURE ---------- */
  function bindSignature(){
    const c=$("#sigPad"), ctx=c.getContext("2d");
    function resize(){
      const r=c.getBoundingClientRect(); const dpr=window.devicePixelRatio||1;
      const data = c.width&&c.height ? ctx.getImageData(0,0,c.width,c.height) : null;
      c.width=r.width*dpr; c.height=r.height*dpr; ctx.scale(dpr,dpr);
      ctx.lineWidth=2.4; ctx.lineCap="round"; ctx.lineJoin="round"; ctx.strokeStyle="#0a0a0a";
    }
    let drawing=false, last=null;
    function pos(ev){
      const r=c.getBoundingClientRect();
      const t = ev.touches?ev.touches[0]:ev;
      return {x:t.clientX-r.left, y:t.clientY-r.top};
    }
    function start(ev){ drawing=true; last=pos(ev); ev.preventDefault(); }
    function move(ev){
      if(!drawing) return;
      const p=pos(ev);
      ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(p.x,p.y); ctx.stroke();
      last=p; ev.preventDefault();
    }
    function end(){ drawing=false; }
    c.addEventListener("mousedown",start); c.addEventListener("mousemove",move);
    window.addEventListener("mouseup",end);
    c.addEventListener("touchstart",start,{passive:false});
    c.addEventListener("touchmove",move,{passive:false});
    c.addEventListener("touchend",end);
    new ResizeObserver(resize).observe(c); resize();

    $("#sigClear").addEventListener("click",()=>ctx.clearRect(0,0,c.width,c.height));
    $("#sigConfirm").addEventListener("click",()=>{
      // detect non-empty
      const px = ctx.getImageData(0,0,c.width,c.height).data;
      let hasInk=false;
      for(let i=3;i<px.length;i+=400){ if(px[i]>0){ hasInk=true; break; } }
      if(!hasInk){ toast("Por favor firma antes de continuar"); return; }
      const id="PE-CTR-2026-1042";
      const stamp=new Date().toLocaleString("es-EC",{dateStyle:"long",timeStyle:"short"});
      const hash = "0x"+Math.random().toString(16).slice(2,10)+Math.random().toString(16).slice(2,10);
      $("#sigDocId").textContent=id; $("#sigStamp").textContent=stamp; $("#sigHash").textContent=hash;
      $("#sigCard").style.display="none";
      $(".sig-success").classList.add("on");
      toast("Documento firmado correctamente");
    });
  }

  /* ---------- TOAST + UI helpers ---------- */
  let toastTimer;
  function toast(msg){
    $("#toastMsg").textContent=msg;
    $("#toast").classList.add("on");
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>$("#toast").classList.remove("on"),2400);
  }

  /* ---------- NAV scroll + hamburger ---------- */
  function bindHeader(){
    window.addEventListener("scroll",()=>{ $("#navbar").classList.toggle("scrolled", window.scrollY>10); });
    $("#hamburger").addEventListener("click",()=>{ $("#navLinks").classList.toggle("open"); });
  }

  /* ---------- INIT ---------- */
  function init(){
    renderHome();
    bindListingsControls();
    bindModals();
    bindAdminNav();
    bindTabs();
    bindPayment();
    bindSignature();
    bindHeader();
    renderListings();
    refreshFavCount();
    // welcome toast
    setTimeout(()=>toast("Bienvenido a Premier Estates"),700);
  }
  document.addEventListener("DOMContentLoaded",init);

  return { runSearch, openDetail, openVisitModal, confirmVisit, toggleFav, addPropertyRow, saveNewProp, delProp, openDetailFromAdmin, markAllRead, completePayment };
})();
