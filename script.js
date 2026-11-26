const products = [
  { id: "talisay-vessel", name: "Talisay Clay Vessel", category: "Ceramics", price: 1850, badge: "Bestseller", maker: "Luna Pottery, Cebu", description: "A softly sculpted stoneware vessel, shaped and glazed by hand. Just as lovely with stems as it is on its own.", image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=850&q=85", alt: "Sculptural handmade ceramic vessel in a soft neutral glaze" },
  { id: "amihan-pendant", name: "Amihan Woven Pendant", category: "Woven", price: 4200, badge: "Made to order", maker: "Tala Weaves, Iloilo", description: "A warm pool of light, woven from natural fibers with the easy rhythm of a slow afternoon.", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=850&q=85", alt: "Natural woven pendant lamp casting a warm glow" },
  { id: "sulu-throw", name: "Sulu Handloom Throw", category: "Textiles", price: 2950, badge: "Small batch", maker: "Hiraya Loom, Sulu", description: "Soft, breathable cotton with a quiet stripe. Handloomed for the end of the day and every slow morning after.", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=850&q=85", alt: "Soft woven throw in natural earthy tones" },
  { id: "kubo-basket", name: "Kubo Market Basket", category: "Woven", price: 1650, badge: "Everyday favorite", maker: "Ginhawa Craft, Bicol", description: "A sturdy, roomy carryall woven from buri and finished with comfortable hand-wrapped handles.", image: "https://images.unsplash.com/photo-1597659840243-786c29e2c603?auto=format&fit=crop&w=850&q=85", alt: "Handwoven basket with natural fiber detail" },
  { id: "luna-cups", name: "Luna Ceramic Pair", category: "Ceramics", price: 1400, badge: "Two-piece set", maker: "Luna Pottery, Cebu", description: "Two palm-sized cups for a favorite tea or a little evening something. Each one carries the marks of its maker.", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=850&q=85", alt: "Pair of handmade ceramic cups in a neutral finish" },
  { id: "daylight-candle", name: "Daylight Soy Candle", category: "Scents", price: 880, badge: "New", maker: "Luntian Scent Co., Manila", description: "A gentle blend of citrus peel, warm wood, and green leaves, poured in a reusable clay cup.", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=850&q=85", alt: "Hand-poured candle in a calm, softly lit setting" },
  { id: "isla-cushion", name: "Isla Linen Cushion", category: "Textiles", price: 1250, badge: "Natural linen", maker: "Hiraya Loom, Sulu", description: "A relaxed linen cover in a sun-washed shade, made to soften the corners of a well-loved room.", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=850&q=85", alt: "Textured neutral linen cushion" },
  { id: "tahanan-lamp", name: "Tahanan Table Lamp", category: "Lighting", price: 3600, badge: "Maker's pick", maker: "Sulyap Studio, Laguna", description: "A sculptural base and a linen shade make this little lamp feel like the last warm light of the day.", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=850&q=85", alt: "Warm table lamp styled on a natural wood side table" }
];

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });
const productGrid = document.querySelector("#productGrid");
const productTotal = document.querySelector("#productTotal");
const emptyState = document.querySelector("#emptyState");
const filterList = document.querySelector("#filterList");
const searchPanel = document.querySelector("#searchPanel");
const searchInput = document.querySelector("#searchInput");
const cartDrawer = document.querySelector("#cartDrawer");
const drawerScrim = document.querySelector("#drawerScrim");
const productDialog = document.querySelector("#productDialog");
const quickViewContent = document.querySelector("#quickViewContent");
const toast = document.querySelector("#toast");
let activeCategory = "All pieces";
let favorites = new Set();
let toastTimer;

let cart = {};
try { cart = JSON.parse(localStorage.getItem("habi-home-cart") || "{}"); } catch { cart = {}; }

const categories = ["All pieces", "Ceramics", "Textiles", "Woven", "Lighting", "Scents"];
filterList.innerHTML = categories.map((category) => `<button class="filter-button${category === activeCategory ? " active" : ""}" type="button" data-category="${category}" aria-pressed="${category === activeCategory}">${category}</button>`).join("");

function productCard(product) {
  return `<article class="product-card" data-product-id="${product.id}">
    <div class="product-image-wrap">
      <img class="product-image" src="${product.image}" alt="${product.alt}" loading="lazy" />
      <span class="product-badge">${product.badge}</span>
      <button class="favorite-button${favorites.has(product.id) ? " is-favorite" : ""}" type="button" data-favorite="${product.id}" aria-label="${favorites.has(product.id) ? "Remove" : "Add"} ${product.name} ${favorites.has(product.id) ? "from" : "to"} favorites" aria-pressed="${favorites.has(product.id)}">${favorites.has(product.id) ? "♥" : "♡"}</button>
      <button class="quick-add" type="button" data-add="${product.id}">Add to bag&nbsp; +</button>
    </div>
    <div class="product-info">
      <p class="product-category">${product.category} · ${product.maker}</p>
      <div class="product-meta"><h3 class="product-name">${product.name}</h3><span class="product-price">${peso.format(product.price)}</span></div>
      <p class="product-description">${product.description}</p>
    </div>
  </article>`;
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = products.filter((product) => {
    const matchesCategory = activeCategory === "All pieces" || product.category === activeCategory;
    const haystack = `${product.name} ${product.category} ${product.maker} ${product.description}`.toLowerCase();
    return matchesCategory && haystack.includes(query);
  });
  const sort = document.querySelector("#sortSelect").value;
  if (sort === "low") visible.sort((a, b) => a.price - b.price);
  if (sort === "high") visible.sort((a, b) => b.price - a.price);
  productGrid.innerHTML = visible.map(productCard).join("");
  productTotal.textContent = `${String(visible.length).padStart(2, "0")} ${visible.length === 1 ? "piece" : "pieces"}`;
  emptyState.hidden = visible.length > 0;
  productGrid.hidden = visible.length === 0;
}

function persistCart() {
  try { localStorage.setItem("habi-home-cart", JSON.stringify(cart)); } catch { /* Cart still works for this visit when browser storage is unavailable. */ }
}

function cartCount() {
  return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
}

function renderCart() {
  const items = Object.entries(cart).map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity })).filter((entry) => entry.product);
  const totalCount = cartCount();
  document.querySelector("#bagCount").textContent = totalCount;
  document.querySelector("#drawerCount").textContent = `(${totalCount})`;
  document.querySelector("#cartEmpty").hidden = items.length > 0;
  document.querySelector("#cartBottom").hidden = items.length === 0;
  document.querySelector("#cartItems").innerHTML = items.map(({ product, quantity }) => `<div class="cart-item">
    <img src="${product.image}" alt="${product.alt}" />
    <div class="cart-item-info"><p>${product.category}</p><h3>${product.name}</h3><div class="quantity-controls"><button type="button" data-quantity="${product.id}" data-step="-1" aria-label="Remove one ${product.name}">−</button><span>${quantity}</span><button type="button" data-quantity="${product.id}" data-step="1" aria-label="Add one ${product.name}">+</button></div></div>
    <div class="cart-item-price">${peso.format(product.price * quantity)}<br /><button class="remove-item" type="button" data-remove="${product.id}">Remove</button></div>
  </div>`).join("");
  const subtotal = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  document.querySelector("#cartSubtotal").textContent = peso.format(subtotal);
  document.querySelector("#shippingNote").textContent = subtotal >= 3000
    ? "Your sample order qualifies for complimentary delivery."
    : `${peso.format(3000 - subtotal)} away from complimentary delivery.`;
  persistCart();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2300);
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  const product = products.find((item) => item.id === id);
  showToast(`${product.name} added to your bag`);
}

function openCart() {
  renderCart();
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartDrawer.inert = false;
  drawerScrim.hidden = false;
  document.body.classList.add("drawer-open");
  document.querySelector("#closeCart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartDrawer.inert = true;
  drawerScrim.hidden = true;
  document.body.classList.remove("drawer-open");
}

function openQuickView(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  quickViewContent.innerHTML = `<div class="quick-view-layout"><img src="${product.image}" alt="${product.alt}" /><div class="quick-view-copy"><p class="eyebrow">${product.badge}</p><p class="product-category">${product.category} · ${product.maker}</p><h2>${product.name}</h2><span class="quick-price">${peso.format(product.price)}</span><p class="quick-description">${product.description}<br /><br />Made in a small batch by ${product.maker}. Natural variations are part of what makes each piece yours.</p><button class="button button-dark" type="button" data-add="${product.id}">Add to bag <span>+</span></button></div></div>`;
  productDialog.showModal();
}

filterList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  filterList.querySelectorAll(".filter-button").forEach((item) => {
    const isActive = item.dataset.category === activeCategory;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  const favorite = event.target.closest("[data-favorite]");
  const card = event.target.closest(".product-card");
  if (add) { addToCart(add.dataset.add); return; }
  if (favorite) {
    const id = favorite.dataset.favorite;
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    renderProducts();
    showToast(favorites.has(id) ? "Saved to your favorites" : "Removed from your favorites");
    return;
  }
  if (card) openQuickView(card.dataset.productId);
});

quickViewContent.addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  if (!add) return;
  addToCart(add.dataset.add);
  productDialog.close();
});

document.querySelector("#closeDialog").addEventListener("click", () => productDialog.close());
productDialog.addEventListener("click", (event) => { if (event.target === productDialog) productDialog.close(); });
document.querySelector("#sortSelect").addEventListener("change", renderProducts);
searchInput.addEventListener("input", renderProducts);
document.querySelector("#clearSearch").addEventListener("click", () => { searchInput.value = ""; renderProducts(); searchInput.focus(); });
document.querySelector("#searchToggle").addEventListener("click", () => {
  searchPanel.hidden = !searchPanel.hidden;
  if (!searchPanel.hidden) searchInput.focus();
});
document.querySelector("#cartToggle").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
document.querySelector("#continueShopping").addEventListener("click", closeCart);
drawerScrim.addEventListener("click", closeCart);

document.querySelector("#cartItems").addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (stepButton) {
    const id = stepButton.dataset.quantity;
    cart[id] = (cart[id] || 0) + Number(stepButton.dataset.step);
    if (cart[id] <= 0) delete cart[id];
    renderCart();
  }
  if (removeButton) { delete cart[removeButton.dataset.remove]; renderCart(); }
});

document.querySelector("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#customerName").value.trim().split(" ")[0] || "friend";
  cart = {};
  renderCart();
  document.querySelector("#cartItems").innerHTML = `<div class="order-success"><span class="success-mark">✳</span><h3>Thank you, ${name}.</h3><p>Your sample order is ready. This student storefront preview doesn't process payment or send orders. Add a checkout provider and business contact details to accept real orders.</p><button class="text-button" id="closeSuccess" type="button">Back to the shop →</button></div>`;
  document.querySelector("#cartEmpty").hidden = true;
  document.querySelector("#cartBottom").hidden = true;
  document.querySelector("#closeSuccess").addEventListener("click", closeCart);
});

document.querySelector("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#newsletterEmail");
  document.querySelector("#newsletterMessage").textContent = "Thanks for trying the sample sign-up. This preview doesn't save or send emails.";
  email.value = "";
});

document.querySelector("#resetFilters").addEventListener("click", () => {
  activeCategory = "All pieces";
  searchInput.value = "";
  filterList.querySelectorAll(".filter-button").forEach((item) => {
    const isActive = item.dataset.category === activeCategory;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
});

document.querySelectorAll("[data-collection]").forEach((collectionLink) => collectionLink.addEventListener("click", () => {
  activeCategory = collectionLink.dataset.collection;
  filterList.querySelectorAll(".filter-button").forEach((item) => {
    const isActive = item.dataset.category === activeCategory;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
}));

const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (cartDrawer.classList.contains("is-open")) closeCart();
    searchPanel.hidden = true;
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

renderProducts();
renderCart();
