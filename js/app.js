/* ===== Obeng's Farm — shop logic ===== */

// ---- Business settings: edit these ----
const CONFIG = {
  // WhatsApp number in international format, digits only (e.g. "233241234567").
  // Leave empty and WhatsApp will ask the customer which chat to send to.
  whatsapp: "",
  phoneDisplay: "", // e.g. "024 123 4567"
  currency: "GH₵",
};

const IMG = (file) => `images/${file}`;

const EGGS = [
  { id: "egg-s",  name: "Small Eggs",       size: "Small",       price: 40, scale: 0.62, desc: "Perfect for baking and everyday cooking." },
  { id: "egg-m",  name: "Medium Eggs",      size: "Medium",      price: 45, scale: 0.74, desc: "The family favourite for breakfast." },
  { id: "egg-l",  name: "Large Eggs",       size: "Large",       price: 55, scale: 0.87, desc: "Rich golden yolks, great for boiling.", tag: "Popular" },
  { id: "egg-xl", name: "Extra Large Eggs", size: "Extra Large", price: 65, scale: 1.0,  desc: "Our biggest eggs — ideal for caterers." },
];

const FOWL = {
  id: "fowl", name: "Live Chicken (Fowl)", price: 300, unit: "per bird",
  img: IMG("hen.jpg"),
  desc: "Healthy, well-fed farm chickens — great for festive occasions, family meals and events.",
};

const ALL = [...EGGS, FOWL];
const byId = Object.fromEntries(ALL.map((p) => [p.id, p]));

// ---- Helpers ----
const $ = (s, r = document) => r.querySelector(s);
const money = (n) => `${CONFIG.currency} ${n.toLocaleString("en-GH")}`;

// ---- Cart state (remembered on this device) ----
let cart = {};
try { cart = JSON.parse(localStorage.getItem("obeng-cart") || "{}"); } catch { cart = {}; }
const save = () => { try { localStorage.setItem("obeng-cart", JSON.stringify(cart)); } catch {} };

function addToCart(id, qty) {
  cart[id] = (cart[id] || 0) + qty;
  save(); renderCart();
  toast(`Added ${qty} × ${byId[id].name}`);
  const c = $("#cartCount"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
}
function setQty(id, qty) {
  if (qty <= 0) delete cart[id]; else cart[id] = qty;
  save(); renderCart();
}

// ---- Rendering ----
function qtyControl(id) {
  return `<div class="qty" data-id="${id}">
    <button type="button" class="qty-btn" data-step="-1" aria-label="Decrease">−</button>
    <input type="number" min="1" value="1" inputmode="numeric" aria-label="Quantity">
    <button type="button" class="qty-btn" data-step="1" aria-label="Increase">+</button>
  </div>`;
}

function renderProducts() {
  $("#eggGrid").innerHTML = EGGS.map((p) => `
    <article class="card">
      <div class="card-media card-media--egg" role="img" aria-label="${p.size} egg">
        <span class="egg-shape" style="--s:${p.scale}"></span>
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="muted">${p.desc}</p>
        <div class="price"><strong>${money(p.price)}</strong><span>per crate (30)</span></div>
        <div class="card-actions">${qtyControl(p.id)}<button class="btn btn-primary btn-sm add" data-id="${p.id}">Add</button></div>
      </div>
    </article>`).join("");

  $("#fowlCard").innerHTML = `
    <article class="card card--wide">
      <div class="card-media"><img src="${FOWL.img}" alt="Live farm chickens" loading="lazy"></div>
      <div class="card-body">
        <span class="tag tag--static">Live bird</span>
        <h3>${FOWL.name}</h3>
        <p class="muted">${FOWL.desc}</p>
        <ul class="checks"><li>Healthy &amp; vaccinated</li><li>Great for Christmas, Easter &amp; parties</li><li>Bulk orders welcome</li></ul>
        <div class="price"><strong>${money(FOWL.price)}</strong><span>${FOWL.unit}</span></div>
        <div class="card-actions">${qtyControl(FOWL.id)}<button class="btn btn-primary add" data-id="${FOWL.id}">Add to basket</button></div>
      </div>
    </article>`;
}

function cartTotals() {
  let count = 0, total = 0;
  for (const [id, q] of Object.entries(cart)) {
    if (!byId[id]) continue;
    count += q; total += q * byId[id].price;
  }
  return { count, total };
}

function renderCart() {
  const items = Object.entries(cart).filter(([id]) => byId[id]);
  const { count, total } = cartTotals();
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
  $("#checkout").disabled = items.length === 0;
  $("#cartEmpty").hidden = items.length > 0;
  $("#orderForm").hidden = items.length === 0;

  $("#cartList").innerHTML = items.map(([id, q]) => {
    const p = byId[id];
    return `<li class="cart-item">
      ${p.img ? `<img src="${p.img}" alt="">` : `<span class="ci-thumb"><span class="egg-shape" style="--s:${p.scale}"></span></span>`}
      <div class="ci-info">
        <strong>${p.name}</strong>
        <span class="muted">${money(p.price)} ${id === "fowl" ? "/ bird" : "/ crate"}</span>
        <div class="ci-qty">
          <button class="qty-btn sm" data-cart="${id}" data-step="-1" aria-label="Decrease">−</button>
          <span>${q}</span>
          <button class="qty-btn sm" data-cart="${id}" data-step="1" aria-label="Increase">+</button>
          <button class="link-btn" data-remove="${id}">Remove</button>
        </div>
      </div>
      <strong class="ci-sub">${money(p.price * q)}</strong>
    </li>`;
  }).join("");
}

// ---- Drawer ----
const drawer = $("#drawer"), overlay = $("#overlay");
function openCart() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); overlay.hidden = false; document.body.style.overflow = "hidden"; }
function closeCart() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); overlay.hidden = true; document.body.style.overflow = ""; }

// ---- Toast ----
let toastTimer;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

// ---- WhatsApp ----
const waUrl = (text) => CONFIG.whatsapp
  ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`
  : `https://wa.me/?text=${encodeURIComponent(text)}`;

function checkout() {
  const form = $("#orderForm");
  const data = Object.fromEntries(new FormData(form));
  const missing = ["name", "phone"].filter((k) => !String(data[k] || "").trim());
  if (data.method === "Delivery" && !String(data.address || "").trim()) missing.push("address");
  form.querySelectorAll("input").forEach((i) => i.classList.toggle("invalid", missing.includes(i.name)));
  if (missing.length) { toast("Please fill in your details"); form.querySelector(".invalid")?.focus(); return; }

  const lines = Object.entries(cart).filter(([id]) => byId[id]).map(([id, q]) => {
    const p = byId[id];
    return `• ${q} × ${p.name} (${id === "fowl" ? "bird" : "crate"}) — ${money(p.price * q)}`;
  });
  const msg = [
    "Hello Obeng's Farm 👋, I'd like to place an order:",
    "", ...lines, "", `*Total: ${money(cartTotals().total)}*`, "",
    `Name: ${data.name}`, `Phone: ${data.phone}`, `Method: ${data.method}`,
    data.method === "Delivery" ? `Location: ${data.address}` : null,
    data.note ? `Note: ${data.note}` : null,
  ].filter((l) => l !== null).join("\n");

  window.open(waUrl(msg), "_blank", "noopener");
}

// ---- Events ----
document.addEventListener("click", (e) => {
  const step = e.target.closest(".qty .qty-btn");
  if (step) {
    const input = step.parentElement.querySelector("input");
    input.value = Math.max(1, (parseInt(input.value, 10) || 1) + Number(step.dataset.step));
    return;
  }
  const add = e.target.closest(".add");
  if (add) {
    const input = add.parentElement.querySelector(".qty input");
    const qty = Math.max(1, parseInt(input.value, 10) || 1);
    addToCart(add.dataset.id, qty); input.value = 1;
    return;
  }
  const cs = e.target.closest("[data-cart]");
  if (cs) { setQty(cs.dataset.cart, (cart[cs.dataset.cart] || 0) + Number(cs.dataset.step)); return; }
  const rm = e.target.closest("[data-remove]");
  if (rm) { setQty(rm.dataset.remove, 0); return; }
});

$("#cartOpen").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
$("#emptyShop").addEventListener("click", () => { closeCart(); $("#products").scrollIntoView({ behavior: "smooth" }); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });
$("#checkout").addEventListener("click", checkout);
$("#orderForm").addEventListener("change", (e) => {
  if (e.target.name === "method") $(".addr").hidden = e.target.value !== "Delivery";
});

// ---- Init ----
$("#year").textContent = new Date().getFullYear();
$("#waLink").href = waUrl("Hello Obeng's Farm, I'd like to order eggs/chickens.");
if (CONFIG.phoneDisplay) {
  $("#phoneText").textContent = CONFIG.phoneDisplay;
  $("#callLink").href = `tel:${CONFIG.phoneDisplay.replace(/\s/g, "")}`;
} else {
  $("#phoneText").textContent = "Number coming soon";
  $("#callLink").removeAttribute("href");
}
renderProducts();
renderCart();
