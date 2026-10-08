const PRODUCTS=[
{id:1,name:"Remera Clásica",category:"remeras",price:18000,color:"#eee",desc:"Remera de algodón premium, ideal para estampas personalizadas.",badge:"MÁS VENDIDA"},
{id:2,name:"Remera Oversize",category:"oversize",price:24000,color:"#202020",desc:"Calce oversize urbano para un look amplio y cómodo.",badge:"TREND"},
{id:3,name:"Buzo Premium",category:"buzos",price:39000,color:"#555",desc:"Buzo de abrigo con excelente base para personalización.",badge:"PREMIUM"},
{id:4,name:"Oversize TUPÁ",category:"oversize",price:26000,color:"#d8ff00",desc:"Oversize de estilo protagonista para diseños grandes.",badge:"NUEVO"},
{id:5,name:"Remera Blanca",category:"remeras",price:17500,color:"#f5f5f5",desc:"Base blanca versátil para todo tipo de diseños.",badge:"CLÁSICA"},
{id:6,name:"Buzo Negro",category:"buzos",price:42000,color:"#161616",desc:"Buzo negro de estilo urbano para tus diseños favoritos.",badge:"PREMIUM"}
];

let cart=JSON.parse(localStorage.getItem("tupaCart")||"[]");
let current=null;

const $=s=>document.querySelector(s);
const money=n=>new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n);

function renderProducts(list=PRODUCTS){
 const box=$("#products");
 if(!list.length){box.innerHTML='<p class="muted">No encontramos productos con esa búsqueda.</p>';return}
 box.innerHTML=list.map(p=>`<article class="product"><div class="product-visual"><span class="product-label">${p.badge}</span><div class="mock-shirt" style="--shirt:${p.color}">TUPÁ</div></div><div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><div class="product-row"><strong>${money(p.price)}</strong><button class="quick" onclick="openProduct(${p.id})">VER PRODUCTO</button></div></div></article>`).join("");
}
function openProduct(id){
 current=PRODUCTS.find(p=>p.id===id); $("#modalName").textContent=current.name;$("#modalPrice").textContent=money(current.price);$("#modalDesc").textContent=current.desc;
 $("#modalImage").innerHTML=`<div class="mock-shirt" style="--shirt:${current.color}">TUPÁ</div>`;$("#qty").value=1;$("#productModal").classList.add("open");
}
function addToCart(p,qty=1){
 const size=$("#size").value,color=$("#color").value;
 const key=`${p.id}-${size}-${color}`;const found=cart.find(x=>x.key===key);
 if(found)found.qty+=qty;else cart.push({key,id:p.id,name:p.name,price:p.price,size,color,qty});
 saveCart();renderCart();$("#productModal").classList.remove("open");toast();
}
function saveCart(){localStorage.setItem("tupaCart",JSON.stringify(cart));$("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0)}
function renderCart(){
 const box=$("#cartItems");
 if(!cart.length){box.innerHTML='<div class="empty"><p class="muted">Tu carrito está vacío.</p><a href="#tienda" class="btn ghost" id="continue">VER TIENDA</a></div>';$("#subtotal").textContent=money(0);return}
 box.innerHTML=cart.map((x,i)=>`<div class="cart-item"><div class="mini"><div class="mock-shirt" style="--shirt:${PRODUCTS.find(p=>p.id===x.id).color}"></div></div><div><h4>${x.name}</h4><p>Talle ${x.size} · ${x.color} · Cant. ${x.qty}</p><strong>${money(x.price*x.qty)}</strong></div><button class="remove" onclick="removeItem(${i})">×</button></div>`).join("");
 $("#subtotal").textContent=money(cart.reduce((a,x)=>a+x.price*x.qty,0));
}
function removeItem(i){cart.splice(i,1);saveCart();renderCart()}
function toast(){const t=$("#toast");t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1600)}
function openCart(){renderCart();$("#cart").classList.add("open");$("#overlay").classList.add("show")}
function closeCart(){$("#cart").classList.remove("open");$("#overlay").classList.remove("show")}

$("#categories").addEventListener("click",e=>{if(e.target.tagName!=="BUTTON")return;document.querySelectorAll(".categories button").forEach(b=>b.classList.remove("active"));e.target.classList.add("active");const c=e.target.dataset.category;renderProducts(c==="todos"?PRODUCTS:PRODUCTS.filter(p=>p.category===c))});
$("#sort").addEventListener("change",e=>{let arr=[...PRODUCTS];const c=document.querySelector(".categories .active").dataset.category;if(c!=="todos")arr=arr.filter(p=>p.category===c);if(e.target.value==="low")arr.sort((a,b)=>a.price-b.price);if(e.target.value==="high")arr.sort((a,b)=>b.price-a.price);renderProducts(arr)});
$("#searchInput").addEventListener("input",e=>{const q=e.target.value.toLowerCase();renderProducts(PRODUCTS.filter(p=>(p.name+" "+p.category+" "+p.desc).toLowerCase().includes(q)))});
$("#searchToggle").onclick=()=>$("#searchBar").classList.toggle("open");
$("#menuBtn").onclick=()=>$("#nav").classList.toggle("open");
document.querySelectorAll(".nav a").forEach(a=>a.onclick=()=>$("#nav").classList.remove("open"));
$("#cartOpen").onclick=openCart;$("#cartClose").onclick=closeCart;$("#overlay").onclick=closeCart;
document.querySelector("[data-close]").onclick=()=>$("#productModal").classList.remove("open");
$("#minus").onclick=()=>{let n=+$("#qty").value;if(n>1)$("#qty").value=n-1};
$("#plus").onclick=()=>$("#qty").value=+$("#qty").value+1;
$("#addModal").onclick=()=>addToCart(current,+$("#qty").value);
$("#checkout").onclick=()=>{
 if(!cart.length){alert("Tu carrito está vacío.");return}
 const lines=cart.map(x=>`• ${x.name} | Talle ${x.size} | ${x.color} | x${x.qty} = ${money(x.price*x.qty)}`).join("%0A");
 const total=cart.reduce((a,x)=>a+x.price*x.qty,0);
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola TUPÁ! Quiero hacer este pedido:\n\n"+lines+"\n\nSubtotal: "+money(total)+"\n\n¿Me confirman disponibilidad y formas de entrega?")}`,"_blank");
};
$("#contactForm").onsubmit=e=>{
 e.preventDefault();const text=`Hola TUPÁ!\n\nNombre: ${$("#name").value}\nTeléfono: ${$("#phone").value}\nMe interesa: ${$("#contactProduct").value}\n\nMi idea:\n${$("#message").value}`;
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,"_blank");
};

const WHATSAPP_NUMBER="2314616253";
$("#waButton").href=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola TUPÁ! Quiero consultar por ropa personalizada.")}`;
renderProducts();saveCart();renderCart();
