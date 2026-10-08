const PRODUCTS=[
    {
        id:1,
        name:"Al fallo O me fallo.png",
        category:"remeras",
        price:18000,
        image:"img/remera2.png",
        desc:"Remera de algodón premium con diseño Al Fallo para mujer.",
        badge:"NUEVO"
    },
    {
        id:2,
        name:"Charly y Alicia.png",
        category:"remeras",
        price:18000,
        image:"img/remera3.png",
        desc:"Remera de algodón premium con diseño Charly Paz de las Maravillas.",
        badge:"NUEVO"
    },
    {
        id:3,
        name:"Lion Chill",
        category:"remeras",
        price:18000,
        image:"img/remera8.png",
        desc:"Remera de algodón premium con diseño Lion Chill.",
        badge:"NUEVO"
    },
    {
        id:4,
        name:"Luffy Chill",
        category:"remeras",
        price:18000,
        image:"img/Luffy chill.png",
        desc:"Remera de algodón premium con diseño Luffy Chill.",
        badge:"NUEVO"
    },
    {
        id:5,
        name:"Kratos God of Paz",
        category:"remeras",
        price:18000,
        image:"img/Kratos god of paz negra.png",
        desc:"Remera de algodón premium con diseño Kratos God of Paz.",
        badge:"NUEVO"
    },
    {
        id:6,
        name:"Hora de Berserk.png",
        category:"remeras",
        price:18000,
        image:"img/remera6.png",
        desc:"Remera de algodón premium con diseño Fin Berserk.",
        badge:"NUEVO"
    },
        {
        id:7,
        name:"Dragon Ball Z Club Fight",
        category:"remeras",
        price:18000,
        image:"img/remera4.PNG",
        desc:"Descripción de la nueva remera.",
        badge:"NUEVO"
    }
   
];

let cart=JSON.parse(localStorage.getItem("tupaCart")||"[]");
let current=null;

const $=s=>document.querySelector(s);
const money=n=>new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n);

let productosVisibles = 6;
let listaActual = PRODUCTS;

function renderProducts(list = PRODUCTS) {
    listaActual = list;

    const box = $("#products");

    if (!list.length) {
        box.innerHTML = '<p class="muted">No encontramos productos con esa búsqueda.</p>';
        $("#verMas").style.display = "none";
        return;
    }

    const productosAMostrar = list.slice(0, productosVisibles);

    box.innerHTML = productosAMostrar.map(p => `
        <article class="product">

            <div class="product-visual">
                <span class="product-label">${p.badge}</span>

                <img 
                    src="${p.image}" 
                    alt="${p.name}" 
                    class="product-image"
                >
            </div>

            <div class="product-info">
                <h3>${p.name}</h3>

                <p>${p.desc}</p>

                <div class="product-row">
                    <strong>${money(p.price)}</strong>

                    <button 
                        class="quick" 
                        onclick="openProduct(${p.id})"
                    >
                        VER PRODUCTO
                    </button>
                </div>
            </div>

        </article>
    `).join("");

   if (list.length > productosVisibles) {
    $("#verMas").style.display = "block";
} else {
    $("#verMas").style.display = "none";
}
}

$("#verMas").onclick = () => {
    productosVisibles += 6;
    renderProducts(listaActual);
};

function openProduct(id){
    current=PRODUCTS.find(p=>p.id===id);

    $("#modalName").textContent=current.name;
    $("#modalPrice").textContent=money(current.price);
    $("#modalDesc").textContent=current.desc;

    $("#modalImage").innerHTML=`
        <img 
            src="${current.image}" 
            alt="${current.name}" 
            class="modal-product-image"
        >
    `;

    $("#qty").value=1;
    $("#productModal").classList.add("open");
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
