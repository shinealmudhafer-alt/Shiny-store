const defaultProducts=[
   {id:999,name:"Schauma 5&5 Feuchtigkeitsspende Multitalent-Kur",price:15000,cat:"شعر",desc:"علاج مرطب للشعر. يساعد على ترطيب الشعر والعناية به. التقييم 4.7 من 5 بناءً على 908 تقييمات.",image:""},
];
let products=JSON.parse(localStorage.getItem("shinyProducts")||"[]");products=[...products,...defaultProducts.filter(d=>!products.some(p=>p.id===d.id))];
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
function submitOrder(e){
  e.preventDefault();

  if(!cart.length){
    alert("السلة فارغة");
    return;
  }

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const province = document.getElementById("province").value;
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment").value;

  let message = "🛍️ طلب جديد من متجر Shiny\n\n";
  message += "👤 الاسم: " + name + "\n";
  message += "📱 الهاتف: " + phone + "\n";
  message += "📍 المحافظة: " + province + "\n";
  message += "🏠 العنوان: " + address + "\n";
  message += "💳 الدفع: " + payment + "\n\n";

  message += "🛒 المنتجات:\n";

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);

    if(product){
      message += "• " + product.name +
        " × " + item.qty +
        " = " + (product.price * item.qty).toLocaleString() + " د.ع\n";
    }
  });

  const total = subtotal();

  message += "\n💰 الإجمالي: " + total.toLocaleString() + " د.ع";

  const whatsappNumber = "4915679214272";

  const whatsappUrl =
    "https://wa.me/" + whatsappNumber +
    "?text=" + encodeURIComponent(message);

  window.open(whatsappUrl, "_blank");
}
function openProductForm(){document.getElementById("productModal").classList.remove("hidden")}
function closeProductForm(){document.getElementById("productModal").classList.add("hidden")}
function addProduct(e){
  e.preventDefault();

  const file = document.getElementById("pimage").files[0];

  const product = {
    id: Date.now(),
    name: document.getElementById("pname").value,
    price: Number(document.getElementById("pprice").value),
    cat: document.getElementById("pcat").value,
    image: "",
    desc: document.getElementById("pdesc").value
  };

  if(file){
    const reader = new FileReader();

    reader.onload = function(){
      product.image = reader.result;
      products.push(product);
      save();
      render();
      closeProductForm();
    };

    reader.readAsDataURL(file);
  } else {
    products.push(product);
    save();
    render();
    closeProductForm();
  }
}
render();
