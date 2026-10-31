/* Тема и сезонные эффекты (сезон берётся из даты на устройстве) */
const ls={get:(k,d)=>{try{return localStorage.getItem(k)??d}catch{return d}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
let theme=ls.get("viva_theme","auto"),fx=ls.get("viva_fx",matchMedia("(prefers-reduced-motion:reduce)").matches?"off":"auto");
const mqDark=matchMedia("(prefers-color-scheme:dark)");
function applyTheme(){document.documentElement.dataset.theme=theme==="dark"||(theme==="auto"&&mqDark.matches)?"dark":"light"}
mqDark.addEventListener("change",applyTheme);

/* сезон: зима — снег, весна и лето — солнце, осень — дождь; в южном полушарии сдвиг на полгода (по часовому поясу) */
const SOUTH=/^(Australia|Pacific\/Auckland|America\/(Sao_Paulo|Argentina|Santiago|Montevideo)|Africa\/Johannesburg)/;
function season(){
 let m=new Date().getMonth();
 try{if(SOUTH.test(Intl.DateTimeFormat().resolvedOptions().timeZone))m=(m+6)%12}catch{}
 return m<2||m===11?"winter":m<5?"spring":m<8?"summer":"autumn";
}
const SEASON={winter:["snow","Зима ❄️"],spring:["sun","Весна 🌸"],summer:["sun","Лето ☀️"],autumn:["rain","Осень 🍂"]};
const NAME={snow:"снег",rain:"дождь",sun:"солнце",off:"выкл"};
const mode=()=>fx==="auto"?SEASON[season()][0]:fx;
const petals=()=>season()==="spring";

const cv=document.createElement("canvas");cv.id="fx";document.body.appendChild(cv);
const g=cv.getContext("2d");let W,H,parts=[],raf=0,cur="off";
function size(){const d=devicePixelRatio||1;W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;g.setTransform(d,0,0,d,0,0)}
function mk(first){
 const x=Math.random()*W,r=Math.random;
 if(cur==="rain")return{x:x*1.15,y:first?r()*H:-30,l:10+r()*14,v:12+r()*10};
 if(cur==="snow")return{x,y:first?r()*H:-10,r:1+r()*3,v:.6+r()*1.4,s:r()*6.28,a:.5+r()*.5};
 const p=petals();
 return{x,y:first?r()*H:(p?-10:H+10),r:p?3+r()*3:1+r()*2,v:p?.6+r()*1.2:-(.15+r()*.35),s:r()*6.28,a:.5+r()*.5};
}
function frame(){
 g.clearRect(0,0,W,H);const dark=document.documentElement.dataset.theme==="dark";
 if(cur==="rain"){
  g.strokeStyle=dark?"rgba(170,200,255,.45)":"rgba(70,110,190,.5)";g.lineWidth=1;g.beginPath();
  for(const p of parts){g.moveTo(p.x,p.y);g.lineTo(p.x-p.l*.15,p.y+p.l);p.y+=p.v;p.x-=p.v*.15;if(p.y>H)Object.assign(p,mk(false))}
  g.stroke();
 }else if(cur==="snow"){
  g.fillStyle=dark?"#fff":"#a9c4ee";
  for(const p of parts){g.globalAlpha=p.a;g.beginPath();g.arc(p.x+Math.sin(p.s)*12,p.y,p.r,0,6.283);g.fill();p.y+=p.v;p.s+=.012;if(p.y>H+5)Object.assign(p,mk(false))}
  g.globalAlpha=1;
 }else{
  const cx=W*.92,cy=-20,t=Date.now()/1000,gr=g.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*.55);
  gr.addColorStop(0,dark?"rgba(255,200,90,.22)":"rgba(255,205,80,.45)");gr.addColorStop(1,"rgba(255,205,80,0)");
  g.fillStyle=gr;g.fillRect(0,0,W,H);
  g.save();g.translate(cx,cy);g.rotate(t*.05);g.fillStyle=dark?"rgba(255,210,120,.05)":"rgba(255,200,60,.10)";
  for(let i=0;i<12;i++){g.rotate(Math.PI/6);g.beginPath();g.moveTo(0,0);g.lineTo(H*1.2,-60);g.lineTo(H*1.2,60);g.fill()}
  g.restore();
  const pt=petals();g.fillStyle=pt?"#f4a6c3":"#ffd36b";
  for(const p of parts){
   g.globalAlpha=pt?.8:p.a*(.6+.4*Math.sin(t*2+p.s));g.beginPath();
   if(pt)g.ellipse(p.x+Math.sin(p.s)*20,p.y,p.r,p.r*.55,p.s,0,6.283);else g.arc(p.x+Math.sin(p.s)*10,p.y,p.r,0,6.283);
   g.fill();p.y+=p.v;p.s+=.012;if(p.y>H+10||p.y<-12)Object.assign(p,mk(false));
  }
  g.globalAlpha=1;
 }
 raf=requestAnimationFrame(frame);
}
function applyFx(){
 cancelAnimationFrame(raf);cur=mode();g.clearRect(0,0,cv.width,cv.height);
 if(cur==="off"){cv.style.display="none";return}
 cv.style.display="block";size();
 const n=cur==="rain"?W/8:cur==="snow"?W/12:W/30;
 parts=Array.from({length:Math.min(Math.round(n),160)},()=>mk(true));frame();
}
addEventListener("resize",()=>{if(cur!=="off")applyFx()});
// дата могла смениться (вкладка долго открыта) — перепроверяем сезон
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&mode()!==cur)applyFx()});
setInterval(()=>{if(mode()!==cur)applyFx()},36e5);

function settingsModal(){
 const seg=(key,cur,opts)=>`<div class="seg">${opts.map(([v,t])=>`<button data-set="${key}:${v}" class="${cur===v?"on":""}">${t}</button>`).join("")}</div>`;
 openModal(`<h3>Настройки</h3><p class="sub">Тема оформления и эффекты</p><strong>Тема</strong>
${seg("theme",theme,[["auto","Как на устройстве"],["light","☀️ Светлая"],["dark","🌙 Тёмная"]])}
<strong>Эффекты</strong>${seg("fx",fx,[["auto","🗓️ По сезону"],["off","Выкл"],["snow","❄️ Снег"],["rain","🌧️ Дождь"],["sun","☀️ Солнце"]])}
<p class="sub">Сейчас: ${SEASON[season()][1]} — эффект «${NAME[mode()]}»${fx==="auto"?" (подобран по дате на устройстве)":""}</p>
<button class="btn alt" data-act="close">Готово</button>`);
}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-set]");if(!b)return;
 const[k,v]=b.dataset.set.split(":");
 if(k==="theme"){theme=v;ls.set("viva_theme",v);applyTheme()}else{fx=v;ls.set("viva_fx",v);applyFx()}
 settingsModal();
});
const fab=document.createElement("button");fab.className="fab";fab.id="fab";fab.textContent="⚙";fab.setAttribute("aria-label","Настройки");
fab.onclick=settingsModal;document.body.appendChild(fab);
applyTheme();applyFx();
