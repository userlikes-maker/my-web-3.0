// [id, название, категория, цена, старая цена, рейтинг, отзывы, эмодзи-заглушка, id фото на Unsplash]
const P=[
[1,"Мини-лампа с сенсорным управлением","home",799,1290,4.9,1842,"💡","photo-1507473885765-e6ed057f782c"],
[2,"Беспроводные наушники Air Mini","gadgets",1490,2490,4.8,921,"🎧","photo-1505740420928-5e560c06d30e"],
[3,"Женская базовая сумка","accessories",1190,1990,4.7,763,"👜","photo-1584917865442-de89df76afd3"],
[4,"Оверсайз худи Soft Touch","fashion",1690,2990,4.9,2301,"🧥","photo-1556821840-3a63f95609a7"],
[5,"Умные LED-часы","gadgets",2190,3890,4.6,438,"⌚","photo-1523275335684-37898b6baf30"],
[6,"Органайзер для косметики","beauty",690,990,4.8,1104,"💄","photo-1596462502278-27bfdc403348"],
[7,"Ночник-проектор звёздного неба","home",990,1590,4.9,2500,"🌌","photo-1534796636912-3b95b3ab5986"],
[8,"Рюкзак Urban Daily","accessories",1390,2290,4.8,652,"🎒","photo-1553062407-98eeb64c6a62"],
[9,"Керамическая кружка","home",490,790,4.7,1887,"☕","photo-1514228742587-6b1558fcca3d"],
[10,"Солнцезащитные очки","accessories",890,1490,4.8,932,"🕶️","photo-1511499767150-a48a237f0083"],
[11,"Флисовый плед","home",990,1690,4.8,1320,"🛋️"],
[12,"Увлажнитель воздуха","home",1490,2490,4.6,510,"💧"],
[13,"Набор полотенец","home",1190,1890,4.7,844,"🧺"],
[14,"Сыворотка с витамином C","beauty",690,1190,4.8,1650,"🧴"],
[15,"Набор кистей для макияжа","beauty",890,1490,4.7,978,"🖌️"],
[16,"Массажёр для лица","beauty",1090,1790,4.6,402,"🪞"],
[17,"Фен-стайлер 5 в 1","beauty",2390,3990,4.8,730,"💨"],
[18,"Базовая футболка","fashion",590,990,4.7,3120,"👕"],
[19,"Джинсы прямого кроя","fashion",1990,3290,4.6,1215,"👖"],
[20,"Куртка-бомбер","fashion",2890,4890,4.7,560,"🧥"],
[21,"Кроссовки Run Light","fashion",2490,3990,4.8,1940,"👟"],
[22,"Повербанк 20000 mAh","gadgets",1390,2190,4.9,2780,"🔋"],
[23,"Умная колонка Mini","gadgets",1790,2990,4.5,356,"🔊"],
[24,"Чехол для смартфона","gadgets",390,790,4.6,4100,"📱"],
[25,"Конструктор «Город»","kids",1290,2190,4.9,1530,"🧱"],
[26,"Мягкая игрушка Мишка","kids",790,1390,4.8,2210,"🧸"],
[27,"Детский рюкзак","kids",990,1690,4.7,690,"🎒"],
[28,"Набор для рисования","kids",590,990,4.8,1380,"🎨"],
[29,"Шерстяной шарф","accessories",790,1390,4.7,470,"🧣"],
[30,"Кошелёк Compact","accessories",690,1190,4.6,615,"👛"]
];
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=n=>new Intl.NumberFormat("ru-RU").format(n)+" ₽";
const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const KW={1:"desk,lamp",2:"wireless,earbuds",3:"handbag",4:"hoodie",5:"smartwatch",6:"makeup,organizer",7:"night,sky,stars",8:"backpack",9:"ceramic,mug",10:"sunglasses",11:"blanket",12:"humidifier",13:"towels",14:"serum,skincare",15:"makeup,brushes",16:"face,massager",17:"hair,dryer",18:"tshirt",19:"jeans",20:"bomber,jacket",21:"sneakers",22:"power,bank",23:"smart,speaker",24:"phone,case",25:"lego,bricks",26:"teddy,bear",27:"kids,backpack",28:"kids,drawing",29:"wool,scarf",30:"leather,wallet"};
const fl=(id,n)=>`https://loremflickr.com/700/700/${KW[id]}?lock=${id*10+n}`;
const UP={11:["c_hwcFTM6ts"],21:["bySPt2lySzg","jKZ8qO6juik","W0iDskWnbYc"]}; // id фото на unsplash.com/photos/<id>
const us=i=>`https://unsplash.com/photos/${i}/download?force=true&w=700`;
const products=P.map(([id,name,cat,price,old,rating,reviews,emoji,ph])=>{
 // для каждого кадра: список запасных ссылок — если первая не загрузилась, пробуем следующую, затем эмодзи
 const imgs=[0,1,2].map(n=>[n===0&&ph?`https://images.unsplash.com/${ph}?auto=format&fit=crop&w=700&q=80`:(UP[id]&&UP[id][n]?us(UP[id][n]):null),fl(id,n)].filter(Boolean));
 return{id,name,cat,price,old,rating,reviews,emoji,imgs,discount:"−"+Math.round(100-price/old*100)+"%"}});
const byId=id=>products.find(p=>p.id===id);
let cart=load("viva_cart",[]).filter(i=>byId(i.id)),liked=new Set(load("viva_liked",[])),user=load("viva_session",null),pendingCheckout=false;
const S={cat:"all",q:"",sort:"popular",fav:false};
const norm=s=>String(s).toLowerCase().replace(/ё/g,"е");
const CATN={fashion:"одежда",home:"для дома",beauty:"красота",gadgets:"гаджеты",kids:"детям",accessories:"аксессуары"};
const match=(p,q)=>!q||q.split(/\s+/).every(w=>norm(p.name+" "+CATN[p.cat]).includes(w));
function hl(t){if(!S.q)return esc(t);const n=norm(t),m=[];S.q.split(/\s+/).forEach(w=>{if(!w)return;let i=-1;while((i=n.indexOf(w,i+1))>-1)for(let k=i;k<i+w.length;k++)m[k]=1});
 let o="";for(let k=0;k<t.length;k++){if(m[k]&&!m[k-1])o+="<mark>";o+=esc(t[k]);if(m[k]&&!m[k+1])o+="</mark>"}return o}


function imgFail(el){const r=JSON.parse(el.dataset.fb||"[]");if(r.length){el.dataset.fb=JSON.stringify(r.slice(1));el.src=r[0]}else el.remove()}
const imgTag=(l,alt="")=>`<img src="${l[0]}" alt="${esc(alt)}" loading="lazy" data-fb="${esc(JSON.stringify(l.slice(1)))}" onerror="imgFail(this)">`;
const pic=(p,alt="")=>`<span class="ph">${p.emoji}</span>${imgTag(p.imgs[0],alt)}`;
function toast(t){const e=$("toast");e.textContent=t;e.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("show"),2200)}

/* ---------- каталог ---------- */
function view(){
 const l=products.filter(p=>(S.cat==="all"||p.cat===S.cat)&&(!S.fav||liked.has(p.id))&&match(p,S.q));
 return S.sort==="price"?l.sort((a,b)=>a.price-b.price):l.sort((a,b)=>b.reviews-a.reviews);
}
const card=p=>`<article class="product"><div class="photo" data-act="open" data-id="${p.id}">${pic(p,p.name)}<span class="discount">${p.discount}</span>
<button class="heart ${liked.has(p.id)?"liked":""}" data-act="like" data-id="${p.id}" aria-label="В избранное">${liked.has(p.id)?"♥":"♡"}</button></div>
<div class="info"><h3 data-act="open" data-id="${p.id}">${hl(p.name)}</h3><div class="rating">★ ${p.rating} <span class="reviews">(${p.reviews})</span></div>
<div class="price"><span class="new-price">${money(p.price)}</span><span class="old-price">${money(p.old)}</span></div>
<button class="add" data-act="add" data-id="${p.id}">В корзину</button></div></article>`;
function render(){
 const l=view();
 $("products").innerHTML=l.length?l.map(card).join(""):`<p class="empty">${S.fav?"В избранном пока ничего нет. Нажми ♡ на товаре.":"Ничего не найдено. Попробуй другой запрос."}</p>`;
 $("resCount").textContent=S.q?`Найдено товаров: ${l.length}`:"";
 $("catalogTitle").textContent=S.fav?"Избранное ♥":"Хиты продаж 🔥";
 document.querySelectorAll(".categories a").forEach(a=>a.classList.toggle("active",!S.fav&&a.dataset.cat===S.cat));
 document.querySelectorAll(".sort-btn").forEach(b=>b.classList.toggle("active",b.dataset.sort===S.sort));
 $("favoritesBtn").classList.toggle("on",S.fav);
 setNav(S.fav?"fav":"home");
}
function setNav(n){document.querySelectorAll(".mobile-nav a").forEach(a=>a.classList.toggle("active",a.dataset.nav===n))}
const toCatalog=()=>$("catalog").scrollIntoView({behavior:"smooth"});
function setFav(on){S.fav=on;if(on)S.cat="all";render();toCatalog()}

/* ---------- корзина ---------- */
function add(id){const i=cart.find(x=>x.id===id);i?i.qty=Math.min(99,i.qty+1):cart.push({id,qty:1});updateCart();openCart()}
function chg(id,d){const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);updateCart()}
function updateCart(){
 const rows=cart.map(i=>({p:byId(i.id),q:i.qty}));
 $("cartCount").textContent=rows.reduce((s,r)=>s+r.q,0);
 $("cartItems").innerHTML=rows.length?rows.map(({p,q})=>`<div class="cart-item"><div class="ci-img">${pic(p)}</div><div class="ci-info"><h4>${esc(p.name)}</h4><p>${money(p.price*q)}</p>
<div class="qty"><button data-act="dec" data-id="${p.id}">−</button><b>${q}</b><button data-act="inc" data-id="${p.id}">+</button><button class="rm" data-act="rm" data-id="${p.id}">Удалить</button></div></div></div>`).join(""):`<p class="empty">Корзина пока пуста.</p>`;
 $("cartTotal").textContent=money(rows.reduce((s,r)=>s+r.p.price*r.q,0));
 save("viva_cart",cart);
}
const openCart=()=>{$("cart").classList.add("open");$("overlay").classList.add("show")};
const closeCart=()=>{$("cart").classList.remove("open");$("overlay").classList.remove("show")};

/* ---------- модальные окна ---------- */
function openModal(html,cls=""){$("modalBox").className="modal-box "+cls;$("modalBox").innerHTML=html;$("modal").classList.add("show")}
const closeModal=()=>$("modal").classList.remove("show");
$("modal").addEventListener("mousedown",e=>{if(e.target===$("modal"))closeModal()});

async function hash(s){
 try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode("viva:"+s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
 catch{return btoa(unescape(encodeURIComponent("viva:"+s)))}
}
function setUser(u){user=u;save("viva_session",u);$("userLabel").textContent=u?u.name.split(" ")[0]:"Войти"}

function authModal(mode="login"){
 const reg=mode==="register";
 openModal(`<h3>${reg?"Регистрация":"Вход"}</h3><p class="sub">${pendingCheckout?"Войди, чтобы оформить заказ.":"Личный кабинет VIVA"}</p>
<div class="tabs"><button class="${reg?"":"on"}" data-act="tab" data-mode="login">Вход</button><button class="${reg?"on":""}" data-act="tab" data-mode="register">Регистрация</button></div>
<form id="authForm" novalidate>${reg?`<label>Имя</label><input name="name" autocomplete="name" required>`:""}
<label>Email</label><input name="email" type="email" autocomplete="email" required>
<label>Пароль${reg?" (от 6 символов)":""}</label><input name="password" type="password" autocomplete="${reg?"new-password":"current-password"}" required>
<p class="err" id="authErr"></p><button class="btn" type="submit">${reg?"Создать аккаунт":"Войти"}</button></form>`);
 $("authForm").onsubmit=async e=>{
  e.preventDefault();
  const f=new FormData(e.target),name=(f.get("name")||"").trim(),email=f.get("email").trim().toLowerCase(),pass=f.get("password"),err=m=>$("authErr").textContent=m;
  const users=load("viva_users",[]);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return err("Введи корректный email");
  if(reg){
   if(name.length<2)return err("Введи имя");
   if(pass.length<6)return err("Пароль должен быть не короче 6 символов");
   if(users.some(u=>u.email===email))return err("Этот email уже зарегистрирован");
   users.push({name,email,hash:await hash(pass)});save("viva_users",users);setUser({name,email});
  }else{
   const u=users.find(x=>x.email===email);
   if(!u||u.hash!==await hash(pass))return err("Неверный email или пароль");
   setUser({name:u.name,email});
  }
  closeModal();toast("Добро пожаловать, "+user.name+"!");
  if(pendingCheckout){pendingCheckout=false;checkoutModal()}
 };
}
function accountModal(){
 if(!user)return authModal("login");
 const orders=load("viva_orders",[]).filter(o=>o.email===user.email).reverse();
 openModal(`<h3>${esc(user.name)}</h3><p class="sub">${esc(user.email)}</p><strong>Мои заказы</strong>
${orders.length?orders.map(o=>`<div class="order"><b>Заказ №${o.id}</b> · ${money(o.total)}<br><small>${o.date} · ${o.count} шт.</small></div>`).join(""):`<p class="sub" style="margin-top:8px">Заказов пока нет.</p>`}
<button class="btn alt" data-act="logout">Выйти</button>`);
}
function checkoutModal(){
 openModal(`<h3>Оформление заказа</h3><p class="sub">Итого: ${$("cartTotal").textContent}</p>
<form id="orderForm" novalidate><label>Телефон</label><input name="phone" type="tel" autocomplete="tel" placeholder="+7 900 000-00-00">
<label>Адрес доставки</label><input name="address" autocomplete="street-address"><p class="err" id="orderErr"></p><button class="btn" type="submit">Подтвердить заказ</button></form>`);
 $("orderForm").onsubmit=e=>{
  e.preventDefault();const f=new FormData(e.target),phone=f.get("phone").trim(),address=f.get("address").trim();
  if(phone.replace(/\D/g,"").length<10)return $("orderErr").textContent="Введи корректный телефон";
  if(address.length<5)return $("orderErr").textContent="Введи адрес доставки";
  const total=cart.reduce((s,i)=>s+byId(i.id).price*i.qty,0),count=cart.reduce((s,i)=>s+i.qty,0),orders=load("viva_orders",[]);
  const o={id:1000+orders.length+1,email:user.email,date:new Date().toLocaleDateString("ru-RU"),total,count,phone,address};
  orders.push(o);save("viva_orders",orders);cart=[];updateCart();
  openModal(`<h3>Заказ №${o.id} оформлен ✓</h3><p class="sub">Сумма ${money(total)}. Это демо-магазин, оплата не списывается.</p><button class="btn" data-act="close">Отлично</button>`);
 };
}

function productModal(id,i=0){
 const p=byId(id);
 openModal(`<div class="pm-main"><span class="ph">${p.emoji}</span>${imgTag(p.imgs[i],p.name)}</div>
<div class="pm-th">${p.imgs.map((u,k)=>`<button class="${k===i?"on":""}" data-act="thumb" data-id="${p.id}" data-i="${k}">${imgTag(u)}</button>`).join("")}</div>
<h3>${esc(p.name)}</h3><div class="rating">★ ${p.rating} <span class="reviews">(${p.reviews} отзывов)</span></div>
<div class="price"><span class="new-price">${money(p.price)}</span><span class="old-price">${money(p.old)}</span><span class="discount" style="position:static">${p.discount}</span></div>
<button class="btn" data-act="add" data-id="${p.id}">В корзину</button>`,"wide");
}
/* ---------- события ---------- */
document.addEventListener("click",e=>{
 if(!e.target.closest(".search-wrap"))hideSg();
 const b=e.target.closest("[data-act]");if(!b)return;const id=+b.dataset.id;
 switch(b.dataset.act){
  case"like":liked.has(id)?liked.delete(id):liked.add(id);save("viva_liked",[...liked]);render();break;
  case"add":closeModal();add(id);break;case"open":hideSg();productModal(id);break;case"thumb":productModal(id,+b.dataset.i);break;case"inc":chg(id,1);break;case"dec":chg(id,-1);break;case"rm":chg(id,-99);break;
  case"tab":authModal(b.dataset.mode);break;
  case"logout":setUser(null);pendingCheckout=false;closeModal();toast("Вы вышли из аккаунта");break;
  case"close":closeModal();closeCart();break;
 }
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();closeCart()}});
$("cartBtn").onclick=openCart;$("closeCart").onclick=closeCart;$("overlay").onclick=closeCart;
$("userBtn").onclick=()=>user?accountModal():authModal("login");
$("favoritesBtn").onclick=()=>setFav(!S.fav);
$("checkoutBtn").onclick=()=>{
 if(!cart.length)return toast("Корзина пуста");
 closeCart();
 if(!user){pendingCheckout=true;authModal("login")}else checkoutModal();
};
const sg=$("suggest"),hideSg=()=>sg.classList.remove("show");
function showSg(){if(!S.q)return hideSg();const l=products.filter(p=>match(p,S.q)).sort((a,b)=>b.reviews-a.reviews).slice(0,5);
 sg.innerHTML=l.length?l.map(p=>`<button class="sg" data-act="open" data-id="${p.id}"><span>${p.emoji}</span><span>${hl(p.name)}</span><b>${money(p.price)}</b></button>`).join(""):`<div class="sg">Ничего не найдено</div>`;sg.classList.add("show")}
$("searchInput").addEventListener("input",e=>{S.q=norm(e.target.value.trim());render();showSg()});
$("searchInput").addEventListener("focus",showSg);
$("searchInput").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();hideSg();toCatalog()}else if(e.key==="Escape")hideSg()});
$("searchBtn").onclick=()=>{hideSg();toCatalog()};
document.querySelectorAll(".sort-btn").forEach(b=>b.onclick=()=>{S.sort=b.dataset.sort;render()});
document.querySelectorAll(".categories a").forEach(a=>a.onclick=e=>{e.preventDefault();S.cat=a.dataset.cat;S.fav=false;render();toCatalog()});
$("logo").onclick=e=>{e.preventDefault();Object.assign(S,{cat:"all",q:"",fav:false});$("searchInput").value="";render();scrollTo({top:0,behavior:"smooth"})};
document.querySelectorAll(".mobile-nav a").forEach(a=>a.onclick=e=>{
 e.preventDefault();const n=a.dataset.nav;
 if(n==="home")$("logo").click();
 else if(n==="catalog"){S.fav=false;render();toCatalog()}
 else if(n==="fav")setFav(true);
 else if(n==="cart")openCart();
 else accountModal();
});
setUser(user);render();updateCart();
