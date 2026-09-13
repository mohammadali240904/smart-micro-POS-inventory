// Sample Data
const products = [
  { id: 1, name: 'Cotton T-Shirt', price: 450, stock: 25 },
  { id: 2, name: 'Denim Pants', price: 1200, stock: 12 },
  { id: 3, name: 'Formal Shirt', price: 850, stock: 8 },
  { id: 4, name: 'Leather Wallet', price: 350, stock: 2 }
];

let cart = [];

// Tab Switch Logic
function switchTab(tabId, element) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  element.classList.add('active');
}

// Render Products & Inventory
function init() {
  const productList = document.getElementById('product-list');
  const inventoryTable = document.getElementById('inventory-table-body');
  
  productList.innerHTML = '';
  inventoryTable.innerHTML = '';

  products.forEach(p => {
    // POS Product Cards
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `<h4>${p.name}</h4><p>৳ ${p.price}</p>`;
    card.onclick = () => addToCart(p);
    productList.appendChild(card);

    // Inventory Table
    const row = document.createElement('tr');
    row.innerHTML = `<td>#00${p.id}</td><td>${p.name}</td><td>${p.stock} pcs</td><td>৳ ${p.price}</td>`;
    inventoryTable.appendChild(row);
  });
}

// Cart Logic
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
}

function updateQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      updateCartUI();
    }
  }
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
}

function clearCart() {
  cart = [];
  updateCartUI();
}

// Update Cart UI
function updateCartUI() {
  const cartContainer = document.getElementById('cart-items');
  const totalContainer = document.getElementById('cart-total');
  
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-msg">No items added to cart</p>';
    totalContainer.innerText = '৳ 0';
    return;
  }

  cartContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>৳ ${item.price} x ${item.qty}</small>
      </div>
      <div class="cart-controls">
        <button class="btn-qty" onclick="updateQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="btn-qty" onclick="updateQty(${item.id}, 1)">+</button>
        <button class="btn-remove" onclick="removeFromCart(${item.id})">✕</button>
      </div>
    `;
    cartContainer.appendChild(itemEl);
  });

  totalContainer.innerText = `৳ ${total}`;
}

// WhatsApp Invoice
function generateInvoice() {
  const phone = document.getElementById('cust-phone').value.trim();
  const name = document.getElementById('cust-name').value.trim() || 'Customer';

  if (!phone) return alert('Please enter WhatsApp number!');
  if (cart.length === 0) return alert('Cart is empty!');

  let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let message = `Hello ${name},\nThanks for shopping!\n\n*Invoice Details:*\n`;
  cart.forEach(item => {
    message += `- ${item.name} x ${item.qty}: ৳${item.price * item.qty}\n`;
  });
  message += `\n*Total Amount: ৳${total}*`;

  let formattedPhone = phone.replace(/^0/, '880');
  window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');

  clearCart();
}

init();