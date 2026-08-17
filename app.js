const defaultProducts=[
 {id:1,name:"منتج تجميلي",price:25000,cat:"كوزمتكس",desc:"أضيفي منتجك من لوحة المتجر.",image:""},
 {id:2,name:"عطر أنيق",price:35000,cat:"عطور",desc:"أضيفي منتجك من لوحة المتجر.",image:""}
];
let products=JSON.parse(localStorage.getItem("shinyProducts")||"null")||defaultProducts;
let cart=JSON.parse(localStorage.getItem("shinyCart")||"[]");
let currentFilter="الكل";
const fmt=n=>new Intl.NumberFormat("ar-IQ").format(n)+" د.ع";
function save(){localStorage.setItem("shinyProducts",JSON.stringify(products));localStorage.setItem("shinyCart",JSON.stringify(cart))}
function render(){
 const list=products.filter(p=>currentFilter==="الكل"||p.cat===currentFilter);
 document.getElementById("products").innerHTML=list.map(p=>`<article class="card"><div class="pic">${p.image?`<img src="${escapeHtml(p.image)}" alt="">`:"✨"}</div><div class="cardBody"><h3>${escapeHtml(p.name)}</h3><div class="price">${fmt(p.price)}</div><p class="desc">${escapeHtml(p.desc||"")}</p><button class="buy" onclick="addToCart(${p.id})">أضف للسلة</button></div></article>`).join("");
 document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function filterProducts(cat,el){currentFilter=cat;document.querySelectorAll(".chips button").forEach(x=>x.classList.remove("active"));el.classList.add("active");render()}
function addToCart(id){let x=cart.find(i=>i.id===id);x?x.qty++:cart.push({id,qty:1});save();render();openCart()}
function openCart(){renderCart();document.getElementById("cartModal").classList.remove("hidden")}
function closeCart(){document.getElementById("cartModal").classList.add("hidden")}
function renderCart(){
 const box=document.getElementById("cartItems");
 if(!cart.length){box.innerHTML="<p>السلة فارغة.</p>";document.getElementById("subtotal").textContent=fmt(0);return}
 box.innerHTML=cart.map(i=>{let p=products.find(x=>x.id===i.id);return `<div class="cartRow"><div><b>${escapeHtml(p.name)}</b><br><small>${fmt(p.price)} × ${i.qty}</small></div><div class="qty"><button onclick="changeQty(${i.id},-1)">−</button> ${i.qty} <button onclick="changeQty(${i.id},1)">+</button></div></div>`}).join("");
 document.getElementById("subtotal").textContent=fmt(subtotal())
}
function subtotal(){return cart.reduce((s,i)=>s+(products.find(p=>p.id===i.id)?.price||0)*i.qty,0)}
function changeQty(id,d){let x=cart.find(i=>i.id===id);if(x){x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id)}save();render();renderCart()}
function checkout(){if(!cart.length)return alert("السلة فارغة");closeCart();document.getElementById("checkoutModal").classList.remove("hidden");updateShipping()}
function closeCheckout(){document.getElementById("checkoutModal").classList.add("hidden")}
function updateShipping(){let p=document.getElementById("province").value,s=subtotal();let fee=p==="البصرة"?3000:p==="أطراف البصرة"?4000:(p?5000:0);if(s>=80000)fee=0;document.getElementById("shipping").textContent=fmt(fee);document.getElementById("grandTotal").textContent=fmt(s+fee)}
function submitOrder(e){e.preventDefault();let s=subtotal(),p=document.getElementById("province").value,fee=p==="البصرة"?3000:p==="أطراف البصرة"?4000:5000;if(s>=80000)fee=0;let order={number:"SH-"+Date.now().toString().slice(-7),name:document.getElementById("name").value,phone:document.getElementById("phone").value,province:p,address:document.getElementById("address").value,payment:document.getElementById("payment").value,total:s+fee,items:cart};localStorage.setItem("lastOrder",JSON.stringify(order));alert("تم استلام طلبك رقم "+order.number+" ✅");cart=[];save();render();closeCheckout()}
function openProductForm(){document.getElementById("productModal").classList.remove("hidden")}
function closeProductForm(){document.getElementById("productModal").classList.add("hidden")}
function addProduct(e){e.preventDefault();products.push({id:Date.now(),name:document.getElementById("pname").value,price:Number(document.getElementById("pprice").value),cat:document.getElementById("pcat").value,image:document.getElementById("pimage").value,desc:document.getElementById("pdesc").value});save();render();e.target.reset();closeProductForm();alert("تمت إضافة المنتج ✅")}
render();
