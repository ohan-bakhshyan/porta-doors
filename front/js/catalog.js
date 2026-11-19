/**
 * PORTA Architectural Doors - Catalog View Controller
 */

import { store } from '../../shared/js/store.js';
import { Utils } from '../../shared/js/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  populateFilterDropdowns();
  applyUrlParams();
  renderCatalogDoors();
  updateSpecCounter();
  renderSpecDrawer();

  // Attach filter event listeners
  document.getElementById('cat-search')?.addEventListener('input', () => renderCatalogDoors());
  document.getElementById('cat-filter-brand')?.addEventListener('change', () => renderCatalogDoors());
  document.getElementById('cat-filter-category')?.addEventListener('change', () => renderCatalogDoors());
  document.getElementById('cat-filter-system')?.addEventListener('change', () => renderCatalogDoors());
  document.getElementById('cat-filter-tag')?.addEventListener('change', () => renderCatalogDoors());

  window.addEventListener('porta-store-updated', () => {
    renderCatalogDoors();
  });
  window.addEventListener('porta-spec-list-updated', () => {
    updateSpecCounter();
    renderSpecDrawer();
  });
});

function populateFilterDropdowns() {
  const brandSelect = document.getElementById('cat-filter-brand');
  const catSelect = document.getElementById('cat-filter-category');
  const sysSelect = document.getElementById('cat-filter-system');

  if (brandSelect) {
    brandSelect.innerHTML = '<option value="all">All Brands</option>' +
      store.getBrands().map(b => `<option value="${b.id}">${b.name}</option>`).join('');
  }

  if (catSelect) {
    catSelect.innerHTML = '<option value="all">All Categories</option>' +
      store.getCategories().map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  if (sysSelect) {
    sysSelect.innerHTML = '<option value="all">All 8 Systems</option>' +
      store.getMechanicalSystems().map(s => `<option value="${s.id}">${s.code} — ${s.name}</option>`).join('');
  }
}

function applyUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const catSlug = params.get('category');
  const brandSlug = params.get('brand');
  const systemId = params.get('system');
  const tag = params.get('tag');

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
  if (tag) {
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
  if (!grid) return;

  const search = document.getElementById('cat-search')?.value.trim() || '';
  const brandId = document.getElementById('cat-filter-brand')?.value || 'all';
  const categoryId = document.getElementById('cat-filter-category')?.value || 'all';
  const systemId = document.getElementById('cat-filter-system')?.value || 'all';
  const tag = document.getElementById('cat-filter-tag')?.value || 'all';

  const doors = store.getDoors({
    isActive: true,
    search,
    brandId,
    categoryId,
    systemId,
    tag
  });

  if (doors.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full p-16 text-center bg-surface-container-low text-secondary font-label-sm text-xs uppercase tracking-widest">
        No architectural doors found matching current specification filters.
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
      <article class="group bg-surface-container-lowest flex flex-col shadow-sm hover:shadow-md transition-all border border-surface-container">
        <div class="relative aspect-[3/4] overflow-hidden bg-surface-container">
          <img class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" 
               src="${primaryImg}" 
               alt="${Utils.escapeHtml(door.name)}"/>
          
          <div class="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm text-primary font-label-sm text-[9px] uppercase tracking-wider px-2.5 py-1">
            ${system ? Utils.escapeHtml(system.name) : 'Flush System'}
          </div>

          ${priceInfo.hasDiscount ? `
            <div class="absolute top-3 right-3 bg-[#ba1a1a] text-on-primary font-label-sm text-[9px] uppercase tracking-wider px-2 py-1">
              Spec Incentive -${priceInfo.discountPercent}%
            </div>
          ` : ''}
        </div>

        <div class="p-5 flex flex-col justify-between flex-grow">
          <div>
            <div class="flex items-center justify-between text-secondary font-label-sm text-[9px] uppercase tracking-widest mb-1">
              <span>${Utils.escapeHtml(door.sku)}</span>
              <span>
                ${brand ? `<a href="brand.html?slug=${brand.slug}" class="hover:underline">${Utils.escapeHtml(brand.name)}</a>` : 'PORTA'}
              </span>
            </div>

            <h3 class="font-headline-md text-base uppercase text-primary tracking-tight mt-1">
              ${Utils.escapeHtml(door.name)}
            </h3>

            <p class="font-body-sm text-xs text-on-surface-variant mt-2 line-clamp-2">
              ${Utils.escapeHtml(door.shortDescription || 'Flush concealed door leaf with sub-millimeter perimeter shadow line.')}
            </p>

            <div class="mt-4 pt-3 border-t border-surface-container flex items-baseline justify-between">
              <div>
                <span class="font-label-md text-xs uppercase text-primary font-bold">
                  ${Utils.formatCurrency(priceInfo.effectivePrice)}
                </span>
                ${priceInfo.hasDiscount ? `
                  <span class="font-label-sm text-[10px] text-secondary line-through ml-1">
                    ${Utils.formatCurrency(priceInfo.basePrice)}
                  </span>
                ` : ''}
              </div>
              <span class="font-label-sm text-[9px] text-secondary uppercase">${door.specs?.acoustic || '38-42dB'}</span>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-surface-container">
            <button class="w-full bg-primary text-on-primary font-label-md text-[10px] uppercase tracking-widest py-2.5 hover:bg-surface-container-high hover:text-primary transition-colors flex items-center justify-center gap-1" onclick="addToSpec('${door.id}')">
              <span>+ Add to Spec List</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/* Spec List Drawer Logic */
window.addToSpec = function(doorId) {
  const door = store.getDoorById(doorId);
  if (!door) return;

  store.addToSpecList(doorId);
  triggerToast(`Added to Spec List: ${door.name}`);
  toggleSpecDrawer(true);
};

window.toggleSpecDrawer = function(open) {
  const drawer = document.getElementById('spec-drawer');
  const backdrop = document.getElementById('drawer-backdrop');

  if (open) {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
};

function updateSpecCounter() {
  const list = store.getSpecList();
  const totalCount = list.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const counter = document.getElementById('spec-list-counter');
  if (counter) {
    counter.textContent = `[ ${totalCount} ]`;
  }
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
      <div class="h-64 flex flex-col items-center justify-center text-center p-6 text-secondary">
        <span class="material-symbols-outlined text-4xl mb-2 text-surface-container-high">door_sliding</span>
        <div class="font-label-sm text-xs uppercase tracking-widest text-primary font-medium">Specification Schedule Empty</div>
        <p class="font-body-sm text-xs mt-1">Select architectural doors from the catalog to assemble your project schedule.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="p-4 bg-surface-low border border-surface-container flex gap-3 items-start justify-between">
      <img src="${item.primaryImage}" class="w-14 h-18 object-cover bg-surface-container" alt="${Utils.escapeHtml(item.name)}"/>
      
      <div class="flex-1">
        <div class="flex items-baseline justify-between">
          <h4 class="font-headline-md text-xs uppercase text-primary">${Utils.escapeHtml(item.name)}</h4>
          <span class="font-mono text-xs font-semibold">${Utils.formatCurrency(item.effectivePrice * item.quantity)}</span>
        </div>
        <div class="font-label-sm text-[10px] uppercase text-secondary">
          <span>${item.sku}</span> • <span>${item.brandName}</span>
        </div>

        <div class="flex items-center gap-2 mt-3">
          <button class="w-6 h-6 border border-surface-container bg-surface-lowest text-xs flex items-center justify-center hover:bg-surface-high" onclick="updateSpecQty('${item.id}', ${item.quantity - 1})">-</button>
          <span class="font-mono text-xs font-bold w-6 text-center">${item.quantity}</span>
          <button class="w-6 h-6 border border-surface-container bg-surface-lowest text-xs flex items-center justify-center hover:bg-surface-high" onclick="updateSpecQty('${item.id}', ${item.quantity + 1})">+</button>
          <button class="ml-auto text-[10px] uppercase font-label-sm tracking-wider text-secondary hover:text-primary" onclick="removeSpecItem('${item.id}')">Remove</button>
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
  toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
  }, 3200);
}
