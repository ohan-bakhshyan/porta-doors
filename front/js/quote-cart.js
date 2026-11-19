/**
 * Quote Cart & Lead Capture System ("No Purchase" Workflow)
 */

import { store } from '../../shared/js/store.js';
import { Utils } from '../../shared/js/utils.js';

class QuoteCartUI {
  constructor() {
    this.overlay = null;
    this.drawer = null;
    this.isSubmitting = false;
  }

  init() {
    this.createDrawerDOM();
    this.updateCounterBadges();

    // Listen for storage cart updates
    window.addEventListener('dla-cart-updated', () => {
      this.updateCounterBadges();
      this.renderDrawerItems();
    });

    // Header cart button clicks
    document.querySelectorAll('.quote-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });
  }

  createDrawerDOM() {
    let overlay = document.getElementById('quote-drawer-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'quote-drawer-overlay';
      overlay.className = 'quote-drawer-overlay';
      overlay.innerHTML = `
        <div class="quote-drawer" id="quote-drawer">
          <div class="drawer-header">
            <div class="drawer-title">Quote Request List</div>
            <div class="drawer-close" id="drawer-close-btn">&times;</div>
          </div>
          <div class="drawer-body" id="drawer-body">
            <!-- Items or form will render here -->
          </div>
          <div class="drawer-footer" id="drawer-footer">
            <!-- Action buttons will render here -->
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeDrawer();
      });
      document.getElementById('drawer-close-btn').addEventListener('click', () => this.closeDrawer());
    }

    this.overlay = overlay;
    this.drawer = document.getElementById('quote-drawer');
  }

  openDrawer() {
    this.renderDrawerItems();
    this.overlay.classList.add('active');
    this.drawer.classList.add('active');
  }

  closeDrawer() {
    this.overlay.classList.remove('active');
    this.drawer.classList.remove('active');
  }

  updateCounterBadges() {
    const cart = store.getQuoteCart();
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-counter').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  renderDrawerItems() {
    const cart = store.getQuoteCart();
    const body = document.getElementById('drawer-body');
    const footer = document.getElementById('drawer-footer');
    if (!body || !footer) return;

    if (cart.length === 0) {
      body.innerHTML = `
        <div style="text-align:center; padding:60px 20px; color:#64748b;">
          <svg style="margin:0 auto 16px; width:48px; height:48px; color:#cbd5e1;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          <div style="font-size:16px; font-weight:700; color:#111111; margin-bottom:6px;">Your Quote List is Empty</div>
          <p style="font-size:13px; line-height:1.5;">Explore our modern door catalog and customize finishes to request a formal wholesale quotation.</p>
        </div>
      `;
      footer.innerHTML = `
        <button class="btn-drawer-submit" onclick="window.quoteCartUI.closeDrawer()">Continue Browsing</button>
      `;
      return;
    }

    body.innerHTML = `
      <div style="font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:8px;">
        Selected Door Systems (${cart.length})
      </div>
      ${cart.map(item => `
        <div class="quote-item-card">
          <img src="${item.doorImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}" class="quote-item-img" alt="${item.doorName}">
          <div class="quote-item-details">
            <div class="quote-item-title">${item.doorName}</div>
            <div class="quote-item-specs">
              <div>Finish: <strong>${item.selectedFinish || 'Standard'}</strong></div>
              <div>Size: <strong>${item.selectedSize || 'Standard 80"'}</strong></div>
              <div>Frame: <strong>${item.selectedFrame || 'Concealed Flush'}</strong></div>
            </div>
            <div class="quote-item-qty-row">
              <div class="qty-controls">
                <button class="qty-btn" onclick="window.quoteCartUI.updateQty('${item.id}', ${item.quantity - 1})">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="window.quoteCartUI.updateQty('${item.id}', ${item.quantity + 1})">+</button>
              </div>
              <span class="quote-item-remove" onclick="window.quoteCartUI.removeItem('${item.id}')">Remove</span>
            </div>
          </div>
        </div>
      `).join('')}
    `;

    footer.innerHTML = `
      <button class="btn-drawer-submit" onclick="window.quoteCartUI.showCheckoutStep()">
        Proceed to Request Quote (${cart.reduce((s, i) => s + (i.quantity || 1), 0)} Doors)
      </button>
    `;
  }

  updateQty(itemId, newQty) {
    store.updateQuoteCartQuantity(itemId, newQty);
  }

  removeItem(itemId) {
    store.removeFromQuoteCart(itemId);
  }

  showCheckoutStep() {
    const cart = store.getQuoteCart();
    const body = document.getElementById('drawer-body');
    const footer = document.getElementById('drawer-footer');
    if (!body || !footer) return;

    body.innerHTML = `
      <div style="font-size:12px; font-weight:700; color:var(--color-primary); text-transform:uppercase; margin-bottom:12px;">
        Step 2: Project & Contact Information
      </div>
      <form id="drawer-quote-form" style="display:flex; flex-direction:column; gap:14px;">
        <div>
          <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Full Name *</label>
          <input type="text" id="lead-name" required placeholder="Marcus Vance" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:4px; font-size:13px;">
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Phone Number *</label>
            <input type="tel" id="lead-phone" required placeholder="(310) 555-0192" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:4px; font-size:13px;">
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Email Address *</label>
            <input type="email" id="lead-email" required placeholder="marcus@example.com" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:4px; font-size:13px;">
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Project City / ZIP</label>
            <input type="text" id="lead-city" placeholder="Los Angeles, 90028" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:4px; font-size:13px;">
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">I am a...</label>
            <select id="lead-type" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:4px; font-size:13px; background:#fff;">
              <option value="Homeowner">Homeowner</option>
              <option value="Designer / Architect">Designer / Architect</option>
              <option value="General Contractor">General Contractor</option>
              <option value="Commercial Builder">Commercial Builder</option>
            </select>
          </div>
        </div>

        <div>
          <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Project Notes & Requirements</label>
          <textarea id="lead-notes" rows="3" placeholder="Drywall thickness, special finishes, delivery timeframe, etc." style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:4px; font-size:13px;"></textarea>
        </div>
      </form>
    `;

    footer.innerHTML = `
      <div style="display:flex; gap:10px;">
        <button class="btn-secondary" style="flex:1;" onclick="window.quoteCartUI.renderDrawerItems()">Back</button>
        <button class="btn-drawer-submit" style="flex:2;" onclick="window.quoteCartUI.submitQuoteRequest()">Submit Formal Quote</button>
      </div>
    `;
  }

  submitQuoteRequest() {
    const name = document.getElementById('lead-name')?.value.trim();
    const phone = document.getElementById('lead-phone')?.value.trim();
    const email = document.getElementById('lead-email')?.value.trim();

    if (!name || !phone || !email) {
      Utils.showToast('Please fill in your name, phone, and email.', 'error');
      return;
    }

    const cart = store.getQuoteCart();
    const quotePayload = {
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      projectCity: document.getElementById('lead-city')?.value.trim() || 'Los Angeles, CA',
      projectType: document.getElementById('lead-type')?.value || 'Homeowner',
      notes: document.getElementById('lead-notes')?.value.trim() || '',
      items: cart
    };

    const saved = store.submitQuote(quotePayload);
    store.clearQuoteCart();

    const body = document.getElementById('drawer-body');
    const footer = document.getElementById('drawer-footer');

    body.innerHTML = `
      <div style="text-align:center; padding:48px 20px;">
        <div style="width:56px; height:56px; border-radius:50%; background:#dcfce7; color:#16a34a; font-size:28px; display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">✓</div>
        <div style="font-size:22px; font-weight:800; color:#111111; margin-bottom:8px;">Quote Request Received!</div>
        <div style="display:inline-block; background:#f1f5f9; padding:6px 14px; border-radius:4px; font-size:14px; font-weight:700; color:#0f172a; margin-bottom:16px;">
          Reference #${saved.id}
        </div>
        <p style="font-size:13px; color:#475569; line-height:1.6; margin-bottom:20px;">
          Thank you, <strong>${saved.customerName}</strong>. Our Los Angeles showroom specialists have received your exact door specifications and will prepare your wholesale quotation within 1 business day.
        </p>
        <div style="background:#f8fafc; border:1px solid #e2e4e8; border-radius:6px; padding:14px; text-align:left; font-size:12px; color:#64748b;">
          <div>Showroom Phone: <strong>(424) 426-5566</strong></div>
          <div>Location: <strong>1660 W 139th Street, Gardena, CA 90249</strong></div>
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button class="btn-drawer-submit" onclick="window.quoteCartUI.closeDrawer()">Return to Catalog</button>
    `;

    Utils.showToast(`Quote request #${saved.id} submitted!`);
  }
}

export const quoteCartUI = new QuoteCartUI();
window.quoteCartUI = quoteCartUI;
document.addEventListener('DOMContentLoaded', () => quoteCartUI.init());
