/**
 * DOORS GALLERY — Compact Full-HD & Mobile Catalog Controller
 */

import { store } from '../../shared/js/store.js';
import { Utils } from '../../shared/js/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  syncBranding();
  populateFilterDropdowns();
  applyUrlParams();
  renderCatalogDoors();
  updateSpecCounter();
  renderSpecDrawer();

  document.getElementById('cat-search')?.addEventListener('input', () => renderCatalogDoors());
  document.getElementById('cat-filter-brand')?.addEventListener('change', () => renderCatalogDoors());
  document.getElementById('cat-filter-category')?.addEventListener('change', () => renderCatalogDoors());
  document.getElementById('cat-filter-system')?.addEventListener('change', () => renderCatalogDoors());
  document.getElementById('cat-filter-tag')?.addEventListener('change', () => renderCatalogDoors());

  window.addEventListener('porta-store-updated', () => {
    syncBranding();
    renderCatalogDoors();
  });
  window.addEventListener('porta-spec-list-updated', () => {
    updateSpecCounter();
    renderSpecDrawer();
  });
});

window.toggleMobileMenu = function(forceState) {
  const drawer = document.getElementById('mobile-nav-drawer');
  const icon = document.getElementById('mobile-menu-icon');
  if (!drawer) return;
  const shouldOpen = forceState !== undefined ? forceState : drawer.classList.contains('hidden');
  drawer.classList.toggle('hidden', !shouldOpen);
  if (icon) icon.textContent = shouldOpen ? 'close' : 'menu';
};

function syncBranding() {
  const settings = store.getSettings();
  const logoImg = document.getElementById('header-logo-img');
  if (logoImg && settings.logoUrl) logoImg.src = settings.logoUrl;
  const brandTitle = document.getElementById('header-brand-title');
  if (brandTitle && settings.companyName) brandTitle.textContent = settings.companyName;
}

function populateFilterDropdowns() {
  const brandSelect = document.getElementById('cat-filter-brand');
  const catSelect = document.getElementById('cat-filter-category');
  const sysSelect = document.getElementById('cat-filter-system');

  if (brandSelect) {
    brandSelect.innerHTML = '<option value="all">All Brands</option>' +
      store.getBrands().filter(b => b.isActive !== false).map(b => `<option value="${b.id}">${Utils.escapeHtml(b.name)}</option>`).join('');
  }
  if (catSelect) {
    catSelect.innerHTML = '<option value="all">All Categories</option>' +
      store.getCategories().filter(c => c.isActive !== false).map(c => `<option value="${c.id}">${Utils.escapeHtml(c.name)}</option>`).join('');
  }
  if (sysSelect) {
    sysSelect.innerHTML = '<option value="all">All 8 Systems</option>' +
      store.getMechanicalSystems().map(s => `<option value="${s.id}">${Utils.escapeHtml(s.code)} — ${Utils.escapeHtml(s.name)}</option>`).join('');
  }
}

function applyUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const catSlug = params.get('category');
  const brandSlug = params.get('brand');
  const systemId = params.get('system');
  const tag = params.get('tag');
  const promo = params.get('promo');

  if (catSlug) {
    const cat = store.getCategoryBySlug(catSlug);
    if (cat) document.getElementById('cat-filter-category').value = cat.id;
  }
  if (brandSlug) {
    const brand = store.getBrandBySlug(brandSlug);
    if (brand) document.getElementById('cat-filter-brand').value = brand.id;
  }
  if (systemId) {
    document.getElementById('cat-filter-system').value = systemId;
  }
  if (promo === 'active') {
    document.getElementById('cat-filter-tag').value = 'promo';
  } else if (tag) {
    document.getElementById('cat-filter-tag').value = tag;
  }
}

window.resetCatalogFilters = function() {
  document.getElementById('cat-search').value = '';
  document.getElementById('cat-filter-brand').value = 'all';
  document.getElementById('cat-filter-category').value = 'all';
  document.getElementById('cat-filter-system').value = 'all';
  document.getElementById('cat-filter-tag').value = 'all';
  renderCatalogDoors();
};

function renderCatalogDoors() {
  const grid = document.getElementById('catalog-grid');
  const countEl = document.getElementById('catalog-results-count');
  if (!grid) return;

  const search = document.getElementById('cat-search')?.value.trim() || '';
  const brandId = document.getElementById('cat-filter-brand')?.value || 'all';
  const categoryId = document.getElementById('cat-filter-category')?.value || 'all';
  const systemId = document.getElementById('cat-filter-system')?.value || 'all';
  const tagVal = document.getElementById('cat-filter-tag')?.value || 'all';

  let doors = store.getDoors({
    isActive: true,
    search,
    brandId,
    categoryId,
    systemId,
    tag: (tagVal !== 'all' && tagVal !== 'promo') ? tagVal : 'all'
  });

  if (tagVal === 'promo') {
    doors = doors.filter(d => store.calculateEffectivePrice(d).hasDiscount);
  }

  if (countEl) countEl.textContent = `${doors.length} Model${doors.length === 1 ? '' : 's'}`;

  if (doors.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full p-12 text-center bg-surface-low border border-hairline text-secondary font-label text-xs uppercase tracking-wider">
        No door models match the selected filters.
      </div>
    `;
    return;
  }

  grid.innerHTML = doors.map(door => {
    const brand = store.getBrandById(door.brandId);
    const system = store.getMechanicalSystemById(door.mechanicalSystemId);
    const priceInfo = store.calculateEffectivePrice(door);

    const primaryImg = (door.images || []).find(i => i.isPrimary)?.url ||
                       door.images?.[0]?.url ||
                       Utils.getArchitecturalPlaceholderSvg();

    return `
      <article class="group bg-white border border-hairline hover:border-gold/70 transition-all flex flex-col shadow-xs">
        <div class="relative aspect-[4/4.5] overflow-hidden bg-surface-container">
          <img src="${primaryImg}" alt="${Utils.escapeHtml(door.name)}" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"/>
          <span class="absolute top-2.5 left-2.5 bg-white/95 text-ink border-l-2 border-gold font-label text-[9px] uppercase tracking-wider px-2 py-0.5">
            ${system ? Utils.escapeHtml(system.name) : 'Flush System'}
          </span>
          ${priceInfo.hasDiscount ? `
            <span class="absolute top-2.5 right-2.5 bg-gold-tint text-gold-dark border border-gold/50 font-label text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5">
              -${priceInfo.discountPercent}% Offer
            </span>
          ` : ''}
        </div>

        <div class="p-3.5 flex flex-col justify-between flex-grow">
          <div>
            <div class="flex items-center justify-between text-[10px] font-label uppercase tracking-wider text-secondary mb-1">
              <span>${Utils.escapeHtml(door.sku)}</span>
              ${brand ? `<a href="brand.html?slug=${encodeURIComponent(brand.slug)}" class="hover:text-gold-dark hover:underline truncate max-w-[130px]">${Utils.escapeHtml(brand.name)}</a>` : '<span>Doors Gallery</span>'}
            </div>

            <h3 class="font-headline text-sm font-medium uppercase text-ink tracking-tight leading-snug">
              ${Utils.escapeHtml(door.name)}
            </h3>

            <p class="text-[11px] text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
              ${Utils.escapeHtml(door.shortDescription || 'Flush concealed door leaf with silent magnetic latch.')}
            </p>
          </div>

          <div class="mt-3 pt-2.5 border-t border-hairline flex items-center justify-between gap-2">
            <div>
              <span class="font-headline text-sm font-semibold text-gold-dark">
                ${Utils.formatCurrency(priceInfo.effectivePrice)}
              </span>
              ${priceInfo.hasDiscount ? `
                <span class="text-[10px] text-secondary line-through ml-1">
                  ${Utils.formatCurrency(priceInfo.basePrice)}
                </span>
              ` : ''}
            </div>

            <button onclick="addToSpec('${door.id}')" class="border border-gold bg-white text-ink hover:bg-ink hover:text-gold-light font-label text-[10px] font-medium uppercase tracking-wider px-2.5 py-1.5 transition-colors shrink-0">
              + Spec List
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/* Spec List Drawer */
window.addToSpec = function(doorId) {
  const door = store.getDoorById(doorId);
  if (!door) return;
  store.addToSpecList(doorId);
  triggerToast(`Added: ${door.name}`);
  toggleSpecDrawer(true);
};

window.toggleSpecDrawer = function(open) {
  const drawer = document.getElementById('spec-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!drawer || !backdrop) return;
  drawer.classList.toggle('open', open);
  backdrop.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};

function updateSpecCounter() {
  const list = store.getSpecList();
  const totalCount = list.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const counter = document.getElementById('spec-list-counter');
  if (counter) counter.textContent = `[${totalCount}]`;
}

function renderSpecDrawer() {
  const list = store.getSpecList();
  const container = document.getElementById('drawer-items-container');
  const countLabel = document.getElementById('drawer-item-count');
  const totalVal = document.getElementById('drawer-total-val');
  if (!container) return;

  const totalQuantity = list.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = list.reduce((sum, i) => sum + (i.effectivePrice * i.quantity), 0);

  if (countLabel) countLabel.textContent = `${totalQuantity} opening(s) across ${list.length} model(s)`;
  if (totalVal) totalVal.textContent = Utils.formatCurrency(totalAmount);

  if (list.length === 0) {
    container.innerHTML = `
      <div class="h-52 flex flex-col items-center justify-center text-center p-4 text-secondary">
        <span class="material-symbols-outlined text-3xl mb-1.5 text-gold">door_front</span>
        <div class="font-label text-xs uppercase tracking-wider text-ink font-medium">Spec List Empty</div>
        <p class="text-xs mt-1">Select doors from the catalog to build your schedule.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="p-3 bg-surface-low border border-hairline flex gap-3 items-start justify-between">
      <img src="${item.primaryImage}" class="w-12 h-16 object-cover bg-surface-container shrink-0" alt="${Utils.escapeHtml(item.name)}"/>
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline justify-between gap-2">
          <h4 class="font-headline text-xs font-medium uppercase text-ink truncate">${Utils.escapeHtml(item.name)}</h4>
          <span class="font-headline text-xs font-semibold text-gold-dark shrink-0">${Utils.formatCurrency(item.effectivePrice * item.quantity)}</span>
        </div>
        <div class="font-label text-[10px] uppercase text-secondary">${Utils.escapeHtml(item.sku)} • ${Utils.escapeHtml(item.brandName)}</div>
        <div class="flex items-center gap-1.5 mt-2">
          <button class="w-6 h-6 border border-hairline bg-white text-xs flex items-center justify-center hover:border-gold" onclick="updateSpecQty('${item.id}', ${item.quantity - 1})">-</button>
          <span class="font-mono text-xs font-semibold w-5 text-center">${item.quantity}</span>
          <button class="w-6 h-6 border border-hairline bg-white text-xs flex items-center justify-center hover:border-gold" onclick="updateSpecQty('${item.id}', ${item.quantity + 1})">+</button>
          <button class="ml-auto text-[10px] uppercase font-label tracking-wider text-secondary hover:text-ink" onclick="removeSpecItem('${item.id}')">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

window.updateSpecQty = function(itemId, qty) {
  store.updateSpecListQuantity(itemId, qty);
};

window.removeSpecItem = function(itemId) {
  store.removeFromSpecList(itemId);
};

function triggerToast(message) {
  const toast = document.getElementById('spec-toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
  }, 3000);
}
